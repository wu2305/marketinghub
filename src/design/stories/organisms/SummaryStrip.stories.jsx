import { SummaryStrip } from "../../organisms.jsx";
import { CAMPAIGN } from "../../content.js";

export default {
  title: "Organisms/Summary strip",
  component: SummaryStrip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Horizontal execution-status strip (label / caption / value cells).",
      },
    },
  },
  render: () => <SummaryStrip items={CAMPAIGN.executionSummary} />,
};

export const Default = {};
