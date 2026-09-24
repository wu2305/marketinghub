import "../../../tokens.css";
import "./ProjectCard.css";


/**
 * Cockpit project card with image, title and "View Dashboards" links.
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.kicker] uppercase breadcrumb above the title
 * @param {string} [props.description]
 * @param {string} [props.image]
 * @param {string} [props.updated] freshness text in the footer
 * @param {string} [props.href] project catalog link target for all three links
 * @param {string} [props.actionLabel="View Dashboards"]
 * @param {(target: { title: string, href?: string, part: string }) => void} [props.onOpen]
 */
export function ProjectCard({ title, kicker, description, image, updated, href, actionLabel = "View Dashboards", onOpen }) {
  const open = (part) => () => onOpen?.({ title, href, part });
  return (
    <article className="mh-project-card">
      <a className="mh-project-card__image" href={href || "#"} aria-label={`View ${title} reports`} onClick={open("image")}>
        <img src={image} alt="" />
      </a>
      <div className="mh-project-card__body">
        <div className="mh-project-card__topline">
          <span>{kicker}</span>
        </div>
        <h3>
          <a href={href || "#"} onClick={open("title")}>
            {title}
          </a>
        </h3>
        <p>{description}</p>
        <div className="mh-project-card__footer">
          <span>{updated}</span>
          <a className="mh-project-card__cta" href={href || "#"} onClick={open("action")}>
            {actionLabel} <i aria-hidden="true">→</i>
          </a>
        </div>
      </div>
    </article>
  );
}
