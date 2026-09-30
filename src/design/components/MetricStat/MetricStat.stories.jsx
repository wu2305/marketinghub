import { MetricStat, metricStatAccents, metricStatVariants } from "./index.jsx";
import { enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Metric stat",
  component: MetricStat,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Label + value KPI block used in heroes and dashboards.\n\n**When to use.** One headline figure with a label and an optional supporting line. `glass` sits on hero imagery, `card` on a plain surface. **Used in:** the hero of most pages (Home, AI Interpreter, Review Center, Feedback & Quality, Scenario Library, Detail and Edit) and Campaign dashboards.", "带标签和数值的 KPI 块，用于英雄区与仪表盘。\n\n**何时使用。** 带标签和可选辅助说明行的单个核心数值。`glass` 用于英雄图片之上，`card` 用于普通底色。**使用位置：** 大多数页面的英雄区（Home、AI Interpreter、Review Center、Feedback & Quality、Scenario Library、Detail 与 Edit）以及 Campaign 仪表盘。"),
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
    label: prop("string", { description: bi("Small label above the value.", "数值上方的小标签。") }),
    value: prop("React.ReactNode", { description: bi("The metric figure.", "指标数值。"), control: "text" }),
    caption: prop("string", { description: bi("Supporting line under the value.", "数值下方的辅助说明行。") }),
    variant: enumProp(metricStatVariants, "card", bi("\"glass\" sits on hero imagery and displays uppercase labels; \"card\" preserves the supplied case.", "\"glass\" 用于英雄图片上并将标签显示为大写；\"card\" 保留传入的大小写。"), "inline-radio"),
    accent: enumProp(metricStatAccents, "gold", bi("Accent color — only applies to the card variant.", "强调色；仅对 card 变体有效。")),
    compact: prop("boolean", { defaultValue: false, description: bi("Reduced padding variant.", "紧凑内边距变体。") }),
  },
  render: (args) => (
    <div style={{ width: 240, padding: 12, background: args.variant === "glass" ? "#3a2a22" : "transparent" }}>
      <MetricStat {...args} />
    </div>
  ),
};

export const Default = {};
