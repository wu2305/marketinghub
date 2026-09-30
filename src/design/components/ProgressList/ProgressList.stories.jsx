import { ProgressList } from "./index.jsx";
import { prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Progress list",
  component: ProgressList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Label / value / bar rows for distribution summaries.", "用于分布汇总的 标签/数值/进度条 行。"),
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
      description: bi("Rows — `percent` is the bar width (0–100).", "行数据：`percent` 为进度条宽度（0–100）。"),
    }),
  },
  render: (args) => (
    <div style={{ width: 460 }}>
      <ProgressList {...args} />
    </div>
  ),
};

export const Default = {};
