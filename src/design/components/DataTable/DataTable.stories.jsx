import { DataTable } from "./index.jsx";
import { callbackProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Data table",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Simple data table. `columns[].key` indexes into each row object; `columns[].header` is the displayed heading.",
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
    onRowClick: callbackProp(
      "onRowClick",
      "(row: object) => void",
      { id: "1", name: "Coach_XHS_01", feed: "82", total: "99" },
      "When set, rows are clickable and the clicked row object is emitted.",
    ),
  },
  render: (args) => <DataTable {...args} />,
};

export const Default = {};
