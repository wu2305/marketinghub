import { Toast } from "./index.jsx";
import { prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          bi("Transient status toast pinned to the lower-right viewport. Always mounted so the aria-live region exists before `message` changes; the host owns the auto-dismiss timer (the static demo hides it after ~3s).\n\n**When to use.** Brief confirmation after an action (saved, submitted, disabled, deleted). Keep one Toast mounted per page and change `message`; the host hides it after a few seconds. **Used in:** Review Center, Campaign, Personal Memory, Scenario Library and Edit, AI Interpreter and the knowledge libraries.", "固定在视口右下角的临时状态提示。始终挂载，使 aria-live 区域在 `message` 变化前就已存在；自动消失的计时器由宿主负责（静态 Demo 约 3 秒后隐藏）。\n\n**何时使用。** 操作完成后的简短确认（已保存、已提交、已停用、已删除）。每个页面保持挂载一个 Toast，只改变 `message`；由宿主在几秒后隐藏。**使用位置：** Review Center、Campaign、Personal Memory、Scenario Library 与 Edit、AI Interpreter 以及各知识库。"),
      },
    },
  },
  args: { message: "Campaign task added to the review queue.", open: true },
  argTypes: {
    message: prop("string", { defaultValue: "", description: bi("Status text announced by the live region.", "由 live region 播报的状态文字。") }),
    open: prop("boolean", { defaultValue: false, description: bi("Visibility — false renders `hidden`.", "可见性：false 时渲染 `hidden`。"), control: "boolean" }),
  },
  render: (args) => <div style={{ height: 120 }}><Toast {...args} /></div>,
};

export const Default = {};
