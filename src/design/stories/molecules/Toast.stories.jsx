import { Toast } from "../../molecules.jsx";
import { prop } from "../story-helpers.js";

export default {
  title: "Molecules/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Transient status toast pinned to the lower-right viewport. Always mounted so the aria-live region exists before `message` changes; the host owns the auto-dismiss timer (the static demo hides it after ~3s).",
      },
    },
  },
  args: { message: "Campaign task added to the review queue.", open: true },
  argTypes: {
    message: prop("string", { defaultValue: "", description: "Status text announced by the live region." }),
    open: prop("boolean", { defaultValue: false, description: "Visibility — false renders `hidden`.", control: "boolean" }),
  },
  render: (args) => (
    <>
      <p>Toast is pinned to the lower-right viewport regardless of this text.</p>
      <Toast {...args} />
    </>
  ),
};

export const Default = {};
