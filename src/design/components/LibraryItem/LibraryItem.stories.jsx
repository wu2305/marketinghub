import { LibraryItem, libraryItemVariants } from "./index.jsx";
import { callbackProp, enumProp, prop, bi } from "../../lib/story-helpers.js";
import { records, toItem } from "../../demo/library-story-data.js";

export default {
  title: "Organisms/Library/LibraryItem",
  component: LibraryItem,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi(
    `This component is one card in a library list. The title or card opens the item; other controls perform their own actions. \`children\` is the slot for extra content.

See [Knowledge card comparison](?path=/docs/features-interpreter-knowledge-card-comparison--docs) for the six business compositions, reference parameters and current implementation gaps.

### Appearance parameters

Styles: \`src/design/components/LibraryItem/LibraryItem.css\`. Shared values: \`src/design/tokens.css\`. Foundations shows the shared scales; Controls edits content and state.

| Parameter | Token | Value |
| --- | --- | --- |
| Padding | space-5 | 16px |
| Content gap | space-4 | 12px |
| Radius | radius-surface | 12px |
| Border | line | 1px solid #dce1e6 |
| Shadow | shadow-raised | 0 2px 8px rgba(31,41,55,.06) |
| Title | font-size-xl / font-weight-bold | 16px / 700 |
| Description and metadata | font-size-sm | 12px |
| Typeface | font-sans | DIN 2014 |`,
    "这个组件是库列表中的一张卡片。点击标题或卡片会打开条目，其他控件执行各自的操作。`children` 是额外内容的插槽。\n\n### 外观参数在哪里看\n\n上表列出当前外观参数。卡片样式在 `src/design/components/LibraryItem/LibraryItem.css`，具体数值在 `src/design/tokens.css`；Foundations 页面可查看统一设计参数。Controls 用于修改内容和状态。"
  ) } } },
  args: { ...toItem(records[1]), variant: "knowledge" },
  argTypes: {
    variant: enumProp(libraryItemVariants, "default", bi("Knowledge layout fixes the heading and description height; metadata follows caller order and secondary pairs two fields. Actions share the last metadata row.", "Knowledge 布局固定标题和描述高度；字段按传入顺序排列，secondary 将两字段配为同行两列。操作与最后一行元信息同排。")),
    title: prop("string", { description: bi("Item name. It is also the open button.", "条目名称。它也是打开按钮。") }),
    draft: prop("boolean", { defaultValue: false, description: bi("Set this if the Draft marker shows.", "如果要显示 Draft 标记，就设置这个值。") }),
    selected: prop("boolean", { defaultValue: false, description: bi("Set this if this item is the one the view currently shows. Data Model uses this for the current domain.", "如果这是视图当前展示的条目，就设置这个值。Data Model 用它表示当前域。") }),
    leading: prop("React.ReactNode", { description: bi("Short mark shown in a round badge at the left of the card, such as the initial of the title. Personal Memory uses it. Use it with the `default` variant: the `knowledge` variant stacks the card in a column and has no room for a left badge.", "显示在卡片左侧圆形徽标里的简短标记，例如标题的首字母。Personal Memory 使用它。请与 `default` 变体一起使用：`knowledge` 变体把卡片竖向排列，没有放置左侧徽标的位置。") }),
    description: prop("string", { description: bi("Text under the title. The text is limited to two lines.", "标题下方的文字。最多显示两行。") }),
    meta: prop("Array<{ label, value, secondary? }>", { description: bi("Ordered label/value rows; secondary places another field in the same row.", "描述下方有序排列的标签和值；secondary 将另一字段放在同一行。") }),
    status: prop("{ status, tone?, label? }", { description: bi("Content for the status label.", "状态标签的内容。") }),
    actions: prop("ItemActions props", { description: bi("Props for the action buttons. If you do not set `actions`, the buttons do not show.", "操作按钮的 props。如果不设置 `actions`，按钮不显示。") }),
    children: prop("React.ReactNode", { description: bi("Extra content for this view.", "本视图的额外内容。") }),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "aov" }, bi("The function runs when the title or the card is clicked. The result has `id`.", "点击标题或卡片时调用这个函数。结果里带有 `id`。")),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "disable", id: "aov", blocked: false, reason: null }, bi("The function runs when an action button is pressed. The result has `action`, `id`, `blocked`, and `reason`.", "按下操作按钮时调用这个函数。结果里带有 `action`、`id`、`blocked` 和 `reason`。")),
  },
  render: (args) => <div style={{ maxWidth: 420 }}><LibraryItem {...args} /></div>,
};

export const Enabled = {};
export const Disabled = { args: toItem(records[0]) };
export const Draft = { args: toItem(records[2]) };
export const OtherCreator = { name: "Created by others", args: toItem(records[3]) };
// The badge belongs to list rows (Personal Memory) in the default variant; the knowledge variant stacks the card in a column.
export const WithLeadingBadge = { name: "With leading badge", args: { ...toItem(records[1]), variant: "default", leading: "A" } };
export const Selected = { args: { ...toItem(records[1]), actions: undefined, selected: true } };
export const ReadOnly = { name: "Without actions", args: { ...toItem(records[1]), actions: undefined } };
export const WithExtraContent = {
  name: "With view-specific content",
  args: { ...toItem(records[1]), children: <span style={{ fontSize: "var(--mh-font-size-sm)", color: "var(--mh-text-muted)" }}>Synonyms: basket size, ticket size</span> },
};

export const NarrowKnowledge = {
  name: "Knowledge: long content (390px)",
  args: {
    variant: "knowledge",
    title: "A very long knowledge title that must remain on one line next to its availability badge",
    description: "A long description fills the two-line area and is truncated after the second line without moving the metadata rows down or increasing the card height.",
    meta: [
      { label: "Data Model", value: "City Strategy, Customer, Campaign Attribution, Regional Growth" },
      { label: "Synonyms", value: "Long first synonym, long second synonym, long third synonym" },
      { label: "Unit", value: "CNY per qualified transaction", secondary: { label: "Type", value: "Calculated metric" } },
      { label: "Creator", value: "A creator with an unusually long display name" },
    ],
  },
  render: args => <div style={{ width: "100%", maxWidth: 390 }}><LibraryItem {...args} /></div>,
  parameters: { docs: { description: { story: bi("Single-line truncation, two-line description, paired fields and creator actions in a 390px container.", "390px 容器内验证单行省略、两行描述、同行两列字段和创建者操作。") } } },
};
