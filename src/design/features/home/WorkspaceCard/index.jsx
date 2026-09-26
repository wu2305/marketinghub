import "../../../tokens.css";
import { isPlainPrimaryLink } from "../../../lib/link-activation.js";
import "./WorkspaceCard.css";


/**
 * Home workspace card: image, description, capability links, full-card opener.
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.href] card open target; renders the full-card `<a>` link
 * @param {string} props.description
 * @param {string} props.image
 * @param {Array<{ id: string, label: string, href: string }>} [props.links=[]]
 * @param {(target: { title: string, href?: string }) => void} [props.onOpen] card-level open action
 * @param {(target: { id: string, href: string, label: string }) => void} [props.onNavigate] capability links
 */
export function WorkspaceCard({ title, href, description, image, links = [], onOpen, onNavigate }) {
  return (
    <article className="mh-workspace-card">
      <div className="mh-workspace-card__image">
        <img src={image} alt="" />
      </div>
      <div className="mh-workspace-card__body">
        <h3>{title}</h3>
        <p>{description}</p>
        {links.length ? (
          <div className="mh-workspace-card__links">
            {links.map((link) => (
              <a key={link.label} href={link.href} onClick={(event) => isPlainPrimaryLink(event) && onNavigate?.({ id: link.id, href: link.href, label: link.label })}>
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <a
        className="mh-workspace-card__open"
        href={href || "#"}
        aria-label={`Open ${title}`}
        onClick={(event) => isPlainPrimaryLink(event) && onOpen?.({ title, href })}
      />
    </article>
  );
}
