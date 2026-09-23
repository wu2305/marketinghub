# Marketing Hub Storybook 交接与状态

规则与长期规划见仓库根目录 `AGENTS.md`。本文件只记录状态，按 `AGENTS.md` 第 7 节的固定结构维护。

## 1. 当前状态

**最新目标（2026-09-23 用户确认）**：全量重建现有静态 Demo 的全部界面与既有前端交互，按奥卡姆剃刀提取最小必要 React 组件体系及各层 Storybook。覆盖不能缩水，抽象不能膨胀。当前仍为早期部分实现；旧阶段“完成”不代表页面全量验收。长程执行 prompt 见 [execution-prompt.md](./execution-prompt.md)。本文件是唯一状态台账，不另建 HANDOFF.md。

| 项 | 值 |
|---|---|
| 设计系统位置 | `src/design` |
| Storybook | 本次安装锁定版本 8.6.18，`@storybook/react-vite` |
| 故事数 | 53（Foundations 1、Atoms 7、Molecules 17、Organisms 22、Pages 6）+ 5 autodocs 页；全部导出组件均有独立故事 |
| 测试 | `npm test`（vitest@4.1.11 + @testing-library/react@16.3.3 + jsdom），9 条行为测试通过（2026-09-23） |
| 构建验证 | 通过（2026-09-23，`npm run build-storybook -- --disable-telemetry`，58 entries：53 stories、5 docs） |
| 最近视觉对照 | 2026-09-23，1440px：故事截图含八类型/overview/unknown；现存原始截图仅 overview/Principles/Business Term/Scenario。全八类配对及非默认筛选截图未齐；Principles 配对仍有显著布局与数据差异。产物 `/tmp/mh-visual/*.png` |
| 原始 Demo 参照 | `index.html`、`assets/pages/*.html`，`npm run preview:html` 于 127.0.0.1:4173 |

启动：

```bash
npm install
npm run preview:html   # 127.0.0.1:4173，原始 HTML 参照
npm run storybook      # 127.0.0.1:6006
npm test               # vitest 行为测试
```

## 2. 阶段进度表

### 2.1 当前里程碑（取代旧 A–E 执行顺序）

| 阶段 | 条目 | 状态 | PR |
|---|---|---|---|
| M0 | 全量入口/子视图/状态/动作与组件候选盘点；生效参照与冲突登记 | 进行中 | 888177a 完成首轮静态扫描；运行时可达路径、状态 ID/故事映射与共用边界尚未完成 |
| M1 | 最小可重复验证、公共出口/文档、故事状态接线、token/资源/导航基础 | 进行中 | 本轮：index.js 公共出口、全组件 JSDoc+autodocs（47 stories/5 docs）、缺失组件故事补齐、Library 故事受控回写、真实导航 href；visual-check 10/10 已入库。仍缺：token 化、@media、独立宿主、键盘验证 |
| M2 | 外壳与完整 Home，包括助手实际可达状态 | 进行中 | 助手抽屉全流已实现；配对验证覆盖答案流/历史/最大化（焦点还原与 Escape 已实现但未入配对场景）；platformGuide/picker/upload 已核为 Home 不可达残留，转属工作区页 |
| M3 | Cockpit、Self-Service、Campaign 完整模块 | 进行中 | #6/#8 有入口/部分 section；详情、表单和交互仍缺 |
| M4 | 八种知识类型真实区块与状态，替换通用占位列表 | 进行中 | a9542f7 改善类型接口，未完成专用视图提取 |
| M5 | 知识创建/编辑/详情、关联、版本、公式、模型浏览器 | 未开始 | BusinessTermForm 仅已有雏形，不算完成 |
| M6 | 治理三页与 Scenario Library/Detail/Edit | 未开始 | — |
| M7 | 全台账收敛、独立宿主/新组合验证、构建交付与 CI | 未开始 | — |

验收要求以 AGENTS.md 第 5 节为准。优先完成 M0 与 M1 最小闭环，再沿页面实际需求提取，不能陷入无休止的基础重构。每个里程碑拆为可独立验收的条目，完成一条继续下一条；不要以一个样板或单页作为整个任务终点。

### 2.2 页面覆盖种子台账（M0 必须展开）

以下是入口分母，不是完整状态清单；“待盘点”不能算不适用。每个页面要展开 URL/query/hash、页内区块、交互状态、组件与故事对应关系。已有局部实现必须重新核验，不能直接标成全页完成。

| ID | 原始入口 | 主要待覆盖范围（以实际生效内容补全） | 里程碑 | 状态 |
|---|---|---|---|---|
| P01 | index.html | 全首页、入口卡/导航、助手及其可达状态 | M2 | 进行中 |
| P02 | assets/pages/reports.html | Cockpit 目录、各 project/dashboard、报表详情与助手 | M3 | 进行中 |
| P03 | assets/pages/flexible.html | Self-Service 页签、筛选、数据视图入口及状态 | M3 | 进行中 |
| P04 | assets/pages/data-upload.html | 上传页全部区块、选择/校验/反馈等实际流程 | M3 | 已实现+配对验证（15/15）；14 字段表单、提交瞬态、Template Import 弹窗/dropzone/Tips 完成 |
| P05 | assets/pages/media-tracking-detail.html | 完整详情、筛选/表格/图表及实际页内交互 | M3 | 未开始 |
| P06 | assets/pages/campaign.html | 五个 section、创建任务/绑定等实际动作、助手 | M3 | 进行中 |
| P07 | assets/pages/knowledge.html | 概览、八类型列表/卡片/筛选/动作、页内覆盖层与分页 | M4/M5 | 进行中 |
| P08 | assets/pages/knowledge-create.html | 按类型创建/编辑、全部字段/关联、校验、Save/Submit/Cancel | M5 | 未开始 |
| P09 | assets/pages/knowledge-view.html | 按类型详情与原始可达动作/版本等 | M5 | 未开始 |
| P10 | assets/pages/metric-dictionary.html | 指标结构、公式及实际可达交互 | M5 | 未开始 |
| P11 | assets/pages/data-model.html | 模型/表/字段/关系浏览及切换 | M5 | 未开始 |
| P12 | assets/pages/review-center.html | 审核列表、筛选、详情、决策反馈等实际状态 | M6 | 未开始 |
| P13 | assets/pages/feedback-quality.html | 反馈与质量界面、详情及实际动作 | M6 | 未开始 |
| P14 | assets/pages/personal-memory.html | 记忆列表与管理状态 | M6 | 未开始 |
| P15 | assets/pages/scenario-library.html | 实为 Skill Library（h1/title 均 Skill Library）：列表、筛选、详情面板、内联编辑 | M6 | 未开始 |
| P16 | assets/pages/scenario-detail.html | Skill 详情：hero + 6 页签 + preview | M6 | 未开始 |
| P17 | assets/pages/scenario-edit.html | Skill 编辑表单、校验、preview、Submit for Review | M6 | 未开始 |

### 2.3 细分台账与证据记录格式

M0 在本节内逐页增加以下行，后续随实现维护；不要另建平行状态文件。大量重复行可用明确共享组件证据引用，但每个使用场景须标明是否已验证。

| 状态 ID | 页面/URL/生效来源 | 区块、初态与操作→预期结果 | 组件/层级与共用位置 | story ID/参数 | 行为与视觉证据 | 状态/缺口 |
|---|---|---|---|---|---|---|
| 见下方逐页台账 | 必须含实际生效脚本/CSS，不能仅凭文件名 | 标明 query/hash/storage 种子；适用的默认/非默认/空/错误/禁用/覆盖层/窄屏状态 | 新建/复用/组合的理由；专用差异不强行统一 | 可直接复现 | 命令、结果、截图路径、对照结论；不能只写“截图完成” | 未开始/进行中/完成 |

组件清单也放本节：组件名、公共或私有、层级、原始使用位置、变体、输入/输出、故事、验证状态。以独立意义、稳定复用边界决定拆分；不要求每个 DOM 标签成为组件。

#### M0 首轮盘点（2026-09-23，脚本/CSS 加载序与 DOM/JS 面已核对；逐项行为细节随实现继续核实）

**对抗性复核限定**：以下源码存在项不是全部已验证可达功能。首页助手打开后，#modelPicker/#modePicker/#suggestPicker/#attachPicker/#platformGuideTrigger 实测均隐藏（CSS display:none!important）。实现前区分当前可达、待查路径、被覆盖的历史残留，不能将四个 picker 和引导直接列为必建子组件。保留此首轮清单作为线索，不将它作为完成的运行时盘点。

**共享运行时**（不是组件，是参照行为来源）：
- `shared/portal.js`（1373L）：完整助手——开关/最大化、modePicker、modelPicker、suggestPicker、attachPicker、uploadDialog（含 uploadHistoryPopup/Clear 确认）、platformGuide 气泡、homeHistoryPopup、reports 级联菜单、问答流。用于 P01、P05、P13。
- `shared/assistant-panel-lite.js`（135L）：简版助手（open/close/reset/submit/maximize）。用于 P10、P12、P14–P17；P04 与 P11 无任何助手脚本/标记。
- `shared/assistant-skill-menu.js`（886L）：助手技能菜单——分类悬停预览、详情、历史对话、Manual/Generated Model 表单弹窗（validateModelDialog）。未挂载于 P04、P08、P09、P11（四页均无 aiEntry/assistantPanel 标记）。
- 公共外壳：所有页共用顶部导航（Home/Cockpit/Self-Service/AI Interpreter/RedNote）；七页另有二级侧栏导航（Knowledge/Review Center/Skill Library/Personal Memory/Feedback & Quality）：P07 knowledge、P12–P14 治理页、P15 Skill Library、P16 Skill Detail、P17 Skill Edit。

**P01 index.html** — 脚本 portal.js + assistant-skill-menu.js；CSS home.css + assistant-panel.css。
- 视图：Header 导航、Home Hero、4 工作台卡（→reports/flexible/knowledge/campaign.html）、3 项目卡（→reports.html?project=rednote|abo|customer）。
- 交互态（运行时核验后修正）：助手抽屉——建议 chips（openAssistant 重渲染为 personalized 组）、发送→answerFeed 答案卡（bubble + card + sources + actions + Helpful/Not helpful/Copy→Copied!）、homeMaximize（抽屉↔居中弹窗 is-ai-expanded）、homeHistoryPopup（11 条 history item 填充 composer，外点/Escape 关闭；原始无 ×——`#homeHistoryPopupClose` 为 null、`.home-history-popup-close` CSS 为死代码，React 版 × 属有意差异）、newSession 清空、Escape/背景关闭、打开时聚焦 composer 并隐藏 #aiEntry、关闭还原焦点；`?ask=<context>` 打开并切换建议组。Home 上被 CSS 强制隐藏、不可达：platformGuideTrigger、ask-scope、四个 picker（suggest/attach/model/mode）、#uploadPopup；uploadDialog/uploadHistoryPopup 仅能从 popup 进入，故 Home 上同样不可达（DOM 残留，不建）。
- 现状：助手抽屉全流已实现（答案流/历史/最大化/焦点/Escape）；`?ask=` 由宿主路由等价物承接，故事侧以 scope/建议 props 表达。
- 组件候选：SiteHeader(已有)、WorkspaceCard(已有)、ProjectCard(已有)、AssistantPanel(已扩展：answers feed/history popover/expanded/focus+Escape)、HistoryPopover(并入 AssistantPanel)。PlatformGuide/UploadDialog/UploadHistoryPopup 属于工作区页（P02/P07 等），不在 Home 重建。

**P02 reports.html** — 脚本 data/knowledge.js + report-core.js(4512L) + reports-inline-1.js + skill-menu；CSS report-core/catalog/city-invest-analysis/inline-1/inline-2。
- URL：`?project=rednote|abo|customer|city`、`?dashboard=N`。
- 视图：catalogView（目录→项目→报表，knowledgeFilters）；报表详情抽屉（details*：meta/hierarchy/metrics/business-terms/data-model/principles/context/scenarios/playbooks/thumbnail + detailsOpenReport）；liveView 报表页内 dashboard（liveTitle/liveKicker/live-panel-overview，city 项目有专用分析）；aiWorkspace（aiStart 初始、aiCommandForm 提问、aiChatThread 流、aiAnswer{Summary,Findings,Sources} + aiRecommendations + aiFeedback、aiCmdUpload+popup、aiHistory、aiPeriodHint、aiScrim、aiMaximize）。
- 现状：`pages--marketing-cockpit` 仅目录首屏。详情抽屉、live dashboard、AI workspace 全缺。
- 组件候选：ReportCatalog、ReportDetailsDrawer、LiveReportView(dashboard 图表)、AiWorkspace( cockpit 内嵌，非侧栏助手 )。

**P03 flexible.html** — 脚本 self-service/workspace.js + skill-menu；CSS self-service/workspace+tabs。
- URL `?tab=upload`；tabs：tab-self-service/tab-data-upload → self-service-panel/data-upload-panel。
- 交互：categoryToggles（All|DG|DC 筛选卡片；upload 面板仅 All）、卡片→media-tracking-detail/data-upload（真实 `<a>` href）、uploadHistoryModal（history-icon→模块行表：File/Uploader/Time + Preview/Download，空态文案，backdrop/Escape/×关闭，body overflow 锁）、助手（workspace.js 版，scope pills + mode/model/suggest picker + sendQuery）。
- 死代码登记：workspace.js 引用 #openAnalysis/#analysisWorkbench/#analysisSummary/#downloadData/#downloadWorkbench/#offlineDataFile/#uploadFileName，这些节点不存在于 flexible.html——不可达，不重建。moduleHistory 另含 channel-mix/campaign-spend 两套行数据，但页面仅一张 upload-card（store-performance）——其他模块行不可达。
- 现状：tab/筛选/卡片链接/历史弹窗已重建并配对验证（p03-upload-history）；uploadHistoryModal 由 Modal+UploadHistory 有机体承接（rows/open/onPreview/onDownload）。剩余：共享工作区助手深度流。

**P04 data-upload.html** — 脚本仅 self-service/upload.js(89L)；无助手脚本。
- 视图：14 个输入的表单、Submit、bulkImportModal + bulkImportDropzone（dragover/drop）、bulkImportFile。
- 现状：已重建为 `DataUploadPage` 页面组合 + `FileDropzone` 分子：Back 链接（`flexible.html?tab=upload`）、Template Import 按钮、14 字段表单（FormField/TextInput，FormData 收集具名值）、Submit 提交态（disabled + "Submitted"，宿主 1500ms 恢复）；bulk import 由共享 Modal 承接（scrim/Escape/×关闭、body 锁滚动）、FileDropzone（点击开文件选择、dragover/drop 高亮、accept=.xlsx,.xls、选中后 hint 显示 `Selected: <name>`）、Download template 链接、5 条 Tips。注意：原始 field id 为 `field-*`、input name 无 `field-` 前缀，React 版仅按 name 建立字段契约。已配对 3 个场景（p04-data-upload 提交瞬态、p04-data-upload-import 弹窗内容、p04-data-upload-close Escape 关闭）。原始 `.bulk-import-steps` CSS 在本页无对应 DOM，未重建。

**P05 media-tracking-detail.html** — 脚本 portal.js + inline-1(11L) + lite panel + skill-menu；CSS self-service/media-tracking。
- 视图：Daily|Weekly|Monthly 粒度切换、Spot Info Mapping 按钮、静态报表表格/图表区。
- 现状：无故事。粒度切换与映射动作待提取。

**P06 campaign.html** — 脚本 campaign/workspace.js + skill-menu；location.hash 切视图。
- 视图：5 section（overviewTitle/accountsTitle/analyticsTitle/assetsTitle/executionTitle）、accountSearch + 平台 pills（Rednote/Douyin）+ Filter/Reset → accountTable/accountTableResult、taskDialog+taskForm（Create Campaign Task）、Bind New Account、taskQueueList/Count、actionLogBody、actionToast。
- 现状：五 section 均重建（section prop）；任务弹窗+toast+绑定 toast 已实现并配对验证（p06-campaign-task-dialog）；channel tabs 为受控 prop。剩余：channel 切换后 overview 内容差异（原始 data-channel 切换的内容项核对）、共享工作区助手深度流（scope/picker/skill-menu，跨页共用）。

**P07 knowledge.html** — 脚本 data/knowledge.js + knowledge-fields.js + workspace.js(2787L) + types.js(998L) + 内嵌 `#dataModelSources` JSON + data-model-browser.js(1447L) + principles-library + business-term-library + scenario-reports(1124L) + email-library + field-library(962L) + shared-controls + skill-menu；20+ CSS。
- URL：`?type=<8 类>`、`?report=city&category=…&asset=…`、`?detail=`；storage `pendingRestorations`。`?status=changes-required|submitted` 链接存在于 `business-my-tasks` 容器内，但该容器 `hidden` + `display:none` 且无任何脚本读取 `status`——死标记，不列为可达状态。
- 视图：overview（businessOverviewNav 8 类、hero stats、管理规则 `!` 提示）；八类型专用视图由后加载库渲染——Principles 卡片+类目筛选、Report Context 卡、Data Model 浏览器（域列表/图谱缩放/表抽屉/预览弹窗）、Metric 列表、Business Term 卡+多选筛选+分页、Analytical Model、Scenario 卡+分页+逐卡动作+详情、Email 10 列表；覆盖层：detailScrim 抽屉、editPanel（editAiReviewView/editApprovalView/footer）、versionPanel、createPanel（多步：表单→AI Review→Confirm Scope→Submit，含 data-model tabs、derived 公式构建器、Test）。
- 现状：`pages--interpreter` 有 overview + 通用行表（过渡实现）+ Unknown 空态；八类专用视图与全部覆盖层未提取。
- 组件候选：KnowledgeSidebar(有)、TypeCard(有)、OverviewHero、PrincipleCard+类目筛选、ReportContextCard、DataModelBrowser(域/图/抽屉/预览)、MetricList、BusinessTermCardGrid(多选筛选/分页/synonym clamp)、ScenarioCard+分页+Detail、EmailTable、DetailDrawer、EditPanel(AI review/approval)、VersionPanel、CreateWizard(按类型分步表单+AI Review+Confirm Scope)。

**P08 knowledge-create.html** — 脚本 editor-runtime(1144L) + business-term-form + approach-form + analytical-model-form + scenario-report-form(724L) + report-context-form + create-navigation。
- 视图：knowledgeType 选择 → typeFields 按类型挂表单；Save/Submit；resultDialog。校验必填、scope 多选、tags、公式锁等。
- 现状：无故事。BusinessTermForm 已有雏形未接入。

**P09 knowledge-view.html** — 脚本 editor-runtime + 6 个 *-view.js + detail-routing。
- 视图：按 ?id/type 路由到 per-type 详情（principles 版本 chips、report-context 反馈、metric 公式 palette、business-term scopeTags、email、approach）。
- 现状：无故事。

**P10 metric-dictionary.html** — 脚本 metric-detail.js(540L) + lite panel + skill-menu。
- 视图：metricList（Basic·N / Derived·N）、detail 区、3 tabs（definition/formula/dimensions）、addDerivedMetricBtn → derivedMetricPanel（公式构建器 + -×÷()123、Test、Save）、editMetricBtn。
- 现状：无故事。公式构建器与 P07 create 面板内的 createDerived* 同源，应共用组件。

**P11 data-model.html** — 脚本 inline-1(7L) + data-model-browser.js；无 assistant/skill-menu。
- 行为：`?type` 缺省时 inline-1 执行 `location.replace` 重定向到 `data-model.html?type=Data%20Model`——URL 重写须登记为可达行为。
- 视图：独立 Data Model 浏览器（#dataModelOverview + businessKnowledgeLibrary 容器全由 JS 渲染）。
- 现状：无故事。与 P07 内嵌浏览器同组件。

**P12 review-center.html** — 脚本 data/reviews.js + governance/review.js + lite panel + skill-menu。
- 视图：pending/approved tabs+计数、search/type/time 筛选、reviewAssetList、详情面板（AI check/suggestions/warning/source/submitter）、Approve→riskModal(Approve Anyway)、Reject→rejectPanel(reason)；storage pendingRestorations 与 P07 联动。
- 现状：无故事。

**P13 feedback-quality.html** — 脚本 data/feedback.js + portal.js + governance/feedback.js + skill-menu。
- 视图：all/thumbs-up/thumbs-down tabs+计数、search/type/time 筛选、feedbackList、详情面板（question/answer/reason/operation-time）。
- 现状：无故事。

**P14 personal-memory.html** — 脚本 data/memories.js + governance/memory.js + lite panel + skill-menu。
- 视图：类目 tabs（All/Analysis Preference/Data Interpretation/Presentation Preference/Others）+计数、memoryList 卡片下拉（edit/delete）、详情面板、create panel（AI Auto-fill、Category、Save）、编辑态、删除确认、memoryAiBanner。
- 现状：无故事。

**P15 scenario-library.html** — 实为 **Skill Library**（title/h1 均为 Skill Library）；脚本 data/skills.js + governance/skills.js + lite panel + skill-menu。
- 视图：scenarioList + search + statusFilter、detail 面板（input/output/logic/when/boundary/tags/version/usage/review-status + Edit/Delete/Use）、内联 scenarioEditView（5×AI Auto-fill + preview + Submit for Review）、createNewScenarioBtn。
- 现状：无故事。注意：文件名为 scenario-* 但内容是 AI Skill，与 P07 Scenario Reporting 不是同一实体。

**P16 scenario-detail.html** — Skill 详情；脚本 skill-detail.js(99L)，大部分静态。
- 视图：hero（status/version/likeRate/meta）、6 tabs（content/related/ai-check/usage/version/activity）、previewToggle。
- 现状：无故事。

**P17 scenario-edit.html** — Skill 编辑；脚本 skill-editor.js(128L)。
- 视图：表单（name/owner/purpose/scope/logic/when/input/output/attachments/report link）、preview、2×AI Auto-fill、Submit for Review。
- 现状：无故事。

**待核实项**（首轮未能从静态扫描确定，实现时以运行为准）：各 picker 的实际选项来源；report-core 各 dashboard 渲染条件与 `?dashboard=` 取值域；knowledge.html 内嵌 createPanel 与 P08 独立页的职责边界（可能同流不同壳）；scenario-reports 的 storage 键清单；portal.js 与 lite 面板的差异是否仅为功能裁剪。

### 2.4 接续点

- **当前目标**：M3 P04 data-upload 本轮完成——`FileDropzone` 分子与 `DataUploadPage` 页面组合重建表单/提交瞬态/bulkImport 弹窗（含 dropzone、template 链接、Tips）；三对 visual-check 场景全过。死代码登记：原始 `.bulk-import-steps` CSS 无 DOM 对应未重建；P04 无助手脚本（无 aiEntry/assistantPanel）。
- **下一步**：M3 推进中——P04 data-upload 已重建并配对验证（见 P04 台账行）；下一独立条目建议：P05 media-tracking-detail 粒度切换，或 P02 reports 脊柱，或 P06 channel tabs 内容差异核对与共享工作区助手（P02/P03/P05/P07 复用）。M1 余项并行欠账：内联 `style` 占位、色值 token 化、`@media`/`:focus-visible`、独立 React 宿主。工作分支 `devin/interpreter-type-contract`（…→ ebb598a → 85f4564 → 9a8f3e8 → 本批 P04 提交），未合入 main。
- **未提交改动**：本批 P04 文件（FileDropzone/DataUploadPage、content.js DATA_UPLOAD、icons、pages.css/molecules.css、两个故事文件、visual-check 三场景、台账）随提交入库。`.commandcode/` 为工具产物不入库。
- **已有验证**：2026-09-23 `npm test` 9/9；`build-storybook` 58 entries（53 stories、5 docs）；`node scripts/visual-check.mjs` 15/15 PASS——本批新增 p04-data-upload（表单+提交瞬态 "Submitted"）、p04-data-upload-import（弹窗/拖拽区/模板链接/Tips 文案）、p04-data-upload-close（Escape→hidden/detached）三对。注意 PASS 仍只表示加载与预期控件成立，视觉差异需逐对人眼评估——已见差异：sidebar 计数口径（typeMeta vs demoAssets，已登记）、story 侧栏显示计数而原始不显示。
- **长程维护**：每条完成后在此写当前分支/提交、已完成状态 ID、命令/产物、具体失败与最小下一步。上下文压缩或换模型后从本节继续，不重做已验证事项，不把最后一条聊天误当成全新目标。
- **阻塞处理**：记录阻塞原因和未验证范围，继续独立条目；缺真实后端/发布权限不阻塞组件与本地演示建设。跨未合并提交的分支依赖先核实并明确记录，不能声称已合入 main。

### 2.5 旧阶段历史记录（不作为新里程碑验收结论）


| 阶段 | 条目 | 状态 | PR |
|---|---|---|---|
| A | Home 助手面板对齐当前渲染的右侧抽屉（2.4 所述居中弹窗与现 Demo 不符） | 完成 | #8 |
| A | Cockpit `ProjectCard` 按钮补 `→`，搜索图标对齐原始 | 完成 | #8 |
| A | Interpreter 侧栏补图标与 KNOWLEDGE · 8 TYPES 分组条 | 完成 | #8 |
| A | Interpreter 可管理类型动作文案改为 Manage；类型计数对齐 `typeMeta` | 完成 | #8 |
| A | Campaign 四个 section 数据改为 props，`content.js` 提供默认值 | 完成 | #8 |
| A | `Header` 导航改为 `<a>`；`Hero` 去掉写死 `id` | 完成 | #8 |
| A | 全交互状态验收闭环（#8 条目完成不等于所有状态通过） | 进行中 | — |
| A | Interpreter 稳定类型标识、未知类型行为、只读创建入口与示例覆盖 | 进行中 | a9542f7 已修核心逻辑；来源、独立故事和对照验收待收口 |
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
| ~~`Header` logo~~ | ~~logo 链接仍 `preventDefault`~~ | 已修复：logo、Link、WorkspaceCard 均不再无条件阻止默认跳转，href 指向真实 Demo 路径 | devin/interpreter-type-contract |
| Interpreter 侧栏/卡片计数 | 侧栏条目与 TypeCard 显示 `typeMeta.stats.total`（3 models / 3 scenarios）；原 sidebar `countForType` 数 `demoAssets` 实数（1 model / 2 scenarios） | `AGENTS.md` 3.3：计数以 `typeMeta` 为准；`demoAssets` 与 `typeMeta` 冲突属原文自身不一致 | devin/interpreter-type-contract |
| Interpreter 创建按钮文案 | 使用 `Add X`（`Add Business Term` / `Add Analytical Model` / `Add Scenario Reporting`）；通用 `types.js` 为 `Create X`，生效专用视图为 `Add X` | 以后加载的专用视图为准（业务覆盖规则）；原文 `Add Scenario reporting` 小写 r 属笔误，已规范化 | devin/interpreter-type-contract |
| Interpreter 未知类型 | 原 `?type=` 非法值回退 `all` 显示概览；本实现改为显式 Unknown 空态，不渲染任何记录 | 防止非法类型意外展示全量记录的实现选择；用户并未禁止回退概览，此差异须在最终参照验收中重新评估 | devin/interpreter-type-contract |
| Interpreter 列表形态 | 类型页为通用行表（Title/Type/Creator/Process/AI Status 双状态列）；原专用视图为卡片网格、专属列（Email 10 列、BT 同义词卡、Scenario 卡 + 分页 + 逐卡动作） | 本轮只修数据契约与动作入口；逐类型视图属阶段 C | devin/interpreter-type-contract |
| Interpreter Hero | 选中类型时 Hero 标题/描述/统计切换为该类型（对齐原文逐类型 hero） | types.js 注释确认每类型有独立 hero statistics | devin/interpreter-type-contract |
| Home 助手历史弹窗 | React 版 popover 含 × 关闭按钮且锚定在抽屉内按钮下方；原始 `#homeHistoryPopup` 无关闭按钮（CSS 为死代码）、`position:fixed` 位于按钮左侧 | × 仅为可达性便利；锚定差异为组合方式差异，不做像素级复刻 | devin/interpreter-type-contract |
| Modal 表单值 | React Modal 关闭即卸载，重开时字段回 `defaultValue`；原生 `<dialog>` 仅隐藏，编辑值保留 | 受控组件生命周期差异；原始无提交后重开校验流程，登记不改架构 | devin/interpreter-type-contract |

## 4. 已知缺口

来自 2026-09-23 代码审查（细项见 AGENTS.md 2.4），尚待处理：

- 888177a 对抗性检查：把 accounts 场景的故事参数故意换成 overview，脚本仍 PASS；.mh-campaign 等外壳选择器不能证明正确状态。证据 /tmp/mh-adversarial-wrong-state（临时脚本 /tmp/mh-adversarial-check.mjs，未改仓库配置）。原始页为 Accounts，故事截图为 Overview Dashboard。须添加场景特有文案/选中状态/内容与排除错误区块的断言，并区分加载/交互/视觉三种结论。
- M0 把默认及 CSS 强制隐藏的旧 picker 列入 Home 待重建范围；已核验节点存在但不可见，尚需查实际可达路径，不能直接恢复旧界面。证据 /tmp/mh-adversarial-home。
- 盘点仍缺细粒度状态 ID、实际故事/验证场景映射和组件跨页复用表；页级描述不能构成可计数的完成分母。接续点原称 M0 完成只代表静态扫描，非里程碑验收完成。
- ~~审核时未提交 JSDoc 中 MetricStat 声明 banner/bronze，但 CSS 无对应变体，且遗漏已有 green/amber/blue/red；注释不能代替接口核对。~~ 已修复：JSDoc 改为 variant card|glass、accent gold|green|amber|blue|red，与 CSS 一致。

- a9542f7 复核：Principles 仍采用旧知识资产而非当前生效 globalPrinciples；Data Model 混用资产、模型源、domain，部分说明与 Published/Enabled 状态缺对应来源；“24 条全部真实抽样”尚不成立。
- ~~Library 独立故事受控值不回写、rows 不响应搜索/筛选，动态 Creator/Data Model 选项也未在该故事中生成；页面测试不能证明该故事可操作。~~ 已修复：Library 故事以 useSynced 维护 query/filterValues，按类型动态生成筛选选项并实际过滤行。Input/Area/Dropdown/Search/Tabs/Pills/Field/Scope 等其余受控故事的回写仍缺。
- Business Term 原始状态/创建者筛选为多选，现为单选；原始搜索覆盖 synonyms/scope/creator，现仅 title/summary。需修正或明确列为未完成行为，不能把视觉形态差异作为行为差异的替代说明。
- 原始截图缺五个类型及非默认筛选态；Principles 截图显示 Hero/侧栏布局与内容仍不同。一次性脚本吞掉 goto 异常，截图生成不能作为验收通过证据。

- ~~深审服务端渲染：Business Terms 仅改显示标题即从 1 条变 0；未知类型显示全量 6 条；model/metrics/email 均空但概览有计数，且只读类型出现创建按钮。~~ 已修复（devin/interpreter-type-contract）：records 以稳定 `typeId` 关联（改名不影响筛选）、未知 `typeId` 渲染显式空态、八类均有有来源的抽样记录、创建入口由 `type.manageable` 显式驱动。
- 知识记录已拆 `stage`（流程/发布阶段）与 `availability`（AI 可用性）双维度；`BusinessTermForm` 仍缺 Data Model 关联（`scope` 字段）及完整校验/故事接线；已有 synonyms 输入。各类型其他字段按原始生效表单分别盘点，不能混用——见 CONTEXT.md。
- 多个基础故事受控值未回写；TypeCard 图片依赖根路径 /assets 和 Storybook staticDirs，未验证独立宿主可用性。
- 原始 Scenario 的 types.js 旧状态与后加载专用脚本不同；本轮已按 scenario-reports.js 生效口径落数据（Draft/Queued/Building/Published + ai_interpreter_enabled 独立）。草稿/删除的界面状态与演示交互尚未完整重建；无需把原 localStorage 机制迁入组件。

- BusinessTermForm 必填校验缺失；TermForm 故事未同步受控输入；未接入页面创建流程。
- 助手模态焦点/Escape、Tabs 方向键、表格行键盘操作缺失。
- tokens.css 包含全局 reset；组件接口仍有 DOM event 透传、部分页面文案硬编码；Interpreter 已改用稳定 `typeId`（显示标题不再充当类型标识）。
- 缺少页面/状态/动作/故事/验证覆盖清单；仅有五个入口故事不能视为 17 页及其交互提取完成。

- Interpreter 非 overview 状态与原始差异大：原始为卡片网格与逐卡动作，当前为通用行表（Process/AI Status），缺少专用结构与逐卡动作。M4/M5 处理。
- `StatusBadge` 的 tone 由字符串包含判断决定，需改为显式 `tone` prop 或映射表。
- ~~`content.js` 中 `href` 为 `/home`、`/cockpit` 等 Demo 中不存在的路由，需在决定路由方案后统一。~~ 已修复：全部改为真实 Demo 路径（`/index.html`、`/assets/pages/*.html`、`reports.html?project=`）；独立宿主接入时由集成方替换 NAV。
- 页面故事内联 `style` 用作占位与间距（如 `<div style={{ height: 56 }} />`），需改为组件 CSS。
- 已有 9 条 Interpreter 行为测试；无 lint，尚无自动视觉验收脚本。
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
| 2026-09-23 | 复核 a9542f7：npm test 9/9；检查现存截图和脚本，纠正全八类对照声明；记录样例来源、Library 故事、筛选/搜索行为缺口，将组合条目标回进行中。未修改组件代码 | Codex |
| 2026-09-23 | 用户确认全量重建与奥卡姆剃刀目标；同步 AGENTS 目标和 M0–M7 规划，预置 17 页种子台账、接续协议与长程执行 prompt；旧阶段保留为历史，未新增实现/验收完成声明 | Codex |
| 2026-09-23 | 对抗性复核 888177a：单测 9/9；实测错误 Accounts 故事状态仍 PASS、Home 五个盘点节点隐藏；记录验收判据与盘点偏差，M0 标记进行中。Browser 插件不可用，使用本地 Playwright Chromium；未改组件或覆盖其他模型正在写入的 JSDoc | Codex |
| 2026-09-23 | M1 批：`src/design/index.js` 公共出口；全组件 JSDoc props；五故事文件 autodocs；补 9 个缺失组件故事（47 stories/5 docs）；Library 故事受控回写；FormField className；content.js 真实 href；Link/logo/WorkspaceCard 去无条件 preventDefault、WorkspaceCard href bug 修复、卡片能力链接改 `<a>`。npm test 9/9、build 通过 | Devin |
| 2026-09-23 | M2 Home 助手：AssistantPanel 答案流/历史 popover/expanded/焦点+Escape；buildAssistantAnswer 本地化 createAnswer 矩阵；TextArea forwardRef；新 tokens 与图标；Home 故事全受控流。复核修复：encArg 按 SB 8.6 解析器重写并改为响铃失败、console warning 入报告、弱断言加文本/detached、台账 D1/D2/D3/D6/D7/D9 更正、Header overlay 接线、枚举常量与 normalizeOptions/记录助手导出、Icon 故事。npm test 9/9、build 53 entries、visual-check 10/10 | Devin |
| 2026-09-23 | M3 P06：Modal 有机体 + Toast 分子；CampaignPage taskDialog/toast/onSubmitTask 接口与表单重建；FormField defaultValue；故事全受控（3s toast、Bind Account toast）；visual-check 新增 p06-campaign-task-dialog 配对。npm test 9/9、build 55 entries（50 stories）、visual-check 11/11 | Devin |
| 2026-09-23 | M3 P03：ActionCard 增 href（真实 `<a>`）与 history 图标；新 UploadHistory 有机体（Modal 组合，File/Uploader/Time 表 + Preview/Download + 空态）；SelfServicePage uploadHistory/onOpenHistory/onPreviewFile/onDownloadFile；新图标 file/eye/download；story 受控历史弹窗；p03-upload-history 配对场景。登记 workspace.js 死代码（analysisWorkbench 等节点不存在）与不可达 moduleHistory 模块。npm test 9/9、build 56 entries、visual-check 12/12 | Devin |
| 2026-09-23 | M3 P04：`FileDropzone` 分子（点击/拖拽/dropzone 高亮/选中文件提示）与 `DataUploadPage` 页面组合（back 链接、Template Import 工具栏、14 字段表单、Submit 1500ms 瞬态、Modal 承接 bulkImport 弹窗 + template 链接 + Tips）；新图标 upload/file-upload/arrow-left；DATA_UPLOAD 内容与受控故事；index.js 公共出口。原始 `.bulk-import-steps` 样式无 DOM 对应，未重建。npm test 9/9、build 58 entries（53 stories）、visual-check 15/15 | Devin |
| 2026-09-23 | 对抗性复核修复批（ebb598a + 85f4564）：AssistantPanel 补 Enter 提交（Shift+Enter 换行）、单次 Escape 同时关 popover 与面板（原始双监听器同帧触发）、关闭时重置 expanded/historyOpen、body 锁滚动、焦点还原加 isConnected 防护；建议/历史项/newSession 回填后聚焦 composer；答案 Copy 改为整卡 innerText 且仅 clipboard 成功才显示 Copied!（timer 卸载清理）；Home/Campaign 助手 launcher 常挂载（原始 #aiEntry 常驻）；feed 由追加改为整批替换（原始 `answerFeed.innerHTML=""`）；HomePage 补 onHistory 透传。Modal/Toast 批：任务弹窗三个 select 补 defaultValue（原 selectedIndex=-1 空面 + FormData null）、preview eyebrow 改 faint+uppercase、弹窗字段样式按 task-form-grid 原始度量覆盖（9px label/38px/11px/蓝色焦点环，新 token --mh-focus-blue）、Modal/AssistantPanel onClose 改 ref 防不稳定回调焦点抖动、Modal 补 Tab 焦点圈禁、z-index 140 高于 toast 120、toast 动画 5px/2600ms、账号计数补单复数（account/accounts shown）、故事 toast useSynced+timer 清理、Modal 故事去内联样式。已知差异登记：弹窗关闭后表单值不保留（原生 `<dialog>` 保留 DOM；React 卸载重建，登记而非改架构）。npm test 9/9、visual-check 15/15 | Devin |
| 2026-09-23 | P03 对抗复核修复（b4558cc4）：Modal 增 `variant="sheet"`（self-service 弹窗族 chrome：深 scrim 无 blur、无 border、radius 8、soft shadow、方形无边框 close、display 字体 italic 标题，新 `modalVariants` 导出），UploadHistory/bulkImport 接入并去重标题覆盖；上传卡栅格 `mh-page__cards--upload`（max-width 712、padding 16/24、copy gap 10、action 170px）、`.mh-action-card` hover 阴影+过渡、history 图标间距 10px；UploadHistory 行 hover、aria-label 带文件名、色彩改精确 token（新 --mh-scrim-deep/--mh-modal-shadow-soft/--mh-line-faint/--mh-row-hover/--mh-hover-warm/--mh-subtle/--mh-slate/--mh-empty/--mh-control-line）；dropzone 边框/悬停色同步精确 token；故事改 per-tab 类别状态（原始各面板 pill 独立）与 uploadHistory args 可生效。npm test 9/9、visual-check 15/15 | Devin |
