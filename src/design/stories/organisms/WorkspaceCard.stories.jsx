import { WorkspaceCard } from "../../organisms.jsx";
import { HOME } from "../../content.js";

export default {
  title: "Organisms/Workspace card",
  component: WorkspaceCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Home workspace card: image, description, capability links, full-card opener.",
      },
    },
  },
  args: { title: HOME.cards[0].title, description: HOME.cards[0].description },
  argTypes: {
    onOpen: { action: "onOpen" },
    onNavigate: { action: "onNavigate" },
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <WorkspaceCard {...HOME.cards[0]} {...args} />
    </div>
  ),
};

export const Default = {};
