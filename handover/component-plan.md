# 设计系统组件

组件接口是事实来源。原始 HTML 只用来对照布局、字体、颜色、间距和主要控件状态。

## 接口

- 原子控件接收内容 props，不接收原始 `class`、`attrs` 或 DOM 节点。
- 页头、Hero、侧栏、工具条、助手面板和表单同样只接收文案、列表和回调。
- `SiteHeader` 与工作区页头是同一个 `Header`。
- 样式写在组件自己的 CSS 里，从现有样式表提取实际用到的字体、颜色和间距。组件不依赖 `knowledge-v4` 这类页面父级 class，也不整包引入 `assets/css`。

## 故事

1. Atoms、Molecules、Organisms 各自有 Controls。
2. Pages 用这些组件拼出首页、Marketing Cockpit、Self-Service Center、AI Interpreter 和 RedNote Campaign Tool。
3. 页面渲染树里没有原始 HTML 字符串，也没有 assembled JSON 节点。
