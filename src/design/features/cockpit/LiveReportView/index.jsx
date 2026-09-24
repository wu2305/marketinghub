import "../../../tokens.css";
import "./LiveReportView.css";


/* -------------------------------------------------------------------------
 * Live report view (reports.html?view=live): sticky toolbar, heading, and the
 * live panel. The panel hosts either the generic `LiveOverview` or the
 * city-project `CityInvestDashboard` embed, decided by the caller.
 * ---------------------------------------------------------------------- */

/**
 * Live report shell: back-to-library toolbar, kicker/title heading, live panel.
 * @param {object} props
 * @param {string} props.kicker eyebrow text, e.g. "4P Report / LIVE REPORT"
 * @param {string} props.title report title
 * @param {string} props.backHref catalog link for the active project
 * @param {string} [props.backLabel="Report library"]
 * @param {(target: { href: string }) => void} [props.onBack]
 * @param {React.ReactNode} props.children live panel content
 */
export function LiveReportView({ kicker, title, backHref, backLabel = "Report library", onBack, children }) {
  return (
    <section className="mh-live">
      <div className="mh-live-toolbar">
        <a
          className="mh-live-back"
          href={backHref}
          onClick={(event) => {
            if (event.defaultPrevented) return;
            onBack?.({ href: backHref });
          }}
        >
          <span aria-hidden="true">←</span> {backLabel}
        </a>
      </div>
      <header className="mh-live-heading">
        <div>
          <p className="mh-eyebrow">{kicker}</p>
          <h1>{title}</h1>
        </div>
      </header>
      <div className="mh-live-panel">{children}</div>
    </section>
  );
}
