import "../../../tokens.css";
import React from "react";
import { CheckboxFilter } from "../../../components/CheckboxFilter/index.jsx";
import { ConfirmDialog } from "../../../components/ConfirmDialog/index.jsx";
import { Modal } from "../../../components/Modal/index.jsx";
import { Pagination } from "../../../components/Pagination/index.jsx";
import { SearchField } from "../../../components/SearchField/index.jsx";
import { StatusBadge } from "../../../components/StatusBadge/index.jsx";
import { cx } from "../../../cx.js";
import { Icon, knowledgeActionIconPaths } from "../../../icons.jsx";
import { KnowledgeActions } from "../KnowledgeActions/index.jsx";
import "./FieldLibraryView.css";


/** @type {readonly ["Report Context", "Metric Dictionary", "Analytical Model", "Email Reports"]} */
export const fieldLibraryTypes = ["Report Context", "Metric Dictionary", "Analytical Model", "Email Reports"];

function ChipTags({ values = [], domain = false }) {
  if (!values.length) return <span className="mh-flview__dash">—</span>;
  return (
    <div className="mh-flview__tags">
      {values.map((value) => (
        <span key={value} className={cx("mh-flview__chip", domain && "mh-flview__domain")}>
          {value}
        </span>
      ))}
    </div>
  );
}

const cardKeyDown = (record, onOpen) => (event) => {
  if (event.target !== event.currentTarget) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onOpen?.({ id: record.id });
  }
};
const cardClick = (record, onOpen) => (event) => {
  if (event.target.closest("button, a, input, select, textarea")) return;
  onOpen?.({ id: record.id });
};

/* reportContextCard() — title + AI-Interpreter status pill + description +
   Project meta row. No action buttons (actions() returns "" for this type). */
function ReportContextCard({ record, onOpen, strings }) {
  const labels = strings.cardLabels || {};
  return (
    <article
      className="mh-flview__card mh-flview__report-card"
      data-id={record.id}
      tabIndex={0}
      aria-label={`View ${record.report_name}`}
      onClick={cardClick(record, onOpen)}
      onKeyDown={cardKeyDown(record, onOpen)}
    >
      <div className="mh-flview__report-title-row">
        <h3 title={record.report_name}>{record.report_name}</h3>
        <StatusBadge variant="knowledge" status={record.ai_interpretation_enabled ? "Enabled" : "Disabled"} />
      </div>
      <p title={record.report_description}>{record.report_description}</p>
      <dl className="mh-flview__report-meta">
        <div>
          <dt>{labels.project || "Project"}</dt>
          <dd>{(record.projectLabels || []).join(", ") || "—"}</dd>
        </div>
      </dl>
    </article>
  );
}

/* metricCard() — title + status pill + definition + Unit/Type/Data model
   meta + a single visible synonym chip plus the "…" overflow marker. */
function MetricCard({ record, onOpen, strings }) {
  const labels = strings.cardLabels || {};
  const aliases = record.metric_aliases || [];
  const first = aliases[0] || "";
  const showFirst = first && first.length <= 24;
  const showMore = aliases.length > 1 || (first && first.length > 24);
  return (
    <article
      className={cx("mh-flview__card mh-flview__metric-card", record.status === "Disable" ? "is-disabled" : "is-enabled")}
      data-id={record.id}
      tabIndex={0}
      aria-label={`View ${record.metric_name}`}
      onClick={cardClick(record, onOpen)}
      onKeyDown={cardKeyDown(record, onOpen)}
    >
      <header className="mh-flview__metric-head">
        <h3 title={record.metric_name}>{record.metric_name}</h3>
        <StatusBadge variant="knowledge" status={record.status === "Disable" ? "Disabled" : "Enabled"} />
      </header>
      <p className="mh-flview__metric-definition" title={record.business_definition}>
        {record.business_definition || "—"}
      </p>
      <dl className="mh-flview__metric-meta">
        <div>
          <dt>{labels.unit || "Unit"}</dt>
          <dd>{record.unit || "—"}</dd>
        </div>
        <div>
          <dt>{labels.type || "Type"}</dt>
          <dd>{record.metric_type || "Base"}</dd>
        </div>
        <div className="mh-flview__metric-data-model">
          <dt>{labels.dataModel || "Data model"}</dt>
          <dd>{(record.business_domain || []).join(", ") || "General"}</dd>
        </div>
      </dl>
      {showFirst || showMore ? (
        <div className="mh-flview__metric-synonyms">
          <span>{labels.synonyms || "Synonyms"}</span>
          <div>
            {showFirst ? <span className="mh-flview__synonym">{first}</span> : null}
            {showMore ? (
              <span className="mh-flview__synonym mh-flview__synonym--more" aria-label={labels.moreSynonyms || "More synonyms"}>
                …
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

/* analysisCard() — title + status pill + description + Data Model/Referenced
   Metrics meta + Creator/action footer. The original also renders a hidden
   fm-analysis-domains chip row (display:none under the overview cascade) —
   the domains stay visible in the "Data Model" meta row instead. */
function AnalysisCard({ record, onOpen, onAction, strings }) {
  const labels = strings.cardLabels || {};
  const domains = (record.business_domain || []).length ? record.business_domain : ["General"];
  const referenced = record.referenced_metrics || [];
  return (
    <article
      className={cx("mh-flview__card mh-flview__analysis-card", record.status === "Disable" ? "is-disabled" : "is-enabled")}
      data-id={record.id}
      tabIndex={0}
      aria-label={`View ${record.analysis_name}`}
      onClick={cardClick(record, onOpen)}
      onKeyDown={cardKeyDown(record, onOpen)}
    >
      <header className="mh-flview__analysis-head">
        <div className="mh-flview__analysis-title">
          <h3 title={record.analysis_name}>{record.analysis_name}</h3>
        </div>
        <StatusBadge variant="knowledge" status={record.status === "Disable" ? "Disabled" : "Enabled"} />
      </header>
      <p className="mh-flview__analysis-description" title={record.applicable_scenarios || record.trigger_when || record.summary}>
        {record.applicable_scenarios || record.trigger_when || record.summary || "—"}
      </p>
      <div className="mh-flview__analysis-meta">
        <div>
          <span>{labels.dataModelTitle || "Data Model"}</span>
          <strong title={domains.join(", ")}>{domains.join(", ")}</strong>
        </div>
        <div className="mh-flview__analysis-referenced">
          <span>{labels.referencedMetrics || "Referenced Metrics"}</span>
          {referenced.length ? (
            <div className="mh-flview__analysis-ref-tags">
              <span className="mh-flview__analysis-ref-chip">{referenced[0]}</span>
              {referenced.length > 1 ? (
                <span className="mh-flview__analysis-ref-chip mh-flview__analysis-ref-more" aria-label={labels.moreReferenced || "More referenced metrics"}>
                  …
                </span>
              ) : null}
            </div>
          ) : (
            <strong>—</strong>
          )}
        </div>
      </div>
      <footer className="mh-flview__analysis-footer">
        <div className="mh-flview__analysis-creator">
          <span>{labels.creator || "Creator"}</span>
          <strong title={record.created_by}>{record.created_by || "Current User"}</strong>
        </div>
        <div className="mh-flview__analysis-actions">
          <KnowledgeActions variant="field-library" actions={record.actions} record={record} onAction={onAction} />
        </div>
      </footer>
    </article>
  );
}

/* emailCard() — title + Send time/Recipients/Data Model meta. Disabled
   reports render the same card (the is-disabled class carries no extra
   cascade, matching the original). */
function EmailCard({ record, onOpen, strings }) {
  const labels = strings.cardLabels || {};
  const sendTime = String(record.trigger_type || record.schedule || record.sent_at || "Not configured").replace(/^Scheduled\s*·\s*/, "");
  const recipients = record.recipients || [];
  return (
    <article
      className={cx("mh-flview__card mh-flview__email-card", record.status === "Disable" ? "is-disabled" : "is-enabled")}
      data-id={record.id}
      tabIndex={0}
      aria-label={`View ${record.title || record.email_subject}`}
      onClick={cardClick(record, onOpen)}
      onKeyDown={cardKeyDown(record, onOpen)}
    >
      <header className="mh-flview__email-head">
        <div className="mh-flview__email-titleline">
          <h3 title={record.title || record.email_subject}>{record.title || record.email_subject}</h3>
        </div>
      </header>
      <div className="mh-flview__email-meta">
        <div>
          <span>{labels.sendTime || "Send time"}</span>
          <strong title={sendTime}>{sendTime}</strong>
        </div>
        <div className="mh-flview__email-recipients">
          <span>{labels.recipients || "Recipients"}</span>
          <div className="mh-flview__email-recipient-tags">
            {recipients.length ? recipients.map((name) => <span key={name}>{name}</span>) : <em>—</em>}
          </div>
        </div>
        <div>
          <span>{labels.dataModelTitle || "Data Model"}</span>
          <strong title={record.data_model || "All models"}>{record.data_model || "All models"}</strong>
        </div>
      </div>
    </article>
  );
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
              <ChipTags values={record.projectLabels || []} domain />
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
            <ChipTags values={record[key] || []} />
          ) : format === "domain" ? (
            <ChipTags values={record[key] || []} domain />
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
 * Shared field-mapping library view (field-library.js `#fmLibrary`) serving
 * `?type=Report Context | Metric Dictionary | Analytical Model | Email
 * Reports` on the AI Interpreter page — per-type checkbox filters + search +
 * compact pagination + a 3-column card grid + the detail drawer. The four
 * types share the toolbar/drawer chrome but keep their own card composition
 * and drawer sections, matching the original's per-type renderers.
 * Presentational: useFieldLibraryDemo owns normalization, filtering,
 * pagination and every dialog/action rule.
 * @param {object} props
 * @param {typeof fieldLibraryTypes[number]} props.type active knowledge type
 * @param {Array<object>} [props.records=[]] filtered + paged normalized records
 * @param {{ shown: number, total: number }} [props.totals]
 * @param {Array<object>} [props.filters=[]] CheckboxFilter descriptors (fm order)
 * @param {string} [props.query=""]
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=10]
 * @param {Array<number>} [props.pageSizes=[5,10,20]]
 * @param {object} [props.strings={}] copy bundle — searchLabel, searchPlaceholder,
 *   selectedLabel ("{labels}" joins selected option labels), emptyMessage,
 *   units, rowsPerPageLabel, previousLabel, nextLabel, detailCloseLabel,
 *   cardLabels {project,unit,type,dataModel,synonyms,moreSynonyms,sendTime,
 *   recipients,dataModelTitle,referencedMetrics,moreReferenced,creator},
 *   createLabels, drawer {reportDescription, editDescription, project,
 *   aiInterpreterStatus, aiSummary, scenarioReportings, noScenarios,
 *   reportDataScope, noScope, previewUnavailable, openDashboard, close,
 *   states {open, close}, editDialog, sections, metaLabels}, dialogs
 * @param {string} [props.countUnit="records"] plural unit for the hidden count line
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
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(event: { id: string, value: string, checked: boolean }) => void} [props.onFilterToggle]
 * @param {(event: { page: number }) => void} [props.onPage]
 * @param {(event: { pageSize: number }) => void} [props.onPageSize]
 * @param {(event: { id: string }) => void} [props.onOpen] card click / Enter / Space
 * @param {(event: { action: string, id: string }) => void} [props.onAction]
 *   AM icon buttons + the RC drawer's edit-description pencil
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
  pageSize = 10,
  pageSizes = [5, 10, 20],
  strings = {},
  countUnit = "records",
  createHref,
  createLabel,
  dashboardHref,
  searchRef,
  detail = null,
  dialog = null,
  descriptionEdit = null,
  onQueryChange,
  onFilterToggle,
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
    units = ["records", "records"],
    rowsPerPageLabel = "Rows per page",
    previousLabel = "Previous",
    nextLabel = "Next",
  } = strings;
  const Card =
    type === "Report Context"
      ? ReportContextCard
      : type === "Metric Dictionary"
        ? MetricCard
        : type === "Analytical Model"
          ? AnalysisCard
          : EmailCard;
  return (
    <section className="mh-flview" data-fl-type={type} aria-label={`${type} library`}>
      {/* unified-type-toolbar.css order: the search pill is DOM-last but
          visually first (order:-1); the create link hugs the filters. */}
      <div className="mh-flview__tools">
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
        <div className="mh-flview__search">
          <SearchField label={searchLabel} value={query} placeholder={searchPlaceholder} variant="plain" inputRef={searchRef} onChange={onQueryChange} />
        </div>
        {createLabel ? (
          <a className="mh-flview__create" href={createHref} target="_blank" rel="noopener" onClick={() => onCreate?.({ href: createHref })}>
            <span aria-hidden="true">＋</span>
            {createLabel}
          </a>
        ) : null}
      </div>
      {/* fm-overview-countline — rendered but display:none on type pages. */}
      <div className="mh-flview__countline" aria-live="polite" hidden>
        Showing <strong>{totals.shown}</strong> of <strong>{totals.total}</strong> {countUnit}
      </div>
      {records.length ? (
        <div className="mh-flview__cards">
          {records.map((record) => (
            <Card key={record.id} record={record} strings={strings} onOpen={onOpen} onAction={onAction} />
          ))}
        </div>
      ) : (
        <div className={cx("mh-flview__empty", type === "Report Context" && "mh-flview__empty--card")}>{emptyMessage}</div>
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
        className={type === "Report Context" ? "mh-flview__drawer--rc" : undefined}
        eyebrow={detail?.type}
        title={detail?.detailTitle}
        closeLabel={detailCloseLabel}
        titleExtra={detail?.detailStatus ? <StatusBadge variant="detail" status={drawerStatusOn ? "Enabled" : "Disabled"}>{detail.detailStatus}</StatusBadge> : undefined}
        footer={
          detail && type === "Report Context" ? (
            <>
              <button type="button" className="mh-flview__foot-btn" onClick={() => onCloseDetail?.({ reason: "button" })}>
                {drawerStrings.close || "Close"}
              </button>
              <a className="mh-flview__foot-btn mh-flview__open-dashboard" href={dashboardHref} target="_blank" rel="noopener">
                {drawerStrings.openDashboard || "Open Dashboard"} <span aria-hidden="true">→</span>
              </a>
            </>
          ) : detail && type === "Analytical Model" ? (
            <KnowledgeActions variant="field-library" actions={detail.actions} record={detail} onAction={onAction} />
          ) : detail && type === "Metric Dictionary" ? (
            /* The original leaves the MD footer rendered but empty (only Email
               Reports hides it). */
            <React.Fragment />
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
              <button type="button" className="mh-flview__edit-btn" onClick={() => onDescriptionCancel?.({ reason: "cancel" })}>
                {descriptionEdit.cancelLabel || editStrings.cancelLabel || "Cancel"}
              </button>
              <button
                type="button"
                className="mh-flview__edit-btn mh-flview__edit-btn--primary"
                disabled={descriptionEdit.value === descriptionEdit.original}
                onClick={() => onDescriptionConfirm?.({ id: descriptionEdit.id })}
              >
                {descriptionEdit.confirmLabel || editStrings.confirmLabel || "Confirm"}
              </button>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
}
