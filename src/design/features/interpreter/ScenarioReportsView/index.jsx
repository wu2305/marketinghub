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
import "./ScenarioReportsView.css";
import { availabilityOf } from "../../../lib/governance.js";

const workflowBadge = (status) => <StatusBadge variant="process" status={String(status || "").toLowerCase()}>{status}</StatusBadge>;

/**
 * Scenario Reporting library (scenario-reports.js) on the governed-library
 * pattern (patterns/library.md): LibraryToolbar with Status and Process
 * facets, LibraryList cards showing both axes — availability (status badge)
 * and workflow (Process) — the detail drawer with the same actions (B13) and
 * a success Toast. `useScenarioDemo` owns normalization, filters and
 * lib/governance.js rules.
 * @param {object} props
 * @param {object} props.strings copy: searchLabel, searchPlaceholder, createLabel, empty, clearFiltersLabel, countLabel, rowsPerPage, previous, next, eyebrow, closeDetailLabel, relatedReport, description, structureGuidance, supportingFiles, workflowNote, createdBy, createdAt, updatedAt, enabled, disabled, reportLabel, creatorLabel, processLabel, actions, tooltips
 * @param {Array<{ id: string, label: string, allLabel: string, options: Array<{ id: string, label: string }> }>} [props.filters=[]] single-choice facets
 * @param {Object<string, string>} [props.filterValues={}] selected option id per facet ("" = all)
 * @param {string} [props.query=""]
 * @param {Array<object>} [props.records=[]] current page of normalized records, each with `actions` from governedActions()
 * @param {number} [props.total] filtered count
 * @param {number} [props.totalAll] unfiltered count
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=10]
 * @param {Array<number>} [props.pageSizeOptions=[5, 10, 20]]
 * @param {string} [props.createHref]
 * @param {React.Ref<HTMLInputElement>} [props.searchRef]
 * @param {object|null} [props.detail] record in the drawer, with `actions`
 * @param {boolean} [props.showWorkflowNote=false] drawer note for records not yet published
 * @param {object|null} [props.dialog] ConfirmDialog content
 * @param {string} [props.toast=""] success message; empty = hidden
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(event: { id: string, value: string }) => void} [props.onFilterChange]
 * @param {(event: { reason: string }) => void} [props.onClearFilters]
 * @param {(event: { page: number }) => void} [props.onPage]
 * @param {(event: { pageSize: number }) => void} [props.onPageSize]
 * @param {(event: { id: string }) => void} [props.onOpen]
 * @param {(event: { action: string, id: string, blocked: boolean, reason: string|null }) => void} [props.onAction]
 * @param {(event: { reason: string }) => void} [props.onCloseDetail]
 * @param {(event: { confirmed: true }) => void} [props.onDialogConfirm]
 * @param {(event: { reason: string }) => void} [props.onDialogCancel]
 * @param {(event: { href: string }) => void} [props.onCreate]
 */
export function ScenarioReportsView({
  strings = {},
  filters = [],
  filterValues = {},
  query = "",
  records = [],
  total = 0,
  totalAll = 0,
  page = 1,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20],
  createHref,
  searchRef,
  detail = null,
  showWorkflowNote = false,
  dialog = null,
  toast = "",
  onQueryChange,
  onFilterChange,
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
  const availability = (record) =>
    availabilityOf(record) === "enabled" ? { status: "enabled", label: strings.enabled || "Enabled" } : { status: "disabled", label: strings.disabled || "Disabled" };
  const reportValue = (record) => (record.reportHref ? <a className="mh-srview__report" href={record.reportHref}>{record.report || "—"}</a> : record.report || "—");
  const items = records.map((record) => ({
    id: record.id,
    variant: "knowledge",
    title: record.title,
    description: record.description,
    status: availability(record),
    meta: [
      { label: strings.reportLabel || "Report", value: reportValue(record) },
      { label: strings.processLabel || "Process", value: workflowBadge(record.workflow_status) },
      { label: strings.creatorLabel || "Creator", value: record.creator },
    ],
    actions: { actions: record.actions, labels: strings.actions, messages: strings.tooltips },
  }));
  const count = (strings.countLabel || "Showing {shown} of {total} scenarios").replace("{shown}", total).replace("{total}", totalAll);
  return (
    <section className="mh-srview" aria-label="Scenario Reporting library">
      <LibraryToolbar
        search={{ label: strings.searchLabel || "Search knowledge", placeholder: strings.searchPlaceholder, value: query }}
        searchRef={searchRef}
        facets={filters.map((filter) => ({ ...filter, kind: "single", selected: filterValues[filter.id] || "" }))}
        count={count}
        create={createHref ? { label: strings.createLabel || "Add Scenario reporting", href: createHref } : undefined}
        onChange={({ field, value }) => {
          if (field === "search") onQueryChange?.({ name: "search", value });
          else onFilterChange?.({ id: field, value });
        }}
        onCreate={onCreate}
      />
      <LibraryList
        label="Scenario reports"
        items={items}
        empty={{ kind: totalAll ? "no-results" : "empty", title: strings.empty || "No matching records", clearLabel: strings.clearFiltersLabel }}
        onOpen={onOpen}
        onAction={onAction}
        onClear={() => onClearFilters?.({ reason: "empty-state" })}
      />
      <Pagination
        variant="compact"
        total={total}
        units={["record", "records"]}
        page={page}
        pageSize={pageSize}
        pageSizes={pageSizeOptions}
        rowsLabel={strings.rowsPerPage}
        previousLabel={strings.previous}
        nextLabel={strings.next}
        onPage={onPage}
        onPageSize={onPageSize}
      />
      <Modal
        variant="drawer"
        className="mh-srview__drawer"
        open={Boolean(detail)}
        eyebrow={strings.eyebrow}
        title={detail?.title}
        closeLabel={strings.closeDetailLabel}
        onClose={(event) => onCloseDetail?.({ reason: event.reason })}
        titleExtra={
          detail ? (
            <>
              <StatusBadge status={availability(detail).status}>{availability(detail).label}</StatusBadge>
              {workflowBadge(detail.workflow_status)}
            </>
          ) : undefined
        }
        footer={detail ? <ItemActions id={detail.id} name={detail.title} actions={detail.actions} labels={strings.actions} messages={strings.tooltips} onAction={onAction} /> : undefined}
      >
        {detail ? (
          <dl className="mh-srview__detail">
            <dt>{strings.relatedReport}</dt>
            <dd>{reportValue(detail)}</dd>
            <dt>{strings.description}</dt>
            <dd>{detail.description || "—"}</dd>
            <dt>{strings.structureGuidance}</dt>
            <dd className="mh-srview__prewrap">{detail.structure_guidance || "—"}</dd>
            <dt>{strings.supportingFiles}</dt>
            <dd><ChipList values={detail.attachments || []} max={Infinity} /></dd>
            {showWorkflowNote ? <dd className="mh-srview__note">{strings.workflowNote}</dd> : null}
            <dd className="mh-srview__meta-footer">
              <span>{strings.createdBy}: {detail.creator || "—"}</span>
              <span>{strings.createdAt}: {detail.created_at || "—"}</span>
              <span>{strings.updatedAt}: {detail.updated || "—"}</span>
            </dd>
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
