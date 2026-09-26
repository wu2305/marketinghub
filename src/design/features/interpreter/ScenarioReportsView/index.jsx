import "../../../tokens.css";
import { ConfirmDialog } from "../../../components/ConfirmDialog/index.jsx";
import { Modal } from "../../../components/Modal/index.jsx";
import { Pagination } from "../../../components/Pagination/index.jsx";
import { SearchField } from "../../../components/SearchField/index.jsx";
import { KnowledgeActions } from "../KnowledgeActions/index.jsx";
import { cx } from "../../../cx.js";
import "./ScenarioReportsView.css";

/**
 * Scenario Reporting knowledge type — `scenario-reports.js`
 * `#scenarioReportOverview`: unified toolbar with two select filters + search
 * + create link, a three-column card grid with status pill + gated icon
 * actions, and the shared `#knowledgeDetail` slide-in drawer (label + title +
 * availability/workflow pills + sectioned body + actions footer).
 * @param {Record<string, any>} props — prepared by `useScenarioDemo`
 */
export function ScenarioReportsView({
  strings,
  filters = [],
  filterValues = {},
  onFilterChange,
  query,
  onQueryChange,
  records = [],
  total,
  totalAll,
  actionsFor = () => [],
  onAction,
  onOpen,
  detail,
  detailEnabled,
  showWorkflowNote,
  onCloseDetail,
  dialog,
  onDialogConfirm,
  onDialogCancel,
  createHref,
  onCreate,
  page,
  onPage,
  pageSize,
  pageSizeOptions,
  onPageSize,
  searchRef,
  ...rest
}) {
  const flowPill = (status, className) => (
    <span className={className} data-flow-status={status}>
      {status}
    </span>
  );
  return (
    <section className="mh-srview" {...rest}>
      <div className="mh-srview__tools">
        {filters.map((filter) => (
          <label className="mh-srview__filter" key={filter.id}>
            <span>{filter.label}</span>
            <select
              value={filterValues[filter.id] || ""}
              aria-label={filter.label}
              onChange={(event) => onFilterChange?.({ id: filter.id, value: event.target.value })}
            >
              <option value="">{filter.allLabel}</option>
              {(filter.options || []).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        <div className="mh-srview__search">
          <SearchField
            label={strings.searchLabel}
            variant="plain"
            size="md"
            value={query}
            placeholder={strings.searchPlaceholder}
            inputRef={searchRef}
            onChange={onQueryChange}
          />
        </div>
        <a className="mh-srview__create" href={createHref} target="_blank" rel="noopener" onClick={() => onCreate?.()}>
          <span aria-hidden="true">＋</span>
          {strings.createLabel}
        </a>
      </div>
      {/* fm-overview-countline — rendered but display:none on type pages. */}
      <div className="mh-srview__countline" aria-live="polite" hidden>
        Showing <strong>{total ?? records.length}</strong> of <strong>{totalAll ?? records.length}</strong> scenarios
      </div>
      <div className="mh-srview__wrap">
        {records.length ? (
          <div className="mh-srview__list">
            {records.map((record) => (
              <article
                key={record.id}
                className="mh-srview__card"
                data-id={record.id}
                tabIndex={0}
                onClick={(event) => {
                  if (event.target.closest("a, button")) return;
                  onOpen?.(record);
                }}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
                  event.preventDefault();
                  onOpen?.(record);
                }}
              >
                <div className="mh-srview__card-main">
                  <h3>{record.title}</h3>
                  <p title={record.description}>{record.description}</p>
                  <div className="mh-srview__meta">
                    <span>Report</span>
                    {record.reportHref ? (
                      <a className="mh-srview__report-link" href={record.reportHref}>
                        {record.report || "—"}
                      </a>
                    ) : (
                      <strong>{record.report || "—"}</strong>
                    )}
                  </div>
                  <div className="mh-srview__meta">
                    <span>Creator</span>
                    <strong>{record.creator}</strong>
                  </div>
                  <div className="mh-srview__meta mh-srview__process">
                    <span>Process</span>
                    {flowPill(record.workflow_status, "mh-srview__flow")}
                  </div>
                </div>
                <div className="mh-srview__pills">
                  <span className={cx("mh-srview__state", !record.ai_interpreter_enabled && "is-off")}>
                    {record.ai_interpreter_enabled ? strings.enabled : strings.disabled}
                  </span>
                </div>
                <div className="mh-srview__card-actions">
                  <KnowledgeActions variant="scenario" actions={actionsFor(record)} record={record} onAction={({ action }) => onAction?.(action, record)} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mh-srview__empty" role="status">
            {strings.empty}
          </div>
        )}
      </div>
      <div className="mh-srview__pagination">
        <Pagination
          variant="compact"
          total={total ?? records.length}
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
      </div>
      <Modal
        variant="drawer"
        className="mh-srview__drawer"
        open={Boolean(detail)}
        eyebrow={strings.eyebrow}
        title={detail?.title}
        closeLabel={strings.closeDetailLabel}
        onClose={onCloseDetail}
        titleExtra={
          detail ? (
            <>
              <span className="mh-srview__title-pill" data-status={detailEnabled ? "enabled" : "disabled"}>
                <i aria-hidden="true" />
                {detailEnabled ? strings.enabled : strings.disabled}
              </span>
              {flowPill(detail.workflow_status, "mh-srview__flow mh-srview__flow--head")}
            </>
          ) : null
        }
        footer={detail ? <KnowledgeActions variant="scenario" actions={actionsFor(detail)} record={detail} onAction={({ action }) => onAction?.(action, detail)} /> : null}
      >
        {detail ? (
          <div className="mh-srview__detail">
            <section className="mh-srview__section">
              <h3>{strings.relatedReport}</h3>
              {detail.reportHref ? (
                <a className="mh-srview__detail-link" href={detail.reportHref}>
                  {detail.report || "—"}
                </a>
              ) : (
                <p>{detail.report || "—"}</p>
              )}
            </section>
            <section className="mh-srview__section">
              <h3>{strings.description}</h3>
              <p>{detail.description || "—"}</p>
            </section>
            <section className="mh-srview__section">
              <h3>{strings.structureGuidance}</h3>
              <p className="mh-srview__prewrap">{detail.structure_guidance || "—"}</p>
            </section>
            <section className="mh-srview__section">
              <h3>{strings.supportingFiles}</h3>
              {detail.attachments?.length ? (
                <div className="mh-srview__tags">
                  {detail.attachments.map((file) => (
                    <span key={file} className="mh-srview__tag">
                      {file}
                    </span>
                  ))}
                </div>
              ) : (
                <p>—</p>
              )}
            </section>
            {showWorkflowNote ? (
              <p className="mh-srview__note">
                <span className="mh-srview__note-mark" aria-hidden="true">
                  i
                </span>
                <span>{strings.workflowNote}</span>
              </p>
            ) : null}
            <dl className="mh-srview__meta-footer">
              <div>
                <dt>{strings.createdBy}</dt>
                <dd>{detail.creator || detail.owner || "—"}</dd>
              </div>
              <div>
                <dt>{strings.createdAt}</dt>
                <dd>{detail.created_at || detail.created || "—"}</dd>
              </div>
              <div>
                <dt>{strings.updatedAt}</dt>
                <dd>{detail.updated || "—"}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Modal>
      {dialog ? (
        <ConfirmDialog
          open
          title={dialog.title}
          message={dialog.message}
          cancelLabel={dialog.cancelLabel}
          confirmLabel={dialog.confirmLabel}
          onConfirm={onDialogConfirm}
          onCancel={onDialogCancel}
        />
      ) : null}
    </section>
  );
}
