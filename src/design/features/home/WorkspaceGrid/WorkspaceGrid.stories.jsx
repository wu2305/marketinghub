import { WorkspaceGrid } from "./index.jsx";
import { HOME } from "../../../content.js";

export default {
  title: "Features/Home/Workspace grid",
  component: WorkspaceGrid,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Grid of WorkspaceCard.",
      },
    },
  },
  argTypes: {
    onOpen: { action: "onOpen" },
    onNavigate: { action: "onNavigate" },
  },
  render: (args) => <WorkspaceGrid cards={HOME.cards} {...args} />,
};

export const Default = {};
