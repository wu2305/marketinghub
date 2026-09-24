import { ReportRow } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { callbackProp, prop } from "../../../lib/story-helpers.js";

const project = COCKPIT.projects.city;
const report = project.reports[0];

export default {
  title: "Features/Cockpit/Report row",
  component: ReportRow,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Catalog report row: index, breadcrumb path, linked title, meta list and actions.",
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
    detailsHref: "/assets/pages/knowledge.html?type=Report%20Context",
  },
  argTypes: {
    index: prop("number", { description: 'Zero-based report index, displayed as REPORT 01…', control: { type: "number", min: 0 } }),
    path: prop("string", { description: '"Category / Project / Type" breadcrumb.' }),
    title: prop("string", { description: "Report title — renders as the linked heading." }),
    description: prop("string", { description: "Summary paragraph under the title." }),
    meta: prop("Array<{ label: string, value: React.ReactNode }>", {
      defaultValue: [],
      description: "Owner/Cadence/Updated/Knowledge cells.",
    }),
    detailsLabel: prop("string", { defaultValue: "Knowledge", description: "Label on the knowledge-context link." }),
    openLabel: prop("string", { defaultValue: "Open Dashboard", description: "Label on the live-report link." }),
    href: prop("string", { description: "Live-report link target." }),
    detailsHref: prop("string", { description: "Knowledge-context link target." }),
    onOpen: callbackProp(
      "onOpen",
      "(target: { title: string, href?: string }) => void",
      { title: report.title, href: "/assets/pages/reports.html?project=city&dashboard=0&view=live" },
      "Fired when the title or the Open Dashboard link is clicked.",
    ),
    onDetails: callbackProp(
      "onDetails",
      "(target: { title: string, href?: string }) => void",
      { title: report.title, href: "/assets/pages/knowledge.html?type=Report%20Context" },
      "Fired when the Knowledge link is clicked.",
    ),
  },
  render: (args) => (
    <div style={{ maxWidth: 960 }}>
      <ReportRow {...args} />
    </div>
  ),
};

export const Default = {};
