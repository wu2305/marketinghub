import { LiveOverview } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { bi } from "../../../lib/story-helpers.js";

const project = COCKPIT.projects.fourp;

export default {
  title: "Features/Cockpit/Live overview",
  component: LiveOverview,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("Generic live overview: KPI cards, primary/comparison bar chart, and the \"Leading views\" rank list (first five chart rows, original chart order).", "通用的实时概览：KPI 卡片、主/对比柱状图，以及 \"Leading views\" 排名列表（取图表前五行，保持原图表顺序）。"),
      },
    },
  },
  args: {
    metrics: project.reports[0].metrics,
    chart: project.reports[0].chart,
    accent: project.accent,
  },
  render: (args) => (
    <div style={{ background: "#f3f5f7", padding: "24px" }}>
      <LiveOverview {...args} />
    </div>
  ),
};

export const Default = {};
