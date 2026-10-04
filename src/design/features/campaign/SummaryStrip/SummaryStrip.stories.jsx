import { SummaryStrip } from "./index.jsx";
import { CAMPAIGN } from "../../../content.js";
import { bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Campaign/Summary strip",
  component: SummaryStrip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is a horizontal status row on Campaign. Each cell has a label, an optional caption, and a value.", "这是 Campaign 上的横向状态条。每个单元格有标签、可选说明和数值。"),
      },
    },
  },
  render: () => <SummaryStrip items={CAMPAIGN.executionSummary} />,
};

export const Default = {};
