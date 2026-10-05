import React from "react";
import { KNOWLEDGE_VIEW } from "../../../demo/content/knowledge-view.js";
import { useKnowledgeViewDemo } from "../../../demo/knowledge-view-demo.js";
import { callbackProp, enumProp, bi } from "../../../lib/story-helpers.js";
import { KnowledgeDetail, knowledgeDetailTypes, knowledgeModelActions, knowledgeModelGroups, knowledgeModelTabs } from "./index.jsx";

const ID_BY_TYPE = {
  Principles: "investment-principles",
  "Business Term": "business-term-gmv",
  "Data Model": "channel-data-model",
  "Scenario Reporting": "scenario-channel-performance",
};

function DetailStory(args) {
  const demo = useKnowledgeViewDemo({ content: KNOWLEDGE_VIEW, recordId: ID_BY_TYPE[args.type], group: args.group, tab: args.tab, overlay: args.action === "none" ? null : args.action, onNavigate: args.onNavigate, onAction: args.onAction, onOpen: args.onOpen, onChange: args.onChange, onSelect: args.onSelect, onCancel: args.onCancel });
  return <div style={{ padding: 32, background: "var(--mh-surface-subtle)", minHeight: "100vh" }}><KnowledgeDetail {...demo} /></div>;
}

export default {
  title: "Features/Knowledge View/Knowledge Detail", component: KnowledgeDetail, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: bi("This component shows one Knowledge View record. The four layouts are Principles, Business Term, Data Model, and Scenario Reporting. Each layout has its own sections and actions. Business Term and Principles can open a version drawer. Scenario Reporting can open a versions notice. Data Model has a table list, a field table, and action notices. This is Knowledge View. It is not the Scenario Detail page and not Skill Library.", "这个组件显示一条 Knowledge View 记录。四种布局是 Principles、Business Term、Data Model 和 Scenario Reporting。每种布局有自己的分区和操作。Business Term 和 Principles 可以打开版本抽屉。Scenario Reporting 可以打开版本说明。Data Model 有表列表、字段表和操作提示。这是 Knowledge View。它不是 Scenario Detail 页，也不是 Skill Library。") } } },
  args: { type: "Business Term", group: "entity", tab: "fields", action: "none" },
  argTypes: {
    type: enumProp(knowledgeDetailTypes, "Business Term", bi("One of the four Knowledge View layouts.", "四种 Knowledge View 布局之一。")),
    group: enumProp(knowledgeModelGroups, "entity", bi("Data Model group. Use `entity` or `event`.", "Data Model 分组。取 `entity` 或 `event`。")),
    tab: enumProp(knowledgeModelTabs, "fields", bi("Data Model tab. Use `basic` or `fields`.", "Data Model 标签页。取 `basic` 或 `fields`。")),
    action: enumProp(["none", ...knowledgeModelActions], "none", bi("Data Model notice. `none` hides the notice. Other values open the done dialog for that action.", "Data Model 提示。`none` 隐藏提示。其他值会打开该操作的完成对话框。")),
    onNavigate: callbackProp("onNavigate", "({id,params,href}) => void", { id: "knowledge", params: {}, href: "/assets/pages/knowledge.html" }, bi("The function runs when the user follows a breadcrumb or an edit link. The result has `id`, `params`, and `href`.", "用户点击面包屑或编辑链接时会调用这个函数。结果里带有 `id`、`params` 和 `href`。")),
    onAction: callbackProp("onAction", "({id,recordId}) => void", { id: "preview", recordId: "channel-data-model" }, bi("The function runs when the user uses Preview, Smart, Export, or Edit on Data Model. The result has `id` and `recordId`.", "用户在 Data Model 上使用 Preview、Smart、Export 或 Edit 时会调用这个函数。结果里带有 `id` 和 `recordId`。")),
    onOpen: callbackProp("onOpen", "({kind,recordId}) => void", { kind: "versions", recordId: "business-term-gmv" }, bi("The function runs when the user opens versions. For Scenario Reporting, `kind` is `scenario-versions`. The result has `kind` and `recordId`.", "用户打开版本时会调用这个函数。Scenario Reporting 的 `kind` 是 `scenario-versions`。结果里带有 `kind` 和 `recordId`。")),
    onChange: callbackProp("onChange", "({name,id?,value}) => void", { name: "query", value: "date" }, bi("The function runs when a Data Model field, the table search, or a Principles section changes. The result has `name` and `value`. Some changes also have `id`.", "Data Model 字段、表搜索或 Principles 分区变化时会调用这个函数。结果里带有 `name` 和 `value`。有些变化还带有 `id`。")),
    onSelect: callbackProp("onSelect", "({kind,id}) => void", { kind: "group", id: "event" }, bi("The function runs when the user selects a Data Model group, table, or tab. The result has `kind` and `id`.", "用户选择 Data Model 的分组、表或标签页时会调用这个函数。结果里带有 `kind` 和 `id`。")),
    onCancel: callbackProp("onCancel", "({reason,recordId}) => void", { reason: "escape", recordId: "channel-data-model" }, bi("The function runs when a drawer or notice closes. The result has `reason` and `recordId`.", "抽屉或提示关闭时会调用这个函数。结果里带有 `reason` 和 `recordId`。")),
  },
};

export const Detail = { render: DetailStory };
