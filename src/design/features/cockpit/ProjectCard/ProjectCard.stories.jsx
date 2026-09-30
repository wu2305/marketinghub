import { ProjectCard } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { bi } from "../../../lib/story-helpers.js";

const cityProject = COCKPIT.projects.city;

export default {
  title: "Features/Cockpit/Project card",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Cockpit project card with image, title and \"View Dashboards\" links.", "Cockpit 项目卡片，含图片、标题与 \"View Dashboards\" 链接。"),
      },
    },
  },
  args: { title: cityProject.title, description: cityProject.description },
  argTypes: { onOpen: { action: "onOpen" } },
  render: (args) => (
    <div style={{ width: 360 }}>
      <ProjectCard
        title={cityProject.title}
        kicker={cityProject.kicker}
        image={cityProject.image}
        updated={cityProject.sourceStrip[0]}
        href="/assets/pages/reports.html?project=city"
        {...args}
      />
    </div>
  ),
};

export const Default = {};
