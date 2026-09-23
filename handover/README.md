# Marketing Hub Storybook 交接与状态

规则与长期规划见仓库根目录 `AGENTS.md`。本文件只记录状态，按 `AGENTS.md` 第 7 节的固定结构维护。

## 1. 当前状态

| 项 | 值 |
|---|---|
| 设计系统位置 | `src/design` |
| Storybook | 本次安装锁定版本 8.6.18，`@storybook/react-vite` |
| 故事数 | 38（Foundations 1、Atoms 6、Molecules 14、Organisms 12、Pages 5） |
| 测试 | `npm test`（vitest@4.1.11 + @testing-library/react@16.3.3 + jsdom），9 条行为测试通过（2026-09-23） |
| 构建验证 | 通过（2026-09-23，`npm run build-storybook -- --disable-telemetry`，38 stories、0 docs） |
| 最近视觉对照 | 2026-09-23，1440px，Interpreter 全部 8 类型 + overview + 未知类型态 vs 原始页；产物 `/tmp/mh-visual/*.png`（Playwright chromium 截图，`shoot.mjs`/`shoot2.mjs` 一次性脚本） |
| 原始 Demo 参照 | `index.html`、`assets/pages/*.html`，`npm run preview:html` 于 127.0.0.1:4173 |

启动：

```bash
npm install
npm run preview:html   # 127.0.0.1:4173，原始 HTML 参照
npm run storybook      # 127.0.0.1:6006
npm test               # vitest 行为测试
```

## 2. 阶段进度表

| 阶段 | 条目 | 状态 | PR |
|---|---|---|---|
| A | Home 助手面板对齐当前渲染的右侧抽屉（2.4 所述居中弹窗与现 Demo 不符） | 完成 | #8 |
| A | Cockpit `ProjectCard` 按钮补 `→`，搜索图标对齐原始 | 完成 | #8 |
| A | Interpreter 侧栏补图标与 KNOWLEDGE · 8 TYPES 分组条 | 完成 | #8 |
| A | Interpreter 可管理类型动作文案改为 Manage；类型计数对齐 `typeMeta` | 完成 | #8 |
| A | Campaign 四个 section 数据改为 props，`content.js` 提供默认值 | 完成 | #8 |
| A | `Header` 导航改为 `<a>`；`Hero` 去掉写死 `id` | 完成 | #8 |
| A | 全交互状态验收闭环（#8 条目完成不等于所有状态通过） | 进行中 | — |
| A | Interpreter 稳定类型标识、未知类型行为、只读创建入口与示例覆盖 | 完成 | `devin/interpreter-type-contract`（待 PR） |
| B | 接口契约、稳定类型标识、导航语义、表单与键盘交互验证、reset 隔离 | 未开始 | — |
| B | 全部故事启用 `autodocs`，补 props 类型声明 | 未开始 | — |
| B | `src/design/index.js` 公共导出入口 | 未开始 | — |
| B | 组件 CSS 色值全部 token 化（当前 169 个十六进制色值，155 行） | 未开始 | — |
| B | 有机体与页面补 `@media` 与 `:focus-visible` | 未开始 | — |
| B | `scripts/visual-check.mjs` 自动截图对照 | 未开始 | — |
| C | Interpreter 类型视图：卡片网格、创建者筛选、分页、`!` 规则提示、按类型切换 Hero | 未开始 | — |
| C | `AnalyticalModelForm`、Scenario Report 表单、Save / Submit 状态规则 | 未开始 | — |
| C | 详情抽屉、版本对比、公式构建器、Data Model 浏览器 | 未开始 | — |
| D | Review Center、Feedback & Quality、Personal Memory、Scenario Library / Detail / Edit | 未开始 | — |
| D | Self-Service 数据视图、上传页、Media Tracking Detail | 未开始 | — |
| D | Cockpit 报表详情与 Copilot 面板 | 未开始 | — |
| E | 发布形态、`exports`、CI 接入 | 未开始 | — |

已完成的前置工作：

| 条目 | 状态 | PR |
|---|---|---|
| 替换 DOM 复刻方案为语义组件设计系统 | 完成 | #6 |
| 五个入口页面首屏在 1440px 与原始一致 | 完成 | #6 |
| Cloud Agent 环境（`npm ci`，4173 / 6006） | 完成 | #2 → #6 |

## 3. 有意差异表

| 位置 | 差异 | 理由 | 引入 PR |
|---|---|---|---|
| 全站 | 组件 DOM 层级与 class 名不与原始 HTML 一致 | 组件接口为事实来源，按 `AGENTS.md` 第 1 节 | #6 |
| `Header` | 首页与工作区页头合并为一个组件，以 `tone` 区分 | 同一设计概念只保留一个组件 | #6 |
| Home `AssistantPanel` | 保持右侧全高抽屉（1440px 宽 576px），不是 680px 居中弹窗 | 当前 `.home-ask-panel` 计算样式即该抽屉；2026-09-23 已修正 `AGENTS.md` 2.4 的旧判断 | #8 |
| Interpreter TypeCard 计数 | Data Models 为 3、Business Terms 为 6、Scenario Reports 为 3；原始页 `renderStats` 显示 1 / 1 / 2 | `AGENTS.md` 3.3：原文不一致时以 `typeMeta[].stats.total` 为准 | #8 |
| Campaign 指标标签 | `MetricStat` 标签为大写，原始 Overview 指标为句首大写 | 共享组件既有样式，本阶段不改 `MetricStat` | #8 |
| `Header` logo | logo 链接仍 `preventDefault`；导航项已不再无条件阻止默认跳转 | 遗留导航缺口，后续仍须按组件语义规则修复 | #8 |
| Interpreter 侧栏/卡片计数 | 侧栏条目与 TypeCard 显示 `typeMeta.stats.total`（3 models / 3 scenarios）；原 sidebar `countForType` 数 `demoAssets` 实数（1 model / 2 scenarios） | `AGENTS.md` 3.3：计数以 `typeMeta` 为准；`demoAssets` 与 `typeMeta` 冲突属原文自身不一致 | devin/interpreter-type-contract |
| Interpreter 创建按钮文案 | 使用 `Add X`（`Add Business Term` / `Add Analytical Model` / `Add Scenario Reporting`）；通用 `types.js` 为 `Create X`，生效专用视图为 `Add X` | 以后加载的专用视图为准（业务覆盖规则）；原文 `Add Scenario reporting` 小写 r 属笔误，已规范化 | devin/interpreter-type-contract |
| Interpreter 未知类型 | 原 `?type=` 非法值回退 `all` 显示概览；本实现改为显式 Unknown 空态，不渲染任何记录 | 需求要求未知类型不得意外展示全量/概览 | devin/interpreter-type-contract |
| Interpreter 列表形态 | 类型页为通用行表（Title/Type/Creator/Process/AI Status 双状态列）；原专用视图为卡片网格、专属列（Email 10 列、BT 同义词卡、Scenario 卡 + 分页 + 逐卡动作） | 本轮只修数据契约与动作入口；逐类型视图属阶段 C | devin/interpreter-type-contract |
| Interpreter Hero | 选中类型时 Hero 标题/描述/统计切换为该类型（对齐原文逐类型 hero） | types.js 注释确认每类型有独立 hero statistics | devin/interpreter-type-contract |

## 4. 已知缺口

来自 2026-09-23 代码审查（细项见 AGENTS.md 2.4），尚待处理：

- ~~深审服务端渲染：Business Terms 仅改显示标题即从 1 条变 0；未知类型显示全量 6 条；model/metrics/email 均空但概览有计数，且只读类型出现创建按钮。~~ 已修复（devin/interpreter-type-contract）：records 以稳定 `typeId` 关联（改名不影响筛选）、未知 `typeId` 渲染显式空态、八类均有有来源的抽样记录、创建入口由 `type.manageable` 显式驱动。
- 知识记录已拆 `stage`（流程/发布阶段）与 `availability`（AI 可用性）双维度；`BusinessTermForm` 仍缺 Data Model 关联（`scope` 字段）与 synonyms/附件等字段的表单支持——见 CONTEXT.md，属阶段 C 表单提取。
- 多个基础故事受控值未回写；TypeCard 图片依赖根路径 /assets 和 Storybook staticDirs，未验证独立宿主可用性。
- 原始 Scenario 的 types.js 旧状态与后加载专用脚本不同；本轮已按 scenario-reports.js 生效口径落数据（Draft/Queued/Building/Published + ai_interpreter_enabled 独立）。localStorage 草稿/删除层未迁移，属阶段 C。

- BusinessTermForm 必填校验缺失；TermForm 故事未同步受控输入；未接入页面创建流程。
- 助手模态焦点/Escape、Tabs 方向键、表格行键盘操作缺失。
- tokens.css 包含全局 reset；组件接口仍有 DOM event 透传、部分页面文案硬编码；Interpreter 已改用稳定 `typeId`（显示标题不再充当类型标识）。
- 缺少页面/状态/动作/故事/验证覆盖清单；仅有五个入口故事不能视为 17 页及其交互提取完成。

- Interpreter 非 overview 状态与原始差异大：原始为卡片网格与逐卡动作，当前为单行通用表且 Actions 列为空。阶段 C 处理。
- `StatusBadge` 的 tone 由字符串包含判断决定，需改为显式 `tone` prop 或映射表。
- `content.js` 中 `href` 为 `/home`、`/cockpit` 等 Demo 中不存在的路由，需在决定路由方案后统一。
- 页面故事内联 `style` 用作占位与间距（如 `<div style={{ height: 56 }} />`），需改为组件 CSS。
- 无测试、无 lint。阶段 B 落地视觉对照脚本后再评估单元测试范围。
- 分支 `cursor/storybook-design-e61c`（#1）与 `cursor/component-ablation-e61c`（#5）建在已删除的 `src/assembled` 与 `scripts/compose_portal.py` 上，与 `main` 互斥，应关闭。

## 5. 维护日志

| 日期 | 变更 | 执行者 |
|---|---|---|
| 2026-09-22 | PR #6 合入：语义组件设计系统替换 DOM 复刻方案 | Cloud Agent |
| 2026-09-22 | 深度审核：实跑构建与 1440px 对照，确认 2.4 节缺口；建立 `AGENTS.md` 与本状态文件 | Cloud Agent |
| 2026-09-22 | PR #8：阶段 A 六条收口（助手抽屉、Cockpit 箭头与搜索符、侧栏图标、Manage 文案与 typeMeta 计数、Campaign props、Header 链接与 Hero id） | Cloud Agent |
| 2026-09-23 | 代码审查：确认 #8 修正；更新 token/色值统计，记录导航、表单、键盘、接口与验收缺口；构建通过（38 stories、0 docs），未重做视觉验收；同步 AGENTS.md 2.4/5 | Codex |
| 2026-09-23 | 深审：以 React 服务端渲染确认类型匹配、空数据与只读创建入口问题；对照 v22/原始表单确认双维状态及关联字段缺失；补术语表并强化 A–D 验收，未修改组件实现 | Codex |
| 2026-09-23 | `devin/interpreter-type-contract`：INTERPRETER 数据契约重构（typeMeta key 作 typeId、manageable/createLabel/statusFilters/stats、24 条真实抽样记录、stage+availability 双维度）；KnowledgeSidebar/TypeCard/LibraryToolbar/AssetRow/KnowledgeLibrary/AiInterpreterPage 契约更新；新增 vitest+RTL 行为测试 9 条；构建 38 stories；1440px 截图对照 `/tmp/mh-visual/` | Devin |
