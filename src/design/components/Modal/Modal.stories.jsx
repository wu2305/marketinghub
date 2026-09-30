import { Button } from "../Button/index.jsx";
import { Modal, modalVariants } from "./index.jsx";
import { useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("Centered modal dialog: dimmed scrim, framed panel with eyebrow/title and a close button, arbitrary `children` body. Closes on scrim click and Escape, locks body scroll, focuses the panel (or the `initialFocus` ref target) on open and restores focus on close. `variant=\"sheet\"` is the borderless radius-8 chrome with deep scrim used by the Self-Service dialogs.", "居中的模态对话框：半透明遮罩、带眉标/标题和关闭按钮的边框面板，以及任意 `children` 正文。点击遮罩或按 Escape 关闭，打开时锁定页面滚动并将焦点移到面板（或 `initialFocus` 指定的 ref），关闭时恢复焦点。`variant=\"sheet\"` 是 Self-Service 各对话框使用的无边框、8px 圆角、深色遮罩样式。"),
      },
    },
  },
  args: {
    open: false,
    variant: "modal",
    eyebrow: "Campaign execution",
    title: "Create Campaign Task",
    closeLabel: "Close",
  },
  argTypes: {
    open: { control: "boolean" },
    variant: { control: "inline-radio", options: modalVariants },
    onClose: { action: "onClose" },
  },
  render: function ModalStory(args) {
    const [open, setOpen] = useSynced(args.open);
    return (
      <>
        <p>
          <Button variant="primary" onClick={() => setOpen(true)}>
            Open modal
          </Button>
        </p>
        <Modal
          {...args}
          open={open}
          onClose={(event) => {
            setOpen(false);
            args.onClose?.(event);
          }}
        >
          <p>Modal body content — forms, previews, and footers render here.</p>
        </Modal>
      </>
    );
  },
};

export const Default = {};
