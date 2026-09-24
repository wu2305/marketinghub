import { ConfirmDialog, confirmDialogTones } from "./index.jsx";
import { callbackProp, enumProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Confirm dialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Small confirm/info dialog shared by the knowledge libraries (business-term-library.js / field-library.js / scenario-reports.js all build the same `.fm-dialog`). “confirm” shows a warning icon + Cancel + a primary confirm button; “info” shows title + message + a single Close button. Built on Modal for overlay/focus/Escape lifecycle.",
      },
    },
  },
  args: {
    open: true,
    tone: "confirm",
    title: "Confirm Operation",
    message: "Please confirm whether to offline this knowledge.",
    confirmLabel: "Confirm Offline",
    cancelLabel: "Cancel",
    closeLabel: "Close",
  },
  argTypes: {
    open: prop("boolean", { defaultValue: false, description: "Whether the dialog is visible." }),
    tone: enumProp(confirmDialogTones, "confirm", "confirm = warning icon + Cancel/confirm buttons; info = title + message + single close button."),
    title: prop("string", { description: "Dialog title." }),
    message: prop("string", { description: "Body copy." }),
    confirmLabel: prop("string", { defaultValue: "Confirm", description: "Primary action label (confirm tone)." }),
    cancelLabel: prop("string", { defaultValue: "Cancel", description: "Cancel button label (confirm tone)." }),
    closeLabel: prop("string", { defaultValue: "Close", description: "Single dismiss button label (info tone)." }),
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
    tone: "info",
    title: "Permission denied",
    message: "You do not have permission to edit knowledge created by another user.",
  },
};
