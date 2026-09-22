# Marketing Hub Storybook 交接

静态 HTML Demo 仍在仓库根目录和 `assets/pages`，只作为视觉和交互参照。Storybook 不再加载这些文档，也不再把原始 DOM 当作组件 props。

组件在 `src/design`：

- Atoms：Button、Link、TextInput、TextArea、Select、StatusBadge
- Molecules：SearchField、MetricStat、SectionHeading、Tabs、FormField、DataTable、SidebarItem
- Organisms：Header、Hero、WorkspaceCard、ProjectCard、KnowledgeSidebar、TypeCard、KnowledgeLibrary、AssistantPanel、CampaignRail、BusinessTermForm
- Pages：首页、Marketing Cockpit、Self-Service Center、AI Interpreter、RedNote Campaign Tool

每个组件自带样式，能在 Storybook 里单独打开。按钮使用 `variant`、`size`、`disabled` 和 `children`。页头只有一个 `Header`，用 `tone` 区分首页叠在 Hero 上的透明导航和工作区的实底导航。交互通过 `onClick`、`onChange`、`onNavigate`、`onSubmit` 传出。

```bash
npm install
npm run preview:html   # 127.0.0.1:4173，原始 HTML 参照
npm run storybook      # 127.0.0.1:6006
```
