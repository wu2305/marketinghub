import { ProjectCard } from "./index.jsx";
import { COCKPIT } from "../../../content.js";

const cityProject = COCKPIT.projects.city;

export default {
  title: "Organisms/Project card",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: 'Cockpit project card with image, title and "View Dashboards" links.',
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
