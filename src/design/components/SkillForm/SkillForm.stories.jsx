import { SCENARIO_EDIT } from "../../demo/content/scenario-edit.js";
import { callbackProp, prop, useSynced } from "../../lib/story-helpers.js";
import { SkillForm } from "./index.jsx";
import { SkillFormCard, SkillFormFillCard, skillFormTones } from "./cards.jsx";

const { labels, scopes, defaults } = SCENARIO_EDIT;

export default {
  title: "Organisms/SkillForm",
  component: SkillForm,
  tags: ["autodocs"],
  subcomponents: { SkillFormCard, SkillFormFillCard },
  parameters: { layout: "padded", docs: { description: { component: "Scenario Configuration form frame shared by the Skill Library inline form and the Skill Edit page: basics, structure cards supplied as children, example preview and footer. Cards are `SkillFormCard` (own controls) or `SkillFormFillCard` (textarea with AI Auto-fill); tones are " + skillFormTones.join(", ") + "." } } },
};

export const Default = {
  args: { labels, values: { name: defaults.name, purpose: defaults.purpose, scope: defaults.scope, owner: defaults.owner, question: defaults.question }, scopes, errors: {}, preview: null },
  argTypes: {
    labels: prop("object", { description: "Form copy (see the props table).", control: "object" }),
    values: prop("object", { description: "Controlled name, purpose, scope, owner and example question.", control: "object" }),
    scopes: prop("Array<string|{value,label}>", { defaultValue: [], description: "Scope choices.", control: "object" }),
    errors: prop("Record<string,boolean>", { defaultValue: {}, description: "Invalid basics show the required message and take focus.", control: "object" }),
    preview: prop("string|null", { defaultValue: null, description: "Null hides the example question and output.", control: "text" }),
    cancelHref: prop("string", { description: "Renders Cancel as a link instead of a button.", control: "text" }),
    onChange: callbackProp("onChange", "({field:string,value:string}) => void", { field: "name", value: "City Comparison Analysis" }),
    onRunPreview: callbackProp("onRunPreview", "({question:string}) => void", { question: defaults.question }),
    onSaveDraft: callbackProp("onSaveDraft", "({values:object}) => void", { values: defaults }),
    onSubmit: callbackProp("onSubmit", "({values:object}) => void", { values: defaults }),
    onCancel: callbackProp("onCancel", "({reason:'cancel',href?:string}) => void", { reason: "cancel" }),
  },
  render: function SkillFormStory(args) {
    const [values, setValues] = useSynced(args.values);
    return <SkillForm {...args} values={values} onChange={(event) => { setValues((current) => ({ ...current, [event.field]: event.value })); args.onChange?.(event); }}>
      <SkillFormCard tone="info" icon="file" label={labels.report}><span>Any controls go here.</span></SkillFormCard>
      <SkillFormFillCard tone="success" icon="bulb" label={labels.logic} value={values.logic || ""} placeholder={labels.logicPlaceholder} autoFillLabel={labels.autoFill} onChange={({ value }) => setValues((current) => ({ ...current, logic: value }))} />
    </SkillForm>;
  },
};
