import { ProgressList } from "./index.jsx";
import { prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Progress list",
  component: ProgressList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component shows rows of label, value, and bar. Use it for a short distribution summary.\n\n**When to use.** Use this component when each row is a label, a value, and a bar. Use ColumnChart when the comparison is across categories on a shared axis. **Used in:** Campaign.", "这个组件显示「标签、数值、进度条」行。用于简短的分布汇总。\n\n**何时使用。** 每一行是标签、数值和进度条时使用。若要在共同坐标轴上比较各分类，请用 ColumnChart。**使用位置：** Campaign。"),
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
      description: bi("Rows to show. `percent` is the bar width from 0 to 100.", "要显示的行。`percent` 是进度条宽度，从 0 到 100。"),
    }),
  },
  render: (args) => (
    <div style={{ width: 460 }}>
      <ProgressList {...args} />
    </div>
  ),
};

export const Default = {};
