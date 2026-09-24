import { AssetRow } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Organisms/Asset row",
  component: AssetRow,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Single row in the generic knowledge list (transition component — the per-type original views are card/table grids, see handover §2.3 P07).",
      },
    },
  },
  args: {
    ...INTERPRETER.records.find((record) => record.typeId === "Business Term"),
    active: false,
  },
  argTypes: {
    stage: { control: "select", options: ["draft", "under-review", "queued", "building", "published"] },
    availability: { control: "inline-radio", options: ["enabled", "disabled"] },
    onSelect: { action: "onSelect" },
  },
  render: function AssetRowStory(args) {
    const [active, setActive] = useSynced(args.active);
    return (
      <AssetRow
        {...args}
        active={active}
        onSelect={(event) => {
          setActive(true);
          args.onSelect?.(event);
        }}
      />
    );
  },
};

export const Default = {};
