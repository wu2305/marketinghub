import "../../../tokens.css";
import { isPlainPrimaryLink } from "../../../lib/link-activation.js";
import "./ReportRow.css";


/**
 * Catalog report row: index, breadcrumb path, linked title, meta list and actions.
 * @param {object} props
 * @param {number} props.index zero-based report index, displayed as REPORT 01…
 * @param {string} [props.path] "Category / Project / Type" breadcrumb
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {Array<{ label: string, value: React.ReactNode }>} [props.meta=[]] Owner/Cadence/Updated/Knowledge cells
 * @param {string} [props.detailsLabel="Knowledge"]
 * @param {string} [props.openLabel="Open Dashboard"]
 * @param {string} [props.href] live-report link target
 * @param {(target: { title: string, href?: string }) => void} [props.onOpen]
 * @param {(target: { title: string }) => void} [props.onDetails] opens report details without navigation
 */
export function ReportRow({ index, path, title, description, meta = [], detailsLabel = "Knowledge", openLabel = "Open Dashboard", href, onOpen, onDetails }) {
  return (
    <article className="mh-report-row">
      <div className="mh-report-row__index">
        <span>REPORT</span>
        <strong>{String(index + 1).padStart(2, "0")}</strong>
      </div>
      <div className="mh-report-row__main">
        <span className="mh-report-row__path">{path}</span>
        <h3>
          <a href={href || "#"} onClick={(event) => isPlainPrimaryLink(event) && onOpen?.({ title, href })}>
            {title}
          </a>
        </h3>
        <p>{description}</p>
      </div>
      <dl className="mh-report-row__meta">
        {meta.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mh-report-row__actions">
        <button className="mh-report-row__details" type="button" aria-label={`Open knowledge for ${title}`} onClick={() => onDetails?.({ title })}>
          {detailsLabel}
        </button>
        <a className="mh-report-row__open" href={href || "#"} onClick={(event) => isPlainPrimaryLink(event) && onOpen?.({ title, href })}>
          {openLabel} <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
