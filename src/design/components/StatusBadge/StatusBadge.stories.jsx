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
          bi("This component shows a status label. You set the size and the color separately. If `tone` is `auto`, the label text selects the color. Published, Enabled, Success, and Token valid use success. Under review, Syncing, and Building use info. Pending, Pending confirmation, Watch, and Queued use warning. Paused and Danger use danger. Draft and Disabled use neutral. Other text also uses neutral. If you set `tone`, the component does not use the text to select the color.", "这个组件显示一个状态标签。尺寸和颜色要分开设置。`tone` 为 `auto` 时，标签文字决定颜色。Published、Enabled、Success、Token valid 用 success。Under review、Syncing、Building 用 info。Pending、Pending confirmation、Watch、Queued 用 warning。Paused、Danger 用 danger。Draft、Disabled 用 neutral。其他文字也用 neutral。如果你自己设置了 `tone`，组件就不再用文字来选颜色。"),
      },
    },
  },
  args: { status: "Published", variant: "default", size: "sm", tone: "auto", outline: false },
  argTypes: {
    status: prop("string", {
      defaultValue: "draft",
      description: bi("Visible label. If `tone` is `auto`, this text selects the color. Unknown text uses neutral.", "可见标签。`tone` 为 `auto` 时，这段文字决定颜色。未知文字用 neutral。"),
      control: "text",
    }),
    variant: enumProp(statusBadgeVariants, "default", bi("The default variant changes width with the text. The knowledge variant keeps a fixed position on the card. The detail variant changes width with the text.", "default 的宽度随文字变化。knowledge 在卡片上占一个固定位置。detail 的宽度随文字变化。")),
    size: enumProp(statusBadgeSizes, "sm", bi("lg makes every variant 32px high; sm keeps each variant's compact shape.", "lg 使所有变体高度为 32px；sm 保持各变体的紧凑形态。")),
    tone: enumProp(statusBadgeTones, "auto", bi("Set the color. If `tone` is `auto`, the label text selects the color. If you set `tone`, the component does not use the text to select the color.", "设置颜色。`tone` 为 `auto` 时，标签文字决定颜色。如果你自己设置了 `tone`，组件就不再用文字来选颜色。")),
    outline: prop("boolean", { defaultValue: false, description: bi("Outline variant.", "描边变体。") }),
    children: prop("React.ReactNode", { description: bi("Overrides `status` as the visible label.", "覆盖 `status` 作为可见标签。"), control: "text" }),
  },
  render: (args) => <StatusBadge {...args} />,
};

export const Default = {};
