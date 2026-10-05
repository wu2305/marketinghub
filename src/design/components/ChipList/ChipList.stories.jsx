import { ChipList, chipListTones } from "./index.jsx";
import { enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Library/ChipList",
  component: ChipList,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("This component shows a labelled row of short values. It sits on a library card or in a drawer. It shows the first `max` values. Other values are counted in a \"+N\" chip.", "这个组件显示一行带标签的短值。它用在库卡片或抽屉里。先显示前 `max` 个值。其余的值记在 \"+N\" 标签里。") } } },
  args: { label: "Synonyms", values: ["Gross Sales", "Merchandise Value", "Gross Merchandise Sales"], max: 3, moreLabel: "More synonyms", tone: "neutral" },
  argTypes: {
    label: prop("string", { description: bi("Row label; omit under a drawer heading.", "行标签；在抽屉标题下使用时可省略。") }),
    values: prop("Array<string>", { description: bi("Values in display order.", "按显示顺序排列的值。") }),
    max: prop("number", { defaultValue: 3, description: bi("Values shown before the +N chip.", "+N 标签之前显示的值的数量。") }),
    moreLabel: prop("string", { defaultValue: "More", description: bi("Accessible prefix of the +N chip.", "+N 标签的无障碍前缀。") }),
    tone: enumProp(chipListTones, "neutral", bi("Chip colour role.", "标签的颜色角色。"), "inline-radio"),
    emptyLabel: prop("string", { defaultValue: "—", description: bi("Shown with no values.", "没有任何值时显示的文字。") }),
  },
};

export const Default = {};
export const Overflow = { args: { values: ["Member CVR", "Member Conversion Rate", "Visit-to-Purchase Rate", "Member conversion KPI", "Conversion"] } };
export const Empty = { args: { values: [] } };
