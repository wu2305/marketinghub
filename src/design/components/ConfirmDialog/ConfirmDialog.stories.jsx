import { ConfirmDialog, confirmDialogPurposes } from "./index.jsx";
import { callbackProp, enumProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Confirm dialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purpose-based confirmation and notice dialog. Confirm is neutral, info has one dismissal action, warning emphasizes risk, and danger emphasizes deletion. Modal supplies overlay/focus/Escape behavior.",
      },
    },
  },
  args: {
    open: true,
    purpose: "confirm",
    title: "Confirm Operation",
    message: "Please confirm whether to offline this knowledge.",
    confirmLabel: "Confirm Offline",
    cancelLabel: "Cancel",
    closeLabel: "Close",
  },
  argTypes: {
    open: prop("boolean", { defaultValue: false, description: "Whether the dialog is visible." }),
    purpose: enumProp(confirmDialogPurposes, "confirm", "Action purpose: neutral confirm, informational notice, risk warning, or destructive action."),
    title: prop("string", { description: "Dialog title." }),
    message: prop("string", { description: "Body copy." }),
    confirmLabel: prop("string", { defaultValue: "Confirm", description: "Primary action label for confirmations." }),
    cancelLabel: prop("string", { defaultValue: "Cancel", description: "Secondary action label for confirmations." }),
    closeLabel: prop("string", { defaultValue: "Close", description: "Single dismiss button label for notices." }),
    onConfirm: callbackProp("onConfirm", "(event: { confirmed: true }) => void", { confirmed: true }, "Fired by the primary confirm button."),
    onCancel: callbackProp("onCancel", "(event: { reason: string }) => void", { reason: "cancel" }, "Fired on any dismissal — Cancel, Close, scrim or Escape."),
  },
  render: function ConfirmDialogStory(args) {
    return <ConfirmDialog {...args} />;
  },
};

export const Confirm = {};

export const Info = {
  args: {
    purpose: "info",
    title: "Permission denied",
    message: "You do not have permission to edit knowledge created by another user.",
  },
};
