import "../../tokens.css";
import { assetUrl } from "../../asset-url.js";
import { cx } from "../../cx.js";
import "./Header.css";

export const headerDensities = ["compact", "comfortable"];
export const headerPositions = ["fixed", "sticky"];

function isPlainPrimaryLink(event) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.currentTarget.target && !event.currentTarget.hasAttribute("download");
}

/**
 * Global site header with logo and top navigation.
 * @param {object} props
 * @param {{ src: string, alt?: string, href?: string }} [props.logo]
 * @param {Array<{ id: string, label: string, href: string }>} [props.items=[]]
 * @param {string} [props.navigationAriaLabel="Marketing Portal navigation"] Accessible name for the navigation region.
 * @param {string} [props.logoAriaLabel="Tapestry Marketing Portal home"] Accessible name for the logo link.
 * @param {string} [props.current] id of the active nav item; always carries aria-current="page"
 * @param {boolean} [props.highlightCurrent=true] whether the current nav item has a visible underline
 * @param {typeof headerDensities[number]} [props.density="compact"] compact uses 48px links; comfortable uses 56px links
 * @param {typeof headerPositions[number]} [props.position="fixed"] placement in the page flow
 * @param {(target: { id: string, href?: string, label: string }) => void} [props.onNavigate]
 */
export function Header({
  logo = { src: assetUrl("assets/images/tapestry-logo.png"), alt: "Tapestry" },
  items = [],
  navigationAriaLabel = "Marketing Portal navigation",
  logoAriaLabel = "Tapestry Marketing Portal home",
  current,
  highlightCurrent = true,
  density = "compact",
  position = "fixed",
  onNavigate,
}) {
  return (
    <header className={cx("mh-header", `mh-header--${density}`, `mh-header--${position}`)}>
      <nav className="mh-header__bar" aria-label={navigationAriaLabel}>
        <a
          className="mh-header__logo"
          href={logo.href || "/index.html"}
          aria-label={logoAriaLabel}
          onClick={(event) => isPlainPrimaryLink(event) && onNavigate?.({ id: "home", href: logo.href || "/index.html", label: "Home" })}
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
              onClick={(event) => isPlainPrimaryLink(event) && onNavigate?.({ id: item.id, href: item.href, label: item.label })}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
