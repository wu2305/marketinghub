import { ProjectDirectory } from "./index.jsx";
import { ReportRow } from "../ReportRow/index.jsx";
import { COCKPIT } from "../../../content.js";
import { pluralize } from "../lib/report-logic.js";
import { bi } from "../../../lib/story-helpers.js";

const project = COCKPIT.projects.city;

export default {
  title: "Features/Cockpit/Project directory",
  component: ProjectDirectory,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is the project report list on Marketing Cockpit. It shows a back link, a project image, the project title, and a list of reports. Pass `ReportRow` elements as `children`. The back control is `<a href>`. The function `onBack` runs on a plain click. The result has `href`.", "这是 Marketing Cockpit 上的项目报表列表。它显示返回链接、项目图片、项目标题和报表列表。把 `ReportRow` 作为 `children` 传入。返回控件是 `<a href>`。普通点击会调用 `onBack`。结果里带有 `href`。"),
      },
    },
  },
  args: {
    backHref: "/assets/pages/reports.html",
    image: project.image,
    imageAlt: `${project.title} report preview`,
    kicker: project.kicker,
    title: project.title,
    description: project.description,
    countText: pluralize(project.reports.length, "dashboard"),
    updated: project.sourceStrip[0],
    listCountText: pluralize(project.reports.length, "dashboard"),
  },
  argTypes: {
    onBack: { action: "onBack" },
  },
  render: (args) => (
    <ProjectDirectory {...args}>
      {project.reports.map((report, index) => (
        <ReportRow
          key={report.title}
          index={index}
          path={`${project.category} / ${project.title} / ${report.type}`}
          title={report.title}
          description={report.description}
          meta={[
            { label: "Owner", value: report.owner },
            { label: "Cadence", value: report.cadence },
            { label: "Updated", value: report.updated },
          ]}
          href={`/assets/pages/reports.html?project=city&dashboard=${index}&view=live`}
          onOpen={args.onOpen}
          onDetails={args.onDetails}
        />
      ))}
    </ProjectDirectory>
  ),
};

export const Default = {};
