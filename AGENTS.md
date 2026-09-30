# AGENTS.md — Marketing Hub Storybook 工作规范

本文件是所有在此仓库工作的 agent 和开发者的长期规范。`handover/README.md` 记录当前状态与待办，由每次改动同步维护。两份文件冲突时，以本文件的规则为准，以 `handover/README.md` 的状态为准。

**设计师同步**：若本次任务是把设计师更新后的 Demo（`index.html`、`assets/**`）同步进 Storybook，先读 `handover/design-sync/README.md` 并按其流程执行；设计意图问题问设计师，工程问题留给维护者。

**客户演示页**：若本次任务是用 Storybook 组件为客户拼装演示页，读 `handover/customer-demos/README.md`；这类任务只新增 `examples/demos/<name>/`，不改 `src/design`。

## 1. 仓库目标

从 `index.html` 与 `assets/pages/*.html` 这套静态 HTML 设计 Demo 中，全量重建 React 界面与既有前端交互，并按奥卡姆剃刀原则提取最小必要的可复用组件体系，形成各层级 Storybook 档案。

2026-09-23 用户澄清：全量覆盖与克制抽象同时成立。目标不是局部样板、仅五页首屏、通用列表替代原有视图，也不是另建知识管理产品。全部页面、页内视图、区块、弹窗/抽屉、表单及可达交互状态都在范围内；原始 Demo 的后端/AI 模拟行为通过确定性本地故事状态演示。

- 2026-09-27 用户决定：原始 Demo 是**设计意图的证据，不是规格**。界面应能被认出是同一产品（“像”），不要求逐像素一致：视觉统一到 `handover/design-intent/foundations.md` 的基础层；存根、无效控件与偶然的不一致不重建，按 Intent / Normalize / Fix / Drop-stub / Ask 处置并登记依据；有意的可达能力仍全部覆盖。
- 奥卡姆剃刀按**概念**计量（模式、变体、token、状态、props、故事），不按文件或组件数量：同一设计概念只有一个实现，跨页面也一样；变体、token 或 prop 只有服务于不同用途时才成立。基线与目标见 `handover/design-intent/occam-baseline.md`。不逐标签拆组件、不预建万能渲染器。
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

### 2.3 当前方案（PR #6 起，main）

- 代码位于 `src/design`：`tokens.css`；通用组件在 `components/<Name>/`，单页功能模块在 `features/<page>/<Name>/`，页面组件在 `pages/<Page>/`，跨组件共享的私有模块在 `lib/`；每个组件目录内为 `index.jsx` + `<Name>.css` + `<Name>.stories.jsx`，页面故事在 `pages/<Page>/<Page>.stories.jsx`（meta title 统一为 `"Pages"`，story id 不变）；`index.js` 是唯一公共入口；`demo/` 放 fixture 与确定性演示状态（`useXxxDemo`）；`content.js` 是故事与宿主的默认文案和数据；`report-logic.js`、`report-routes.js` 是纯函数；`icons.jsx`、`cx.js`、`asset-url.js` 是工具。
- Storybook 8.6，`@storybook/react-vite`，`.storybook/main.js` 以 `esbuild.jsx = "automatic"` 编译 JSX，`staticDirs` 把 `assets/` 映射到 `/assets`。
- 独立宿主 `examples/host`（base `/mh-host/`）由 `scripts/host-check.mjs` 验证；配对视觉对照由 `scripts/visual-check.mjs` 执行（绑定构建戳，含 `--negative` 负向变异）。
- 使用方示例 `examples/consumer`（Phase 3 WP5）只经包入口 `marketing-hub`（及 `marketing-hub/demo` 的大写内容常量）组装页面，状态与规则自持；`npm test` 驱动其行为，`build:lib` 在 dist 上类型检查并重跑，Storybook 的 `Examples/*` 故事与 visual-check 的 `consumer-*` 场景把它与原始页面配对。
- 故事数、测试数、构建与对照结论只记在 `handover/README.md` §1，本文件不写这些数字。

### 2.4 当前仍成立的结构性事实

本节只列约束后续工作方式的现存事实（截至 2026-09-30，Phase 3 WP4）。事实改变时直接改写或删除对应条目，不追加审核流水；审核过程、证据路径与历史结论记在 `handover/README.md`（历史见其 §2.5）。整改清单与执行提示见 `handover/structural-review.md`（结构）与 `handover/design-system-cleanup.md`（视觉与 token）。

- **方向**：语义组件 + props、`demo/` 演示层、独立宿主验证的架构可以继续；当前尚不是完整组件库，也未达全量覆盖。组合性验收标准：使用方只经公共导出搭出的页面（`examples/consumer` 的 Business Term 与 Marketing Cockpit）外观与操作同 Demo；`handover/design-intent/occam-baseline.md` 中的 props、存根、token 与行数计数只是代理指标，不能替代它。使用方页面未覆盖助手的建模对话框与 City Invest 内嵌图表（后者需要只有 demo 辅助函数提供的 `cityInvest.getScenario`）。
- **覆盖**：17 个原始页面对应 17 个页面组件；P08–P11表单、详情和独立工具已实现并接通主要跨页导航；P12–P14治理三页已实现，P15–P17 Skill Library/Detail/Edit已实现，独立状态档案与人工视觉仍在M7收敛。P07 八类全部有专用视图并经 `typeViews` 注册分派（Report Context/Metric Dictionary/Analytical Model/Email Reports 共用 FieldLibraryView）；overview 与 Principles 通过人工审图，其余人工 pending；P08独立创建/编辑已建，跨页组合与人工像素收敛仍待完成。
- **流程宿主**：17 个页面均有 `demo/` 下的 `useXxxDemo` hook，`examples/host` 为每个页面提供路由；新增流程按 §5 执行要点放 `demo/`，不留在故事里。Cockpit 宿主双 Copilot 已共用 `useCockpitDemo`，独立实例关闭与状态互不干扰。
- **覆盖层**：Modal（含 ConfirmDialog、UploadHistory）、ReportDetailsDrawer、AssistantPanel、ReportCopilot、ModelFlowDialog 与 DataModelView 表详情共用按 document 划分的层栈；仅栈顶响应 Escape 与焦点环，滚动锁在最后一层关闭时释放，ModelFlowDialog 可用 Escape 关闭。原有不同覆盖层外壳保持各自真实视觉形态。
- **组件边界**：13 个助手页面共用 `AssistantDock`（启动器、面板、建模对话框与焦点回归，内容来自一个 `assistant` 对象加 `skillFlow`）；AssistantPanel 与 ReportCopilot 共用私有 AssistantShell 的头部、历史与覆盖层行为，各自保留真实不同的外层布局、答案与输入组合；页面持有助手变体预设。页面组件 props 仍平铺（最多 42 个，`CampaignPage`，其余为分区数据与文案）。演示层的建模对话框状态（`demo/model-flow-state.js`）、`useSynced`、`useToast` 与 `useWorkspaceAssistantDemo` 各只有一份实现，新的 `useXxxDemo` 直接用它们；被阻止原因 → 确认 → 变更序列由公共 `useGovernedFlow` 承担。
- **文案**：AiInterpreterPage 页壳文案已由 props 注入；部分存量有机体仍含写死可见文案，随页面改动继续补齐。
- **样式**：`tokens.css` 只含 `handover/design-intent/foundations.md` §3 的角色 token 加四个状态色调（`--mh-{info,success,warning,danger}-wash`），共 67 个定义（63 个角色 + 4 个色调）；不再有以组件或页面命名的 token，`css-budget.json` 的 `legacyPrefixExemptions` 为空。组件、功能与页面 CSS 的裸十六进制色值及裸字号、字重、圆角、阴影、颜色字面量均为 0，由 `css-budget.json` 的棘轮强制（`maxRawHexColors`、`maxRawFoundationValues`、`maxTokenDefinitions`、`maxDuplicateValues`）；阈值只降不升，数值以该文件为准；宽度 `@media` 只用 1180 / 900 / 760 三档（`maxMediaWidths: 3` 强制）。独立组件根已显式采用设计字体，公式与代码保留等宽字体。
- **库列表模式**：知识库（含 Data Model 域列表）、评审、反馈、个人记忆与 Skill 列表共用一套“受治理库”模式——`LibraryToolbar`、`LibraryList`（cards / table / list）、`LibraryItem`、`LibraryEmpty` 与 `ItemActions`，配 `SearchField`、`CheckboxFilter`、`Select`、`Pagination`、`DataTable`，受阻动作/确认/Toast 规则集中在 `lib/governance.js`，规格见 `handover/design-intent/patterns/library.md`。新增或迁移的库视图直接组合这些组件，不再另写视图专用的列表、筛选或动作条（`KnowledgeActions` 已删除）。预算没有豁免机制（`pendingMigration` 已删除）；不要用新增豁免来绕过预算。
- **资源与交付**：字体与图片随包放在 `src/design/assets`（`tokens.css` 内 `@font-face` 引用）；`npm run build:lib` 产出 ESM、合并 CSS 与 d.ts（`.` 与 `./demo` 两个入口），CI 在 PR 与 main 上运行它；对受影响范围的 visual-check、`--negative` 与字体探针（上传 `gate-evidence`）只在推送 `v*` 标签（全量）或手动触发 CI（限受影响范围）时运行；`.design-sync` 复用同一构建同步 claude.ai/design。无真实发布或部署。
- **验证**：机器加载、行为断言、人工审图分别记录；多数场景人工审图仍为 pending；截图 hash 有渲染噪声，人工结论容易变为 stale（这是偏安全的方向）。

## 3. 组件与样式规则

### 3.1 接口

- 组件只接收内容 props、状态 props、`children` 与回调。禁止接收原始 `class`、`attrs`、DOM 节点或 HTML 字符串。
- 枚举型 props 必须导出常量并在故事的 `argTypes` 中引用（参照 `buttonVariants`、`controlSizes`）。
- 同一设计概念只保留一个组件。区分形态用 `variant` / `tone` / `size`，不新建同义组件。
- 回调统一命名：`onClick`、`onChange`、`onNavigate`、`onOpen`、`onSelect`、`onSubmit`、`onSave`、`onCancel`。回调参数为带具名字段的对象，不直接传 DOM event。
- 可导航元素渲染为 `<a href>`；触发动作的元素渲染为 `<button type="button">`。不得用 `<button>` 代替导航，也不得对所有 `<a>` 无条件 `preventDefault`。
- 组件内不得写死 `id`。需要 `aria-labelledby` 时由调用方传入或使用 `React.useId()`。
- 页面级组件（`src/design/pages/<Page>/`）必须通过 props 接收全部数据与文案。`content.js` 只作为故事的默认 args，不得被页面组件直接 import。

### 3.2 样式

- 每个组件的样式写在其目录的 `<Name>.css` 中，随组件 import；组件的修饰类（`--*`）规则必须放在基类组件自己的 css 里，不能散落到使用方——构建期 CSS chunk 顺序不保证源 import 序。禁止整包引入 `assets/css`，禁止依赖 `knowledge-v4` 这类页面父级 class。
- 颜色、字体、字号、字重、圆角、阴影、间距必须引用 `tokens.css` 中的角色变量（清单见 `foundations.md` §3）；组件 CSS 中不得出现直接十六进制色值或基础层裸值（渐变端点亦需 token 化），`css-budget.json` 的预算以 0 为上限。新增 token 前先查现有角色，同值同义时复用；现有角色确实无法承担的用途才新增，按语义命名（不按组件或页面命名），并在 `foundations.md` 写明一句用途；同一取值不得挂多个同义 token 名。
- 每个有布局的有机体与页面组件必须提供至少一档 `@media` 断点，以原始 CSS 的断点为参照。
- 可交互元素必须有 `:focus-visible` 样式。
- 组件 CSS 类名以 `mh-` 前缀、BEM 风格命名。

### 3.3 内容与数据

- 组件 props 中出现的文案、计数、状态取值，必须与原始 Demo 当前版本一致；发现原文自身不一致时，以 `assets/js/knowledge/types.js` 的 `typeMeta` 为知识类型计数来源，并在 `handover/README.md` 记录取舍；同一概念在原文中有多种措辞（例如权限提示、可用性标签）时，按 `handover/design-intent/domain-model.md` 统一为一种。
- 有意的视觉差异（包括按同一设计用途统一样式，以及为稳定接口调整 DOM 层级或 class）必须在 `handover/README.md` 的“有意差异”表中登记，写明位置与理由。

### 3.4 故事与文档

- 每个导出组件至少一个故事，配 Controls 与 Actions。
- 故事同样遵守奥卡姆剃刀：每个原始可达状态恰好一个命名故事；不为同一状态写重复故事，不为不可达或隐藏的残留 DOM 写故事；组件形态的差异优先用 Controls 切换枚举，只有原始页面中真实出现的组合才单独成故事。
- 组件同样遵守奥卡姆剃刀：不写只转发 props 的包装组件；同义组件合并为一个并以 `variant`/`tone`/`size` 区分；新组件先放 `features/<page>/`，被第二个真实页面使用时才提升到 `components/`；不预建通用渲染器；没有页面或故事之外使用者的导出、props 与分支应删除。新增前先确认现有组件或 prop 无法覆盖。
- Pages 故事的渲染树只允许出现 `src/design` 内的组件。
- **文档双语（English + 中文）**：Storybook 文档文字（组件 `docs.description.component`、`argTypes` 的 `description`、故事级 `docs.description.story`）一律写成 `bi("English…", "中文…")`（来自 `lib/story-helpers.js`，英文在前、中文为第二段；`prop`/`enumProp`/`callbackProp` 的描述参数同样传 `bi(...)`）；页面组件 JSDoc 的 `@param` 描述写成 `English text // 中文`，由 `.storybook/PageInterface.jsx` 拆成两段。代码、prop 名、回调名与界面标签在两种语言中都保持英文。组件渲染出的界面文案与故事 args 保持原始 Demo 的英文，不在此翻译。`src/design/docs-bilingual.test.js` 强制每条文档文字含中文。
- 所有故事文件启用 `tags: ["autodocs"]`。每个组件用 JSDoc 或 PropTypes 声明 props 的类型与取值；若引入 TypeScript，一次性迁移整个 `src/design`。
- 故事 title 反映代码层级：共享组件用 `Atoms`/`Molecules`/`Organisms`，单页模块用 `Features/<Page>/<Name>`，页面用 `Pages`；改变 title 即改变 story id，须在 handover 登记旧→新映射并同步引用。
- 提供 `src/design/index.js` 作为唯一公共导出入口。

### 3.5 参照物缺陷

- 视觉以 `handover/design-intent/foundations.md` 的角色 token 为准；原始页面用于确认信息层级、状态与动作含义和“像不像同一产品”，不作逐像素参照。同用途的颜色、字号、圆角、阴影、间距归并到同一角色，不逐页面制造变体；新增 token 须写明现有角色无法承担的用途。
- 原始 Demo 中没有结果的控件（存根、no-op）不成为组件接口或故事：按 `handover/design-intent/` 的处置表决定补全意图、删除或待用户决定。
- 原始 Demo 的**逻辑缺陷不进入 `src/design` 组件**。组件实现明显的设计意图。缺陷包括：错误的计算或判定（永假条件、错误回退）、状态 quirk（例如回填后按钮不恢复）、定位错误或恒不可达的界面、CSS 级联泄漏造成的非设计效果、死代码路径。
- 判定为缺陷必须写明原始源码位置与证据。原始行为合理但少见的，不算缺陷，照常复刻。拿不准时登记为待决，不自行决定。
- 需要在故事中重现原始缺陷（例如做配对截图）时，只能通过 `demo/` 层的 fixture 或 hook 参数表达；组件不为复刻缺陷新增专用 props 或分支。
- 每条缺陷的处理登记在 handover 有意差异表：位置、原始行为、React 行为、理由。visual-check 场景断言正确行为，不断言缺陷。
- 本规则不豁免可达状态：原始可达的功能状态仍必须重建（§5 共同完成标准 1）。

## 4. 验证要求

每次修改 `src/design` 或 `.storybook`，提交前必须完成：

1. `npm run build-storybook` 通过，且 `storybook-static/index.json` 中故事数不减少；唯一例外是按 §3.4 奥卡姆剃刀删除重复或无使用者的故事/组件，须在 handover 列出被删 story id 及其状态仍在哪个故事中可见。
2. 对受影响的页面故事与对应原始页面在 1440px（及 390px 故事）下截图并肉眼对照，判断“能否认出是同一产品、是否使用基础层 token”，不判断逐像素一致（2026-09-27 用户决定）。步骤：
   - 静态服务：`(cd storybook-static && python3 -m http.server 6007)`；仓库根目录 `python3 -m http.server 4173`。
   - 截图：`google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --user-data-dir=/tmp/chrome-<name> --window-size=1440,1400 --virtual-time-budget=5000 --screenshot=<name>.png <url>`。多张截图必须串行执行并使用不同 `--user-data-dir`。
   - 故事 URL：`http://127.0.0.1:6007/iframe.html?viewMode=story&id=<story-id>&args=<k>:<v>`。
3. 页面故事中的每个交互 props（tab、section、activeType、assistantOpen 等）至少各截一个非默认状态，与原始页面对应状态对照。
4. 新增或修改的组件在 Controls 中切换全部枚举值，无报错、无布局崩坏。

对照脚本落地为 `scripts/visual-check.mjs` 后，以脚本输出替代第 2、3 步的手工操作；脚本产出和新建的临时探针脚本均保存到 `/tmp`，不入库。

## 5. 长期规划（2026-09-23 全量重建里程碑）

本节取代旧 A–E 的机械串行安排；旧进度仅作历史证据，不等同于新里程碑完成。当前状态、分解条目、覆盖台账与接续点只在 `handover/README.md` 维护。

执行要点（由 2026-09-24 各轮审核沉淀）：

- 每个条目同时验证两件事：原始可达状态完整重建；可导入的组件或流程，以及可操作、可查阅的故事档案。基础输入故事必须真实回写，组件文档必须能查到接口与回调载荷。
- 分层边界：展示组件只接收 props；fixture 与确定性模拟放 `src/design/demo/`；跨宿主流程用 `useXxxDemo` 容器，并经 `examples/host` 与替换夹具测试验证（不同内容、生命周期、多实例、宿主导航，宿主须对照同一流程的结果）。故事内持有本地状态不违规，但需要跨宿主重用的流程不能只存在于 stories。
- 复制某类视图的模式之前，先验收它所依赖的外壳。不同内容注入和同页多实例检查穿插在各条目中进行，以便及早暴露固定 Demo 数据或全局状态耦合。
- 配对脚本断言通过与人工视觉通过分别登记；可达状态丢失是未完成项，不得以“组件生命周期”为由永久豁免。
- 接续点只记录当前状态；旧分支与旧验收数字留在历史日志。
- 任务来源：设计意图 Phase 2（通用库模式、基础层 token，已完成）按 `handover/design-intent/phase2-guide.md` 执行，冲突时以该指南为准；Phase 3（去重与收尾：共享组件、助手接线、响应式断点、`demo/` 精简）按 `handover/design-intent/phase3-guide.md`，它沿用 Phase 2 指南的规则、门禁与报告模板；全量推进用 `handover/execution-prompt.md`；结构整改用 `handover/structural-review.md`，按其波次执行；视觉与 token 清理用 `handover/design-system-cleanup.md`。`handover/structural-repair-prompt.md`（纠偏批 A–E）已完成，仅作历史。新页面沿用同一边界。

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
1. 有明确原始页面/状态/动作来源及组件映射；没有把遗漏功能登记为永久有意差异来抵消缺口。原始存根/no-op 控件按 `handover/design-intent/dispositions.md` 处置，不算“可达状态”。
2. 使用 React 组件组合完整界面；组件拥有独立语义接口、所需状态故事、可操作 Controls/Actions 和文档。允许内部私有子组件，不为满足层级命名制造无意义包装。
3. 对受影响组件与页面完成构建、实际故事交互验证和配对视觉对照；默认态、相关非默认态、长页下部/覆盖层均纳入证据。截图脚本须校验页面加载与预期状态，不能吞异常后报通过。
   场景断言应能区分错误状态；至少以一次错参数/错区块的负向检查证明它会失败。加载通过、交互断言通过、视觉人工审核通过分别记录，不能合并为无条件 PASS；证据记录构建所对应提交及工作区状态，避免旧静态产物冒充当前实现。
4. 本地状态演示原始前端流程，不依赖 assets/js 或生产服务；组件接入新宿主无需复制原始页面、原始业务脚本或中间 DOM 数据。
5. handover 登记准确的状态与证据；受阻项保持未完成并继续独立工作。一个样板、若干截图、故事数量或测试通过不能替代全量验收。

顺序：M0 → M1 最小闭环 → M2 → M3 → M4 → M5 → M6 → M7。2026-09-25 用户确认最终目标为从原始包提取完整 Storybook，采用广度优先：M3–M6 各页先做到结构正确、全部可达状态有故事与配对基线，像素收敛作为第二轮；结构整改只把直接阻碍覆盖的条目设为前置，其余与页面并行或推迟到 M7（具体条目与顺序见 `handover/structural-review.md` “第二轮决策”）。已证明共性可提前提取，遇依赖可调整局部顺序并记录原因；不得把全量任务缩减为首个里程碑。每个提交/PR仍只包含一个可独立验收的条目。

## 6. 分支与 PR 规则

- 从最新 `origin/main` 开分支。不在 `cursor/storybook-design-e61c`、`cursor/component-ablation-e61c` 及其派生分支上开发。
- 每个 PR 只推进一个里程碑内的一个可独立验收的条目。PR 描述必须包含：改动的组件列表、对照截图（或脚本输出路径）、有意差异登记。
- PR 合并后，同一 PR 内更新 `handover/README.md` 的状态表与维护日志。禁止只改代码不改 handover。
- 不修改 `index.html`、`assets/**` 中的原始 Demo，除非是修复参照物本身的明显错误（需在 PR 中单列说明），或是按 `handover/design-sync/README.md` 提交的设计师 Demo 更新（该 PR 首个提交只含 Demo 与变更说明）。

## 7. handover 维护规则

`handover/README.md` 是唯一的状态文件，结构固定为：

1. 当前状态：Storybook 版本、故事数、构建状态、最近对照日期。
2. 阶段进度表：阶段 → 条目 → 状态（未开始 / 进行中 / 完成）→ PR。
3. 有意差异表：位置 → 差异 → 理由 → 引入 PR。
4. 已知缺口：来自审核尚未排期的事实。
5. 维护日志：日期 → 变更 → 执行者。

`handover/component-plan.md` 只保留接口规则的摘要并指向本文件，不再单独维护规划。

审核与阶段结果写入 `handover/README.md`（状态、已知缺口、维护日志）。只有当结构性事实或规则本身改变时，才修改本文件的 §2.4 或 §3–§6，并且是改写现有条目，不追加。本文件不记录审核流水、构建数字或证据路径。
