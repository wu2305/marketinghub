import React from "react";
import { SCENARIO_EDIT } from "../../demo/content/scenario-edit.js";
import { SKILL_LIBRARY } from "../../demo/content/skill-library.js";
import { scenarioEditPreviewFor } from "../../demo/scenario-edit-demo.js";
import { callbackProp, enumProp, prop } from "../../lib/story-helpers.js";
import { ExamplePreview, examplePreviewVariants } from "./index.jsx";

const { labels, defaults } = SCENARIO_EDIT;
const detailLabels = SKILL_LIBRARY.labels;
const record = SKILL_LIBRARY.records[0];

export default {
  title: "Molecules/ExamplePreview",
  component: ExamplePreview,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { description: { component: "A scenario's example question and simulated output. `run` is the editable form block (Run Preview fills the output); `view` is the read-only disclosure on the detail surfaces. Null output hides the question and result." } } },
  argTypes: {
    variant: enumProp(examplePreviewVariants, "run", "`run` edits and runs; `view` shows or hides a read-only example."),
    output: prop("string|null", { defaultValue: null, description: "Null hides the question and output; text shows them.", control: "text" }),
    onRun: callbackProp("onRun", "({question:string}) => void", { question: defaults.question }, "`run`: the action pressed."),
    onQuestionChange: callbackProp("onQuestionChange", "({value:string}) => void", { value: "Compare cities" }, "`run` only."),
    onToggle: callbackProp("onToggle", "({open:boolean}) => void", { open: true }, "`view`: requested disclosure state."),
  },
};
export const Default = {
  args: { variant: "run", title: labels.preview, actionLabel: labels.runPreview, questionLabel: labels.question, questionPlaceholder: labels.questionPlaceholder, question: defaults.question, output: null },
  render: function ExamplePreviewStory(args) {
    const [question, setQuestion] = React.useState(args.question);
    const [output, setOutput] = React.useState(args.output);
    React.useEffect(() => { setQuestion(args.question); setOutput(args.output); }, [args.question, args.output]);
    return <ExamplePreview {...args} question={question} output={output}
      onRun={(event) => { setOutput(scenarioEditPreviewFor({ ...defaults, question: event.question }, labels)); args.onRun?.(event); }}
      onQuestionChange={(event) => { setQuestion(event.value); args.onQuestionChange?.(event); }} />;
  },
};
export const View = {
  args: { variant: "view", title: detailLabels.preview, questionLabel: detailLabels.question, question: record.previewQuestion, output: null },
  render: function ExamplePreviewViewStory(args) {
    const [open, setOpen] = React.useState(false);
    return <div style={{ maxWidth: 650 }}><ExamplePreview {...args} actionLabel={open ? detailLabels.hidePreview : detailLabels.showPreview} output={open ? record.previewOutput : null} onToggle={(event) => { setOpen(event.open); args.onToggle?.(event); }} /></div>;
  },
};
