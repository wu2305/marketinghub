import "../../../tokens.css";
import React from "react";
import { useOverlayLayer } from "../../../lib/overlay.js";
import { Icon } from "../../../icons.jsx";
import { LibraryEmpty } from "../../../components/LibraryEmpty/index.jsx";
import { LibraryItem } from "../../../components/LibraryItem/index.jsx";
import { SearchField } from "../../../components/SearchField/index.jsx";
import { StatusBadge } from "../../../components/StatusBadge/index.jsx";
import { cx } from "../../../cx.js";
import "./DataModelView.css";

const REPORT_ICON = "M7 3.5h6l4 4V20.5H7V3.5Zm6 0v5h5";
const CLOSE_ICON = "M6 6l12 12M18 6 6 18";
const FIT_ICON = "M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7";

/**
 * @typedef {{ field: string, name?: string, synonyms?: string[], unit?: string, [column: string]: any }} DataModelField One column of a table; extra keys are extra detail columns for `fieldFormat`.
 * @typedef {{ id: string, name: string, physicalName?: string, description?: string, rowCount?: string | number, type: "fact" | "dimension", fields?: DataModelField[] }} DataModelTable
 * @typedef {{ id: string, name: string, description?: string, status: "enable" | "disable", synonyms?: string[], reports?: string[], tables?: DataModelTable[] }} DataModelDomain
 * @typedef {{ table: DataModelTable, isFact: boolean, tab: "fields" | "preview", fields: DataModelField[], previewRows: string[][] }} DataModelDrawer The open table dialog; the view renders `null` when it is absent.
 *
 * @typedef {object} DataModelViewProps
 * @property {Record<string, any>} strings visible copy (labels, aria text, `relatedAria(report)`)
 * @property {DataModelDomain[]} [domains=[]] domains shown in the sidebar
 * @property {DataModelDomain | null} [domain] the selected domain
 * @property {string} [query] domain search text
 * @property {(value: string) => void} [onQueryChange]
 * @property {(id: string) => void} [onSelectDomain]
 * @property {"basic"|"graph"} [activeTab="basic"]
 * @property {(tab: "basic"|"graph") => void} [onTabChange]
 * @property {{ x: number, y: number, scale: number }} [graph] pan and zoom of the relationship graph
 * @property {DataModelTable[]} [graphNodes=[]]
 * @property {Array<{ from: string, to: string, path: string }>} [graphLinks=[]]
 * @property {{ width: number, height: number }} [graphSize]
 * @property {(canvasWidth?: number) => void} [onGraphFit]
 * @property {(delta: number, center?: [number, number]) => void} [onGraphZoom]
 * @property {(dx: number, dy: number) => void} [onGraphPan]
 * @property {DataModelDrawer | null} [drawer]
 * @property {(tab: "fields"|"preview") => void} [onDrawerTab]
 * @property {(id: string) => void} [onOpenTable]
 * @property {(event?: { reason: string }) => void} [onCloseTable]
 * @property {(domain: DataModelDomain, report: string) => string} [reportContextId] Report Context id a related report opens
 * @property {(id: string) => void} [onOpenReportContext]
 * @property {(field: DataModelField) => React.ReactNode} [fieldFormat] node graph field line
 * @property {React.Ref<HTMLInputElement>} [searchRef] forwarded to the domain search input ("/" shortcut)
 */

function DmTagList({ values, className = "mh-dmview__tag" }) {
  const items = (values || []).filter(Boolean);
  if (!items.length) return <span className="mh-dmview__none">None</span>;
  return (
    <div className="mh-dmview__tags">
      {items.map((item) => (
        <span key={item} className={className}>
          {item}
        </span>
      ))}
    </div>
  );
}

/**
 * Table detail dialog — `.dm-table-drawer`/`dm-table-dialog` after the
 * overview cascade restyled it into a centered modal (title + Fact/Dimension
 * mark + description head, segmented Field Details/Data Preview tabs, framed
 * field or preview table). Not the shared Modal: the head holds a titleline
 * + mark + description triplet the modal variant can't express.
 */
function TableDialog({ drawer, strings, onTab, onClose }) {
  const dialogRef = React.useRef(null);
  useOverlayLayer({ open: Boolean(drawer), onClose, layerRef: dialogRef });
  const titleId = React.useId();
  if (!drawer) return null;
  const { table, isFact, tab, fields, previewRows } = drawer;
  return (
    <div data-mh-overlay-surface className="mh-dmview__overlay">
      <div className="mh-dmview__scrim" onClick={() => onClose?.({ reason: "scrim" })} />
      <section
        className="mh-dmview__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="mh-dmview__dialog-head">
          <div className="mh-dmview__dialog-copy">
            <div className="mh-dmview__dialog-titleline">
              <strong id={titleId}>{table.name}</strong>
              <mark className={cx("mh-dmview__table-type", isFact ? "is-fact" : "is-dimension")}>
                {isFact ? strings.fact : strings.dimension}
              </mark>
            </div>
            <small>{table.description}</small>
          </div>
          <button className="mh-dmview__icon-btn" type="button" aria-label={strings.closeTable} title="Close" onClick={() => onClose?.({ reason: "button" })}>
            <Icon path={CLOSE_ICON} />
          </button>
        </header>
        <nav className="mh-dmview__dialog-tabs" aria-label={strings.tableTabsAria}>
          {[
            ["fields", strings.fieldDetails],
            ["preview", strings.dataPreview],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={cx("mh-dmview__dialog-tab", tab === id && "is-active")}
              aria-selected={tab === id}
              onClick={() => onTab?.(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="mh-dmview__dialog-body">
          {tab === "preview" ? (
            <div className="mh-dmview__table-wrap">
              <table className="mh-dmview__table">
                <thead>
                  <tr>
                    {fields.map((field) => (
                      <th key={field.field}>{field.field}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, index) => (
                    <tr key={index}>
                      {row.map((value, cellIndex) => (
                        <td key={cellIndex}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mh-dmview__table-wrap">
              <table className="mh-dmview__table">
                <thead>
                  <tr>
                    <th>{strings.fieldColumn}</th>
                    <th>{strings.nameColumn}</th>
                    <th>{strings.synonymsColumn}</th>
                    {isFact ? <th>{strings.unitColumn}</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field) => (
                    <tr key={field.field}>
                      <td>
                        <strong className="mh-dmview__field-code">{field.field}</strong>
                      </td>
                      <td>{field.name}</td>
                      <td>
                        <DmTagList values={field.synonyms} className="mh-dmview__field-tag" />
                      </td>
                      {isFact ? <td>{field.unit}</td> : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Data Model knowledge type — `data-model-browser.js` `#dataModelOverview`:
 * domain sidebar (SearchField + one `LibraryItem` per domain, the shown one
 * `selected`; patterns/library.md §5 Data Models), Basic information card (name +
 * status pill, synonyms, related-report links that open the Report Context
 * drawer), and the pannable/zoomable relationship graph whose nodes open the
 * centered table detail dialog.
 * @param {DataModelViewProps} props prepared by `useDataModelDemo`
 */
export function DataModelView({
  strings,
  domains = [],
  domain,
  query,
  onQueryChange,
  onSelectDomain,
  activeTab = "basic",
  onTabChange,
  graph,
  graphNodes = [],
  graphLinks = [],
  graphSize,
  onGraphFit,
  onGraphZoom,
  onGraphPan,
  drawer,
  onDrawerTab,
  onOpenTable,
  onCloseTable,
  reportContextId,
  onOpenReportContext,
  fieldFormat,
  searchRef,
}) {
  const canvasRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const arrowId = React.useId();

  /* fitGraph(): recompute on mount and whenever the graph tab activates. */
  React.useEffect(() => {
    if (activeTab !== "graph" || !canvasRef.current) return;
    onGraphFit?.(canvasRef.current.clientWidth);
  }, [activeTab, onGraphFit, domain?.id]);

  const onWheel = (event) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    onGraphZoom?.(event.deltaY < 0 ? 0.08 : -0.08, [event.clientX - rect.left, event.clientY - rect.top]);
  };
  const onPointerDown = (event) => {
    if (event.target.closest(".mh-dmview__node,.mh-dmview__graph-tools")) return;
    dragRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!dragRef.current) return;
    const { x, y } = dragRef.current;
    dragRef.current = { x: event.clientX, y: event.clientY };
    onGraphPan?.(event.clientX - x, event.clientY - y);
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const isEnabled = domain?.status === "enable";
  return (
    <section className="mh-dmview">
      <div className="mh-dmview__shell">
        <aside className="mh-dmview__sidebar">
          <div className="mh-dmview__search">
            <SearchField
              label={strings.searchLabel}
              placeholder={strings.searchPlaceholder}
              value={query || ""}
              inputRef={searchRef}
              onChange={({ value }) => onQueryChange?.(value)}
            />
          </div>
          {domains.length ? (
            <ul className="mh-dmview__domains" aria-label={strings.listAria}>
              {domains.map((item) => (
                <li key={item.id}>
                  <LibraryItem
                    id={item.id}
                    title={item.name}
                    description={item.description}
                    selected={item.id === domain?.id}
                    status={item.status === "enable" ? { status: "enabled", label: strings.enabled } : { status: "disabled", label: strings.disabled }}
                    meta={[{ label: strings.tablesLabel, value: item.tables?.length || 0 }]}
                    onOpen={() => onSelectDomain?.(item.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mh-dmview__domains">
              <LibraryEmpty title={strings.emptyDomains} />
            </div>
          )}
        </aside>
        <section className="mh-dmview__main">
          <div className="mh-dmview__tabs" role="tablist" aria-label={strings.tabsAria}>
            <button
              className={cx("mh-dmview__tab", activeTab === "basic" && "is-active")}
              type="button"
              role="tab"
              aria-selected={activeTab === "basic"}
              onClick={() => onTabChange?.("basic")}
            >
              {strings.basicTab}
            </button>
            <button
              className={cx("mh-dmview__tab", activeTab === "graph" && "is-active")}
              type="button"
              role="tab"
              aria-selected={activeTab === "graph"}
              onClick={() => onTabChange?.("graph")}
            >
              {strings.graphTab} <span className="mh-dmview__tab-count">{domain?.tables?.length || 0}</span>
            </button>
          </div>
          <div className="mh-dmview__panel">
            {activeTab === "basic" ? (
              domain ? (
                <div className="mh-dmview__basic">
                  <section className="mh-dmview__basic-section">
                    <div className="mh-dmview__basic-name">
                      <strong>{domain.name}</strong>
                      <StatusBadge variant="knowledge" status={isEnabled ? "Enabled" : "Disabled"}>
                        {isEnabled ? strings.enabled : strings.disabled}
                      </StatusBadge>
                    </div>
                    <p className="mh-dmview__basic-summary">{domain.description}</p>
                  </section>
                  <section className="mh-dmview__basic-section">
                    <span className="mh-dmview__basic-label">
                      {strings.synonymsLabel} <em>{domain.synonyms?.length || 0}</em>
                    </span>
                    <DmTagList values={domain.synonyms} className="mh-dmview__tag mh-dmview__synonym" />
                  </section>
                  <section className="mh-dmview__basic-section">
                    <span className="mh-dmview__basic-label">
                      {strings.relatedReportsLabel} <em>{domain.reports?.length || 0}</em>
                    </span>
                    <div className="mh-dmview__related">
                      {(domain.reports || []).map((report) => (
                        <button
                          key={report}
                          className="mh-dmview__report"
                          type="button"
                          aria-label={strings.relatedAria(report)}
                          onClick={() => onOpenReportContext?.(reportContextId?.(domain, report))}
                        >
                          <span className="mh-dmview__report-icon" aria-hidden="true">
                            <Icon path={REPORT_ICON} />
                          </span>
                          <span className="mh-dmview__report-copy">
                            <strong>{report}</strong>
                          </span>
                          <b aria-hidden="true">›</b>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              ) : null
            ) : (
              <div className="mh-dmview__graph-card">
                <div
                  className={cx("mh-dmview__canvas", dragRef.current && "is-panning")}
                  ref={canvasRef}
                  onWheel={onWheel}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                >
                  <div
                    className="mh-dmview__viewport"
                    style={{ transform: `translate(${graph.x}px, ${graph.y}px) scale(${graph.scale})` }}
                  >
                    <svg
                      className="mh-dmview__links"
                      viewBox={`0 0 ${graphSize.width} ${graphSize.height}`}
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <marker id={`${arrowId}-arrow`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                          <path d="M0,0 L0,6 L6,3 z" />
                        </marker>
                      </defs>
                      {graphLinks.map((link) => (
                        <path
                          key={`${link.from}-${link.to}`}
                          className="mh-dmview__link"
                          d={link.path}
                          markerEnd={`url(#${arrowId}-arrow)`}
                        />
                      ))}
                    </svg>
                    {graphNodes.map((table, index) => (
                      <button
                        key={table.id}
                        className={cx("mh-dmview__node", table.type === "fact" ? "is-fact" : "is-dimension", `mh-dmview__node--${index + 1}`)}
                        type="button"
                        data-id={table.id}
                        onClick={() => onOpenTable?.(table.id)}
                      >
                        <header>
                          <strong>{table.name}</strong>
                          <span>{table.physicalName}</span>
                          <div className="mh-dmview__node-meta">
                            <small>{table.rowCount}</small>
                            <em>{table.type === "fact" ? strings.fact : strings.dimension}</em>
                          </div>
                        </header>
                        <div className="mh-dmview__node-fields">
                          {(table.fields || []).map((field) => (
                            <div key={field.field}>
                              <code>{field.field}</code>
                              <span>{field.name}</span>
                              <small>{fieldFormat?.(field)}</small>
                            </div>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mh-dmview__graph-tools" aria-label={strings.graphToolsAria}>
                    <button type="button" aria-label={strings.zoomIn} title={strings.zoomIn} onClick={() => onGraphZoom?.(0.12)}>
                      +
                    </button>
                    <button type="button" aria-label={strings.zoomOut} title={strings.zoomOut} onClick={() => onGraphZoom?.(-0.12)}>
                      −
                    </button>
                    <button type="button" aria-label={strings.fitGraph} title={strings.fitGraph} onClick={() => onGraphFit?.(canvasRef.current?.clientWidth)}>
                      <Icon path={FIT_ICON} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <TableDialog drawer={drawer} strings={strings} onTab={onDrawerTab} onClose={onCloseTable} />
    </section>
  );
}
