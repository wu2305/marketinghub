import { BusinessTermForm, businessTermKinds } from "./index.jsx";
import React from "react";
import { callbackProp, enumProp, prop } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Interpreter/Business term form", component: BusinessTermForm, tags: ["autodocs"],
  parameters: { docs: { description: { component: "Controlled P08 Business Term fields, Data Model links, and Save/Submit actions. onChange carries {name,value}; action callbacks carry {values}." } } },
  args: { title: "", kind: "Business Term", description: "", synonyms: "", scope: [], scopeOptions: ["Marketing", "Customer", "Global"], guidanceTitle: "Build a common language", guidance: "Clearly define the meaning, usage, and boundaries of this business term to help teams talk about data consistently.", reminder: "Operation reminder: Save keeps this term in Draft. Submit publishes it for AI use.", invalid: [] },
  argTypes: {
    title: prop("string", { description: "Business term title." }),
    kind: enumProp(businessTermKinds, "Business Term", "Term category."),
    description: prop("string", { description: "Governed meaning and boundaries." }),
    synonyms: prop("string", { description: "Comma-separated aliases." }),
    scope: prop("string[]", { description: "Selected Data Model links." }),
    scopeOptions: prop("string[]", { description: "Available Data Model links." }),
    invalid: prop("string[]", { description: "Required field names in error state." }),
    onChange: callbackProp("onChange", "({name, value}) => void", { name: "title", value: "GMV" }),
    onCancel: callbackProp("onCancel", "() => void"),
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
