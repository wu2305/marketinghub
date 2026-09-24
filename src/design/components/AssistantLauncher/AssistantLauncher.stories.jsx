import { AssistantLauncher } from "./index.jsx";

export default {
  title: "Organisms/Assistant launcher",
  component: AssistantLauncher,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Floating corner button that opens the assistant panel.",
      },
    },
  },
  argTypes: { onOpen: { action: "onOpen" } },
  render: (args) => (
    <div style={{ height: 120 }}>
      <AssistantLauncher {...args} />
    </div>
  ),
};

export const Default = {};
