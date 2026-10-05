import React from "react";
import { SKILL_LIBRARY } from "../../../demo/content/skill-library.js";
import { scenarioEditPreviewFor } from "../../../demo/scenario-edit-demo.js";
import { callbackProp, bi } from "../../../lib/story-helpers.js";
import { SkillInlineForm } from "./index.jsx";

export default { title: "Features/ScenarioLibrary/SkillInlineForm", component: SkillInlineForm, tags: ["autodocs"], parameters: { layout: "padded", docs: { description: { component: bi("This component is the inline Scenario Configuration form on Skill Library. It uses the shared `SkillForm` frame. The user can edit name, purpose, scope, owner, the five structure fields, and the example question. Each structure field has AI Auto-fill. The form element has `noValidate`. The Demo buttons are Save Draft and Submit for Review.", "这是 Skill Library 页内的 Scenario Configuration 表单。它使用共用的 `SkillForm` 框架。用户可以编辑名称、用途、范围、负责人、五个结构字段和示例问题。每个结构字段都有 AI Auto-fill。表单元素带有 `noValidate`。Demo 按钮是 Save Draft 和 Submit for Review。") } } } };
export const Default = {
  args: { labels: SKILL_LIBRARY.labels, values: { name: "", purpose: "", scope: "", owner: "", triggerWhen: "", input: "", logic: "", output: "", boundary: "", question: "" }, preview: null },
  argTypes: {
    values: { control: "object", description: bi("Controlled form values. Scope choices come from `labels.scopeOptions`.", "受控的表单值。范围选项来自 `labels.scopeOptions`。") },
    preview: { control: "text", description: bi("Set a string to show the example question and output. Set `null` to hide them.", "设为字符串会显示示例问题和输出。设为 `null` 则隐藏它们。") },
    onChange: callbackProp("onChange", "({field:string,value:string}) => void", { field: "scope", value: "Global" }, bi("The function runs at each field change. The result has `field` and `value`.", "每个字段变化时都会调用这个函数。结果里带有 `field` 和 `value`。")),
    onSubmit: callbackProp("onSubmit", "({values:object}) => void", { values: { name: "" } }, bi("The function runs when the user clicks Submit for Review. The result has `values`. The form does not check empty fields.", "用户点击 Submit for Review 时会调用这个函数。结果里带有 `values`。表单不检查空字段。")),
    onCancel: callbackProp("onCancel", "({reason:'cancel'}) => void", { reason: "cancel" }, bi("The function runs when the user clicks Cancel. The result has `reason` `cancel`.", "用户点击 Cancel 时会调用这个函数。结果里的 `reason` 是 `cancel`。")),
    onAutoFill: callbackProp("onAutoFill", "({field:'triggerWhen'|'input'|'logic'|'output'|'boundary'}) => void", { field: "logic" }, bi("The function runs when the user clicks AI Auto-fill. The result has `field`. The host fills that field.", "用户点击 AI Auto-fill 时会调用这个函数。结果里带有 `field`。由宿主填充该字段。")),
    onRunPreview: callbackProp("onRunPreview", "({question:string}) => void", { question: "Explain the largest channel movement" }, bi("The function runs when the user clicks Run Preview. The result has `question`.", "用户点击 Run Preview 时会调用这个函数。结果里带有 `question`。")),
    onSaveDraft: callbackProp("onSaveDraft", "({values:object}) => void", { values: { name: "New scenario" } }, bi("The function runs when the user clicks Save Draft. The result has `values`.", "用户点击 Save Draft 时会调用这个函数。结果里带有 `values`。")),
  },
  render: function SkillInlineFormStory(args) {
    const [values, setValues] = React.useState(args.values);
    const [preview, setPreview] = React.useState(args.preview);
    React.useEffect(() => setValues(args.values), [args.values]);
    React.useEffect(() => setPreview(args.preview), [args.preview]);
    return <SkillInlineForm {...args} values={values} preview={preview}
      onChange={(event) => { setValues((current) => ({ ...current, [event.field]: event.value })); args.onChange?.(event); }}
      onAutoFill={(event) => { setValues((current) => ({ ...current, [event.field]: args.labels.autoFillText[event.field] })); args.onAutoFill?.(event); }}
      onRunPreview={(event) => { setPreview(scenarioEditPreviewFor({ ...values, question: event.question }, args.labels)); args.onRunPreview?.(event); }} />;
  },
};
