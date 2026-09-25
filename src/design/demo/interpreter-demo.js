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
import { useBusinessTermDemo } from "./business-term-demo.js";
import { useDataModelDemo } from "./data-model-demo.js";
import { useFieldLibraryDemo } from "./field-library-demo.js";
import { useScenarioDemo } from "./scenario-demo.js";
import { FieldLibraryDrawer } from "../features/interpreter/FieldLibraryView/index.jsx";

const EMPTY_ARRAY = [];

/** Controlled-prop mirror: local state re-syncs when the input value changes. */
function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
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
 * @param {object} props type/record seeds, per-view content and host callbacks
 * @returns {{view: object|null, overlay: React.ReactNode}} page view slots
 */
export function useInterpreterDemo(props) {
  const [query, setQuery] = useSynced(props.query ?? "");
  const type = (props.types || []).find((item) => item.id === props.activeType);
  const activeView = type?.view;
  const typeId = type?.id || props.activeType || "overview";
  const typed = (callback) => (event) => callback?.(
    event && typeof event === "object" && !Array.isArray(event)
      ? { ...event, typeId }
      : { typeId, value: event },
  );
  const navigate = (event) => props.onNavigate?.(
    event && typeof event === "object" ? { ...event, typeId } : { href: event, typeId },
  );
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

  /* scenario-reports.js #scenarioReportOverview — the dedicated Scenario
     Reporting card grid + shared knowledge-detail drawer. */
  const scenarioReports = useScenarioDemo({
    ...(props.scenarioReports || {}),
    active: activeView === "scenario-reports",
    records: props.scenarioReports?.records,
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
        total: principleWindow.total,
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
  return {
    view,
    overlay,

  };
}
