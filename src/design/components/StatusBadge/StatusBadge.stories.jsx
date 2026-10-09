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
          bi("This component shows a status label. You set the size and the color separately. If `tone` is `auto`, the `status` value selects the color, even when `children` shows other text. Published, Enabled, Success, and Token valid use success. Review, Under review, Syncing, and Building use info. Pending, Pending confirmation, Watch, and Queued use warning. Paused and Danger use danger. Draft and Disabled use neutral. Other text also uses neutral. If you set `tone`, the component does not use `status` to select the color.", "这个组件显示一个状态标签。尺寸和颜色要分开设置。`tone` 为 `auto` 时，由 `status` 的值决定颜色，即使 `children` 显示的是别的文字。Published、Enabled、Success、Token valid 用 success。Review、Under review、Syncing、Building 用 info。Pending、Pending confirmation、Watch、Queued 用 warning。Paused、Danger 用 danger。Draft、Disabled 用 neutral。其他取值也用 neutral。如果你自己设置了 `tone`，组件就不再用 `status` 来选颜色。"),
      },
    },
  },
  args: { status: "Published", variant: "default", size: "sm", tone: "auto", outline: false },
  argTypes: {
    status: prop("string", {
      defaultValue: "draft",
      description: bi("Status text, and the visible label unless `children` is set. If `tone` is `auto`, this value selects the color. Unknown values use neutral.", "状态文字；没有设置 `children` 时也是可见标签。`tone` 为 `auto` 时，这个值决定颜色。未知取值用 neutral。"),
      control: "text",
    }),
    variant: enumProp(statusBadgeVariants, "default", bi("`process` is a workflow capsule without a dot. `default` is a plain label. Its width follows the text. `knowledge` has a dot and a fixed width, for the status slot on a library card. `detail` has a dot and its width follows the text, for read-only details. With `tone` set to `auto`, `knowledge` and `detail` show Enabled and Disabled in the availability colors.", "`default` 是普通标签，宽度随文字变化。`knowledge` 带圆点、宽度固定，用在库卡片的状态位置。`detail` 带圆点、宽度随文字变化，用在只读详情里。`tone` 为 `auto` 时，`knowledge` 和 `detail` 用可用性配色显示 Enabled 和 Disabled。")),
    size: enumProp(statusBadgeSizes, "sm", bi("lg makes every variant 32px high; sm keeps each variant's compact shape.", "lg 使所有变体高度为 32px；sm 保持各变体的紧凑形态。")),
    tone: enumProp(statusBadgeTones, "auto", bi("Set the color. If `tone` is `auto`, the `status` value selects the color, not the text in `children`. If you set `tone`, the component does not use `status` to select the color.", "设置颜色。`tone` 为 `auto` 时，由 `status` 的值决定颜色，而不是 `children` 里的文字。如果你自己设置了 `tone`，组件就不再用 `status` 来选颜色。")),
    outline: prop("boolean", { defaultValue: false, description: bi("Outline variant.", "描边变体。") }),
    children: prop("React.ReactNode", { description: bi("Overrides `status` as the visible label. It does not change the automatic color, which still follows `status`.", "覆盖 `status` 作为可见标签。它不会改变自动颜色，颜色仍由 `status` 决定。"), control: "text" }),
  },
  render: (args) => <StatusBadge {...args} />,
};

export const Default = {};

export const Process = { args: { variant: "process", status: "Building" }, parameters: { docs: { description: { story: bi("Workflow capsule with no availability dot.", "流程状态胶囊，内部没有可用状态圆点。") } } } };
