import React from "react";
import { SKILL_LIBRARY } from "../../../demo/content/skill-library.js";
import { scenarioEditPreviewFor } from "../../../demo/scenario-edit-demo.js";
import { callbackProp } from "../../../lib/story-helpers.js";
import { SkillInlineForm } from "./index.jsx";

export default { title: "Features/ScenarioLibrary/SkillInlineForm", component: SkillInlineForm, tags: ["autodocs"], parameters: { layout: "padded", docs: { description: { component: "P15 inline Scenario Configuration form. Inputs write back through named callbacks; the source novalidate submit is retained." } } } };
export const Default = {
  args: { labels: SKILL_LIBRARY.labels, values: { name: "", purpose: "", scope: "", owner: "", triggerWhen: "", input: "", logic: "", output: "", boundary: "", question: "" }, preview: null },
  argTypes: {
    values: { control: "object", description: "Controlled form values; scope choices come from labels.scopeOptions." },
    preview: { control: "text", description: "Null hides the example question and output; text shows them." },
    onChange: callbackProp("onChange", "({field:string,value:string}) => void", { field: "scope", value: "Global" }),
    onSubmit: callbackProp("onSubmit", "({values:object}) => void", { values: { name: "" } }),
    onCancel: callbackProp("onCancel", "({reason:'cancel'}) => void", { reason: "cancel" }),
    onAutoFill: callbackProp("onAutoFill", "({field:'triggerWhen'|'input'|'logic'|'output'|'boundary'}) => void", { field: "logic" }),
    onRunPreview: callbackProp("onRunPreview", "({question:string}) => void", { question: "Explain the largest channel movement" }),
    onSaveDraft: callbackProp("onSaveDraft", "({values:object}) => void", { values: { name: "New scenario" } }),
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
