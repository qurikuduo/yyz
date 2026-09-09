# 抑郁自测 · Depression Self-Assessment

> 循证抑郁自评 Web 应用 · Evidence-based depression self-assessment web app
> 支持 PHQ-9 / PHQ-2、SDS(Zung)、CES-D、BDI-II、DSM-5 MDD，并可做综合评估。
> Bilingual (中文 / English). 结果可通过密码保护的唯一 URL 分享。数据存于 SQLite（容器卷）。

## ⚠️ 重要声明 · Disclaimer

本工具为**筛查/自评**用途，**不构成临床诊断**，不能替代专业医疗评估。
若你或他人有自伤、自杀念头，请**立即**联系当地急救或心理危机热线。

This is a **screening / self-report** tool and **not a clinical diagnosis**; it does not
replace professional evaluation. If you or someone else is at risk of self-harm or suicide,
contact local emergency services or a crisis line **immediately**.

危机资源示例 · Example crisis resources:
- 中国大陆：全国心理援助热线 `12356`；北京心理危机研究与干预中心 `010-82951332`
- 美国/加拿大：`988` Suicide & Crisis Lifeline
- 国际：https://findahelpline.com

## 功能 · Features

- 多权威量表独立成流程：PHQ-2、PHQ-9、SDS、CES-D、BDI-II、DSM-5 MDD
- 综合评估：跨量表整合严重度 + 一致性分析 + DSM-5 映射
- MBTI 式答题：录入个人信息 → 逐题作答 → 结果
- 结果含**逐题解释**与**用户答案解析**，并给出评判依据
- 每次测评生成**唯一 URL**，需**用户自设密码**方可查看（隐私保护）
- **知识库**：权威自助资料，可在线浏览与下载
- 中英双语全站切换

## 技术栈 · Stack

- 前端 Frontend：React 18 + Vite 5 + TypeScript + react-router
- 后端 Backend：Node.js 24 + Express 4 + `node:sqlite`（内置，无原生依赖）
- 交付 Delivery：单一 Docker 镜像（Express 同时托管 API 与前端静态资源）+ docker-compose

## 快速开始（Docker）· Quick start (Docker)

```bash
docker compose up --build
# 打开 http://localhost:8080
```

SQLite 数据持久化在宿主机 `./data/` 目录（容器内 `/app/data`）。

## 本地开发 · Local development

```bash
npm run install:all      # 安装 server 与 web 依赖
npm run dev:server       # 后端 http://localhost:8080
npm run dev:web          # 前端 http://localhost:5173（已配置 /api 代理）
```

生产构建并本地运行：

```bash
npm run build            # 构建前端到 web/dist
npm start                # Express 托管 API + 前端，http://localhost:8080
```

## 文档 · Docs

- [使用说明 USAGE](docs/USAGE.md)
- [量表科学依据与切点 SCALES](docs/SCALES.md)
- [架构 ARCHITECTURE](docs/ARCHITECTURE.md)
- [免责与版权 DISCLAIMER](docs/DISCLAIMER.md)
- [部署 DEPLOYMENT](docs/DEPLOYMENT.md)

## 许可与版权 · License & copyright

- PHQ-9 / PHQ-2：公有领域（public domain）。
- SDS(Zung)、CES-D：广泛使用，按文献标准版本实现。
- **BDI-II**：题目与量表由 **Pearson** 持有版权；本项目完整内置仅供**个人/教育**用途，请勿商业分发。
- 其余自著内容见各文档。

## 开发里程碑 · Milestones

- [x] M0 脚手架（git、目录、最小可运行全栈、Docker 骨架）
- [x] M1 后端核心（DB + PHQ-9 + API + token/密码）
- [x] M2 前端核心（Home/Intake/Assessment/Result）
- [x] M3 全量表 + 综合诊断
- [x] M4 分享 URL + 密码查看 + 持久化 + 危机流程
- [x] M5 知识库与可下载资料
- [ ] M6 交付打磨（镜像 + compose + 文档 + 端到端验证）
