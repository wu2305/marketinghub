import { Panel } from "./index.jsx";
import { bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Campaign/Panel",
  component: Panel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("Bordered section panel with heading and optional actions slot.", "带标题和可选操作插槽的有边框区块面板。"),
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
