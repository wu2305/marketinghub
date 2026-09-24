import { Suggestion } from "./index.jsx";
import { callbackProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Suggestion",
  component: Suggestion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Clickable suggested prompt chip.",
      },
    },
  },
  args: { children: "What's the ROI trend across my active campaigns?" },
  argTypes: {
    children: prop("React.ReactNode", { description: "Suggestion text — echoed back as `label` on select.", control: "text" }),
    onSelect: callbackProp(
      "onSelect",
      "(event: { label: React.ReactNode }) => void",
      { label: "What's the ROI trend across my active campaigns?" },
      "Fired on click; `label` is the children content.",
    ),
  },
  render: (args) => <Suggestion {...args} />,
};

export const Default = {};
