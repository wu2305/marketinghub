import { DataTable } from "./index.jsx";
import { callbackProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Data table",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Data table. `columns[].key` indexes into each row object; `columns[].header` is the displayed heading. Below 760px each row stacks as a labelled block.\n\n**When to use.** Tabular records with a few named columns. Pass `onOpen` when a row should open a detail view. For governed lists with search, filters and actions use LibraryList (its `table` layout is built on this). **Used in:** Campaign and LibraryList.", "数据表格。`columns[].key` 对应每个行对象中的键；`columns[].header` 是显示的列标题。宽度低于 760px 时每一行堆叠为带标签的块。\n\n**何时使用。** 有若干命名列的表格型记录。当某一行需要打开详情视图时传入 `onOpen`。带搜索、筛选和操作的受治理列表请用 LibraryList（其 `table` 布局即基于本组件）。**使用位置：** Campaign 与 LibraryList。"),
      },
    },
  },
  args: {
    caption: "3 accounts shown",
    columns: [
      { key: "name", header: "Account Name" },
      { key: "feed", header: "Feed" },
      { key: "total", header: "Total Plans" },
    ],
    rows: [
      { id: "1", name: "Coach_XHS_01", feed: "82", total: "99" },
      { id: "2", name: "Coach_XHS_02", feed: "61", total: "73" },
    ],
  },
  argTypes: {
    columns: prop("Array<{ key: string, header: React.ReactNode }>", { defaultValue: [], description: bi("Column definitions.", "列定义。") }),
    rows: prop("Array<{ id?: string|number, [key: string]: React.ReactNode }>", { defaultValue: [], description: bi("Row objects keyed by column key.", "以列 key 为键的行对象。") }),
    caption: prop("React.ReactNode", { description: bi("Note rendered under the table.", "显示在表格下方的备注。"), control: "text" }),
    emptyState: prop("React.ReactNode", { description: bi("Shown in place of the rows when `rows` is empty.", "`rows` 为空时代替行显示的内容。"), control: "text" }),
    onOpen: callbackProp("onOpen", "(event: { id: string|number }) => void", { id: "1" }, bi("Makes rows openable: the first cell becomes a button; a click elsewhere on the row (outside other controls) also opens it.", "让行可以被打开：第一个单元格变为按钮；点击行内其他位置（其他控件之外）同样会打开。")),
  },
  render: (args) => <DataTable {...args} />,
};

// Rows are openable only when a story opts in; the Actions panel supplies onOpen.
const withoutOpen = ({ onOpen: _onOpen, ...args }) => <DataTable {...args} />;

export const Default = { render: withoutOpen };

export const OpenableRows = {};

export const Empty = {
  args: { rows: [], caption: "0 accounts shown", emptyState: "No accounts match the current filters." },
  render: withoutOpen,
};
