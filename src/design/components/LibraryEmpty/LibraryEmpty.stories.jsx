import { LibraryEmpty, libraryEmptyKinds } from "./index.jsx";
import { callbackProp, enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Library/LibraryEmpty",
  component: LibraryEmpty,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("This component is the empty state of a library list. `no-results` means filters hid every item. That state can offer to clear the filters. `empty` means the library has no items yet.", "这个组件是库列表的空状态。`no-results` 表示筛选条件隐藏了全部条目。这种状态可以提供清除筛选。`empty` 表示库里还没有任何条目。") } } },
  args: { kind: "no-results", title: "No matching terms", message: "Try another keyword or clear the filters.", clearLabel: "Clear filters" },
  argTypes: {
    kind: enumProp(libraryEmptyKinds, "no-results", bi("Why the list is empty.", "列表为空的原因。"), "inline-radio"),
    title: prop("string", { description: bi("Headline.", "标题。") }),
    message: prop("string", { description: bi("Supporting sentence.", "辅助说明。") }),
    clearLabel: prop("string", { defaultValue: "Clear filters", description: bi("Label of the clear button. This button shows only for `no-results`.", "清除按钮的文字。这个按钮只在 `no-results` 时显示。") }),
    onClear: callbackProp("onClear", "(event: { kind }) => void", { kind: "no-results" }, bi("The function runs when Clear filters is pressed. The result has `kind`. If you do not set `onClear`, the button does not show.", "按下 Clear filters 时调用这个函数。结果里带有 `kind`。如果不设置 `onClear`，按钮不显示。")),
  },
};

export const NoResults = {};
export const NothingYet = { args: { kind: "empty", title: "No business terms yet", message: "Terms you create appear here." } };
