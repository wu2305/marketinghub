import { DataTable } from "./index.jsx";
import { callbackProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Data table",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Data table. `columns[].key` indexes into each row object; `columns[].header` is the displayed heading. Below 760px each row stacks as a labelled block.",
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
    columns: prop("Array<{ key: string, header: React.ReactNode }>", { defaultValue: [], description: "Column definitions." }),
    rows: prop("Array<{ id?: string|number, [key: string]: React.ReactNode }>", { defaultValue: [], description: "Row objects keyed by column key." }),
    caption: prop("React.ReactNode", { description: "Note rendered under the table.", control: "text" }),
    emptyState: prop("React.ReactNode", { description: "Shown in place of the rows when `rows` is empty.", control: "text" }),
    onOpen: callbackProp("onOpen", "(event: { id: string|number }) => void", { id: "1" }, "Makes rows openable: the first cell becomes a button; a click elsewhere on the row (outside other controls) also opens it."),
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
