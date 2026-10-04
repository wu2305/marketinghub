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
        component: bi("This component is the left rail on Campaign. It shows a header and numbered view buttons. Set `current` to the active item `id`. The function `onSelect` runs when the user clicks an item. The result has `id` and `label`.", "这是 Campaign 的左侧栏。它显示页头和带编号的视图按钮。把 `current` 设为当前项的 `id`。用户点击某一项时会调用 `onSelect`。结果里带有 `id` 和 `label`。"),
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
