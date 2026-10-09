import React from "react";
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
          bi("This component is the Data Model view on AI Interpreter. The left side lists domains. The user can search names, descriptions, and synonyms. Basic information shows the domain name, Enabled or Disabled, synonym chips, and related reports. A related report calls `onOpenReportContext` with a Report Context id. The page can open the Report Context drawer without leaving Data Model. Relationship graph shows fact and dimension tables as nodes. Dashed curves join the nodes. The user can pan and zoom the canvas. A click on a node opens the table dialog. Field Details includes a Unit column on fact tables. Data Preview shows ten generated rows. In this story the demo hook owns the state (search, selected domain, tab, open table). Controls set only the starting values, so changing a Control starts a fresh view. The Actions panel logs the payloads the view sends: ids and strings, not the hook's objects.", "这是 AI Interpreter 上的 Data Model 视图。左侧列出各个域。用户可以搜索名称、说明和同义词。Basic information 显示域名、Enabled 或 Disabled、同义词标签和关联报表。关联报表会调用 `onOpenReportContext`，参数是 Report Context 的 id。页面可以打开 Report Context 抽屉，而不离开 Data Model。Relationship graph 把事实表和维度表显示为节点。虚线曲线连接这些节点。用户可以平移和缩放画布。点击节点会打开表对话框。Field Details 在事实表上包含 Unit 列。Data Preview 显示十行生成的数据。在本故事里，状态（搜索、选中的域、标签页、打开的表）由 demo hook 持有。Controls 只设置起始值，所以修改 Control 会重新创建视图。Actions 面板记录的是视图发出的参数：id 和字符串，而不是 hook 里的对象。"),
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
      description: bi("Domain cards in the sidebar. The Demo catalog has D2C Insight, DC Media Performance, Customer Growth, and DG Media Tracking. Customer Growth has `hidden: true`. The Demo hook does not pass hidden domains to this component.", "侧栏中的域卡片。Demo 目录含 D2C Insight、DC Media Performance、Customer Growth 和 DG Media Tracking。Customer Growth 的 `hidden` 为 `true`。Demo hook 不会把隐藏的域传给这个组件。"),
      control: false,
    }),
    strings: prop("object", { description: bi("All copy. Tabs, labels, and button text.", "全部文案。标签页、标签和按钮文字。"), control: false }),
    query: prop("string", { defaultValue: "", description: bi("Search text in the domain sidebar.", "域侧栏中的搜索文字。") }),
    selectedDomainId: prop("string", { description: bi("Id of the selected domain. If you do not set it, the first visible domain is selected.", "当前选中域的 id。如果不设置，则选中第一个可见域。") }),
    activeTab: prop('"basic" | "graph"', { defaultValue: "basic", control: "inline-radio", options: ["basic", "graph"] }),
    tableId: prop("string | null", { defaultValue: null, description: bi("Opens the table dialog for this table id.", "打开该表 id 的表对话框。") }),
    drawerTab: prop('"fields" | "preview"', { defaultValue: "fields", control: "inline-radio", options: ["fields", "preview"] }),
    onQueryChange: callbackProp("onQueryChange", "(value: string) => void", "inventory", bi("The function runs when the domain search changes. The argument is the search string.", "域搜索变化时会调用这个函数。参数是搜索字符串。")),
    onSelectDomain: callbackProp("onSelectDomain", "(id: string) => void", "finance-analysis", bi("The function runs when the user selects a domain card. The argument is the domain `id`. The tab goes back to Basic information.", "用户选中域卡片时会调用这个函数。参数是域的 `id`。标签页回到 Basic information。")),
    onTabChange: callbackProp("onTabChange", "(tab) => void", "graph", bi("The function runs when the user selects Basic information or Relationship graph. The argument is `basic` or `graph`.", "用户选择 Basic information 或 Relationship graph 时会调用这个函数。参数是 `basic` 或 `graph`。")),
    onOpenTable: callbackProp("onOpenTable", "(id: string) => void", "fact_sales_order", bi("The function runs when the user clicks a graph node. The argument is the table `id`.", "用户点击图节点时会调用这个函数。参数是表的 `id`。")),
    onCloseTable: callbackProp("onCloseTable", "(event?: { reason: string }) => void", { reason: "scrim" }, bi("The function runs when the table dialog closes. The result has `reason`: `scrim`, `escape`, or `button`.", "表对话框关闭时会调用这个函数。结果里带有 `reason`：`scrim`、`escape` 或 `button`。")),
    onDrawerTab: callbackProp("onDrawerTab", "(tab) => void", "preview", bi("The function runs when the user selects Field Details or Data Preview. The argument is `fields` or `preview`.", "用户选择 Field Details 或 Data Preview 时会调用这个函数。参数是 `fields` 或 `preview`。")),
    onGraphZoom: callbackProp("onGraphZoom", "(delta: number, center?: [x, y]) => void", 0.12, bi("The function runs when the user uses the zoom buttons or the wheel.", "用户使用缩放按钮或滚轮时会调用这个函数。")),
    onGraphPan: callbackProp("onGraphPan", "(dx: number, dy: number) => void", [12, 8], bi("The function runs when the user drags the canvas.", "用户拖动画布时会调用这个函数。")),
    onGraphFit: callbackProp("onGraphFit", "(width: number) => void", 640, bi("The function runs when the user clicks Fit. It also runs when the graph tab becomes active.", "用户点击 Fit 时会调用这个函数。图标签页变为当前时也会调用。")),
    onOpenReportContext: callbackProp("onOpenReportContext", "(id: string) => void", "city-report-context", bi("The function runs when the user clicks a related report. The argument is the Report Context id. The page can open the Report Context drawer without leaving Data Model.", "用户点击关联报表时会调用这个函数。参数是 Report Context 的 id。页面可以打开 Report Context 抽屉，而不离开 Data Model。")),
  },
  render: function DataModelStory(args) {
    /* The demo hook reads query, domain, tab and table settings only when it
       starts, so a Control change starts a fresh view (the standalone Data
       Model page story does the same). */
    const key = [args.query, args.selectedDomainId, args.activeTab, args.tableId, args.drawerTab].join("|");
    return <DataModelStoryView key={key} args={args} />;
  },
};

/* The hook's own callbacks carry objects ({ value }, a domain, a table). The
   story maps them back to the view's documented payloads so the Actions panel
   shows exactly what the view sends, and forwards the graph gestures the hook
   handles itself. */
function DataModelStoryView({ args }) {
  const argsRef = React.useRef(args);
  argsRef.current = args;
  const viewProps = useDataModelDemo({
    ...args,
    onQueryChange: ({ value }) => args.onQueryChange?.(value),
    onSelectDomain: (domain) => args.onSelectDomain?.(domain?.id),
    onOpenTable: (table) => args.onOpenTable?.(table?.id),
  });
  /* The view fits the graph in an effect that depends on `onGraphFit`, so the
     wrappers must keep their identity between renders (the hook's own are
     stable). */
  const { onGraphFit, onGraphZoom, onGraphPan } = viewProps;
  const fit = React.useCallback((width) => {
    onGraphFit(width);
    argsRef.current.onGraphFit?.(width);
  }, [onGraphFit]);
  const zoom = React.useCallback((delta, center) => {
    onGraphZoom(delta, center);
    argsRef.current.onGraphZoom?.(delta, center);
  }, [onGraphZoom]);
  const pan = React.useCallback((dx, dy) => {
    onGraphPan(dx, dy);
    argsRef.current.onGraphPan?.(dx, dy);
  }, [onGraphPan]);
  return <DataModelView {...viewProps} onGraphFit={fit} onGraphZoom={zoom} onGraphPan={pan} />;
}

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
