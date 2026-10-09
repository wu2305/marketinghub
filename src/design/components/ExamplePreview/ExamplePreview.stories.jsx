import React from "react";
import { SCENARIO_EDIT } from "../../demo/content/scenario-edit.js";
import { SKILL_LIBRARY } from "../../demo/content/skill-library.js";
import { scenarioEditPreviewFor } from "../../demo/scenario-edit-demo.js";
import { callbackProp, enumProp, prop, bi } from "../../lib/story-helpers.js";
import { ExamplePreview, examplePreviewVariants } from "./index.jsx";

const { labels, defaults } = SCENARIO_EDIT;
const detailLabels = SKILL_LIBRARY.labels;
const record = SKILL_LIBRARY.records[0];

export default {
  title: "Molecules/ExamplePreview",
  component: ExamplePreview,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { description: { component: bi("This component shows an example question and a simulated answer. `run` is an editable block. The Run Preview action fills the output. `view` is a read-only block that the user can show or hide. If `output` is null, the question and the result are hidden.\n\n**When to use.** Use this component to show an example question and the simulated answer. Use `run` when the user can edit the question and press Run Preview. Use `view` when the example is read-only. **Used in:** no active page. **Retired pages (source kept, not in Storybook):** Skill Library, Scenario Detail, and Skill Edit.", "这个组件显示示例问题和模拟回答。`run` 是可编辑的区块。Run Preview 会填充输出。`view` 是只读区块，用户可以显示或隐藏。`output` 为 null 时，问题和结果都隐藏。\n\n**何时使用。** 用来展示示例问题和模拟回答。用户可以编辑问题并按下 Run Preview 时，用 `run`。示例只读时，用 `view`。**使用位置：** 目前没有在用的页面。**已撤下的页面（源码保留，不在 Storybook 中）：**Skill Library、Scenario Detail 与 Skill Edit。") } } },
  argTypes: {
    variant: enumProp(examplePreviewVariants, "run", bi("`run` lets the user edit the question and run the preview. `view` shows or hides a read-only example.", "`run` 让用户编辑问题并运行预览。`view` 用来显示或隐藏只读示例。")),
    output: prop("string|null", { defaultValue: null, description: bi("Set `null` to hide the question and the output. Set text to show them.", "设为 `null` 时隐藏问题和输出。设为文字则显示。"), control: "text" }),
    onRun: callbackProp("onRun", "({question:string}) => void", { question: defaults.question }, bi("The function runs when the user presses the action. Use this with `run`. The result has `question`.", "用户按下操作时会调用这个函数。与 `run` 一起使用。结果里带有 `question`。")),
    onQuestionChange: callbackProp("onQuestionChange", "({value:string}) => void", { value: "Compare cities" }, bi("The function runs at each change of the question. Use this with `run`. The result has `value`.", "问题每次变化都会调用这个函数。与 `run` 一起使用。结果里带有 `value`。")),
    onToggle: callbackProp("onToggle", "({open:boolean}) => void", { open: true }, bi("The function runs when the user shows or hides the example. Use this with `view`. The result has `open`. `open` is the requested next state.", "用户显示或隐藏示例时会调用这个函数。与 `view` 一起使用。结果里带有 `open`。`open` 是请求的下一个状态。")),
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
