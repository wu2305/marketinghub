import { Panel } from "./index.jsx";
import { bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Campaign/Panel",
  component: Panel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is a bordered section on Campaign. It shows an optional eyebrow, a title, and a body. Set `actions` for controls in the header. If you set `actions`, the header does not show `meta`.", "这是 Campaign 上带边框的区块。它显示可选眉标、标题和主体。如果页头需要控件，就设置 `actions`。设置了 `actions` 时，页头不再显示 `meta`。"),
      },
    },
  },
  args: { eyebrow: "Trading Desk", title: "Account Operation Details", meta: "3 accounts shown" },
  render: (args) => (
    <Panel {...args}>
      <p style={{ margin: 0 }}>Panel body content — tables, lists, or charts render here.</p>
    </Panel>
  ),
};

export const Default = {};
