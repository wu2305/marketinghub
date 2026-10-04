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
          bi("This component is the live report overview on Marketing Cockpit. It shows metric cards. It shows a primary and comparison column chart. It also shows a Leading views rank list. The rank list uses the first five rows of `chart`. The order stays the same as `chart`.", "这是 Marketing Cockpit 上的实时报表概览。它显示指标卡片。它显示主柱与对比柱的柱状图。它还显示 Leading views 排名列表。排名列表取 `chart` 的前五行。顺序与 `chart` 相同。"),
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
