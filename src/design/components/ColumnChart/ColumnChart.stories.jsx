import { ColumnChart } from "./index.jsx";
import { prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Column chart",
  component: ColumnChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("CSS-only column chart; `height` is a 0–100 percentage.", "纯 CSS 柱状图；`height` 为 0–100 的百分比。"),
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
    label: prop("string", { defaultValue: "Chart", description: bi("aria-label on the chart.", "图表的 aria-label。") }),
    items: prop("Array<{ label: string, value: React.ReactNode, height: number }>", {
      defaultValue: [],
      description: bi("Columns — `height` is a 0–100 percentage.", "各柱数据，`height` 为 0–100 的百分比。"),
    }),
  },
  render: (args) => <ColumnChart {...args} />,
};

export const Default = {};
