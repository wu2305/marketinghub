import React from "react";
import { SCENARIO_EDIT } from "../../../demo/content/scenario-edit.js";
import { callbackProp, bi } from "../../../lib/story-helpers.js";
import { ScenarioEditForm } from "./index.jsx";

const routes = { cockpit: "/assets/pages/reports.html", "scenario-library": "/assets/pages/scenario-library.html" };
const hrefFor = (id, params = {}) => { const path = routes[id]; const query = new URLSearchParams(params).toString(); return path && query ? `${path}?${query}` : path; };

export default { title: "Features/ScenarioEdit/ScenarioEditForm", component: ScenarioEditForm, tags: ["autodocs"], parameters: { docs: { description: { component: bi("Controlled Skill Edit form with the source's five required fields, structure cards, report link, native file picker and deterministic preview.", "受控的 Skill Edit 表单，含源页面的五个必填字段、结构卡片、报表链接、原生文件选择器与确定性预览。") } } } };
export const Configuration = {
  args: { content: SCENARIO_EDIT, values: SCENARIO_EDIT.defaults, errors: {}, preview: null },
  argTypes: {
    values: { control: "object", description: bi("All editable field values.", "全部可编辑的字段值。") },
    errors: { control: "object", description: bi("Five actual source validation fields.", "源页面的五个真实校验字段。") },
    preview: { control: "text", description: bi("Null hides preview; text reveals output and the question field.", "为 null 时隐藏预览；有文字则显示输出和问题字段。") },
    onChange: callbackProp("onChange", "({field:string,value:string}) => void", { field: "name", value: "City Comparison Analysis" }),
    onRunPreview: callbackProp("onRunPreview", "({question:string}) => void", { question: "Compare cities" }),
    onAutoFill: callbackProp("onAutoFill", "({field:'logic'|'output'}) => void", { field: "logic" }),
    onSelectFiles: callbackProp("onSelectFiles", "({files:string[]}) => void", { files: ["example.pdf"] }),
    onSaveDraft: callbackProp("onSaveDraft", "({values:object}) => void", { values: SCENARIO_EDIT.defaults }),
    onSubmit: callbackProp("onSubmit", "({values:object}) => void; demo container validates and emits {id,values}", { values: SCENARIO_EDIT.defaults }),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "cockpit", params: { project: "city", dashboard: 0 }, href: "/assets/pages/reports.html?project=city&dashboard=0", label: "Open Invest City Strategy Analysis" }),
  },
  render: function FormStory(args) {
    const [values, setValues] = React.useState(args.values);
    React.useEffect(() => setValues(args.values), [args.values]);
    return <ScenarioEditForm {...args} values={values} hrefFor={hrefFor} onChange={(event) => { setValues((current) => ({ ...current, [event.field]: event.value })); args.onChange?.(event); }} />;
  },
};
