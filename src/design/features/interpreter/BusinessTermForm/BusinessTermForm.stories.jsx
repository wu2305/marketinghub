import { BusinessTermForm, businessTermKinds } from "./index.jsx";
import React from "react";
import { callbackProp, enumProp, prop, bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Interpreter/Business term form", component: BusinessTermForm, tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("Controlled P08 Business Term fields, Data Model links, and Save/Submit actions. onChange carries {name,value}; action callbacks carry {values}.", "受控的 P08 Business Term 字段、Data Model 关联，以及 Save/Submit 操作。onChange 携带 {name,value}；操作回调携带 {values}。") } } },
  args: { title: "", kind: "Business Term", description: "", synonyms: [], scope: [], scopeOptions: ["Marketing", "Customer", "Global"], guidanceTitle: "Build a common language", guidance: "Clearly define the meaning, usage, and boundaries of this business term to help teams talk about data consistently.", reminder: "Operation reminder: Save keeps this term in Draft. Submit publishes it for AI use.", invalid: [] },
  argTypes: {
    title: prop("string", { description: bi("Business term title.", "业务术语标题。") }),
    kind: enumProp(businessTermKinds, "Business Term", bi("Term category.", "术语分类。")),
    description: prop("string", { description: bi("Governed meaning and boundaries.", "受治理的释义与边界。") }),
    synonyms: prop("string[]", { description: bi("Aliases. The field shows them comma-separated and reports the parsed list.", "别名。字段以逗号分隔显示，并回报解析后的列表。") }),
    scope: prop("string[]", { description: bi("Selected Data Model links.", "已选的 Data Model 关联。") }),
    scopeOptions: prop("string[]", { description: bi("Available Data Model links.", "可选的 Data Model 关联。") }),
    invalid: prop("string[]", { description: bi("Required field names in error state.", "处于错误状态的必填字段名。") }),
    onChange: callbackProp("onChange", "({name, value}) => void", { name: "title", value: "GMV" }),
    onCancel: callbackProp("onCancel", "({values}) => void", { values: { title: "GMV" } }),
    onSave: callbackProp("onSave", "({values}) => void", { values: { title: "GMV" } }),
    onSubmit: callbackProp("onSubmit", "({values}) => void", { values: { title: "GMV" } }),
  },
  render: function BusinessTermFormStory(args) {
    const [values, setValues] = React.useState(() => ({ title: args.title, kind: args.kind, description: args.description, synonyms: args.synonyms, scope: args.scope }));
    React.useEffect(() => setValues({ title: args.title, kind: args.kind, description: args.description, synonyms: args.synonyms, scope: args.scope }), [args.title, args.kind, args.description, args.synonyms, args.scope]);
    return <BusinessTermForm {...args} {...values} onChange={(event) => { setValues((prior) => ({ ...prior, [event.name]: event.value })); args.onChange?.(event); }} />;
  },
};
export const Default = {};
