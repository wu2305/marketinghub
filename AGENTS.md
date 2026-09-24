# AGENTS.md — Marketing Hub Storybook 工作规范

本文件是所有在此仓库工作的 agent 和开发者的长期规范。`handover/README.md` 记录当前状态与待办，由每次改动同步维护。两份文件冲突时，以本文件的规则为准，以 `handover/README.md` 的状态为准。

## 1. 仓库目标

从 `index.html` 与 `assets/pages/*.html` 这套静态 HTML 设计 Demo 中，全量重建 React 界面与既有前端交互，并按奥卡姆剃刀原则提取最小必要的可复用组件体系，形成各层级 Storybook 档案。

2026-09-23 用户澄清：全量覆盖与克制抽象同时成立。目标不是局部样板、仅五页首屏、通用列表替代原有视图，也不是另建知识管理产品。全部页面、页内视图、区块、弹窗/抽屉、表单及可达交互状态都在范围内；原始 Demo 的后端/AI 模拟行为通过确定性本地故事状态演示。

- 原始页面的实际生效视觉与交互是重建验收依据；提取后的组件接口是使用与组合的事实来源，不能反过来用现有接口删减参照物能力。
- 奥卡姆剃刀约束实现复杂度，不删减覆盖范围：同构结构与行为共享，真实差异保留专用组合；不逐标签拆组件、不预建万能渲染器、不以组件数量多或少为目标。
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

2026-09-24 结构纠偏（`devin/structural-repair`：ed76de1 基线提交，13dacf2 A、8e51103 B、2ccd473 C、a7cc1d0 D、d6557c3 E）：visual-check 现绑定源指纹构建戳（过期构建 exit 2），逐场景分列 load/behavior/manual，manual 仅由人工 `--review` 写入且绑定截图 hash；弱断言、console error、Storybook 错误页均判失败；`--negative` 6 例变异必须失败；P07 加侧栏/Hero/主栏/卡片几何对照。上文“Accounts 错参数”“Campaign 重开丢值”“activeCopilotStream 模块全局”“CityInvest/报表搜索/Copilot 固定读 Demo 数据”“CockpitStory 旁路 args.projects”“tokens 全局 reset”“TypeCard 根路径 /assets”“Interpreter 外壳布局不符”诸条已修复，以 handover 为准。人工审图（lead）通过：P07 overview、Principles 默认/长页/分类筛选/1024 窄屏；Business Term 等七类仍是过渡通用列表（人工 fail，M4 未完成）。独立宿主 `examples/host`（base `/mh-host/`）经 `scripts/host-check.mjs` 验证资源、导航闭环不整页刷新、宿主哨兵样式不受污染、双实例隔离。已知残留：截图 hash 存在渲染噪声，人工审核较易转为 stale（安全方向）；嵌套覆盖层一次 Escape 会关闭所有文档级监听层，原生 `<dialog>` 仅关顶层，未改；ReportCopilot 关闭后还原焦点为无障碍调整（原 closeAi 无）；宿主 compose 窄栏中 CityInvestDashboard 筛选行溢出，组件缺容器级响应式。

2026-09-24 增量对抗审核（02918b5 + 审核开始时已有的 8 个 tracked 工作区修改）：重新构建通过，实际索引为 63 stories + 5 docs（不是 68 stories），单测 10/10；P07 配对脚本 10/10 断言通过，但人工查看 Principles 配对截图确认整体 Hero/侧栏布局仍显著不同，撤销 handover“像素一致”的结论。Campaign 创建任务输入 Object 后 Cancel→重开，原始保留输入，React 回到 `341 plans`；此前将丢值登记为生命周期有意差异不能抵消可达流程缺口。结构性风险：CityInvestDashboard 无内容/数据 props、报表搜索依赖固定 KNOWLEDGE_ASSETS、Copilot 流取消令牌为模块全局、tokens 存在宿主全局 reset；独立宿主复用未得到证明。Accounts 错参数负向复核已能拒绝 overview，应不再沿用旧漏洞仍存在的结论。证据：`/tmp/mh-audit-20260924-p07`、`/tmp/mh-audit-20260924-runtime/results.json`。未复跑全套场景或 Controls 全枚举，未修改实现。

对抗性复核（888177a + 当时工作区，其他模型仍在补 JSDoc）：9/9 单测复跑通过，已生成索引仍为 38 stories。临时副本将 p06-campaign-accounts 的故事参数故意改成 overview，实际故事截图为 Overview Dashboard，脚本仍 PASS；当前选择器主要证明外壳存在，未证明场景状态正确。另在首页打开助手，model/mode/suggest/attach picker 与 platformGuideTrigger 五个节点均存在但不可见，assistant-panel.css:802–810 强制隐藏；M0 把源码节点直接列为待实现功能存在恢复旧界面的风险。脚本扫描盘点、运行时可达盘点与完成验收必须区分。证据在 /tmp/mh-adversarial-wrong-state 和 /tmp/mh-adversarial-home，未修改组件实现。

增量复核（a9542f7）：稳定类型标识、未知类型空态、只读创建入口、双维状态已修正，npm test 9/9 复跑通过。下表部分条目为修复前历史事实，当前状态以 handover 为准。新发现：Principles 示例未取实际生效的 globalPrinciples；Data Model 混用资产/模型源/domain 且补写原文不存在的说明和状态；Library 独立故事仍不回写输入或执行筛选；多选筛选被单选取代，搜索缺同义词/范围/创建者。现存原始截图只有 overview、Principles、Business Term、Scenario，不能支持八类型完整对照结论；实际 Principles 对照仍有 Hero/侧栏布局和数据内容差异。

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

## 5. 长期规划（2026-09-23 全量重建里程碑）

本节取代旧 A–E 的机械串行安排；旧进度保留作历史证据，不自动等同于新里程碑完成。当前状态、分解条目、覆盖台账与接续点只在 handover/README.md 维护。执行指令模板见 handover/execution-prompt.md。

2026-09-24 审核执行纠偏：后续复制 P07 类型视图前先验收 Interpreter 专用外壳；M1 的不同内容注入与同页多实例检查应穿插当前条目，及早暴露固定 Demo 数据/全局状态耦合。配对脚本断言通过与人工视觉通过分别登记；可达状态丢失继续作为未完成项，不得用“组件生命周期”理由永久豁免。全量里程碑范围与顺序不变。

同日根因评估：优先明确展示组件、演示数据/纯计算、流程状态宿主三者的依赖与责任，再用不同内容、生命周期、多实例和独立宿主导航验证边界。故事内持有本地状态本身不违规；需要跨宿主重用的流程不能只能从 stories 复制。专项执行指令见 `handover/structural-repair-prompt.md`，它不维护第二份进度，也不取代 M0–M7 全量目标。纠偏批 A–E 已于 2026-09-24 实施（见 2.4）；后续恢复 `handover/execution-prompt.md` 的全量推进：剩余七类知识视图（M4）、M5/M6、全站收敛。新页面沿用同一边界：展示组件只收 props，fixture 与确定性模拟放 `src/design/demo/`，跨宿主流程用 `useXxxDemo` 容器，经 `examples/host` 与替换夹具测试验证。

- **M0 全量盘点与参照基线**：核对 17 个 HTML 及 URL 参数、hash、脚本加载和覆盖关系；列出所有页内视图/状态/动作、组件候选与来源冲突。每个入口有台账，未知细节显式待查；完成首轮后即开始实现，后续随发现补充，不无限审查。
- **M1 最小工程底座与公共基础**：可重复构建/交互验证/视觉对照、公共导出、props 声明与 autodocs、token/样式隔离、资源与导航约定、可操作的故事。先建立后续实施所需的最小闭环，其余基础组件随真实页面需求提取；不等待一个预想中的完整框架才开始页面工作。
- **M2 全站外壳与 Home**：提取 Header、导航、Hero/布局、入口卡、助手公共组件及全部实际变体；由组件组合完整首页，恢复原始可达助手交互与导航演示。兼容 Interpreter 的侧栏与 Hero 布局，不用一种壳强套所有页面。
- **M3 Cockpit / Self-Service / Campaign 全量重建**：reports、flexible、data-upload、media-tracking-detail、campaign；覆盖报表详情、页内 dashboard、上传流程、Campaign 五区及弹窗/助手等原始可达状态。页内多视图不能按一个 HTML 折算为一项已完成。
- **M4 AI Interpreter 八类视图**：knowledge.html 概览及 Principles、Report Context、Data Model、Metric Dictionary、Business Term、Analytical Model、Scenario Reporting、Email Reports 的真实视图。提取所需卡片、列表/表格、筛选、标签、动作、分页和提示；保留各类型真实差异，替换通用占位列表。先完成一种类型的分层提取与组合对照，再推广共性，直至八类全部完成。
- **M5 知识表单与详情工具**：knowledge-create、knowledge-view、metric-dictionary、data-model 及页内抽屉/版本对比/公式构建/浏览器。各适用类型的创建/编辑/只读、字段关联、必填与动作规则均完整；可用性与发布/处理阶段只在原始界面需要时分别表达，不扩建业务系统。
- **M6 治理与 Scenario**：review-center、feedback-quality、personal-memory、scenario-library/detail/edit 的全量界面与演示交互，复用此前已提取组件。
- **M7 全量收敛与复用交付**：17 页及台账子状态全部验收，补齐跨页组合、响应式/键盘、资源和故事文档；建立不依赖 Storybook 配置的独立 React 宿主例子，并用不同内容/布局组合组件验证复用；本地构建/导出与 CI 可执行，不以真实发布或外部部署作为完成前提。

### 每个里程碑的共同完成标准

0. M0 需区分已验证可达、待查可达路径、明确被替代/隐藏的源码残留。全量重建不是恢复所有历史 DOM；隐藏节点未找到实际触发路径前不能直接转成实现需求，也不能仅因默认隐藏就永久排除。
1. 有明确原始页面/状态/动作来源及组件映射；没有把遗漏功能登记为永久有意差异来抵消缺口。
2. 使用 React 组件组合完整界面；组件拥有独立语义接口、所需状态故事、可操作 Controls/Actions 和文档。允许内部私有子组件，不为满足层级命名制造无意义包装。
3. 对受影响组件与页面完成构建、实际故事交互验证和配对视觉对照；默认态、相关非默认态、长页下部/覆盖层均纳入证据。截图脚本须校验页面加载与预期状态，不能吞异常后报通过。
   场景断言应能区分错误状态；至少以一次错参数/错区块的负向检查证明它会失败。加载通过、交互断言通过、视觉人工审核通过分别记录，不能合并为无条件 PASS；证据记录构建所对应提交及工作区状态，避免旧静态产物冒充当前实现。
4. 本地状态演示原始前端流程，不依赖 assets/js 或生产服务；组件接入新宿主无需复制原始页面、原始业务脚本或中间 DOM 数据。
5. handover 登记准确的状态与证据；受阻项保持未完成并继续独立工作。一个样板、若干截图、故事数量或测试通过不能替代全量验收。

顺序：M0 → M1 最小闭环 → M2 → M3 → M4 → M5 → M6 → M7。已证明共性可提前提取，遇依赖可调整局部顺序并记录原因；不得把全量任务缩减为首个里程碑。每个提交/PR仍只包含一个可独立验收的条目。

## 6. 分支与 PR 规则

- 从最新 `origin/main` 开分支。不在 `cursor/storybook-design-e61c`、`cursor/component-ablation-e61c` 及其派生分支上开发。
- 每个 PR 只推进一个里程碑内的一个可独立验收的条目。PR 描述必须包含：改动的组件列表、对照截图（或脚本输出路径）、有意差异登记。
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
