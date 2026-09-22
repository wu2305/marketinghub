# 组件消融

对照对象是 17 个 HTML 文档的拼装结果。完整拼装为基线，基线与原始正文一致。

两组实验分开读：

- 替换消融：一次关掉一个识别器，该区域退回原始标记。父组件如果必须调用这个识别器，也一并退回原文。结果应仍与原文一致，用来确认组件没有改写结构。
- 去除消融：从拼装树里删掉该组件再渲染。损失的元素和词包含它内部的子组件，各行不能相加。

词按空白切分，并先按对照规则合并空白。元素数按同一规则规范化之后计数。

第一次替换消融里，关掉 TextArea 识别器后，通用节点把子节点放进 `<textarea>`。React 会把这个元素子节点打印成 `[object Object]`，8 个文档因此和原文不一致。`Node` 已改为与 TextArea 组件相同，把文本放进 `defaultValue`。下表是修正后的重跑。

## 替换消融

| 组件 | 处理 | 不一致页数 | 结果 |
| --- | --- | --- | --- |
| WorkspaceHeader | 回退原文 | 0 | 17 个文档仍与原文一致 |
| SiteHeader | 回退原文 | 0 | 17 个文档仍与原文一致 |
| CommandHero | 回退原文 | 0 | 17 个文档仍与原文一致 |
| WorkspaceGrid | 回退原文 | 0 | 17 个文档仍与原文一致 |
| WorkspaceCard | 回退原文 | 0 | 17 个文档仍与原文一致 |
| SectionHeading | 回退原文 | 0 | 17 个文档仍与原文一致 |
| AssistantPanel | 回退原文 | 0 | 17 个文档仍与原文一致 |
| LibraryToolbar | 回退原文 | 0 | 17 个文档仍与原文一致 |
| KnowledgeSidebar | 回退原文 | 0 | 17 个文档仍与原文一致 |
| PageHead | 回退原文 | 0 | 17 个文档仍与原文一致 |
| AiLauncher | 回退原文 | 0 | 17 个文档仍与原文一致 |
| Signal | 回退原文 | 0 | 17 个文档仍与原文一致 |
| HeroStat | 回退原文 | 0 | 17 个文档仍与原文一致 |
| SearchField | 回退原文 | 0 | 17 个文档仍与原文一致 |
| SidebarItem | 回退原文 | 0 | 17 个文档仍与原文一致 |
| Breadcrumb | 回退原文 | 0 | 17 个文档仍与原文一致 |
| StatusBadge | 回退原文 | 0 | 17 个文档仍与原文一致 |
| AddButton | 回退原文 | 0 | 17 个文档仍与原文一致 |
| Suggestion | 回退原文 | 0 | 17 个文档仍与原文一致 |
| ScopeOption | 回退原文 | 0 | 17 个文档仍与原文一致 |
| Button | 回退原文 | 0 | 17 个文档仍与原文一致 |
| Link | 回退原文 | 0 | 17 个文档仍与原文一致 |
| TextInput | 回退原文 | 0 | 17 个文档仍与原文一致 |
| TextArea | 回退原文 | 0 | 17 个文档仍与原文一致 |
| Select | 回退原文 | 0 | 17 个文档仍与原文一致 |

## 去除消融

| 组件 | 节点数 | 影响页数 | 减少元素 | 减少词 | 丢失词示例 |
| --- | --- | --- | --- | --- | --- |
| WorkspaceHeader | 1 | 1 | 9 | 10 | Home Marketing Cockpit Self-Service Center AI Interpreter RedNote |
| SiteHeader | 16 | 16 | 158 | 155 | Home Marketing Cockpit Self-Service Center AI Interpreter RedNote |
| CommandHero | 7 | 7 | 179 | 249 | Marketing Portal Your daily workspace for for campaign |
| WorkspaceGrid | 1 | 1 | 73 | 75 | Marketing Cockpit Self-Service Center AI AI Interpreter RedNote |
| WorkspaceCard | 0 | 0 | 0 | 0 | 只存在于父组件属性中，见属性槽消融 |
| SectionHeading | 1 | 1 | 5 | 16 | knowledge WORKSPACES Enter the the work that matters |
| AssistantPanel | 6 | 6 | 417 | 167 | AI AI AI Interpreter Your for across the |
| LibraryToolbar | 3 | 3 | 115 | 90 | Feedback feedback records month All All Thumbs Thumbs |
| KnowledgeSidebar | 7 | 7 | 217 | 83 | Center Feedback & Quality Knowledge Management Review Skill |
| PageHead | 1 | 1 | 12 | 22 | AI Interpreter / / Knowledge Knowledge Knowledge Management |
| AiLauncher | 13 | 13 | 39 | 39 | AI AI Interpreter AI AI Interpreter AI AI |
| Signal | 0 | 0 | 0 | 0 | 只存在于父组件属性中，见属性槽消融 |
| HeroStat | 0 | 0 | 0 | 0 | 只存在于父组件属性中，见属性槽消融 |
| SearchField | 5 | 5 | 26 | 9 | feedback Search knowledge Search Search review items scenarios |
| SidebarItem | 35 | 7 | 199 | 77 | Center Feedback & Quality Knowledge Management Review Skill |
| Breadcrumb | 1 | 1 | 6 | 8 | AI Interpreter / / Knowledge Knowledge Management Details |
| StatusBadge | 0 | 0 | 0 | 0 | 只存在于父组件属性中，见属性槽消融 |
| AddButton | 1 | 1 | 4 | 3 | Knowledge New Create |
| Suggestion | 3 | 1 | 3 | 16 | across the task What's ROI trend my active |
| ScopeOption | 21 | 6 | 21 | 21 | Knowledge Campaigns All Dashboards Campaigns Dashboards Knowledge Knowledge |
| Button | 260 | 16 | 654 | 483 | AI for for for for for campaign and |
| Link | 40 | 9 | 111 | 131 | Back Download template upload data data data Open |
| TextInput | 70 | 8 | 70 | 0 | — |
| TextArea | 22 | 8 | 22 | 66 | conversion Share of identified member visits that result |
| Select | 41 | 10 | 183 | 277 | Rednote Douyin Coach_XHS_01 Coach_XHS_02 plan budget plans Bulk |

## 分层去除

每一层只删除该层自己的组件节点。被父组件收进属性的分子不在这一层的节点数里，见下一节。

| 层 | 实际删除 | 影响页数 | 减少元素 | 减少词 |
| --- | --- | --- | --- | --- |
| Atoms | Button、Link、TextInput、TextArea、Select、Suggestion、ScopeOption | 16 | 1064 | 994 |
| Molecules | SearchField、SidebarItem、Breadcrumb、SectionHeading、AddButton | 10 | 240 | 113 |
| Organisms | SiteHeader、WorkspaceHeader、CommandHero、WorkspaceGrid、KnowledgeSidebar、LibraryToolbar、PageHead、AiLauncher、AssistantPanel | 17 | 1219 | 890 |

## 属性槽消融

Signal、Hero Stat、Workspace Card、以及页头里的徽标和面包屑，在识别时被写进父组件属性，树里没有独立节点。这里只清空对应属性。

| 组件 | 父组件 | 属性 | 影响页数 | 减少词 | 丢失词示例 |
| --- | --- | --- | --- | --- | --- |
| Signal | CommandHero | signals | 6 | 128 | for knowledge in REPORT CENTER CENTER 12 governed |
| HeroStat | CommandHero | stats | 1 | 16 | AI Published Knowledge 2,368 governed assets assets ready |
| WorkspaceCard | WorkspaceGrid | cards | 1 | 75 | Marketing Cockpit Self-Service Center AI AI Interpreter RedNote |
| StatusBadge | PageHead | status | 1 | 1 | Draft |
| Breadcrumb | PageHead | breadcrumb | 1 | 9 | AI Interpreter / / Knowledge Knowledge Management Create |

重跑：`python3 scripts/ablation.py`。
