import { LiveOverview } from "../../organisms.jsx";
import { COCKPIT } from "../../content.js";

const project = COCKPIT.projects.fourp;

export default {
  title: "Organisms/Live overview",
  component: LiveOverview,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Generic live overview: KPI cards, primary/comparison bar chart, and the "Leading views" rank list (first five chart rows, original chart order).',
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
