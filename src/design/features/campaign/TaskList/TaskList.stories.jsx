import { TaskList } from "./index.jsx";
import { CAMPAIGN } from "../../../content.js";
import { bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Campaign/Task list",
  component: TaskList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: bi("This component is a task queue on Campaign. Each row shows an outline status badge, a title, and a detail line.", "这是 Campaign 上的任务队列。每一行显示描边状态标签、标题和一行说明。"),
      },
    },
  },
  render: () => <TaskList items={CAMPAIGN.taskQueue} />,
};

export const Default = {};
