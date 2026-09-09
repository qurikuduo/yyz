# 架构 · ARCHITECTURE

## 总览
单一 Docker 镜像：Express 后端同时提供 REST API 与托管 React 前端静态资源（`web/dist`）。SQLite 落盘于挂载卷，重启不丢数据。

```
浏览器 ──HTTP──> Express (:8080)
                   ├── /api/*        REST API（量表、测评、知识库）
                   └── /*            静态前端（SPA fallback 到 index.html）
                          │
                          └── node:sqlite ──> /app/data/app.db（容器卷）
```

## 目录结构
```
/ (repo root)
├── Dockerfile              多阶段：构建前端 → 装后端生产依赖 → node:24-slim 运行
├── docker-compose.yml      单服务 app，端口 8080，卷 ./data:/app/data
├── package.json            根脚本（install:all / dev:* / build / start）
├── docs/                   USAGE / SCALES / ARCHITECTURE / DISCLAIMER / DEPLOYMENT
├── server/                 Express 后端（ESM JavaScript）
│   ├── src/
│   │   ├── index.js        启动入口
│   │   ├── app.js          Express 应用装配（中间件、路由、静态托管）
│   │   ├── config.js       端口/路径/DB 配置（环境变量可覆盖）
│   │   ├── db.js           node:sqlite 建表与迁移（M1）
│   │   ├── routes/         scales / assessments / knowledge
│   │   ├── services/       scoring / comprehensive / explanations / token
│   │   └── data/scales/    各量表双语题库 + 逐题解释
│   ├── knowledge-assets/   随镜像打包的可下载自助资料
│   └── data/               本地开发 SQLite（容器内为 /app/data）
└── web/                    React + Vite + TypeScript 前端
    └── src/
        ├── i18n/           双语词典
        ├── api/            后端客户端
        ├── pages/          Home / Intake / Assessment / Result / SharedResult / Knowledge
        └── components/     答题卡、进度条、严重度仪表、危机横幅、语言切换
```

## 关键设计
- **无原生依赖的密码哈希**：使用 Node `crypto.scrypt` 哈希分享密码，避免额外原生模块。
- **不可枚举 token**：`crypto.randomBytes` 生成 URL-safe 分享令牌。
- **量表数据驱动**：每个量表为独立数据模块（题目、选项、计分、切点、逐题解释、双语），scoring 引擎按量表类型分发。
- **综合诊断**：独立 service 聚合多量表结果。
- **危机流程**：任一自杀意念题阳性 → 结果强制危机横幅，独立于总分。
- **双语**：前端 i18n 词典 + 后端题目双语字段；语言偏好持久化。

## 数据模型（M1 起）
- `assessments`：id, token, password_hash, scheme, language, intake_json, answers_json, scores_json, comprehensive_json, created_at
- `knowledge_resources`：建表保留，但当前知识库采用**静态注册表**（`server/src/data/knowledge.js`）而非数据库表，便于随镜像版本化与审查。

## 环境变量
| 变量 | 默认 | 说明 |
|---|---|---|
| PORT | 8080 | 监听端口 |
| HOST | 0.0.0.0 | 监听地址 |
| DATA_DIR | server/data | SQLite 目录（容器内 /app/data） |
| DB_FILE | $DATA_DIR/app.db | 数据库文件 |
| WEB_DIST | web/dist | 前端静态资源目录 |
| KNOWLEDGE_ASSETS | server/knowledge-assets | 可下载资料目录 |
