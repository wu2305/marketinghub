import { StatusBadge, statusBadgeSizes, statusBadgeTones, statusBadgeVariants } from "./index.jsx";
import { enumProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Atoms/Status badge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Status pill with independent size and tone controls. Auto tone recognizes exact known states; unknown labels remain neutral. Use an explicit tone when a state needs a different emphasis.",
      },
    },
  },
  args: { status: "Published", variant: "default", size: "sm", tone: "auto", outline: false },
  argTypes: {
    status: prop("string", {
      defaultValue: "draft",
      description: "Visible label; auto tone recognizes exact known states and keeps unknown labels neutral.",
      control: "text",
    }),
    variant: enumProp(statusBadgeVariants, "default", "General status, fixed-slot knowledge status, or naturally sized detail status."),
    size: enumProp(statusBadgeSizes, "sm", "Plain status pill density; knowledge/detail variants keep their own shape."),
    tone: enumProp(statusBadgeTones, "auto", "Explicit semantic tone, or exact known-state mapping in auto mode."),
    outline: prop("boolean", { defaultValue: false, description: "Outline variant." }),
    children: prop("React.ReactNode", { description: "Overrides `status` as the visible label.", control: "text" }),
  },
  render: (args) => <StatusBadge {...args} />,
};

export const Default = {};
