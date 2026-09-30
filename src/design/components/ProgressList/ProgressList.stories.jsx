import { ProgressList } from "./index.jsx";
import { prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Progress list",
  component: ProgressList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Label / value / bar rows for distribution summaries.\n\n**When to use.** A short distribution summary where each row is a label, a value and a proportional bar. Use ColumnChart instead when the comparison is across categories over a shared axis. **Used in:** Campaign (distribution, objectives and efficiency panels).", "用于分布汇总的 标签/数值/进度条 行。\n\n**何时使用。** 简短的分布汇总，每一行包含标签、数值和按比例的进度条。若要在共同坐标轴上比较各分类，请改用 ColumnChart。**使用位置：** Campaign（分布、目标与效率面板）。"),
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
