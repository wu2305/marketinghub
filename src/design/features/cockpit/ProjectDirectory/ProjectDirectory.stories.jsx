import { ProjectDirectory } from "./index.jsx";
import { ReportRow } from "../ReportRow/index.jsx";
import { COCKPIT } from "../../../content.js";
import { pluralize } from "../../../report-logic.js";

const project = COCKPIT.projects.city;

export default {
  title: "Organisms/Project directory",
  component: ProjectDirectory,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Project catalog mode: back link, project intro header and report list.",
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
          detailsHref="/assets/pages/knowledge.html?type=Report%20Context"
          onOpen={args.onOpen}
          onDetails={args.onDetails}
        />
      ))}
    </ProjectDirectory>
  ),
};

export const Default = {};
