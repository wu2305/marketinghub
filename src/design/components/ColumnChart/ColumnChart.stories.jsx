import { ColumnChart } from "./index.jsx";
import { prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Column chart",
  component: ColumnChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is a column chart. It uses CSS only. Each column has `height` as a percentage from 0 to 100.\n\n**When to use.** Use this component for a small bar comparison. Give each value as a percentage from 0 to 100. Use ProgressList for a list of label, value, and bar. **Used in:** Campaign.", "这个组件是柱状图。它只用 CSS。每根柱的 `height` 是 0 到 100 的百分比。\n\n**何时使用。** 用于小型柱状对比。每个数值用 0 到 100 的百分比给出。若需要「标签、数值、进度条」列表，请用 ProgressList。**使用位置：** Campaign。"),
      },
    },
  },
  args: {
    label: "Marketing objective distribution",
    items: [
      { label: "Product seeding", value: "329", height: 88 },
      { label: "Direct seeding", value: "9", height: 11 },
      { label: "Lead capture", value: "3", height: 7 },
    ],
  },
  argTypes: {
    label: prop("string", { defaultValue: "Chart", description: bi("Accessible name of the chart.", "图表的无障碍名称。") }),
    items: prop("Array<{ label: string, value: React.ReactNode, height: number }>", {
      defaultValue: [],
      description: bi("Columns to show. `height` is a percentage from 0 to 100.", "要显示的各柱。`height` 是 0 到 100 的百分比。"),
    }),
  },
  render: (args) => <ColumnChart {...args} />,
};

export const Default = {};
