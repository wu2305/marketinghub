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
          bi("This component shows Edit, Delete, and Disable for one library item. Pass the output of `governedActions()`. A blocked action stays focusable. A blocked action stays clickable. The button has `aria-disabled`. Each click sends `action`, `id`, `blocked`, and `reason`. Disable knowledge before you edit or delete it. Only knowledge created by you can be managed.", "这个组件显示一条库记录的 Edit、Delete 和 Disable。传入 `governedActions()` 的结果。被阻止的操作仍可聚焦，也可点击。按钮带 `aria-disabled`。每次点击都会发出 `action`、`id`、`blocked` 和 `reason`。编辑或删除前要先 Disable。只有你自己创建的知识才能管理。"),
      },
    },
  },
  args: { id: "gmv", name: "GMV", actions: actionsFor({ creator: me, status: "Disable" }) },
  argTypes: {
    id: prop("string", { description: bi("Item id. Every action result includes this id.", "条目 id。每次操作的结果里都带这个 id。") }),
    name: prop("string", { description: bi("Item name. Each accessible label adds this name.", "条目名称。每个无障碍标签都会加上这个名称。") }),
    actions: prop("Array<{ action, blocked, reason }>", { description: bi("Output of `governedActions(record, { currentUser })`.", "`governedActions(record, { currentUser })` 的输出。") }),
    labels: prop("{ edit?, delete?, disable? }", { description: bi("Action names.", "操作名称。") }),
    messages: prop("{ permission?, 'disable-first'?, 'already-disabled'? }", { description: bi("Tooltip for each block reason. Defaults come from `lib/governance.js`.", "各阻止原因对应的提示文字。默认值来自 `lib/governance.js`。") }),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "edit", id: "gmv", blocked: false, reason: null }, bi("The function runs on every click. It runs for a blocked action too.", "每次点击都会调用这个函数。被阻止的操作也会调用。")),
  },
};

export const Allowed = { name: "Allowed (own, disabled item)" };
export const DisableFirst = { name: "Blocked: disable first", args: { actions: actionsFor({ creator: me, status: "Enable" }) } };
export const AlreadyDisabled = { name: "Blocked: already disabled (draft)", args: { actions: actionsFor({ creator: me, status: "Enable", stage: "Draft" }) } };
export const Permission = { name: "Blocked: created by others", args: { actions: actionsFor({ creator: "Emily Wang", status: "Disable" }) } };
