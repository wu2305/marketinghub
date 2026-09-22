# AGENTS.md — Marketing Hub Storybook 工作规范

本文件是所有在此仓库工作的 agent 和开发者的长期规范。`handover/README.md` 记录当前状态与待办，由每次改动同步维护。两份文件冲突时，以本文件的规则为准，以 `handover/README.md` 的状态为准。

## 1. 仓库目标

从 `index.html` 与 `assets/pages/*.html` 这套静态 HTML 设计 Demo 中，提取一套可复用的 React Storybook 设计系统。

- 组件接口是事实来源。原始 HTML 只作为视觉与交互参照。
- 原始 HTML 不是运行时，不是组件 props，也不是验收时逐标签对比的对象。
- 一个新页面必须能只 `import` 组件来搭建，不复制原始 HTML、不复制任何中间 JSON。

不属于本仓库目标：后端、真实 AI 调用、权限系统、数据持久化，以及把 Demo 的业务规则改写成新产品。

## 2. 背景与已确认的事实

### 2.1 静态 Demo（参照物）

- 17 个 HTML 页面、约 47 个 JS、50 个 CSS，全部在浏览器内运行，无构建。
- 四块工作台：Marketing Cockpit、Self-Service Center、AI Interpreter、RedNote Campaign Tool。AI Interpreter 含 8 类知识。
- 数据来自多份重复来源：`assets/js/data/knowledge.js`、`assets/js/data/knowledge-fields.js`、`assets/js/knowledge/types.js` 内的 `demoAssets` / `globalPrinciples`、`assets/pages/knowledge.html` 尾部内嵌脚本。同一指标在不同处数字不一致。
- 权限、审批、AI 回答均为界面演示：身份是常量字符串 `"Current User"`，回答是写死文案，跨页状态靠 `localStorage`。
- `AI Interpreter Demo 变更说明 v22.docx` 是交给 IT 的前端规格，其第 6 节已声明以上缺口。

### 2.2 已废弃的方案（禁止重启）

PR #1、#3、#4、#5 采用“DOM 复刻”路线：`scripts/compose_portal.py` 识别原始 DOM，输出 `src/assembled/trees/*.json`，组件接收 `{attrs, nodes}` 再吐回原始标记，验收标准是拼装结果与原文标签、class、文案、属性一致。

该路线在结构上禁止组件拥有独立接口，已被 PR #6 整体删除。禁止：

- 新增任何形式的 DOM 识别器或 `{attrs, nodes}` 包装器。
- 以“退回原文后仍与原文一致”为通过条件的消融或对照。
- 用 `PortalDocument`、原始 HTML 字符串、iframe 加载原始页面作为页面故事。
- 把 `assets/js` 原脚本挂进组件故事以模拟行为。

`cursor/storybook-design-e61c`（#1）与 `cursor/component-ablation-e61c`（#5）仍建在已删除的文件上，与 `main` 架构互斥。它们应被关闭，不得合并，也不得在其上继续开发。

### 2.3 当前方案（PR #6，已合入 main）

- 代码位于 `src/design`：`tokens.css`、`atoms`、`molecules`、`organisms`、`pages` 各含 `.jsx` / `.css` / `.stories.jsx`；`content.js` 为页面文案与示例数据；`icons.jsx`、`cx.js` 为工具。
- Storybook 8.6，`@storybook/react-vite`，`.storybook/main.js` 以 `esbuild.jsx = "automatic"` 编译 JSX，`staticDirs` 把 `assets/` 映射到 `/assets`。
- `npm run build-storybook` 通过；38 个故事全部可渲染。
- 五个页面故事（Home、Marketing Cockpit、Self-Service Center、AI Interpreter、RedNote Campaign Tool）在 1440px 下首屏与原始页面基本一致。

### 2.4 2026-09-22 审核确认的缺口

| 类别 | 事实 |
|---|---|
| 覆盖深度 | 提取只到每个页面的首屏。AI Interpreter 各类型视图（卡片网格、同义词标签、创建者筛选、编辑/删除/下线动作、分页、`!` 规则提示）、Analytical Model 表单、Scenario 编辑器、版本对比、Review Center、Feedback、Personal Memory、Metric Dictionary 公式构建器、Data Model 浏览器均无组件。 |
| 视觉偏差 | Home 助手面板做成右侧抽屉，原始首页为居中弹窗。Cockpit 按钮缺 `→`，搜索图标不同。Interpreter 侧栏缺图标与分组条；可管理类型动作应为 Manage，现为 View；类型计数与原文不符。 |
| 内容耦合 | Campaign 的 Execution / Assets / Analytics / Accounts 四个 section 的数据写死在 `pages.jsx`，页面组件不接收数据 props。 |
| Token | `tokens.css` 21 个变量；`atoms.css` / `molecules.css` / `organisms.css` / `pages.css` 内仍有 171 处直接十六进制色值，金色渐变、危险色、深色 Hero 全部绕开 token。 |
| 响应式 | 四个组件 CSS 中零条 `@media`。 |
| 语义 | `Header` 导航项渲染为 `<button>`；`Link`、`WorkspaceCard` 的 `<a>` 一律 `preventDefault`；`content.js` 的 `href` 为 Demo 中不存在的 `/home`、`/cockpit`；`Hero` 写死 `id="mh-hero-title"`。 |
| 文档与类型 | 无 `autodocs`、无 PropTypes / TypeScript、无 `index.js` 导出入口。`StatusBadge` 的 tone 由字符串包含判断决定。 |
| 验证 | 无测试、无 lint、无视觉回归。PR 描述中的 test plan 为手工勾选。 |

## 3. 组件与样式规则

### 3.1 接口

- 组件只接收内容 props、状态 props、`children` 与回调。禁止接收原始 `class`、`attrs`、DOM 节点或 HTML 字符串。
- 枚举型 props 必须导出常量并在故事的 `argTypes` 中引用（参照 `buttonVariants`、`controlSizes`）。
- 同一设计概念只保留一个组件。区分形态用 `variant` / `tone` / `size`，不新建同义组件。
- 回调统一命名：`onClick`、`onChange`、`onNavigate`、`onOpen`、`onSelect`、`onSubmit`、`onSave`、`onCancel`。回调参数为带具名字段的对象，不直接传 DOM event。
- 可导航元素渲染为 `<a href>`；触发动作的元素渲染为 `<button type="button">`。不得用 `<button>` 代替导航，也不得对所有 `<a>` 无条件 `preventDefault`。
- 组件内不得写死 `id`。需要 `aria-labelledby` 时由调用方传入或使用 `React.useId()`。
- 页面级组件（`src/design/pages.jsx`）必须通过 props 接收全部数据与文案。`content.js` 只作为故事的默认 args，不得被页面组件直接 import。

### 3.2 样式

- 每个组件的样式写在同层 `.css` 中，随组件 import。禁止整包引入 `assets/css`，禁止依赖 `knowledge-v4` 这类页面父级 class。
- 颜色、字体、圆角、阴影、间距必须引用 `tokens.css` 中的变量。新增色值先加 token 再使用。目标：组件 CSS 中直接十六进制色值降为 0（渐变端点亦需 token 化）。
- 每个有布局的有机体与页面组件必须提供至少一档 `@media` 断点，以原始 CSS 的断点为参照。
- 可交互元素必须有 `:focus-visible` 样式。
- 组件 CSS 类名以 `mh-` 前缀、BEM 风格命名。

### 3.3 内容与数据

- 组件 props 中出现的文案、计数、状态取值，必须与原始 Demo 当前版本一致；发现原文自身不一致时，以 `assets/js/knowledge/types.js` 的 `typeMeta` 为知识类型计数来源，并在 `handover/README.md` 记录取舍。
- 有意的视觉差异（为稳定接口调整 DOM 层级或 class）必须在 `handover/README.md` 的“有意差异”表中登记，写明位置与理由。

### 3.4 故事与文档

- Atoms、Molecules、Organisms 每个导出组件至少一个故事，配 Controls 与 Actions。
- Pages 故事的渲染树只允许出现 `src/design` 内的组件。
- 所有故事文件启用 `tags: ["autodocs"]`。每个组件用 JSDoc 或 PropTypes 声明 props 的类型与取值；若引入 TypeScript，一次性迁移整个 `src/design`。
- 提供 `src/design/index.js` 作为唯一公共导出入口。

## 4. 验证要求

每次修改 `src/design` 或 `.storybook`，提交前必须完成：

1. `npm run build-storybook` 通过，且 `storybook-static/index.json` 中故事数不减少。
2. 对受影响的页面故事与对应原始页面在 1440px 下截图并肉眼对照。步骤：
   - 静态服务：`(cd storybook-static && python3 -m http.server 6007)`；仓库根目录 `python3 -m http.server 4173`。
   - 截图：`google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --user-data-dir=/tmp/chrome-<name> --window-size=1440,1400 --virtual-time-budget=5000 --screenshot=<name>.png <url>`。多张截图必须串行执行并使用不同 `--user-data-dir`。
   - 故事 URL：`http://127.0.0.1:6007/iframe.html?viewMode=story&id=<story-id>&args=<k>:<v>`。
3. 页面故事中的每个交互 props（tab、section、activeType、assistantOpen 等）至少各截一个非默认状态，与原始页面对应状态对照。
4. 新增或修改的组件在 Controls 中切换全部枚举值，无报错、无布局崩坏。

对照脚本落地为 `scripts/visual-check.mjs` 后，以脚本输出替代第 2、3 步的手工操作；脚本产出保存到 `/tmp`，不入库。

## 5. 长期规划

按顺序推进。每个阶段的完成标准写在此处，进度写在 `handover/README.md`。

### 阶段 A — 收口现有五个页面（首屏一致 → 状态一致）

- 修复 2.4 表中“视觉偏差”全部条目。
- Campaign 四个 section 的数据改为 props，`content.js` 提供默认值。
- `Header` 导航改为 `<a>`；`Hero` 去掉写死 id。
- 完成标准：五个页面故事的所有交互状态与原始页面对应状态对照通过，并登记有意差异。

### 阶段 B — 工程基线

- 补 `tags: ["autodocs"]`、props 类型声明、`src/design/index.js`。
- 组件 CSS 色值全部 token 化。
- 每个有机体与页面补 `@media` 断点与 `:focus-visible`。
- 落地 `scripts/visual-check.mjs`（按第 4 节步骤自动截图并输出并排图）。
- 完成标准：`rg '#[0-9a-fA-F]{3,8}' src/design/*.css` 只命中 `tokens.css`；每个 `.stories.jsx` 含 autodocs；脚本可一键产出全部页面对照图。

### 阶段 C — AI Interpreter 深度提取

按原始 Demo 的信息密度从高到低：

1. 类型视图：卡片网格（同义词标签、状态、创建者、动作按钮）、创建者筛选、分页、`!` 管理规则提示、按类型切换的 Hero。
2. 表单：`AnalyticalModelForm`、Scenario Report 表单、必填校验与 Save / Submit 状态规则（见 v22 文档第 2、3 节）。
3. 详情抽屉、版本对比、Metric Dictionary 公式构建器、Data Model 浏览器。
- 完成标准：`knowledge.html` 八种类型的列表态与至少一种创建态均有页面故事，且对照通过。

### 阶段 D — 治理与自助模块

- Review Center、Feedback & Quality、Personal Memory、Scenario Library / Detail / Edit。
- Self-Service 的数据视图、上传页、Media Tracking Detail。
- Marketing Cockpit 的报表详情与 Copilot 面板。
- 完成标准：17 个原始 HTML 各有至少一个对应页面故事。

### 阶段 E — 交付形态

- 决定发布形态（npm 包或 monorepo 子包），补 `package.json` 的 `exports` 与构建产物。
- Storybook 静态站点接入 CI，视觉对照脚本在 PR 中运行。

## 6. 分支与 PR 规则

- 从最新 `origin/main` 开分支。不在 `cursor/storybook-design-e61c`、`cursor/component-ablation-e61c` 及其派生分支上开发。
- 每个 PR 只推进一个阶段内的一个可独立验收的条目。PR 描述必须包含：改动的组件列表、对照截图（或脚本输出路径）、有意差异登记。
- PR 合并后，同一 PR 内更新 `handover/README.md` 的状态表与维护日志。禁止只改代码不改 handover。
- 不修改 `index.html`、`assets/**` 中的原始 Demo，除非是修复参照物本身的明显错误，且需在 PR 中单列说明。

## 7. handover 维护规则

`handover/README.md` 是唯一的状态文件，结构固定为：

1. 当前状态：Storybook 版本、故事数、构建状态、最近对照日期。
2. 阶段进度表：阶段 → 条目 → 状态（未开始 / 进行中 / 完成）→ PR。
3. 有意差异表：位置 → 差异 → 理由 → 引入 PR。
4. 已知缺口：来自审核尚未排期的事实。
5. 维护日志：日期 → 变更 → 执行者。

`handover/component-plan.md` 只保留接口规则的摘要并指向本文件，不再单独维护规划。

每次审核或阶段结束，先更新本文件第 2.4 节与第 5 节，再更新 `handover/README.md`。
