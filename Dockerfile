# syntax=docker/dockerfile:1

# ---------- Stage 1: build frontend ----------
FROM node:24-slim AS webbuild
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web/ ./
RUN npm run build

# ---------- Stage 2: install backend production deps (pure JS, no native build) ----------
FROM node:24-slim AS serverdeps
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --omit=dev

# ---------- Stage 3: runtime ----------
FROM node:24-slim AS runtime
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
