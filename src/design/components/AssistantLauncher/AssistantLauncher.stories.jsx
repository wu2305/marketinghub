import { AssistantLauncher } from "./index.jsx";
import { bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Assistant launcher",
  component: AssistantLauncher,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Floating corner button that opens the assistant panel.", "位于页面角落、用于打开助手面板的悬浮按钮。"),
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
