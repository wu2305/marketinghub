import React from "react";
import { SKILL_RECORDS } from "../../../demo/content/skill-records.js";
import { SCENARIO_DETAIL } from "../../../demo/content/scenario-detail.js";
import { enumProp, callbackProp } from "../../../lib/story-helpers.js";
import { ScenarioDetailWorkspace, scenarioDetailTabs } from "./index.jsx";

export default { title: "Features/Scenario Detail/ScenarioDetailWorkspace", component: ScenarioDetailWorkspace, tags: ["autodocs"], parameters: { docs: { description: { component: "The six actual Skill Detail panels as a controlled, content-driven feature. It owns no URL, record selection or assistant state." } } } };

export const Default = {
  args: { record: SKILL_RECORDS.find((record) => record.id === "city-comparison"), labels: SCENARIO_DETAIL.labels, tab: "content", previewOpen: false },
  argTypes: {
    record: { control: "object", description: "Replaceable skill record." },
    labels: { control: "object", description: "Tab, field and static panel copy." },
    tab: enumProp(scenarioDetailTabs, "content", "Selected panel."),
    previewOpen: { control: "boolean", description: "Content example output expanded." },
    onTabChange: callbackProp("onTabChange", "({value:string}) => void", { value: "related" }),
    onTogglePreview: callbackProp("onTogglePreview", "({open:boolean}) => void", { open: true }),
    onNavigate: callbackProp("onNavigate", "({id:string,params:object,href:string,label:string}) => void", { id: "scenario-edit", params: { id: "city-comparison" }, href: "scenario-edit.html?id=city-comparison", label: "Edit Scenario" }),
  },
  render: function WorkspaceStory(args) {
    const [tab, setTab] = React.useState(args.tab);
    const [previewOpen, setPreviewOpen] = React.useState(args.previewOpen);
    React.useEffect(() => setTab(args.tab), [args.tab]);
    React.useEffect(() => setPreviewOpen(args.previewOpen), [args.previewOpen]);
    return <ScenarioDetailWorkspace {...args} tab={tab} previewOpen={previewOpen} onTabChange={(event) => { setTab(event.value); args.onTabChange?.(event); }} onTogglePreview={(event) => { setPreviewOpen(event.open); args.onTogglePreview?.(event); }} />;
  },
};
