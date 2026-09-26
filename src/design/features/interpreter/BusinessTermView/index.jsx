import "../../../tokens.css";
import React from "react";
import { CheckboxFilter } from "../../../components/CheckboxFilter/index.jsx";
import { ConfirmDialog } from "../../../components/ConfirmDialog/index.jsx";
import { Modal } from "../../../components/Modal/index.jsx";
import { Pagination } from "../../../components/Pagination/index.jsx";
import { SearchField } from "../../../components/SearchField/index.jsx";
import { StatusBadge } from "../../../components/StatusBadge/index.jsx";
import { cx } from "../../../cx.js";
import { KnowledgeActions } from "../KnowledgeActions/index.jsx";
import "./BusinessTermView.css";


/** Data-model pill text — business-term-library.js domainTags(). */
function btDomainTag(record) {
  return record.kind === "Global Synonym" || record.scope?.[0] === "Global" ? "All models" : record.scope?.[0] || "—";
}

/**
 * Synonym tag row with the original's overflow marker. Faithful port of the
 * original clampSynonymRows() outcome (business-term-library.js + the final
 * CSS cascade): `tag.offsetLeft` is measured against the positioned CARD —
 * the tags' offsetParent — so a tag counts as "outside" once its
 * card-relative right edge exceeds `container.clientWidth + 1` (~84px less
 * than the real row width). The "…" tag is then appended at the END of the
 * full row and may itself be clipped away by `overflow: hidden`; the
 * original's tag-hiding loop is dead code because an author
 * `display: inline-flex !important` rule defeats its inline `display: none`,
 * so tags are never actually hidden — they just clip.
 *
 * Observed original behaviour this reproduces (1440px): GMV and Paid
 * Customer append "…" but it lands past the clip edge (invisible, tags
 * clipped mid-glyph); Active Member's single tag fits (no "…"); Revenue,
 * Customer and Campaign show "…" after fully-visible tag rows.
 */
function SynonymClamp({ tags = [], moreLabel = "More synonyms" }) {
  const ref = React.useRef(null);
  const [overflowed, setOverflowed] = React.useState(false);
  React.useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return undefined;
    const measure = () => {
      const tagEls = [...container.querySelectorAll(".mh-btview__tag:not(.mh-btview__tag--overflow)")];
      setOverflowed(tagEls.some((tag) => tag.offsetLeft + tag.offsetWidth > container.clientWidth + 1));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [tags]);
  return (
    <div className="mh-btview__tags" ref={ref}>
      {tags.map((value) => (
        <span key={value} className="mh-btview__tag">
          {value}
        </span>
      ))}
      {overflowed ? (
        <span className="mh-btview__tag mh-btview__tag--overflow" aria-label={moreLabel}>
          …
        </span>
      ) : null}
    </div>
  );
}

/**
 * Business Term dedicated library view (`?type=Business Term` on the AI
 * Interpreter knowledge page) — the toolbar, 3-column term cards, fm-style
 * pagination, right-side detail drawer and confirm/info dialogs from
 * business-term-library.js. Presentational: the container
 * (useBusinessTermDemo) owns filtering, mutation and action rules; each record
 * carries a precomputed `actions` array.
 * @param {object} props
 * @param {Array<object>} [props.records=[]] filtered + paged rows; each carries id, title, description, synonyms, scope, kind, creator, status ("Enable"|"Disable"), optional stage ("Draft"), and actions: Array<{ action: "edit"|"delete"|"disable", disabled: boolean, title: string, label: string }>
 * @param {{ shown: number, total: number }} [props.totals]
 * @param {Array<{ id: string, label: string, allLabel?: string, options: Array<{ id: string, label: string }>, selected: Array<string> }>} [props.filters=[]] checkbox disclosure filters (OR within a filter, AND across)
 * @param {string} [props.query=""] search text
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=10]
 * @param {Array<number>} [props.pageSizes=[5, 10, 20]]
 * @param {object} [props.strings={}] copy: searchLabel, searchPlaceholder, selectedLabel, createLabel, creatorLabel, synonymsLabel, moreSynonymsLabel, statusLabels { Enable, Disable }, emptyMessage, countLabel ("Showing {shown} of {total} terms"), units, rowsPerPageLabel, previousLabel, nextLabel, detailEyebrow, detailCloseLabel, sections { termType, description, synonyms, dataModel, creator }
 * @param {string} [props.createHref] "Add Business Term" link target (M5 create page)
 * @param {React.Ref<HTMLInputElement>} [props.searchRef] forwarded to the search input ("/" and Cmd/Ctrl+K shortcuts)
 * @param {object|null} [props.detail] record shown in the detail drawer (null = closed)
 * @param {object|null} [props.dialog] ConfirmDialog props content ({ purpose, title, message, confirmLabel, cancelLabel, closeLabel }); null = closed
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(event: { id: string, value: string, checked: boolean }) => void} [props.onFilterToggle]
 * @param {(event: { page: number }) => void} [props.onPage]
 * @param {(event: { pageSize: number }) => void} [props.onPageSize]
 * @param {(event: { id: string }) => void} [props.onOpen] card click / Enter / Space opens the detail drawer
 * @param {(event: { action: string, id: string }) => void} [props.onAction] edit/delete/disable icon button (also fires when aria-disabled, matching the original)
 * @param {(event: { reason: string }) => void} [props.onCloseDetail]
 * @param {(event: { confirmed: true }) => void} [props.onDialogConfirm]
 * @param {(event: { reason: string }) => void} [props.onDialogCancel]
 * @param {(event: { href: string }) => void} [props.onCreate]
 */
export function BusinessTermView({
  records = [],
  totals = { shown: 0, total: 0 },
  filters = [],
  query = "",
  page = 1,
  pageSize = 10,
  pageSizes = [5, 10, 20],
  strings = {},
  createHref,
  searchRef,
  detail = null,
  dialog = null,
  onQueryChange,
  onFilterToggle,
  onPage,
  onPageSize,
  onOpen,
  onAction,
  onCloseDetail,
  onDialogConfirm,
  onDialogCancel,
  onCreate,
}) {
  const {
    searchLabel = "Search knowledge",
    searchPlaceholder = "Search knowledge...",
    selectedLabel = "{count} selected",
    createLabel = "Add Business Term",
    creatorLabel = "Creator",
    synonymsLabel = "Synonyms",
    moreSynonymsLabel = "More synonyms",
    statusLabels = { Enable: "Enabled", Disable: "Disabled" },
    emptyMessage = "No matching records",
    countLabel = "Showing {shown} of {total} terms",
    units = ["record", "records"],
    rowsPerPageLabel = "Rows per page",
    previousLabel = "Previous",
    nextLabel = "Next",
    detailEyebrow = "Business Term",
    detailCloseLabel = "Close details",
    sections = { termType: "Term Type", description: "Description", synonyms: "Synonyms", dataModel: "Data Model", creator: "Creator" },
  } = strings;
  const statusText = (status) => statusLabels[status] || status;
  const countParts = countLabel.split(/\{shown\}|\{total\}/);
  return (
    <section className="mh-btview" aria-label="Business Term library">
      <div className="mh-btview__tools">
        <div className="mh-btview__search">
          <SearchField label={searchLabel} value={query} placeholder={searchPlaceholder} variant="plain" inputRef={searchRef} onChange={onQueryChange} />
        </div>
        {filters.map((filter) => (
          <CheckboxFilter
            key={filter.id}
            label={filter.label}
            allLabel={filter.allLabel}
            selectedLabel={filter.selectedLabel || selectedLabel}
            options={filter.options}
            selected={filter.selected}
            onToggle={(event) => onFilterToggle?.({ id: filter.id, value: event.id, checked: event.checked })}
          />
        ))}
        <a className="mh-btview__create" href={createHref} target="_blank" rel="noopener" onClick={() => onCreate?.({ href: createHref })}>
          <span aria-hidden="true">＋</span>
          {createLabel}
        </a>
      </div>
      {/* The original renders this count line but display:none hides it on
          type pages — kept in DOM for parity. */}
      <div className="mh-btview__countline" aria-live="polite" hidden>
        {countParts[0]}
        <strong>{totals.shown}</strong>
        {countParts[1]}
        <strong>{totals.total}</strong>
        {countParts[2]}
      </div>
      {records.length ? (
        <div className="mh-btview__cards">
          {records.map((record) => (
            <article
              key={record.id}
              className="mh-btview__card"
              data-id={record.id}
              tabIndex={0}
              onClick={(event) => {
                if (event.target.closest("button, a, input, select, textarea")) return;
                onOpen?.({ id: record.id });
              }}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onOpen?.({ id: record.id });
                }
              }}
            >
              <div className="mh-btview__card-main">
                <h3 title={record.title}>
                  {record.title}
                  {record.stage === "Draft" ? <sup className="mh-btview__draft">Draft</sup> : null}
                </h3>
                <p title={record.description}>{record.description}</p>
                <div className="mh-btview__meta">
                  <div className="mh-btview__field">
                    <span>{creatorLabel}</span>
                    <strong title={record.creator}>{record.creator}</strong>
                  </div>
                </div>
                <div className="mh-btview__field mh-btview__synonyms">
                  <span>{synonymsLabel}</span>
                  <SynonymClamp tags={record.synonyms} moreLabel={moreSynonymsLabel} />
                </div>
              </div>
              <div className="mh-btview__pills">
                <StatusBadge variant="knowledge" status={statusText(record.status)} />
              </div>
              <div className="mh-btview__actions">
                <KnowledgeActions variant="business-term" actions={record.actions} record={record} onAction={onAction} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mh-btview__empty">{emptyMessage}</div>
      )}
      <Pagination
        variant="compact"
        total={totals.shown}
        units={units}
        page={page}
        pageSize={pageSize}
        pageSizes={pageSizes}
        rowsLabel={rowsPerPageLabel}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        onPage={onPage}
        onPageSize={onPageSize}
      />
      <Modal
        open={Boolean(detail)}
        variant="drawer"
        eyebrow={detailEyebrow}
        title={detail?.title}
        closeLabel={detailCloseLabel}
        titleExtra={
          detail ? (
            <span className={cx("mh-btview__drawer-status", detail.status === "Enable" ? "is-on" : "is-off")}>{statusText(detail.status)}</span>
          ) : undefined
        }
        footer={detail ? <KnowledgeActions variant="business-term" actions={detail.actions} record={detail} onAction={onAction} /> : undefined}
        onClose={(event) => onCloseDetail?.({ reason: event.reason })}
      >
        {detail ? (
          <div className="mh-btview__detail">
            <section className="mh-btview__section">
              <h3>{sections.termType}</h3>
              <p>{detail.kind}</p>
            </section>
            <section className="mh-btview__section">
              <h3>{sections.description}</h3>
              <p>{detail.description}</p>
            </section>
            <section className="mh-btview__section">
              <h3>{sections.synonyms}</h3>
              <div className="mh-btview__chips">
                {(detail.synonyms || []).map((value) => (
                  <span key={value} className="mh-btview__chip">
                    {value}
                  </span>
                ))}
              </div>
            </section>
            <section className="mh-btview__section">
              <h3>{sections.dataModel}</h3>
              <span className="mh-btview__scope">{btDomainTag(detail)}</span>
            </section>
            <section className="mh-btview__section">
              <h3>{sections.creator}</h3>
              <p>{detail.creator}</p>
            </section>
          </div>
        ) : null}
      </Modal>
      <ConfirmDialog
        open={Boolean(dialog)}
        purpose={dialog?.purpose}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        cancelLabel={dialog?.cancelLabel}
        closeLabel={dialog?.closeLabel}
        onConfirm={onDialogConfirm}
        onCancel={onDialogCancel}
      />
    </section>
  );
}
