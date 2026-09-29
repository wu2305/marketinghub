import { ItemActions } from "./index.jsx";
import { governedActions } from "../../lib/governance.js";
import { callbackProp, prop } from "../../lib/story-helpers.js";
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
          "Edit / delete / disable for one governed item (patterns/library.md B6–B7). Renders `governedActions()` output; blocked actions stay focusable and clickable (`aria-disabled`) and report their reason so the caller can explain or offer the fix.",
      },
    },
  },
  args: { id: "gmv", name: "GMV", actions: actionsFor({ creator: me, status: "Disable" }) },
  argTypes: {
    id: prop("string", { description: "Item id reported with every action." }),
    name: prop("string", { description: "Item name appended to each accessible label." }),
    actions: prop("Array<{ action, blocked, reason }>", { description: "Output of `governedActions(record, { currentUser })`." }),
    labels: prop("{ edit?, delete?, disable? }", { description: "Action names." }),
    messages: prop("{ permission?, 'disable-first'?, 'already-disabled'? }", { description: "Tooltip per block reason; defaults from lib/governance.js." }),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "edit", id: "gmv", blocked: false, reason: null }, "Every click, blocked or not."),
  },
};

export const Allowed = { name: "Allowed (own, disabled item)" };
export const DisableFirst = { name: "Blocked: disable first", args: { actions: actionsFor({ creator: me, status: "Enable" }) } };
export const AlreadyDisabled = { name: "Blocked: already disabled (draft)", args: { actions: actionsFor({ creator: me, status: "Enable", stage: "Draft" }) } };
export const Permission = { name: "Blocked: created by others", args: { actions: actionsFor({ creator: "Emily Wang", status: "Disable" }) } };
