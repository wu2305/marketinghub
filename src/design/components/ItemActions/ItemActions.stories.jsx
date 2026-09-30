import { ItemActions } from "./index.jsx";
import { governedActions } from "../../lib/governance.js";
import { callbackProp, prop, bi } from "../../lib/story-helpers.js";
import { me } from "../../demo/library-story-data.js";

const actionsFor = (record) => governedActions(record, { currentUser: me });

export default {
  title: "Organisms/Library/ItemActions",
  component: ItemActions,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("Edit / delete / disable for one governed item (patterns/library.md B6–B7). Renders `governedActions()` output; blocked actions stay focusable and clickable (`aria-disabled`) and report their reason so the caller can explain or offer the fix.", "单个受治理条目的编辑、删除、停用操作（patterns/library.md B6–B7）。渲染 `governedActions()` 的输出；被阻止的操作仍可聚焦、可点击（`aria-disabled`），并回报阻止原因，方便调用方解释或提供修复入口。"),
      },
    },
  },
  args: { id: "gmv", name: "GMV", actions: actionsFor({ creator: me, status: "Disable" }) },
  argTypes: {
    id: prop("string", { description: bi("Item id reported with every action.", "每个操作都会回传的条目 id。") }),
    name: prop("string", { description: bi("Item name appended to each accessible label.", "追加到每个无障碍标签后的条目名称。") }),
    actions: prop("Array<{ action, blocked, reason }>", { description: bi("Output of `governedActions(record, { currentUser })`.", "`governedActions(record, { currentUser })` 的输出。") }),
    labels: prop("{ edit?, delete?, disable? }", { description: bi("Action names.", "操作名称。") }),
    messages: prop("{ permission?, 'disable-first'?, 'already-disabled'? }", { description: bi("Tooltip per block reason; defaults from lib/governance.js.", "各阻止原因对应的提示文字；默认值来自 lib/governance.js。") }),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "edit", id: "gmv", blocked: false, reason: null }, bi("Every click, blocked or not.", "每次点击都会触发，无论是否被阻止。")),
  },
};

export const Allowed = { name: "Allowed (own, disabled item)" };
export const DisableFirst = { name: "Blocked: disable first", args: { actions: actionsFor({ creator: me, status: "Enable" }) } };
export const AlreadyDisabled = { name: "Blocked: already disabled (draft)", args: { actions: actionsFor({ creator: me, status: "Enable", stage: "Draft" }) } };
export const Permission = { name: "Blocked: created by others", args: { actions: actionsFor({ creator: "Emily Wang", status: "Disable" }) } };
