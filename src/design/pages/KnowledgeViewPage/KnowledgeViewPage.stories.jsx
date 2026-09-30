import React from "react";
import { pageShell, enumProp, callbackProp, bi } from "../../lib/story-helpers.js";
import { KNOWLEDGE_VIEW } from "../../demo/content/knowledge-view.js";
import { useKnowledgeViewDemo } from "../../demo/knowledge-view-demo.js";
import { knowledgeDetailTypes, knowledgeModelActions, knowledgeModelGroups, knowledgeModelTabs } from "../../features/knowledge-view/KnowledgeDetail/index.jsx";
import { KnowledgeViewPage } from "./index.jsx";

const recordIds = Object.keys(KNOWLEDGE_VIEW.records);
const detailNavigation = pageShell.navigation.filter((item) => ["home", "cockpit", "interpreter"].includes(item.id));
const overlays = ["none", "versions", "scenario-versions", ...knowledgeModelActions];

function Story(args) {
  const demo = useKnowledgeViewDemo({ ...args, overlay: args.overlay === "none" ? null : args.overlay });
  return <KnowledgeViewPage {...pageShell} navigation={detailNavigation} {...demo} onNavigate={args.onNavigate} />;
}

export default {
  title: "Pages",
  component: KnowledgeViewPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { description: { component: bi("Full knowledge detail page for stable Business Term and Scenario views, plus intended gated Principles and Data Model views. Direct known IDs and source actions are represented with deterministic local state.", "完整的知识详情页，覆盖稳定的 Business Term 与 Scenario 视图，以及预期受限的 Principles 与 Data Model 视图。直接访问已知 ID 及源页面操作均以确定性的本地状态表示。") } } },
  args: { recordId: "business-term-gmv", overlay: "none", collapsed: false, query: "", group: "entity", tab: "fields", tableId: "channel" },
  argTypes: {
    recordId: enumProp(recordIds, "business-term-gmv", bi("Source-backed detail record; type options are " + knowledgeDetailTypes.join(", "), "以源页面为依据的详情记录；类型选项为 " + knowledgeDetailTypes.join("、"))),
    overlay: enumProp(overlays, "none", bi("Open version or action notice", "打开版本或操作提示")),
    group: enumProp(knowledgeModelGroups, "entity", bi("Data Model sidebar switch", "Data Model 侧栏切换")),
    tab: enumProp(knowledgeModelTabs, "fields", bi("Data Model tab highlight; source keeps the field table visible", "Data Model 标签页高亮；源页面保持字段表可见")),
    tableId: enumProp(KNOWLEDGE_VIEW.model.tables.map((table) => table.id), "channel", bi("Active Data Model table", "当前激活的 Data Model 表")),
    onNavigate: callbackProp("onNavigate", "({id,params,href}) => void", { id: "knowledgeCreate", params: { mode: "edit", id: "business-term-gmv" }, href: "/assets/pages/knowledge-create.html?mode=edit&id=business-term-gmv" }),
    onOpen: callbackProp("onOpen", "({kind,recordId}) => void", { kind: "versions", recordId: "business-term-gmv" }),
    onAction: callbackProp("onAction", "({id,recordId}) => void", { id: "preview", recordId: "channel-data-model" }),
    onChange: callbackProp("onChange", "({name,id?,value}) => void", { name: "query", value: "Channel" }),
    onSelect: callbackProp("onSelect", "({kind,id}) => void", { kind: "tab", id: "basic" }),
    onCancel: callbackProp("onCancel", "({reason,recordId}) => void", { reason: "button", recordId: "business-term-gmv" }),
  },
};

export const KnowledgeViewBusinessTerm = { name: "Knowledge View / Business Term", args: { recordId: "business-term-paid-customer" }, render: Story };
export const KnowledgeViewBusinessTermVersions = { name: "Knowledge View / Business Term versions", args: { overlay: "versions" }, render: Story };
export const KnowledgeViewBusinessTermEmpty = { name: "Knowledge View / Business Term empty assets", args: { recordId: "business-term-gmv" }, render: Story };
export const KnowledgeViewScenario = { name: "Knowledge View / Scenario Reporting", args: { recordId: "scenario-channel-performance" }, render: Story };
export const KnowledgeViewScenarioReview = { name: "Knowledge View / Scenario under review", args: { recordId: "scenario-campaign-review" }, render: Story };
export const KnowledgeViewScenarioVersions = { name: "Knowledge View / Scenario versions notice", args: { recordId: "scenario-channel-performance", overlay: "scenario-versions" }, render: Story };
export const KnowledgeViewPrinciples = { name: "Knowledge View / Principles", args: { recordId: "investment-principles" }, render: Story };
export const KnowledgeViewPrinciplesCollapsed = { name: "Knowledge View / Principles collapsed", args: { recordId: "investment-principles", collapsed: true }, render: Story };
export const KnowledgeViewPrinciplesVersions = { name: "Knowledge View / Principles versions", args: { recordId: "investment-principles", overlay: "versions" }, render: Story };
export const KnowledgeViewDataModel = { name: "Knowledge View / Data Model", args: { recordId: "channel-data-model" }, render: Story };
export const KnowledgeViewDataModelSearch = { name: "Knowledge View / Data Model search", args: { recordId: "channel-data-model", query: "no-such-table" }, render: Story };
export const KnowledgeViewDataModelBasic = { name: "Knowledge View / Data Model Basic Info tab", args: { recordId: "channel-data-model", tab: "basic" }, render: Story };
export const KnowledgeViewDataModelEvent = { name: "Knowledge View / Data Model Event switch", args: { recordId: "channel-data-model", group: "event" }, render: Story };
export const KnowledgeViewDataModelTable = { name: "Knowledge View / Data Model table selection", args: { recordId: "channel-data-model", tableId: "region" }, render: Story };
export const KnowledgeViewDataModelPreview = { name: "Knowledge View / Data Model Preview notice", args: { recordId: "channel-data-model", overlay: "preview" }, render: Story };
export const KnowledgeViewDataModelSmart = { name: "Knowledge View / Data Model Smart Modeling notice", args: { recordId: "channel-data-model", overlay: "smart" }, render: Story };
export const KnowledgeViewDataModelExport = { name: "Knowledge View / Data Model Export notice", args: { recordId: "channel-data-model", overlay: "export" }, render: Story };
export const KnowledgeViewDataModelEdit = { name: "Knowledge View / Data Model Edit notice", args: { recordId: "channel-data-model", overlay: "edit" }, render: Story };
