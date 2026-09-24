import { SummaryStrip } from "./index.jsx";
import { CAMPAIGN } from "../../../content.js";

export default {
  title: "Features/Campaign/Summary strip",
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
