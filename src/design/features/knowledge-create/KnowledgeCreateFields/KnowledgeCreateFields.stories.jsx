import React from "react";
import { KnowledgeCreateFields } from "./index.jsx";
import { KNOWLEDGE_CREATE } from "../../../demo/content/knowledge-create.js";
import { knowledgeCreateTypes, knowledgeCreateModes } from "../../../knowledge-create-options.js";
import { callbackProp, enumProp, prop, bi } from "../../../lib/story-helpers.js";

export default { title: "Features/Knowledge Create/Knowledge Create Fields", component: KnowledgeCreateFields, tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("P08 type-specific create and edit fields. Values are controlled; onChange carries {name,value}.", "P08 各类型专属的创建与编辑字段。值为受控；onChange 携带 {name,value}。") } } },
  args: { type: "Principles", mode: "create", content: KNOWLEDGE_CREATE, values: {}, invalid: [], menu: null },
  argTypes: {
    type: enumProp(knowledgeCreateTypes, "Principles", bi("Form-specific fields.", "表单专属字段。")),
    mode: enumProp(knowledgeCreateModes, "create", bi("Editing context.", "编辑上下文。")),
    content: prop("object", { description: bi("Injected copy, options, and rows.", "注入的文案、选项与行数据。") }),
    values: prop("object", { description: bi("Controlled field values.", "受控的字段值。") }),
    invalid: prop("string[]", { description: bi("Invalid field names.", "无效的字段名。") }),
    menu: prop("string | null", { description: bi("Open multi-select name.", "已展开的多选字段名。") }),
    onChange: callbackProp("onChange", "({name, value}) => void", { name: "title", value: "Example" }),
    onMenu: callbackProp("onMenu", "({name}) => void", { name: "businessDomain" }),
    onDialog: callbackProp("onDialog", "({kind}) => void", { kind: "preview" }),
  },
  render: (args) => <FieldsDemo key={`${args.type}:${args.mode}`} args={args} /> };
function FieldsDemo({ args }) { const [values, setValues] = React.useState(args.values); const [menu, setMenu] = React.useState(args.menu); React.useEffect(() => setValues(args.values), [args.values]); return <KnowledgeCreateFields {...args} values={values} menu={menu} onChange={(event) => { setValues((prior) => ({ ...prior, [event.name]: event.value })); args.onChange?.(event); }} onMenu={(event) => { setMenu((prior) => prior === event.name ? null : event.name); args.onMenu?.(event); }} onDialog={args.onDialog} />; }
export const Default = {};
