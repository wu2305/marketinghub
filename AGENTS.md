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

### 2.4 2026-09-23 审核确认的缺口

本次基于本地 `main`（2555d8a，含 #8）静态代码审查，并运行 `npm run build-storybook -- --disable-telemetry`：构建通过，38 stories、0 docs。未重跑浏览器截图、Controls 全枚举或全交互验收；2026-09-22 的截图结论保留为历史记录。

| 类别 | 事实 |
|---|---|
| 已修正 | #8 已补 Cockpit 箭头与搜索符、Interpreter 侧栏图标/分组/Manage/计数，Campaign 四个 section 数据已改 props，Header 导航项已改链接，Hero 已使用 useId。Home 原始 CSS 最终覆盖为右侧抽屉，撤销旧审核“应为居中弹窗”的判断。 |
| 覆盖深度 | 17 个 HTML、47 个 JS、50 个 CSS；当前仅 5 个页面故事。Interpreter 非 overview 仍共用通用行列表，Actions 列为空；类型专属列表、创建/编辑、详情与治理流程未完整提取。BusinessTermForm 已有独立故事，但未接入页面创建流程。 |
| 交互 | BusinessTermForm 的 required 仅渲染星号，空值仍调用 Save/Submit；TermForm 故事仅记录 onChange，未更新受控值。AssistantPanel 缺少进入/限制/恢复焦点与 Escape 关闭；Tabs 无方向键处理，DataTable 点击行无键盘入口。 |
| 内容与接口 | 页面仍写死搜索/筛选等文案；知识类型通过显示标题和 startsWith 匹配；StatusBadge 通过字符串包含推导 tone；Button 等直接透传 DOM event，与具名对象约定不一致。 |
| Token 与样式 | tokens.css 现有 27 个变量；四个组件 CSS 共 169 个十六进制色值（155 行）。间距、圆角等仍大量直接赋值；tokens.css 混入全局元素 reset，会影响宿主页面。 |
| 响应式 | 四个组件 CSS 仍无 @media；多列网格、固定宽度搜索框与侧栏未提供窄屏布局。基础控件已有部分 focus-visible，有机体覆盖不足。 |
| 导航 | Header 导航使用 content.js 中不存在的 /home、/cockpit 等路由；logo、Link、WorkspaceCard 仍阻止默认跳转，WorkspaceCard 的 href 直接使用 title。 |
| 文档与验证 | 无 autodocs、组件 props 类型声明、公共 index.js、测试/lint/视觉对照脚本/CI。故事数不能代表所有导出组件均有独立故事，也不能证明完整状态覆盖。 |
| 深审：数据契约 | React 服务端渲染确认：只改 Business Terms 显示标题，列表由 1 条变 0；未知 activeType 显示全部 6 条。概览合计 35，示例仅 6 条；model/metrics/email 均为空列表。Principles 等只读类型仍出现 Create New Knowledge。 |
| 深审：状态与字段 | 原始 Analytical Model 可 Published 且 Disabled；Scenario 区分 Draft/Queued/Building/Published 与 AI 可用性，当前单 status 与统一过滤器不能完整表达。BusinessTermForm 缺少原始 Data Model 多选关联，回调也不携带 scope。 |
| 深审：故事与可移植性 | 受控值不回写并非仅 TermForm，Input/Area/Dropdown/Search/Tabs/Pills/Field/Scope 等故事同样只记录 Action。TypeCard 图像写死根路径 /assets，依赖 Storybook staticDirs；尚无独立宿主验证。 |
| 深审：参照与验收 | types.js 的 Scenario 旧状态与后加载 scenario-reports.js 的状态映射不同；typeMeta 仅解决计数来源。需逐特性记录实际生效脚本/样式、文档规则、存储初态与冲突取舍。单纯故事数、颜色扫描、每页一个故事不能证明完整提取。 |


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

- 已由 #8 修正旧审核视觉条目；保留已确认的 Home 抽屉与 typeMeta 计数取舍。
- 补现有入口导航与交互状态验收记录；区分“回调已触发”和“流程已演示完成”。
- 修复 Interpreter 显示标题参与类型匹配、未知类型回退全量数据、只读类型创建入口与示例数据覆盖缺失；以稳定标识和明确能力表达现有 Demo 行为。
- Campaign 四个 section 的数据改为 props，`content.js` 提供默认值。
- `Header` 导航改为 `<a>`；`Hero` 去掉写死 id。
- 完成标准：五个页面故事的所有交互状态与原始页面对应状态对照通过，并登记有意差异。

### 阶段 B — 工程基线

- 补 `tags: ["autodocs"]`、props 类型声明、`src/design/index.js`；盘点导出组件与独立故事覆盖。
- 统一导航、具名回调、稳定类型标识与显式状态 tone；隔离全局 reset，补表单校验和键盘交互的针对性验证。
- 组件 CSS 色值全部 token 化。
- 每个有机体与页面补 `@media` 断点与 `:focus-visible`。
- 落地 `scripts/visual-check.mjs`（按第 4 节步骤自动截图并输出并排图）；在 handover 中维护页面/状态/动作/故事/验证的覆盖清单，不能仅以故事总数验收。
- 对照须固定 URL、viewport、storage 初态与交互步骤；校验受控故事状态回写，增加不依赖 Storybook 配置的宿主组合验证与静态资源检查。
- 完成标准：`rg '#[0-9a-fA-F]{3,8}' src/design/*.css` 只命中 `tokens.css`；每个 `.stories.jsx` 含 autodocs；脚本可一键产出全部页面对照图。

### 阶段 C — AI Interpreter 深度提取

按原始 Demo 的信息密度从高到低：

1. 类型视图：卡片网格（同义词标签、状态、创建者、动作按钮）、创建者筛选、分页、`!` 管理规则提示、按类型切换的 Hero。
2. 表单：`AnalyticalModelForm`、Scenario Report 表单、必填校验与 Save / Submit 状态规则（见 v22 文档第 2、3 节）。
3. 详情抽屉、版本对比、Metric Dictionary 公式构建器、Data Model 浏览器。
- 完成标准：`knowledge.html` 八种类型的列表态有页面故事；三种可管理类型各覆盖适用的创建/编辑、校验、保存/提交与禁用条件，只读类型不误给创建入口。发布/处理状态与 AI 可用性分开表达，保留类型专属字段与关联；行为断言与视觉对照均通过。

### 阶段 D — 治理与自助模块

- Review Center、Feedback & Quality、Personal Memory、Scenario Library / Detail / Edit。
- Self-Service 的数据视图、上传页、Media Tracking Detail。
- Marketing Cockpit 的报表详情与 Copilot 面板。
- 完成标准：17 个原始 HTML 各有对应页面故事，并按 handover 覆盖清单完成适用的页内状态和主要动作；仅有入口截图不算完成。

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
