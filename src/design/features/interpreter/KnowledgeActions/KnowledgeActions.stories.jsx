import { KnowledgeActions, knowledgeActionVariants } from "./index.jsx";
import { knowledgeActions } from "../../../demo/knowledge-actions.js";
import { prop, callbackProp } from "../../../lib/story-helpers.js";

const record = { id: "owned-term", title: "Owned term", creator: "Current User", status: "Enable" };
export default {
  title: "Features/Interpreter/KnowledgeActions",
  component: KnowledgeActions,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Owner and status-gated edit/delete/disable icon row shared by the P07 knowledge libraries. Business Term keeps aria-disabled notice clicks; the other two source views use native disabled buttons." } } },
  args: { record, actions: knowledgeActions(record), variant: "business-term" },
  argTypes: {
    variant: prop("string", { control: "select", options: knowledgeActionVariants, description: "Source view's icon and disabled semantics." }),
    record: prop("object", { description: "Knowledge record with id/title." }),
    actions: prop("array", { description: "Output of knowledgeActions(record, policy)." }),
    onAction: callbackProp("onAction", "(event: { action, id, record }) => void", { action: "disable", id: "owned-term" }, "Enabled action click."),
  },
};
export const Default = {};
