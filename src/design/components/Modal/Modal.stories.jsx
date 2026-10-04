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
          bi("This component is a centered dialog. It has a dimmed area, a title row, a Close button, and a body. The body is `children`. A click on the dimmed area closes the dialog. Escape also closes it. While the dialog is open, the page does not scroll. Focus moves to the panel, or to the `initialFocus` target. When the dialog closes, focus returns. Set `variant` to `sheet` for the borderless panel that Self-Service Center uses. Set `variant` to `drawer` for the full-height panel on the right.", "这个组件是居中对话框。它有半透明遮罩、标题行、Close 按钮和正文。正文是 `children`。点击遮罩会关闭对话框。Escape 也会关闭。对话框打开时，页面不能滚动。焦点移到面板，或移到 `initialFocus` 指定的目标。对话框关闭后，焦点回到原处。`variant` 设为 `sheet` 时，是 Self-Service Center 使用的无边框面板。`variant` 设为 `drawer` 时，是右侧全高面板。"),
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
