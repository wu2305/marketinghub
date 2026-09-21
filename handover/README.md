# Marketing Hub Storybook 交接

## 交付内容

静态 HTML Demo 仍保留在仓库根目录。React Storybook 放在 `src/`，复用 `assets/css` 与 `assets/images`，不另建一套视觉令牌或组件皮肤。

| Storybook | 对应 HTML |
| --- | --- |
| Foundations / Tokens | `assets/css/base/foundation.css`、`theme.css` |
| Components / Site Header | 各页 `.site-header` |
| Pages / Home | `index.html` |
| Components / AI Interpreter Assistant | 首页助手面板与启动按钮 |
| Pages / AI Interpreter | `assets/pages/knowledge.html` |
| Pages / Business Term Form | `knowledge-create.html?type=Business Term` |
| Pages / Analytical Model Form | `knowledge-create.html?type=Analytical Model` |
| Reference / Original HTML | 首页、Cockpit、Self-Service、AI Interpreter、Campaign 及两张知识表单 |

Marketing Cockpit、Self-Service Center、RedNote Campaign Tool 以及治理类页面保持原 HTML。在 Reference 目录或 Compare 工具条中对照，不在 Storybook 里再复制一套页面。

## 环境

```bash
npm install
npm run preview:html   # 127.0.0.1:4173，直接打开现有 HTML
npm run storybook      # 127.0.0.1:6006
```

Storybook 开发服务器把仓库挂到 `/original`，把 `assets/` 挂到 `/assets`。页面故事的工具条 **Compare → Beside original HTML** 会并排显示 Storybook 与原始页面。

## v22 规则在组件中的落点

来源是 `AI Interpreter Demo 变更说明 v22.docx` 与当前页面脚本。

- Business Term：Cancel 不保存并回到列表；Save 写入 Disable + Draft；Submit 写入 Enable + Published。Title、Term Type、Description 为空时，Save 和 Submit 都显示浅红底、红框和 “This field is required.”，输入后错误消失。编辑页没有 Enable / Disable 开关。Global Synonym 不显示 Data Model。
- Analytical Model：Cancel 不保存；Save 强制 Disable + Draft；Submit 为 Published，且因为当前表单没有状态开关，状态按脚本缺省为 Enable。必填项为 Analysis Name、Trigger When、Structure & Guidance，并聚焦第一个空字段。
- 概览：Business Terms、Analytical Models、Scenario Reports 的指标区显示 `!`。悬停或键盘聚焦时，提示从上方展开，样式沿用 `ai-interpreter-overview.css` 的透明描边与毛玻璃。

提示文案与当前 `assets/js/knowledge/types.js` 一致，共四条。变更说明中的第五条 “Save keeps knowledge disabled; Submit publishes it for AI use.” 写在两张表单的 Operation reminder 里，没有放进概览提示框。

## 数据

列表、搜索和状态筛选使用 `src/data/catalog.js` 中的示例记录，记录来自现有 demo 数据。Hero 数字随当前示例列表变化，便于和表格对照。原始页面上的完整统计仍以 HTML 为准。
