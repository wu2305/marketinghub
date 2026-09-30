import { LiveOverview } from "../LiveOverview/index.jsx";
import { LiveReportView } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Cockpit/Live report view",
  component: LiveReportView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Live report shell: back-to-library toolbar, kicker/title heading, live panel.", "实时报表外壳：返回报表库的工具栏、眉标/标题头部、实时面板。"),
      },
    },
  },
  args: {
    project: "fourp",
    index: 0,
  },
  argTypes: {
    project: { control: "select", options: Object.keys(COCKPIT.projects).filter((key) => key !== "city") },
    index: { control: { type: "number", min: 0, max: 1 } },
    onBack: { action: "onBack" },
  },
  render: (args) => {
    const project = COCKPIT.projects[args.project];
    const report = project.reports[args.index];
    return (
      <div style={{ minHeight: 640, background: "#f3f5f7", padding: "0 0 40px" }}>
        <LiveReportView
          kicker={`${project.title} / LIVE REPORT`}
          title={report.title}
          backHref={`/assets/pages/reports.html?project=${args.project}`}
          onBack={args.onBack}
        >
          <LiveOverview metrics={report.metrics} chart={report.chart} accent={project.accent} />
        </LiveReportView>
      </div>
    );
  },
};

export const Default = {};
