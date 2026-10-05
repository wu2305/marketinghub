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
        component: bi("This component is one report row on Marketing Cockpit. It shows an index, a breadcrumb path, a linked title, a meta list, a Knowledge button, and an Open Dashboard link. The title and Open Dashboard are `<a href>`. Knowledge is a button. It does not navigate.", "这是 Marketing Cockpit 上的一行报表。它显示序号、面包屑路径、带链接的标题、元信息列表、Knowledge 按钮和 Open Dashboard 链接。标题和 Open Dashboard 是 `<a href>`。Knowledge 是按钮，不会导航。"),
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
    index: prop("number", { description: bi("Zero-based report index. The label shows REPORT 01, REPORT 02, and so on.", "从 0 开始的报表序号。标签显示为 REPORT 01、REPORT 02，依此类推。"), control: { type: "number", min: 0 } }),
    path: prop("string", { description: bi("Category / Project / Type breadcrumb.", "Category / Project / Type 面包屑。") }),
    title: prop("string", { description: bi("Report title. It is a link.", "报表标题。它是一个链接。") }),
    description: prop("string", { description: bi("Summary under the title.", "标题下方的摘要。") }),
    meta: prop("Array<{ label: string, value: React.ReactNode }>", {
      defaultValue: [],
      description: bi("Owner, Cadence, Updated, and Knowledge cells.", "Owner、Cadence、Updated 和 Knowledge 单元格。"),
    }),
    detailsLabel: prop("string", { defaultValue: "Knowledge", description: bi("Label on the Knowledge button.", "Knowledge 按钮上的文字。") }),
    openLabel: prop("string", { defaultValue: "Open Dashboard", description: bi("Label on the Open Dashboard link.", "Open Dashboard 链接上的文字。") }),
    href: prop("string", { description: bi("Target for the title link and the Open Dashboard link.", "标题链接和 Open Dashboard 链接的目标。") }),
    onOpen: callbackProp(
      "onOpen",
      "(target: { title: string, href?: string }) => void",
      { title: report.title, href: "/assets/pages/reports.html?project=city&dashboard=0&view=live" },
      bi("The function runs when the user clicks the title or Open Dashboard. The result has `title` and `href`.", "用户点击标题或 Open Dashboard 时会调用这个函数。结果里带有 `title` 和 `href`。"),
    ),
    onDetails: callbackProp(
      "onDetails",
      "(target: { title: string }) => void",
      { title: report.title },
      bi("The function runs when the user clicks the Knowledge button. The result has `title`. The page opens report details.", "用户点击 Knowledge 按钮时会调用这个函数。结果里带有 `title`。页面打开报表详情。"),
    ),
  },
  render: (args) => (
    <div style={{ maxWidth: 960 }}>
      <ReportRow {...args} />
    </div>
  ),
};

export const Default = {};
