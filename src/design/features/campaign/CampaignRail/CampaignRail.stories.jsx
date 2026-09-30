import { CampaignRail } from "./index.jsx";
import { CAMPAIGN } from "../../../content.js";
import { useSynced, bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Campaign/Campaign rail",
  component: CampaignRail,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("RedNote Campaign Tool left rail: numbered view navigation.", "RedNote Campaign Tool 左侧栏：带编号的视图导航。"),
      },
    },
  },
  args: { current: "overview" },
  argTypes: {
    current: { control: "select", options: CAMPAIGN.rail.items.map((item) => item.id) },
    onSelect: { action: "onSelect" },
  },
  render: function CampaignRailStory(args) {
    const [current, setCurrent] = useSynced(args.current);
    return (
      <div style={{ width: 260 }}>
        <CampaignRail
          {...CAMPAIGN.rail}
          {...args}
          current={current}
          onSelect={(event) => {
            setCurrent(event.id);
            args.onSelect?.(event);
          }}
        />
      </div>
    );
  },
};

export const Default = {};
