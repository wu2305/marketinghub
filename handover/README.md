# Marketing Hub Storybook 交接与状态

规则与长期规划见仓库根目录 `AGENTS.md`。本文件只记录状态，按 `AGENTS.md` 第 7 节的固定结构维护。

## 1. 当前状态

**最新目标（2026-09-23 用户确认）**：全量重建现有静态 Demo 的全部界面与既有前端交互，按奥卡姆剃刀提取最小必要 React 组件体系及各层 Storybook。覆盖不能缩水，抽象不能膨胀。当前仍为早期部分实现；旧阶段“完成”不代表页面全量验收。长程执行 prompt 见 [execution-prompt.md](./execution-prompt.md)。本文件是唯一状态台账，不另建 HANDOFF.md。

| 项 | 值 |
|---|---|
| 设计系统位置 | `src/design` |
| Storybook | 本次安装锁定版本 8.6.18，`@storybook/react-vite` |
| 故事数 | 38（Foundations 1、Atoms 6、Molecules 14、Organisms 12、Pages 5） |
| 测试 | `npm test`（vitest@4.1.11 + @testing-library/react@16.3.3 + jsdom），9 条行为测试通过（2026-09-23） |
| 构建验证 | 通过（2026-09-23，`npm run build-storybook -- --disable-telemetry`，38 stories、0 docs） |
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
| M0 | 全量入口/子视图/状态/动作与组件候选盘点；生效参照与冲突登记 | 未开始 | 本次仅预置里程碑与入口种子台账，未完成全量运行时盘点 |
| M1 | 最小可重复验证、公共出口/文档、故事状态接线、token/资源/导航基础 | 进行中 | 已有构建与 9 条测试，其他仍缺；a9542f7 为已有证据 |
| M2 | 外壳与完整 Home，包括助手实际可达状态 | 进行中 | #6/#8 有部分组件，尚未全量验收 |
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
| P04 | assets/pages/data-upload.html | 上传页全部区块、选择/校验/反馈等实际流程 | M3 | 未开始 |
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
| P15 | assets/pages/scenario-library.html | Scenario 列表、筛选与入口 | M6 | 未开始 |
| P16 | assets/pages/scenario-detail.html | Scenario 完整详情和可达操作 | M6 | 未开始 |
| P17 | assets/pages/scenario-edit.html | Scenario 编辑、校验、保存等实际行为 | M6 | 未开始 |

### 2.3 细分台账与证据记录格式

M0 在本节内逐页增加以下行，后续随实现维护；不要另建平行状态文件。大量重复行可用明确共享组件证据引用，但每个使用场景须标明是否已验证。

| 状态 ID | 页面/URL/生效来源 | 区块、初态与操作→预期结果 | 组件/层级与共用位置 | story ID/参数 | 行为与视觉证据 | 状态/缺口 |
|---|---|---|---|---|---|---|
| 待 M0 展开 | 必须含实际生效脚本/CSS，不能仅凭文件名 | 标明 query/hash/storage 种子；适用的默认/非默认/空/错误/禁用/覆盖层/窄屏状态 | 新建/复用/组合的理由；专用差异不强行统一 | 可直接复现 | 命令、结果、截图路径、对照结论；不能只写“截图完成” | 未开始/进行中/完成 |

组件清单也放本节：组件名、公共或私有、层级、原始使用位置、变体、输入/输出、故事、验证状态。以独立意义、稳定复用边界决定拆分；不要求每个 DOM 标签成为组件。

### 2.4 接续点

- **当前目标**：从纠正任务方向后的全量盘点开始，保留 a9542f7 有效修复；优先补真实来源和运行时覆盖证据，不继续把八类视图扩写成万能列表。
- **下一步**：读取当前 diff/分支与执行 prompt；完成 P01–P17 一级盘点并展开已发现的子视图/状态；建立第一条可重复的原始页/故事对照路径，然后继续真实页面提取。
- **已有验证**：9 条 Interpreter 测试曾复跑通过；构建 38 stories/0 docs 为历史基线，开始工作时重新确认。完整视觉验收尚未完成。
- **未提交改动**：本次任务仅修改 AGENTS.md、handover/README.md，并新增 handover/execution-prompt.md；连同此前未提交审核改动均须保留，不擅自 reset/stash 丢弃。
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
| `Header` logo | logo 链接仍 `preventDefault`；导航项已不再无条件阻止默认跳转 | 遗留导航缺口，后续仍须按组件语义规则修复 | #8 |
| Interpreter 侧栏/卡片计数 | 侧栏条目与 TypeCard 显示 `typeMeta.stats.total`（3 models / 3 scenarios）；原 sidebar `countForType` 数 `demoAssets` 实数（1 model / 2 scenarios） | `AGENTS.md` 3.3：计数以 `typeMeta` 为准；`demoAssets` 与 `typeMeta` 冲突属原文自身不一致 | devin/interpreter-type-contract |
| Interpreter 创建按钮文案 | 使用 `Add X`（`Add Business Term` / `Add Analytical Model` / `Add Scenario Reporting`）；通用 `types.js` 为 `Create X`，生效专用视图为 `Add X` | 以后加载的专用视图为准（业务覆盖规则）；原文 `Add Scenario reporting` 小写 r 属笔误，已规范化 | devin/interpreter-type-contract |
| Interpreter 未知类型 | 原 `?type=` 非法值回退 `all` 显示概览；本实现改为显式 Unknown 空态，不渲染任何记录 | 防止非法类型意外展示全量记录的实现选择；用户并未禁止回退概览，此差异须在最终参照验收中重新评估 | devin/interpreter-type-contract |
| Interpreter 列表形态 | 类型页为通用行表（Title/Type/Creator/Process/AI Status 双状态列）；原专用视图为卡片网格、专属列（Email 10 列、BT 同义词卡、Scenario 卡 + 分页 + 逐卡动作） | 本轮只修数据契约与动作入口；逐类型视图属阶段 C | devin/interpreter-type-contract |
| Interpreter Hero | 选中类型时 Hero 标题/描述/统计切换为该类型（对齐原文逐类型 hero） | types.js 注释确认每类型有独立 hero statistics | devin/interpreter-type-contract |

## 4. 已知缺口

来自 2026-09-23 代码审查（细项见 AGENTS.md 2.4），尚待处理：

- a9542f7 复核：Principles 仍采用旧知识资产而非当前生效 globalPrinciples；Data Model 混用资产、模型源、domain，部分说明与 Published/Enabled 状态缺对应来源；“24 条全部真实抽样”尚不成立。
- Library 独立故事受控值不回写、rows 不响应搜索/筛选，动态 Creator/Data Model 选项也未在该故事中生成；页面测试不能证明该故事可操作。
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
- `content.js` 中 `href` 为 `/home`、`/cockpit` 等 Demo 中不存在的路由，需在决定路由方案后统一。
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
