# Marketing Hub Storybook 交接

## 交付内容

静态 HTML Demo 仍在仓库根目录。Storybook 的页面故事在 `src/pages`，清单是 `src/pages/documents.js`。每一条都加载对应 HTML 的完整文档，包含该页自己的样式、图片、字体和脚本，不另写一套精简界面。

覆盖范围：

- Home
- Marketing Cockpit：全部报告目录，以及 City Strategy、4P、Customer、ABO、Rednote、OTT/OLV 的每一个 dashboard
- Self-Service Center：灵活分析、上传页签、独立上传页、Media Tracking Detail
- AI Interpreter：总览、8 类知识、保存/发布回跳，以及数据文件中的每条知识记录（列表选中与 detail）
- Knowledge Create：创建页默认态、全部知识类型、以及可编辑记录的 edit 状态
- Knowledge View：每条知识记录
- Data Model、Metric Dictionary、RedNote Campaign Tool
- Governance：Scenario Library、每条场景的详情和编辑、Review Center、Feedback & Quality、Personal Memory

`src/styles/portal.css` 引入 `assets/css` 下的全部样式表。

## 环境

```bash
npm install
npm run preview:html   # 127.0.0.1:4173，直接打开现有 HTML
npm run storybook      # 127.0.0.1:6006
```

Storybook 开发服务器把仓库挂到 `/original`。页面故事的工具条 **Compare → Beside original HTML** 会并排显示同一份原始文档。**Reference / Original HTML** 可以在一个目录里切换全部 234 个入口。

## v22 规则

规则仍由原始脚本执行，不在 Storybook 里改写：

- Business Term：Cancel 不保存；Save 为 Disable + Draft；Submit 为 Enable + Published。Title、Term Type、Description 为空时阻止保存和提交。
- Analytical Model：Save 强制 Disable + Draft；Submit 为 Published。必填项为 Analysis Name、Trigger When、Structure & Guidance。
- Business Terms、Analytical Models、Scenario Reports 概览的 `!` 提示来自 `assets/js/knowledge/types.js` 和 `assets/css/knowledge/ai-interpreter-overview.css`。
