/**
 * Demo state container for AiInterpreterPage — the deterministic local
 * stand-in for knowledge/workspace.js's type state. Filtering and pagination
 * are pure exported functions; the page component only dispatches
 * `views[type.view]` and renders the shell (S8 + R4 contract: every type view
 * receives already-filtered, already-paginated rows plus controlled
 * query/filters/page state and callbacks). No Storybook imports; any host can
 * drive the page the same way.
 */
import React from "react";
import { useSynced } from "./use-synced.js";
import { useBusinessTermDemo } from "./business-term-demo.js";
import { useDataModelDemo } from "./data-model-demo.js";
import { useFieldLibraryDemo } from "./field-library-demo.js";
import { useScenarioDemo } from "./scenario-demo.js";
import { useWorkspaceAssistantDemo } from "./workspace-assistant-demo.js";
import { FieldLibraryDrawer } from "../features/interpreter/FieldLibraryView/index.jsx";
import { demoHrefFor, demoTargetForHref } from "./navigation.js";
import { useToast } from "./use-toast.js";

const EMPTY_ARRAY = [];

/** Deterministic knowledge answer from knowledge/workspace.js:createAnswer(). */
export function buildInterpreterAnswer(query) {
  return {
    query,
    variant: "workspace",
    banner: "AI Response",
    context: "Context: Knowledge Base",
    body: "Based on the governed knowledge, I've identified the following insights.",
    findings: [
      { label: "Related Assets", detail: "Found 3 knowledge assets connected to your query in the Knowledge Base." },
      { label: "Metric Definition", detail: "Attributed ROI is defined as net revenue attributed to marketing divided by total marketing cost." },
      { label: "Data Quality", detail: "2 metrics show incomplete backflow and need review." },
    ],
    sources: [
      "Knowledge Base / Metrics Dictionary",
      "Data Model / City Strategy",
      "Governed Definitions",
    ],
  };
}

/** matchingPrinciples() in types.js: category set + free-text over category/title/description. */
export function filterPrinciples(items, { query = "", selectedCategories = [] } = {}) {
  const normalized = query.trim().toLowerCase();
  return (items || []).filter(
    (item) =>
      (!selectedCategories.length || selectedCategories.includes(item.category)) &&
      (!normalized || [item.category, item.title, item.description].join(" ").toLowerCase().includes(normalized)),
  );
}

/** Shared page clamp + slice used by every paginated type view. */
export function paginateRows(rows, { page = 1, pageSize = 10 } = {}) {
  const pages = Math.max(1, Math.ceil((rows || []).length / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  const first = (current - 1) * pageSize;
  return { rows: (rows || []).slice(first, first + pageSize), total: (rows || []).length, page: current };
}

/**
 * Fixed hook order preserves each type's local state while inactive hooks
 * skip view derivation. Only the active view (and an open related-report
 * overlay) becomes page props. Host callbacks carry the active typeId.
 * A `notice` key (the host's `?notice=` value) looked up in `notices` shows a
 * three-second Toast on arrival, e.g. after a governed form's Submit.
 * @param {object} props type/record seeds, per-view content, `notice` + `notices` and host callbacks
 * @returns {{view: object|null, overlay: React.ReactNode, toast: string, assistant: object, skillFlow?: object}} page view slots, toast and assistant flow
 */
export function useInterpreterDemo(props) {
  const hrefFor = props.hrefFor || demoHrefFor;
  const targetForHref = props.targetForHref;
  const scenarioInputRecords = props.scenarioReports?.records;
  const [query, setQuery] = useSynced(props.query ?? "");
  const type = (props.types || []).find((item) => item.id === props.activeType);
  const activeView = type?.view;
  const typeId = type?.id || props.activeType || "overview";
  const typed = (callback) => (event) => callback?.(
    event && typeof event === "object" && !Array.isArray(event)
      ? { ...event, typeId }
      : { typeId, value: event },
  );
  const navigate = (event) => {
    const payload = event && typeof event === "object" ? event : { href: event };
    const target = props.targetForHref?.(payload.href) || demoTargetForHref(payload.href);
    props.onNavigate?.({ ...payload, ...(target || {}), params: target?.params || {}, typeId });
  };
  const [selectedCategories, setSelectedCategories] = useSynced(props.principles?.selectedCategories ?? EMPTY_ARRAY);
  const [principlePage, setPrinciplePage] = useSynced(props.principles?.page ?? 1);
  const [principlePageSize, setPrinciplePageSize] = useSynced(props.principles?.pageSize ?? 10);
  const [principleExpanded, setPrincipleExpanded] = useSynced(props.principles?.expanded ?? EMPTY_ARRAY);
  /* reportcontext:view — the Data Model related-report buttons peek the fm
     Report Context drawer without leaving the active type page. */
  const [rcPeek, setRcPeek] = React.useState(null);

  /* types.js: switching knowledge types resets the library filters and the
     principles page (query and category picks persist). */
  const activeType = props.activeType;
  const prevType = React.useRef(activeType);
  React.useEffect(() => {
    if (prevType.current === activeType) return;
    prevType.current = activeType;
    setPrinciplePage(1);
    setRcPeek(null);
  }, [activeType, setPrinciplePage]);

  const businessTerms = useBusinessTermDemo({
    ...props.businessTermLibrary,
    createHref: hrefFor("knowledge-create", { type: "Business Term" }),
    editHref: (id) => hrefFor("knowledge-create", { type: "Business Term", mode: "edit", id }),
    active: activeView === "business-term",
    onNavigate: navigate,
    onQueryChange: typed(props.onQueryChange),
    onFilterToggle: typed(props.onFilterToggle),
    onPage: typed(props.onPage),
    onPageSize: typed(props.onPageSize),
    onOpen: typed(props.onOpen),
    onCloseDetail: typed(props.onCloseDetail),
    onAction: typed(props.onAction),
    onDialogConfirm: typed(props.onDialogConfirm),
    onDialogCancel: typed(props.onDialogCancel),
    onCreate: typed(props.onCreate),
  });

  /* field-library.js #fmLibrary — the shared card-grid view serving the four
     field-mapping types; type.id is the fm type label ("Report Context"…). */
  const fieldLibrary = useFieldLibraryDemo({
    ...(props.fieldLibrary || {}),
    createHref: hrefFor("knowledge-create", { type: "Analytical Model" }),
    editHref: (id) => hrefFor("knowledge-create", { type: "Analytical Model", mode: "edit", id }),
    dashboardHref: hrefFor("cockpit", {}),
    scenarioHref: (id) => hrefFor("interpreter", { type: "Scenario Reporting", detail: id }),
    active: activeView === "field-library",
    type: type?.view === "field-library" ? type.id : undefined,
    records: props.records,
    peek: rcPeek,
    onNavigate: navigate,
    onQueryChange: typed(props.onQueryChange),
    onFilterToggle: typed(props.onFilterToggle),
    onPage: typed(props.onPage),
    onPageSize: typed(props.onPageSize),
    onOpen: typed(props.onOpen),
    onCloseDetail: (event) => {
      setRcPeek(null);
      typed(props.onCloseDetail)(event);
    },
    onAction: typed(props.onAction),
    onDialogConfirm: typed(props.onDialogConfirm),
    onDialogCancel: typed(props.onDialogCancel),
    onCreate: typed(props.onCreate),
    onDescriptionChange: typed(props.onDescriptionChange),
    onDescriptionConfirm: typed(props.onDescriptionConfirm),
    onDescriptionCancel: typed(props.onDescriptionCancel),
  });

  const routedScenarioRecords = React.useMemo(() => {
    if (activeView !== "scenario-reports") return scenarioInputRecords;
    return scenarioInputRecords?.map((record) => {
      const target = targetForHref?.(record.reportHref) || demoTargetForHref(record.reportHref);
      return { ...record, reportHref: target?.id && target.id !== "coverage" ? hrefFor(target.id, target.params) : record.reportHref };
    });
  }, [activeView, scenarioInputRecords, targetForHref, hrefFor]);

  /* scenario-reports.js #scenarioReportOverview — the dedicated Scenario
     Reporting card grid + shared knowledge-detail drawer. */
  const scenarioReports = useScenarioDemo({
    ...(props.scenarioReports || {}),
    createHref: hrefFor("knowledge-create", { type: "Scenario Reporting" }),
    active: activeView === "scenario-reports",
    records: routedScenarioRecords,
    onNavigate: navigate,
    onQueryChange: typed(props.onQueryChange),
    onFilterChange: typed(props.onFilterChange),
    onPage: typed(props.onPage),
    onPageSize: typed(props.onPageSize),
    onOpen: typed(props.onOpen),
    onCloseDetail: typed(props.onCloseDetail),
    onAction: typed(props.onAction),
    onDialogConfirm: typed(props.onDialogConfirm),
    onDialogCancel: typed(props.onDialogCancel),
    onCreate: typed(props.onCreate),
  });

  /* data-model-browser.js #dataModelOverview — domain sidebar + Basic
     information / Relationship graph tabs + the table detail dialog. */
  const dataModel = useDataModelDemo({
    ...(props.dataModel || {}),
    active: activeView === "data-model",
    onQueryChange: typed(props.onQueryChange),
    onOpenReportContext: (id) => {
      setRcPeek(id);
      props.onOpenReportContext?.({ typeId, id });
    },
    onSelectDomain: (domain) => props.onSelectDomain?.({ typeId, domain }),
    onTabChange: (tab) => props.onTabChange?.({ typeId, tab }),
    onOpenTable: (table) => props.onOpenTable?.({ typeId, table }),
    onCloseTable: () => props.onCloseTable?.({ typeId }),
    onDrawerTab: (tab) => props.onDrawerTab?.({ typeId, tab }),
  });

  const principleFiltered = activeView === "principles" ? filterPrinciples(props.principles?.items, { query, selectedCategories }) : [];
  const principleWindow = paginateRows(principleFiltered, { page: principlePage, pageSize: principlePageSize });
  const categories = [...new Set((activeView === "principles" ? props.principles?.items || [] : []).map((item) => item.category))].map((id) => ({
    id,
    label: id,
  }));

  const onQueryChange = (event) => {
    setQuery(event.value);
    setPrinciplePage(1);
    typed(props.onQueryChange)(event);
  };

  const overlay = rcPeek && fieldLibrary?.peek
    ? React.createElement(FieldLibraryDrawer, {
        ...fieldLibrary,
        type: fieldLibrary.peek.type,
        detail: fieldLibrary.peek.detail,
      })
    : null;
  const principles = activeView === "principles" ? {
        items: principleWindow.rows,
        totals: { shown: principleWindow.total, total: (props.principles?.items || []).length },
        categories,
        query,
        selectedCategories,
        page: principleWindow.page,
        pageSize: principlePageSize,
        expanded: principleExpanded,
        strings: props.principles?.strings,
        onQueryChange,
        onToggleCategory: (event) => {
          setSelectedCategories(
            event.checked
              ? [...selectedCategories, event.id]
              : selectedCategories.filter((id) => id !== event.id),
          );
          setPrinciplePage(1);
          typed(props.onToggleCategory)(event);
        },
        onClearFilters: (event) => {
          setQuery("");
          setSelectedCategories(EMPTY_ARRAY);
          setPrinciplePage(1);
          typed(props.onClearFilters)(event);
        },
        onPage: (event) => {
          setPrinciplePage(event.page);
          typed(props.onPage)(event);
        },
        onPageSize: (event) => {
          setPrinciplePageSize(event.pageSize);
          setPrinciplePage(1);
          typed(props.onPageSize)(event);
        },
        onToggleExpand: (event) => {
          setPrincipleExpanded(
            event.expanded
              ? [...principleExpanded, event.id]
              : principleExpanded.filter((id) => id !== event.id),
          );
          typed(props.onToggleExpand)(event);
        },
    } : null;
  const view = activeView === "principles" ? principles
    : activeView === "business-term" ? businessTerms
    : activeView === "data-model" ? dataModel
    : activeView === "field-library" ? fieldLibrary
    : activeView === "scenario-reports" ? scenarioReports
    : null;
  const { toast, showToast } = useToast();
  const noticeText = props.notice ? props.notices?.[props.notice] : undefined;
  React.useEffect(() => {
    if (noticeText) showToast(noticeText);
  }, [noticeText, showToast]);
  const workspace = useWorkspaceAssistantDemo({
    assistant: props.assistant,
    demo: { ...props.demo, answerFor: props.demo?.answerFor || buildInterpreterAnswer },
    typeId,
    onFlowSave: props.onFlowSave,
    onFlowSubmit: props.onFlowSubmit,
  });
  return {
    view,
    overlay,
    toast,
    hrefFor,
    ...workspace,
  };
}
