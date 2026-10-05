import { Hero } from "./index.jsx";
import { MetricStat } from "../MetricStat/index.jsx";
import { HOME } from "../../content.js";
import { bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is the page header image area. It shows a title and a description. You can put extra content on the side. Extra content can be metric blocks or an ask bar.", "这个组件是页面的头图区。它显示标题和描述。侧边可以放额外内容。额外内容可以是指标块，也可以是提问栏。"),
      },
    },
  },
  args: { title: HOME.hero.title, description: HOME.hero.description, eyebrow: "" },
  render: (args) => (
    <Hero image={HOME.hero.image} height={300} variant="home" scrim="home" {...args}>
      {HOME.hero.stats.map((stat) => (
        <MetricStat key={stat.label} {...stat} variant="glass" />
      ))}
    </Hero>
  ),
};

export const Default = {};
