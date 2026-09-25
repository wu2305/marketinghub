import React from "react";
import { KnowledgeCreateFields } from "./index.jsx";
import { KNOWLEDGE_CREATE } from "../../../demo/content/knowledge-create.js";
import { knowledgeCreateTypes, knowledgeCreateModes } from "../../../knowledge-create-options.js";
import { callbackProp, enumProp, prop } from "../../../lib/story-helpers.js";

export default { title: "Features/Knowledge Create/Knowledge Create Fields", component: KnowledgeCreateFields, tags: ["autodocs"],
  parameters: { docs: { description: { component: "P08 type-specific create and edit fields. Values are controlled; onChange carries {name,value}." } } },
  args: { type: "Principles", mode: "create", content: KNOWLEDGE_CREATE, values: {}, invalid: [], menu: null },
  argTypes: {
    type: enumProp(knowledgeCreateTypes, "Principles", "Form-specific fields."),
    mode: enumProp(knowledgeCreateModes, "create", "Editing context."),
    content: prop("object", { description: "Injected copy, options, and rows." }),
    values: prop("object", { description: "Controlled field values." }),
    invalid: prop("string[]", { description: "Invalid field names." }),
    menu: prop("string | null", { description: "Open multi-select name." }),
    onChange: callbackProp("onChange", "({name, value}) => void", { name: "title", value: "Example" }),
    onMenu: callbackProp("onMenu", "({name}) => void", { name: "businessDomain" }),
    onDialog: callbackProp("onDialog", "({kind}) => void", { kind: "preview" }),
  },
  render: (args) => <FieldsDemo key={`${args.type}:${args.mode}`} args={args} /> };
function FieldsDemo({ args }) { const [values, setValues] = React.useState(args.values); const [menu, setMenu] = React.useState(args.menu); React.useEffect(() => setValues(args.values), [args.values]); return <KnowledgeCreateFields {...args} values={values} menu={menu} onChange={(event) => { setValues((prior) => ({ ...prior, [event.name]: event.value })); args.onChange?.(event); }} onMenu={(event) => { setMenu((prior) => prior === event.name ? null : event.name); args.onMenu?.(event); }} onDialog={args.onDialog} />; }
export const Default = {};
