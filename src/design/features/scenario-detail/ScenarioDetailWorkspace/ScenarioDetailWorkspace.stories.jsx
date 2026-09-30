import React from "react";
import { SKILL_RECORDS } from "../../../demo/content/skill-records.js";
import { SCENARIO_DETAIL } from "../../../demo/content/scenario-detail.js";
import { enumProp, callbackProp, bi } from "../../../lib/story-helpers.js";
import { ScenarioDetailWorkspace, scenarioDetailTabs } from "./index.jsx";

const routes = { cockpit: "/assets/pages/reports.html", interpreter: "/assets/pages/knowledge.html", "scenario-edit": "/assets/pages/scenario-edit.html" };
const hrefFor = (id, params = {}) => {
  const path = routes[id];
  const query = new URLSearchParams(params).toString();
  return path && query ? `${path}?${query}` : path;
};

export default { title: "Features/Scenario Detail/ScenarioDetailWorkspace", component: ScenarioDetailWorkspace, tags: ["autodocs"], parameters: { docs: { description: { component: bi("The six actual Skill Detail panels as a controlled, content-driven feature. It owns no URL, record selection or assistant state.", "六个真实的 Skill Detail 面板，作为受控、内容驱动的功能模块。它不持有 URL、记录选择或助手状态。") } } } };

export const Default = {
  args: { record: SKILL_RECORDS.find((record) => record.id === "city-comparison"), labels: SCENARIO_DETAIL.labels, tab: "content", previewOpen: false },
  argTypes: {
    record: { control: "object", description: bi("Replaceable skill record.", "可替换的技能记录。") },
    labels: { control: "object", description: bi("Tab, field and static panel copy.", "标签页、字段与静态面板的文案。") },
    tab: enumProp(scenarioDetailTabs, "content", bi("Selected panel.", "当前选中的面板。")),
    previewOpen: { control: "boolean", description: bi("Content example output expanded.", "展开 Content 面板中的示例输出。") },
    onTabChange: callbackProp("onTabChange", "({value:string}) => void", { value: "related" }),
    onTogglePreview: callbackProp("onTogglePreview", "({open:boolean}) => void", { open: true }),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "scenario-edit", params: { id: "city-comparison" }, href: "scenario-edit.html?id=city-comparison", label: "Edit Scenario" }),
  },
  render: function WorkspaceStory(args) {
    const [tab, setTab] = React.useState(args.tab);
    const [previewOpen, setPreviewOpen] = React.useState(args.previewOpen);
    React.useEffect(() => setTab(args.tab), [args.tab]);
    React.useEffect(() => setPreviewOpen(args.previewOpen), [args.previewOpen]);
    return <ScenarioDetailWorkspace {...args} tab={tab} previewOpen={previewOpen} hrefFor={hrefFor} onTabChange={(event) => { setTab(event.value); args.onTabChange?.(event); }} onTogglePreview={(event) => { setPreviewOpen(event.open); args.onTogglePreview?.(event); }} />;
  },
};
