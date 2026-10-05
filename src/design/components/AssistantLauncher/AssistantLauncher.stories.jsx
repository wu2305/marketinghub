import { AssistantLauncher } from "./index.jsx";
import { bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Assistant launcher",
  component: AssistantLauncher,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is the floating corner button. A click opens the assistant panel. The forwarded ref points at the button. Set `hidden` if the panel is open. The button then does not show.", "这个组件是角落里的悬浮按钮。点击后打开助手面板。转发的 ref 指向这个按钮。如果面板已打开，就设置 `hidden`。按钮不再显示。"),
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
