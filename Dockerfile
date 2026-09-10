# NOTE: no `syntax=` directive on purpose — pulling the remote dockerfile
# frontend from a registry stalls when registry mirrors are unreachable; the
# built-in frontend supports everything this file uses.

# Base image pinned to a locally cached digest: the floating node:24-slim tag was
# re-published upstream, and re-pulling the new layers from Docker Hub stalls on
# restricted networks. Bump the digest deliberately when updating the base image.
ARG NODE_IMAGE=node:24-slim@sha256:ba849c60be29959425b8734d57b8b4b7d56f98edd9504c9af091d5281095a71e

# Build-time npm registry mirror. NJU (mirrors.nju.edu.cn) does not mirror the
# npm registry (verified 404), so npmmirror is used; override with --build-arg
# if another registry is preferred.
ARG NPM_REGISTRY=https://registry.npmmirror.com

# ---------- Stage 1: build frontend ----------
FROM ${NODE_IMAGE} AS webbuild
ARG NPM_REGISTRY
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY}
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web/ ./
# Footer reads the app version from the root package.json at build time
COPY package.json /app/package.json
RUN npm run build

# ---------- Stage 2: install backend production deps (pure JS, no native build) ----------
FROM ${NODE_IMAGE} AS serverdeps
ARG NPM_REGISTRY
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY}
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --omit=dev

# ---------- Stage 3: runtime ----------
FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080 \
    HOST=0.0.0.0 \
    DATA_DIR=/app/data
RUN mkdir -p /app/data
COPY --from=serverdeps /app/server/node_modules ./server/node_modules
COPY server/ ./server/
COPY --from=webbuild /app/web/dist ./web/dist
COPY package.json ./
EXPOSE 8080
# node:sqlite is used for storage (zero native dependencies)
CMD ["node", "--disable-warning=ExperimentalWarning", "server/src/index.js"]
