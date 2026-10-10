import "../../../tokens.css";
import { ChipList } from "../../../components/ChipList/index.jsx";
import { ConfirmDialog } from "../../../components/ConfirmDialog/index.jsx";
import { ItemActions } from "../../../components/ItemActions/index.jsx";
import { LibraryList } from "../../../components/LibraryList/index.jsx";
import { LibraryToolbar } from "../../../components/LibraryToolbar/index.jsx";
import { Modal } from "../../../components/Modal/index.jsx";
import { Pagination } from "../../../components/Pagination/index.jsx";
import { StatusBadge } from "../../../components/StatusBadge/index.jsx";
import { Toast } from "../../../components/Toast/index.jsx";
import "./BusinessTermView.css";
import { availabilityOf } from "../../../lib/governance.js";

/** Data-model pill text — business-term-library.js:104-105 domainTags(). */
function scopeLabel(record) {
  return record.kind === "Global Synonym" || record.scope?.[0] === "Global" ? "All models" : record.scope?.[0] || "—";
}

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));

/**
 * Business Term library (`?type=Business Term` on the AI Interpreter page),
 * built on the governed-library pattern (handover/design-intent/patterns/library.md).
 * Presentational: `useBusinessTermDemo` owns filtering, the governance rules
 * (lib/governance.js), dialogs and the success toast. What the pattern keeps
 * for this view: the synonym row on cards (ChipList), and term type / synonyms
 * / data model sections in the drawer.
 * @param {object} props
 * @param {Array<object>} [props.records=[]] current page; each has id, title, description, synonyms, scope, kind, creator, status ("Enable"|"Disable"), optional stage ("Draft"), and `actions` from governedActions()
 * @param {{ shown: number, total: number }} [props.totals]
 * @param {Array<{ id: string, label: string, allLabel?: string, selectedLabel?: string, options: Array<{ id: string, label: string }>, selected: Array<string> }>} [props.filters=[]] multi-select facets (OR within, AND across)
 * @param {string} [props.query=""]
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=6]
 * @param {Array<number>} [props.pageSizes=[6, 12, 24]]
 * @param {object} [props.strings={}] copy: searchLabel, searchPlaceholder, selectedLabel, createLabel, creatorLabel, synonymsLabel, moreSynonymsLabel, statusLabels { Enable, Disable }, draftLabel, emptyTitle, emptyMessage, clearFiltersLabel, countLabel ("Showing {shown} of {total} terms"), units, rowsPerPageLabel, previousLabel, nextLabel, detailEyebrow, detailCloseLabel, sections { termType, description, synonyms, dataModel, creator }, actions { edit, delete, disable }, tooltips { permission, "disable-first", "already-disabled" }
 * @param {string} [props.createHref] "Add Business Term" link target
 * @param {React.Ref<HTMLInputElement>} [props.searchRef] forwarded to the search input ("/" and Cmd/Ctrl+K shortcuts)
 * @param {object|null} [props.detail] record shown in the drawer (null = closed)
 * @param {object|null} [props.dialog] ConfirmDialog content; null = closed
 * @param {string} [props.toast=""] success message; empty = hidden
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(event: { id: string, value: string, checked: boolean }) => void} [props.onFilterToggle]
 * @param {(event: { reason: string }) => void} [props.onClearFilters] from the no-results state
 * @param {(event: { page: number }) => void} [props.onPage]
 * @param {(event: { pageSize: number }) => void} [props.onPageSize]
 * @param {(event: { id: string }) => void} [props.onOpen]
 * @param {(event: { action: string, id: string, blocked: boolean, reason: string|null }) => void} [props.onAction] every action click, blocked or not
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
  pageSize = 6,
  pageSizes = [6, 12, 24],
  strings = {},
  createHref,
  searchRef,
  detail = null,
  dialog = null,
  toast = "",
  onQueryChange,
  onFilterToggle,
  onClearFilters,
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
    statusLabels = { Enable: "Enabled", Disable: "Disabled" },
    draftLabel = "Draft",
    emptyTitle = "No matching records",
    emptyMessage,
    clearFiltersLabel = "Clear filters",
    countLabel = "Showing {shown} of {total} terms",
    units = ["record", "records"],
    rowsPerPageLabel = "Items per page",
    previousLabel = "Previous",
    nextLabel = "Next",
    detailEyebrow = "Business Term",
    detailCloseLabel = "Close details",
    sections = { termType: "Term Type", description: "Description", synonyms: "Synonyms", dataModel: "Data Model", creator: "Creator" },
    actions: actionLabels,
    tooltips,
  } = strings;
  const availability = (record) => (availabilityOf(record) === "enabled" ? "Enable" : "Disable");
  const statusOf = (record) => {
    const key = availability(record);
    return { status: key === "Enable" ? "enabled" : "disabled", label: statusLabels[key] };
  };
  const items = records.map((record) => ({
    id: record.id,
    variant: "knowledge",
    title: record.title,
    draft: record.stage === "Draft",
    draftLabel,
    description: record.description,
    status: statusOf(record),
    meta: [
      { label: synonymsLabel, value: <ChipList singleLine values={record.synonyms || []} max={Infinity} /> },
      ...(record.scope?.length ? [{ label: sections.dataModel || "Data Model", value: record.kind === "Global Synonym" || record.scope[0] === "Global" ? "All models" : record.scope[0] }] : []),
      { label: creatorLabel, value: record.creator },
    ],
    actions: { actions: record.actions, labels: actionLabels, messages: tooltips },

  }));
  return (
    <section className="mh-btview" aria-label="Business Term library">
      <LibraryToolbar
        search={{ label: searchLabel, placeholder: searchPlaceholder, value: query }}
        searchRef={searchRef}
        facets={filters.map((filter) => ({ ...filter, kind: "multi", selectedLabel: filter.selectedLabel || selectedLabel }))}
        count={fill(countLabel, totals)}
        create={createHref ? { label: createLabel, href: createHref } : undefined}
        onChange={({ field, value, checked }) => {
          if (field === "search") onQueryChange?.({ name: "search", value });
          else onFilterToggle?.({ id: field, value, checked });
        }}
        onCreate={onCreate}
      />
      <LibraryList
        label="Business terms"
        items={items}
        empty={{ kind: totals.total ? "no-results" : "empty", title: emptyTitle, message: emptyMessage, clearLabel: clearFiltersLabel }}
        onOpen={onOpen}
        onAction={onAction}
        onClear={() => onClearFilters?.({ reason: "empty-state" })}
      />
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
        titleExtra={detail ? <StatusBadge status={statusOf(detail).status}>{statusOf(detail).label}</StatusBadge> : undefined}
        footer={detail ? <ItemActions id={detail.id} name={detail.title} actions={detail.actions} labels={actionLabels} messages={tooltips} onAction={onAction} /> : undefined}
        onClose={(event) => onCloseDetail?.({ reason: event.reason })}
      >
        {detail ? (
          <dl className="mh-btview__detail">
            <dt>{sections.termType}</dt>
            <dd>{detail.kind}</dd>
            <dt>{sections.description}</dt>
            <dd>{detail.description}</dd>
            <dt>{sections.synonyms}</dt>
            <dd>
              <ChipList values={detail.synonyms || []} max={Infinity} />
            </dd>
            <dt>{sections.dataModel}</dt>
            <dd><ChipList values={[scopeLabel(detail)]} tone="success" /></dd>
            <dt>{sections.creator}</dt>
            <dd>{detail.creator}</dd>
          </dl>
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
      <Toast open={Boolean(toast)} message={toast} />
    </section>
  );
}
