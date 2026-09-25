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

- [x] **S2 覆盖层没有统一的层栈**（PR #5 已完成；共享生命周期，保留各真实外壳；验证见 README §1/§5）
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

- [x] **S8 Interpreter 类型视图靠三元链分派** —— 2026-09-25 完成（df06211）：`AiInterpreterPage` 改 `typeViews[type.view]` 注册表分派（principles→PrinciplesView、"business-term"→BusinessTermView），未注册类型回落 `KnowledgeLibrary` + `data-transitional="true"`；统一 props 契约落地——视图收已过滤/已分页数据 + 受控状态 + 回调，筛选/分页为 `demo/interpreter-demo.js` 的导出纯函数，由 `useInterpreterDemo` 驱动；快捷键改 `lib/search-shortcut.js` 实例级分派 + 双实例测试。
  - 原现状：`pages.jsx` 中 AiInterpreterPage 的写法是 `type.view === "principles" ? … : "business-term" ? … : KnowledgeLibrary`，每个视图的 props 也不统一（`principles={}`、`businessTerms={}`）。M4 还要再加 6 类。

## 目标偏离

- [x] **A1 保真深度远超覆盖广度**（2026-09-25 用户决定采纳，见“第二轮决策”D1）
  - 现状：P02 做到 74 个配对场景，逐 bug 复刻；而 17 页中有 10 页未开始，P07 八类里 6 类仍是占位。AGENTS.md §1 的首要目标是全量覆盖。
  - 建议：S1–S8 完成后切到广度优先。每个未开始的页面先做一遍结构正确、主要状态可达的实现，配对截图作为基线；像素级收敛放到第二轮。
  - 需要用户在 AGENTS.md §5 的顺序说明里确认。

- [x] **A2 原始 Demo 的逻辑缺陷被固化进组件**（PR #2 已完成；八项源码审计与有意差异见 README §3）（2026-09-24 用户已确认规则，已写入 AGENTS.md §3.5；已执行回退）
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

- [x] **A4 仓库卫生** —— 2026-09-25 完成（8601270 + 898ab8d CI 修复）：README 重写为 React 设计系统主体（静态 Demo 降为“参照物”节，故事数不写死）；`cleanup-manifest.json` 去除 Windows 绝对路径（映射/哈希保留为溯源）；`.cursor/environment.json` 取消跟踪 + gitignore；`assets/.codebuddy/memory/*.md` 删除（§6 要求已在提交说明单列）；新增 `.github/workflows/ci.yml`（npm ci→lint→test→build-storybook→build:host→playwright→host-check），首个通过 run https://github.com/wu2305/marketinghub/actions/runs/36060649232；visual-check 留本地（README 注明）。

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

## 第二轮对抗审查（2026-09-25，基于 `structural/s1-file-split` 1dd1d7d）

范围：S1 搬迁后的 `src/design`、`examples/host`、`scripts`、`.storybook`、handover 与原始参照物交叉核对。只列上文 S1–S8 / A1–A4 **没有覆盖或覆盖不足**的问题；与已有条目重叠处写明“并入 Sx”，由原条目的执行者一并处理。复核时 `npx vitest run` 64/64 通过。

### 发现

- [x] **R1 S1 未合入 main，而全部后续提示词要求“从最新 main 开分支”（阻断）** —— 2026-09-25 已完成：main 快进 2daa11e→41d6053，已推送 github 与 origin。合入前复核：npm test 64/64；build-storybook 73 stories + 61 docs（与 S1 基线一致）；build:host + host-check 7/7。自 S1 全套 visual-check 115/115 以来仅文档变更，未重跑 visual-check。未走 PR（直接快进）。
  - 证据：`origin/main` = `github/main` = 2daa11e；`structural/s1-file-split` 领先 3 个提交（d652fd8、ad7ba3a、1dd1d7d），无 PR。AGENTS.md §2.3/§2.4 已按拆分后的目录描述代码并引用 ad7ba3a，main 上的规则与 main 上的代码不一致。
  - 后果：波次 2 的 agent 按通用前言 `git switch -c <分支> origin/main` 会拿到拆分前的 `organisms.jsx` 单文件，要么在旧结构上开发，要么与 S1 大面积冲突。
  - 处理：先为 S1 开 PR 并合入 main（快进即可），之后才启动任何波次 2 条目。顺带：`origin` 上仍有 `cursor/storybook-design-e61c`、`cursor/component-ablation-e61c` 等 7 个 cursor/* 旧分支（AGENTS.md §2.2 要求关闭 #1、#5），由用户决定是否删除远端分支。

- [ ] **R2 P03 Self-Service 与 P07 AI Interpreter 的助手面板丢失（可达状态缺口，未登记）**
  - 原始：`assets/pages/flexible.html:196–211` 与 `assets/pages/knowledge.html:1705` 起都有 `#aiEntry` + 完整 `#assistantPanel`；`assets/js/self-service/workspace.js:554` 点击调用 `openAssistant("report")`，`assets/js/knowledge/workspace.js:2682` 调用 `openAssistant("knowledge")`（`overview-home.js:57` 另有程序化触发）。
  - React：`pages/SelfServicePage/index.jsx:80` 与 `pages/AiInterpreterPage/index.jsx:187` 的 launcher 只发 `onNavigate({ id: "assistant" })`，页面没有任何 assistant props，故事和宿主也没有面板状态。
  - 这违反 AGENTS.md §5 共同完成标准 1，且 handover §4 与有意差异表都未记录。同页全盘点：原始有 launcher+panel 的页面是 index、reports、flexible、knowledge、campaign、feedback-quality；其余页若有助手，由 `assistant-panel-lite.js` 动态注入（P05 已按此重建），P12–P17 盘点时须按同一口径核实。
  - 处理：作为 M3（P03）与 M4（P07）各一个条目补建，复用 `AssistantPanel`，状态进 demo hook（与 S4 一致）。

- [ ] **R3 页面助手预设的归属不一致，宿主被迫知道原始 quirk 开关**（并入 S3/S4）
  - Home、Campaign、MediaTracking 在页面组件内部写死 `showPicks={false}`、`enterToSubmit={false}`；Cockpit 却要求调用方通过 `assistant` 传入 `showScopes:false, showPicks:false, hideStageOnAnswers:true, enterToSubmit:false`，`src/design/pages.stories.jsx:92` 与 `examples/host/main.jsx:191` 逐字重复这一行。
  - 后果：新宿主必须抄写这些行为开关才能得到正确的 Cockpit 助手，这正是 AGENTS.md §1“只 import 组件即可搭页面”要避免的。
  - 处理：页面自己知道自己是哪种助手，预设放在页面组件内（或其 demo hook 的默认值），调用方只传内容；验收时宿主与故事中不再出现上述开关名。

- [x] **R4 Interpreter 列表筛选有三种所有权模式**（并入 S8）—— 2026-09-25 随 df06211 完成：筛选/分页统一归 `demo/interpreter-demo.js`（纯函数 + `useInterpreterDemo`），页面组件零过滤；视图收已过滤结果 + 受控 `query/filters/page` + 回调；“/”与 Cmd/Ctrl+K 改 `lib/search-shortcut.js` 实例级（焦点所在实例优先，否则最近挂载），双实例测试覆盖。
  - 原状存档：通用类型由页面内过滤、Principles 视图自过滤、Business Term 由 `useBusinessTermDemo` 过滤；`document` 级快捷键使两个实例互抢焦点。

- [ ] **R5 公共入口把演示层当库 API 导出；组件层存在越层 import，且没有检测**（并入 S7，边界检测可提前做）
  - **(a) 已完成 2026-09-25（eec96d3）**：`eslint.config.js`（flat：JSX 解析 + `no-unused-vars` + react-hooks 两规则）与 `npm run lint`；`src/design/boundaries.test.js` 断言三层 import 边界（components/ 不碰 features|pages|demo|content.js|report-logic|report-routes；features/<p>/ 不跨页不碰 demo/content；pages/ 不碰 demo/content），当前零违规零白名单。死 import 已清：`Pagination` 的 `totalLabel`、`ModelFlowDialog` 的 `Select` 等。5 条既有 exhaustive-deps 警告保留可见。
  - `src/design/index.js` 同时导出 `useCockpitDemo`/`useHomeDemo`/`useBusinessTermDemo`（:255–257）、`report-demo.js` 的场景函数（:266）、`report-routes.js` 中写死原始 Demo URL 的路由函数（:253）、`demoContent`（:227），以及 26 个仅服务单页的 feature 模块。S7 的库构建若照此发布，演示夹具和原始 URL 就成了公开契约。
  - `cx.js` 除 `cx` 外还放了 `normalizeOptions`、`recordMatchesFilter`、`uniqueFilterOptions` 这类领域筛选逻辑；`report-logic.js`、`report-routes.js` 只服务 Cockpit 却位于设计系统根目录。
  - 待做（b，S7 时）：拆成两个入口——库入口（components + features + pages + tokens）与 `./demo` 子路径（hooks、fixtures、content、report-demo/routes）；`report-logic.js` 移到 `features/cockpit/lib/`，筛选函数移出 `cx.js`。

- [ ] **R6 导航契约绑定在原始 Demo 的 URL 空间上**（2026-09-25 已决定：新页面用约定，存量迁移推迟到 M7，见 D2）
  - 默认 href 全是 `/index.html`、`/assets/pages/*.html?…`（`report-routes.js`、`content.js` 的 NAV）。Storybook 要靠 `.storybook/preview.js` 的 `DemoLinkGuard` 吞掉这些点击，宿主要靠 `examples/host/main.jsx:61–75` 的 `ROUTE_MAP`/`mapDemoHref` 逐页翻译。Cockpit 为此开了 `projectHref/liveHref/contextHref/backHref` 四个函数 props，其他页面各有各的做法。
  - P08–P17 之间交叉链接密集（knowledge-create/view、review-center ↔ knowledge、scenario-*），照现状推进会让每个宿主的翻译表和每个页面的 href props 同步膨胀。
  - 建议：统一为“路由 id + 参数”——组件发 `onNavigate({ id, params, href })`，href 由一个 `hrefFor(id, params)` 解析器生成（页面一个 prop 或一个 context），原始 Demo URL 的解析器放 `demo/`；Cockpit 的四个 href props 收敛为它。这改变公共接口，需用户确认后作为 M1 条目执行。

- [x] **R7 共享登记文件是并行冲突热点，波次 2 的“2–3 个 agent 并行”在现状下做不到** —— 2026-09-25 完成（分支 `structural/r7-split-hotspots`，两个提交）：
  - `scripts/visual-check.config.mjs` 3605 行，230 个场景在一个默认导出数组里；`src/design/pages.stories.jsx` 735 行装着全部 7 个页面故事和它们的状态；`content.js` 1703 行；`index.js`。S2–S8、A2 和每个新页面都要改其中至少两个。S1 解决了组件文件的冲突，没有解决这些文件。
  - 处理（纯搬迁，零行为变化，R1 合入后立刻独占执行）：visual-check 场景按页拆为 `scripts/visual-check/scenarios/p01.mjs … p07.mjs`，由聚合文件按原顺序拼回（`--only`/过滤参数行为不变）；页面故事拆到 `pages/<Page>/<Page>.stories.jsx`，title 与 story id 不变（脚本只引用 `pages--*` id，已核实 115 处）；content.js 的按页拆分仍由 S6 做。
  - 证据：a7d4478 场景拆分（`common.mjs` + 7 个 p0x 模块；深比较聚合默认导出与拆分前 115 场景一致）、fa06b57 页面故事拆分（7 个 `pages/<Page>/<Page>.stories.jsx`，meta title 仍 `"Pages"`，`pages--*` id 集合与拆分前一致）。`visual-check.mjs` 的 `CONFIG_FILES` 已纳入全部场景模块，构建戳覆盖断言集。验证：npm test 64/64、build-storybook 73 stories + 61 docs、visual-check 115/115（`/tmp/mh-r7-full`）、negative 7/7、host-check 7/7。

- [ ] **R8 tokens.css 的 reset 会作用到调用方传入的插槽内容**（并入 cleanup 清单或 S7）
  - `tokens.css:42–57` 用 `:where([class*="mh-"], [class*="mh-"] *)` 重置盒模型、按钮、链接。宿主传给 `Hero`、`Modal`、`Panel` 等的 `children` 都位于 `mh-*` 祖先之内，同样被重置；`host-check` 的哨兵只放在所有 `mh-*` 容器之外，测不到这种情况。
  - 另外 65 个组件模块各自 `import tokens.css`，只引入一个组件也会注入全部 `@font-face` 与 `:root`。
  - 处理：在 host compose 页加一个“插槽内哨兵”（宿主按钮/链接放进 Hero 或 Modal 的 children），先用断言确认现状，再决定 reset 改为只命中组件自身元素（例如 `.mh-x` 本身而不是 `[class*="mh-"] *`）还是登记为有意行为。

- [x] **R9 handover §1 的状态表自相矛盾，而 A3 只允许改排版** —— 2026-09-25 完成：全套验证在 898ab8d 对应内容上跑过一遍（npm test 65/65、lint 0 errors/5 warnings、build-storybook 66+53、host-check 7/7、visual-check 115/115 + negative 7/7、CI 绿 run 36060649232）；§1 各行按本次结果重写并注明提交号与证据路径，过期行原文移 §2.5；§2.1 的 `devin/story-docs-closure` 改为合入提交 4d14e32。
  - 原状存档：同一张表里“63 stories + 5 docs”“73 + 61 docs”“105/105”“115/115”并存；M4 行写分支名。

- [x] **R10 Storybook 分类与代码结构不一致**（与 R7 同做）—— 2026-09-25 完成：26 个 `features/*` 故事 title 由 `Organisms/…` 改为 `Features/<Page>/<Name>`（共享组件保留 Atoms/Molecules/Organisms）。visual-check 只引用 `pages--*`，配对不受影响；`stories.test.jsx` 不按 title 断言。AGENTS.md §3.4 增补 title 约定，§2.3/§2.4 改为页面故事在 `pages/<Page>/<Page>.stories.jsx`。story id 映射：`organisms-<slug>--default` → `features-<page>-<slug>--default`（26 条，逐条见 handover §2.5 日志）。
  - 26 个 `features/*` 故事原以 `Organisms/…` 为 title，读者无法区分可复用组件和单页模块；AGENTS.md §3.4 仍按 Atoms/Molecules/Organisms 表述规则。visual-check 只引用 `pages--*`，改 title 不影响配对；`stories.test.jsx` 可能断言 title，改时同步。
  - 处理：features 改为 `Features/<Page>/<Name>`，components 保留原 Atoms/Molecules/Organisms（已写进 AGENTS.md §3.4）。

- [x] **R11 结构整改队列本身在推迟覆盖**（2026-09-25 用户决定采纳，见 D1/D3）
  - 现行执行顺序把 S2–S8、A2–A4（10 项以上、4 个波次）全部排在 P08–P17 与 P07 其余六类之前。AGENTS.md §5 M1 明确写“不等待一个预想中的完整框架才开始页面工作”。覆盖现状 7/17 页，P07 八类中六类仍是占位，另有 R2 两处助手缺失。
  - 建议：只把直接降低广度推进成本的条目设为前置——R1（合入）、R7（拆热点文件）、S8+R4（视图注册与筛选契约）、R6（导航方案决定）。S2、S3、S5、S7、A2、A4 与 P07 其余六类、R2 并行推进；S4 不再单独成波，而是每个页面条目自带自己的 demo hook（新页面从一开始就按 hook 写）。这需要用户在 AGENTS.md §5 的顺序说明中确认（与 A1 一起决定）。

### 修订后的执行顺序（已被下文“第二轮决策”的 D4 表取代，保留作对照）

| 步 | 条目 | 并行性 | 前置 |
|---|---|---|---|
| 0 | R1 合入 S1（用户或 lead 执行） | 独占 | — |
| 1 | R7 拆 visual-check 场景与页面故事（+R10 改 title） | 独占：期间不得改 `scripts/visual-check*`、`pages.stories.jsx` | R1 |
| 2 | R9 刷新 handover §1；R5(a) lint + import 边界测试 | 可并行（只改 handover / 只加检查与删死 import） | R1 |
| 3 | S8+R4 注册表与筛选契约；R6 导航方案（先交用户确认） | S8 独占 `pages/AiInterpreterPage` 与 `features/interpreter` | R7 |
| 4a | 覆盖：P07 其余六类（每类一个提交）、R2 两处助手 | 按页面并行；每项自带 demo hook | S8 |
| 4b | 结构：S2 → A2 → S3（含 R3）；S5/S6；A4；S7（含 R5(b)、R8） | 各自独立分支；S2/A2/S3 串行 | R7 |
| 5 | P08–P17 | 按页面并行 | R6、4a |

### 提示词（均以上文“通用前言”开头，并在其后追加下面这一段）

```text
补充前言（2026-09-25 第二轮）：
- 开工前确认 S1 已在 main：`git fetch && git merge-base --is-ancestor 1dd1d7d origin/main`，失败则停下并报告，不要在旧结构上开发。
- 同时阅读 handover/structural-review.md 的“第二轮对抗审查”一节；本条目的范围以该节对应条目为准。
- 改动涉及 scripts/visual-check 场景或页面故事时，只改自己页面的分文件（R7 之后）。
```

#### R1 合入 S1（用户 / lead）

```text
在 /Users/wuhaocheng/Documents/repos/marketinghub：
1. git fetch --all；确认 structural/s1-file-split 相对 origin/main 仅领先 d652fd8、ad7ba3a、1dd1d7d 三个提交且工作区干净。
2. 在 github 远端开 PR（base main，head structural/s1-file-split），PR 描述引用 handover/structural-review.md 的 S1 条目证据与映射表；按 AGENTS.md §6 附组件列表、visual-check 输出路径和有意差异（无）。
3. 合入前在该分支重跑：npm test、npm run build-storybook（index.json 故事数不少于 73）、node scripts/visual-check.mjs（全套）与 --negative、npm run build:host && node scripts/host-check.mjs。任一失败则停下报告。
4. 快进合入 main，同步两个远端（github 与 origin）。
5. 在 handover/README.md §5 维护日志记一行（合入提交号），把 §4 中 “S1 未合入 main” 的描述改为已合入。在本节 R1 勾选并写证据。
6. 远端旧分支（origin 上 cursor/* 7 个）只列出清单交用户决定，不自行删除。
```

#### R7 拆分共享热点文件（+R10）

```text
[通用前言 + 补充前言]
任务：handover/structural-review.md 第二轮 R7 与 R10。纯搬迁，零行为变化，独占执行。
1. scripts/visual-check.config.mjs：保留 BASELINE、CONSOLE_ALLOW 等共享导出在一个 common 模块；场景按页面前缀拆到 scripts/visual-check/scenarios/p01.mjs … p07.mjs（未来 p08+ 按同一规则新增），聚合文件按原数组顺序拼回并保持默认导出形状。visual-check.mjs、visual-check.negative.mjs、fingerprint.mjs 的引用路径同步更新。
   - 验证：写一个一次性脚本，对比拆分前后默认导出的场景数组（JSON.stringify 深比较，函数用 toString），必须完全一致；脚本输出放 /tmp，不入库。
2. src/design/pages.stories.jsx：每个页面故事移到 src/design/pages/<Page>/<Page>.stories.jsx。共享的 useSynced、shell 等放 src/design/lib/story-helpers.js。meta title 仍为 "Pages"、导出名不变，确保 story id（pages--home 等）逐一不变；如果 Storybook 不允许多个文件共用同一 title，就用 title "Pages/<Name>" 并给每个故事写死 id 使 id 保持不变，先在 index.json 验证。
3. R10：features/* 的故事 title 改为 "Features/<Page>/<Name>"。先 grep scripts/ 与 src/design/stories.test.jsx 中对这些 id 的引用并同步；在 handover/README.md 登记 id 变更表（旧 id → 新 id）。AGENTS.md §3.4 对应表述改写（不追加）。
4. 验证：通用前言全部；另外 index.json 中 pages--* 的 id 集合与拆分前完全一致；visual-check 全套机器结果与拆分前逐场景一致。
一个提交做 R7 的 visual-check 拆分，一个提交做页面故事拆分，一个提交做 R10。
```

#### R9 刷新 handover 状态表 + R5(a) 边界检测

```text
[通用前言 + 补充前言]
任务：handover/structural-review.md 第二轮 R9 与 R5(a)，两个提交。
R9：
1. 在 main 最新提交上跑全套：npm test、npm run build-storybook、node scripts/visual-check.mjs 与 --negative、npm run build:host && node scripts/host-check.mjs。
2. 用这一次运行的结果重写 handover/README.md §1 表格；每一行都写明对应的提交号和证据路径。与之矛盾的旧数字（8c93802/d6557c3 的 63 stories、105/105 等）连同原文移到 §2.5，不删除。§2.1 各行的分支名改为已合入的提交号。
3. 不改事实判断；只刷新数字并去掉矛盾。
R5(a)：
1. 加 ESLint（flat config，只开 react/jsx 解析、no-unused-vars、react-hooks 两条规则），npm run lint 脚本；修掉新暴露的未用 import（例如 components/Pagination/index.jsx:2 的 totalLabel），不做其他风格改动。
2. 新增 src/design/boundaries.test.js：解析 src/design 下所有非 stories、非 test 模块的 import，断言 components/ 不 import features/、pages/、demo/、content.js、report-logic.js、report-routes.js；features/<p>/ 不 import 其他 features/<q>/ 与 demo/、content.js；pages/ 不 import demo/、content.js。现有违规要么修掉，要么在测试里显式列入白名单并写原因（白名单每项在 handover §4 登记）。
3. 把 lint 加进 A4 计划中的 CI 步骤说明（如果 A4 已落地，直接加进 workflow）。
```

#### S8 + R4 视图注册表与筛选契约（替换上文 S8 提示中的 S8 部分）

```text
[通用前言 + 补充前言]
任务：handover/structural-review.md 的 S8，并解决第二轮 R4。
1. 先把现状写进 S8 条目：三种筛选所有权（页面过滤通用类型、PrinciplesView 自过滤、useBusinessTermDemo 过滤）以及各自的原始来源（types.js、principles-library.js、business-term-library.js）。
2. 定一个统一契约并写进 S8 条目：类型视图组件接收 { rows/items（已过滤、已分页）, total, query, filters, filterValues, page, pageSize, 回调 onQueryChange/onFilterChange/onPageChange/onSelect/onCreate/..., searchRef }；过滤/分页是 demo/ 下的纯函数，由 useInterpreterDemo（新建）或各类型的 hook 调用。原始行为不同的地方（例如 Principles 的分类筛选、BT 的权限矩阵）作为视图自己的额外 props，不强行统一。
3. AiInterpreterPage 改为注册表分派 views[type.view]；未注册类型回落 KnowledgeLibrary 并加 data-transitional="true"。页面组件内不再做过滤。
4. “/” 与 Cmd/Ctrl+K 快捷键只作用于当前实例（监听挂在页面根或由 hook 提供），加一条双实例测试：两个页面实例同时挂载时，快捷键只聚焦其中一个。
5. 故事与 examples/host 改为只调用 hook；visual-check p07 全部场景机器结果不变。
```

#### R2 P03 / P07 助手面板补建（两个条目，可并行，各一个分支）

```text
[通用前言 + 补充前言]
任务：handover/structural-review.md 第二轮 R2，本条目只做 <P03 flexible.html | P07 knowledge.html> 一页。
1. 盘点原始行为并写进 handover/README.md §2.3 该页台账：
   - P03：assets/pages/flexible.html:196 起的 #assistantPanel 结构，assets/js/self-service/workspace.js:309–560 附近的 openAssistant("report")/closeAssistant、提交、建议、历史、技能菜单（assistant-skill-menu.js）等全部可达状态；
   - P07：assets/pages/knowledge.html:1705 起的面板，assets/js/knowledge/workspace.js:2432–2700 附近的 openAssistant("knowledge")，以及 overview-home.js:57 的程序化触发入口。
   - 同时核实 scrim 是否存在（handover §3 有意差异表中 “AssistantPanel backdrop” 一行要求接入 P03/P06 时按页核验）。
2. 复用 AssistantPanel，不新建助手组件；本页的助手预设（showPicks、enterToSubmit 等）写在页面组件内部，不要求调用方传（见 R3）。页面新增 assistantOpen/answers/prompt 等 props 时按 S4 的分组方式放进一个 assistant 对象。
3. 状态放进 demo/<page>-demo.js（该页若还没有 hook，就在本条目新建，只覆盖助手相关状态并预留扩展），故事与 examples/host 只调用 hook；host 加该页路由与 host-check 检查。
4. visual-check 为该页新增至少：面板打开、提交一次后的答案态、Escape 关闭后焦点回到 launcher；各配一个负向用例。
5. handover：§2.2 该页状态、§4 移除 R2 对应缺口、§5 日志；本节 R2 勾选对应页面。
```

#### R6 导航方案（先交用户决定，再实施）

```text
[通用前言 + 补充前言]
任务：handover/structural-review.md 第二轮 R6。第一阶段只写方案，不改代码。
1. 盘点：列出 src/design 中所有生成 href 或发出 onNavigate 的位置（grep href、Href、onNavigate），以及每个位置的默认 URL 来源（content.js NAV、report-routes.js、组件内字符串）。列出 P08–P17 原始页面之间的全部跨页链接（assets/pages/*.html 与 assets/js 中的 location.href / href 拼接），按“路由 id + 参数”归类。
2. 写方案进 R6 条目：路由 id 清单、onNavigate 载荷形状、hrefFor(id, params) 的注入方式（页面 prop 还是 context，二选一并说明理由）、原始 Demo URL 解析器放在 demo/、Storybook DemoLinkGuard 与 host mapDemoHref 如何简化、Cockpit 四个 href props 的迁移与兼容期。
3. 停下，把方案交给用户确认。确认后再按一个页面一个提交迁移，每步 visual-check 与 host-check 通过。
```

#### R3 / R5(b) / R8 —— 不单独开条目

- R3 追加到 S3 与 S4 提示词末尾：“验收时 `pages.stories.jsx`（或 R7 之后的页面故事文件）与 `examples/host/main.jsx` 中不得再出现 `showScopes`、`showPicks`、`hideStageOnAnswers`、`enterToSubmit`、`submitDisabled` 这些开关名；每个页面的助手预设由页面组件自身持有。”
- R5(b) 追加到 S7 提示词第 3 步：“`package.json` 的 `exports` 分为 `.`（组件、feature、页面、tokens.css）与 `./demo`（demo hooks、fixtures、content、report-demo、原始 Demo 路由解析器）；`report-logic.js` 移到 `features/cockpit/lib/`，`cx.js` 只保留 `cx`，筛选函数移到使用方或 `lib/filters.js`。在 /tmp 的验证项目中断言只 import `.` 时产物不包含任何 fixture 文案。”
- R8 追加到 S7 或 `design-system-cleanup.md`（取先执行者）：“在 examples/host 的 compose 页加插槽内哨兵（宿主按钮/链接作为 Hero 与 Modal 的 children），host-check 断言其计算样式与页外哨兵一致；不一致时修 reset 选择器或登记为有意行为。”

## 第二轮决策（2026-09-25，用户确认的目标）

用户目标：**从原始 HTML+CSS+JS 包中提取完整的 Storybook**——17 个页面的全部可达状态都能在 Storybook 中以组件组合 + 故事参数复现，组件接口可查、可操作。判断标准：一个条目能否让更多原始可达状态出现在 Storybook 中、或阻止已提取的状态出错。只服务于“在 Storybook 之外发布/复用”的工作排到 M7。

- **D1 广度优先（采纳 A1、R11）**。未开始的页面与 P07 其余六类先做“结构正确 + 全部可达状态有故事 + 默认态与每个交互 prop 至少一个非默认态的配对基线”；像素收敛作为第二轮，人工 fail 如实登记，不阻塞下一页。结构整改只前置三项：R1（合入 S1）、R7（拆热点文件，含 R10）、S8+R4（Interpreter 视图注册与筛选契约，六类型的直接前提）。
- **D2 导航（R6）不做重设计**。Storybook 只需现有 `DemoLinkGuard`，URL 翻译是宿主问题。约定仅对新页面生效：可导航元素仍渲染真实 `<a href>`；页面组件接收一个 `hrefFor(id, params)` prop，默认值是 `demo/` 中按原始 Demo URL 生成的解析器；回调载荷 `onNavigate({ id, params, href })`。Cockpit 的四个 href props 与宿主 `mapDemoHref` 的收敛推迟到 M7。上文 R6 提示词作废，由 A1 提示词中的约定取代。
- **D3 其余条目按 Storybook 价值分三类**：
  - 与覆盖并行（影响故事中状态的正确性）：A2 缺陷回退（组件内的缺陷会让故事展示错误状态）→ S2 覆盖层栈（Escape/焦点在故事里可见）→ S3 助手合并（含 R3；须在 P12–P14 大量接入 lite 助手之前完成）；R2 两处助手面板补建；R9 状态表刷新；R5(a) lint 与 import 边界测试；A4 仓库卫生与最小 CI（成本低，保护构建）。
  - 随页面条目完成，不单独成波：S4（每个页面条目自带 `demo/<page>-demo.js`，新页面一开始就这样写；存量页面在被修改时迁移）；S5（新页面零写死文案，存量页面被修改时补齐）；S6（新页面的内容直接写进 `demo/content/<page>.js`）。
  - 推迟到 M7：S7 自包含资源与库构建、R5(b) 入口拆分、R8 reset 插槽问题、R6 存量迁移。Storybook 通过 `staticDirs` 已能加载 `assets/`，这些不影响故事完整性。
- **D4 执行顺序（取代上文两张表）**

| 步 | 条目 | 并行性 | 前置 |
|---|---|---|---|
| 0 | R1 合入 S1 | 独占 | — |
| 1 | R7（+R10）拆热点文件 | 独占 | R1 |
| 2 | S8+R4；R9；R5(a)；A4 | S8 独占 interpreter 目录，其余并行 | R7 |
| 3 | 覆盖：P07 六类（每类一个提交）→ P08/P09 → P10/P11 → P12–P14 → P15–P17；R2 两页 | 按页面并行（每页一个 agent/分支） | S8（P07 六类）；R7（其余） |
| 3′ | 质量：A2 → S2 → S3 | 串行，一个 agent，与第 3 步并行 | R7；S3 须在 P12–P14 开工前合入 |
| 4 | 第二轮：人工审图 fail 项的像素收敛；M7（S7、R5b、R8、R6 存量迁移、独立宿主全页覆盖） | 按页面并行 | 3 全部完成 |

冲突规则：第 3 与 3′ 同时改到同一组件（例如 AssistantPanel）时，3′ 优先合入，第 3 步的 agent rebase 后继续；页面 agent 不改共享组件的接口，需要新变体时在 handover“新发现”登记，由 3′ 的 agent 统一加。

### A1 广度推进提示词（取代上文 A1 提示词）

```text
[通用前言 + 补充前言]
任务：按 handover/structural-review.md “第二轮决策” D1/D4 推进 <页面或 P07 类型名>。目标是让该页原始 Demo 的全部可达状态出现在 Storybook 中。
1. 盘点：按 handover/README.md §2.3 格式补全该页台账——URL/query/hash/storage 种子、区块、每个交互状态（默认/非默认/空/错误/禁用/覆盖层/窄屏），每条标明原始源码位置（assets/js/…:行号）与“已验证可达 / 待查 / 隐藏残留”。助手：核实该页是否有 #assistantPanel 或 assistant-panel-lite.js 注入的面板。
2. 组合：优先复用 src/design/components 与已有 features；新组件放 features/<page>/，被第二个页面用到时才提升到 components/（提升算共享接口变更，登记“新发现”交 3′ agent）。页面组件完全受控、零写死文案、props 按区域分组；原始逻辑缺陷按 AGENTS.md §3.5 不进组件。
3. 导航：按 D2 约定——页面接收 hrefFor(id, params)，默认解析器放 demo/，onNavigate({ id, params, href })。
4. 状态：新建 demo/<page>-demo.js（内容参数注入，返回页面 props）；文案与数据放 demo/content/<page>.js。故事只调用 hook；每个交互 prop 至少一个非默认态的命名故事（Storybook 左栏能直接点到每个状态，不必改 Controls）。
5. 验证：scripts/visual-check/scenarios/<page>.mjs 为默认态和每个非默认态建配对场景，至少一个负向用例；机器结果与人工审图分别登记，人工 fail 列入第二轮，不在本条修像素。npm test、build-storybook（故事数只增不减）、host-check 通过（宿主暂只需一个挂载路由证明可渲染）。
6. 一页（或一类）一个提交；完成后更新 handover §2.2 该行状态、§5 日志，立即进入下一页。
```

## 第三轮：奥卡姆剃刀审查（2026-09-25，1dd1d7d）

依据：AGENTS.md §3.4 新增的奥卡姆剃刀规则（2026-09-25 用户确认）。方法：统计每个组件在 `src/design` 内的实际使用者（不含自身目录与故事）、导出面、重复结构、布尔开关组合、token 取值重复。只列可执行的删减或合并；真实差异（例如 WorkspaceCard / ProjectCard / ActionCard / TypeCard 四种卡片的结构与视觉各不相同）不合并。

### 实测

| 项 | 数值 |
|---|---|
| 零使用者的导出组件 | 3：`Link`、`FilterActions`、`BusinessTermForm` |
| 只有一个使用者、且是某个组件内部子件却放在 `components/` 并公开导出 | 4：`ScopeOption`、`Suggestion`（仅 AssistantPanel）、`SidebarItem`（仅 KnowledgeSidebar）、`CategoryHeading`（仅 ProjectCatalog） |
| `components/` 中只被一个页面使用 | 9：ColumnChart、DataTable、ProgressList、Toast、ViewHeading（均仅 Campaign）、FileDropzone（DataUpload）、FilterPills（SelfService）、SectionHeading（Home）、ConfirmDialog（BusinessTermView） |
| tokens.css | 345 个变量：10 个未使用，205 个只被使用一次；45 个取值被 2–4 个不同名字重复定义（105 个变量），例如 `#141414` = `--mh-ink-ai-strong`/`--mh-live-back-hover`/`--mh-copilot-ink`/`--mh-pagination-active` |

### 发现

- [x] **O1 删除零使用者组件** —— 2026-09-25 完成（137c971，`structural/r7-split-hotspots`）：`Link` 与 `FilterActions` 连同故事/CSS/导出/.design-sync 映射删除；`BusinessTermForm` 保留归 P08。删 id：`atoms-link--default`、`molecules-filter-actions--default`。npm test 63/63、build 71+59。
  - `Link`（`components/Link`）：45 处 `<a>` 都是直接写的，没有一处用它。
  - `FilterActions`（`components/FilterActions`）：没有使用者；CampaignPage 在 `pages/CampaignPage/index.jsx:215–228` 自己写了同样的 Filter/Reset 两个按钮。两按钮包装本身没有行为，按规则删除 `FilterActions`，保留页面内写法。
  - `BusinessTermForm`（`features/interpreter/BusinessTermForm`）：为 M5 预建、至今无页面使用，属于“预建”。不在本条删除；交给 P08 knowledge-create 条目：要么被真实使用，要么删除，二者必居其一。
  - 删除时同步删掉故事、CSS、`index.js` 导出、`.design-sync/config.json` 的映射，并在 handover 按 AGENTS.md §4 的例外登记被删 story id。

- [x] **O2 内部子件收回为私有** —— 2026-09-25 完成（18a7f13）：`ScopeOption`/`Suggestion` 移入 `components/AssistantPanel/`、`SidebarItem` 移入 `features/interpreter/KnowledgeSidebar/`、`CategoryHeading` 内联进 `ProjectCatalog`（CSS 并入）。删 id→父故事：`molecules-scope-option--default`/`molecules-suggestion--default`→`organisms-assistant-panel--ask-panel`、`molecules-sidebar-item--default`→`features-interpreter-knowledge-sidebar--default`、`molecules-category-heading--default`→`features-cockpit-project-catalog--default`。npm test 63/63、build 67+55、host-check 7/7。
  - `ScopeOption`、`Suggestion` 移入 `components/AssistantPanel/`，`SidebarItem` 移入 `features/interpreter/KnowledgeSidebar/`，`CategoryHeading` 并入 `features/cockpit/ProjectCatalog/`（它只渲染一个 `<header><h2>`）。取消这些公共导出，删除各自的独立故事——它们的状态已在父组件故事中可见，登记“被删 id → 父故事 id”。
  - 另外 9 个只被一个页面使用的 `components/*` 暂不移动：P08–P17 很可能复用 DataTable、Toast、ConfirmDialog、Tabs 等，现在搬过去再搬回来是无效劳动。M6 结束时重跑使用者统计，仍只有一个使用者的降级到 `features/<page>/`。

- [x] **O3 合并同义标题组件** —— 2026-09-25 完成（`structural/r7-split-hotspots`）：`ViewHeading` 并入 `SectionHeading` 为 `variant="view"`（导出 `sectionHeadingVariants = ["home","view"]`），`.mh-view-heading*` 规则迁入 `SectionHeading.css` 的 `.mh-heading--view` 修饰块，CampaignPage 五处改 `variant="view"`；删 `molecules-view-heading--default`，该态由 `molecules-section-heading--view` 与 `pages--campaign` 呈现。`features/campaign/Panel` 已比较不合并（h3 层级 + 容器语义不同）。
  - `SectionHeading`（Home）与 `ViewHeading`（Campaign）结构相同：eyebrow + 标题 + 说明，ViewHeading 只多一个右侧 `children` 插槽。合并为一个 `SectionHeading`，用导出的 `sectionHeadingVariants`（例如 `"home"`、`"view"`）区分样式，`children` 作为可选动作插槽；类名与 CSS 修饰类随之收敛（修饰类放在基类 css 中，见 §3.2）。
  - `CategoryHeading` 按 O2 并入 ProjectCatalog。
  - `features/campaign/Panel` 的头部同样是 eyebrow + 标题 + 动作，但标题层级（h3）和容器语义不同，保持独立，只在 handover 记一句“已比较，不合并”。

- [x] **O4 删除只转发 props 的包装组件** —— 2026-09-25 完成（`structural/r7-split-hotspots`）：`WorkspaceGrid`（21 行纯转发）并入 `HomePage`，`.mh-workspace-grid` 规则移入 `HomePage.css`；导出/.design-sync 同步，删 `features-home-workspace-grid--default`（该态仍见于 `pages--home`）。`TypeGrid`/`ProjectCatalog` 保留（各有计数/分组逻辑）。
  - `WorkspaceGrid`（`features/home/WorkspaceGrid`，21 行）：只包一层 grid `div` 并把 props 原样转给 `WorkspaceCard`，唯一使用者是 HomePage。并入 HomePage（grid 样式移入 HomePage.css），删除其故事与导出。
  - `TypeGrid` 有计数格式化与选中态计算，而且是 S8 注册表里的 overview 视图，保留。`ProjectCatalog` 有分组逻辑，保留。

- [ ] **O5 AssistantPanel 的布尔开关合并为变体**（并入 S3，与 R3 一起做）
  - `showScopes`、`showPicks`、`enterToSubmit`、`hideStageOnAnswers`、`lite` 五个布尔开关实际只出现 4 种组合，每种对应一个页面：Home（`showPicks=false`）、Cockpit 目录（四项全关/开 hideStage）、Campaign（`enterToSubmit=false`、`showPicks=false`）、MediaTracking（`lite` + 同类）。改为一个导出枚举 `assistantVariants` 并在 argTypes 引用；页面只传 `variant`。
  - 答案卡的渲染形态用两个不同字段区分（`answer.variant: "compact"|"workspace"` 与 `answer.simple: true`，见 `content.js:216/228/1702`），合并为一个 `answer.variant` 枚举（`default`/`compact`/`workspace`/`simple`）。
  - `submitDisabled` 由 A2 删除（缺陷复刻），不在本条处理。

- [ ] **O6 token 去重**（并入 `design-system-cleanup.md` 的 “P2 Token 膨胀”，按 AGENTS.md §3.2 已改写的规则执行）
  - 删除 10 个未使用变量；45 组同值多名的变量，语义相同的合并为一个语义名（例如把 4 个 `#141414` 收敛到 `--mh-ink-strong`），语义确实不同的保留并在 tokens.css 用注释写明区别；按组件命名的前缀（`--mh-copilot-*`、`--mh-pagination-*` 等）在合并时改为语义名。
  - 视觉零回归；证据为 visual-check 全套机器结果不变与 tokens 数量前后对比。

- [ ] **O7 规则冲突已修正（本轮完成）**
  - AGENTS.md §4 第 1 条“故事数不减少”会阻止 O1–O4 的删除；已改写为：按 §3.4 删除重复或无使用者的故事/组件是唯一例外，须在 handover 列出被删 story id 及其状态仍在哪个故事中可见。
  - AGENTS.md §3.2 “新增色值先加 token” 是 token 膨胀的直接来源；已改写为先复用同值同义 token、按语义命名、同值不得挂多个同义名。

### 放入执行顺序（补充 D4）

- O1、O2、O3、O4 由一个 agent 在 R7 之后、第 3 步页面推进开始前做完（它们改 Home、Cockpit、Campaign、AssistantPanel、KnowledgeSidebar，与 P07 六类型和 P08+ 新页面基本不相交；先做可以让新页面直接用收敛后的组件）。每条一个提交。
- O5 随 S3；O6 随 cleanup P2（可与第 3 步并行）。
- M6 结束时加一步“使用者复查”：重跑本节统计，单一使用者的 `components/*` 降级，零使用者的删除。

### 提示词

```text
[通用前言 + 补充前言]
任务：handover/structural-review.md “第三轮：奥卡姆剃刀审查”的 O1–O4，按 O1 → O2 → O3 → O4 每条一个提交。
1. 每条开工前重新统计使用者（grep "/<Name>/index.jsx" 于 src/design 的 components、features、pages、lib，排除自身目录与 *.stories.jsx；examples/host 与 .design-sync/config.json 也要查），与本节数据不符时以实测为准并在条目里更正。
2. 删除或收回私有时同步：故事、CSS（修饰类随基类，AGENTS.md §3.2）、src/design/index.js 导出、examples/host、.design-sync/config.json componentSrcMap、stories.test.jsx 中的相关断言。
3. O3 合并后的 SectionHeading：导出 sectionHeadingVariants 并在 argTypes 引用；Home 与 Campaign 渲染结果与合并前像素一致。
4. 验证：通用前言全部。故事数允许下降，但必须在 handover/README.md 维护日志中列出“被删 story id → 该状态仍可见的故事 id”（AGENTS.md §4 第 1 条的例外）；visual-check 全套机器结果与改动前逐场景一致。
5. 不做本节以外的合并；发现新的奥卡姆候选写进本节末尾，由用户或下一轮决定。
```


## 本轮集成工作包（2026-09-25，用户指定）

各包从 WP0 验证后同步的 `origin/main` 开独立 worktree/分支；每个部分接受对抗性审核，PR 逐个 rebase、全套验证、合并。仅 integrator 更新 README §1 和本节勾选。WP3 按三条依次提交 PR，其余一包一 PR；用户最新指示保留现有 `scripts/font-probe.mjs`，新临时探针仍放 `/tmp`。

- [x] **WP0 基线集成**：结构分支增加 `scripts/.*.tmp.mjs` 忽略规则；全套验证后 main 快进并同步 github/origin，保留已提交 P07 工作。7cb768e 源码全套验证通过（证据与实数见 README §1/§5），独立对抗审核完成。
- [x] **WP1 CSS budget ratchet**（PR #1，36959e7；独立对抗审核与全套验证通过，实数见 README §1/§5）：裸十六进制、token 定义数、同值多名数量上限；组件前缀新增禁令和仅可缩减豁免；负向变异证明；AGENTS §4 临时脚本位置。
- [x] **WP2 P07 closeout**（PR #4，1d39a5d；对抗审核与最终全套验证见 README §1/§5）：管理动作/状态/确认流程共性；active-view 注册契约和 overlay slot；删除无使用者过渡组件；fl/dm/sr 语义 token；P07 八类状态只维护 §2.2。
- [x] **WP3.1 A2**（PR #2；对抗审核及全套验证通过，实数见 README §1/§5）：参照物逻辑缺陷退出组件，demo 层按需重现。
- [x] **WP3.2 S2**（PR #5，e76fedd；对抗审核和全套验证见 README §1/§5）：统一覆盖层栈、Escape 与焦点环。
- [ ] **WP3.3 S3 + R3 + O5**：共用助手外壳、页面预设与变体枚举、答案变体收敛。
- [x] **WP4 export-surface guard**（PR #3；对抗审核及全套验证通过，实数见 README §1/§5）：冻结公共入口 demo/content/routes/fixtures 导出，允许删除，禁止增加；既有项保留至 M7 R5(b)。
- [ ] **WP5 P08**：knowledge-create 各类创建/编辑、关联、校验和全部动作；可达状态故事和配对/负向场景。
- [ ] **P09 / P10 / P11**：仅 WP2 合并后启动，每页独立 PR，按 D1/D2/A1 执行。
- [ ] **WP6 R2**：仅 WP2 和 WP3 全部合并后补齐 P03/P07 助手，只用新变体。
- [ ] **WP6 P12–P17**：R2 后按页顺序推进，每页独立 PR，沿用 WP5 验证规则。

### WP2 token 预算冲突决策

用户将取舍委托给 integrator，按奥卡姆剃刀仅为提取原 CSS 已存在的精确色值作一次预算调整：裸十六进制 310→148、定义 397→456、同值多名组 47→42、旧前缀豁免 316→256。新增取值来自原有 CSS，视觉颜色不变；不为守住旧定义总数而跨全库合并语义不同的边框、背景和文字 token。52 个 `--mh-fl-*` 清零，删除 7 个已确认无使用者 token。调整后继续按新实测上限锁住，不能作为今后任意提高预算的先例。
