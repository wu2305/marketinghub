import React from "react";
import { SKILL_LIBRARY } from "../../../demo/content/skill-library.js";
import { callbackProp } from "../../../lib/story-helpers.js";
import { SkillInlineForm, skillScopes } from "./index.jsx";

export default { title: "Features/ScenarioLibrary/SkillInlineForm", component: SkillInlineForm, tags: ["autodocs"], parameters: { layout: "padded", docs: { description: { component: "P15 inline Scenario Configuration form. Inputs write back through named callbacks; the source novalidate submit is retained." } } } };
export const Default = {
  args: { labels: SKILL_LIBRARY.labels, values: { name: "", purpose: "", scope: "", owner: "", triggerWhen: "", input: "", logic: "", output: "", boundary: "" } },
  argTypes: {
    values: { control: "object", description: `Controlled form values; scope choices: ${skillScopes.join(", ")}.` },
    onChange: callbackProp("onChange", "({key:string,value:string}) => void", { key: "scope", value: "Global" }),
    onSubmit: callbackProp("onSubmit", "({values:object}) => void", { values: { name: "" } }),
    onCancel: callbackProp("onCancel", "({reason:'cancel'}) => void", { reason: "cancel" }),
    onClick: callbackProp("onClick", "({action:'auto-fill'|'run-preview'|'save-draft',field?:string}) => void", { action: "auto-fill", field: "logic" }),
  },
  render: function SkillInlineFormStory(args) {
    const [values, setValues] = React.useState(args.values);
    React.useEffect(() => setValues(args.values), [args.values]);
    return <SkillInlineForm {...args} values={values} onChange={(event) => { setValues((current) => ({ ...current, [event.key]: event.value })); args.onChange?.(event); }} />;
  },
};
