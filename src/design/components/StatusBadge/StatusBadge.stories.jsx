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
    variant: enumProp(statusBadgeVariants, "default", bi("`default` is a plain label. Its width follows the text. `knowledge` has a dot and a fixed width, for the status slot on a library card. `detail` has a dot and its width follows the text, for read-only details. With `tone` set to `auto`, `knowledge` and `detail` show Enabled and Disabled in the availability colors.", "`default` 是普通标签，宽度随文字变化。`knowledge` 带圆点、宽度固定，用在库卡片的状态位置。`detail` 带圆点、宽度随文字变化，用在只读详情里。`tone` 为 `auto` 时，`knowledge` 和 `detail` 用可用性配色显示 Enabled 和 Disabled。")),
    size: enumProp(statusBadgeSizes, "sm", bi("lg makes every variant 32px high; sm keeps each variant's compact shape.", "lg 使所有变体高度为 32px；sm 保持各变体的紧凑形态。")),
    tone: enumProp(statusBadgeTones, "auto", bi("Set the color. If `tone` is `auto`, the label text selects the color. If you set `tone`, the component does not use the text to select the color.", "设置颜色。`tone` 为 `auto` 时，标签文字决定颜色。如果你自己设置了 `tone`，组件就不再用文字来选颜色。")),
    outline: prop("boolean", { defaultValue: false, description: bi("Outline variant.", "描边变体。") }),
    children: prop("React.ReactNode", { description: bi("Overrides `status` as the visible label.", "覆盖 `status` 作为可见标签。"), control: "text" }),
  },
  render: (args) => <StatusBadge {...args} />,
};

export const Default = {};
