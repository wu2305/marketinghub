import "../../../tokens.css";
import React from "react";
import { Button } from "../../../components/Button/index.jsx";
import { ChipList } from "../../../components/ChipList/index.jsx";
import { ConfirmDialog } from "../../../components/ConfirmDialog/index.jsx";
import { ItemActions } from "../../../components/ItemActions/index.jsx";
import { LibraryList } from "../../../components/LibraryList/index.jsx";
import { LibraryToolbar } from "../../../components/LibraryToolbar/index.jsx";
import { Modal } from "../../../components/Modal/index.jsx";
import { Pagination } from "../../../components/Pagination/index.jsx";
import { StatusBadge } from "../../../components/StatusBadge/index.jsx";
import { Toast } from "../../../components/Toast/index.jsx";
import { cx } from "../../../cx.js";
import { Icon, knowledgeActionIconPaths } from "../../../icons.jsx";
import "./FieldLibraryView.css";
import { availabilityOf } from "../../../lib/governance.js";


/** @type {readonly ["Report Context", "Metric Dictionary", "Analytical Model", "Email Reports"]} */
export const fieldLibraryTypes = ["Report Context", "Metric Dictionary", "Analytical Model", "Email Reports"];

const availabilityStatus = (enabled, labels = {}) =>
  enabled ? { status: "enabled", label: labels.enabled || "Enabled" } : { status: "disabled", label: labels.disabled || "Disabled" };

/* Card content per type (field-library.js reportContextCard / metricCard /
   analysisCard / emailCard) mapped onto LibraryItem (patterns/library.md §5). */
function toItem(type, record, strings) {
  const labels = strings.cardLabels || {};
  const states = strings.statusLabels || {};
  const base = { id: record.id, variant: "knowledge" };
  if (type === "Report Context") return {
    ...base, title: record.report_name, description: record.report_description,
    status: availabilityStatus(record.ai_interpretation_enabled, states),
    meta: [{ label: labels.project || "Project", value: (record.projectLabels || []).join(", ") || "—" }],
  };
  if (type === "Metric Dictionary") return {
    ...base, title: record.metric_name, description: record.business_definition || "—",
    status: availabilityStatus(availabilityOf(record) === "enabled", states),
    meta: [
      { label: labels.synonyms || "Synonyms", value: <ChipList singleLine values={record.metric_aliases || []} max={Infinity} /> },
      { label: labels.dataModel || "Data model", value: (record.business_domain || []).join(", ") || "General" },
      { label: labels.unit || "Unit", value: record.unit || "—", secondary: { label: labels.type || "Type", value: record.metric_type || "Base" } },
    ],
  };
  if (type === "Analytical Model") return {
    ...base, title: record.analysis_name,
    description: record.applicable_scenarios || record.trigger_when || record.summary || "—",
    status: availabilityStatus(availabilityOf(record) === "enabled", states),
    meta: [
      { label: labels.dataModelTitle || "Data Model", value: (record.business_domain || []).join(", ") || "General" },
      { label: labels.referencedMetrics || "Referenced Metrics", value: (record.referenced_metrics || []).join(", ") || "—" },
      { label: labels.creator || "Creator", value: record.created_by || "—" },
    ],
    actions: { actions: record.actions, labels: strings.actions, messages: strings.tooltips },
  };
  return {
    ...base, title: record.title || record.email_subject,
    description: record.description || record.summary || "",
    status: availabilityStatus(availabilityOf(record) === "enabled", states),
    meta: [
      { label: labels.dataModelTitle || "Data Model", value: record.data_model || "All models" },
      { label: labels.recipients || "Recipients", value: <ChipList singleLine values={record.recipients || []} max={Infinity} /> },
      { label: labels.sendTime || "Send time", value: String(record.trigger_type || record.schedule || record.sent_at || "Not configured").replace(/^Scheduled\s*·\s*/, "") },
    ],
  };
}

/* Drawer detail bodies — field-library.js open() per type. MD/AM/ER use the
   shared scenario-report-detail section list; Report Context is the bespoke
   thumbnail/overview/linked/scope layout. */
function Section({ title, children }) {
  return (
    <section className="mh-flview__section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
const SectionParagraph = ({ text }) => <p className="mh-flview__prewrap">{text || "—"}</p>;

function DetailBody({ type, record, strings, onAction }) {
  const drawer = strings.drawer || {};
  const sections = drawer.sections || {};
  const metaLabels = drawer.metaLabels || {};
  if (type === "Report Context") {
    return (
      <>
        <div className="mh-flview__rc-thumb">
          {record.report_thumbnail ? (
            <img src={record.report_thumbnail} alt={`${record.report_name} thumbnail`} />
          ) : (
            <span>{drawer.previewUnavailable || "Report preview unavailable"}</span>
          )}
        </div>
        <section className="mh-flview__rc-overview">
          <h4 className="mh-flview__rc-desc-title">
            <span>{drawer.reportDescription || "Report Description"}</span>
            <button
              type="button"
              className="mh-flview__rc-edit"
              aria-label={drawer.editDescription || "Edit report description"}
              title={drawer.editDescription || "Edit report description"}
              onClick={() => onAction?.({ action: "edit-description", id: record.id })}
            >
              <Icon path={knowledgeActionIconPaths.edit} />
            </button>
          </h4>
          <p>{record.report_description}</p>
          <div className="mh-flview__rc-meta">
            <div>
              <span>{drawer.project || "Project"}</span>
              <ChipList values={record.projectLabels || []} tone="success" max={Infinity} />
            </div>
            <div>
              <span>{drawer.aiInterpreterStatus || "AI Interpreter Status"}</span>
              <span className="mh-flview__state-text">{record.ai_interpretation_enabled ? drawer.states?.open || "Open" : drawer.states?.close || "Close"}</span>
            </div>
            <div>
              <span>{drawer.aiSummary || "AI Summary"}</span>
              <span className="mh-flview__state-text">{record.ai_summary_enabled ? drawer.states?.open || "Open" : drawer.states?.close || "Close"}</span>
            </div>
          </div>
        </section>
        <section className="mh-flview__rc-section mh-flview__rc-linked">
          <h3 className="mh-flview__rc-heading">{drawer.scenarioReportings || "Scenario Reportings"}</h3>
          <div className="mh-flview__tags">
            {(record.scenarioLinks || []).length ? (
              record.scenarioLinks.map((link) => (
                <a key={link.id} className="mh-flview__chip mh-flview__scenario-link" href={link.href} aria-label={`Open ${link.title} scenario reporting detail`}>
                  {link.title} &gt;
                </a>
              ))
            ) : (
              <span>{drawer.noScenarios || "No scenario reportings linked to this report."}</span>
            )}
          </div>
        </section>
        <section className="mh-flview__rc-section">
          <h3 className="mh-flview__rc-heading">{drawer.reportDataScope || "Report Data Scope"}</h3>
          <p className="mh-flview__rc-scope">{record.report_data_scope || drawer.noScope || "Report data scope has not been configured."}</p>
        </section>
      </>
    );
  }
  return (
    <div className={cx("mh-flview__detail", type === "Metric Dictionary" && "mh-flview__detail--metric")}>
      {(sections[type] || []).map(([key, label, format]) => (
        <Section key={key} title={label}>
          {format === "tags" ? (
            <ChipList values={record[key] || []} max={Infinity} />
          ) : format === "domain" ? (
            <ChipList values={record[key] || []} tone="success" max={Infinity} />
          ) : key === "output_requirements" ? (
            <SectionParagraph text={record.output_requirements || (record.analysis_steps || []).join("\n")} />
          ) : key === "applicable_scenarios" ? (
            <SectionParagraph text={record.applicable_scenarios || record.summary} />
          ) : (
            <SectionParagraph text={record[key]} />
          )}
        </Section>
      ))}
      {type === "Analytical Model" ? (
        <dl className="mh-flview__detail-meta">
          <div>
            <dt>{metaLabels.createdBy || "Created By"}</dt>
            <dd>{record.created_by}</dd>
          </div>
          <div>
            <dt>{metaLabels.createdAt || "Created At"}</dt>
            <dd>{record.created_at}</dd>
          </div>
          <div>
            <dt>{metaLabels.updatedAt || "Updated At"}</dt>
            <dd>{record.updated_at}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}

/**
 * Field-mapping libraries (field-library.js) for `?type=Report Context |
 * Metric Dictionary | Analytical Model | Email Reports` on the governed-library
 * pattern (patterns/library.md): LibraryToolbar, LibraryList cards, compact
 * pagination, the detail drawer and a success Toast. What each type keeps
 * (§5): its card fields and chip row (`toItem`), its drawer sections, and for
 * Report Context the description editor. Presentational: useFieldLibraryDemo
 * owns normalization, filtering, pagination and every dialog/action rule.
 * @param {object} props
 * @param {typeof fieldLibraryTypes[number]} props.type active knowledge type
 * @param {Array<object>} [props.records=[]] filtered + paged normalized records
 * @param {{ shown: number, total: number }} [props.totals]
 * @param {Array<object>} [props.filters=[]] CheckboxFilter descriptors (fm order)
 * @param {string} [props.query=""]
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=6]
 * @param {Array<number>} [props.pageSizes=[6, 12, 24]]
 * @param {object} [props.strings={}] copy bundle — searchLabel, searchPlaceholder,
 *   selectedLabel ("{labels}" joins selected option labels), emptyMessage,
 *   units, rowsPerPageLabel, previousLabel, nextLabel, detailCloseLabel,
 *   cardLabels {project,unit,type,dataModel,synonyms,moreSynonyms,sendTime,
 *   recipients,dataModelTitle,referencedMetrics,moreReferenced,creator},
 *   createLabels, drawer {reportDescription, editDescription, project,
 *   aiInterpreterStatus, aiSummary, scenarioReportings, noScenarios,
 *   reportDataScope, noScope, previewUnavailable, openDashboard, close,
 *   states {open, close}, editDialog, sections, metaLabels}, dialogs
 * @param {string} [props.countUnit="records"] plural unit in the toolbar count (`strings.countLabel`, default "Showing {shown} of {total} {unit}")
 * @param {string} [props.createHref] "Add Analytical Model" link (AM only)
 * @param {string} [props.createLabel]
 * @param {string} [props.dashboardHref] RC drawer "Open Dashboard" target
 * @param {React.Ref<HTMLInputElement>} [props.searchRef]
 * @param {object|null} [props.detail] normalized record in the drawer — the
 *   container adds detailTitle, detailStatus, projectLabels (RC), actions
 *   (AM) and scenarioLinks (RC)
 * @param {object|null} [props.dialog] ConfirmDialog content
 * @param {object|null} [props.descriptionEdit] RC description dialog state —
 *   { id, value, original, eyebrow, title, fieldLabel, cancelLabel,
 *   confirmLabel, closeLabel }
 * @param {string} [props.toast=""] success message after disable/delete; empty = hidden
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(event: { id: string, value: string, checked: boolean }) => void} [props.onFilterToggle]
 * @param {(event: { reason: string }) => void} [props.onClearFilters] from the no-results state
 * @param {(event: { page: number }) => void} [props.onPage]
 * @param {(event: { pageSize: number }) => void} [props.onPageSize]
 * @param {(event: { id: string }) => void} [props.onOpen] title button or card click
 * @param {(event: { action: string, id: string, blocked?: boolean, reason?: string|null }) => void} [props.onAction]
 *   Analytical Model actions (governed, pattern B6-B7) + the RC drawer's edit-description pencil
 * @param {(event: { reason: string }) => void} [props.onCloseDetail]
 * @param {(event: { confirmed: true }) => void} [props.onDialogConfirm]
 * @param {(event: { reason: string }) => void} [props.onDialogCancel]
 * @param {(event: { value: string }) => void} [props.onDescriptionChange]
 * @param {(event: { id: string }) => void} [props.onDescriptionConfirm]
 * @param {(event: { reason: string }) => void} [props.onDescriptionCancel]
 * @param {(event: { href: string }) => void} [props.onCreate]
 */
export function FieldLibraryView({
  type,
  records = [],
  totals = { shown: 0, total: 0 },
  filters = [],
  query = "",
  page = 1,
  pageSize = 6,
  pageSizes = [6, 12, 24],
  strings = {},
  countUnit = "records",
  createHref,
  createLabel,
  dashboardHref,
  searchRef,
  detail = null,
  dialog = null,
  descriptionEdit = null,
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
  onDescriptionChange,
  onDescriptionConfirm,
  onDescriptionCancel,
  onCreate,
}) {
  const {
    searchLabel = "Search knowledge",
    searchPlaceholder = "Search knowledge...",
    selectedLabel = "{labels}",
    emptyMessage = "No knowledge matches your filters.",
    clearFiltersLabel = "Clear filters",
    countLabel = "Showing {shown} of {total} {unit}",
    units = ["records", "records"],
    rowsPerPageLabel = "Items per page",
    previousLabel = "Previous",
    nextLabel = "Next",
  } = strings;
  const count = countLabel.replace("{shown}", totals.shown).replace("{total}", totals.total).replace("{unit}", countUnit);
  return (
    <section className="mh-flview" data-fl-type={type} aria-label={`${type} library`}>
      <LibraryToolbar
        search={{ label: searchLabel, placeholder: searchPlaceholder, value: query }}
        searchRef={searchRef}
        facets={filters.map((filter) => ({ ...filter, kind: "multi", selectedLabel: filter.selectedLabel || selectedLabel }))}
        count={count}
        create={createLabel && createHref ? { label: createLabel, href: createHref } : undefined}
        onChange={({ field, value, checked }) => {
          if (field === "search") onQueryChange?.({ name: "search", value });
          else onFilterToggle?.({ id: field, value, checked });
        }}
        onCreate={onCreate}
      />
      <LibraryList
        label={`${type} records`}
        items={records.map((record) => toItem(type, record, strings))}
        empty={{ kind: totals.total ? "no-results" : "empty", title: emptyMessage, clearLabel: clearFiltersLabel }}
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
      <FieldLibraryDrawer
        type={type}
        strings={strings}
        detail={detail}
        dialog={dialog}
        descriptionEdit={descriptionEdit}
        dashboardHref={dashboardHref}
        onAction={onAction}
        onCloseDetail={onCloseDetail}
        onDialogConfirm={onDialogConfirm}
        onDialogCancel={onDialogCancel}
        onDescriptionChange={onDescriptionChange}
        onDescriptionConfirm={onDescriptionConfirm}
        onDescriptionCancel={onDescriptionCancel}
      />
      <Toast open={Boolean(toast)} message={toast} />
    </section>
  );
}

/**
 * The fm detail drawer + dialogs as a standalone layer — the original
 * `reportcontext:view` event opens the Report Context drawer from *any* type
 * page (Data Model's related-report buttons, the generic asset list), so the
 * page composes this separately when a record is peeked outside its own view.
 * `detail` is the normalized record the container prepared (with detailTitle,
 * detailStatus, projectLabels, actions, scenarioLinks).
 * @param {Record<string, any>} props
 */
export function FieldLibraryDrawer({
  type,
  strings = {},
  detail = null,
  dialog = null,
  descriptionEdit = null,
  dashboardHref,
  onAction,
  onCloseDetail,
  onDialogConfirm,
  onDialogCancel,
  onDescriptionChange,
  onDescriptionConfirm,
  onDescriptionCancel,
}) {
  const {
    detailCloseLabel = "Close details",
    drawer: drawerStrings = {},
  } = strings;
  const editStrings = drawerStrings.editDialog || {};
  const descriptionAreaRef = React.useRef(null);
  const drawerStatusOn = detail ? String(detail.detailStatus || "").toLowerCase().startsWith("enable") : false;
  return (
    <>
      <Modal
        open={Boolean(detail)}
        variant="drawer"
        className={cx("mh-flview__drawer", type === "Report Context" && "mh-flview__drawer--rc")}
        eyebrow={detail?.type}
        title={detail?.detailTitle}
        closeLabel={detailCloseLabel}
        titleExtra={detail?.detailStatus ? <StatusBadge variant="detail" status={drawerStatusOn ? "Enabled" : "Disabled"}>{detail.detailStatus}</StatusBadge> : undefined}
        footer={
          detail && type === "Report Context" ? (
            <>
              <Button variant="secondary" onClick={() => onCloseDetail?.({ reason: "button" })}>
                {drawerStrings.close || "Close"}
              </Button>
              <Button variant="primary" href={dashboardHref}>
                {drawerStrings.openDashboard || "Open Dashboard"}
              </Button>
            </>
          ) : detail && type === "Analytical Model" ? (
            <ItemActions id={detail.id} name={detail.detailTitle} actions={detail.actions} labels={strings.actions} messages={strings.tooltips} onAction={onAction} />
          ) : undefined
        }
        onClose={(event) => onCloseDetail?.({ reason: event.reason })}
      >
        {detail ? <DetailBody type={type} record={detail} strings={strings} onAction={onAction} /> : null}
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
      {/* editReportDescriptionDialog — the centered Report Description editor
          opened from the RC drawer pencil. Confirm enables once the value
          differs from the original. */}
      <Modal
        open={Boolean(descriptionEdit)}
        className="mh-flview__edit"
        eyebrow={descriptionEdit?.eyebrow || editStrings.eyebrow || "REPORT CONTEXT"}
        title={descriptionEdit?.title || editStrings.title || "Edit Report Description"}
        closeLabel={descriptionEdit?.closeLabel || editStrings.closeLabel || "Close description editor"}
        initialFocus={descriptionAreaRef}
        onClose={(event) => onDescriptionCancel?.({ reason: event.reason })}
      >
        {descriptionEdit ? (
          <>
            <label className="mh-flview__edit-field">
              <span>{descriptionEdit.fieldLabel || editStrings.fieldLabel || "Report Description"}</span>
              <textarea
                ref={descriptionAreaRef}
                aria-label={descriptionEdit.fieldLabel || editStrings.fieldLabel || "Report Description"}
                value={descriptionEdit.value}
                onChange={(event) => onDescriptionChange?.({ value: event.target.value })}
              />
            </label>
            <div className="mh-flview__edit-foot">
              <Button variant="secondary" onClick={() => onDescriptionCancel?.({ reason: "cancel" })}>
                {descriptionEdit.cancelLabel || editStrings.cancelLabel || "Cancel"}
              </Button>
              <Button
                variant="gold"
                disabled={descriptionEdit.value === descriptionEdit.original}
                onClick={() => onDescriptionConfirm?.({ id: descriptionEdit.id })}
              >
                {descriptionEdit.confirmLabel || editStrings.confirmLabel || "Confirm"}
              </Button>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
}
