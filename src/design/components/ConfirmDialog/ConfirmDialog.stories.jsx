import { ConfirmDialog, confirmDialogPurposes } from "./index.jsx";
import { callbackProp, enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Confirm dialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("Purpose-based confirmation and notice dialog. Confirm is neutral, info has one dismissal action, warning emphasizes risk, and danger emphasizes deletion. Modal supplies overlay/focus/Escape behavior.", "按用途区分的确认与通知对话框。confirm 为中性确认，info 只有一个关闭操作，warning 强调风险，danger 强调删除。遮罩、焦点与 Escape 行为由 Modal 提供。"),
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
    open: prop("boolean", { defaultValue: false, description: bi("Whether the dialog is visible.", "对话框是否可见。") }),
    purpose: enumProp(confirmDialogPurposes, "confirm", bi("Action purpose: neutral confirm, informational notice, risk warning, or destructive action.", "操作用途：中性确认、信息通知、风险警告或破坏性操作。")),
    title: prop("string", { description: bi("Dialog title.", "对话框标题。") }),
    message: prop("string", { description: bi("Body copy.", "正文文案。") }),
    confirmLabel: prop("string", { defaultValue: "Confirm", description: bi("Primary action label for confirmations.", "确认类对话框的主操作文字。") }),
    cancelLabel: prop("string", { defaultValue: "Cancel", description: bi("Secondary action label for confirmations.", "确认类对话框的次操作文字。") }),
    closeLabel: prop("string", { defaultValue: "Close", description: bi("Single dismiss button label for notices.", "通知类对话框唯一的关闭按钮文字。") }),
    onConfirm: callbackProp("onConfirm", "(event: { confirmed: true }) => void", { confirmed: true }, bi("Fired by the primary confirm button.", "点击主确认按钮时触发。")),
    onCancel: callbackProp("onCancel", "(event: { reason: string }) => void", { reason: "cancel" }, bi("Fired on any dismissal — Cancel, Close, scrim or Escape.", "任何关闭方式（Cancel、Close、点击遮罩或 Escape）都会触发。")),
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
