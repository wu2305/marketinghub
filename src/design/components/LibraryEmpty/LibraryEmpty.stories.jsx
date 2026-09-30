import { LibraryEmpty, libraryEmptyKinds } from "./index.jsx";
import { callbackProp, enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Library/LibraryEmpty",
  component: LibraryEmpty,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("Empty state of a governed library: filters hid everything (offers to clear them), or nothing exists yet.", "受治理库的空状态：筛选条件过滤掉了全部内容（提供清除筛选），或者尚无任何内容。") } } },
  args: { kind: "no-results", title: "No matching terms", message: "Try another keyword or clear the filters.", clearLabel: "Clear filters" },
  argTypes: {
    kind: enumProp(libraryEmptyKinds, "no-results", bi("Why the list is empty.", "列表为空的原因。"), "inline-radio"),
    title: prop("string", { description: bi("Headline.", "标题。") }),
    message: prop("string", { description: bi("Supporting sentence.", "辅助说明句。") }),
    clearLabel: prop("string", { defaultValue: "Clear filters", description: bi("no-results only.", "仅用于 no-results。") }),
    onClear: callbackProp("onClear", "(event: { kind }) => void", { kind: "no-results" }, bi("Clears search and facets; omit to hide the button.", "清除搜索与筛选项；不传则隐藏该按钮。")),
  },
};

export const NoResults = {};
export const NothingYet = { args: { kind: "empty", title: "No business terms yet", message: "Terms you create appear here." } };
