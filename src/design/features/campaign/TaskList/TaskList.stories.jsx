import { TaskList } from "./index.jsx";
import { CAMPAIGN } from "../../../content.js";

export default {
  title: "Organisms/Task list",
  component: TaskList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Task queue rows with an outline StatusBadge.",
      },
    },
  },
  render: () => <TaskList items={CAMPAIGN.taskQueue} />,
};

export const Default = {};
