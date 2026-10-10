import { CheckboxFilter } from "../CheckboxFilter";
import "../../tokens.css";
import "./Pagination.css";


/** @type {readonly ["numbered", "compact"]} */
export const paginationVariants = ["numbered", "compact"];

/**
 * Footer pagination row — total label, rows-per-page select and page controls.
 * "numbered" mirrors `#businessPagination` / `renderPagination` (‹ 1 2 3 ›);
 * "compact" mirrors `fm-pagination` in the Business Term / Scenario libraries
 * (Previous / "page / total" / Next; the unit is always plural there).
 * @param {object} props
 * @param {number} props.total total item count
 * @param {[string, string]} [props.units=["asset", "assets"]] singular/plural for the total label
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=6]
 * @param {Array<number>} [props.pageSizes=[6, 12, 24]]
 * @param {string} [props.rowsLabel="Items per page"]
 * @param {typeof paginationVariants[number]} [props.variant="numbered"]
 * @param {string} [props.previousLabel="Previous"] compact variant only
 * @param {string} [props.nextLabel="Next"] compact variant only
 * @param {(event: { page: number }) => void} [props.onPage]
 * @param {(event: { pageSize: number }) => void} [props.onPageSize]
 */
export function Pagination({ total, units = ["asset", "assets"], page = 1, pageSize = 6, pageSizes = [6, 12, 24], rowsLabel = "Items per page", variant = "numbered", previousLabel = "Previous", nextLabel = "Next", onPage, onPageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  /* fm-pagination always pluralizes ("3 records"); the numbered variant
     singularizes ("1 asset"). */
  const totalLabel = variant === "compact" ? `${total} ${units[1]}` : `${total} ${total === 1 ? units[0] : units[1]}`;
  const sizeSelect = (
    <div className="mh-pagination__size">
      <CheckboxFilter
        label=""
        ariaLabel={rowsLabel}
        single
        selectedLabel="{labels}"
        options={pageSizes.map((size) => ({ id: String(size), label: `${size} items/page` }))}
        selected={[String(pageSize)]}
        onToggle={({ id }) => onPageSize?.({ pageSize: Number(id) })}
      />
    </div>
  );
  if (variant === "compact") {
    return (
      <nav className="mh-pagination mh-pagination--compact" aria-label="Knowledge pagination">
        <span className="mh-pagination__total">{totalLabel}</span>
        <div className="mh-pagination__controls">
          <button type="button" className="mh-pagination__prev" aria-label={previousLabel} title={previousLabel} disabled={current === 1} onClick={() => onPage?.({ page: Math.max(1, current - 1) })}>
            <span aria-hidden="true">‹</span>
          </button>
          <span className="mh-pagination__page" aria-label={`Page ${current} of ${pages}`} title={`Page ${current} of ${pages}`}>
            {current}
          </span>
          <button type="button" className="mh-pagination__next" aria-label={nextLabel} title={nextLabel} disabled={current === pages} onClick={() => onPage?.({ page: Math.min(pages, current + 1) })}>
            <span aria-hidden="true">›</span>
          </button>
          {sizeSelect}
        </div>
      </nav>
    );
  }
  return (
    <nav className="mh-pagination" aria-label="Knowledge pagination">
      <span className="mh-pagination__total">{totalLabel}</span>
      {sizeSelect}
      <div className="mh-pagination__pages">
        <button type="button" disabled={current === 1} onClick={() => onPage?.({ page: Math.max(1, current - 1) })}>
          ‹
        </button>
        {Array.from({ length: pages }, (_, index) => index + 1).map((item) => (
          <button
            key={item}
            type="button"
            className={item === current ? "is-active" : undefined}
            onClick={() => onPage?.({ page: item })}
          >
            {item}
          </button>
        ))}
        <button type="button" disabled={current === pages} onClick={() => onPage?.({ page: Math.min(pages, current + 1) })}>
          ›
        </button>
      </div>
    </nav>
  );
}
