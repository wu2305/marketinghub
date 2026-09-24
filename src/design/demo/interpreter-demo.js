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
import { recordMatchesFilter, uniqueFilterOptions } from "../cx.js";
import { useBusinessTermDemo } from "./business-term-demo.js";

const EMPTY_OBJECT = {};
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

/** Filter descriptors for the generic library toolbar: statusFilters whose
   options fall back to the distinct record values (types.js renderFilters). */
export function libraryFilters(type, records) {
  return (type?.statusFilters || []).map((filter) => ({
    ...filter,
    options: filter.options || uniqueFilterOptions(records, filter.id),
  }));
}

/** Generic library row match: free-text over title+summary, then every
   selected status filter (types.js recordMatches). */
export function filterLibraryRows(records, { query = "", filterValues = {}, filters = [] } = {}) {
  return (records || []).filter((record) => {
    const queryMatch = !query || `${record.title} ${record.summary}`.toLowerCase().includes(query.toLowerCase());
    const filterMatch = filters.every(
      (filter) => !filterValues[filter.id] || recordMatchesFilter(record, filter, filterValues[filter.id]),
    );
    return queryMatch && filterMatch;
  });
}

/**
 * @param {object} props page inputs:
 *   `types`, `records`, `activeType` (controlled — the host owns the `?type=`
 *   mapping), initial `query`/`filterValues`, `principles` = { items, strings,
 *   selectedCategories, page, pageSize, expanded }, `businessTermLibrary`
 *   (useBusinessTermDemo inputs), and host callbacks (`onNavigate`,
 *   `onSelectType`, `onQueryChange`, `onFilterChange`, `onCreate`,
 *   `onSelectAsset`, `onToggleCategory`, `onPage`, `onPageSize`,
 *   `onToggleExpand`, plus the BusinessTermView callback set).
 * @returns {object} AiInterpreterPage props: `query`, `filterValues`,
 *   `library` = { rows, filters } for the transitional generic list, `views`
 *   keyed by `type.view` (`principles`, `business-term`), and the wired
 *   callbacks.
 */
export function useInterpreterDemo(props) {
  const [query, setQuery] = useSynced(props.query ?? "");
  const [filterValues, setFilterValues] = useSynced(props.filterValues ?? EMPTY_OBJECT);
  const [selectedCategories, setSelectedCategories] = useSynced(props.principles?.selectedCategories ?? EMPTY_ARRAY);
  const [principlePage, setPrinciplePage] = useSynced(props.principles?.page ?? 1);
  const [principlePageSize, setPrinciplePageSize] = useSynced(props.principles?.pageSize ?? 10);
  const [principleExpanded, setPrincipleExpanded] = useSynced(props.principles?.expanded ?? EMPTY_ARRAY);

  /* types.js: switching knowledge types resets the library filters and the
     principles page (query and category picks persist). */
  const activeType = props.activeType;
  const prevType = React.useRef(activeType);
  React.useEffect(() => {
    if (prevType.current === activeType) return;
    prevType.current = activeType;
    setFilterValues({});
    setPrinciplePage(1);
  }, [activeType, setFilterValues, setPrinciplePage]);

  const businessTerms = useBusinessTermDemo({
    ...props.businessTermLibrary,
    onNavigate: props.onNavigate,
    onQueryChange: props.onQueryChange,
    onFilterToggle: props.onFilterToggle,
    onPage: props.onPage,
    onPageSize: props.onPageSize,
    onOpen: props.onOpen,
    onCloseDetail: props.onCloseDetail,
    onAction: props.onAction,
    onDialogConfirm: props.onDialogConfirm,
    onDialogCancel: props.onDialogCancel,
    onCreate: props.onCreate,
  });

  const type = (props.types || []).find((item) => item.id === activeType);
  const typeRecords = type ? (props.records || []).filter((record) => record.typeId === type.id) : [];
  const filters = libraryFilters(type, typeRecords);
  const rows = filterLibraryRows(typeRecords, { query, filterValues, filters });

  const principleFiltered = filterPrinciples(props.principles?.items, { query, selectedCategories });
  const principleWindow = paginateRows(principleFiltered, { page: principlePage, pageSize: principlePageSize });
  const categories = [...new Set((props.principles?.items || []).map((item) => item.category))].map((id) => ({
    id,
    label: id,
  }));

  const onQueryChange = (event) => {
    setQuery(event.value);
    setPrinciplePage(1);
    props.onQueryChange?.(event);
  };

  return {
    query,
    filterValues,
    library: { rows, filters },
    views: {
      principles: {
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
          props.onToggleCategory?.(event);
        },
        onPage: (event) => {
          setPrinciplePage(event.page);
          props.onPage?.(event);
        },
        onPageSize: (event) => {
          setPrinciplePageSize(event.pageSize);
          setPrinciplePage(1);
          props.onPageSize?.(event);
        },
        onToggleExpand: (event) => {
          setPrincipleExpanded(
            event.expanded
              ? [...principleExpanded, event.id]
              : principleExpanded.filter((id) => id !== event.id),
          );
          props.onToggleExpand?.(event);
        },
      },
      "business-term": businessTerms,
    },
    onQueryChange,
    onFilterChange: (event) => {
      setFilterValues((values) => ({ ...values, [event.id]: event.value }));
      props.onFilterChange?.(event);
    },
    onCreate: props.onCreate,
    onSelectAsset: props.onSelectAsset,
  };
}
