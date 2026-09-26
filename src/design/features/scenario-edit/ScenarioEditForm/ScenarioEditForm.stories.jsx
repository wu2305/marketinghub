import React from "react";
import { SCENARIO_EDIT } from "../../../demo/content/scenario-edit.js";
import { callbackProp } from "../../../lib/story-helpers.js";
import { ScenarioEditForm } from "./index.jsx";

export default { title: "Features/ScenarioEdit/ScenarioEditForm", component: ScenarioEditForm, tags: ["autodocs"], parameters: { docs: { description: { component: "Controlled Skill Edit form with the source's five required fields, structure cards, report link, native file picker and deterministic preview." } } } };
export const Configuration = {
  args: { content: SCENARIO_EDIT, values: SCENARIO_EDIT.defaults, errors: {}, preview: null },
  argTypes: {
    values: { control: "object", description: "All editable field values." },
    errors: { control: "object", description: "Five actual source validation fields." },
    preview: { control: "text", description: "Null hides preview; text reveals output and the question field." },
    onChange: callbackProp("onChange", "({field:string,value:string}) => void", { field: "name", value: "City Comparison Analysis" }),
    onRunPreview: callbackProp("onRunPreview", "() => void"),
    onAutoFill: callbackProp("onAutoFill", "({field:'logic'|'output'}) => void; source has no resulting flow", { field: "logic" }),
    onSelectFiles: callbackProp("onSelectFiles", "({files:string[]}) => void", { files: ["example.pdf"] }),
    onSaveDraft: callbackProp("onSaveDraft", "({values:object}) => void; source has no resulting flow", { values: SCENARIO_EDIT.defaults }),
    onSubmit: callbackProp("onSubmit", "() => void; demo container validates and emits {id,values}", undefined),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "cockpit", params: { project: "city", dashboard: 0 }, href: "reports.html?project=city&dashboard=0", label: "Open Invest City Strategy Analysis" }),
  },
  render: function FormStory(args) {
    const [values, setValues] = React.useState(args.values);
    React.useEffect(() => setValues(args.values), [args.values]);
    return <ScenarioEditForm {...args} values={values} onChange={(event) => { setValues((current) => ({ ...current, [event.field]: event.value })); args.onChange?.(event); }} />;
  },
};
