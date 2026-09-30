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
  parameters: { docs: { description: { component: bi("The item region of a governed library. Owns both layouts and the empty state; views never render the grid or DataTable directly.", "受治理库的条目区域。负责两种布局和空状态；视图不要直接渲染网格或 DataTable。") } } },
  args: { label: "Business terms", layout: "cards", items: records.map(toItem), columns, rows, empty },
  argTypes: {
    label: prop("string", { description: bi("Accessible name.", "无障碍名称。") }),
    layout: enumProp(libraryLayouts, "cards", bi("Card grid, one card per row, or table.", "卡片网格、每行一张卡片，或表格。"), "inline-radio"),
    items: prop("Array<LibraryItem props>", { description: bi("cards layout.", "cards 布局。") }),
    columns: prop("Array<{ key, header }>", { description: bi("table layout.", "table 布局。") }),
    rows: prop("Array<{ id, ...cells }>", { description: bi("table layout.", "table 布局。") }),
    empty: prop("LibraryEmpty props", { description: bi("Shown when there is nothing to list.", "没有内容可列出时显示。") }),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "gmv" }, bi("Open an item.", "打开某个条目。")),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "edit", id: "gmv", blocked: false, reason: null }, bi("Card actions.", "卡片操作。")),
    onClear: callbackProp("onClear", "(event: { kind }) => void", { kind: "no-results" }, bi("Clear filters from the no-results state.", "在无结果状态下清除筛选。")),
  },
};

export const Cards = {};
export const List = { name: "List (one per row)", args: { layout: "list", label: "Principles" } };
export const Table = { args: { layout: "table", label: "Analytical models" } };
export const NoResults = { args: { items: [] } };
export const TableNoResults = { name: "Table, no results", args: { layout: "table", rows: [] } };
export const NarrowCards = { name: "Narrow (390px), cards", parameters: { viewport: { defaultViewport: "mobile1" } }, render: (args) => <div style={{ maxWidth: 390 }}><LibraryList {...args} /></div> };
export const NarrowTable = { name: "Narrow (390px), table", args: { layout: "table" }, render: (args) => <div style={{ maxWidth: 390 }}><LibraryList {...args} /></div> };
