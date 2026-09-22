# 组件接口摘要

完整规则见 `AGENTS.md` 第 3 节，状态与规划见 `handover/README.md`。本文件只保留摘要，不单独维护规划。

- 组件接口是事实来源。原始 HTML 只用来对照布局、字体、颜色、间距和主要控件状态。
- 组件只接收内容 props、状态 props、`children` 与回调；不接收原始 `class`、`attrs`、DOM 节点或 HTML 字符串。
- 枚举 props 导出常量并在 `argTypes` 引用。同一设计概念只有一个组件，形态用 `variant` / `tone` / `size` 区分。
- 导航渲染为 `<a href>`，动作渲染为 `<button type="button">`。组件内不写死 `id`。
- 样式随组件走，颜色与尺寸引用 `src/design/tokens.css`；不整包引入 `assets/css`，不依赖页面父级 class。
- 页面组件通过 props 接收全部数据；`content.js` 只作故事默认 args。
- Pages 故事渲染树只允许 `src/design` 内的组件；禁止 `PortalDocument`、原始 HTML 字符串、assembled JSON 节点。
