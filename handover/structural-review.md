# 结构与目标偏离审查（2026-09-24）

范围：`src/design`、`examples/host`、`scripts`、`.storybook` 与治理文档，基于 `devin/story-docs-closure`（d48fc17）加审查时的工作区（其他 agent 仍在进行的 Business Term 修改未提交）。本文件只放审查结论、执行顺序和提示词。状态仍以 `handover/README.md` 为准（AGENTS.md §7）。

与 `handover/design-system-cleanup.md` 的关系：该清单列的是视觉和 token 层面的缺陷（衬线回退、TypeGrid 重叠、裸十六进制、token 膨胀、枚举类型、图片与库构建、巨型文件、故事标题）。本文件列的是结构和方向问题。两者重叠的条目在下文注明合并关系，避免两个 agent 修同一处。

## 实测数据（审查时）

| 项 | 数值 |
|---|---|
| 文件体量 | organisms.jsx 4419 行（33 个导出、19 个私有组件），organisms.css 6655 行；pages.jsx 1278 行；content.js 1703 行；demo/report-fixtures.js 2348 行 |
| 页面 props 数 | CampaignPage 49、MarketingCockpitPage 40、MediaTrackingDetailPage 30、HomePage 24、AiInterpreterPage 20 |
| 覆盖层 | 7 个（Modal、ConfirmDialog、UploadHistory、ReportDetailsDrawer、AssistantPanel、ReportCopilot、ModelFlowDialog）。其中 3 个复用 `Modal`；另 3 个各自注册 `document` keydown；ModelFlowDialog 没有 Escape。只有 `Modal` 有 Tab 焦点环 |
| 助手 | AssistantPanel 38 个 props、316 行；ReportCopilot 32 个 props、475 行，外加 11 个私有渲染组件 |
| 流程状态宿主 | 7 个页面中只有 Home 和 Cockpit 有 `useXxxDemo`；Business Term 有 `useBusinessTermDemo`（未提交）。Campaign、Self-Service、DataUpload、MediaTracking、Interpreter 其余类型的状态都写在 `pages.stories.jsx`。`examples/host/main.jsx:202` 的 `useCopilotInstance` 注释写明它 “Mirrors useCockpitDemo's workspace logic”，即复制了一份逻辑 |
| 文案归属 | pages.jsx 约 18 处、organisms.jsx 约 53 处可见文案写死，例如 Interpreter 的 “Operation Reminder” 四条规则、“Published Knowledge”、“Unknown knowledge type”、“No matching reports.”、“Sources used”、“Not helpful”、“Knowledge Title” |
| 资源 | `tokens.css` 的 `@font-face` 指向 `../../assets/fonts`；图片通过 `assetUrl()` 拼出 `/assets/images`。二者都指向只读参照物 `assets/`，库无法独立打包 |
| 覆盖面 | 17 个原始页面只有 7 个页面组件。P08–P17（10 页）未开始；P07 八类中 Principles 和 Business Term 有专用视图（Business Term 于 4d14e32 完成） |
| 测试 | `npx vitest run`：61 通过、2 失败。失败都在当时未提交的 `demo/business-term-demo.test.jsx`；4d14e32 提交后复跑 64/64 通过 |
| CI | 没有 `.github/`，M7 要求的 CI 尚不存在 |

## 结构问题

- [x] **S1 按原子层级分文件，导致设计系统原语和页面功能模块混在一起** —— 已于 `structural/s1-file-split` 完成：方案提交 d652fd8、搬迁 ad7ba3a。验证：npm test 64/64；build-storybook 通过，storybook-static/index.json 134 个 entry（73 stories + 61 docs）与基线逐 id 一致；`index.js` 导出 125 项与基线完全一致；visual-check 全量 115/115 机器通过（`/tmp/mh-s1-after2`），与 `/tmp/mh-s1-baseline/` 逐场景一致——230 对截图中 180 张字节相同、48 张仅 ±1 抗锯齿噪声、2 张 maxΔ9（原始侧同幅复现，属渲染噪声）；`--negative` 7/7 如期失败；`build:host` + `host-check` 7/7 通过；CSS 顺序对比输出 `/tmp/mh-s1-css-order/`。修复中发现并已解决：修饰类规则须随基类组件（`.mh-select--sm`→Select.css、`.mh-button--md/--gold`→Button.css），详见末尾“新发现”。
  - 现状：`organisms.jsx` 同时装着通用覆盖层、Header 这类原语，以及只服务一个页面的功能模块。例如 ReportCopilot 带 HolisticReport、PilotSalesBody、Hr* 等 11 个私有组件；还有 CityInvestDashboard、BusinessTermView、PrinciplesView。
  - 后果：文件无法按组件定位，design-sync 为此不得不手工维护 57 项 `componentSrcMap`；多个 agent 并行时反复冲突在同一文件上。
  - 方向：通用组件放 `src/design/components/<Name>/{index.jsx,<Name>.css,<Name>.stories.jsx}`，单页功能放 `src/design/features/<page>/`（例如 `features/cockpit/ReportCopilot/`）。`index.js` 仍是唯一公共入口，导出名不变。
  - 纯搬迁，零行为变化。合并 cleanup 清单的 “P3 单文件巨型模块”。
  - **拆分方案（2026-09-24，执行 `structural/s1-file-split`）**：判定标准 = 被两个以上页面/组件使用或属设计系统原语 → `components/`；否则跟随唯一使用页面 → `features/<page>/`；页面组件本身 → `pages/<PageName>/`；跨组件共享的私有模块 → `lib/`。目录内固定为 `index.jsx` + `<Name>.css` + `<Name>.stories.jsx`（stories 无 `.css` 的组件不建空文件）。故事 title/id 全部不变。

    **components/（32 个）**——atoms 6：Button（含 buttonVariants/controlSizes/buttonTypes 常量）、Link、TextInput、TextArea、Select、StatusBadge；molecules 19：SearchField（searchIconPositions/searchVariants）、CheckboxFilter、Pagination（paginationVariants）、MetricStat（metricStatVariants/metricStatAccents）、SectionHeading（headingLevels）、CategoryHeading、ViewHeading、FilterPills、Tabs（tabsVariants）、FormField（formFieldControls）、Suggestion、ScopeOption、ProgressList、ColumnChart、DataTable、SidebarItem、FilterActions、FileDropzone、Toast；共享 organisms 7：Header（headerTones/headerPositions，7 页共用）、Hero（heroVariants/heroScrims，5 页）、AssistantLauncher（6 页）、AssistantPanel（assistantPlacements + 私有 AssistantAnswer，4 页）、Modal（modalVariants，2 页 + ConfirmDialog/BusinessTermView/UploadHistory 3 个组件）、ConfirmDialog（confirmDialogTones + CONFIRM_ICON_PATH，通用覆盖原语）、ModelFlowDialog（modelFlowSteps + MODEL_FLOW_LABELS/SECTIONS，4 页 + ReportCopilot）。

    **features/**（26 个）——`home/`：WorkspaceCard、WorkspaceGrid；`cockpit/`：ProjectCard、ProjectCatalog、ProjectDirectory、ReportRow、ReportDetailsDrawer、LiveReportView、LiveOverview、CityInvestDashboard（私有 ScFilterDropdown/ScTrendChart）、ReportCopilot（私有 CopilotSegments、HrDot、HrNum、HrCell、HrTable、HrInsight、HrTrendChart、StreamBlock、HolisticReport、PilotSalesBody、CopilotChatEntry、CopilotSection、useStream、CopilotStreamContext、COPILOT_STREAM_MS、HR_SERIES_TONES）；`self-service/`：ActionCard、UploadHistory；`interpreter/`：KnowledgeSidebar、TypeCard（含 ART）、TypeGrid（含 formatTypeCount）、LibraryToolbar、AssetRow（含 STAGE_LABELS/AVAILABILITY_LABELS）、KnowledgeLibrary、PrinciplesView（私有 PrincipleDescription）、BusinessTermView（私有 SynonymClamp/BtActionButtons/btDomainTag/BT_ACTION_ICONS）、BusinessTermForm（尚无页面使用，属 interpreter/Business Term 域，为 M5 预留）；`campaign/`：CampaignRail、Panel、SummaryStrip、TaskList。

    **pages/（7 + 1 私有）**：HomePage、MarketingCockpitPage（含 cockpitViews）、SelfServicePage、AiInterpreterPage、CampaignPage、DataUploadPage、MediaTrackingDetailPage；共享私有 Shell → `pages/Shell/`（7 页共用，不导出）。

    **lib/**：`overlay.js`（useBodyScrollLock + useFocusRestore，4 个覆盖层共享）+ `overlay.css`（`body.dialog-open`）；`SkillMenu/{index.jsx,SkillMenu.css}`（AssistantPanel 与 ReportCopilot 共享的私有组件）；`story-helpers.js`（全部逐组件故事共享，原 `stories/story-helpers.js`）。其余工具原位不动：`tokens.css`、`cx.js`、`icons.jsx`、`asset-url.js`、`report-logic.js`、`report-routes.js`、`content.js`、`demo/`、`foundations.stories.jsx`、`pages.stories.jsx`（本步不拆）。

    **CSS 归属规则**：每条规则归其选择器最外层 class 的渲染方；选择器含页面作用域 class（`mh-page--*`、`mh-campaign`、`mh-interpreter`、`mh-tracking`、`mh-upload`、`mh-bulk-import`、`mh-task-dialog`、`mh-rules-hint` 等）时归该页面组件（跨组件覆盖放上层）；`mh-page`/`mh-page__offset`/`mh-page__shell` 等通用壳类归 `pages/Shell/Shell.css`；`mh-empty` 基础规则归 KnowledgeLibrary（AiInterpreterPage 的 `--unknown` 复用同元素）；`mh-count`/`mh-health`/`mh-stack`/`mh-efficiency`/`mh-recommendations` 归 CampaignPage；`mh-empty-state` 归 MarketingCockpitPage；`mh-eyebrow` 归 LiveReportView；`mh-live-toolbar/back/heading/panel` 归 LiveReportView，`mh-live-dashboard/kpi*/grid/card/chart/rank*` 归 LiveOverview；`@keyframes` 跟随使用方（mh-toast-in→Toast、mhLauncherAura→AssistantLauncher、mhAssistantModal/DrawerEnter→AssistantPanel、mh-details-in→ReportDetailsDrawer、mh-stream-blink→ReportCopilot）。顺序保证：组件 `index.jsx` 内依赖 import 在前、自身 `.css` 在后，使子组件样式先于父级覆盖排放（与原 atoms→molecules→organisms→pages 层级一致）；另写脚本对拆分前后打包 CSS 逐条比对（同选择器/同 media 的规则序列、等特异性可共匹配规则对的相对顺序），输出 `/tmp/mh-s1-css-order/`。

- [ ] **S2 覆盖层没有统一的层栈**
  - 现状：`useBodyScrollLock` 和 `useFocusRestore` 已经共享（organisms.jsx:40–82），但 Escape、焦点环、背景 inert 仍由各组件自己实现。
  - 后果：嵌套时一次 Escape 会关掉全部层（handover 登记的已知残留）；ModelFlowDialog 按 Escape 无反应；抽屉类覆盖层没有焦点环。
  - 方向：写一个 `useOverlayLayer({ open, onClose, layerRef, trapFocus })`。它维护全局层栈，只有栈顶响应 Escape；统一处理滚动锁、焦点进入、焦点环和焦点还原。
  - 7 个覆盖层全部改用它。ReportDetailsDrawer、ReportCopilot、AssistantPanel 的抽屉外壳改为组合 `Modal variant="drawer"`，或改为一个共享的 `OverlaySurface`。

- [ ] **S3 两套助手实现同一个概念，违反奥卡姆剃刀**
  - 现状：AssistantPanel 和 ReportCopilot 各自实现了抽屉外壳、头部动作（History / New Session / Maximize / Close）、历史弹层、composer、答案卡反馈、技能菜单入口。
  - 方向：提取私有的 `AssistantShell`（外壳 + 头部动作 + 历史弹层 + composer 插槽）。两个导出组件只保留各自真实不同的内容渲染：答案 feed，或 summary / scenario / holistic 流。
  - 保持导出名和 props 不变。以 visual-check 的 p01、p02-copilot、p05、p06 助手场景全部复跑作为验收。

- [ ] **S4 页面组件承担了所有状态，流程宿主不可移植**
  - 现状：页面组件 props 过多，流程状态留在 stories 里，宿主只能复制逻辑。AGENTS.md §5 要求跨宿主流程用 `useXxxDemo` 容器。
  - 方向：每个页面一个 `demo/<page>-demo.js`，至少 Campaign、SelfService、DataUpload、MediaTracking、Interpreter。故事和 `examples/host` 都只调用 hook。
  - 从 `useCockpitDemo` 中导出 `useReportCopilotDemo`，删掉宿主里的 `useCopilotInstance` 副本。
  - 页面 props 按区域分组为对象（`assistant`、`taskDialog`、`filters`），不再平铺 40+ 个。
  - 另外统一受控/非受控约定：CampaignPage 的 `taskDraft` 目前 “omit to let the page keep its own draft”，属于混用。

- [ ] **S5 文案归属不一致**
  - 现状：AGENTS.md §3.1 要求页面的全部文案走 props，但 AiInterpreterPage 仍写死统计标签、管理规则和未知类型空态（AGENTS.md §2.4 已记录，尚未修）。organisms 中的可见文案有的走 props，有的写死，没有统一规则。
  - 方向：页面组件零写死文案。有机体的可见文案统一收进一个 `labels` prop，默认值放在组件旁；aria-label 同样处理。
  - 用测试证明：替换 content 后，渲染结果不再出现默认英文文案（沿用 home-demo 的 “无默认文案泄漏” 测试写法）。

- [ ] **S6 演示数据有两个存放处，公共入口导出 1700 行 fixture**
  - 现状：`content.js`（文案加数据）在设计系统根目录，并以 `demoContent` 公开导出；`demo/report-fixtures.js` 是另一处。
  - 方向：`content.js` 按页面拆到 `demo/content/<page>.js`，原路径保留为聚合再导出，这样故事导入不必一次全改。
  - 公共入口的 `demoContent` 保留，但不能再作为组件默认值的来源。

- [ ] **S7 设计系统不自包含**
  - 现状：字体和图片都来自只读参照物 `assets/`；`examples/host` 靠 `scripts/build-host.mjs` 拷贝资源才能运行；claude.ai/design 同步靠 `.design-sync/build-dist.mjs` 内联图片兜底。
  - 方向：把组件实际用到的字体和图片复制到 `src/design/assets/`（这是复制，不修改 `assets/**`），以模块形式 import，由打包器处理。可替换的图片一律走 props。
  - 同时建立正式的库构建（vite lib mode + `exports`/`types`），把 `.design-sync/build-dist.mjs` 的临时方案收回仓库构建。
  - 合并 cleanup 清单的两条 P2：“图片依赖宿主 `/assets`” 和 “公共入口不完整”。

- [ ] **S8 Interpreter 类型视图靠三元链分派**
  - 现状：`pages.jsx` 中 AiInterpreterPage 的写法是 `type.view === "principles" ? … : "business-term" ? … : KnowledgeLibrary`，每个视图的 props 也不统一（`principles={}`、`businessTerms={}`）。M4 还要再加 6 类。
  - 方向：在 M4 继续之前，先改为视图注册表 `{ principles: PrinciplesView, "business-term": BusinessTermView, … }` 加统一的 `views[type.view]` props 契约。未注册的类型回落到通用列表，并显式标记为过渡实现。

## 目标偏离

- [ ] **A1 保真深度远超覆盖广度**
  - 现状：P02 做到 74 个配对场景，逐 bug 复刻；而 17 页中有 10 页未开始，P07 八类里 6 类仍是占位。AGENTS.md §1 的首要目标是全量覆盖。
  - 建议：S1–S8 完成后切到广度优先。每个未开始的页面先做一遍结构正确、主要状态可达的实现，配对截图作为基线；像素级收敛放到第二轮。
  - 需要用户在 AGENTS.md §5 的顺序说明里确认。

- [ ] **A2 原始 Demo 的逻辑缺陷被固化进组件**（2026-09-24 用户已确认规则，已写入 AGENTS.md §3.5；待执行回退）
  - 规则：视觉按原样复刻；逻辑缺陷不进入组件，只能通过 `demo/` 层的 fixture 或 hook 参数重现，并在有意差异表登记。
  - 已知需回退的条目（清单同 AGENTS.md §2.4，执行时以源码核实为准，发现新条目就补上）：
    - CityInvestDashboard：城市筛选恒显 “All Stores”；`isDefault` 永假导致默认态也走种子扰动；空选回 “Total”。
    - AssistantPanel：`submitDisabled` 专为复刻 Home 历史回填后 ASK 不恢复的 quirk 而加；关闭时只按变体复位 expanded（closeAi quirk）。
    - ReportCopilot：History 条目因 `.ai-workspace-head span` 级联泄漏被大写。
    - Campaign 答案卡：“AI ResponseContext” 横幅缺样式（原 `.answer-card-header` 无匹配规则）。
    - handover 中所有写着 “如实复刻” 或 “quirk” 的条目逐一复核。

- [ ] **A3 规则文件和状态文件都在膨胀，并且角色互相渗透**（AGENTS.md 部分已于 2026-09-24 完成；handover 部分待做）
  - 已完成：AGENTS.md §2.4 改为 “当前仍成立的结构性事实”，原审核流水原文迁入 handover/README.md §2.5；§5 导语浓缩为执行要点并标注各 prompt 文件的角色（structural-repair-prompt 标为历史）；§7 改为审核结果只写 handover，AGENTS 只在事实或规则改变时改写（25.4 KB → 19.7 KB）。
  - 待做：`handover/README.md`（迁入历史后约 420 行）中单行超过约 400 字的段落拆成列表；§2.3 逐页盘点保持在原位置，但每页压缩为 “可达状态 / 已实现 / 缺口” 三段；不改变 AGENTS.md §7 规定的五节结构。

- [ ] **A4 仓库卫生**
  - 根目录 `README.md` 仍以 “Marketing Hub AI v20.11 静态基线” 为主体，并称 Pages 有 5 个故事（实际 7 个）。
  - `docs/cleanup-manifest.json` 含其他工具的 Windows 绝对路径（`D:/公司文件/...`、`C:\Users\Admin\.codex\...`）。
  - 已入库 `.cursor/environment.json` 和 `assets/.codebuddy/memory/*.md`。后者在参照物目录内，按 AGENTS.md §6 删除需在 PR 中单列说明。
  - 没有 CI。建议最小的 GitHub Actions：`npm ci && npm test && npm run build-storybook`。远端已在 https://github.com/wu2305/marketinghub。

## 执行顺序

前置（用户做）：
1. 让正在修改 Business Term 的 agent 提交它的工作，修好 2 条失败的测试，确保工作区干净。S1 是全仓搬迁，与任何在制品都会冲突。
2. ~~对 A2 和 A3 做决定~~ 已完成：A2 规则已确认并写入 AGENTS.md §3.5；A3 的 AGENTS.md 部分已完成。

| 波次 | 条目 | 并行性 | 依赖 |
|---|---|---|---|
| 1 | S1 文件拆分 | **独占**：执行期间不得有其他 agent 修改 `src/design` | 工作区干净 |
| 2 | S2 覆盖层栈；S5 文案归属；S6 数据归位；S8 视图注册表；A4 卫生 + CI；A3 handover 精简 | 可 2–3 个 agent 并行，各自开分支，改动的目录不相交 | S1 |
| 3 | A2 缺陷回退 → S3 助手合并 → S4 页面 hook 化 | 串行（三者都改 AssistantPanel/ReportCopilot；A2 先回退，避免 S3 把缺陷分支一并合并进共享外壳） | S2 |
| 4 | S7 自包含资源 + 库构建（含 cleanup 两条 P2） | 单独进行 | S1 |
| 5 | A1 广度优先推进 M4–M6；cleanup 清单剩余条目 | 按页面并行 | 1–4 |

每完成一波，重新运行 `/design-sync`：组件路径和源码变化会触发重新截图与评级，这是预期行为。S1 完成后，`.design-sync/config.json` 的 `componentSrcMap` 和 `storyImports.shim` 需要更新；S7 完成后，`.design-sync/build-dist.mjs` 应删除。

## 提示词

### 通用前言（每个 agent 的提示都以此开头）

```text
你在 /Users/wuhaocheng/Documents/repos/marketinghub 工作。开始前完整阅读：AGENTS.md（长期规范，冲突时以其为准）、handover/README.md（当前状态）、handover/structural-review.md（本次任务来源）、handover/design-system-cleanup.md（相关视觉清单）。

通用约束：
- 从最新 main 开分支（git fetch 后 git switch -c <分支> origin/main；远端 github 为 https://github.com/wu2305/marketinghub，origin 为原始远端）。一个条目一个分支，一个可独立验收的改动一个提交。
- 不修改 index.html 与 assets/**。
- 导出名、公共 props 与回调载荷保持兼容，除非条目明确要求改变；改变时同步更新故事 argTypes、JSDoc、src/design/index.js、examples/host、测试。
- 验证（全部要做，结果写进 handover）：npm test 全绿；npm run build-storybook 通过且 storybook-static/index.json 故事数不减少；node scripts/visual-check.mjs 对受影响场景复跑（先构建，脚本会拒绝过期构建），并跑 --negative 确认负向用例仍失败；npm run build:host && node scripts/host-check.mjs 通过。
- 视觉必须零回归：纯重构条目的配对截图与改动前一致；如有像素差异，找出原因并修复，不得登记为有意差异了事。
- 完成后：在 handover/structural-review.md 勾选条目并写一行证据（提交号 + 命令输出/截图路径）；按 AGENTS.md §7 更新 handover/README.md（状态、有意差异、维护日志）。不要创建新的状态文件。
- 发现本条目范围外的问题：记到 handover/structural-review.md 末尾“新发现”一节，不顺手修。
```

### S1 文件拆分（独占执行）

```text
[通用前言]

任务：handover/structural-review.md 的 S1。把 src/design/{atoms,molecules,organisms,pages}.{jsx,css} 拆为按组件的目录，零行为变化。

1. 先提交一份拆分方案到 handover/structural-review.md 的 S1 条目下（不写代码）：每个导出组件和私有组件 → 目标路径的完整映射表。
   - 通用组件：src/design/components/<Name>/。
   - 单页功能：src/design/features/<page>/<Name>/。
   - 判定标准：是否被两个以上页面或组件使用，或是否是设计系统原语。
   - 私有子组件跟随唯一的使用者；被多个组件共享的私有 hook（useBodyScrollLock、useFocusRestore 等）放 src/design/lib/。
2. CSS 按选择器拆分到对应组件。拆分前后，用脚本对比合并后的规则顺序，确认层叠结果不变：顺序敏感的覆盖规则必须保持原有的相对顺序；跨组件的选择器要标注出来，并放在上层组件的样式里。
3. 故事文件移到组件目录旁；更新 .storybook/main.js 的 stories glob；story id 保持不变（title 不改），这样 visual-check 场景无需修改。
4. src/design/index.js 继续是唯一公共入口，导出列表完全一致（用脚本对比改动前后的 Object.keys(await import(...))）。
5. 更新 .design-sync/config.json 的 componentSrcMap 与 storyImports.shim 指向新路径；更新 AGENTS.md §2.3 的代码位置描述。
6. 验证：通用前言的全部验证，加上 visual-check 全套场景（不只受影响场景），机器结果与拆分前逐场景一致。
一个提交完成整个搬迁（中途不留半拆状态），提交说明附映射表链接。
```

### S2 覆盖层栈

```text
[通用前言]

任务：handover/structural-review.md 的 S2。建立统一的覆盖层栈，7 个覆盖层全部改用它。
1. 在 src/design/lib/ 新增 useOverlayLayer({ open, onClose, layerRef, initialFocusRef, trapFocus = true })。
   - 用一个模块级栈记录已打开的层，只有栈顶响应 Escape，以 onClose({ reason: "escape" }) 回调。
   - 复用或合并现有的 useBodyScrollLock、useFocusRestore；焦点环逻辑从 Modal（组件内处理 Tab 的那段）提取出来。
   - 多实例、StrictMode 双挂载、宿主多个 React root 都要正确：栈按 document 维度划分，不能是跨文档共享的单例。
2. 改造 Modal、ConfirmDialog、UploadHistory、ReportDetailsDrawer、AssistantPanel、ReportCopilot、ModelFlowDialog。ModelFlowDialog 新增 Escape 关闭，回调载荷沿用现有的 onClose({ reason })。
3. lifecycle.test.jsx 增加以下测试：
   - 嵌套两层时，第一次 Escape 只关上层，第二次关下层；
   - 焦点依次还原到各层的触发者；
   - 滚动锁在最后一层关闭时才释放；
   - Tab 在栈顶层内循环；
   - 双实例互不干扰。
4. 在 handover/README.md 的已知缺口中移除 “嵌套覆盖层一次 Escape 关闭所有层” 这条残留，并注明证据。
visual-check 中所有 escape、scrim、focus 相关场景（p02-copilot-escape/-scrim/-focus、p01、p06 助手场景等）必须复跑通过。
```

### S3 助手合并

```text
[通用前言]

任务：handover/structural-review.md 的 S3。AssistantPanel 与 ReportCopilot 共享一个私有 AssistantShell，消除重复实现。
1. 先逐项对照两者的外壳：抽屉尺寸、scrim、头部动作、History 弹层、composer（textarea、hint、发送按钮、技能菜单入口）、Maximize/Restore、New Session、答案反馈。
   - 列出共同部分与真实差异（含各自的原始来源：portal.js、assistant-panel-lite.js、report-core.js 的 aiWorkspace），写进 S3 条目。
2. 提取 AssistantShell（私有，不导出），用插槽承接差异：头部标题区、stage/起始区、feed 区、composer 附加区。
   - 两个导出组件的 props 与回调载荷不变；各自的私有渲染组件保留在自己的 feature 目录。
3. 差异通过 props 表达，例如 lite、variant、enterToSubmit、hideStageOnAnswers，不写 if(copilot) 这类分支。
   - 若某个差异无法干净地参数化，保留两份实现并在 S3 条目说明理由。奥卡姆剃刀要求的是去掉同构的重复，不是强行合并不同的东西。
4. 验收：visual-check 的 p01-home-*、p02-copilot-*（22 个）、p05 助手、p06-assistant-* 全部机器通过；截图与合并前一致。
```

### S4 页面流程 hook 化

```text
[通用前言]

任务：handover/structural-review.md 的 S4。让每个页面的演示流程可以跨宿主复用。前置：S3 已合入。
1. 为 Campaign、SelfService、DataUpload、MediaTracking、Interpreter（全部类型，Business Term 已有 useBusinessTermDemo 的，在其上组合）各建一个 demo/<page>-demo.js。
   - 做法沿用 useHomeDemo / useCockpitDemo：内容通过参数注入，返回页面 props。
   - 把 pages.stories.jsx 中对应的 useState 和处理函数迁入 hook，让故事只调用 hook。
2. 从 useCockpitDemo 中拆出并导出 useReportCopilotDemo；删除 examples/host/main.jsx 里的 useCopilotInstance 副本，改用导出的 hook。
3. 页面 props 按区域分组（assistant、taskDialog、filters、skillFlow 等已经部分如此），平铺的 props 数降到能在 Controls 面板中读懂的程度。
   - 这会改变页面组件接口：同步更新 JSDoc、故事、宿主、测试，并在 handover 登记接口变更。
4. 受控约定统一为：页面组件完全受控，不自持草稿；状态由 hook 持有。去掉 CampaignPage 的 “omit taskDraft 则页面自持” 这类双模式。
5. 每个 hook 配一个测试文件，测试内容参照 home-demo.test.jsx：用替换夹具时无默认文案泄漏、双实例隔离、关闭重开的状态语义与原始一致。
6. examples/host 为每个页面加一个挂载路由，host-check 增加对应检查。
```

### S5 + S6 + S8 文案归属、数据归位、视图注册表（一个 agent，三个提交）

```text
[通用前言]

任务：handover/structural-review.md 的 S5、S6、S8，按 S6 → S8 → S5 顺序，每条一个提交。
S6：
- content.js 按页面拆到 src/design/demo/content/<page>.js；src/design/content.js 暂留为聚合再导出（加注释说明它只供故事和宿主使用）。
- 确认 src/design 下的任何组件都不 import demo/ 或 content（加一条测试扫描 import 图，发现即失败）。
S8：
- AiInterpreterPage 的类型视图分派改为注册表，统一 views[type.view] 的 props 契约。
- 未注册类型回落 KnowledgeLibrary，并加 data-transitional 标记，便于 visual-check 识别过渡实现。
S5：
- AiInterpreterPage、MarketingCockpitPage 等页面组件的写死文案全部改为 props，默认 args 来自 demo/content。
- 有机体的可见文案与 aria-label 收进 labels prop（组件旁定义默认值并导出，故事 argTypes 引用）。先列出清单写进 S5 条目，再统一修改。
- 测试：给每个页面组件传一份替换文案夹具，断言渲染结果中不出现任何默认英文文案。
视觉零回归。
```

### S7 自包含资源 + 库构建

```text
[通用前言]

任务：handover/structural-review.md 的 S7，同时完成 handover/design-system-cleanup.md 中 “图片依赖宿主 /assets” 与 “公共入口不完整” 两条 P2。
1. 把组件实际引用的字体和图片复制到 src/design/assets/（只复制，不改 assets/**）。
   - tokens.css 的 @font-face 改为相对该目录；图片改为模块 import。
   - Header 默认 logo、TypeCard 的 ART 等可替换图片改为 props，默认值为 import 的资源。
   - 大图（>300KB）先评估压缩或只在 demo 层使用。
2. 删除 asset-url.js 与 BASE_URL 依赖；examples/host 不再需要 build-host 拷贝资源，简化 scripts/build-host.mjs。
3. 正式库构建：vite lib mode，产出 ESM、合并后的 CSS（包含 tokens.css）和 .d.ts（TypeScript 5 由 JSDoc 生成）；在 package.json 配置 exports/types/files/sideEffects（CSS）。src/design/index.js import tokens.css。
4. 删除 .design-sync/build-dist.mjs，把 .design-sync/config.json 的 buildCmd 改为仓库的库构建命令；更新 .design-sync/NOTES.md。
5. 验证：在一个 /tmp 下的全新 vite 项目中，通过 npm pack 产物安装，不配置任何 staticDirs 或 publicDir，能渲染 Header、TypeGrid、Home 页面，字体与图片正常。
```

### A4 仓库卫生 + 最小 CI

```text
[通用前言]

任务：handover/structural-review.md 的 A4。
1. 重写根目录 README.md：以 React 设计系统为主体（安装、Storybook、测试、宿主示例、公共入口、handover 位置），静态 Demo 作为 “参照物” 一节简述；故事数不要写死。
2. docs/cleanup-manifest.json：确认用途后删除，或去除外部绝对路径。
3. 移除已入库的 .cursor/environment.json（加入 .gitignore）。
4. assets/.codebuddy/memory/*.md 是参照物目录内的工具记忆文件：按 AGENTS.md §6，删除需在 PR 描述中单列说明。
5. 新增 .github/workflows/ci.yml：Node 版本与本地一致，npm ci → npm test → npm run build-storybook → npm run build:host && node scripts/host-check.mjs。visual-check 依赖本地参照服务与浏览器，CI 暂不跑，在 README 中说明。
6. 推送到 github 远端，确认 Actions 首次运行通过，把运行链接写进证据。
```

### A2 参照物缺陷回退（波次 3，在 S3 之前）

```text
[通用前言]

任务：handover/structural-review.md 的 A2。按 AGENTS.md §3.5 把原始 Demo 的逻辑缺陷从组件中移除。
1. 先盘点：从 AGENTS.md §2.4 “参照物缺陷已进入组件” 的清单出发，再在 handover/README.md 中搜索 “如实复刻”“如实保留”“quirk”“原缺陷”，逐条核对原始源码位置（assets/js/...:行号）与当前组件实现。
   - 把结论写进 A2 条目，每条一行：原始行为 / 是否属于 §3.5 定义的逻辑缺陷 / 处理方式。
   - 视觉效果（尺寸、颜色、文案）不在本条范围内；只是罕见但合理的原始行为不算缺陷。拿不准的标为 “待决”，交给用户，不自行决定。
2. 逐条修正组件，让它实现明显的设计意图。例如：
   - CityInvestDashboard 的城市筛选按实际选择显示；默认态使用基线数据而不是种子扰动。
   - Home 历史回填后 ASK 可用；删除仅为复刻 quirk 而存在的 `submitDisabled`。
   - 若配对截图需要重现原始行为，改由 demo 层的 fixture 或 hook 参数控制，组件不保留缺陷分支。
3. visual-check 中断言缺陷的场景（如 p01-home-history-quirk、p01-home-assistant-open 的 ASK 禁用断言、p02-live-city 的 +14%/0.3K/5,121 数值）改为断言正确行为；重新生成配对基线，原始截图保留作参照，差异在有意差异表登记。
4. 更新 AGENTS.md §2.4：删去已回退的条目，按 AGENTS.md §7 改写，不追加。每回退一类缺陷做一个提交。
```

### A3 handover 精简（波次 2，可与其他条目并行）

```text
[通用前言]

任务：handover/structural-review.md 的 A3 “待做” 部分。只改 handover/README.md 的排版，不改任何事实、状态或证据。
1. 把单行超过约 400 字的段落拆成列表，每条一个事实，保留全部提交号、场景名与证据路径。
2. §2.3 的每页盘点压缩为三段：可达状态 / 已实现 / 缺口。被取代的历史描述移到 §2.5。
3. 保持 AGENTS.md §7 规定的五节结构。
4. 验证：对改动前后的文件，用脚本抽取全部 `提交号`、`p0x-` 场景名和 `/tmp/` 路径，两份集合必须完全一致。
```

### A1 广度优先（S 系列完成、用户确认 A1 后）

```text
[通用前言]

任务：按 handover/structural-review.md 的 A1，以广度优先推进 M4–M6。当前顺序：P07 剩余六类（Report Context、Data Model、Metric Dictionary、Analytical Model、Scenario Reporting、Email Reports）→ P08/P09 → P10/P11 → P12–P14 → P15–P17。
每页的做法：
1. 按 handover/README.md §2.3 的格式补全该页台账行：可达状态、组件映射、复用关系。
2. 用现有组件组合出结构正确、主要状态可达的页面或视图。新组件放 features/<page>/，只有被第二个页面用到时才提升到 components/。
3. 建 demo/<page>-demo.js 与故事，examples/host 加路由。
4. visual-check 增加默认态加一个非默认态的配对场景，作为基线；人工审图结果如实登记 pass/fail，fail 的像素收敛列入第二轮。
每页一个提交。一页完成后立即进入下一页，不要在同一页上追求像素级收敛。
```

## 新发现（S1 执行期间，2026-09-24）

以下问题在 S1 搬迁中暴露；第一条已在 S1 内修复（不修则视觉回归），其余登记备查，不在本条修复。

- **构建期 CSS chunk 顺序不保持源 `import "*.css"` 语句顺序（已随 S1 修复）**。Vite/Rollup 对 story 这类动态入口生成 dep 数组时，组件自身 css 排在它 import 的跨组件 css 之前。结果：`.mh-select`（13px）反超 `.mh-select--sm`（12px），Interpreter 工具栏 select 文字变宽约 6%——像素对比实测捕获，机器断言与几何检查均不能发现。约定（已写入 AGENTS.md §3.2）：`mh-x--*` 修饰类规则必须放在基类组件自己的 css 里。已修正：`.mh-select--sm`→`Select.css`；`.mh-button--md`、`.mh-button--gold`/`:hover`/`:focus-visible`→`Button.css`（原 atoms.css 本就如此归属）。
- **拆分私有声明时的隐性跨模块依赖**：`Shell`（7 页共用）、`SkillMenu`（AssistantPanel/ReportCopilot 共用）、`useBodyScrollLock`/`useFocusRestore`（4 个覆盖层共用）在单文件里是私有顶层声明，拆分后必须显式 export + import；静态 import 推导只看导出符号会漏掉它们（已补，归入 `pages/Shell/` 与 `lib/`）。
- **基线 CSS 中 tokens.css 被内联 4 份**：拆分前 atoms/molecules/organisms/pages.css 各自 `@import "./tokens.css"`，最终样式表含 4 份 `:root`/reset/`@font-face`；拆分后各组件统一经 JS 层 import，每份只出现一次。`:where()` reset 零特异度，无行为差异。
- **`index.js` 的 `export * as demoContent from "./content.js"` 属命名空间导出**，静态导出对比脚本若只认 named-export 语法会误报缺失。
- **`.design-sync/sb-reference/` 是拆分前的旧 Storybook 快照**（已 gitignore，不影响构建）；下次 design-sync 运行时会自然刷新，无需手工维护。
