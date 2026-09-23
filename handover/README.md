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
| P05 | assets/pages/media-tracking-detail.html | 完整详情、筛选/表格/图表及实际页内交互 | M3 | 已实现+配对验证（26/26）；四粒度 tab、15 项筛选、5 条说明、1800px 长表（42 字段 15 行）、lite 助手抽屉/简单答案卡、+ 技能菜单（Upload/Analytical Model/搜索/芯片）与 Generate Model 三段流（历史勾选→生成表单/手动表单）完成 |
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
- URL：`?project=rednote|abo|customer|city|fourp|ottolv`、`?dashboard=N`（dashboard 存在时强制 `view=live`）。
- 视图：catalogView（目录→项目→报表，knowledgeFilters）；报表详情抽屉（details*：meta/hierarchy/metrics/business-terms/data-model/principles/context/scenarios/playbooks/thumbnail + detailsOpenReport）；liveView 报表页内 dashboard（liveTitle/liveKicker/live-panel-overview，city 项目有专用分析）；aiWorkspace（aiStart 初始、aiCommandForm 提问、aiChatThread 流、aiAnswer{Summary,Findings,Sources} + aiRecommendations + aiFeedback、aiCmdUpload+popup、aiHistory、aiPeriodHint、aiScrim、aiMaximize）。
- 现状（P02a 已完成并配对验证）：`src/design/report-data.js` 直译六项目×两报表契约（REPORT_GROUPS/REPORT_PROJECTS/KNOWLEDGE_ASSETS + pluralize/resolveReportAssets/projectSearchText/reportSearchText/resolveReportContext/reportContextHref/projectCatalogHref/liveReportHref）。`MarketingCockpitPage` 重建目录分组（CategoryHeading+ProjectCard 锚卡）、`?project=` 项目目录（ProjectDirectory：返回链接/缩略图/kicker/描述/计数徽章/updated）、ReportRow（REPORT 序号/面包屑/标题链接/描述/Owner·Cadence·Updated·Knowledge dl/Knowledge 上下文链接/Open Dashboard→live）、跨项目+报表+关联知识标题搜索、`.mh-empty-state` 空态、hero 260px（原 CSS `height:260` 压过基础 min-height:238，早先误记 320）。详情抽屉 `ReportDetailsDrawer` 已建（thumbnail/大写 hierarchy/标题/说明/meta dl/六段资产 pill/AI ANALYSIS SCENARIOS 01+序号+view more 展开/active 切换/全屏/Escape+scrim+焦点还原/`dialog-open` 锁滚动）。**死代码登记**：原页 `openDetails()` 无调用方——Knowledge 按钮实为跳转 `knowledge.html?type=Report Context&detail=<id>`（resolveReportContext 复刻三级回退）；抽屉按 props 驱动组件保留+独立故事，页内不设虚构触发器。`reportView`/`renderReportContext`/`renderLiveDrivers`/`renderLiveDefinitions`/`#catalogDescription`/`.report-category-mark` 均无生产方，不重建。目录助手 = 共享 `AssistantPanel`（非 aiWorkspace）：scope/picker 全隐藏（原 `display:none!important`）、suggestion 点击即提交、answers 追加式 compact 卡（recommendation+"Sources used"+feedback）、stage 随答案隐藏（`hideStageOnAnswers`）、skillMenu+Recent Chats+maximize/new-session。9 个配对场景全过（p02-cockpit*/details*/assistant）。**注意**：抽屉 `#detailsTitle` 在原页从不更新（恒 "Invest City Strategy Analysis"），React 版渲染真实标题——已登记差异。P02b-1 已完成并配对验证：`MarketingCockpitPage` 新增 `view="live"`+`dashboard` props（枚举 `cockpitViews` 已导出），live 分支渲染 `LiveReportView`（sticky 浅底 toolbar 72px/“← Report library”回链 `?project=<key>`/eyebrow“{PROJECT} / LIVE REPORT”/h1 42px/600/底边 `--mh-live-inkline` #2a2925/`--mh-live-panel`）。通用报表走 `LiveOverview`（4 KPI 卡 min-h118/双条柱图 #d8d4c9+`--mh-live-bar-alt` #79a991/33%·66% 暗网格线/“Leading views” rank 取 chart 前五行原始顺序、width=value%、accent 条 4px）。city+index0 走 `CityInvestDashboard`——`report-data.js` 逐字移植 scCats/scBaseline/SC_KPI/SC_KPI_ROWS/scCityStores + scHashStr/scMulberry32/scGenScenario/scPickTicks/scFmtAfter/scStoreOptionsFor/scStoreScopeSuffix/scTotalLabel/scSelectionLabel/isCityInvestReport；筛选条（2 静态+5 下拉：end/channel/pilot 单选 radio、city/store 多选 checkbox 含 Multi-select/Select all/Clear、store 随 city 级联、文档点击关闭、`.is-open` 翻转箭头）、两排 10 KPI（uplift ▲▼ +Var% +After/sc-plain 卡）、公式 legend、动态标题 `{totalLabel} Monthly…`、6 张 SVG 趋势图（#333 invest 1.4px vs #c9a876 non-invest 1px、4 网格线+轴标签、hover 十字线+跟随 tooltip）、筛选变更 canvas 闪暗 .55→1。原实现缺陷如实复刻：city 过滤器恒显 “All Stores”（multi 全选文案分支）、isDefault 永不成立（`f.city.includes("Total")` 对城市名数组恒 false→默认态也走种子扰动，KPI +14%/0.3K/5,121 与原字节级一致）、空选城市标题回 “Total”。`ScFilterDropdown`/`ScTrendChart` 为私有组件。新增 tokens `--mh-live-*`/`--mh-sc-*`。5 个配对场景：p02-live-overview/-city/-city-channel（Online→+15%/0.4K/4,565）/-city-cascade（去 Chengdu→5 Cities 标题+store 级联）/-city-hover。P02b-2/-3 已完成并配对验证：`ReportCopilot` 有机体重建 aiWorkspace 全流——抽屉 min(40vw,100vw-80px) 右开+scrim+body 锁滚、打开聚焦 ×、Escape/scrim/× 关闭、New Session、Maximize/Restore（min(1040px,100vw-80)×min(760px,100vh-80) 居中弹窗，≤768px inset:12 满屏）、History 弹层（3 条 prompt 填充 composer）、AI summary 抽屉（`·` 分隔指标+chevron）+Scenario reports（view more 展开 6 条）、recommendation 点击进标准答案（CONTEXTUAL ANSWER/标题/概要/编号 findings/Sources used 链接/Helpful·Not helpful radio+动态 status）、city index0 进 11 块流式 holistic（110ms 逐块 hr-* 表格/点阵/insight）、自定义问题进 chat 模式（bubble+标准卡）或 rich pilot-sales 卡（140ms 流式 ra-* 渠道卡+insight+explore 4 项）、已有答案时提问追加 chatThread、`← Suggested questions`/`data-ai-back` 回起点、context dock（AI summary/Scenario reports 按钮驻入答案视图，新答案重置）、composer（hint/380px 右对齐 textarea autoGrow≤160/required/发送金渐变 60px）、“+”技能菜单（Upload File/Analytical Model 悬停预览 178→300px/搜索/置顶 pin/外点+Escape+120ms 延迟关）→ `ModelFlowDialog` 报表变体（扁平消息流 Selected N/6、Generation Rule、Generate→生成表单 Submit 在 Save 前、Create Manually 手动表单必填校验）。宿主持有 wsAnswer/wsChat/wsPrompt/wsFlow 确定性状态（resolveCopilotAnswer/buildCopilotChatEntry/isPilotCitySalesQuestion/buildReportModelDraft）。新增 `--mh-copilot-*`/`--mh-hr-*`/`--mh-ra-*` tokens；organisms 独立故事 `ReportCopilotWorkspace`。**原缺陷如实保留/修复两处**：History 弹层原页因 `top:100%+8px` 相对 fixed 抽屉定位恒在视口外（top≈1408@1400）——React 版锚在 head-actions 内可见，已登记有意差异；历史项 prompt 大写来自 `.ai-workspace-head span` 级联泄漏，如实复刻。22 个 p02-copilot-* 配对场景（open/more/answer/holistic/chat/chat-rich/chat-append/dock/history/skill/skill-pick/flow-history/flow-form/maximize/newsession/escape/scrim/back/feedback/focus/mobile390/generic fourp）+全套 61/61。复核欠账 6c0ef96f/9b27050f 已清零：ScTrendChart stale-hover 崩溃修复（`[data,endIdx]` 重置 + `hi` 渲染钳制）、live kpi/card 边色 #dce1e6+白底、chart 底 #f7f7f7、back hover #141414、sc-phead 链接 #185fa5、compact answer 卡按原度量重写（p 12px/sources 9px 行距/feedback 描边 chip+正负着色态）、launcher 104px min-width+aura::before+hover/focus-visible、drawer ask 条 --mh-surface-ai(#f7f8fa)；新 token --mh-launcher-*/--mh-ai-*/--mh-live-chart-bg/--mh-live-back-hover/--mh-sc-link/--mh-reports-line。新增回归场景 p02-live-city-hover-shrink（hover 后缩区间断言无崩溃+tip 隐藏）。全套 62/62。P02 残余已清零：dashboard 契约修正两处——`dashboard` prop 默认改 null，`view=live` 无 dashboard 时回目录（原 `query.get("dashboard")!==null` 门控）；越界 index 回退 0（原 `reports[i]?i:0`，非 clamp 末位）。新增 12 场景：p02-live-gate（无 dashboard→项目目录）、-oob（dashboard=9→report0）、六项目全量 live 配对（city-d1 通用视图/fourp-d1/customer-d0·d1/abo-d0·d1/rednote-d0·d1/ottolv-d0·d1，断言 kicker/h1/KPI/rank 值与 accent）。全套 74/74。P02 全部视图配对完毕。
- 组件候选：ReportCatalog(已)、ReportDetailsDrawer(已)、LiveReportView(dashboard 图表)、AiWorkspace( cockpit 内嵌，非侧栏助手 )。

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
- 现状：`MediaTrackingDetailPage` 已重建——四 tab、15 筛选（3 required）、5 条说明、42 字段长表、lite 助手（drawer/Recent Chats/新会话/最大化/Escape+backdrop 关闭/launcher hidden、scope 区按原始 CSS 隐藏、Enter 不提交=换行）；"+" 技能菜单经 `SkillMenu`+`ModelFlowDialog` 重建（Upload 触发隐藏 file input；Analytical Model 详情搜索/选中芯片/置顶提示；Add from Chat History→6 消息勾选→Generate→生成表单（Back 保留勾选与规则）；Create Manually→空表单；Save/Submit 必填校验+Saved/Published 450ms 关闭）。10 个配对场景全过。原始死 CSS 未重建：`.ai-skill-create`、`.ai-skill-manage`、`.ai-history-item/.ai-history-list/.ai-history-conversation*/.ai-history-clear`（无生产方）。

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

- **当前目标**：M3 P02 推进中——P02a 目录脊柱 + P02b live 视图与 Report Copilot 全部完成并配对验证。本轮新增：`ReportCopilot` 有机体（aiWorkspace 全流：抽屉/expanded 弹窗/scrim/Escape/焦点/New Session/History 弹层/summary+scenario 上下文区/recommendation 答案/holistic 与 rich 流式回答/chatThread 追加/context dock/feedback radio/composer 380px 右对齐/技能菜单/ModelFlowDialog 报表变体），页面 live 态挂接 + organisms 独立故事；宿主确定性状态 resolveCopilotAnswer/buildCopilotChatEntry/isPilotCitySalesQuestion/buildReportModelDraft。22 个 p02-copilot-* 配对场景新增，全套 61/61，build 65 stories。
- **下一步**：M3 推进中——P02 全部视图已配对完毕（目录/项目目录/详情抽屉/12 个 live 视图/aiWorkspace 全流）；下一条按台账选 P06 channel tabs 内容差异核对或 P07 Interpreter 八类型配对补全。M1 余项并行欠账：色值 token 化余量、`@media`/`:focus-visible` 覆盖、独立 React 宿主。工作分支 `devin/interpreter-type-contract`（…→ ebb598a → 85f4564 → 9a8f3e8 → 5639a58 → 52560bc → e2071c9 → 619659b → 356c32d → f2d054e → d044b1b → 53eef22 → 132ee7a → f186b55），未合入 main。
- **未提交改动**：无（f186b55 已含 pages.jsx dashboard 契约、pages.stories.jsx 去 dashboard 默认 arg+liveIndex 修正、visual-check.config 12 个 live 场景、台账）。
- **已有验证**：2026-09-24 `build-storybook` 65 stories；`node scripts/visual-check.mjs` 74/74 PASS（P01–P07 全套件：39 原有 + hover-shrink + 12 个 live 残余场景 + p02-copilot-* 22 场景）；`npm test` 9/9。截图人工比对：hover-shrink/home/live-overview/rednote-d0/live-gate 对与原始一致。原侧已知缺陷登记：History 弹层恒在视口外（React 版锚定修复，见有意差异表）；`#aiMaximize`/`#aiHistory` 在 assistantPanel 与 aiWorkspace 中重复 id（场景选择器需 `#aiWorkspace` 前缀）。此前验证：2026-09-23 `npm test` 9/9、visual-check 34/34（P05 十场景明细见历史行）。
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
| P04 FileDropzone | React 版给 file input 加 `stopPropagation`，点击 dropzone 可正常打开文件选择器；原始 upload.js 同款嵌套结构存在递归调用（`fileInput.click()` 冒泡回 dropzone 处理器）为参照缺陷 | 不逐 bug 复刻参照物；点击崩溃属明确缺陷 | devin/interpreter-type-contract |
| P04 FileDropzone drop | React 版 drop 即触发 `onSelect` 并显示 "Selected: <file>"；原始 `fileInput.files = dataTransfer.files` 不派发 change，提示不更新（仅文件选择器路径更新） | React 行为更符合原始意图；差异登记 | devin/interpreter-type-contract |
| P05 导航 active | React `current="self-service"` 渲染导航下划线激活态；原始 media-tracking 页 CSS 无激活下划线（flexible 页才有） | 保留语义激活态；下划线是共享 Header 的既有渲染，不逐页关断 | devin/interpreter-type-contract |
| AssistantPanel backdrop | React 面板打开恒渲染 backdrop；原始仅 P05 有 `.ai-assistant-backdrop` 节点（P03/P06 等页无 scrim） | 单一组件一处渲染；接入 P03/P06 助手时按页核验 scrim 取舍 | devin/interpreter-type-contract |
| AssistantPanel 菜单态 | React 关闭即卸载，重开后技能菜单/选中芯片复位；原始仅隐藏面板，隐藏期间菜单 DOM 状态保留 | 受控组件生命周期差异；原始无可达的“关后保留菜单再复用”验收路径，登记不改架构 | devin/interpreter-type-contract |
| P02 详情抽屉标题 | React `ReportDetailsDrawer` 渲染当前报表真实标题；原始 `openDetails()` 从不写 `#detailsTitle`，恒为静态 "Invest City Strategy Analysis"（demo 缺陷，且该函数无调用方） | 不逐 bug 复刻；抽屉本身在原页不可达，组件按 props 驱动保留 | devin/interpreter-type-contract |
| P02 Report Copilot History 弹层 | React 版弹层锚定在 head-actions 栏内、紧贴 History 按钮下方可见；原始 `#aiReportHistoryPopup` 是 `.ai-workspace-head-actions`（无 position）的 absolute 子节点，`top:calc(100%+8px)` 相对 fixed 抽屉解析为视口下方（实测 top≈1408@1400 高），任何视口下不可见 | 原实现为恒不可达的 demo 缺陷；修复锚定而非复刻 bug。弹层内 prompt 文本的大写渲染来自 `.ai-workspace-head span` 级联泄漏，React 版仍复刻该视觉效果 | devin/interpreter-type-contract |

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
- 助手焦点管理/Escape 已补齐（打开聚焦 composer、关闭还原焦点、Escape/backdrop 关闭）；仍缺：Tabs 方向键、DataTable 行键盘入口、ModelFlowDialog 焦点圈定（原始亦无关闭热键）。
- tokens.css 包含全局 reset；组件接口仍有 DOM event 透传、部分页面文案硬编码；Interpreter 已改用稳定 `typeId`（显示标题不再充当类型标识）。
- 缺少页面/状态/动作/故事/验证覆盖清单；仅有五个入口故事不能视为 17 页及其交互提取完成。

- Interpreter 非 overview 状态与原始差异大：原始为卡片网格与逐卡动作，当前为通用行表（Process/AI Status），缺少专用结构与逐卡动作。M4/M5 处理。
- `StatusBadge` 的 tone 由字符串包含判断决定，需改为显式 `tone` prop 或映射表。
- ~~`content.js` 中 `href` 为 `/home`、`/cockpit` 等 Demo 中不存在的路由，需在决定路由方案后统一。~~ 已修复：全部改为真实 Demo 路径（`/index.html`、`/assets/pages/*.html`、`reports.html?project=`）；独立宿主接入时由集成方替换 NAV。
- ~~页面故事内联 `style` 用作占位与间距（如 `<div style={{ height: 56 }} />`），需改为组件 CSS。~~ 已修复：页面故事改用 `.mh-page__offset` 类；其余内联仅限组织物故事的布局容器。
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
| 2026-09-23 | M3 P05：`MediaTrackingDetailPage`（back 链接、eyebrow/标题、四粒度 Tabs aria-selected、15 项筛选栅格含 3 个 required 星标、5 条维度说明 term 加粗、42 字段表格 title/count+chevron、min-width 1800 横滚、600px 粘性 thead、行 hover）；`AssistantLauncher` 增 `hidden` prop（[hidden] display:none，launcher 常挂载）；`AssistantPanel` 增 `historyTitle`、可选 `onSkill` 技能按钮、`answer.simple` 单行答案卡变体、历史计数条件渲染。内容契约 MEDIA_TRACKING（周期/筛选/说明/列/15 行真实数据）+ LITE_ASSISTANT + buildLiteAssistantAnswer；新图标 chevron-down。原始死代码/差异：tab 切换仅改 active（各粒度表数据同源渲染）；inline 脚本仅 11L 切换逻辑；~~skill-menu 登记为死代码~~（本轮初判错误，619659b 复核纠正：lite 面板会先建挂载节点，菜单实际可达，已于下一行批次补全）。npm test 9/9、build 59 entries（54 stories）、visual-check 18/18 | Devin |
| 2026-09-23 | P04 对抗复核修复（5639a58 批次）：FileDropzone file input 加 `stopPropagation` 修点击递归（原始 upload.js 同款潜在缺陷，登记为有意差异）；`.mh-bulk-import` 改 `.mh-modal__dialog.mh-bulk-import` 修 CSS 加载序战败（pages.css 先于 organisms.css 被打败）；submit 按钮补 align-self/min-width/40px/14px/无 border-shadow/hover 0.92（原 stretch 满宽）；Template Import 按原始度量覆盖（~33px/13px/600/#1a1d20/14px 图标/琥珀 hover）；表单 label 13px/600 + input border/focus 金环按原始（新 token --mh-ink-strong/--mh-ink-field/--mh-icon-slate/--mh-focus-gold）；dropzone dragover 边框改 --mh-gold(#e6bc73) 与 hover(#daa860) 区分；back 链补 transition；模板链接补 `download`；14 字段补 `autocomplete="off"`（TextInput/TextArea/Select/FormField 透传）；onNavigate/onDownloadTemplate 回调 href 与渲染 fallback 对齐；JSDoc 补 selectedPrefix/accept/templateHref；故事 selectedFile/fileName 改 useSynced + submitTimer 卸载清理；harness 新增 `upload`（setInputFiles）动作；p04-close 先 wait 弹窗挂载再 Escape（防假 PASS）；新增 p04-data-upload-drop 配对（双侧 setInputFiles→Selected 提示 + story 侧 dropzone 点击验证无 pageerror）。npm test 9/9、build 59 entries、visual-check 19/19 | Devin |
| 2026-09-23 | M3 P05 技能菜单/模型流 + 619659b 复核修复：`AssistantPanel` 扩展 `skillMenu`/`selectedSkill`/`enterToSubmit`/`onAttach`/`onSelectSkill`/`onClearSkill`/`onSkillAction`/`onFeedback`；新增 `SkillMenu`（私有，分类/详情/搜索/置顶提示/最近两项）与导出 `ModelFlowDialog`+`modelFlowSteps`（history 勾选→Generate 校验→生成表单 Back 保留勾选与规则/手动表单 Save/Submit 必填校验/450ms 关闭，`buildModelDraft`/`buildModelLogic`/`buildModelDescription` 确定性生成）；lite 助手对齐原始：scope 隐藏+保位、`historyTitle="Recent Chats"`、Enter 不提交、backdrop/Escape/工具行按原始精简；P05 Back 改白底 pill、`.mh-page__offset` 取代内联 height:56、配色按 media-tracking.css 精化；`Select` 占位改隐式文本值（对齐原生 option）；新图标 chat/pen/pin/spokes；新增 LiteAskPanel/ModelFlow 独立组织物故事与 index.js 导出；visual-check 增 p05-assistant-history/-maximize/-new-session/-escape、p05-skill-menu/-history/-manual 七场景并修正原侧选择器（`#aiGeneratedModelDialog` 兼手动表单）。死 CSS 不重建：`.ai-skill-create/.ai-skill-manage/.ai-history-*` 无生产方。npm test 9/9、build 61 entries（56 stories）、visual-check 26/26 全套件回归 | Devin |
| 2026-09-23 | M3 P02a Cockpit 脊柱：`report-data.js` 直译六项目×两报表+KNOWLEDGE_ASSETS 契约（pluralize/resolveReportAssets/projectSearchText/reportSearchText/resolveReportContext/reportContextHref/projectCatalogHref/liveReportHref/DETAILS_ASSET_SECTIONS）；`ProjectCard` 改锚卡 + `ProjectCatalog`（分组 heading+锚导航）、`ProjectDirectory`（back/kicker/title/desc/计数/updated/列表头）、`ReportRow`（REPORT 序号/面包屑/标题链接/meta dl/Knowledge 上下文 `<a>`/Open Dashboard live 链接）、`ReportDetailsDrawer`（scrim/Escape/焦点还原/锁滚动/全屏/view more/active 场景/六段资产 pill）有机体；`MarketingCockpitPage` 重写为 all/project 双模式+跨字段搜索+`.mh-empty-state`（避开 P07 共用 `.mh-empty` 冲突）+报告态共享助手（`hideStageOnAnswers`+compact `answer.variant="compact"` 卡+"Sources used"+skillMenu/Recent Chats）。复核修正原认知：Knowledge 按钮实为 knowledge.html 上下文跳转（三级回退解析），详情抽屉 `openDetails` 无调用方按死代码登记、组件 props 化保留；`reportView`/`renderLiveDrivers`/`renderLiveDefinitions`/`#catalogDescription`/`.report-category-mark` 不可达不建；hero 260px 纠正（min-height 238 不压 height 260）；hierarchy 大写渲染；非 home 面板 scope/三 picker 全 `display:none`。harness 增 `eval` 动作（原侧调 `openDetails` 自身函数比对死代码抽屉）；九场景：p02-cockpit、-project、-search、-search-empty、-details、-details-more、-details-fullscreen、-details-escape、-assistant。npm test 9/9、build 57 stories、visual-check 34/34 全套件 | Devin |
| 2026-09-24 | M3 P02b-1 live 报表视图：`MarketingCockpitPage` 增 `view`/`dashboard` props（导出 `cockpitViews`），live 态挂 `LiveReportView`（sticky 浅底 toolbar/`← Report library`→`?project=<key>` 回链/eyebrow/42px h1/#2a2925 底边）+ `LiveOverview`（4 KPI/双条柱图 #d8d4c9·#79a991/暗网格线/Leading views 前五行原始顺序）或 `CityInvestDashboard`（report-data.js 逐字移植 sc* 常量+scHashStr/scMulberry32/scGenScenario/scPickTicks/scFmtAfter/scStoreOptionsFor/scStoreScopeSuffix/scTotalLabel/scSelectionLabel/isCityInvestReport；5 下拉含 radio/checkbox 面板、Multi-select/Select all/Clear、store 随 city 级联、文档点击关闭、双 rAF 闪暗 .55→1；10 KPI 两排+公式 legend+动态 `{totalLabel}` 标题+6 SVG 趋势图 hover 十字线/tooltip）。如实复刻原缺陷：city 过滤器恒 “All Stores”、isDefault 恒 false（city.includes("Total") 永假→默认态种子扰动，+14%/0.3K/5,121 与原字节级一致）、空选回 “Total”。live 态 launcher 改 `onOpenWorkspace`（Report Copilot 组件待下条）。新增 `--mh-live-*`/`--mh-sc-*` tokens；私有 ScFilterDropdown/ScTrendChart；Live report view + Six-city invest analysis 独立故事。五场景：p02-live-overview、-city、-city-channel（Online 种子值）、-city-cascade（去 Chengdu→5 Cities+store 级联）、-city-hover。npm test 9/9、build 59 stories、visual-check 39/39 全套件 | Devin |
| 2026-09-24 | M3 P02b-2/-3 aiWorkspace Report Copilot：新增 `ReportCopilot` 有机体（`open`/`stream`/`title`/`summary`/`recommendations`/`periodHint`/`sources`/`answer`/`chat`/`prompt`/`history`/`skillMenu`/`flow` props + onAsk/onRecommendation/onBack/onPromptChange/onFeedback/onChatFeedback/onCopy/onExplore/onAttach/onSelectSkill/onSkillAction 回调；宿主持有确定性答案状态）。覆盖全流：右开抽屉 min(40vw,100vw-80)+scrim+body 锁滚+打开聚焦 ×+Escape/scrim/× 关闭；New Session 复位；Maximize/Restore 居中弹窗（≤768px inset:12）；History 弹层 3 条点击填充 composer（原版恒在视口外——锚定修复已登记有意差异，prompt 大写级联泄漏如实复刻）；AI summary 抽屉（borderless chevron 20px、`·` 指标分隔）+ Scenario reports（view more 展开 6 条，无 chevron）；推荐点击进标准答案（CONTEXTUAL ANSWER/findings/Sources/feedback radio+动态 status）；city index0 holistic 11 块 110ms 流式（hr-* 表格/点阵/insight/chart）；自定义问题→chat 模式（bubble+标准卡 2 grounded sources）或 rich pilot-sales 卡（ra-* 双渠道卡/insight/4 explore 项，sources+feedback 合流末块）；已有答案提问追加 chatThread；`← Suggested questions` 回起点；context dock 驻入答案区、新答案重置；composer hint/380px 右对齐 autoGrow≤160/required/金渐变 ASK 60px；`+` SkillMenu 报表变体（Upload/Analytical Model 悬停预览、搜索、置顶、120ms 延迟关）；ModelFlowDialog 报表变体（扁平消息流、Generate→表单 Submit 先于 Save、手动表单必填）。`TextArea` 补 `required` 透传。新增 `--mh-copilot-*`/`--mh-hr-*`/`--mh-ra-*` tokens 与 organisms 独立故事。22 个 p02-copilot-* 配对场景（含 focus-on-open 断言、390px 几何断言、history 填充 eval 断言、duplicate-id 选择器修正）。npm build 65 stories、visual-check 61/61 全套件 | Devin |
| 2026-09-24 | P02b 复核欠账清零（6c0ef96f+9b27050f 两批发现）：`ScTrendChart` stale-hover 崩溃修复——`[data,endIdx]` 变更重置 hover + 渲染期 `hi=Math.min(hover.index,labels.length-1)` 钳制（原 canvas 重绘即清 hover，React 状态跨数据更新残留）；live 面板对齐原始 cascade——kpi/card 边 `--mh-reports-line`#dce1e6+`--mh-surface` 白底无阴影、chart 底 `--mh-live-chart-bg`#f7f7f7、back hover `--mh-live-back-hover`#141414、h1 维持 DIN 42px/600 纠正早前 Benton 误判；six-city `.mh-sc-phead` 链接 `--mh-sc-link`#185fa5。compact answer 卡按原度量重写（正文 12px、sources 9px/1.55 行距、feedback 改描边 chip `--mh-ai-chip-*`+helpful 绿/not-helpful 红 pressed 态，`data-kind` 属性接色）；`AssistantLauncher` 补齐原始契约 min-width 104px+aura `::before` 光晕+hover/focus-visible（`--mh-launcher-*` tokens）；drawer ask 条撤销白色覆盖回 `--mh-surface-ai`#f7f8fa。新增回归场景 `p02-live-city-hover-shrink`（hover→缩 end 区间→断言无 pageerror+tip 隐藏+单点图渲染）。npm test 9/9、build 65 stories、visual-check 62/62 全套件 | Devin |
| 2026-09-24 | P02 live 残余清零：dashboard 契约修正——`dashboard` prop 默认 null，`view=live` 无 dashboard 回项目目录（原 `query.get("dashboard")!==null` 门控，P02b 误为恒 live）；越界 index 回退 report0（原 `reports[i]?i:0`，非 clamp 末位）；pages.stories 去 `dashboard:0` 默认 arg 使缺省态可配。新增 12 个配对场景：p02-live-gate（无 dashboard→目录）、-oob（d=9→report0）、city-d1（通用视图非六城）、fourp-d1、customer-d0/d1、abo-d0/d1、rednote-d0/d1、ottolv-d0/d1——逐视图断言 kicker/h1/首 KPI 值/首 rank 值+项目 accent。六项目×两报表 live 全配对完毕。npm test 9/9、build 65 stories、visual-check 74/74 全套件 | Devin |
