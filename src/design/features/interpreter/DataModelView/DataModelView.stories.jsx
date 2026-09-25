import { DATA_MODEL_DOMAINS } from "../../../demo/data-model-domains.js";
import { useDataModelDemo } from "../../../demo/data-model-demo.js";
import { callbackProp, prop } from "../../../lib/story-helpers.js";
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
          "Data Model knowledge type (data-model-browser.js `#dataModelOverview`): a domain sidebar (search over names, descriptions and synonyms + selectable domain cards), a Basic information card (name + status pill, synonym chips, related-report links that open the Report Context drawer via `reportcontext:view`), and a Relationship graph tab whose pannable/zoomable canvas renders the fact + dimension tables as fixed-slot nodes joined by dashed bezier links. Clicking a node opens the centered table detail dialog (Field Details with the fact-only Unit column, or the deterministic 10-row Data Preview). Driven by `useDataModelDemo` so canvas interactions are live.",
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
      description: "Domain catalog — the ported `domains[]` fixture (D2C Insight, DC Media Performance, Customer Growth [hidden], DG Media Tracking). Hidden entries never render.",
      control: false,
    }),
    strings: prop("object", { description: "All copy: tabs, labels, button text.", control: false }),
    query: prop("string", { defaultValue: "", description: "Initial sidebar search text." }),
    selectedDomainId: prop("string", { description: "Initially active domain id (defaults to the first visible domain)." }),
    activeTab: prop('"basic" | "graph"', { defaultValue: "basic", control: "inline-radio", options: ["basic", "graph"] }),
    tableId: prop("string | null", { defaultValue: null, description: "Opens the table detail dialog for this table id." }),
    drawerTab: prop('"fields" | "preview"', { defaultValue: "fields", control: "inline-radio", options: ["fields", "preview"] }),
    onQueryChange: callbackProp("onQueryChange", "(value: string) => void", "Sidebar search input change."),
    onSelectDomain: callbackProp("onSelectDomain", "(domain) => void", { id: "finance-analysis" }, "Domain card selected; resets the tab to Basic information."),
    onTabChange: callbackProp("onTabChange", "(tab) => void", "graph", "Basic information / Relationship graph tab switch."),
    onOpenTable: callbackProp("onOpenTable", "(table) => void", { id: "fact_sales_order" }, "Graph node click opens the table detail dialog."),
    onCloseTable: callbackProp("onCloseTable", "() => void", undefined, "Dialog dismissed (×, scrim, Escape)."),
    onDrawerTab: callbackProp("onDrawerTab", "(tab) => void", "preview", "Field Details / Data Preview switch."),
    onGraphZoom: callbackProp("onGraphZoom", "(delta: number, center?: [x, y]) => void", 0.12, "Zoom buttons or wheel."),
    onGraphPan: callbackProp("onGraphPan", "(dx: number, dy: number) => void", [12, 8], "Pointer drag on the canvas."),
    onGraphFit: callbackProp("onGraphFit", "(width: number) => void", 640, "Fit button, or automatically when the graph tab activates."),
    onOpenReportContext: callbackProp("onOpenReportContext", "(id: string) => void", "city-report-context", "Related-report button — the original dispatches `reportcontext:view`, opening the fm Report Context drawer without leaving the page."),
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
