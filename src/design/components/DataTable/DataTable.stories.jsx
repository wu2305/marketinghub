import { DataTable } from "./index.jsx";
import { callbackProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Data table",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is a data table. `columns[].key` selects the field in each row. `columns[].header` is the column heading. Below 760px, each row stacks as a labelled block.\n\n**When to use.** Use this component for records with a few named columns. Set `onOpen` if a row should open a detail view. For a governed library, combine LibraryToolbar for search and filters with LibraryList for the items. The host filters the data and supplies item actions. The `table` layout of LibraryList uses this component. **Used in:** Campaign. **Retired pages (source kept, not in Storybook):** Skill Library, Review Center, and Feedback & Quality.", "这个组件是数据表格。`columns[].key` 对应每行对象里的字段。`columns[].header` 是列标题。宽度低于 760px 时，每一行堆叠成带标签的块。\n\n**何时使用。** 用于有若干命名列的表格记录。某一行需要打开详情时，设置 `onOpen`。受治理的知识库用 LibraryToolbar 提供搜索和筛选，用 LibraryList 显示条目。宿主负责筛选数据并提供条目操作。LibraryList 的 `table` 布局就基于这个组件。**使用位置：** Campaign。**已撤下的页面（源码保留，不在 Storybook 中）：**Skill Library、Review Center 与 Feedback & Quality。"),
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
    columns: prop("Array<{ key: string, header: React.ReactNode }>", { defaultValue: [], description: bi("Column list. Each column has `key` and `header`.", "列列表。每列有 `key` 和 `header`。") }),
    rows: prop("Array<{ id?: string|number, [key: string]: React.ReactNode }>", { defaultValue: [], description: bi("Row objects. Each field matches a column `key`. Add a stable `id` to every row if you set `onOpen`.", "行对象。每个字段对应一个列 `key`。设置 `onOpen` 时，请给每一行加一个稳定的 `id`。") }),
    caption: prop("React.ReactNode", { description: bi("Note under the table.", "表格下方的备注。"), control: "text" }),
    emptyState: prop("React.ReactNode", { description: bi("Content shown in place of the rows when `rows` is empty.", "`rows` 为空时代替行显示的内容。"), control: "text" }),
    onOpen: callbackProp("onOpen", "(event: { id: string|number }) => void", { id: "1" }, bi("Set this if a row should open. The first cell becomes a button. A click elsewhere on the row, outside other controls, also opens it. The result has `id` from the row. Give each row a stable `id` when you use `onOpen`: without one the result has `id: undefined` (the row position is only React's key).", "某一行需要打开时设置。第一个单元格会变成按钮。点击行内其他位置（其他控件之外）同样会打开。结果里带有该行的 `id`。用 `onOpen` 时请给每一行一个稳定的 `id`：没有 `id` 时结果里的 `id` 是 `undefined`（行位置只用作 React 的 key）。")),
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
