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
  parameters: { layout: "fullscreen", docs: { description: { component: bi("This page is Knowledge View. It shows one knowledge record. Types are Business Term, Scenario Reporting, Principles, and Data Model. To build this page, set `record` and `copy`. Set `hrefFor` for crumbs and edit links. Version drawers and Data Model action notices are overlays. Scenario Reporting here is a knowledge type. It is not the Scenario Detail page.", "这是 Knowledge View 页面。它显示一条知识记录。类型是 Business Term、Scenario Reporting、Principles 和 Data Model。组合页面时，设置 `record` 和 `copy`。面包屑和编辑链接用 `hrefFor`。版本抽屉和 Data Model 操作提示是覆盖层。这里的 Scenario Reporting 是一种知识类型，不是 Scenario Detail 页面。") } } },
  args: { recordId: "business-term-gmv", overlay: "none", collapsed: false, query: "", group: "entity", tab: "fields", tableId: "channel" },
  argTypes: {
    recordId: enumProp(recordIds, "business-term-gmv", bi("Detail record. Types are " + knowledgeDetailTypes.join(", ") + ".", "详情记录。类型是 " + knowledgeDetailTypes.join("、") + "。")),
    overlay: enumProp(overlays, "none", bi("Open version drawer or a Data Model action notice. `none` hides the overlay.", "打开版本抽屉或 Data Model 操作提示。`none` 会隐藏覆盖层。")),
    group: enumProp(knowledgeModelGroups, "entity", bi("Data Model sidebar group. Values are entity and event.", "Data Model 侧栏分组。取值是 entity 和 event。")),
    tab: enumProp(knowledgeModelTabs, "fields", bi("Data Model tab highlight. The field table stays visible.", "Data Model 标签高亮。字段表保持可见。")),
    tableId: enumProp(KNOWLEDGE_VIEW.model.tables.map((table) => table.id), "channel", bi("Active Data Model table.", "当前的 Data Model 表。")),
    onNavigate: callbackProp("onNavigate", "({id,params,href}) => void", { id: "knowledgeCreate", params: { mode: "edit", id: "business-term-gmv" }, href: "/assets/pages/knowledge-create.html?mode=edit&id=business-term-gmv" }, bi("The function runs when a crumb or Edit opens another page. The result has `id`, `params`, and `href`.", "面包屑或 Edit 要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。")),
    onOpen: callbackProp("onOpen", "({kind,recordId}) => void", { kind: "versions", recordId: "business-term-gmv" }, bi("The function runs when the user opens versions. The result has `kind` and `recordId`.", "用户打开版本时，会调用这个函数。结果里有 `kind` 和 `recordId`。")),
    onAction: callbackProp("onAction", "({id,recordId}) => void", { id: "preview", recordId: "channel-data-model" }, bi("The function runs when the user starts a Data Model action. The result has `id` and `recordId`.", "用户启动一项 Data Model 操作时，会调用这个函数。结果里有 `id` 和 `recordId`。")),
    onChange: callbackProp("onChange", "({name,id?,value}) => void", { name: "query", value: "Channel" }, bi("The function runs at each Data Model field change. The result has `name` and `value`. `id` is present for a field name.", "Data Model 字段每次变化都会调用这个函数。结果里有 `name` 和 `value`。改字段名时还会有 `id`。")),
    onSelect: callbackProp("onSelect", "({kind,id}) => void", { kind: "tab", id: "basic" }, bi("The function runs when the user selects a Data Model group, table, or tab. The result has `kind` and `id`.", "用户选择 Data Model 的分组、表或标签时，会调用这个函数。结果里有 `kind` 和 `id`。")),
    onCancel: callbackProp("onCancel", "({reason,recordId}) => void", { reason: "button", recordId: "business-term-gmv" }, bi("The function runs when the user closes an overlay. The result has `reason` and `recordId`.", "用户关闭覆盖层时，会调用这个函数。结果里有 `reason` 和 `recordId`。")),
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
