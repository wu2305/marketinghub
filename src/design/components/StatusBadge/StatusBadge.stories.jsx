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
          "Status pill with independent size and semantic tone controls. Auto tone recognizes exact known states and preserves knowledge/detail availability colors; unknown labels remain neutral. Explicit tone overrides the availability palette.",
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
    size: enumProp(statusBadgeSizes, "sm", "lg makes every variant 32px high; sm keeps each variant's compact shape."),
    tone: enumProp(statusBadgeTones, "auto", "Explicit semantic tone across all variants, or exact known-state mapping with knowledge/detail availability colors in auto mode."),
    outline: prop("boolean", { defaultValue: false, description: "Outline variant." }),
    children: prop("React.ReactNode", { description: "Overrides `status` as the visible label.", control: "text" }),
  },
  render: (args) => <StatusBadge {...args} />,
};

export const Default = {};
