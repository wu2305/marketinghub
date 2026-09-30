import { DATA_MODEL_DOMAINS } from "../../../demo/data-model-domains.js";
import { useDataModelDemo } from "../../../demo/data-model-demo.js";
import { callbackProp, prop, bi } from "../../../lib/story-helpers.js";
import { DataModelView } from "./index.jsx";

export default {
  title: "Features/Interpreter/Data model view",
  component: DataModelView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          bi("Data Model knowledge type (data-model-browser.js `#dataModelOverview`): a domain sidebar (search over names, descriptions and synonyms + selectable domain cards), a Basic information card (name + status pill, synonym chips, related-report links that open the Report Context drawer via `reportcontext:view`), and a Relationship graph tab whose pannable/zoomable canvas renders the fact + dimension tables as fixed-slot nodes joined by dashed bezier links. Clicking a node opens the centered table detail dialog (Field Details with the fact-only Unit column, or the deterministic 10-row Data Preview). Driven by `useDataModelDemo` so canvas interactions are live.", "Data Model 知识类型（data-model-browser.js 的 `#dataModelOverview`）：左侧域侧栏（可搜索名称、描述和同义词，含可选域卡片）、Basic information 卡片（名称加状态胶囊、同义词标签、通过 `reportcontext:view` 打开 Report Context 抽屉的关联报表链接），以及 Relationship graph 标签页——可平移/缩放的画布，将事实表与维度表渲染为固定位置的节点，以虚线贝塞尔曲线相连。点击节点会打开居中的表详情对话框（含仅事实表带 Unit 列的 Field Details，或确定性的 10 行 Data Preview）。由 `useDataModelDemo` 驱动，因此画布交互是实时的。"),
      },
    },
  },
  args: {
    domains: DATA_MODEL_DOMAINS,
    query: "",
    selectedDomainId: undefined,
    activeTab: "basic",
    tableId: null,
    drawerTab: "fields",
  },
  argTypes: {
    domains: prop("Array<DataModelDomain>", {
      description: bi("Domain catalog — the ported `domains[]` fixture (D2C Insight, DC Media Performance, Customer Growth [hidden], DG Media Tracking). Hidden entries never render.", "域目录：移植的 `domains[]` 夹具（D2C Insight、DC Media Performance、Customer Growth [隐藏]、DG Media Tracking）。隐藏条目不会渲染。"),
      control: false,
    }),
    strings: prop("object", { description: bi("All copy: tabs, labels, button text.", "全部文案：标签页、标签、按钮文字。"), control: false }),
    query: prop("string", { defaultValue: "", description: bi("Initial sidebar search text.", "初始侧栏搜索文字。") }),
    selectedDomainId: prop("string", { description: bi("Initially active domain id (defaults to the first visible domain).", "初始激活的域 id（默认为第一个可见域）。") }),
    activeTab: prop('"basic" | "graph"', { defaultValue: "basic", control: "inline-radio", options: ["basic", "graph"] }),
    tableId: prop("string | null", { defaultValue: null, description: bi("Opens the table detail dialog for this table id.", "打开该表 id 的表详情对话框。") }),
    drawerTab: prop('"fields" | "preview"', { defaultValue: "fields", control: "inline-radio", options: ["fields", "preview"] }),
    onQueryChange: callbackProp("onQueryChange", "(value: string) => void", "Sidebar search input change."),
    onSelectDomain: callbackProp("onSelectDomain", "(domain) => void", { id: "finance-analysis" }, bi("Domain card selected; resets the tab to Basic information.", "选中域卡片；同时将标签页重置为 Basic information。")),
    onTabChange: callbackProp("onTabChange", "(tab) => void", "graph", bi("Basic information / Relationship graph tab switch.", "Basic information / Relationship graph 标签页切换。")),
    onOpenTable: callbackProp("onOpenTable", "(table) => void", { id: "fact_sales_order" }, bi("Graph node click opens the table detail dialog.", "点击图节点会打开表详情对话框。")),
    onCloseTable: callbackProp("onCloseTable", "() => void", undefined, bi("Dialog dismissed (×, scrim, Escape).", "对话框被关闭（×、遮罩、Escape）。")),
    onDrawerTab: callbackProp("onDrawerTab", "(tab) => void", "preview", bi("Field Details / Data Preview switch.", "Field Details / Data Preview 切换。")),
    onGraphZoom: callbackProp("onGraphZoom", "(delta: number, center?: [x, y]) => void", 0.12, bi("Zoom buttons or wheel.", "缩放按钮或滚轮。")),
    onGraphPan: callbackProp("onGraphPan", "(dx: number, dy: number) => void", [12, 8], bi("Pointer drag on the canvas.", "在画布上拖动指针。")),
    onGraphFit: callbackProp("onGraphFit", "(width: number) => void", 640, bi("Fit button, or automatically when the graph tab activates.", "Fit 按钮，或图标签页激活时自动触发。")),
    onOpenReportContext: callbackProp("onOpenReportContext", "(id: string) => void", "city-report-context", bi("Related-report button — the original dispatches `reportcontext:view`, opening the fm Report Context drawer without leaving the page.", "关联报表按钮：原始 Demo 会派发 `reportcontext:view`，在不离开当前页面的情况下打开 fm Report Context 抽屉。")),
  },
  render: function DataModelStory(args) {
    const viewProps = useDataModelDemo(args);
    return <DataModelView {...viewProps} />;
  },
};

export const Default = {};

/** Search matches name/description/business description/synonyms —
    "growth" isolates… nothing here (Customer Growth is hidden). */
export const FilteredEmpty = {
  args: { query: "inventory" },
};

export const GraphTab = {
  args: { activeTab: "graph" },
};

/** Node click — the centered Field Details dialog for the fact table. */
export const TableDrawer = {
  args: { activeTab: "graph", tableId: "fact_sales_order" },
};

/** Data Preview — 10 deterministic rows generated from the field types. */
export const TableDrawerPreview = {
  args: { activeTab: "graph", tableId: "fact_sales_order", drawerTab: "preview" },
};
