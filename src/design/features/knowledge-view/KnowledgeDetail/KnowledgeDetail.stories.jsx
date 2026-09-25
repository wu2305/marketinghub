import React from "react";
import { KNOWLEDGE_VIEW } from "../../../demo/content/knowledge-view.js";
import { useKnowledgeViewDemo } from "../../../demo/knowledge-view-demo.js";
import { callbackProp, enumProp } from "../../../lib/story-helpers.js";
import { KnowledgeDetail, knowledgeDetailTypes, knowledgeModelActions, knowledgeModelGroups, knowledgeModelTabs } from "./index.jsx";

const ID_BY_TYPE = {
  Principles: "investment-principles",
  "Business Term": "business-term-gmv",
  "Data Model": "channel-data-model",
  "Scenario Reporting": "scenario-channel-performance",
};

function DetailStory(args) {
  const demo = useKnowledgeViewDemo({ content: KNOWLEDGE_VIEW, recordId: ID_BY_TYPE[args.type], group: args.group, tab: args.tab, overlay: args.action === "none" ? null : args.action, onNavigate: args.onNavigate, onAction: args.onAction, onOpen: args.onOpen, onChange: args.onChange, onSelect: args.onSelect, onCancel: args.onCancel });
  return <div style={{ padding: 32, background: "var(--mh-page-bg)", minHeight: "100vh" }}><KnowledgeDetail {...demo} /></div>;
}

export default {
  title: "Features/Knowledge View/Knowledge Detail", component: KnowledgeDetail, tags: ["autodocs"], parameters: { layout: "fullscreen", docs: { description: { component: "Four source-backed P09 detail compositions. Select a type and interact with version, model, and navigation controls; callbacks emit named payload objects." } } },
  args: { type: "Business Term", group: "entity", tab: "fields", action: "none" },
  argTypes: {
    type: enumProp(knowledgeDetailTypes, "Business Term", "Select one of the four active P09 compositions"),
    group: enumProp(knowledgeModelGroups, "entity", "Data Model group"),
    tab: enumProp(knowledgeModelTabs, "fields", "Data Model tab"),
    action: enumProp(["none", ...knowledgeModelActions], "none", "Data Model notice"),
    onNavigate: callbackProp("onNavigate", "({id,params,href}) => void", { id: "knowledge", params: {}, href: "/assets/pages/knowledge.html" }),
    onAction: callbackProp("onAction", "({id,recordId}) => void", { id: "preview", recordId: "channel-data-model" }),
    onOpen: callbackProp("onOpen", "({kind,recordId}) => void", { kind: "versions", recordId: "business-term-gmv" }),
    onChange: callbackProp("onChange", "({name,id?,value}) => void", { name: "query", value: "date" }),
    onSelect: callbackProp("onSelect", "({kind,id}) => void", { kind: "group", id: "event" }),
    onCancel: callbackProp("onCancel", "({reason,recordId}) => void", { reason: "escape", recordId: "channel-data-model" }),
  },
};

export const Detail = { render: DetailStory };
