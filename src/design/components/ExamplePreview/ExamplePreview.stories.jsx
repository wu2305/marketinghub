import React from "react";
import { SCENARIO_EDIT } from "../../demo/content/scenario-edit.js";
import { scenarioEditPreviewFor } from "../../demo/scenario-edit-demo.js";
import { callbackProp } from "../../lib/story-helpers.js";
import { ExamplePreview } from "./index.jsx";

const { labels, defaults } = SCENARIO_EDIT;

export default { title: "Molecules/ExamplePreview", component: ExamplePreview, tags: ["autodocs"], parameters: { layout: "padded", docs: { description: { component: "Runnable example output shared by both scenario forms. Null output hides the question and result; running fills it." } } } };
export const Default = {
  args: { title: labels.preview, runLabel: labels.runPreview, questionLabel: labels.question, questionPlaceholder: labels.questionPlaceholder, question: defaults.question, output: null },
  argTypes: {
    output: { control: "text", description: "Null (default) hides the question and output; text shows them." },
    onRun: callbackProp("onRun", "({question:string}) => void", { question: defaults.question }),
    onQuestionChange: callbackProp("onQuestionChange", "({value:string}) => void", { value: "Compare cities" }),
  },
  render: function ExamplePreviewStory(args) {
    const [question, setQuestion] = React.useState(args.question);
    const [output, setOutput] = React.useState(args.output);
    React.useEffect(() => { setQuestion(args.question); setOutput(args.output); }, [args.question, args.output]);
    return <ExamplePreview {...args} question={question} output={output}
      onRun={(event) => { setOutput(scenarioEditPreviewFor({ ...defaults, question: event.question }, labels)); args.onRun?.(event); }}
      onQuestionChange={(event) => { setQuestion(event.value); args.onQuestionChange?.(event); }} />;
  },
};
