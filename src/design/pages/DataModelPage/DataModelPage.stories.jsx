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
  parameters: { layout: "fullscreen", docs: { description: { component: bi("This page is Data Model. It is a standalone page. It reuses the Data Model view from AI Interpreter. To build this page, set domains, search, the relationship graph, and the table detail dialog. A related-report click runs `onOpen`. It does not open a second drawer.", "这是 Data Model 页面。它是独立页面，复用 AI Interpreter 里的 Data Model 视图。组合页面时，设置域、搜索、关系图和表详情对话框。点击关联报表会调用 `onOpen`，不会再打开一个抽屉。") } } },
  args: { query: "", selectedDomainId: "business-data", activeTab: "basic", tableId: null, drawerTab: "fields" },
  argTypes: {
    query: prop("string", { defaultValue: "", description: bi("Initial sidebar search.", "侧栏搜索的初始文字。") }),
    selectedDomainId: enumProp(domainIds, "business-data", bi("Active visible domain.", "当前可见的域。")),
    activeTab: enumProp(dataModelPageTabs, "basic", bi("Main tab. Values are basic and graph.", "主标签。取值是 basic 和 graph。")),
    tableId: enumProp([null, ...tableIds], null, bi("Open table detail by id. `null` keeps the dialog closed.", "按 id 打开表详情。`null` 表示对话框关闭。")),
    drawerTab: enumProp(dataModelPageDrawerTabs, "fields", bi("Table dialog tab. Values are fields and preview.", "表对话框的标签。取值是 fields 和 preview。")),
    onNavigate: callbackProp("onNavigate", "({id,params,href}) => void", { id: "interpreter", params: {}, href: "/assets/pages/knowledge.html" }, bi("The function runs when a nav link opens another page. The result has `id`, `params`, and `href`.", "导航要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。")),
    onChange: callbackProp("onChange", "({name,value}) => void", { name: "query", value: "ABO" }, bi("The function runs at each sidebar search change. The result has `name` and `value`.", "侧栏搜索每次变化都会调用这个函数。结果里有 `name` 和 `value`。")),
    onSelect: callbackProp("onSelect", "({kind,id}) => void", { kind: "domain", id: "finance-analysis" }, bi("The function runs when the user selects a domain, a main tab, or a drawer tab. The result has `kind` and `id`.", "用户选择域、主标签或抽屉标签时，会调用这个函数。结果里有 `kind` 和 `id`。")),
    onOpen: callbackProp("onOpen", "({kind,id}) => void", { kind: "table", id: "fact_sales_order" }, bi("The function runs when the user opens a table or a related report. The result has `kind` and `id`.", "用户打开一张表或一条关联报表时，会调用这个函数。结果里有 `kind` 和 `id`。")),
    onCancel: callbackProp("onCancel", "({kind}) => void", { kind: "table" }, bi("The function runs when the user closes the table dialog. The result has `kind`.", "用户关闭表对话框时，会调用这个函数。结果里有 `kind`。")),
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
