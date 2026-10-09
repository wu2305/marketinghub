import { LibraryItem } from "./index.jsx";
import { callbackProp, prop, bi } from "../../lib/story-helpers.js";
import { records, toItem } from "../../demo/library-story-data.js";

export default {
  title: "Organisms/Library/LibraryItem",
  component: LibraryItem,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("This component is one card in a library list. The title is a button. A click on the title opens the item. A click on the card, outside other controls, also opens it. `children` is the slot for extra content.", "这个组件是库列表中的一张卡片。标题是一个按钮。点击标题会打开该条目。点击卡片上其他控件以外的位置，同样会打开。`children` 是额外内容的插槽。") } } },
  args: toItem(records[1]),
  argTypes: {
    title: prop("string", { description: bi("Item name. It is also the open button.", "条目名称。它也是打开按钮。") }),
    draft: prop("boolean", { defaultValue: false, description: bi("Set this if the Draft marker shows.", "如果要显示 Draft 标记，就设置这个值。") }),
    selected: prop("boolean", { defaultValue: false, description: bi("Set this if this item is the one the view currently shows. Data Model uses this for the current domain.", "如果这是视图当前展示的条目，就设置这个值。Data Model 用它表示当前域。") }),
    leading: prop("React.ReactNode", { description: bi("Short mark shown in a round badge at the left of the card, such as the initial of the title. Personal Memory uses it.", "显示在卡片左侧圆形徽标里的简短标记，例如标题的首字母。Personal Memory 使用它。") }),
    description: prop("string", { description: bi("Text under the title. The text is limited to two lines.", "标题下方的文字。最多显示两行。") }),
    meta: prop("Array<{ label, value }>", { description: bi("Label and value pairs under the description.", "描述下方的标签和值。") }),
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
export const WithLeadingBadge = { name: "With leading badge", args: { ...toItem(records[1]), leading: "A" } };
export const Selected = { args: { ...toItem(records[1]), actions: undefined, selected: true } };
export const ReadOnly = { name: "Without actions", args: { ...toItem(records[1]), actions: undefined } };
export const WithExtraContent = {
  name: "With view-specific content",
  args: { ...toItem(records[1]), children: <span style={{ fontSize: "var(--mh-font-size-sm)", color: "var(--mh-text-muted)" }}>Synonyms: basket size, ticket size</span> },
};
