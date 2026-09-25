import React from "react";
import { DATA_MODEL_DOMAINS } from "./data-model-domains.js";

/**
 * Deterministic demo state for the Data Model browser —
 * `useDataModelDemo` mirrors assets/js/knowledge/data-model-browser.js: the
 * domain sidebar (search + selection), the Basic information / Relationship
 * graph tabs, the pan/zoom graph viewport and the table detail dialog
 * (Field Details / Data Preview).
 */

/* field-library.js opens the Report Context drawer from these names. */
const REPORT_CONTEXT_BY_DOMAIN = {
  "business-data": "city-report-context",
  "finance-analysis": "abo-report-context",
  "social-media": "rednote-report-context",
};

const REPORT_CONTEXT_BY_REPORT = {
  "City Strategy": "city-report-context",
  "4P Report": "fourp-report-context",
  "Customer Daily Tracking": "customer-report-context",
  ABO: "abo-report-context",
  "Rednote Tracking": "rednote-report-context",
  "OTT / OLV": "ottolv-report-context",
};

/* data-model-browser.js previewValue() — deterministic fake preview data. */
function previewValue(field, index) {
  const key = String(field.field || "").toLowerCase();
  if (/date|time|day|month|quarter|year/.test(key)) return `2026-09-${String(index + 1).padStart(2, "0")}`;
  if (/rate|share|ratio|pct|percent|score|sentiment/.test(key)) return `${(12 + index * 0.8).toFixed(1)}%`;
  if (/spend|gmv|value|amount|cost|revenue|sales|profit/.test(key))
    return `CNY ${(1200 + index * 86).toLocaleString("en-US")}`;
  if (/count|orders|buyers|clicks|impressions|conversions|visits|likes|comments|mentions|reach|quantity|members/.test(key))
    return String((index + 1) * 120);
  if (/_id$|id$/.test(key)) return String(1000 + index);
  return `${field.name} ${index + 1}`;
}

/* data-model-browser.js fieldFormat() — also used by the graph node field
   rows, so it's exported for the view. */
export function dataModelFieldFormat(field) {
  const key = String(field.field || "").toLowerCase();
  if (field.fieldType === "Date" || /date|time/.test(key)) return "date";
  if (field.fieldType === "Identifier" || /_id$|id$/.test(key)) return "bigint";
  if (field.fieldType === "Measure") {
    if (field.unit === "%") return "decimal(8,2)";
    return "decimal(16,2)";
  }
  return "varchar(64)";
}

/* Fixed graph layout — data-model-browser.js positions nodes via dm-node-N
   classes and draws relations over five fixed bezier paths. */
const GRAPH_PATHS = [
  "M300 420 C390 420, 390 175, 455 175",
  "M300 440 C390 440, 390 455, 455 455",
  "M300 460 C390 460, 390 735, 455 735",
  "M300 480 C650 480, 650 280, 925 280",
  "M300 500 C650 500, 650 650, 925 650",
];
const GRAPH_WIDTH = 1200;
const GRAPH_HEIGHT = 920;
const PREVIEW_ROWS = 10;

const DEFAULT_STRINGS = {
  searchLabel: "Search data model",
  searchPlaceholder: "Search data model",
  basicTab: "Basic information",
  graphTab: "Relationship graph",
  synonymsLabel: "Synonyms",
  relatedReportsLabel: "Related reports",
  enabled: "Enabled",
  disabled: "Disabled",
  emptyDomains: "No matching data models.",
  tablesUnit: "tables",
  none: "None",
  fact: "Fact",
  dimension: "Dimension",
  fieldDetails: "Field Details",
  dataPreview: "Data Preview",
  closeTable: "Close table detail",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  fitGraph: "Fit graph",
  fieldColumn: "Field",
  nameColumn: "Name",
  synonymsColumn: "Synonyms",
  unitColumn: "Unit",
  tabsAria: "Data model tabs",
  listAria: "Data models",
  graphToolsAria: "Relationship graph zoom controls",
  tableTabsAria: "Table detail tabs",
  relatedAria: (report) => `Open ${report} Report Context`,
};

/**
 * @param {object} props
 * @param {Array<object>} [props.domains] catalog — defaults to the ported
 *   `domains[]` fixture (hidden domains are filtered out).
 * @param {object} [props.strings]
 * @param {string} [props.query] initial sidebar search
 * @param {string} [props.selectedDomainId]
 * @param {"basic"|"graph"} [props.activeTab="basic"]
 * @param {string|null} [props.tableId] open table drawer
 * @param {"fields"|"preview"} [props.drawerTab="fields"]
 * @param {(id: string) => void} [props.onOpenReportContext] related-report
 *   button — the original dispatches `reportcontext:view` (opens the fm
 *   Report Context drawer without changing the active type).
 * @param {(domain: object) => void} [props.onSelectDomain]
 * @param {(tab: string) => void} [props.onTabChange]
 * @param {(table: object) => void} [props.onOpenTable] / [props.onCloseTable]
 * @param {(tab: string) => void} [props.onDrawerTab]
 */
export function useDataModelDemo(props = {}) {
  const strings = { ...DEFAULT_STRINGS, ...(props.strings || {}) };
  const domains = React.useMemo(
    () => (props.domains || DATA_MODEL_DOMAINS).filter((domain) => !domain.hidden),
    [props.domains],
  );

  const [query, setQuery] = React.useState(props.query || "");
  const [selectedDomainId, setSelectedDomainId] = React.useState(props.selectedDomainId || null);
  const [activeTab, setActiveTab] = React.useState(props.activeTab || "basic");
  const [tableId, setTableId] = React.useState(props.tableId ?? null);
  const [drawerTab, setDrawerTab] = React.useState(props.drawerTab || "fields");

  const queryText = query.trim().toLowerCase();
  const visibleDomains = queryText
    ? domains.filter((domain) =>
        [domain.name, domain.description, domain.businessDescription, (domain.synonyms || []).join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(queryText),
      )
    : domains;

  const domain =
    domains.find((item) => item.id === selectedDomainId) || visibleDomains[0] || domains[0] || null;
  const table =
    (domain?.tables || []).find((item) => item.id === tableId) || null;
  const drawerTable = tableId ? table || domain?.tables?.[0] || null : null;

  /* fitGraph(): scale the 1200×920 canvas into the panel — the view measures
     its canvas width and calls fit() on mount/tab switch. */
  const [graph, setGraph] = React.useState({ scale: 1, x: 0, y: 0 });
  const fit = React.useCallback((width) => {
    setGraph(() => {
      const scale = Math.min(1, Math.max(0.42, (width - 36) / GRAPH_WIDTH));
      return { scale, x: Math.max(18, (width - GRAPH_WIDTH * scale) / 2), y: 18 };
    });
  }, []);
  const zoom = React.useCallback((delta, center) => {
    setGraph((prev) => {
      const next = Math.min(1.5, Math.max(0.35, prev.scale + delta));
      const [cx, cy] = center || [null, null];
      if (cx === null) return { ...prev, scale: next };
      return {
        scale: next,
        x: cx - (cx - prev.x) * (next / prev.scale),
        y: cy - (cy - prev.y) * (next / prev.scale),
      };
    });
  }, []);
  const pan = React.useCallback((dx, dy) => {
    setGraph((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const reportContextId = (domainObj, report) =>
    REPORT_CONTEXT_BY_REPORT[report] || REPORT_CONTEXT_BY_DOMAIN[domainObj?.id] || "city-report-context";

  const selectDomain = (id) => {
    setSelectedDomainId(id);
    setActiveTab("basic");
    setTableId(null);
    props.onSelectDomain?.(domains.find((item) => item.id === id) || null);
  };

  const openTable = (id) => {
    setTableId(id);
    setDrawerTab("fields");
    props.onOpenTable?.(domain?.tables?.find((item) => item.id === id) || null);
  };

  const closeTable = () => {
    setTableId(null);
    props.onCloseTable?.();
  };

  /* Graph contents — central fact node + up to 5 other tables, relations
     mapped to the fixed bezier paths. */
  const central = (domain?.tables || []).find((item) => item.type === "fact") || domain?.tables?.[0] || null;
  const graphNodes = central ? [central, ...(domain?.tables || []).filter((item) => item.id !== central.id).slice(0, 5)] : [];
  const graphLinks = (domain?.relations || []).map((relation, index) => ({
    ...relation,
    path: GRAPH_PATHS[index % GRAPH_PATHS.length],
  }));

  return {
    strings,
    domains: visibleDomains,
    domain,
    query,
    onQueryChange: (value) => setQuery(typeof value === "string" ? value : value?.value || ""),
    onSelectDomain: selectDomain,
    activeTab,
    onTabChange: (tab) => {
      setActiveTab(tab);
      props.onTabChange?.(tab);
    },
    graph,
    graphNodes,
    graphLinks,
    centralId: central?.id || null,
    graphSize: { width: GRAPH_WIDTH, height: GRAPH_HEIGHT },
    onGraphFit: fit,
    onGraphZoom: zoom,
    onGraphPan: pan,
    drawer: drawerTable
      ? {
          table: drawerTable,
          isFact: drawerTable.type === "fact",
          tab: drawerTab,
          fields: drawerTable.fields || [],
          previewRows: Array.from({ length: PREVIEW_ROWS }, (_, index) =>
            (drawerTable.fields || []).map((field) => previewValue(field, index)),
          ),
          fieldFormat: dataModelFieldFormat,
        }
      : null,
    fieldFormat: dataModelFieldFormat,
    onDrawerTab: (tab) => {
      setDrawerTab(tab);
      props.onDrawerTab?.(tab);
    },
    onOpenTable: openTable,
    onCloseTable: closeTable,
    reportContextId,
    onOpenReportContext: (id) => props.onOpenReportContext?.(id),
  };
}
