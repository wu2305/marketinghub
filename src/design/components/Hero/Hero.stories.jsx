import { Hero } from "./index.jsx";
import { MetricStat } from "../MetricStat/index.jsx";
import { HOME } from "../../content.js";

export default {
  title: "Organisms/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Image hero with title, description and optional aside content (stats, ask bar).",
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
