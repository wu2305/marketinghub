import { Button } from "../Button/index.jsx";
import { ConfirmDialog, confirmDialogPurposes } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Confirm dialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("This component is a confirmation dialog or a notice dialog. `confirm` is a neutral confirm. `info` has one Close action. `warning` marks risk. `danger` marks deletion. Overlay, focus, and Escape come from Modal. `open` is host state: the dialog only calls `onCancel` or `onConfirm`, and the host sets `open` to false. In these stories the story host closes the dialog on every callback and shows an Open dialog button to bring it back.", "这个组件是确认对话框或通知对话框。`confirm` 是中性确认。`info` 只有一个 Close 操作。`warning` 强调风险。`danger` 强调删除。遮罩、焦点和 Escape 由 Modal 提供。`open` 是宿主的状态：对话框只会调用 `onCancel` 或 `onConfirm`，由宿主把 `open` 设为 false。在这些故事里，由故事宿主在每次回调时关闭对话框，并显示一个 Open dialog 按钮用来重新打开。"),
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
    purpose: enumProp(confirmDialogPurposes, "confirm", bi("Action purpose. `confirm` is neutral. `info` is a notice. `warning` marks risk. `danger` marks deletion.", "操作用途。`confirm` 是中性确认。`info` 是通知。`warning` 强调风险。`danger` 强调删除。")),
    title: prop("string", { description: bi("Dialog title.", "对话框标题。") }),
    message: prop("string", { description: bi("Body text.", "正文文字。") }),
    confirmLabel: prop("string", { defaultValue: "Confirm", description: bi("Label of the primary button for confirmations.", "确认类对话框主按钮的文字。") }),
    cancelLabel: prop("string", { defaultValue: "Cancel", description: bi("Label of the Cancel button for confirmations.", "确认类对话框 Cancel 按钮的文字。") }),
    closeLabel: prop("string", { defaultValue: "Close", description: bi("Label of the single Close button for notices.", "通知类对话框唯一 Close 按钮的文字。") }),
    onConfirm: callbackProp("onConfirm", "(event: { confirmed: true }) => void", { confirmed: true }, bi("The function runs when the primary button is pressed. The result has `confirmed: true`.", "按下主按钮时调用这个函数。结果里带有 `confirmed: true`。")),
    onCancel: callbackProp("onCancel", "(event: { reason: string }) => void", { reason: "cancel" }, bi("The function runs when the dialog closes. Cancel, Close, the dimmed area, or Escape all close it. `reason` is `cancel`, `close`, `scrim`, or `escape`.", "对话框关闭时调用这个函数。Cancel、Close、点击遮罩或 Escape 都会关闭。`reason` 是 `cancel`、`close`、`scrim` 或 `escape`。")),
  },
  render: function ConfirmDialogStory(args) {
    /* `open` is host state: the dialog only reports why it wants to close.
       This story host closes it on every callback and offers a button to open
       it again. The `open` Control sets the starting value. */
    const [open, setOpen] = useSynced(args.open);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>Open dialog</Button>
        <ConfirmDialog
          {...args}
          open={open}
          onConfirm={(event) => {
            setOpen(false);
            args.onConfirm?.(event);
          }}
          onCancel={(event) => {
            setOpen(false);
            args.onCancel?.(event);
          }}
        />
      </>
    );
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
