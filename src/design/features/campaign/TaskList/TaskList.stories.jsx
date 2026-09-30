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
        component: bi("Task queue rows with an outline StatusBadge.", "带描边 StatusBadge 的任务队列行。"),
      },
    },
  },
  render: () => <TaskList items={CAMPAIGN.taskQueue} />,
};

export const Default = {};
