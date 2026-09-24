import { MetricStat, metricStatAccents, metricStatVariants } from "../../molecules.jsx";
import { enumProp, prop } from "../story-helpers.js";

export default {
  title: "Molecules/Metric stat",
  component: MetricStat,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Label + value KPI block used in heroes and dashboards.",
      },
    },
  },
  args: {
    label: "Report center",
    value: "12",
    caption: "governed reports ready to review",
    variant: "glass",
    accent: "gold",
  },
  argTypes: {
    label: prop("string", { description: "Small label above the value." }),
    value: prop("React.ReactNode", { description: "The metric figure.", control: "text" }),
    caption: prop("string", { description: "Supporting line under the value." }),
    variant: enumProp(metricStatVariants, "card", '"glass" sits on hero imagery.', "inline-radio"),
    accent: enumProp(metricStatAccents, "gold", "Accent color — only applies to the card variant."),
    compact: prop("boolean", { defaultValue: false, description: "Reduced padding variant." }),
  },
  render: (args) => (
    <div style={{ width: 240, padding: 12, background: args.variant === "glass" ? "#3a2a22" : "transparent" }}>
      <MetricStat {...args} />
    </div>
  ),
};

export const Default = {};
