import { CampaignRail } from "./index.jsx";
import { CAMPAIGN } from "../../../content.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Organisms/Campaign rail",
  component: CampaignRail,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "RedNote Campaign Tool left rail: numbered view navigation.",
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
