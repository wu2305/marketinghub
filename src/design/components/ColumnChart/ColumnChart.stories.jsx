import { ColumnChart } from "./index.jsx";
import { prop } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Column chart",
  component: ColumnChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "CSS-only column chart; `height` is a 0–100 percentage.",
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
    label: prop("string", { defaultValue: "Chart", description: "aria-label on the chart." }),
    items: prop("Array<{ label: string, value: React.ReactNode, height: number }>", {
      defaultValue: [],
      description: "Columns — `height` is a 0–100 percentage.",
    }),
  },
  render: (args) => <ColumnChart {...args} />,
};

export const Default = {};
