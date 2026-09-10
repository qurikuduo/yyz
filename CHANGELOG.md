# 更新日志 · Changelog

本项目的所有重要变更记录于此。版本遵循语义化版本（SemVer）。
All notable changes to this project are documented here. Versions follow SemVer.

## [v1.3.0] — 2026-09-10

### 新增 · Added
- **默认 Logo 与 Favicon**：全新品牌标志（深绿圆角方块 + 白色心形 + 升起的太阳，寓意关怀与希望），用于浏览器标签页图标（SVG + PNG 回退 + Apple touch icon）与全站页头。
  New brand logo and favicon (green rounded square, white heart, rising sun) used across the browser tab (SVG + PNG fallback + Apple touch icon) and the app header.
- `theme-color` 元信息：移动端浏览器地址栏随品牌色。
  `theme-color` meta so mobile browser chrome matches the brand color.

### 变更 · Changed
- 页头品牌区布局调整：logo 图标 + 标题/副标题两栏排布。
  Header brand layout: logo icon beside the title/subtitle column.

## [v1.2.0] — 2026-09-10

### 新增 · Added
- **CI/CD（GitHub Actions）**：
  - `ci.yml`：push 到 master / PR 时自动编译前端（含 TS 类型检查）、构建 Docker 镜像并做容器冒烟测试。
    CI workflow: frontend build (typecheck), Docker image build, container smoke test.
  - `release.yml`：推送 `v*` 标签时自动构建镜像并推送到 GHCR（`latest` / `主.次` / 完整版本号标签），并从 CHANGELOG 提取说明创建 GitHub Release。
    Release workflow: on `v*` tags, build and push the image to GHCR and create a GitHub Release with notes extracted from the changelog.
- `docker-compose.prebuilt.yml`：直接使用 GHCR 预构建镜像部署，无需本地构建。
  Prebuilt-image compose file that deploys straight from GHCR without a local build.

## [v1.1.0] — 2026-09-10

### 新增 · Added
- 全站页脚新增**源码入口**：GitHub 图标链接（新窗口打开）指向 [qurikuduo/yyz](https://github.com/qurikuduo/yyz)。
  Footer source attribution: a GitHub icon link (opens in a new tab) to the repository.
- 页脚显示**版本号**：显示当前构建版本（构建时从根 `package.json` 注入），并自动查询 GitHub 上的最新发布 tag；若存在更新版本则提示"最新版本 vX.Y.Z 可用"。GitHub 不可达或仓库暂无 tag 时静默回退，仅显示本地版本。
  Footer version display: the current build version (injected from the root `package.json` at build time), plus an automatic check of the latest GitHub tag; shows "vX.Y.Z available" when a newer release exists. Falls back silently to the local version when GitHub is unreachable or no tags exist.

### 变更 · Changed
- git remote 指向 `https://github.com/qurikuduo/yyz`。
  git remote set to the GitHub repository.

### 文档 · Docs
- 新增本更新日志，并在 README 中加入口。
  Added this changelog, linked from README.

## [v1.0.0] — 2026-09-10

### 首个完整交付 · First complete release

- **六个权威量表独立测评流程**：PHQ-2、PHQ-9、SDS(Zung)、CES-D、BDI-II（含版权声明）、DSM-5 MDD 模块；量表切点采用文献标准值。
  Six authoritative scales as separate flows: PHQ-2, PHQ-9, SDS (Zung), CES-D, BDI-II (with copyright notice), and the DSM-5 MDD module, using literature-standard cutoffs.
- **综合评估**：多量表整合严重度（按信度加权归一化）+ 跨量表一致性分析 + DSM-5 标准映射 + 整合叙述与依据。
  Comprehensive assessment: reliability-weighted integrated severity, cross-scale concordance, DSM-5 mapping, with narrative and basis.
- **MBTI 式答题流程**：个人信息录入（年龄/性别/病程/治疗史/教育/职业）→ 逐题作答（可回退、进度条、双语）→ 结果。
  MBTI-style flow: intake (age/gender/duration/treatment history/education/occupation) → one-question-at-a-time with back navigation and progress bar → result.
- **结果页**：总分/标准分、严重度带与可视化、逐题解释（测量维度/DSM 映射）、答案解析（选项含义/得分贡献）、结合个人信息的个性化建议与评判依据。
  Results: totals and derived scores, severity bands, per-item explanations and answer analysis, personalized advice and the basis for each judgement.
- **唯一分享 URL + 密码**：不可枚举 token（`crypto.randomBytes`）+ 用户自设密码（scrypt 哈希）；新会话凭链接+密码查看。
  Unique shareable URL (non-enumerable token) + user-set password (scrypt-hashed); viewable from any session with link + password.
- **危机干预流程**：任一自杀意念条目为阳性 → 结果页强制危机横幅与中外热线资源（独立于总分触发）。
  Crisis flow: any positive suicidal-ideation item forces a crisis banner with hotlines, regardless of total score.
- **持久化**：SQLite（`node:sqlite`）落盘于挂载卷，容器重启不丢数据。
  Persistence: SQLite on a mounted volume survives container restarts.
- **知识库**：5 份双语可下载自助资料（自助导引、行为激活日程表、CBT 思维记录表、情绪与睡眠日记、危机资源卡）+ WHO / NIMH / NHS / MSD / Mayo Clinic / findahelpline 权威外链。
  Knowledge base: five bilingual downloadable self-help worksheets plus authoritative external links.
- **交付**：单一 Docker 镜像（Express 同时托管 API 与前端）+ docker-compose（健康检查、卷挂载）+ 完整双语文档（USAGE / SCALES / ARCHITECTURE / DISCLAIMER / DEPLOYMENT）。
  Delivery: single Docker image (Express serves API + frontend), docker-compose with healthcheck and volume, full bilingual docs.

---

[v1.3.0]: https://github.com/qurikuduo/yyz/releases/tag/v1.3.0
[v1.2.0]: https://github.com/qurikuduo/yyz/releases/tag/v1.2.0
[v1.1.0]: https://github.com/qurikuduo/yyz/releases/tag/v1.1.0
[v1.0.0]: https://github.com/qurikuduo/yyz/releases/tag/v1.0.0
