import "../../../tokens.css";
import React from "react";
import "./ProjectDirectory.css";


/**
 * Project catalog mode: back link, project intro header and report list.
 * @param {object} props
 * @param {string} [props.backHref] "all projects" link target
 * @param {string} [props.backLabel="All report projects"]
 * @param {string} [props.image]
 * @param {string} [props.imageAlt]
 * @param {string} [props.kicker]
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.countText] e.g. "2 dashboards"
 * @param {string} [props.updated]
 * @param {string} [props.listEyebrow="REPORTS IN THIS PROJECT"]
 * @param {string} [props.listTitle="Available reports"]
 * @param {string} [props.listCountText]
 * @param {(target: { href?: string }) => void} [props.onBack]
 * @param {React.ReactNode} [props.children] ReportRow elements
 */
export function ProjectDirectory({
  backHref,
  backLabel = "All report projects",
  image,
  imageAlt,
  kicker,
  title,
  description,
  countText,
  updated,
  listEyebrow = "REPORTS IN THIS PROJECT",
  listTitle = "Available reports",
  listCountText,
  onBack,
  children,
}) {
  const titleId = React.useId();
  return (
    <section className="mh-project-directory" aria-labelledby={titleId}>
      <a className="mh-project-directory__back" href={backHref || "#"} onClick={() => onBack?.({ href: backHref })}>
        <span aria-hidden="true">←</span> {backLabel}
      </a>
      <header className="mh-project-directory__intro">
        <img src={image} alt={imageAlt || ""} />
        <div className="mh-project-directory__copy">
          <div className="mh-project-directory__topline">
            <span>{kicker}</span>
          </div>
          <h2 id={titleId}>{title}</h2>
          <p>{description}</p>
          <div className="mh-project-directory__meta">
            <span className="mh-project-directory__count">{countText}</span>
            <span>{updated}</span>
          </div>
        </div>
      </header>
      <div className="mh-report-list__heading">
        <div>
          <span>{listEyebrow}</span>
          <h2>{listTitle}</h2>
        </div>
        <strong>{listCountText}</strong>
      </div>
      <div className="mh-report-list">{children}</div>
    </section>
  );
}
