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
        component: bi("This component is the live report shell on Marketing Cockpit. It shows a sticky back bar, a kicker, the report title, and a panel. Put `LiveOverview` or `CityInvestDashboard` in `children`. The back control is `<a href>`. The function `onBack` runs on a plain click. The result has `href`.", "这是 Marketing Cockpit 上的实时报表外壳。它显示一条贴顶的返回栏、眉标、报表标题和一块面板。把 `LiveOverview` 或 `CityInvestDashboard` 放进 `children`。返回控件是 `<a href>`。普通点击会调用 `onBack`。结果里带有 `href`。"),
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
