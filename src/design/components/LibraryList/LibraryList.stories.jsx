import { LibraryList, libraryLayouts } from "./index.jsx";
import { ItemActions } from "../ItemActions/index.jsx";
import { StatusBadge } from "../StatusBadge/index.jsx";
import { callbackProp, enumProp, prop, bi } from "../../lib/story-helpers.js";
import { records, toItem } from "../../demo/library-story-data.js";

const columns = [
  { key: "title", header: "Name" },
  { key: "domain", header: "Domain" },
  { key: "status", header: "Status" },
  { key: "actions", header: "Actions" },
];
const rows = records.map((record) => {
  const item = toItem(record);
  return {
    id: record.id,
    title: record.title,
    domain: record.domain,
    status: <StatusBadge status={item.status.status}>{item.status.label}</StatusBadge>,
    actions: <ItemActions id={record.id} name={record.title} actions={item.actions.actions} />,
  };
});
const empty = { kind: "no-results", title: "No matching terms", message: "Try another keyword or clear the filters." };

export default {
  title: "Organisms/Library/LibraryList",
  component: LibraryList,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("This component is the item region of a library list. It shows cards, a stacked list, or a table. It also shows the empty state. The view does not render the grid or the table itself.", "这个组件是库列表的条目区域。它可以显示卡片、纵向列表或表格。它也显示空状态。视图不要自己渲染网格或表格。") } } },
  args: { label: "Business terms", layout: "cards", items: records.map(toItem), columns, rows, empty },
  argTypes: {
    label: prop("string", { description: bi("Accessible name of the list.", "列表的无障碍名称。") }),
    layout: enumProp(libraryLayouts, "cards", bi("`cards` is a grid. `list` is one card per row. `table` is a table.", "`cards` 是网格。`list` 是每行一张卡片。`table` 是表格。"), "inline-radio"),
    items: prop("Array<LibraryItem props>", { description: bi("Cards for `cards` and `list`.", "`cards` 和 `list` 使用的卡片。") }),
    columns: prop("Array<{ key, header }>", { description: bi("Column definitions for `table`.", "`table` 的列定义。") }),
    rows: prop("Array<{ id, ...cells }>", { description: bi("Row objects for `table`.", "`table` 的行对象。") }),
    empty: prop("LibraryEmpty props", { description: bi("Content shown when there is nothing to list.", "没有内容可列出时显示的内容。") }),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "gmv" }, bi("The function runs when an item opens. The result has `id`.", "打开某个条目时调用这个函数。结果里带有 `id`。")),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "edit", id: "gmv", blocked: false, reason: null }, bi("The function runs when a card action is pressed. The result has `action`, `id`, `blocked`, and `reason`. Table rows supply their own action buttons.", "按下卡片操作时调用这个函数。结果里带有 `action`、`id`、`blocked` 和 `reason`。表格行使用自己的操作按钮。")),
    onClear: callbackProp("onClear", "(event: { kind }) => void", { kind: "no-results" }, bi("The function runs when Clear filters is pressed in the empty state. The result has `kind`.", "在空状态按下 Clear filters 时调用这个函数。结果里带有 `kind`。")),
  },
};

export const Cards = {};
export const List = { name: "List (one per row)", args: { layout: "list", label: "Principles" } };
export const Table = { args: { layout: "table", label: "Analytical models" } };
export const NoResults = { args: { items: [] } };
export const TableNoResults = { name: "Table, no results", args: { layout: "table", rows: [] } };
export const NarrowCards = { name: "Narrow (390px), cards", parameters: { viewport: { defaultViewport: "mobile1" } }, render: (args) => <div style={{ maxWidth: 390 }}><LibraryList {...args} /></div> };
export const NarrowTable = { name: "Narrow (390px), table", args: { layout: "table" }, render: (args) => <div style={{ maxWidth: 390 }}><LibraryList {...args} /></div> };
