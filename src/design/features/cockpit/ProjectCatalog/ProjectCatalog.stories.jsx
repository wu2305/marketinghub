import { ProjectCatalog } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Cockpit/Project catalog",
  component: ProjectCatalog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is the project catalog on Marketing Cockpit. It groups `ProjectCard` by category. Each group has a title. The function `onOpen` runs when the user opens a project card. The result has `title` and the project `id`.", "这是 Marketing Cockpit 上的项目目录。它按分类分组显示 `ProjectCard`。每个分组有一个标题。用户打开项目卡片时会调用 `onOpen`。结果里带有 `title` 和项目的 `id`。"),
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
