import React from "react";
import { SCENARIO_EDIT } from "../../../demo/content/scenario-edit.js";
import { callbackProp, bi } from "../../../lib/story-helpers.js";
import { ScenarioEditForm } from "./index.jsx";

const routes = { cockpit: "/assets/pages/reports.html", "scenario-library": "/assets/pages/scenario-library.html" };
const hrefFor = (id, params = {}) => { const path = routes[id]; const query = new URLSearchParams(params).toString(); return path && query ? `${path}?${query}` : path; };

export default { title: "Features/ScenarioEdit/ScenarioEditForm", component: ScenarioEditForm, tags: ["autodocs"], parameters: { docs: { description: { component: bi("This component is the Skill Edit form. It uses the shared `SkillForm` frame. The user can edit Scenario Name, Purpose, Scope, Owner, Report, Analysis Logic, Output, and the example question. Structure cards hold the report select, Analysis Logic, Output, and reference files. Set `errors` for name, purpose, scope, owner, and report. Set `preview` to a string to show the example output. A `null` preview hides that block. The Demo buttons are Save Draft and Submit for Review. Cancel goes to Skill Library.", "这是 Skill Edit 页的表单。它使用共用的 `SkillForm` 框架。用户可以编辑 Scenario Name、Purpose、Scope、Owner、Report、Analysis Logic、Output 和示例问题。结构卡片里是报表选择、Analysis Logic、Output 和参考文件。用 `errors` 标记 name、purpose、scope、owner 和 report。把 `preview` 设为字符串会显示示例输出。`preview` 为 `null` 时隐藏该区块。Demo 按钮是 Save Draft 和 Submit for Review。Cancel 回到 Skill Library。") } } } };
export const Configuration = {
  args: { content: SCENARIO_EDIT, values: SCENARIO_EDIT.defaults, errors: {}, preview: null },
  argTypes: {
    values: { control: "object", description: bi("All editable field values.", "全部可编辑的字段值。") },
    errors: { control: "object", description: bi("Invalid flags for name, purpose, scope, owner, and report. The host checks these fields.", "name、purpose、scope、owner 和 report 的无效标记。这些字段由宿主校验。") },
    preview: { control: "text", description: bi("Set a string to show the example output and the question field. Set `null` to hide them.", "设为字符串会显示示例输出和问题字段。设为 `null` 则隐藏它们。") },
    onChange: callbackProp("onChange", "({field:string,value:string}) => void", { field: "name", value: "City Comparison Analysis" }, bi("The function runs at each field change. The result has `field` and `value`.", "每个字段变化时都会调用这个函数。结果里带有 `field` 和 `value`。")),
    onRunPreview: callbackProp("onRunPreview", "({question:string}) => void", { question: "Compare cities" }, bi("The function runs when the user clicks Run Preview. The result has `question`.", "用户点击 Run Preview 时会调用这个函数。结果里带有 `question`。")),
    onAutoFill: callbackProp("onAutoFill", "({field:'logic'|'output'}) => void", { field: "logic" }, bi("The function runs when the user clicks AI Auto-fill. The result has `field`: `logic` or `output`. The host fills that field.", "用户点击 AI Auto-fill 时会调用这个函数。结果里带有 `field`：`logic` 或 `output`。由宿主填充该字段。")),
    onSelectFiles: callbackProp("onSelectFiles", "({files:string[]}) => void", { files: ["example.pdf"] }, bi("The function runs when the user selects files in the file picker. The result has `files`. The names are file names. The static attachment pills do not change.", "用户在文件选择器中选中文件时会调用这个函数。结果里带有 `files`。其中是文件名。静态附件标签不会改变。")),
    onSaveDraft: callbackProp("onSaveDraft", "({values:object}) => void", { values: SCENARIO_EDIT.defaults }, bi("The function runs when the user clicks Save Draft. The result has `values`.", "用户点击 Save Draft 时会调用这个函数。结果里带有 `values`。")),
    onSubmit: callbackProp("onSubmit", "({values:object}) => void", { values: SCENARIO_EDIT.defaults }, bi("The function runs when the user clicks Submit for Review. The result has `values`. The host checks the fields.", "用户点击 Submit for Review 时会调用这个函数。结果里带有 `values`。字段由宿主校验。")),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "cockpit", params: { project: "city", dashboard: 0 }, href: "/assets/pages/reports.html?project=city&dashboard=0", label: "Open Invest City Strategy Analysis" }, bi("The function runs when the user follows Cancel or Open report. The result has `id`, `params`, `href`, and `label`.", "用户点击 Cancel 或打开报表时会调用这个函数。结果里带有 `id`、`params`、`href` 和 `label`。")),
  },
  render: function FormStory(args) {
    const [values, setValues] = React.useState(args.values);
    React.useEffect(() => setValues(args.values), [args.values]);
    return <ScenarioEditForm {...args} values={values} hrefFor={hrefFor} onChange={(event) => { setValues((current) => ({ ...current, [event.field]: event.value })); args.onChange?.(event); }} />;
  },
};
