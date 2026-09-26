import React from "react";
import { ScenarioPreview } from "./index.jsx";
import { SKILL_LIBRARY } from "../../demo/content/skill-library.js";
import { callbackProp, prop } from "../../lib/story-helpers.js";

const labels = SKILL_LIBRARY.labels;
const record = SKILL_LIBRARY.records[0];

export default {
  title: "Organisms/Scenario preview",
  component: ScenarioPreview,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Controlled example question and output disclosure used by both scenario detail surfaces." } } },
  args: { title: labels.preview, showLabel: labels.showPreview, hideLabel: labels.hidePreview, questionLabel: labels.exampleQuestion, question: record.previewQuestion, output: record.previewOutput, open: false },
  argTypes: {
    title: prop("string", { description: "Section heading." }),
    showLabel: prop("string", { description: "Collapsed control copy." }),
    hideLabel: prop("string", { description: "Expanded control copy." }),
    questionLabel: prop("string", { description: "Example question label." }),
    question: prop("string", { description: "Example question." }),
    output: prop("string", { description: "Example output." }),
    open: prop("boolean", { defaultValue: false, description: "Expanded state." }),
    onChange: callbackProp("onChange", "({open:boolean}) => void", { open: true }, "Requested disclosure state."),
  },
  render: function PreviewStory(args) {
    const [open, setOpen] = React.useState(args.open);
    React.useEffect(() => setOpen(args.open), [args.open]);
    return <div style={{ maxWidth: 650, padding: 16 }}><ScenarioPreview {...args} open={open} onChange={(event) => { setOpen(event.open); args.onChange?.(event); }} /></div>;
  },
};

export const Default = {};
