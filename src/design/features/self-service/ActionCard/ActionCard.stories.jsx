import { ActionCard } from "./index.jsx";

export default {
  title: "Organisms/Action card",
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
    href: "/assets/pages/media-tracking-detail.html",
    history: undefined,
  },
  argTypes: {
    onOpen: { action: "onOpen" },
    onShowHistory: { action: "onShowHistory" },
  },
  render: (args) => <ActionCard {...args} />,
};

export const Default = {};
