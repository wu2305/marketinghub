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
          bi("This component is a short status message. It sits in the lower-right corner of the viewport. Keep it mounted so the aria-live region exists before `message` changes. The host owns the timer that hides it. The static Demo hides it after about 3 seconds.\n\n**When to use.** Use this component for a brief confirmation after an action, such as saved, submitted, disabled, or deleted. Keep one Toast mounted per page and change `message`. The host hides it after a few seconds. **Used in:** Campaign and AI Interpreter. **Retired pages (source kept, not in Storybook):** Review Center, Personal Memory, Skill Library, and Skill Edit.", "这个组件是短暂的状态提示。它固定在视口右下角。保持挂载，让 aria-live 区域在 `message` 变化前就已经存在。自动隐藏的计时器由宿主负责。静态 Demo 大约 3 秒后隐藏。\n\n**何时使用。** 操作完成后的简短确认，例如已保存、已提交、已停用、已删除。每个页面保持挂载一个 Toast，只改变 `message`。由宿主在几秒后隐藏。**使用位置：** Campaign 与 AI Interpreter。**已撤下的页面（源码保留，不在 Storybook 中）：**Review Center、Personal Memory、Skill Library 与 Skill Edit。"),
      },
    },
  },
  args: { message: "Campaign task added to the review queue.", open: true },
  argTypes: {
    message: prop("string", { defaultValue: "", description: bi("Status text announced by the live region.", "由 live region 播报的状态文字。") }),
    open: prop("boolean", { defaultValue: false, description: bi("Visibility. `false` sets `hidden`.", "可见性。`false` 时设置 `hidden`。"), control: "boolean" }),
  },
  render: (args) => <div style={{ height: 120 }}><Toast {...args} /></div>,
};

export const Default = {};
