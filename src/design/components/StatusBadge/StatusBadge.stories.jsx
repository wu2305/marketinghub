import { StatusBadge, statusBadgeSizes, statusBadgeTones, statusBadgeVariants } from "./index.jsx";
import { enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Atoms/Status badge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("Status pill with independent size and semantic tone controls. Auto tone recognizes exact known states and preserves knowledge/detail availability colors; unknown labels remain neutral. Explicit tone overrides the availability palette.", "状态胶囊，大小与语义色调独立控制。auto 色调会识别确切的已知状态并保留知识/详情可用性配色；未知标签保持中性。显式指定 tone 会覆盖可用性配色。"),
      },
    },
  },
  args: { status: "Published", variant: "default", size: "sm", tone: "auto", outline: false },
  argTypes: {
    status: prop("string", {
      defaultValue: "draft",
      description: bi("Visible label; auto tone recognizes exact known states and keeps unknown labels neutral.", "可见标签；auto 色调会识别确切的已知状态，未知标签保持中性。"),
      control: "text",
    }),
    variant: enumProp(statusBadgeVariants, "default", bi("General status, fixed-slot knowledge status, or naturally sized detail status.", "通用状态、固定宽度的知识状态，或按内容自然宽度的详情状态。")),
    size: enumProp(statusBadgeSizes, "sm", bi("lg makes every variant 32px high; sm keeps each variant's compact shape.", "lg 使所有变体高度为 32px；sm 保持各变体的紧凑形态。")),
    tone: enumProp(statusBadgeTones, "auto", bi("Explicit semantic tone across all variants, or exact known-state mapping with knowledge/detail availability colors in auto mode.", "对所有变体显式指定语义色调；auto 模式下则按确切已知状态映射到知识/详情可用性配色。")),
    outline: prop("boolean", { defaultValue: false, description: bi("Outline variant.", "描边变体。") }),
    children: prop("React.ReactNode", { description: bi("Overrides `status` as the visible label.", "覆盖 `status` 作为可见标签。"), control: "text" }),
  },
  render: (args) => <StatusBadge {...args} />,
};

export const Default = {};
