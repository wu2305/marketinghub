# Marketing Hub Storybook 交接与状态

规则与长期规划见仓库根目录 `AGENTS.md`。本文件只记录状态，按 `AGENTS.md` 第 7 节的固定结构维护。

## 1. 当前状态

| 项 | 值 |
|---|---|
| 设计系统位置 | `src/design` |
| Storybook | 8.6.x，`@storybook/react-vite` |
| 故事数 | 38（Foundations 1、Atoms 6、Molecules 14、Organisms 12、Pages 5） |
| `npm run build-storybook` | 通过（2026-09-22，`main@9a09410`） |
| 最近视觉对照 | 2026-09-22，1440px，五个页面故事首屏 + Interpreter `activeType=terms` + Home `assistantOpen=true` |
| 原始 Demo 参照 | `index.html`、`assets/pages/*.html`，`npm run preview:html` 于 127.0.0.1:4173 |

启动：

```bash
npm install
npm run preview:html   # 127.0.0.1:4173，原始 HTML 参照
npm run storybook      # 127.0.0.1:6006
```

## 2. 阶段进度表

| 阶段 | 条目 | 状态 | PR |
|---|---|---|---|
| A | Home 助手面板改为居中弹窗（原始首页形态） | 未开始 | — |
| A | Cockpit `ProjectCard` 按钮补 `→`，搜索图标对齐原始 | 未开始 | — |
| A | Interpreter 侧栏补图标与 KNOWLEDGE · 8 TYPES 分组条 | 未开始 | — |
| A | Interpreter 可管理类型动作文案改为 Manage；类型计数对齐 `typeMeta` | 未开始 | — |
| A | Campaign 四个 section 数据改为 props，`content.js` 提供默认值 | 未开始 | — |
| A | `Header` 导航改为 `<a>`；`Hero` 去掉写死 `id` | 未开始 | — |
| B | 全部故事启用 `autodocs`，补 props 类型声明 | 未开始 | — |
| B | `src/design/index.js` 公共导出入口 | 未开始 | — |
| B | 组件 CSS 色值全部 token 化（当前 171 处直接色值） | 未开始 | — |
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

以下差异在 2026-09-22 审核中发现，属于缺陷而非有意差异，已列入阶段 A：Home 助手面板形态、Cockpit 按钮箭头与搜索图标、Interpreter 侧栏图标与分组条、Manage / View 文案、类型计数。

## 4. 已知缺口

来自 2026-09-22 审核，尚未排期或超出阶段 A–D 范围：

- Interpreter 非 overview 状态与原始差异大：原始为卡片网格与逐卡动作，当前为单行通用表且 Actions 列为空。阶段 C 处理。
- `StatusBadge` 的 tone 由字符串包含判断决定，需改为显式 `tone` prop 或映射表。
- `content.js` 中 `href` 为 `/home`、`/cockpit` 等 Demo 中不存在的路由，需在决定路由方案后统一。
- 页面故事内联 `style` 用作占位与间距（如 `<div style={{ height: 56 }} />`），需改为组件 CSS。
- 无测试、无 lint。阶段 B 落地视觉对照脚本后再评估单元测试范围。
- 分支 `cursor/storybook-design-e61c`（#1）与 `cursor/component-ablation-e61c`（#5）建在已删除的 `src/assembled` 与 `scripts/compose_portal.py` 上，与 `main` 互斥，应关闭。

## 5. 维护日志

| 日期 | 变更 | 执行者 |
|---|---|---|
| 2026-09-22 | PR #6 合入：语义组件设计系统替换 DOM 复刻方案 | Cloud Agent |
| 2026-09-22 | 深度审核：实跑构建与 1440px 对照，确认 2.4 节缺口；建立 `AGENTS.md` 与本状态文件 | Cloud Agent |
