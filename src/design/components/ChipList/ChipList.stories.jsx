import { ChipList, chipListTones } from "./index.jsx";
import { enumProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Library/ChipList",
  component: ChipList,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Labelled row of short values in a library card or drawer. Shows the first `max` values and counts the rest in a \"+N\" chip (dispositions D07)." } } },
  args: { label: "Synonyms", values: ["Gross Sales", "Merchandise Value", "Gross Merchandise Sales"], max: 3, moreLabel: "More synonyms", tone: "neutral" },
  argTypes: {
    label: prop("string", { description: "Row label; omit under a drawer heading." }),
    values: prop("Array<string>", { description: "Values in display order." }),
    max: prop("number", { defaultValue: 3, description: "Values shown before the +N chip." }),
    moreLabel: prop("string", { defaultValue: "More", description: "Accessible prefix of the +N chip." }),
    tone: enumProp(chipListTones, "neutral", "Chip colour role.", "inline-radio"),
    emptyLabel: prop("string", { defaultValue: "—", description: "Shown with no values." }),
  },
};

export const Default = {};
export const Overflow = { args: { values: ["Member CVR", "Member Conversion Rate", "Visit-to-Purchase Rate", "Member conversion KPI", "Conversion"] } };
export const Empty = { args: { values: [] } };
