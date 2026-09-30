import React from "react";
import { callbackProp, enumProp, prop, bi } from "../../lib/story-helpers.js";
import { DATA_MODEL_PAGE } from "../../demo/content/data-model-page.js";
import { useDataModelPageDemo, dataModelPageTabs, dataModelPageDrawerTabs } from "../../demo/data-model-page-demo.js";
import { DataModelPage } from "./index.jsx";

const domainIds = DATA_MODEL_PAGE.domains.filter((item) => !item.hidden).map((item) => item.id);
const tableIds = DATA_MODEL_PAGE.domains.flatMap((item) => item.tables || []).map((item) => item.id);

function StoryView({ args }) {
  const page = useDataModelPageDemo({ ...args, content: DATA_MODEL_PAGE });
  return <DataModelPage {...page} />;
}

function Story(args) {
  const key = [args.query, args.selectedDomainId, args.activeTab, args.tableId, args.drawerTab].join("|");
  return <StoryView key={key} args={args} />;
}

export default {
  title: "Pages", component: DataModelPage, tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { description: { component: bi("Standalone P11 Data Model page composed from the P07 DataModelView. Three visible domains, search, relationship graph and the table detail dialog are source-backed; related-report clicks emit a callback but open no standalone drawer.", "由 P07 DataModelView 组合而成的独立 P11 Data Model 页面。三个可见域、搜索、关系图和表详情对话框均以源页面为依据；点击关联报表会触发回调，但不会打开独立抽屉。") } } },
  args: { query: "", selectedDomainId: "business-data", activeTab: "basic", tableId: null, drawerTab: "fields" },
  argTypes: {
    query: prop("string", { defaultValue: "", description: bi("Initial sidebar search.", "初始侧栏搜索。") }),
    selectedDomainId: enumProp(domainIds, "business-data", bi("Active visible domain.", "当前激活的可见域。")),
    activeTab: enumProp(dataModelPageTabs, "basic", bi("Basic information or Relationship graph.", "Basic information 或 Relationship graph。")),
    tableId: enumProp([null, ...tableIds], null, bi("Open table detail by ID.", "按 ID 打开表详情。")),
    drawerTab: enumProp(dataModelPageDrawerTabs, "fields", bi("Field Details or Data Preview.", "Field Details 或 Data Preview。")),
    onNavigate: callbackProp("onNavigate", "({id,params,href}) => void", { id: "interpreter", params: {}, href: "/assets/pages/knowledge.html" }),
    onChange: callbackProp("onChange", "({name,value}) => void", { name: "query", value: "ABO" }),
    onSelect: callbackProp("onSelect", "({kind,id}) => void", { kind: "domain", id: "finance-analysis" }),
    onOpen: callbackProp("onOpen", "({kind,id}) => void", { kind: "table", id: "fact_sales_order" }),
    onCancel: callbackProp("onCancel", "({kind}) => void", { kind: "table" }),
  },
};

export const DataModelDefault = { name: "Data Model / default", render: Story };
export const DataModelDomain = { name: "Data Model / another domain", args: { selectedDomainId: "finance-analysis" }, render: Story };
export const DataModelSearchHit = { name: "Data Model / search match", args: { query: "ABO" }, render: Story };
export const DataModelSearchEmpty = { name: "Data Model / no search match", args: { query: "NO_SUCH_MODEL_123" }, render: Story };
export const DataModelGraph = { name: "Data Model / relationship graph", args: { activeTab: "graph" }, render: Story };
export const DataModelFactFields = { name: "Data Model / fact field details", args: { activeTab: "graph", tableId: "fact_sales_order" }, render: Story };
export const DataModelDimensionFields = { name: "Data Model / dimension field details", args: { activeTab: "graph", tableId: "dim_channel" }, render: Story };
export const DataModelPreview = { name: "Data Model / data preview", args: { activeTab: "graph", tableId: "fact_sales_order", drawerTab: "preview" }, render: Story };
