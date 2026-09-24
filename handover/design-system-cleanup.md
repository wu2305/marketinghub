# 设计系统清理清单（2026-09-24，claude.ai/design 同步时发现）

来源：把 `src/design` 同步到 claude.ai/design 项目 “Marketing Hub”（57 个组件，逐一与 Storybook 截图对照，均 match）过程中暴露的源码问题。同步本身是忠实的：以下问题在仓库自己的 Storybook 里同样存在。本文件只是清单与执行提示；状态仍以 `handover/README.md` 为准（规则见 AGENTS.md §7）。

证据：`scripts/font-probe.mjs`（逐故事字体探针，2026-09-24 输出 19 行）、`ds-bundle/_screenshots/compare/`（配对截图，本地，gitignored）、`.design-sync/NOTES.md`。

## 清单

优先级：P1 影响每个使用者的可见缺陷；P2 接口/工程问题；P3 结构性清理。

- [ ] **P1 字体回退为浏览器默认衬线（Times）**。19 个故事中有文字节点未继承 `--mh-font`：CheckboxFilter、FileDropzone、Pagination、SearchField（`mh-sr`/`mh-search__mark`）、Toast、ViewHeading、AssistantPanel、CampaignRail、KnowledgeLibrary、LibraryToolbar、LiveOverview、LiveReportView、Panel、PrinciplesView、ProjectDirectory、ReportCopilot、ReportDetailsDrawer、ReportRow、UploadHistory。根因：`tokens.css` 的作用域 reset（`:where([class*="mh-"], [class*="mh-"] *)`）不设 `font-family`，组件只在部分元素上声明字体，页面故事靠页面外壳兜底。修复方向：在作用域 reset 中给 `mh-` 根设置 `font-family: var(--mh-font)`（或每个有机体根声明一次），不要逐元素补丁。验收：重跑字体探针，输出为空。
- [ ] **P1 LiveReportView 粘性 “Report library” 条遮住页标题 “4P Executive Overview”**（Storybook 与预览一致）。检查粘性条的 `top`/`z-index` 与标题容器的 `scroll-margin`/上边距；对照原始 `assets/pages/reports.html` 的 live 视图。
- [ ] **P1 TypeGrid/TypeCard 标题被截断并与右上角计数徽标重叠**（“Report Conte…”、“Metric Dictio…”、“Analytical Mod…”、“Scenario Rep…”）。卡片内文字绝对定位，未给徽标预留宽度。对照原始 knowledge.html 概览网格。
- [ ] **P2 组件 CSS 仍有 146 处裸十六进制色值**（非 `var()` 回退；molecules 48、organisms 70、atoms 27、pages 1），违反 AGENTS.md §3.2 “目标为 0”。
- [ ] **P2 Token 膨胀：`tokens.css` 定义 338 个变量、220 个不同颜色值**，大量是单组件一对一别名（`--mh-copilot-*`、`--mh-reports-*`、`--mh-sc-*`、`--mh-hr-*`、`--mh-ra-*`、`--mh-bt-*`、`--mh-pagination-*`、`--mh-principle-*`…）——等于把硬编码色值挪进了 token 文件，不是调色板。收敛为一组语义 token（ink/copy/muted/line/surface/gold/status/overlay），组件级变量只在确有主题化需求时保留，并引用语义 token 而非新十六进制。同值重复的 token（如 `#dfe3e8`、`#c9a44a`、`#6b7280`、`#141414` 各 4 次）先合并。
- [ ] **P2 枚举 props 的类型退化为 `string`**。`BUTTON_VARIANTS` 等数组不是 `as const`/字面量联合，JSDoc 的 `typeof X[number]` 推导为 `string`，生成的 `.d.ts`（例如 `Button.d.ts` 里 `variant?: string`）丢失取值。改为 JSDoc `@type {readonly ["primary", ...]}` 或在 `@param` 写字面量联合；对 Hero/Header/Modal/MetricStat/Tabs/SearchField/AssistantPanel 等所有导出的枚举一并处理。
- [ ] **P2 图片依赖宿主提供 `/assets`**。Header 默认 logo、TypeCard 的 8 张背景（`ART`）通过 `assetUrl()` 在运行时拼 `/assets/images/...`，并读取 `import.meta.env.BASE_URL`；组件脱离 Storybook/Vite 宿主就断图（同步时只能在库构建里把图片内联成 data URL 兜底，见 `.design-sync/build-dist.mjs`）。改为：内置图片作为模块 import（由打包器处理），其余图片全部走 props。
- [ ] **P2 公共入口不完整**：`src/design/index.js` 不 import `tokens.css`，使用者必须另外知道要引入它；仓库也没有库构建（无 `dist`、无 `exports`）。补一个正式的库构建（vite lib mode）与 `package.json` 的 `exports`/`types`，把 `.design-sync/build-dist.mjs` 的临时方案收回到仓库构建里。
- [ ] **P3 单文件巨型模块**：`organisms.jsx` 4037 行 / `organisms.css` 5933 行，`molecules.jsx`、`pages.jsx` 同理。工具无法按组件定位模块（同步需要 `componentSrcMap` 手工映射 57 项）。按组件拆成 `organisms/<Name>.jsx` + `.css`，`index.js` 继续作为唯一公共入口。
- [ ] **P3 故事标题与导出名不一致**：标题用句式大小写（“Status badge”、“Six-city invest analysis”、“Principles library”、“Report Copilot workspace”），与导出 `StatusBadge`/`CityInvestDashboard`/`PrinciplesView`/`ReportCopilot` 对不上。统一为导出名。
- [ ] **P3 页面故事全部挤在一个 `Pages` 标题下**（7 个页面组件共用一个 CSF 文件），无法按页面组件单独查阅 props 文档。拆为 `Pages/HomePage` 等，每个页面组件一个故事文件。
- [ ] **P3 固定定位组件的故事在 Storybook 中不可见或被裁切**（Toast、AssistantLauncher 在 padded 布局下落在截图/画布外）。给这些故事设 `parameters.layout: "fullscreen"` 并提供足够高度的容器。

## 执行提示（交给下一个 agent）

```text
你在 /Users/wuhaocheng/Documents/repos/marketinghub 工作。先完整阅读 AGENTS.md（长期规范，冲突时以其为准）、handover/README.md（当前状态）、handover/design-system-cleanup.md（本任务清单）。

任务：按 handover/design-system-cleanup.md 的清单修复 src/design 的源码问题。一次只做一个清单条目，每个条目一个提交；按 P1 → P2 → P3 顺序。不得修改 index.html 与 assets/**（参照物）。

每个条目的做法：
1. 先复现：在 Storybook（npm run storybook 或 npm run build-storybook 后静态服务）中找到清单列出的证据；P1 字体问题用 node scripts/font-probe.mjs 产出前后对比。
2. 找根因，在根因处修：共享 reset/token/组件根样式优先于逐元素补丁。遵守 AGENTS.md §3（props 接口、mh- BEM 命名、颜色必须引用 token、可交互元素 :focus-visible、每个有布局的有机体至少一档 @media）。
3. 对照原始 Demo（assets/pages/*.html、index.html）确认修复后的视觉是原始实际生效的样子，而不是新设计。
4. 验证：npm test；npm run build-storybook 通过且 storybook-static/index.json 故事数不减少；对受影响故事与原始页面按 AGENTS.md §4 截图对照；token 清理条目需证明组件 CSS 中裸十六进制计数下降（最终为 0）且视觉无变化。
5. 在 handover/README.md 更新状态与维护日志，并在 design-system-cleanup.md 勾选该条目、写一行证据（提交号 + 截图/脚本输出路径）。

注意：
- Token 收敛与拆分巨型文件是大改动，先提出合并映射/拆分方案（列出旧 token → 新语义 token 的表、或文件拆分目录），完成一个小批次并验证后再推广。
- 修改导出接口（枚举类型、图片 props、公共入口）时同步更新故事 argTypes、JSDoc 与 src/design/index.js。
- 完成若干条目后，告诉用户可以运行 /design-sync 重新同步 claude.ai/design（.design-sync/ 里已记录配置与注意事项）；源码变化会让受影响组件重新截图评级，属于预期。
```
