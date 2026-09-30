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
        component: bi("Image hero with title, description and optional aside content (stats, ask bar).", "带标题、描述及可选侧边内容（统计、提问栏）的图片英雄区。"),
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
