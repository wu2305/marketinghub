import "../../tokens.css";
import { assetUrl } from "../../asset-url.js";
import { cx } from "../../cx.js";
import "./Header.css";

export const headerTones = ["solid", "overlay"];
export const headerPositions = ["sticky", "fixed"];

/**
 * Global site header with logo and top navigation.
 * @param {object} props
 * @param {{ src: string, alt?: string, href?: string }} [props.logo]
 * @param {Array<{ id: string, label: string, href: string }>} [props.items=[]]
 * @param {string} [props.current] id of the active nav item; always carries aria-current="page"
 * @param {boolean} [props.highlightCurrent=true] render the visual underline; some original pages (Home, AI Interpreter) mark the item semantically but style it identically to the rest
 * @param {typeof headerTones[number]} [props.tone="solid"] overlay is transparent with light links, for hero-covered pages
 * @param {typeof headerPositions[number]} [props.position="sticky"]
 * @param {(target: { id: string, href?: string, label: string }) => void} [props.onNavigate]
 */
export function Header({
  logo = { src: assetUrl("assets/images/tapestry-logo.png"), alt: "Tapestry" },
  items = [],
  current,
  highlightCurrent = true,
  tone = "solid",
  position = "sticky",
  onNavigate,
}) {
  return (
    <header className={cx("mh-header", `mh-header--${tone}`, position === "fixed" && "mh-header--fixed")}>
      <nav className="mh-header__bar" aria-label="Marketing Portal navigation">
        <a
          className="mh-header__logo"
          href={logo.href || "/index.html"}
          aria-label="Tapestry Marketing Portal home"
          onClick={() => onNavigate?.({ id: "home", href: logo.href || "/index.html", label: "Home" })}
        >
          <img src={logo.src} alt={logo.alt || "Tapestry"} />
        </a>
        <div className="mh-header__links">
          {items.map((item) => (
            <a
              key={item.id}
              className={cx("mh-header__link", highlightCurrent && item.id === current && "is-current")}
              href={item.href}
              aria-current={item.id === current ? "page" : undefined}
              onClick={() => onNavigate?.({ id: item.id, href: item.href, label: item.label })}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
