import React from "react";
import { callbackProp, enumProp, prop } from "../../lib/story-helpers.js";
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
  parameters: { layout: "fullscreen", docs: { description: { component: "Standalone P11 Data Model page composed from the P07 DataModelView. Three visible domains, search, relationship graph and the table detail dialog are source-backed; related-report clicks emit a callback but open no standalone drawer." } } },
  args: { query: "", selectedDomainId: "business-data", activeTab: "basic", tableId: null, drawerTab: "fields" },
  argTypes: {
    query: prop("string", { defaultValue: "", description: "Initial sidebar search." }),
    selectedDomainId: enumProp(domainIds, "business-data", "Active visible domain."),
    activeTab: enumProp(dataModelPageTabs, "basic", "Basic information or Relationship graph."),
    tableId: enumProp([null, ...tableIds], null, "Open table detail by ID."),
    drawerTab: enumProp(dataModelPageDrawerTabs, "fields", "Field Details or Data Preview."),
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
