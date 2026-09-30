import { ReportRow } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { callbackProp, prop, bi } from "../../../lib/story-helpers.js";

const project = COCKPIT.projects.city;
const report = project.reports[0];

export default {
  title: "Features/Cockpit/Report row",
  component: ReportRow,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Catalog report row: index, breadcrumb path, linked title, meta list and actions.", "目录中的报表行：序号、面包屑路径、带链接的标题、元信息列表与操作。"),
      },
    },
  },
  args: {
    index: 0,
    path: `${project.category} / ${project.title} / ${report.type}`,
    title: report.title,
    description: report.description,
    meta: [
      { label: "Owner", value: report.owner },
      { label: "Cadence", value: report.cadence },
      { label: "Updated", value: report.updated },
      { label: "Knowledge", value: "6 assets" },
    ],
    detailsLabel: "Knowledge",
    openLabel: "Open Dashboard",
    href: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
  },
  argTypes: {
    index: prop("number", { description: bi("Zero-based report index, displayed as REPORT 01…", "从 0 开始的报表序号，显示为 REPORT 01…"), control: { type: "number", min: 0 } }),
    path: prop("string", { description: bi("\"Category / Project / Type\" breadcrumb.", "\"Category / Project / Type\" 面包屑。") }),
    title: prop("string", { description: bi("Report title — renders as the linked heading.", "报表标题，渲染为带链接的标题。") }),
    description: prop("string", { description: bi("Summary paragraph under the title.", "标题下方的摘要段落。") }),
    meta: prop("Array<{ label: string, value: React.ReactNode }>", {
      defaultValue: [],
      description: bi("Owner/Cadence/Updated/Knowledge cells.", "Owner / Cadence / Updated / Knowledge 单元格。"),
    }),
    detailsLabel: prop("string", { defaultValue: "Knowledge", description: bi("Label on the report details action.", "报表详情操作的标签。") }),
    openLabel: prop("string", { defaultValue: "Open Dashboard", description: bi("Label on the live-report link.", "实时报表链接的标签。") }),
    href: prop("string", { description: bi("Live-report link target.", "实时报表链接的目标。") }),
    onOpen: callbackProp(
      "onOpen",
      "(target: { title: string, href?: string }) => void",
      { title: report.title, href: "/assets/pages/reports.html?project=city&dashboard=0&view=live" },
      bi("Fired when the title or the Open Dashboard link is clicked.", "点击标题或 Open Dashboard 链接时触发。"),
    ),
    onDetails: callbackProp(
      "onDetails",
      "(target: { title: string }) => void",
      { title: report.title },
      bi("Fired when the Knowledge button opens report details.", "点击 Knowledge 按钮打开报表详情时触发。"),
    ),
  },
  render: (args) => (
    <div style={{ maxWidth: 960 }}>
      <ReportRow {...args} />
    </div>
  ),
};

export const Default = {};
