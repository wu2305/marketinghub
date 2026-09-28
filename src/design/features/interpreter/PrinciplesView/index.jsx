import "../../../tokens.css";
import React from "react";
import { LibraryList } from "../../../components/LibraryList/index.jsx";
import { LibraryToolbar } from "../../../components/LibraryToolbar/index.jsx";
import { Pagination } from "../../../components/Pagination/index.jsx";
import { cx } from "../../../cx.js";
import "./PrinciplesView.css";

const fill = (template, values) => String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

/**
 * The one thing the pattern keeps for Principles (patterns/library.md §5):
 * a long description expands in place. The clamp is CSS; one overflow check
 * decides whether the toggle is worth showing (types.js:689-717 searched for
 * the truncation point instead).
 */
function PrincipleText({ text, expanded, labels, onToggle }) {
  const textRef = React.useRef(null);
  const textId = React.useId();
  const [overflows, setOverflows] = React.useState(false);
  React.useLayoutEffect(() => {
    const element = textRef.current;
    if (!element || expanded) return undefined;
    let live = true;
    const measure = () => {
      if (live) setOverflows(element.scrollHeight > element.clientHeight + 1);
    };
    measure();
    document.fonts?.ready?.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      live = false;
      window.removeEventListener("resize", measure);
    };
  }, [text, expanded]);
  return (
    <div className="mh-principles__description">
      <p ref={textRef} id={textId} className={cx("mh-principles__text", expanded && "is-expanded")}>{text}</p>
      {expanded || overflows ? (
        <button
          type="button"
          className="mh-principles__toggle"
          aria-controls={textId}
          aria-expanded={expanded}
          aria-label={expanded ? labels.collapse : labels.expand}
          title={expanded ? labels.collapseTitle : labels.expandTitle}
          onClick={onToggle}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={expanded ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

/**
 * Principles library (`?type=Principles`, types.js:718-772) on the governed-
 * library pattern: LibraryToolbar (search, Category facet, count), LibraryList
 * `list` (one card per row, like the original's single column) and compact
 * Pagination. Read-only — no status, actions or create
 * (pattern §5); "detail" is the description expanding in place, so opening a
 * card toggles it. Controlled: `useInterpreterDemo` filters, pages and keeps
 * the expanded set.
 * @param {object} props
 * @param {Array<{ id: string, category: string, title: string, description: string }>} [props.items=[]] the current page
 * @param {{ shown: number, total: number }} [props.totals] filtered and overall counts
 * @param {Array<{ id: string, label: string }>} [props.categories=[]] Category facet options
 * @param {string} [props.query=""]
 * @param {Array<string>} [props.selectedCategories=[]]
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=10]
 * @param {Array<number>} [props.pageSizes=[5, 10, 20]]
 * @param {Array<string>} [props.expanded=[]] ids of expanded descriptions
 * @param {object} [props.strings={}] copy: searchLabel, searchPlaceholder, categoryLabel, allCategoriesLabel, selectedCategoriesLabel, categoryMetaLabel, countLabel ("{shown}", "{total}"), countUnit, emptyTitle, emptyMessage, clearFiltersLabel, rowsPerPageLabel, previousLabel, nextLabel, expandLabel, collapseLabel, expandTitle, collapseTitle
 * @param {React.Ref<HTMLInputElement>} [props.searchRef] forwarded to the search input ("/" shortcut)
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(event: { id: string, checked: boolean }) => void} [props.onToggleCategory]
 * @param {(event: { reason: string }) => void} [props.onClearFilters] from the no-results state
 * @param {(event: { page: number }) => void} [props.onPage]
 * @param {(event: { pageSize: number }) => void} [props.onPageSize]
 * @param {(event: { id: string, expanded: boolean }) => void} [props.onToggleExpand]
 */
export function PrinciplesView({
  items = [],
  totals,
  categories = [],
  query = "",
  selectedCategories = [],
  page = 1,
  pageSize = 10,
  pageSizes = [5, 10, 20],
  expanded = [],
  strings = {},
  searchRef,
  onQueryChange,
  onToggleCategory,
  onClearFilters,
  onPage,
  onPageSize,
  onToggleExpand,
}) {
  const {
    searchLabel = "Search knowledge",
    searchPlaceholder = "Search knowledge...",
    categoryLabel = "Category",
    allCategoriesLabel = "All categories",
    selectedCategoriesLabel = "{count} selected",
    categoryMetaLabel = categoryLabel,
    countLabel = "Showing {shown} of {total} principles",
    countUnit = ["principle", "principles"],
    emptyTitle = "No matching principles.",
    emptyMessage = "Change the category or search.",
    clearFiltersLabel = "Clear filters",
    rowsPerPageLabel = "Rows per page",
    previousLabel = "Previous",
    nextLabel = "Next",
    expandLabel = "Expand description",
    collapseLabel = "Collapse description",
    expandTitle = "Expand",
    collapseTitle = "Collapse",
  } = strings;
  const counts = totals ?? { shown: items.length, total: items.length };
  const labels = { expand: expandLabel, collapse: collapseLabel, expandTitle, collapseTitle };
  const toggle = (id) => onToggleExpand?.({ id, expanded: !expanded.includes(id) });
  const cards = items.map((item) => ({
    id: item.id,
    title: item.title,
    meta: [{ label: categoryMetaLabel, value: item.category }],
    children: <PrincipleText text={item.description} expanded={expanded.includes(item.id)} labels={labels} onToggle={() => toggle(item.id)} />,
  }));
  return (
    <section className="mh-principles" aria-label="Principles library">
      <LibraryToolbar
        search={{ label: searchLabel, placeholder: searchPlaceholder, value: query }}
        searchRef={searchRef}
        facets={[
          {
            id: "category",
            label: categoryLabel,
            allLabel: allCategoriesLabel,
            selectedLabel: selectedCategoriesLabel,
            options: categories,
            selected: selectedCategories,
          },
        ]}
        count={fill(countLabel, counts)}
        onChange={({ field, value, checked }) => {
          if (field === "search") onQueryChange?.({ name: "search", value });
          else onToggleCategory?.({ id: value, checked });
        }}
      />
      <LibraryList
        label="Principles"
        layout="list"
        items={cards}
        empty={{ kind: counts.total ? "no-results" : "empty", title: emptyTitle, message: emptyMessage, clearLabel: clearFiltersLabel }}
        onOpen={({ id }) => toggle(id)}
        onClear={() => onClearFilters?.({ reason: "empty-state" })}
      />
      <Pagination
        variant="compact"
        total={counts.shown}
        units={countUnit}
        page={page}
        pageSize={pageSize}
        pageSizes={pageSizes}
        rowsLabel={rowsPerPageLabel}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        onPage={onPage}
        onPageSize={onPageSize}
      />
    </section>
  );
}
