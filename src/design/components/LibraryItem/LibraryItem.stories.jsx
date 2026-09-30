import { LibraryItem } from "./index.jsx";
import { callbackProp, prop, bi } from "../../lib/story-helpers.js";
import { records, toItem } from "../../demo/library-story-data.js";

export default {
  title: "Organisms/Library/LibraryItem",
  component: LibraryItem,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("One card in a governed library. The title is the card's button; a click anywhere outside other controls also opens it. `children` is the single slot for view-specific content.", "受治理库中的一张卡片。标题即卡片的按钮；点击其他控件之外的任意位置同样会打开它。`children` 是承载各视图专属内容的唯一插槽。") } } },
  args: toItem(records[1]),
  argTypes: {
    title: prop("string", { description: bi("Item name; also the open button.", "条目名称，同时也是打开按钮。") }),
    draft: prop("boolean", { defaultValue: false, description: bi("Shows the Draft marker.", "显示 Draft 标记。") }),
    selected: prop("boolean", { defaultValue: false, description: bi("The item the surrounding view currently shows (e.g. the Data Model domain in the browser).", "所在视图当前展示的条目（例如浏览器中的 Data Model 域）。") }),
    description: prop("string", { description: bi("Clamped to two lines.", "最多显示两行，超出截断。") }),
    meta: prop("Array<{ label, value }>", { description: bi("Label/value pairs under the description.", "描述下方的标签/值对。") }),
    status: prop("{ status, tone?, label? }", { description: bi("StatusBadge content.", "StatusBadge 的内容。") }),
    actions: prop("ItemActions props", { description: bi("Omit to hide actions (views without `manage`).", "不传则隐藏操作（没有 `manage` 的视图）。") }),
    children: prop("React.ReactNode", { description: bi("View-specific content the pattern keeps.", "该模式保留的视图专属内容。") }),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "aov" }, bi("Title button or card click.", "点击标题按钮或卡片时触发。")),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "disable", id: "aov", blocked: false, reason: null }, bi("From ItemActions.", "来自 ItemActions。")),
  },
  render: (args) => <div style={{ maxWidth: 420 }}><LibraryItem {...args} /></div>,
};

export const Enabled = {};
export const Disabled = { args: toItem(records[0]) };
export const Draft = { args: toItem(records[2]) };
export const OtherCreator = { name: "Created by others", args: toItem(records[3]) };
export const Selected = { args: { ...toItem(records[1]), actions: undefined, selected: true } };
export const ReadOnly = { name: "Without actions", args: { ...toItem(records[1]), actions: undefined } };
export const WithExtraContent = {
  name: "With view-specific content",
  args: { ...toItem(records[1]), children: <span style={{ fontSize: "var(--mh-font-size-sm)", color: "var(--mh-text-muted)" }}>Synonyms: basket size, ticket size</span> },
};
