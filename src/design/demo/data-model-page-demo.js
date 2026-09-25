import { useDataModelDemo } from "./data-model-demo.js";
import { DATA_MODEL_PAGE } from "./content/data-model-page.js";

export const dataModelPageTabs = ["basic", "graph"];
export const dataModelPageDrawerTabs = ["fields", "preview"];

const PATHS = {
  home: "/index.html",
  cockpit: "/assets/pages/reports.html",
  "self-service": "/assets/pages/flexible.html",
  interpreter: "/assets/pages/knowledge.html",
  campaign: "/assets/pages/campaign.html",
  dataModel: "/assets/pages/data-model.html",
};

/** Original-demo links for P11; the host may inject its own resolver. */
export function dataModelPageHrefFor(id, params = {}) {
  const path = PATHS[id];
  if (!path) throw new Error(`Unknown Data Model route: ${id}`);
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
  return `${path}${query.size ? `?${query}` : ""}`;
}

/** Mirrors data-model-inline-1.js:1–7, preserving unrelated query parameters. */
export function normalizedDataModelSearch(search = "") {
  const params = new URLSearchParams(search);
  if (params.get("type") === "Data Model") return null;
  params.set("type", "Data Model");
  return `?${params}`;
}

/** Standalone P11 state composed from the existing P07 Data Model demo hook.
 * @param {object} props
 * @param {object} [props.content=DATA_MODEL_PAGE] All page shell copy and model records
 * @param {(id:string,params?:object)=>string} [props.hrefFor]
 * @param {(target:{id:string,params:object,href:string})=>void} [props.onNavigate]
 * @param {(change:{name:string,value:string})=>void} [props.onChange]
 * @param {(selection:{kind:string,id:string})=>void} [props.onSelect]
 * @param {(target:{kind:string,id:string})=>void} [props.onOpen]
 * @param {(target:{kind:string})=>void} [props.onCancel]
 */
export function useDataModelPageDemo(props = {}) {
  const content = props.content || DATA_MODEL_PAGE;
  const model = useDataModelDemo({
    domains: content.domains,
    strings: content.strings,
    query: props.query,
    selectedDomainId: props.selectedDomainId,
    activeTab: props.activeTab,
    tableId: props.tableId,
    drawerTab: props.drawerTab,
    onQueryChange: ({ value }) => props.onChange?.({ name: "query", value }),
    onSelectDomain: (domain) => props.onSelect?.({ kind: "domain", id: domain?.id }),
    onTabChange: (id) => props.onSelect?.({ kind: "tab", id }),
    onOpenTable: (table) => props.onOpen?.({ kind: "table", id: table?.id }),
    onCloseTable: () => props.onCancel?.({ kind: "table" }),
    onDrawerTab: (id) => props.onSelect?.({ kind: "drawer-tab", id }),
    onOpenReportContext: (id) => props.onOpen?.({ kind: "report-context", id }),
  });
  return {
    logo: content.logo,
    navigation: content.navigation,
    hrefFor: props.hrefFor || dataModelPageHrefFor,
    onNavigate: props.onNavigate,
    model,
  };
}
