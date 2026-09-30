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
        component: bi("Horizontal execution-status strip (label / caption / value cells).", "横向的执行状态条（标签 / 说明 / 数值单元格）。"),
      },
    },
  },
  render: () => <SummaryStrip items={CAMPAIGN.executionSummary} />,
};

export const Default = {};
