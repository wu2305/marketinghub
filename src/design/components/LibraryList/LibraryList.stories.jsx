import { LibraryList, libraryLayouts } from "./index.jsx";
import { ItemActions } from "../ItemActions/index.jsx";
import { StatusBadge } from "../StatusBadge/index.jsx";
import { callbackProp, enumProp, prop } from "../../lib/story-helpers.js";
import { records, toItem } from "../../lib/library-story-data.js";

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
  parameters: { docs: { description: { component: "The item region of a governed library. Owns both layouts and the empty state; views never render the grid or DataTable directly." } } },
  args: { label: "Business terms", layout: "cards", items: records.map(toItem), columns, rows, empty },
  argTypes: {
    label: prop("string", { description: "Accessible name." }),
    layout: enumProp(libraryLayouts, "cards", "Card grid or table.", "inline-radio"),
    items: prop("Array<LibraryItem props>", { description: "cards layout." }),
    columns: prop("Array<{ key, header }>", { description: "table layout." }),
    rows: prop("Array<{ id, ...cells }>", { description: "table layout." }),
    empty: prop("LibraryEmpty props", { description: "Shown when there is nothing to list." }),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "gmv" }, "Open an item."),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "edit", id: "gmv", blocked: false, reason: null }, "Card actions."),
    onClear: callbackProp("onClear", "(event: { kind }) => void", { kind: "no-results" }, "Clear filters from the no-results state."),
  },
};

export const Cards = {};
export const Table = { args: { layout: "table", label: "Analytical models" } };
export const NoResults = { args: { items: [] } };
export const TableNoResults = { name: "Table, no results", args: { layout: "table", rows: [] } };
export const NarrowCards = { name: "Narrow (390px), cards", parameters: { viewport: { defaultViewport: "mobile1" } }, render: (args) => <div style={{ maxWidth: 390 }}><LibraryList {...args} /></div> };
export const NarrowTable = { name: "Narrow (390px), table", args: { layout: "table" }, render: (args) => <div style={{ maxWidth: 390 }}><LibraryList {...args} /></div> };
