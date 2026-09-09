# 部署 · DEPLOYMENT

## 前置条件
- Docker 20.10+ 与 Docker Compose v2
- 开放访问 `http://localhost:8080`（或自定义端口）

## 使用 docker compose 部署（推荐）
```bash
# 在仓库根目录
docker compose up --build -d
```
- 服务名：`app`
- 镜像：`depression-selftest:latest`
- 端口：`8080:8080`
- 数据卷：宿主机 `./data` → 容器 `/app/data`（SQLite 持久化）

查看日志 / 状态：
```bash
docker compose logs -f app
docker compose ps
```

停止 / 重启：
```bash
docker compose down          # 停止并移除容器（数据保留在 ./data）
docker compose restart app
```

## 单独构建与运行镜像
```bash
docker build -t depression-selftest:latest .
docker run -d --name dst \
  -p 8080:8080 \
  -v "$(pwd)/data:/app/data" \
  -e PORT=8080 -e DATA_DIR=/app/data \
  depression-selftest:latest
```

## 自定义配置（环境变量）
| 变量 | 默认 | 说明 |
|---|---|---|
| PORT | 8080 | 监听端口 |
| HOST | 0.0.0.0 | 监听地址 |
| DATA_DIR | /app/data（容器） | SQLite 目录，务必挂载卷以持久化 |
| DB_FILE | $DATA_DIR/app.db | 数据库文件路径 |
| KNOWLEDGE_ASSETS | $SERVER_ROOT/knowledge-assets | 可下载自助资料目录（随镜像打包，一般无需修改） |

修改端口示例（compose）：
```yaml
    ports:
      - "9090:8080"
```

## 数据备份与迁移
- 备份：复制宿主机 `./data/app.db`（停止容器后复制更安全）。
- 迁移：将 `./data` 目录一并迁移到新主机即可保留所有测评记录。

## 健康检查
容器内置 healthcheck 访问 `/api/health`。也可手动：
```bash
curl http://localhost:8080/api/health
```

## 生产注意事项
- 本应用默认 HTTP 明文。若公网部署，请在反向代理（Nginx/Caddy/Traefik）后启用 HTTPS。
- 分享 URL 的隐私依赖用户自设密码；建议提醒用户设置强密码。
- BDI-II 版权限制见 `docs/DISCLAIMER.md`，商业部署前务必取得授权或移除该量表。
