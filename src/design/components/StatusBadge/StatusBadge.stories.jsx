import { StatusBadge } from "./index.jsx";
import { prop } from "../../lib/story-helpers.js";

export default {
  title: "Atoms/Status badge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Status pill. `status` is a free label — tone is derived by substring/token matching: ' +
          'contains "publish" or equals success/token-valid/enabled → success; contains "review" ' +
          "or equals syncing/building → review; contains \"pending\" or equals watch/queued → " +
          'pending; contains "pause" or equals danger/disabled → paused; else draft. Matching is ' +
          'substring-based, so e.g. "Unpublished" still maps to success.',
      },
    },
  },
  args: { status: "Published", children: "Published", outline: false },
  argTypes: {
    status: prop("string", {
      defaultValue: "draft",
      description:
        "Free-form label; the tone is derived from it (contains publish → success, review → review, pending → pending, pause → paused, else draft).",
      control: "text",
    }),
    outline: prop("boolean", { defaultValue: false, description: "Outline variant." }),
    children: prop("React.ReactNode", { description: "Overrides `status` as the visible label.", control: "text" }),
  },
  render: (args) => <StatusBadge {...args} />,
};

export const Default = {};
