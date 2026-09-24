import { ProjectCatalog } from "./index.jsx";
import { COCKPIT } from "../../../content.js";

export default {
  title: "Features/Cockpit/Project catalog",
  component: ProjectCatalog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Cockpit catalog: category groups of ProjectCard.",
      },
    },
  },
  args: {
    groups: COCKPIT.groups.map((group) => ({
      id: group.id,
      title: group.label,
      projects: Object.keys(COCKPIT.projects)
        .filter((key) => COCKPIT.projects[key].group === group.id)
        .map((key) => ({
          id: key,
          title: COCKPIT.projects[key].title,
          kicker: COCKPIT.projects[key].kicker,
          description: COCKPIT.projects[key].description,
          image: COCKPIT.projects[key].image,
          updated: COCKPIT.projects[key].sourceStrip[0],
          href: "/assets/pages/reports.html?project=" + key,
        })),
    })),
  },
  argTypes: { onOpen: { action: "onOpen" } },
  render: (args) => <ProjectCatalog {...args} />,
};

export const Default = {};
