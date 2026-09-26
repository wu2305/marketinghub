import { ActionCard } from "./index.jsx";
import { demoHrefFor } from "../../../demo/navigation.js";

export default {
  title: "Features/Self-Service/Action card",
  component: ActionCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Self-Service entry card with a single action.",
      },
    },
  },
  args: {
    title: "MZ Tracking Detail",
    description: "Miaozhen OTV/OLV media monitoring self-analysis.",
    actionLabel: "Open data view",
    href: demoHrefFor("media-tracking-detail"),
    history: undefined,
  },
  argTypes: {
    onOpen: { action: "onOpen" },
    onShowHistory: { action: "onShowHistory" },
  },
  render: (args) => <ActionCard {...args} />,
};

export const Default = {};
