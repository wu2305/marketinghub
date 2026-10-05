import React from "react";
import { KnowledgeCreateFields } from "./index.jsx";
import { KNOWLEDGE_CREATE } from "../../../demo/content/knowledge-create.js";
import { knowledgeCreateTypes, knowledgeCreateModes } from "../../../knowledge-create-options.js";
import { callbackProp, enumProp, prop, bi } from "../../../lib/story-helpers.js";

export default { title: "Features/Knowledge Create/Knowledge Create Fields", component: KnowledgeCreateFields, tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("This component shows the fields for one knowledge type on Knowledge create. Set `type` to choose the fields. Set `value` keys on `values` if the page controls the fields. `onChange` sends `{name, value}`. Required Analytical Model fields are Analysis Name, Business Domain, Trigger When, and Output Requirements.", "这个组件显示 Knowledge create 上一种知识类型的字段。用 `type` 选择字段。如果页面要控制字段，就设置 `values`。`onChange` 发出 `{name, value}`。Analytical Model 的必填字段是 Analysis Name、Business Domain、Trigger When 和 Output Requirements。") } } },
  args: { type: "Principles", mode: "create", content: KNOWLEDGE_CREATE, values: {}, invalid: [], menu: null },
  argTypes: {
    type: enumProp(knowledgeCreateTypes, "Principles", bi("Form-specific fields.", "表单专属字段。")),
    mode: enumProp(knowledgeCreateModes, "create", bi("Editing context.", "编辑上下文。")),
    content: prop("object", { description: bi("Injected copy, options, and rows.", "注入的文案、选项与行数据。") }),
    values: prop("object", { description: bi("Controlled field values.", "受控的字段值。") }),
    invalid: prop("string[]", { description: bi("Invalid field names.", "无效的字段名。") }),
    menu: prop("string | null", { description: bi("Open multi-select name.", "已展开的多选字段名。") }),
    onChange: callbackProp("onChange", "({name, value}) => void", { name: "title", value: "Example" }, bi("The function runs at each change.", "每次变化都会调用这个函数。")),
    onMenu: callbackProp("onMenu", "({name}) => void", { name: "businessDomain" }, bi("The function runs when a multi-select opens or closes. The result has `name`.", "多选打开或关闭时会调用这个函数。结果里有 `name`。")),
    onDialog: callbackProp("onDialog", "({kind}) => void", { kind: "preview" }, bi("The function runs when a dialog opens. The result has `kind`.", "对话框打开时会调用这个函数。结果里有 `kind`。")),
  },
  render: (args) => <FieldsDemo key={`${args.type}:${args.mode}`} args={args} /> };
function FieldsDemo({ args }) { const [values, setValues] = React.useState(args.values); const [menu, setMenu] = React.useState(args.menu); React.useEffect(() => setValues(args.values), [args.values]); return <KnowledgeCreateFields {...args} values={values} menu={menu} onChange={(event) => { setValues((prior) => ({ ...prior, [event.name]: event.value })); args.onChange?.(event); }} onMenu={(event) => { setMenu((prior) => prior === event.name ? null : event.name); args.onMenu?.(event); }} onDialog={args.onDialog} />; }
export const Default = {};
