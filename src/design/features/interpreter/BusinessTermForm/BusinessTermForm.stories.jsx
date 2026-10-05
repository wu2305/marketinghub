import { BusinessTermForm, businessTermKinds } from "./index.jsx";
import React from "react";
import { callbackProp, enumProp, prop, bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Interpreter/Business term form", component: BusinessTermForm, tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("This component is the Business Term form. It has Title, Term Type, Description, synonyms, and Data Model links. Cancel does not save. The form has no Enable or Disable switch. Required fields are Title, Term Type, and Description. Empty required fields show a red border and \"This field is required.\" `onChange` sends `{name, value}`. Save, Submit, and Cancel send `{values}`. The form does not set status or stage.", "这是 Business Term 表单。字段有 Title、Term Type、Description、同义词和 Data Model 关联。Cancel 不保存。表单没有 Enable 或 Disable 开关。必填字段是 Title、Term Type 和 Description。空的必填字段会显示红色边框和 \"This field is required.\"。`onChange` 发出 `{name, value}`。Save、Submit 和 Cancel 发出 `{values}`。表单不设置 status 或 stage。") } } },
  args: { title: "", kind: "Business Term", description: "", synonyms: [], scope: [], scopeOptions: ["Marketing", "Customer", "Global"], guidanceTitle: "Build a common language", guidance: "Clearly define the meaning, usage, and boundaries of this business term to help teams talk about data consistently.", reminder: "Operation reminder: Save keeps this term in Draft. Submit sends it for review.", invalid: [] },
  argTypes: {
    title: prop("string", { description: bi("Business term title.", "业务术语标题。") }),
    kind: enumProp(businessTermKinds, "Business Term", bi("Term category.", "术语分类。")),
    description: prop("string", { description: bi("Governed meaning and boundaries.", "受治理的释义与边界。") }),
    synonyms: prop("string[]", { description: bi("Aliases. The field shows them as a comma-separated list. A change sends the parsed list.", "别名。字段用逗号分隔显示。变化时会发出解析后的列表。") }),
    scope: prop("string[]", { description: bi("Selected Data Model links.", "已选的 Data Model 关联。") }),
    scopeOptions: prop("string[]", { description: bi("Available Data Model links.", "可选的 Data Model 关联。") }),
    invalid: prop("string[]", { description: bi("Required field names in error state.", "处于错误状态的必填字段名。") }),
    onChange: callbackProp("onChange", "({name, value}) => void", { name: "title", value: "GMV" }, bi("The function runs at each change.", "每次变化都会调用这个函数。")),
    onCancel: callbackProp("onCancel", "({values}) => void", { values: { title: "GMV" } }, bi("The function runs on Cancel. Cancel does not save.", "点击 Cancel 时会调用这个函数。Cancel 不保存。")),
    onSave: callbackProp("onSave", "({values}) => void", { values: { title: "GMV" } }, bi("The function runs on Save. The form sends `{values}`. The form does not set status or stage.", "点击 Save 时会调用这个函数。表单发出 `{values}`。表单不设置 status 或 stage。")),
    onSubmit: callbackProp("onSubmit", "({values}) => void", { values: { title: "GMV" } }, bi("The function runs on Submit. The form sends `{values}`. The form does not set status or stage.", "点击 Submit 时会调用这个函数。表单发出 `{values}`。表单不设置 status 或 stage。")),
  },
  render: function BusinessTermFormStory(args) {
    const [values, setValues] = React.useState(() => ({ title: args.title, kind: args.kind, description: args.description, synonyms: args.synonyms, scope: args.scope }));
    React.useEffect(() => setValues({ title: args.title, kind: args.kind, description: args.description, synonyms: args.synonyms, scope: args.scope }), [args.title, args.kind, args.description, args.synonyms, args.scope]);
    return <BusinessTermForm {...args} {...values} onChange={(event) => { setValues((prior) => ({ ...prior, [event.name]: event.value })); args.onChange?.(event); }} />;
  },
};
export const Default = {};
