import { ProgressList } from "../../molecules.jsx";
import { prop } from "../story-helpers.js";

export default {
  title: "Molecules/Progress list",
  component: ProgressList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Label / value / bar rows for distribution summaries.",
      },
    },
  },
  args: {
    items: [
      { label: "Feed promotion", value: "282", percent: 86 },
      { label: "Search promotion", value: "43", percent: 24 },
      { label: "Full-site promotion", value: "16", percent: 10 },
    ],
  },
  argTypes: {
    items: prop("Array<{ label: string, value: React.ReactNode, percent: number }>", {
      defaultValue: [],
      description: "Rows — `percent` is the bar width (0–100).",
    }),
  },
  render: (args) => (
    <div style={{ width: 460 }}>
      <ProgressList {...args} />
    </div>
  ),
};

export const Default = {};
