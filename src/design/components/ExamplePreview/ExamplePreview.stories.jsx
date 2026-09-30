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
  parameters: { layout: "padded", docs: { description: { component: bi("A scenario's example question and simulated output. `run` is the editable form block (Run Preview fills the output); `view` is the read-only disclosure on the detail surfaces. Null output hides the question and result.\n\n**When to use.** Showing a scenario's example question and the simulated answer, either editable with a Run Preview button (`run`) or as a read-only disclosure (`view`). **Used in:** Skill Detail, Scenario Detail and SkillForm (Skill Library and Skill Edit).", "某个场景的示例问题与模拟输出。`run` 是可编辑的表单区块（Run Preview 会填充输出）；`view` 是详情页上只读的展开区。输出为 null 时隐藏问题和结果。\n\n**何时使用。** 展示某个场景的示例问题与模拟回答：可编辑并带 Run Preview 按钮（`run`），或作为只读展开区（`view`）。**使用位置：** Skill Detail、Scenario Detail 与 SkillForm（Skill Library 和 Skill Edit）。") } } },
  argTypes: {
    variant: enumProp(examplePreviewVariants, "run", bi("`run` edits and runs; `view` shows or hides a read-only example.", "`run` 用于编辑并运行；`view` 用于显示或隐藏只读示例。")),
    output: prop("string|null", { defaultValue: null, description: bi("Null hides the question and output; text shows them.", "为 null 时隐藏问题和输出；有文字则显示。"), control: "text" }),
    onRun: callbackProp("onRun", "({question:string}) => void", { question: defaults.question }, bi("`run`: the action pressed.", "`run`：被按下的操作。")),
    onQuestionChange: callbackProp("onQuestionChange", "({value:string}) => void", { value: "Compare cities" }, bi("`run` only.", "仅 `run` 使用。")),
    onToggle: callbackProp("onToggle", "({open:boolean}) => void", { open: true }, bi("`view`: requested disclosure state.", "`view`：请求的展开状态。")),
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
