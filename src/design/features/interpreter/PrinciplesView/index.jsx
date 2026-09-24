import "../../../tokens.css";
import React from "react";
import { CheckboxFilter } from "../../../components/CheckboxFilter/index.jsx";
import { Pagination } from "../../../components/Pagination/index.jsx";
import { SearchField } from "../../../components/SearchField/index.jsx";
import { cx } from "../../../cx.js";
import "./PrinciplesView.css";


/**
 * Principle description with the original's measured clamp: collapsed text is
 * truncated by a binary search against scrollHeight (two lines + 1px), the
 * toggle only renders when the text overflows or the card is expanded.
 * @param {object} props
 * @param {string} props.text full description (may contain newlines — pre-line)
 * @param {boolean} props.expanded
 * @param {() => void} [props.onToggle]
 */
function PrincipleDescription({ text, expanded, onToggle }) {
  const descRef = React.useRef(null);
  const textRef = React.useRef(null);
  const descriptionId = React.useId();
  const [display, setDisplay] = React.useState(text);
  const [clamped, setClamped] = React.useState(false);
  // The clamp is measured, so it must re-run once the DIN webfont arrives and
  // whenever the card width changes — otherwise the binary search would clamp
  // against fallback-font metrics.
  const [measureTick, setMeasureTick] = React.useState(0);
  React.useEffect(() => {
    let cancelled = false;
    const bump = () => {
      if (!cancelled) setMeasureTick((tick) => tick + 1);
    };
    document.fonts?.ready?.then(bump);
    window.addEventListener("resize", bump);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", bump);
    };
  }, []);

  React.useLayoutEffect(() => {
    const description = descRef.current;
    const span = textRef.current;
    if (!description || !span) return;
    if (expanded) {
      setDisplay(text);
      setClamped(true);
      return;
    }
    span.textContent = text;
    const lineHeight = Number.parseFloat(getComputedStyle(description).lineHeight) || 22;
    const maxHeight = lineHeight * 2 + 1;
    if (description.scrollHeight <= maxHeight) {
      setDisplay(text);
      setClamped(false);
      return;
    }
    let low = 0;
    let high = text.length;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      span.textContent = `${text.slice(0, middle).trimEnd()}… `;
      if (description.scrollHeight <= maxHeight) low = middle;
      else high = middle - 1;
    }
    const final = `${text.slice(0, low).trimEnd()}… `;
    span.textContent = final;
    setDisplay(final);
    setClamped(true);
  }, [text, expanded, measureTick]);

  return (
    <div className="mh-principle__descwrap">
      <p
        ref={descRef}
        className={cx("mh-principle__desc", expanded && "is-expanded")}
        id={descriptionId}
      >
        <span ref={textRef} className="mh-principle__desctext">
          {display}
        </span>
        {clamped ? (
          <button
            type="button"
            className="mh-principle__toggle"
            aria-controls={descriptionId}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse description" : "Expand description"}
            title={expanded ? "Collapse" : "Expand"}
            onClick={onToggle}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={expanded ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
            </svg>
          </button>
        ) : null}
      </p>
    </div>
  );
}

/**
 * Principles library view — the dedicated card list that replaces the generic
 * asset table when `?type=Principles`: gold search pill, category checkbox
 * filter, "Showing X of Y" count line, numbered cards with clamped
 * descriptions, and shared pagination. Mirrors `renderPrinciplesCards`,
 * `matchingPrinciples` and `renderPrincipleCategoryFilter` in types.js.
 * S8/R4 contract: the view is controlled — it receives already-filtered,
 * already-paginated `items` plus `total`/`categories`; filtering and paging
 * live in `demo/interpreter-demo.js` (`filterPrinciples`/`paginateRows`).
 * @param {object} props
 * @param {Array<{ id: string, category: string, title: string, description: string }>} [props.items=[]] visible rows (filtered + paginated)
 * @param {number} [props.total] filtered count feeding the pagination footer
 * @param {Array<{ id: string, label: string }>} [props.categories=[]] category checkbox options (all categories, not only visible ones)
 * @param {string} [props.query=""] controlled search text — matches category, title, description
 * @param {Array<string>} [props.selectedCategories=[]]
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=10]
 * @param {Array<string>} [props.expanded=[]] ids of expanded descriptions
 * @param {object} [props.strings={}] copy overrides: searchLabel, searchPlaceholder, categoryLabel, allCategoriesLabel, selectedCategoriesLabel, countUnit, emptyMessage, rowsPerPageLabel, pageSizes
 * @param {React.Ref} [props.searchRef] forwarded to the search input ("/" shortcut)
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(event: { id: string, checked: boolean }) => void} [props.onToggleCategory]
 * @param {(event: { page: number }) => void} [props.onPage]
 * @param {(event: { pageSize: number }) => void} [props.onPageSize]
 * @param {(event: { id: string, expanded: boolean }) => void} [props.onToggleExpand]
 */
export function PrinciplesView({
  items = [],
  total,
  categories = [],
  query = "",
  selectedCategories = [],
  page = 1,
  pageSize = 10,
  expanded = [],
  strings = {},
  searchRef,
  onQueryChange,
  onToggleCategory,
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
    countUnit = ["principle", "principles"],
    emptyMessage = "No matching principles. Change the category or search.",
    rowsPerPageLabel = "Rows per page",
    pageSizes = [10, 20, 50],
  } = strings;
  const totalItems = total ?? items.length;
  const pages = Math.max(1, Math.ceil(totalItems / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  const first = (current - 1) * pageSize;
  const visible = items;
  return (
    <section className="mh-principles" aria-label="Principles library">
      <header className="mh-principles__toolbar">
        <div className="mh-principles__search">
          <SearchField label={searchLabel} value={query} placeholder={searchPlaceholder} variant="plain" inputRef={searchRef} onChange={onQueryChange} />
        </div>
        <CheckboxFilter
          label={categoryLabel}
          allLabel={allCategoriesLabel}
          selectedLabel={selectedCategoriesLabel}
          options={categories}
          selected={selectedCategories}
          onToggle={onToggleCategory}
        />
      </header>
      <div className="mh-principles__grid">
        {visible.length ? (
          <div className="mh-principles__list">
            {visible.map((item, index) => (
              <article className="mh-principle" key={item.id}>
                <span className="mh-principle__number">{String(first + index + 1).padStart(2, "0")}</span>
                <div className="mh-principle__copy">
                  <div className="mh-principle__titleline">
                    <div className="mh-principle__titlemain">
                      <span className="mh-principle__badge">{item.category}</span>
                      <h3>{item.title}</h3>
                    </div>
                  </div>
                  <PrincipleDescription
                    text={item.description}
                    expanded={expanded.includes(item.id)}
                    onToggle={() => onToggleExpand?.({ id: item.id, expanded: !expanded.includes(item.id) })}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mh-principles__empty">{emptyMessage}</div>
        )}
      </div>
      <Pagination
        total={totalItems}
        units={countUnit}
        page={current}
        pageSize={pageSize}
        pageSizes={pageSizes}
        rowsLabel={rowsPerPageLabel}
        onPage={onPage}
        onPageSize={onPageSize}
      />
    </section>
  );
}
