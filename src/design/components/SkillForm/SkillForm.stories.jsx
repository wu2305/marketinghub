import { SCENARIO_EDIT } from "../../demo/content/scenario-edit.js";
import { callbackProp, prop, useSynced, bi } from "../../lib/story-helpers.js";
import { SkillForm } from "./index.jsx";
import { SkillFormCard, SkillFormFillCard, skillFormTones } from "./cards.jsx";

const { labels, scopes, defaults } = SCENARIO_EDIT;

export default {
  title: "Organisms/SkillForm",
  component: SkillForm,
  tags: ["autodocs"],
  subcomponents: { SkillFormCard, SkillFormFillCard },
  parameters: { layout: "padded", docs: { description: { component: bi("Scenario Configuration form frame shared by the Skill Library inline form and the Skill Edit page: basics, structure cards supplied as children, example preview and footer. Cards are `SkillFormCard` (own controls) or `SkillFormFillCard` (textarea with AI Auto-fill); tones are " + skillFormTones.join(", ") + ".", "Skill Library 页内表单与 Skill Edit 页共用的 Scenario Configuration 表单框架：基本信息、作为 children 传入的结构卡片、示例预览与页脚。卡片为 `SkillFormCard`（自带控件）或 `SkillFormFillCard`（带 AI Auto-fill 的文本域）；色调为 " + skillFormTones.join("、") + "。") } } },
};

export const Default = {
  args: { labels, values: { name: defaults.name, purpose: defaults.purpose, scope: defaults.scope, owner: defaults.owner, question: defaults.question }, scopes, errors: {}, preview: null },
  argTypes: {
    labels: prop("object", { description: bi("Form copy (see the props table).", "表单文案（见 props 表）。"), control: "object" }),
    values: prop("object", { description: bi("Controlled name, purpose, scope, owner and example question.", "受控的名称、用途、范围、负责人与示例问题。"), control: "object" }),
    scopes: prop("Array<string|{value,label}>", { defaultValue: [], description: bi("Scope choices.", "范围选项。"), control: "object" }),
    errors: prop("Record<string,boolean>", { defaultValue: {}, description: bi("Invalid basics show the required message and take focus.", "基本信息无效时显示必填提示并聚焦到该字段。"), control: "object" }),
    preview: prop("string|null", { defaultValue: null, description: bi("Null hides the example question and output.", "为 null 时隐藏示例问题与输出。"), control: "text" }),
    cancelHref: prop("string", { description: bi("Renders Cancel as a link instead of a button.", "将 Cancel 渲染为链接而不是按钮。"), control: "text" }),
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
