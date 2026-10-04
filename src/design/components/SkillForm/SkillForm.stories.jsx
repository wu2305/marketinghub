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
  parameters: { layout: "padded", docs: { description: { component: bi("This component is the Scenario Configuration form. Skill Library uses it as the inline form. Skill Edit uses the same form as a full page. The form has basics, structure cards as `children`, an example preview, and a footer. A `SkillFormCard` holds its own controls. A `SkillFormFillCard` holds a textarea with AI Auto-fill. Tones are " + skillFormTones.join(", ") + ".", "这个组件是 Scenario Configuration 表单。Skill Library 用它作为页内表单。Skill Edit 用同一表单作为整页。表单包含基本信息、作为 `children` 传入的结构卡片、示例预览和页脚。`SkillFormCard` 自带控件。`SkillFormFillCard` 是带 AI Auto-fill 的文本域。色调是 " + skillFormTones.join("、") + "。") } } },
};

export const Default = {
  args: { labels, values: { name: defaults.name, purpose: defaults.purpose, scope: defaults.scope, owner: defaults.owner, question: defaults.question }, scopes, errors: {}, preview: null },
  argTypes: {
    labels: prop("object", { description: bi("Form copy. Keys include formTitle, saved, field labels, and footer labels.", "表单文案。键包括 formTitle、saved、字段标签和页脚标签。"), control: "object" }),
    values: prop("object", { description: bi("Controlled name, purpose, scope, owner, and example question.", "受控的名称、用途、范围、负责人和示例问题。"), control: "object" }),
    scopes: prop("Array<string|{value,label}>", { defaultValue: [], description: bi("Choices for the scope list.", "范围列表的选项。"), control: "object" }),
    errors: prop("Record<string,boolean>", { defaultValue: {}, description: bi("Invalid basics show the required message. Focus moves to the first invalid field.", "基本信息无效时显示必填提示。焦点移到第一个无效字段。"), control: "object" }),
    preview: prop("string|null", { defaultValue: null, description: bi("Set a string to show the example question and output. If `preview` is null, those parts stay hidden.", "传入字符串可显示示例问题和输出。`preview` 为 null 时，这些部分保持隐藏。"), control: "text" }),
    cancelHref: prop("string", { description: bi("Set this if Cancel opens a different page. Cancel then becomes a link.", "如果 Cancel 会打开另一个页面，就设置这个值。Cancel 会变成链接。"), control: "text" }),
    onChange: callbackProp("onChange", "({field:string,value:string}) => void", { field: "name", value: "City Comparison Analysis" }, bi("The function runs at each change in the basics or the example question. The result has `field` and `value`.", "基本信息或示例问题每次变化都会调用这个函数。结果里带有 `field` 和 `value`。")),
    onRunPreview: callbackProp("onRunPreview", "({question:string}) => void", { question: defaults.question }, bi("The function runs when Run Preview is pressed. The result has `question`.", "按下 Run Preview 时调用这个函数。结果里带有 `question`。")),
    onSaveDraft: callbackProp("onSaveDraft", "({values:object}) => void", { values: defaults }, bi("The function runs when Save Draft is pressed. The result has the current `values`.", "按下 Save Draft 时调用这个函数。结果里带有当前的 `values`。")),
    onSubmit: callbackProp("onSubmit", "({values:object}) => void", { values: defaults }, bi("The function runs when Submit is pressed. The result has the current `values`.", "按下 Submit 时调用这个函数。结果里带有当前的 `values`。")),
    onCancel: callbackProp("onCancel", "({reason:'cancel',href?:string}) => void", { reason: "cancel" }, bi("The function runs when Cancel is pressed. The result has `reason` `cancel`. If you set `cancelHref`, the result also has `href`.", "按下 Cancel 时调用这个函数。结果里的 `reason` 是 `cancel`。如果设置了 `cancelHref`，结果里还有 `href`。")),
  },
  render: function SkillFormStory(args) {
    const [values, setValues] = useSynced(args.values);
    return <SkillForm {...args} values={values} onChange={(event) => { setValues((current) => ({ ...current, [event.field]: event.value })); args.onChange?.(event); }}>
      <SkillFormCard tone="info" icon="file" label={labels.report}><span>Any controls go here.</span></SkillFormCard>
      <SkillFormFillCard tone="success" icon="bulb" label={labels.logic} value={values.logic || ""} placeholder={labels.logicPlaceholder} autoFillLabel={labels.autoFill} onChange={({ value }) => setValues((current) => ({ ...current, logic: value }))} />
    </SkillForm>;
  },
};
