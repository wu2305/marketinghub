import { Panel } from "./index.jsx";

export default {
  title: "Organisms/Panel",
  component: Panel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Bordered section panel with heading and optional actions slot.",
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
