import "../../../tokens.css";
import { isPlainPrimaryLink } from "../../../lib/link-activation.js";
import React from "react";
import { cx } from "../../../cx.js";
import { Icon } from "../../../icons.jsx";
import { useOverlayLayer } from "../../../lib/overlay.js";
import "./ReportDetailsDrawer.css";


/**
 * Report details drawer: right-side panel with thumbnail, meta, knowledge pills
 * and the report's AI analysis scenarios. Internal state (fullscreen, selected
 * scenario, view-more expansion) resets per `resetKey`.
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {string} [props.eyebrow="REPORT DETAILS"]
 * @param {string} [props.projectLabel]
 * @param {string} [props.image]
 * @param {string} [props.imageAlt]
 * @param {string} [props.hierarchy] "Category / Project / Type"
 * @param {string} props.title
 * @param {string} [props.explanation]
 * @param {Array<{ label: string, value: React.ReactNode }>} [props.meta=[]]
 * @param {Array<{ label: string, pills: Array<{ label: string, href: string }> }>} [props.sections=[]]
 * @param {Array<{ title: string, meta?: string }>} [props.scenarios=[]] first 3 shown until view-more
 * @param {string} [props.viewMoreLabel="view more"]
 * @param {string} [props.liveHref] footer "Open Dashboard" link target
 * @param {string} [props.liveLabel="Open Dashboard"]
 * @param {string|number} [props.resetKey] change to reset scenario/fullscreen state
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onClose]
 * @param {(target: { href?: string }) => void} [props.onOpenLive]
 */
export function ReportDetailsDrawer({
  open = false,
  eyebrow = "REPORT DETAILS",
  projectLabel,
  image,
  imageAlt,
  hierarchy,
  title,
  explanation,
  meta = [],
  sections = [],
  scenarios = [],
  viewMoreLabel = "view more",
  liveHref,
  liveLabel = "Open Dashboard",
  resetKey,
  onClose,
  onOpenLive,
}) {
  const titleId = React.useId();
  const closeRef = React.useRef(null);
  const layerRef = React.useRef(null);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [activeScenario, setActiveScenario] = React.useState(null);
  const [showAll, setShowAll] = React.useState(false);
  React.useEffect(() => {
    setFullscreen(false);
    setActiveScenario(null);
    setShowAll(false);
  }, [resetKey]);
  useOverlayLayer({ open, onClose, layerRef, initialFocusRef: closeRef });
  if (!open) return null;
  return (
    <React.Fragment>
      <div data-mh-overlay-scrim className="mh-details-scrim" onClick={() => onClose?.({ reason: "scrim" })} />
      <aside data-mh-overlay-surface ref={layerRef} className={cx("mh-details", fullscreen && "is-fullscreen")} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <header className="mh-details__head">
          <div className="mh-details__titles">
            <span>{eyebrow}</span>
            <strong>{projectLabel}</strong>
          </div>
          <div className="mh-details__actions">
            <button
              className="mh-details__fullscreen"
              type="button"
              aria-label="Toggle fullscreen"
              onClick={() => setFullscreen((value) => !value)}
            >
              <Icon name="expand" />
            </button>
            <button ref={closeRef} className="mh-details__close" type="button" aria-label="Close report details" onClick={() => onClose?.({ reason: "button" })}>
              ×
            </button>
          </div>
        </header>
        <div className="mh-details__body">
          <div className="mh-details__thumbnail">
            <img src={image} alt={imageAlt || ""} />
          </div>
          <p className="mh-details__hierarchy">{hierarchy}</p>
          <h2 id={titleId}>{title}</h2>
          <p className="mh-details__explanation">{explanation}</p>
          <dl className="mh-details__meta">
            {meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          {sections.map((section) => (
            <section className="mh-details__section" key={section.label}>
              <header>
                <span>{section.label}</span>
              </header>
              <div className="mh-details__assets">
                {(section.pills || []).map((pill) => (
                  <a className="mh-details__pill" key={pill.href} href={pill.href}>
                    {pill.label}
                  </a>
                ))}
              </div>
            </section>
          ))}
          {scenarios.length ? (
            <section className="mh-details__section">
              <header>
                <span>AI ANALYSIS SCENARIOS</span>
                <button
                  className="mh-details__view-more"
                  type="button"
                  onClick={() => setShowAll(true)}
                  disabled={showAll}
                >
                  {viewMoreLabel}
                </button>
              </header>
              <ol className={cx("mh-details__scenarios", showAll && "is-expanded")}>
                {scenarios.map((scenario, index) => (
                  <li
                    key={scenario.title}
                    className={cx(index >= 3 && "mh-details__scenario-extra", index === activeScenario && "is-active")}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveScenario(index)}
                      aria-pressed={index === activeScenario}
                    >
                      <span>{`0${index + 1}`}</span>
                      <span className="mh-details__scenario-copy">
                        <strong>{scenario.title}</strong>
                        <small>{scenario.meta}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>
        <footer className="mh-details__footer">
          <a className="mh-details__live" href={liveHref || "#"} onClick={(event) => isPlainPrimaryLink(event) && onOpenLive?.({ href: liveHref })}>
            {liveLabel} <span aria-hidden="true">→</span>
          </a>
        </footer>
      </aside>
    </React.Fragment>
  );
}
