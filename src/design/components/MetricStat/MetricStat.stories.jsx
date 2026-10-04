import { MetricStat, metricStatAccents, metricStatVariants } from "./index.jsx";
import { enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Metric stat",
  component: MetricStat,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is one metric block. It shows a label and a number. It can also show a supporting line.\n\n**When to use.** Use this component for one headline figure. `glass` sits on the header image. `card` sits on a plain surface. **Used in:** the header image area of Home, AI Interpreter, Review Center, Feedback & Quality, Skill Library, Scenario Detail, and Skill Edit. Also used in Campaign.", "这个组件是一个指标块。它显示标签和数值，也可以显示一行说明。\n\n**何时使用。** 需要一个核心数字时用这个组件。`glass` 放在头图上。`card` 放在普通底色上。**使用位置：** Home、AI Interpreter、Review Center、Feedback & Quality、Skill Library、Scenario Detail、Skill Edit 的头图区，以及 Campaign。"),
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
    variant: enumProp(metricStatVariants, "card", bi("Set `glass` on the header image. `glass` shows the label in uppercase. Set `card` on a plain surface. `card` keeps the label case you pass.", "头图上用 `glass`。`glass` 把标签显示成大写。普通底色上用 `card`。`card` 保留你传入的大小写。"), "inline-radio"),
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
