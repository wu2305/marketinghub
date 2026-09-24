import { Button } from "../../atoms.jsx";
import { Modal, modalVariants } from "../../organisms.jsx";
import { useSynced } from "../story-helpers.js";

export default {
  title: "Organisms/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Centered modal dialog: dimmed scrim, framed panel with eyebrow/title and a close button, arbitrary `children` body. Closes on scrim click and Escape, locks body scroll, focuses the panel (or the `initialFocus` ref target) on open and restores focus on close. `variant="sheet"` is the borderless radius-8 chrome with deep scrim used by the Self-Service dialogs.',
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
