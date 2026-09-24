import React from "react";
import "./organisms.css";
import { Button, StatusBadge, TextArea } from "./atoms.jsx";
import { cx } from "./cx.js";
import { Icon } from "./icons.jsx";
import {
  fmtAfter,
  pickTicks,
  selectionLabel,
  storeOptionsFor,
  storeScopeSuffix,
  totalLabel,
} from "./report-logic.js";
import {
  CategoryHeading,
  CheckboxFilter,
  ColumnChart,
  DataTable,
  FormField,
  MetricStat,
  Pagination,
  ProgressList,
  ScopeOption,
  SearchField,
  SidebarItem,
  Suggestion,
  Tabs,
} from "./molecules.jsx";

const ART = [1, 2, 3, 4, 5, 6, 7, 8].map((index) => `url("/assets/images/knowledge-card-icons/layer-${index}.png")`);

export const assistantPlacements = ["modal", "drawer"];
export const headerTones = ["solid", "overlay"];
export const headerPositions = ["sticky", "fixed"];
export const heroVariants = ["banner", "home", "knowledge"];
export const heroScrims = ["banner", "home", "knowledge", "none"];
export const modalVariants = ["modal", "sheet"];

/* `dialog-open` locks body scroll while any overlay is open. The original demo
   toggles it per dialog, but nested overlays must not unlock the page when an
   inner one closes — so holds are ref-counted per document.body and the class
   comes off only when the last open overlay releases. */
const scrollLockHolds = new WeakMap();
function useBodyScrollLock(active) {
  React.useEffect(() => {
    if (!active) return undefined;
    const body = document.body;
    scrollLockHolds.set(body, (scrollLockHolds.get(body) || 0) + 1);
    body.classList.add("dialog-open");
    return () => {
      const next = (scrollLockHolds.get(body) || 1) - 1;
      scrollLockHolds.set(body, Math.max(0, next));
      if (next <= 0) body.classList.remove("dialog-open");
    };
  }, [active]);
}

/* Each overlay remembers the element that had focus when it opened. On close
   the opener is refocused only when focus is still inside the closing layer or
   on the page body — an inner overlay closing hands focus back to its own
   opener, while an outer overlay closing underneath a focused inner one does
   not steal it. `layerRef` points at the overlay's root element. */
function useFocusRestore(active, layerRef) {
  const previousRef = React.useRef(null);
  React.useEffect(() => {
    if (!active) {
      previousRef.current = null;
      return undefined;
    }
    previousRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      const previous = previousRef.current;
      previousRef.current = null;
      if (!previous || !previous.isConnected) return;
      const activeEl = document.activeElement;
      const layer = layerRef?.current;
      const inside = layer ? layer.contains(activeEl) : false;
      if (inside || !activeEl || activeEl === document.body || activeEl === document.documentElement) previous.focus();
    };
  }, [active]);
}

/**
 * Global site header with logo and top navigation.
 * @param {object} props
 * @param {{ src: string, alt?: string, href?: string }} [props.logo]
 * @param {Array<{ id: string, label: string, href: string }>} [props.items=[]]
 * @param {string} [props.current] id of the active nav item
 * @param {typeof headerTones[number]} [props.tone="solid"] overlay is transparent with light links, for hero-covered pages
 * @param {typeof headerPositions[number]} [props.position="sticky"]
 * @param {(target: { id: string, href?: string, label: string }) => void} [props.onNavigate]
 */
export function Header({
  logo = { src: "/assets/images/tapestry-logo.png", alt: "Tapestry" },
  items = [],
  current,
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
              className={cx("mh-header__link", item.id === current && "is-current")}
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

/**
 * Image hero with title, description and optional aside content (stats, ask bar).
 * @param {object} props
 * @param {string} [props.image] background image URL
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {number} [props.height=260]
 * @param {typeof heroVariants[number]} [props.variant="banner"]
 * @param {typeof heroScrims[number]} [props.scrim="banner"]
 * @param {string} [props.titleId] defaults to a generated useId
 * @param {string} [props.asideLabel] aria-label on the aside group (original `.knowledge-hero-stats`)
 * @param {React.ReactNode} [props.children] renders in the hero aside
 */
export function Hero({
  image,
  eyebrow,
  title,
  description,
  height = 260,
  variant = "banner",
  scrim = "banner",
  titleId,
  asideLabel,
  children,
}) {
  const generatedTitleId = React.useId();
  const headingId = titleId || generatedTitleId;
  return (
    <section className={cx("mh-hero", `mh-hero--${variant}`)} style={{ height, minHeight: height }} aria-labelledby={headingId}>
      <div className="mh-hero__media" aria-hidden="true">
        {image ? <img src={image} alt="" /> : null}
        {scrim !== "none" ? <div className={cx("mh-hero__scrim", `mh-hero__scrim--${scrim}`)} /> : null}
      </div>
      <div className="mh-hero__layout">
        <div className="mh-hero__copy">
          {eyebrow ? <p className="mh-hero__eyebrow">{eyebrow}</p> : null}
          <h1 id={headingId}>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {children ? <div className="mh-hero__aside" role={asideLabel ? "group" : undefined} aria-label={asideLabel}>{children}</div> : null}
      </div>
    </section>
  );
}

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
              <a key={link.label} href={link.href} onClick={() => onNavigate?.({ id: link.id, href: link.href, label: link.label })}>
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
        onClick={() => onOpen?.({ title, href })}
      />
    </article>
  );
}

/**
 * Grid of WorkspaceCard.
 * @param {object} props
 * @param {Array<object>} [props.cards=[]] WorkspaceCard props per card
 * @param {(target: { title: string, href?: string }) => void} [props.onOpen]
 * @param {(target: { id: string, href: string, label: string }) => void} [props.onNavigate]
 */
export function WorkspaceGrid({ cards = [], onOpen, onNavigate }) {
  return (
    <div className="mh-workspace-grid">
      {cards.map((card) => (
        <WorkspaceCard key={card.title} {...card} onOpen={onOpen} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

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

/**
 * Cockpit catalog: category groups of ProjectCard.
 * @param {object} props
 * @param {Array<{ id: string, title: string, projects: Array<object> }>} [props.groups=[]]
 * @param {(target: { title: string, id?: string }) => void} [props.onOpen]
 */
export function ProjectCatalog({ groups = [], onOpen }) {
  return (
    <div className="mh-catalog">
      {groups.map((group) => (
        <section key={group.id} className="mh-catalog__group" aria-labelledby={`mh-category-${group.id}`}>
          <CategoryHeading title={group.title} id={`mh-category-${group.id}`} />
          <div className="mh-project-grid">
            {group.projects.map((project) => (
              <ProjectCard key={project.id} {...project} onOpen={(event) => onOpen?.({ ...event, id: project.id })} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

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
 * @param {string} [props.detailsHref] knowledge-context link target
 * @param {(target: { title: string, href?: string }) => void} [props.onDetails]
 */
export function ReportRow({ index, path, title, description, meta = [], detailsLabel = "Knowledge", openLabel = "Open Dashboard", href, detailsHref, onOpen, onDetails }) {
  return (
    <article className="mh-report-row">
      <div className="mh-report-row__index">
        <span>REPORT</span>
        <strong>{String(index + 1).padStart(2, "0")}</strong>
      </div>
      <div className="mh-report-row__main">
        <span className="mh-report-row__path">{path}</span>
        <h3>
          <a href={href || "#"} onClick={() => onOpen?.({ title, href })}>
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
        <a className="mh-report-row__details" href={detailsHref || "#"} aria-label={`Open knowledge for ${title}`} onClick={() => onDetails?.({ title, href: detailsHref })}>
          {detailsLabel}
        </a>
        <a className="mh-report-row__open" href={href || "#"} onClick={() => onOpen?.({ title, href })}>
          {openLabel} <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

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
  useBodyScrollLock(open);
  useFocusRestore(open, layerRef);
  React.useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.({ reason: "escape" });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, resetKey]);
  if (!open) return null;
  return (
    <React.Fragment>
      <div className="mh-details-scrim" onClick={() => onClose?.({ reason: "scrim" })} />
      <aside ref={layerRef} className={cx("mh-details", fullscreen && "is-fullscreen")} aria-labelledby={titleId}>
        <header className="mh-details__head">
          <div>
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
          <a className="mh-details__live" href={liveHref || "#"} onClick={() => onOpenLive?.({ href: liveHref })}>
            {liveLabel} <span aria-hidden="true">→</span>
          </a>
        </footer>
      </aside>
    </React.Fragment>
  );
}

/**
 * Self-Service entry card with a single action.
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.actionLabel]
 * @param {string} [props.href] navigation target; renders a real link instead of a button
 * @param {Array<object>} [props.history] upload-history rows; truthy shows the history affordance
 * @param {(target: { title: string, href?: string }) => void} [props.onOpen]
 * @param {(target: { title: string }) => void} [props.onShowHistory]
 */
export function ActionCard({ title, description, actionLabel, href, history, onOpen, onShowHistory }) {
  return (
    <article className="mh-action-card">
      <div className="mh-action-card__copy">
        <h3>
          {title}
          {history ? (
            <button
              className="mh-action-card__history"
              type="button"
              aria-label="View upload history"
              onClick={() => onShowHistory?.({ title })}
            >
              <Icon name="history" />
            </button>
          ) : null}
        </h3>
        <p>{description}</p>
      </div>
      {href ? (
        <a className="mh-button mh-button--gold mh-button--md" href={href} onClick={() => onOpen?.({ title, href })}>
          {actionLabel}
        </a>
      ) : (
        <Button variant="gold" size="md" onClick={() => onOpen?.({ title })}>
          {actionLabel}
        </Button>
      )}
    </article>
  );
}

/**
 * AI Interpreter sidebar: brand, overview entry, and the 8-type navigation.
 * @param {object} props
 * @param {string} [props.brand="AI Interpreter"]
 * @param {{ id: string, label: string, icon?: string }} [props.overview]
 * @param {string} [props.title] group label, e.g. "Knowledge · 8 types"
 * @param {Array<{ id: string, title: string, icon?: string, manageable?: boolean, stats?: { total: number }, navCount?: number }>} [props.types=[]]
 *   `navCount` feeds the "label · count" tooltip; the count chip itself is
 *   display:none in the original (`.sidebar-type-count` under
 *   `[data-active-type]`), so it never renders visibly.
 * @param {string} [props.activeId] id of the selected type or "overview"
 * @param {(event: { id: string, label: string }) => void} [props.onSelect]
 */
export function KnowledgeSidebar({ brand = "AI Interpreter", overview, title, types = [], activeId, onSelect }) {
  return (
    <aside className="mh-sidebar" aria-label="Knowledge navigation">
      <div className="mh-sidebar__brand">{brand}</div>
      {overview ? (
        <SidebarItem {...overview} active={overview.id === activeId} onSelect={() => onSelect?.({ id: overview.id, label: overview.label })} />
      ) : null}
      {types.length ? (
        <div className="mh-sidebar__group">
          {title ? <div className="mh-sidebar__title">{title}</div> : null}
          {types.map((type) => (
            <SidebarItem
              key={type.id}
              label={type.title}
              icon={type.icon}
              badge={type.manageable ? "Manage" : undefined}
              count={type.navCount ?? type.stats?.total}
              active={type.id === activeId}
              onSelect={() => onSelect?.({ id: type.id, label: type.title })}
            />
          ))}
        </div>
      ) : null}
    </aside>
  );
}

/**
 * Knowledge-type card in the overview grid. `manageable` flips read-only vs
 * manage styling; `art` picks one of 8 baked background images (0–7).
 * @param {object} props
 * @param {string} props.title
 * @param {React.ReactNode} props.count preformatted count label, e.g. "10 principles"
 * @param {string} props.summary
 * @param {string} props.action action line, e.g. "Manage terms"
 * @param {boolean} [props.manageable=false]
 * @param {number} [props.art=0]
 * @param {boolean} [props.active=false]
 * @param {(event: { title: string }) => void} [props.onSelect]
 */
export function TypeCard({ title, count, summary, action, manageable = false, art = 0, active = false, onSelect }) {
  return (
    <button
      className={cx("mh-type-card", manageable ? "is-manageable" : "is-read-only", active && "is-active")}
      type="button"
      style={{ "--mh-art": ART[art] || ART[0] }}
      onClick={() => onSelect?.({ title })}
    >
      <strong>{title}</strong>
      <span className="mh-type-card__count">{count}</span>
      <small>{summary}</small>
      <em>{action} →</em>
    </button>
  );
}

// Mirrors types.js overviewCountLabel: "<total> <singular|plural unit>".
function formatTypeCount(stats) {
  if (!stats) return undefined;
  const { units, total } = stats;
  return `${total} ${total === 1 ? units[0] : units[1]}`;
}

/**
 * Overview grid of TypeCard for the eight knowledge types.
 * @param {object} props
 * @param {Array<object>} [props.items=[]] type entries (id, title, summary, action, manageable, stats)
 * @param {string} [props.activeId]
 * @param {(event: { id: string, title: string }) => void} [props.onSelect]
 */
export function TypeGrid({ items = [], activeId, onSelect }) {
  return (
    <div className="mh-type-grid">
      {items.map((item, index) => (
        <TypeCard
          key={item.id}
          title={item.title}
          count={item.count ?? formatTypeCount(item.stats)}
          summary={item.summary}
          action={item.action}
          manageable={item.manageable}
          art={item.art ?? index}
          active={item.id === activeId}
          onSelect={() => onSelect?.({ id: item.id, title: item.title })}
        />
      ))}
    </div>
  );
}

/**
 * Toolbar above the knowledge list: per-type filters, search, create action.
 * @param {object} props
 * @param {string} [props.query]
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {Array<{ id: string, label: string, allLabel?: string, options?: Array<{ id: string, label: string }> }>} [props.filters=[]]
 * @param {Object<string, string>} [props.filterValues={}] selected option id per filter id
 * @param {(event: { id: string, value: string }) => void} [props.onFilterChange]
 * @param {string} [props.createLabel] when omitted the create button is not rendered
 * @param {() => void} [props.onCreate]
 */
export function LibraryToolbar({ query, onQueryChange, filters = [], filterValues = {}, onFilterChange, createLabel, onCreate }) {
  return (
    <div className="mh-toolbar">
      <div className="mh-toolbar__filters">
        {filters.map((filter) => (
          <label className="mh-filter" key={filter.id}>
            {filter.label}
            <select
              className="mh-select mh-select--sm"
              value={filterValues[filter.id] || ""}
              aria-label={filter.label}
              onChange={(event) => onFilterChange?.({ id: filter.id, value: event.target.value })}
            >
              <option value="">{filter.allLabel || "All"}</option>
              {(filter.options || []).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="mh-toolbar__actions">
        <div style={{ width: 280 }}>
          <SearchField label="Search knowledge" value={query} placeholder="Search knowledge..." size="sm" onChange={onQueryChange} />
        </div>
        {createLabel ? (
          <Button variant="gold" size="lg" icon="plus" onClick={onCreate}>
            {createLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

const STAGE_LABELS = { draft: "Draft", "under-review": "Under Review", queued: "Queued", building: "Building", published: "Published" };
const AVAILABILITY_LABELS = { enabled: "Enabled", disabled: "Disabled" };

/**
 * Single row in the generic knowledge list (transition component — the
 * per-type original views are card/table grids, see handover §2.3 P07).
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.summary]
 * @param {string} [props.badge] leading kind chip, e.g. "Synonym"
 * @param {string} [props.typeLabel]
 * @param {string} [props.owner]
 * @param {"draft"|"under-review"|"queued"|"building"|"published"} [props.stage] process stage
 * @param {"enabled"|"disabled"} [props.availability] AI availability
 * @param {boolean} [props.active=false]
 * @param {(event: { title: string }) => void} [props.onSelect]
 */
export function AssetRow({ title, summary, badge, typeLabel, owner, stage, availability, active = false, onSelect }) {
  return (
    <button className={cx("mh-asset", active && "is-active")} type="button" onClick={() => onSelect?.({ title })}>
      <span>
        <strong>
          {badge ? <span className="mh-asset__kind">{badge}</span> : null}
          {title}
        </strong>
        <small>{summary}</small>
      </span>
      <span>{typeLabel}</span>
      <span>{owner}</span>
      <StatusBadge status={stage}>{STAGE_LABELS[stage] || stage}</StatusBadge>
      <StatusBadge status={availability}>{AVAILABILITY_LABELS[availability] || availability}</StatusBadge>
    </button>
  );
}

/**
 * Generic knowledge list (transition component for the eight type views).
 * `type` drives the toolbar filters and the create entry; `manageable` types
 * get the create button, read-only types do not.
 * @param {object} props
 * @param {{ id: string, title: string, manageable?: boolean, createLabel?: string, statusFilters?: Array<object> }} props.type
 * @param {string} [props.query]
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {Object<string, string>} [props.filterValues={}]
 * @param {(event: { id: string, value: string }) => void} [props.onFilterChange]
 * @param {Array<object>} [props.rows=[]] AssetRow props plus id/typeLabel
 * @param {(event: { typeId: string, title: string }) => void} [props.onCreate]
 * @param {(row: object) => void} [props.onSelect]
 * @param {string} [props.emptyTitle="No knowledge assets"]
 * @param {string} [props.emptyMessage]
 */
export function KnowledgeLibrary({ type, query, onQueryChange, filterValues = {}, onFilterChange, rows = [], onCreate, onSelect, emptyTitle = "No knowledge assets", emptyMessage }) {
  const createLabel = type?.manageable ? type.createLabel || `Create ${type.title}` : undefined;
  return (
    <section className="mh-library" aria-label="Knowledge library">
      <LibraryToolbar
        query={query}
        filters={type?.statusFilters || []}
        filterValues={filterValues}
        onQueryChange={onQueryChange}
        onFilterChange={onFilterChange}
        createLabel={createLabel}
        onCreate={type ? () => onCreate?.({ typeId: type.id, title: type.title }) : undefined}
      />
      <div className="mh-asset-head">
        <span>Knowledge Title</span>
        <span>Type</span>
        <span>Creator</span>
        <span>Process</span>
        <span>AI Status</span>
      </div>
      {rows.length ? (
        rows.map((row) => (
          <AssetRow
            key={row.id}
            {...row}
            typeLabel={row.typeLabel ?? type?.title}
            onSelect={() => onSelect?.(row)}
          />
        ))
      ) : (
        <div className="mh-empty" role="status">
          <strong>{emptyTitle}</strong>
          <p>{emptyMessage || "No records match the current filters."}</p>
        </div>
      )}
    </section>
  );
}

/**
 * Principle description with the original's measured clamp: collapsed text is
 * truncated by a binary search against scrollHeight (two lines + 1px), the
 * toggle only renders when the text overflows or the card is expanded.
 * @param {object} props
 * @param {string} props.text full description (may contain newlines — pre-line)
 * @param {boolean} props.expanded
 * @param {() => void} [props.onToggle]
 */
function PrincipleDescription({ text, expanded, onToggle }) {
  const descRef = React.useRef(null);
  const textRef = React.useRef(null);
  const descriptionId = React.useId();
  const [display, setDisplay] = React.useState(text);
  const [clamped, setClamped] = React.useState(false);
  // The clamp is measured, so it must re-run once the DIN webfont arrives and
  // whenever the card width changes — otherwise the binary search would clamp
  // against fallback-font metrics.
  const [measureTick, setMeasureTick] = React.useState(0);
  React.useEffect(() => {
    let cancelled = false;
    const bump = () => {
      if (!cancelled) setMeasureTick((tick) => tick + 1);
    };
    document.fonts?.ready?.then(bump);
    window.addEventListener("resize", bump);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", bump);
    };
  }, []);

  React.useLayoutEffect(() => {
    const description = descRef.current;
    const span = textRef.current;
    if (!description || !span) return;
    if (expanded) {
      setDisplay(text);
      setClamped(true);
      return;
    }
    span.textContent = text;
    const lineHeight = Number.parseFloat(getComputedStyle(description).lineHeight) || 22;
    const maxHeight = lineHeight * 2 + 1;
    if (description.scrollHeight <= maxHeight) {
      setDisplay(text);
      setClamped(false);
      return;
    }
    let low = 0;
    let high = text.length;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      span.textContent = `${text.slice(0, middle).trimEnd()}… `;
      if (description.scrollHeight <= maxHeight) low = middle;
      else high = middle - 1;
    }
    const final = `${text.slice(0, low).trimEnd()}… `;
    span.textContent = final;
    setDisplay(final);
    setClamped(true);
  }, [text, expanded, measureTick]);

  return (
    <div className="mh-principle__descwrap">
      <p
        ref={descRef}
        className={cx("mh-principle__desc", expanded && "is-expanded")}
        id={descriptionId}
      >
        <span ref={textRef} className="mh-principle__desctext">
          {display}
        </span>
        {clamped ? (
          <button
            type="button"
            className="mh-principle__toggle"
            aria-controls={descriptionId}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse description" : "Expand description"}
            title={expanded ? "Collapse" : "Expand"}
            onClick={onToggle}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={expanded ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
            </svg>
          </button>
        ) : null}
      </p>
    </div>
  );
}

/**
 * Principles library view — the dedicated card list that replaces the generic
 * asset table when `?type=Principles`: gold search pill, category checkbox
 * filter, "Showing X of Y" count line, numbered cards with clamped
 * descriptions, and shared pagination. Mirrors `renderPrinciplesCards`,
 * `matchingPrinciples` and `renderPrincipleCategoryFilter` in types.js.
 * @param {object} props
 * @param {Array<{ id: string, category: string, title: string, description: string }>} [props.items=[]] all principles (unfiltered)
 * @param {string} [props.query=""] search text — matches category, title, description
 * @param {Array<string>} [props.selectedCategories=[]]
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=10]
 * @param {Array<string>} [props.expanded=[]] ids of expanded descriptions
 * @param {object} [props.strings={}] copy overrides: searchLabel, searchPlaceholder, categoryLabel, allCategoriesLabel, selectedCategoriesLabel, countUnit, emptyMessage, rowsPerPageLabel, pageSizes
 * @param {React.Ref} [props.searchRef] forwarded to the search input ("/" shortcut)
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(event: { id: string, checked: boolean }) => void} [props.onToggleCategory]
 * @param {(event: { page: number }) => void} [props.onPage]
 * @param {(event: { pageSize: number }) => void} [props.onPageSize]
 * @param {(event: { id: string, expanded: boolean }) => void} [props.onToggleExpand]
 */
export function PrinciplesView({
  items = [],
  query = "",
  selectedCategories = [],
  page = 1,
  pageSize = 10,
  expanded = [],
  strings = {},
  searchRef,
  onQueryChange,
  onToggleCategory,
  onPage,
  onPageSize,
  onToggleExpand,
}) {
  const {
    searchLabel = "Search knowledge",
    searchPlaceholder = "Search knowledge...",
    categoryLabel = "Category",
    allCategoriesLabel = "All categories",
    selectedCategoriesLabel = "{count} selected",
    countUnit = ["principle", "principles"],
    emptyMessage = "No matching principles. Change the category or search.",
    rowsPerPageLabel = "Rows per page",
    pageSizes = [10, 20, 50],
  } = strings;
  const normalizedQuery = query.trim().toLowerCase();
  const categories = [...new Set(items.map((item) => item.category))].map((id) => ({ id, label: id }));
  const matching = items.filter(
    (item) =>
      (!selectedCategories.length || selectedCategories.includes(item.category)) &&
      (!normalizedQuery || [item.category, item.title, item.description].join(" ").toLowerCase().includes(normalizedQuery)),
  );
  const pages = Math.max(1, Math.ceil(matching.length / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  const first = (current - 1) * pageSize;
  const visible = matching.slice(first, first + pageSize);
  return (
    <section className="mh-principles" aria-label="Principles library">
      <header className="mh-principles__toolbar">
        <div className="mh-principles__search">
          <SearchField label={searchLabel} value={query} placeholder={searchPlaceholder} variant="plain" inputRef={searchRef} onChange={onQueryChange} />
        </div>
        <CheckboxFilter
          label={categoryLabel}
          allLabel={allCategoriesLabel}
          selectedLabel={selectedCategoriesLabel}
          options={categories}
          selected={selectedCategories}
          onToggle={onToggleCategory}
        />
      </header>
      <div className="mh-principles__grid">
        {visible.length ? (
          <div className="mh-principles__list">
            {visible.map((item, index) => (
              <article className="mh-principle" key={item.id}>
                <span className="mh-principle__number">{String(first + index + 1).padStart(2, "0")}</span>
                <div className="mh-principle__copy">
                  <div className="mh-principle__titleline">
                    <div className="mh-principle__titlemain">
                      <span className="mh-principle__badge">{item.category}</span>
                      <h3>{item.title}</h3>
                    </div>
                  </div>
                  <PrincipleDescription
                    text={item.description}
                    expanded={expanded.includes(item.id)}
                    onToggle={() => onToggleExpand?.({ id: item.id, expanded: !expanded.includes(item.id) })}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mh-principles__empty">{emptyMessage}</div>
        )}
      </div>
      <Pagination
        total={matching.length}
        units={countUnit}
        page={current}
        pageSize={pageSize}
        pageSizes={pageSizes}
        rowsLabel={rowsPerPageLabel}
        onPage={onPage}
        onPageSize={onPageSize}
      />
    </section>
  );
}

/**
 * Floating corner button that opens the assistant panel.
 * @param {object} props
 * @param {string} [props.label="AI Interpreter"]
 * @param {boolean} [props.hidden=false] mirrors the original `display:none` while the panel is open
 * @param {(event: { reason: "open" }) => void} [props.onOpen]
 */
export function AssistantLauncher({ label = "AI Interpreter", hidden = false, onOpen }) {
  return (
    <button className="mh-launcher" type="button" aria-label="Open AI assistant" hidden={hidden} onClick={() => onOpen?.({ reason: "open" })}>
      <span className="mh-launcher__orb">AI</span>
      <span>{label}</span>
    </button>
  );
}

/**
 * One assistant answer entry: user query bubble plus the grounded answer card
 * with sources, related actions and feedback buttons.
 * @param {object} props
 * @param {{ query: string, kicker?: string, title: string, body: string, sources?: string[], actions?: Array<{ label: string, href?: string }>, variant?: "compact"|"workspace", banner?: string, context?: string, findings?: Array<{ label: string, detail: string }>, simple?: boolean, lead?: string }} props.answer
 * @param {(event: { query: string, feedback: "helpful"|"not-helpful"|"copy"|null }) => void} [props.onFeedback]
 */
function AssistantAnswer({ answer, onFeedback }) {
  const [feedback, setFeedback] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const cardRef = React.useRef(null);
  const copyTimer = React.useRef(null);
  React.useEffect(() => () => window.clearTimeout(copyTimer.current), []);
  const pick = (kind) => {
    const next = feedback === kind ? null : kind;
    setFeedback(next);
    onFeedback?.({ query: answer.query, feedback: next });
  };
  const copy = () => {
    const text = cardRef.current?.innerText ?? [answer.query, answer.title, answer.body].filter(Boolean).join("\n");
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
    onFeedback?.({ query: answer.query, feedback: "copy" });
  };
  if (answer.simple) {
    return (
      <div className="mh-assistant__entry">
        <article className="mh-assistant__answer mh-assistant__answer--simple" ref={cardRef}>
          <p>
            {answer.lead} <strong>{answer.query}</strong>
          </p>
        </article>
      </div>
    );
  }
  const feedbackRow = (
    <div className="mh-assistant__feedback">
      <button type="button" data-kind="helpful" aria-pressed={feedback === "helpful"} onClick={() => pick("helpful")}>
        <Icon name="thumb-up" />
        <span>Helpful</span>
      </button>
      <button type="button" data-kind="not-helpful" aria-pressed={feedback === "not-helpful"} onClick={() => pick("not-helpful")}>
        <Icon name="thumb-down" />
        <span>Not helpful</span>
      </button>
      <button type="button" data-kind="copy" aria-label="Copy answer" onClick={copy}>
        <Icon name="copy" />
        <span>{copied ? "Copied!" : "Copy"}</span>
      </button>
    </div>
  );
  if (answer.variant === "workspace") {
    return (
      <div className="mh-assistant__entry">
        <div className="mh-assistant__query">
          <span className="mh-assistant__bubble">{answer.query}</span>
        </div>
        <article className="mh-assistant__answer mh-assistant__answer--workspace" ref={cardRef}>
          {/* Original quirk: `.answer-card-header` matches no stylesheet rule,
              so banner strong+span render as flush inline text. */}
          <div className="mh-assistant__answer-banner">
            <strong>{answer.banner}</strong>
            <span>{answer.context}</span>
          </div>
          <div className="mh-assistant__answer-body">
            <p>{answer.body}</p>
            {(answer.findings || []).map((finding) => (
              <div className="mh-assistant__finding" key={finding.label}>
                <strong>{finding.label}</strong>
                <p>{finding.detail}</p>
              </div>
            ))}
          </div>
          {answer.sources?.length ? (
            <div className="mh-assistant__sources" aria-label="Sources">
              {answer.sources.map((source) => (
                <span key={source}>{source}</span>
              ))}
            </div>
          ) : null}
          {feedbackRow}
        </article>
      </div>
    );
  }
  if (answer.variant === "compact") {
    return (
      <div className="mh-assistant__entry">
        <div className="mh-assistant__query">
          <span className="mh-assistant__bubble">{answer.query}</span>
        </div>
        <article className="mh-assistant__answer" ref={cardRef}>
          <p>{answer.body}</p>
          {answer.sources?.length ? (
            <div className="mh-assistant__sources-row" aria-label="Sources">
              <span>Sources used</span>
              <div>
                {answer.sources.map((source) => (
                  <span key={source}>{source}</span>
                ))}
              </div>
            </div>
          ) : null}
          {feedbackRow}
        </article>
      </div>
    );
  }
  return (
    <div className="mh-assistant__entry">
      <div className="mh-assistant__query">
        <span className="mh-assistant__bubble">{answer.query}</span>
      </div>
      <article className="mh-assistant__answer" ref={cardRef}>
        <div className="mh-assistant__answer-head">
          <span>{answer.kicker}</span>
          <small>{answer.sources?.length || 0} grounded sources</small>
        </div>
        <h3>{answer.title}</h3>
        <p>{answer.body}</p>
        {answer.sources?.length ? (
          <div className="mh-assistant__sources" aria-label="Sources">
            {answer.sources.map((source) => (
              <span key={source}>{source}</span>
            ))}
          </div>
        ) : null}
        {answer.actions?.length ? (
          <div className="mh-assistant__answer-actions" aria-label="Related actions">
            {answer.actions.map((action) =>
              action.href ? (
                <a key={action.label} href={action.href}>
                  {action.label}
                </a>
              ) : (
                <span key={action.label}>{action.label}</span>
              ),
            )}
          </div>
        ) : null}
        {feedbackRow}
      </article>
    </div>
  );
}

/**
 * Assistant dialog. `placement="drawer"` renders the right-edge full-height
 * variant used on Home; "modal" is the centered variant. Renders nothing when
 * `open` is false.
 *
 * Reachable states mirror the original runtime: suggestion/history items fill
 * the prompt, submit appends entries to the answer feed, the expand button
 * toggles the drawer into a centered dialog, the history button opens a
 * popover (closed by outside click or Escape), Escape closes the panel, and
 * focus returns to the invoking element on close.
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {typeof assistantPlacements[number]} [props.placement="modal"]
 * @param {"home"|undefined} [props.tone] "home" mirrors `home-ask-panel`: white borderless composer strip
 * @param {string} [props.title="Ask AI Interpreter"]
 * @param {string} [props.headline="Ask a question"]
 * @param {string} [props.description]
 * @param {Array<string|{ label: string, prompt: string }>} [props.suggestions=[]]
 * @param {Array<string>} [props.scopes=[]]
 * @param {string} [props.scope] selected scope label
 * @param {boolean} [props.showScopes=false]
 * @param {boolean} [props.showPicks=true] show model/mode pick chips
 * @param {string} [props.prompt=""]
 * @param {string} [props.model="Data Model"]
 * @param {string} [props.mode="Analytical Model"]
 * @param {Array<object>} [props.answers=[]] AssistantAnswer entries, oldest first; `{ simple: true, lead, query }` renders the lite single-line card
 * @param {Array<{ id?: string, label: string, prompt: string }>} [props.history=[]] recent prompts in the history popover
 * @param {string} [props.historyTitle="Recent"]
 * @param {React.ReactNode} [props.historyCount] e.g. "(121)"
 * @param {object} [props.skillMenu] renders the composer "+" skill menu when provided; `{ triggerLabel?, attachAccept?, categories, searchPlaceholder, emptyLabel, items, historyLabel, manualLabel }`
 * @param {{ id?: string, type: string, title: string }} [props.selectedSkill] chip shown inside the composer when a skill is selected
 * @param {boolean} [props.enterToSubmit=true] false mirrors the lite panel where Enter inserts a newline
 * @param {boolean} [props.lite=false] lite variant (original `data-lite-panel`): short maximize labels
 * @param {boolean} [props.hideStageOnAnswers=false] true mirrors the reports panel where the ask stage hides once the feed has entries
 * @param {boolean} [props.submitDisabled=false] force-disables ASK — the home history pick fills the composer without updateSendState, leaving ASK off until the user types
 * @param {(event: { names: string[] }) => void} [props.onAttach] fired after "Upload File" picks files
 * @param {(event: { id?: string, type: string, title: string }) => void} [props.onSelectSkill]
 * @param {() => void} [props.onClearSkill]
 * @param {(event: { action: "history"|"manual" }) => void} [props.onSkillAction] model-creation menu entries
 * @param {(event: { reason: "backdrop"|"escape"|"button" }) => void} [props.onClose]
 * @param {(event: { name: string, value: string }) => void} [props.onPromptChange]
 * @param {(event: { prompt: string, scope?: string, model?: string, mode?: string }) => void} [props.onSubmit] model/mode are sent only when `showPicks` is on
 * @param {(event: { prompt: string }) => void} [props.onSuggestion]
 * @param {(event: { scope: string }) => void} [props.onScopeChange]
 * @param {() => void} [props.onNewSession]
 * @param {(event: { expanded: boolean }) => void} [props.onMaximize]
 * @param {(event: { open: boolean }) => void} [props.onHistory]
 * @param {(event: { label: string, prompt: string }) => void} [props.onHistorySelect]
 * @param {(event: { query: string, feedback: string|null }) => void} [props.onFeedback]
 */
export function AssistantPanel({
  open = false,
  placement = "modal",
  tone,
  title = "Ask AI Interpreter",
  headline = "Ask a question",
  description = "Your AI partner for every marketing task",
  suggestions = [],
  scopes = [],
  scope,
  showScopes = false,
  showPicks = true,
  prompt = "",
  model = "Data Model",
  mode = "Analytical Model",
  answers = [],
  history = [],
  historyTitle = "Recent",
  historyCount,
  skillMenu,
  selectedSkill,
  enterToSubmit = true,
  lite = false,
  hideStageOnAnswers = false,
  submitDisabled = false,
  onAttach,
  onSelectSkill,
  onClearSkill,
  onSkillAction,
  onClose,
  onPromptChange,
  onSubmit,
  onSuggestion,
  onScopeChange,
  onNewSession,
  onMaximize,
  onHistory,
  onHistorySelect,
  onFeedback,
}) {
  const titleId = React.useId();
  const [expanded, setExpanded] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const layerRef = React.useRef(null);
  const mainRef = React.useRef(null);
  const promptRef = React.useRef(null);
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  useBodyScrollLock(open);
  useFocusRestore(open, layerRef);
  React.useEffect(() => {
    if (!open) {
      // Quirk parity: home (portal.js) and lite (assistant-panel-lite.js) reset
      // `is-ai-expanded` on close, but the shared workspace panel's close only
      // sets `hidden` — the expanded modal persists across close→reopen there.
      if (tone === "home" || lite) setExpanded(false);
      setHistoryOpen(false);
      return undefined;
    }
    const timer = window.setTimeout(() => promptRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKeydown = (event) => {
      if (event.key !== "Escape") return;
      setHistoryOpen(false);
      onCloseRef.current?.({ reason: "escape" });
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [open]);

  React.useEffect(() => {
    if (!historyOpen) return undefined;
    const onPointerDown = (event) => {
      if (!event.target.closest(".mh-assistant__history")) setHistoryOpen(false);
    };
    document.addEventListener("click", onPointerDown);
    return () => document.removeEventListener("click", onPointerDown);
  }, [historyOpen]);

  React.useEffect(() => {
    if (answers.length && mainRef.current) {
      mainRef.current.scrollTo({ top: mainRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [answers.length]);

  // `.query-canvas` auto-grows 44→88px with content (assistant-panel.css
  // min/max-height); a <textarea> needs JS to size to scrollHeight.
  React.useLayoutEffect(() => {
    const el = promptRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [prompt]);

  if (!open) return null;
  return (
    <section
      ref={layerRef}
      className={cx("mh-assistant", placement === "drawer" && "mh-assistant--drawer", tone === "home" && "mh-assistant--home", expanded && "mh-assistant--expanded")}
      aria-label={lite ? "AI Interpreter" : title}
    >
      <button className="mh-assistant__backdrop" type="button" aria-label="Close assistant" onClick={() => onClose?.({ reason: "backdrop" })} />
      <div className="mh-assistant__dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="mh-assistant__header">
          <div className="mh-assistant__identity">
            <span className="mh-assistant__mark">AI</span>
            <h2 id={titleId}>{title}</h2>
          </div>
          <div className="mh-assistant__actions">
            <button
              className="mh-assistant__icon"
              type="button"
              aria-label="New session"
              onClick={() => {
                onNewSession?.();
                promptRef.current?.focus();
              }}
            >
              <Icon name="plus" />
            </button>
            <button
              className="mh-assistant__icon"
              type="button"
              /* assistant-skill-menu.js cycles the full labels on non-home
                 panels; portal.js keeps the short labels on the home panel. */
              aria-label={tone === "home" || lite ? (expanded ? "Restore" : "Maximize") : expanded ? "Restore AI Interpreter panel" : "Maximize AI Interpreter panel"}
              title={expanded ? "Restore" : "Maximize"}
              onClick={() => {
                setExpanded((value) => !value);
                onMaximize?.({ expanded: !expanded });
              }}
            >
              <Icon name="expand" />
            </button>
            <div className="mh-assistant__history">
              <button
                className="mh-assistant__icon"
                type="button"
                aria-label="History"
                aria-expanded={historyOpen}
                onClick={() => {
                  setHistoryOpen((value) => !value);
                  onHistory?.({ open: !historyOpen });
                }}
              >
                <Icon name="history" />
              </button>
              {historyOpen ? (
                <div className="mh-assistant__history-pop" role="dialog" aria-label="Recent conversations">
                  <div className="mh-assistant__history-head">
                    <h4>
                      {historyTitle}
                      {historyCount != null ? <span className="mh-assistant__history-count"> {historyCount}</span> : null}
                    </h4>
                    <button type="button" aria-label="Close" onClick={() => setHistoryOpen(false)}>
                      ×
                    </button>
                  </div>
                  <div className="mh-assistant__history-list">
                    {history.map((item) => (
                      <button
                        key={item.id || item.label}
                        className="mh-assistant__history-item"
                        type="button"
                        onClick={() => {
                          setHistoryOpen(false);
                          onHistorySelect?.({ label: item.label, prompt: item.prompt });
                          promptRef.current?.focus();
                        }}
                      >
                        <strong>{item.title ?? item.label}</strong>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <button className="mh-assistant__close" type="button" aria-label="Close assistant" onClick={() => onClose?.({ reason: "button" })}>
              ×
            </button>
          </div>
        </header>
        <div className="mh-assistant__main" ref={mainRef}>
          {hideStageOnAnswers && answers.length ? null : (
            <div className="mh-assistant__stage">
              <div>
                <h3>{headline}</h3>
                <p>{description}</p>
              </div>
              <div className="mh-assistant__suggestions">
                {suggestions.map((item) => {
                  const suggestion = typeof item === "string" ? { label: item, prompt: item } : item;
                  return (
                    <Suggestion key={suggestion.label} onSelect={() => {
                      onSuggestion?.({ prompt: suggestion.prompt });
                      promptRef.current?.focus();
                    }}>
                      {suggestion.label}
                    </Suggestion>
                  );
                })}
              </div>
            </div>
          )}
          {answers.length ? (
            <div className="mh-assistant__feed">
              {answers.map((answer, index) => (
                <AssistantAnswer key={answer.id ?? `${index}-${answer.query}`} answer={answer} onFeedback={onFeedback} />
              ))}
            </div>
          ) : null}
        </div>
        <form
          className="mh-assistant__ask"
          aria-label="Ask AI Interpreter AI"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.({
              prompt,
              ...(showScopes ? { scope } : {}),
              ...(showPicks ? { model, mode } : {}),
            });
          }}
        >
          {showScopes ? (
            <div className="mh-assistant__scopes" role="group" aria-label="Response scope">
              <span>Scope</span>
              {scopes.map((item) => (
                <ScopeOption key={item} label={item} pressed={item === scope} onChange={() => onScopeChange?.({ scope: item })} />
              ))}
            </div>
          ) : placement === "drawer" ? (
            <div className="mh-assistant__scope-reserve" aria-hidden="true" />
          ) : null}
          <div className="mh-assistant__box">
            {selectedSkill ? (
              <span className="mh-assistant__chip">
                <span>
                  {selectedSkill.type}: {selectedSkill.title}
                </span>
                <button
                  type="button"
                  aria-label="Clear selected skill"
                  onClick={() => {
                    onClearSkill?.();
                    promptRef.current?.focus();
                  }}
                >
                  ×
                </button>
              </span>
            ) : null}
            <TextArea
              label="Ask AI Interpreter AI"
              rows={1}
              value={prompt}
              placeholder="Type your question or upload Excel/CSV files for data analysis"
              onChange={onPromptChange}
              onKeyDown={(event) => {
                if (enterToSubmit && event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (String(prompt).trim()) event.currentTarget.form?.requestSubmit();
                }
              }}
              ref={promptRef}
            />
            <div className="mh-assistant__tools">
              {skillMenu ? (
                <SkillMenu
                  config={skillMenu}
                  selectedSkill={selectedSkill}
                  composerRef={promptRef}
                  onAttach={onAttach}
                  onSelectSkill={onSelectSkill}
                  onAction={onSkillAction}
                />
              ) : null}
              {showPicks ? <span className="mh-assistant__pick">{model}</span> : null}
              {showPicks ? <span className="mh-assistant__pick">{mode}</span> : null}
              <span className="mh-assistant__send">
                <Button variant="gold" size="sm" type="submit" label="Ask" disabled={submitDisabled || !String(prompt).trim()}>
                  ASK
                </Button>
              </span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

const SKILL_HOVER_CLOSE_MS = 120;

/**
 * The composer "+" menu: an Upload File shortcut plus the Analytical Model
 * picker with search, selection chip support and the two model-creation
 * entries. Mirrors assistant-skill-menu.js: hover previews the detail pane
 * without moving focus, click pins it open, keyboard focus moves into the
 * search field, and leaving the menu unpinned closes the detail after a
 * short delay. Escape or an outside click closes the whole menu.
 * @param {object} props
 * @param {object} props.config `{ attachAccept?, categories, searchPlaceholder, emptyLabel, items, historyLabel, manualLabel }`
 * @param {{ id?: string, type: string, title: string }} [props.selectedSkill]
 * @param {React.RefObject<HTMLElement>} [props.composerRef] composer input refocused after selection
 * @param {(event: { names: string[] }) => void} [props.onAttach]
 * @param {(event: { id?: string, type: string, title: string }) => void} [props.onSelectSkill]
 * @param {(event: { action: "history"|"manual" }) => void} [props.onAction]
 */
function SkillMenu({ config, selectedSkill, composerRef, onAttach, onSelectSkill, onAction }) {
  const [open, setOpen] = React.useState(false);
  const [detail, setDetail] = React.useState(null);
  const [pinned, setPinned] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [focusNonce, setFocusNonce] = React.useState(0);
  const rootRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const hoverTimer = React.useRef(null);

  React.useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  React.useEffect(() => {
    if (focusNonce && searchRef.current) {
      searchRef.current.focus();
      searchRef.current.setSelectionRange(searchRef.current.value.length, searchRef.current.value.length);
    }
  }, [focusNonce, detail]);

  const closeMenu = React.useCallback(() => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setOpen(false);
    setDetail(null);
    setPinned(false);
    setQuery("");
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (event) => {
      if (!rootRef.current?.contains(event.target)) closeMenu();
    };
    const onDocKey = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onDocKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onDocKey);
    };
  }, [open, closeMenu]);

  const collapseDetail = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setPinned(false);
    setDetail(null);
    setQuery("");
  };

  const openDetail = (focus) => {
    setDetail("model");
    setQuery("");
    if (focus) setFocusNonce((nonce) => nonce + 1);
  };

  const clickCategory = (category) => {
    if (category.id === "upload") {
      fileRef.current?.click();
      closeMenu();
      return;
    }
    if (detail === "model" && pinned) {
      collapseDetail();
      return;
    }
    openDetail(true);
    setPinned(true);
  };

  const hoverCategory = (category) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    if (category.id === detail || category.id === "upload") return;
    setPinned(false);
    setDetail("model");
    setQuery("");
  };

  const focusCategory = (category) => {
    if (category.id === "upload") return;
    if (detail === "model") setFocusNonce((nonce) => nonce + 1);
    else openDetail(true);
  };

  const scheduleDetailClose = () => {
    if (pinned) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      hoverTimer.current = null;
      collapseDetail();
    }, SKILL_HOVER_CLOSE_MS);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const items = (config.items || []).filter((item) => {
    const haystack = `${item.title} ${item.note}`.toLowerCase();
    return !normalizedQuery || haystack.includes(normalizedQuery);
  });

  return (
    <div className="mh-skillbox" ref={rootRef}>
      <button
        className="mh-assistant__skill"
        type="button"
        aria-label={config.triggerLabel || "Choose AI skill"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : setOpen(true))}
      >
        <Icon name="plus" />
      </button>
      <input
        ref={fileRef}
        className="mh-skillbox__file"
        type="file"
        multiple
        hidden
        accept={config.attachAccept}
        tabIndex={-1}
        onChange={(event) => {
          const names = Array.from(event.target.files || []).map((file) => file.name);
          if (names.length) onAttach?.({ names });
          event.target.value = "";
        }}
      />
      {open ? (
        <div
          className="mh-skill"
          role="menu"
          aria-label="AI skills"
          onMouseEnter={() => {
            window.clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
          }}
          onMouseLeave={scheduleDetailClose}
        >
          <div className="mh-skill__categories">
            {(config.categories || []).map((category) => (
              <button
                key={category.id}
                className={cx("mh-skill__category", detail === category.id && "is-active")}
                type="button"
                role="menuitem"
                onClick={() => clickCategory(category)}
                onMouseEnter={() => hoverCategory(category)}
                onFocus={() => focusCategory(category)}
              >
                <span className="mh-skill__category-main">
                  <span className="mh-skill__category-icon" aria-hidden="true">
                    <Icon name={category.icon} />
                  </span>
                  <span>{category.label}</span>
                </span>
                <span aria-hidden="true">›</span>
              </button>
            ))}
          </div>
          {detail === "model" ? (
            <div className="mh-skill__detail">
              <div className="mh-skill__search-row">
                <label className="mh-skill__search">
                  <Icon name="search" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    placeholder={config.searchPlaceholder}
                    aria-label={config.searchPlaceholder}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
              </div>
              <div className="mh-skill__list">
                {items.length ? (
                  items.map((item) => (
                    <button
                      key={item.id || item.title}
                      className={cx(
                        "mh-skill__option",
                        selectedSkill && selectedSkill.title === item.title && "is-selected",
                      )}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSelectSkill?.({ id: item.id, type: "Analytical Model", title: item.title });
                        closeMenu();
                        composerRef?.current?.focus();
                      }}
                    >
                      <span className="mh-skill__option-head">
                        <strong>{item.title}</strong>
                        <span className="mh-skill__pin" aria-hidden="true">
                          <Icon name="pin" />
                        </span>
                      </span>
                      <small>{item.note}</small>
                    </button>
                  ))
                ) : (
                  <div className="mh-skill__empty">{config.emptyLabel}</div>
                )}
              </div>
              <div className="mh-skill__footer">
                <button
                  className="mh-skill__action"
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onAction?.({ action: "history" });
                  }}
                >
                  <span className="mh-skill__action-label">
                    <Icon name="chat" />
                    <span>{config.historyLabel}</span>
                  </span>
                  <span aria-hidden="true">›</span>
                </button>
                <button
                  className="mh-skill__action"
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onAction?.({ action: "manual" });
                  }}
                >
                  <span className="mh-skill__action-label">
                    <Icon name="pen" />
                    <span>{config.manualLabel}</span>
                  </span>
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export const modelFlowSteps = ["history", "generated", "manual"];

const MODEL_FLOW_LABELS = {
  historyTitle: "Generate Analytical Model",
  historySubtitle: "Select conversations and describe the generation rule for the analysis logic.",
  selectLabel: "1 · Select Conversations",
  ruleLabel: "2 · Generation Rule",
  optionalLabel: "optional",
  rulePlaceholder:
    "Describe how AI should distill the analysis logic, for example: focus on the channel dimension and keep only the driver with the strongest evidence.",
  emptyError: "Select at least one message to continue.",
  generatedTitle: "New Analytical Model",
  generatedSubtitle: "Generated from selected conversations and your generation rule.",
  generatedSubtitlePlain: "Generated from selected conversations.",
  generatedNotice: "Submit will publish this knowledge immediately.",
  manualTitle: "Create Analytical Model Manually",
  manualSubtitle: "Draft the model fields and publish it to the knowledge base.",
  cancelLabel: "Cancel",
  generateLabel: "Generate",
  backLabel: "← Back",
  saveLabel: "Save",
  submitLabel: "Submit",
  savedLabel: "Saved",
  publishedLabel: "Published",
};

const MODEL_FLOW_SECTIONS = [
  {
    title: "Basic Information",
    fields: [
      { key: "name", label: "Name", required: true, placeholder: "Enter analytical model name" },
      { key: "description", label: "Description", textarea: true, placeholder: "Describe what this model helps interpret" },
      { key: "trigger", label: "Trigger When", required: true, textarea: true, placeholder: "Describe when AI should use this model" },
    ],
  },
  {
    title: "Metrics",
    fields: [
      { key: "domain", label: "Business Domain", placeholder: "Campaign Performance; Customer Conversion" },
      { key: "metrics", label: "Referenced Metrics", placeholder: "ROI; Conversion Rate; Spend" },
    ],
  },
  {
    title: "Structure & Guidance",
    fields: [
      { key: "structure", label: "Structure & Guidance", required: true, textarea: true, tall: true, placeholder: "Write the step-by-step interpretation logic" },
    ],
  },
  {
    title: "Constraints",
    fields: [
      { key: "constraints", label: "Prohibited Analysis Directions", textarea: true, placeholder: "Add limits, warnings, or blocked analysis directions" },
    ],
  },
];

/**
 * "Generate Analytical Model" flow dialog reached from the skill menu.
 * `step="history"` replays chat threads with per-message checkboxes and a
 * generation-rule textarea; Generate requires at least one ticked message.
 * `step="generated"` shows the drafted model form (Back returns to the history
 * step with ticks and rule preserved); `step="manual"` shows the same form
 * empty. Save/Submit validate required fields, then flash Saved/Published and
 * close after ~450ms — matching the demo's deterministic simulation.
 * @param {object} props
 * @param {typeof modelFlowSteps[number]} [props.step] falsy renders nothing
 * @param {Array<{ title: string, messages: Array<{ role: "user"|"ai", text: string, label?: string, title?: string, sources?: string[], checked?: boolean }> }>} [props.threads=[]]
 * @param {string} [props.rule=""] persisted generation rule (survives Back)
 * @param {object} [props.draft={}] field values for generated/manual steps, keyed by field key
 * @param {Array<{ title: string, fields: Array<{ key: string, label: string, required?: boolean, textarea?: boolean, tall?: boolean, placeholder?: string }> }>} [props.sections]
 * @param {object} [props.labels={}] copy overrides merged over the demo strings
 * @param {(event: { threadIndex: number, messageIndex: number, checked: boolean }) => void} [props.onToggleMessage]
 * @param {(event: { value: string }) => void} [props.onRuleChange]
 * @param {(event: { messages: Array<object>, rule: string }) => void} [props.onGenerate]
 * @param {(event: { reason: "back" }) => void} [props.onBack]
 * @param {(event: { reason: "button"|"cancel"|"save"|"submit" }) => void} [props.onClose]
 * @param {boolean} [props.submitFirst=false] report variant orders Submit before Save
 * @param {(event: { values: object }) => void} [props.onSave]
 * @param {(event: { values: object }) => void} [props.onSubmit]
 */
export function ModelFlowDialog({
  step,
  threads = [],
  rule = "",
  draft = {},
  sections = MODEL_FLOW_SECTIONS,
  labels = {},
  submitFirst = false,
  onToggleMessage,
  onRuleChange,
  onGenerate,
  onBack,
  onClose,
  onSave,
  onSubmit,
}) {
  const copy = { ...MODEL_FLOW_LABELS, ...labels };
  const titleId = React.useId();
  const formRef = React.useRef(null);
  const ruleRef = React.useRef(null);
  const doneTimer = React.useRef(null);
  const [error, setError] = React.useState(false);
  const [invalid, setInvalid] = React.useState({});
  const [done, setDone] = React.useState(null);
  React.useEffect(() => () => window.clearTimeout(doneTimer.current), []);
  React.useEffect(() => {
    setError(false);
    setInvalid({});
    setDone(null);
  }, [step]);

  if (!step) return null;
  const isHistory = step === "history";
  const isGenerated = step === "generated";

  const selectedCount = threads.reduce((sum, thread) => sum + thread.messages.filter((message) => message.checked).length, 0);
  const totalCount = threads.reduce((sum, thread) => sum + thread.messages.length, 0);

  const generate = () => {
    const messages = [];
    threads.forEach((thread, threadIndex) =>
      thread.messages.forEach((message, messageIndex) => {
        if (message.checked) {
          messages.push({
            threadIndex,
            messageIndex,
            role: message.role,
            title: message.title || "",
            text: message.text,
            conversation: thread.title,
          });
        }
      }),
    );
    if (!messages.length) {
      setError(true);
      return;
    }
    setError(false);
    onGenerate?.({ messages, rule: ruleRef.current?.value || "" });
  };

  const finish = (kind) => {
    const values = Object.fromEntries(new FormData(formRef.current).entries());
    const missing = {};
    sections.forEach((section) =>
      section.fields.forEach((field) => {
        if (field.required && !String(values[field.key] || "").trim()) missing[field.key] = `${field.label} is required.`;
      }),
    );
    setInvalid(missing);
    if (Object.keys(missing).length) {
      formRef.current?.querySelector(".is-invalid")?.focus();
      return;
    }
    (kind === "save" ? onSave : onSubmit)?.({ values });
    setDone(kind);
    window.clearTimeout(doneTimer.current);
    doneTimer.current = window.setTimeout(() => onClose?.({ reason: kind }), 450);
  };

  const title = isHistory ? copy.historyTitle : isGenerated ? copy.generatedTitle : copy.manualTitle;
  const subtitle = isHistory
    ? copy.historySubtitle
    : isGenerated
      ? `${rule.trim() ? copy.generatedSubtitle : copy.generatedSubtitlePlain} ${copy.generatedNotice}`
      : copy.manualSubtitle;

  return (
    <div className="mh-flow">
      <div
        className={cx("mh-flow__card", isHistory ? "mh-flow__card--history" : "mh-flow__card--form")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="mh-flow__head">
          <div>
            <strong id={titleId}>{title}</strong>
            <span>{subtitle}</span>
          </div>
          <button type="button" aria-label="Close" onClick={() => onClose?.({ reason: "button" })}>
            ×
          </button>
        </header>
        {isHistory ? (
          <div className="mh-flow__body">
            <section className="mh-flow__block">
              <div className="mh-flow__block-head">
                <span>{copy.selectLabel}</span>
                <span className="mh-flow__count">
                  Selected {selectedCount} / {totalCount} messages
                </span>
              </div>
              <div className="mh-flow__thread">
                {threads.map((thread, threadIndex) =>
                  thread.messages.map((message, messageIndex) => (
                    <label
                      key={`${threadIndex}-${messageIndex}`}
                      className={cx("mh-flow__msg", message.checked && "is-selected")}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(message.checked)}
                        onChange={(event) => {
                          if (event.target.checked) setError(false);
                          onToggleMessage?.({ threadIndex, messageIndex, checked: event.target.checked });
                        }}
                      />
                      {message.role === "user" ? (
                        <span className="mh-flow__bubble">{message.text}</span>
                      ) : (
                        <span className="mh-flow__answer">
                          <span className="mh-flow__answer-head">
                            {message.label} · {message.sources?.length || 0} grounded sources
                          </span>
                          <strong>{message.title}</strong>
                          <small>{message.text}</small>
                          {message.sources?.length ? (
                            <span className="mh-flow__sources">
                              {message.sources.map((source) => (
                                <span key={source}>{source}</span>
                              ))}
                            </span>
                          ) : null}
                        </span>
                      )}
                    </label>
                  )),
                )}
              </div>
              <p className="mh-flow__error" hidden={!error}>
                {copy.emptyError}
              </p>
            </section>
            <section className="mh-flow__block">
              <div className="mh-flow__block-head">
                <span>{copy.ruleLabel}</span>
                <span className="mh-flow__optional">{copy.optionalLabel}</span>
              </div>
              <textarea
                ref={ruleRef}
                className="mh-flow__rule"
                rows={3}
                defaultValue={rule}
                placeholder={copy.rulePlaceholder}
                onChange={(event) => onRuleChange?.({ value: event.target.value })}
              />
            </section>
          </div>
        ) : (
          <form className="mh-flow__form" ref={formRef} onSubmit={(event) => event.preventDefault()}>
            {sections.map((section) => (
              <section key={section.title} className="mh-flow__section">
                <h4>{section.title}</h4>
                {section.fields.map((field) => {
                  const Tag = field.textarea ? "textarea" : "input";
                  return (
                    <label key={field.key} className="mh-flow__field">
                      <span className="mh-flow__field-label">
                        {field.label}
                        {field.required ? (
                          <span className="mh-flow__required" aria-hidden="true">
                            *
                          </span>
                        ) : null}
                      </span>
                      <Tag
                        name={field.key}
                        defaultValue={draft[field.key] ?? ""}
                        placeholder={field.placeholder}
                        className={cx(invalid[field.key] && "is-invalid", field.tall && "mh-flow__tall")}
                        onChange={() => {
                          if (invalid[field.key]) {
                            setInvalid((previous) => {
                              const next = { ...previous };
                              delete next[field.key];
                              return next;
                            });
                          }
                        }}
                      />
                      {invalid[field.key] ? <span className="mh-flow__field-error">{invalid[field.key]}</span> : null}
                    </label>
                  );
                })}
              </section>
            ))}
          </form>
        )}
        <footer className="mh-flow__foot">
          {isGenerated ? (
            <button type="button" className="mh-flow__btn mh-flow__btn--secondary mh-flow__back" onClick={() => onBack?.({ reason: "back" })}>
              {copy.backLabel}
            </button>
          ) : null}
          <button type="button" className="mh-flow__btn mh-flow__btn--secondary" onClick={() => onClose?.({ reason: "cancel" })}>
            {copy.cancelLabel}
          </button>
          {isHistory ? (
            <button type="button" className="mh-flow__btn mh-flow__btn--primary" onClick={generate}>
              {copy.generateLabel}
            </button>
          ) : submitFirst ? (
            <>
              <button type="button" className="mh-flow__btn mh-flow__btn--primary" onClick={() => finish("submit")}>
                {done === "submit" ? copy.publishedLabel : copy.submitLabel}
              </button>
              <button type="button" className="mh-flow__btn mh-flow__btn--secondary" onClick={() => finish("save")}>
                {done === "save" ? copy.savedLabel : copy.saveLabel}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="mh-flow__btn mh-flow__btn--secondary" onClick={() => finish("save")}>
                {done === "save" ? copy.savedLabel : copy.saveLabel}
              </button>
              <button type="button" className="mh-flow__btn mh-flow__btn--primary" onClick={() => finish("submit")}>
                {done === "submit" ? copy.publishedLabel : copy.submitLabel}
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

/**
 * RedNote Campaign Tool left rail: numbered view navigation.
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {Array<{ id: string, label: string, index: string, caption?: string }>} [props.items=[]]
 * @param {string} [props.current] active item id
 * @param {(event: { id: string, label: string }) => void} [props.onSelect]
 */
export function CampaignRail({ eyebrow, title, description, items = [], current, onSelect }) {
  return (
    <aside className="mh-rail" aria-label="RedNote Campaign Tool navigation">
      <header className="mh-rail__head">
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        <span>{description}</span>
      </header>
      <nav className="mh-rail__nav" aria-label="Trading Desk views">
        {items.map((item) => (
          <button
            key={item.id}
            className={cx("mh-rail__item", item.id === current && "is-active")}
            type="button"
            aria-current={item.id === current ? "page" : undefined}
            onClick={() => onSelect?.({ id: item.id, label: item.label })}
          >
            <span className="mh-rail__index">{item.index}</span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.caption}</small>
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

/**
 * Bordered section panel with heading and optional actions slot.
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.meta] small trailing text in the header
 * @param {React.ReactNode} [props.actions] trailing header actions; overrides meta
 * @param {React.ReactNode} [props.children]
 */
export function Panel({ eyebrow, title, meta, actions, children }) {
  return (
    <section className="mh-panel">
      <header className="mh-panel__head">
        <div>
          {eyebrow ? <p className="mh-panel__kicker">{eyebrow}</p> : null}
          <h3>{title}</h3>
        </div>
        {actions || (meta ? <small>{meta}</small> : null)}
      </header>
      <div className="mh-panel__body">{children}</div>
    </section>
  );
}

/**
 * Horizontal execution-status strip (label / caption / value cells).
 * @param {object} props
 * @param {Array<{ label: string, caption?: string, value: React.ReactNode }>} [props.items=[]]
 */
export function SummaryStrip({ items = [] }) {
  return (
    <div className="mh-summary" aria-label="Execution status">
      {items.map((item) => (
        <div className="mh-summary__item" key={item.label}>
          <span>{item.label}</span>
          <small>{item.caption}</small>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

/**
 * Task queue rows with an outline StatusBadge.
 * @param {object} props
 * @param {Array<{ title: string, detail?: string, status: string }>} [props.items=[]]
 */
export function TaskList({ items = [] }) {
  return (
    <div>
      {items.map((item) => (
        <article className="mh-task" key={item.title}>
          <StatusBadge status={item.status} outline>
            {item.status}
          </StatusBadge>
          <div>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

/**
 * Business Term create/edit form (Title, Term Type, Description, Synonyms).
 * `invalid` turns on required-field error styling; callers pass it after a
 * failed submit so empty required fields are marked.
 * @param {object} props
 * @param {string} [props.title=""]
 * @param {"Business Term"|"Global Synonym"} [props.kind="Business Term"]
 * @param {string} [props.description=""]
 * @param {string} [props.synonyms=""]
 * @param {boolean} [props.invalid=false]
 * @param {(event: { name: string, value: string }) => void} [props.onChange]
 * @param {() => void} [props.onCancel]
 * @param {(values: { title: string, kind: string, description: string, synonyms: string }) => void} [props.onSave]
 * @param {(values: { title: string, kind: string, description: string, synonyms: string }) => void} [props.onSubmit]
 */
export function BusinessTermForm({
  title = "",
  kind = "Business Term",
  description = "",
  synonyms = "",
  invalid = false,
  onChange,
  onCancel,
  onSave,
  onSubmit,
}) {
  const missing = (value) => invalid && !String(value).trim();
  return (
    <form
      className="mh-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.({ title, kind, description, synonyms });
      }}
    >
      <div className="mh-form__grid">
        <FormField label="Title" name="title" required invalid={missing(title)} value={title} placeholder="Enter the business term title." onChange={onChange} />
        <FormField
          label="Term Type"
          name="kind"
          control="select"
          required
          invalid={missing(kind)}
          value={kind}
          options={["Business Term", "Global Synonym"]}
          onChange={onChange}
        />
        <FormField
          className="mh-form__wide"
          label="Description"
          name="description"
          control="textarea"
          required
          invalid={missing(description)}
          value={description}
          placeholder="Explain the meaning, usage, and boundary of this term."
          onChange={onChange}
        />
        <FormField label="Synonyms" name="synonyms" value={synonyms} placeholder="Add aliases, separated by commas." onChange={onChange} />
      </div>
      <div className="mh-form__actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={() => onSave?.({ title, kind, description, synonyms })}>
          Save
        </Button>
        <Button variant="gold" type="submit">
          Submit
        </Button>
      </div>
      <p className="mh-form__note">Save keeps this term in Draft. Submit publishes it for AI use.</p>
    </form>
  );
}


/**
 * Centered modal dialog: dimmed scrim, framed panel with eyebrow/title and a
 * close button, arbitrary `children` body. Closes on scrim click and Escape,
 * locks body scroll (`dialog-open` class, matching the static demo), focuses
 * the panel on open and restores focus on close.
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {string} [props.eyebrow]
 * @param {string} [props.title]
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className] extra class on the dialog panel
 * @param {string} [props.closeLabel="Close"]
 * @param {string} [props.titleId] defaults to a generated useId
 * @param {"modal"|"sheet"} [props.variant="modal"] "sheet" is the borderless radius-8 chrome with deep scrim used by the Self-Service dialogs
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onClose]
 */
export function Modal({ open = false, eyebrow, title, children, className, closeLabel = "Close", titleId, variant = "modal", onClose }) {
  const generatedTitleId = React.useId();
  const dialogRef = React.useRef(null);
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;
  useBodyScrollLock(open);
  useFocusRestore(open, dialogRef);
  React.useEffect(() => {
    if (!open) return undefined;
    dialogRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.({ reason: "escape" });
        return;
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (!focusables.length) {
          event.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey ? document.activeElement === first || !dialogRef.current.contains(document.activeElement) : document.activeElement === last) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  return (
    <div className={cx("mh-modal", variant === "sheet" && "mh-modal--sheet")}>
      <div className="mh-modal__scrim" onClick={() => onClose?.({ reason: "scrim" })} />
      <div
        className={cx("mh-modal__dialog", className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId || generatedTitleId}
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="mh-modal__header">
          <div className="mh-modal__heading">
            {eyebrow ? <span className="mh-modal__eyebrow">{eyebrow}</span> : null}
            <h2 className="mh-modal__title" id={titleId || generatedTitleId}>
              {title}
            </h2>
          </div>
          <button type="button" className="mh-modal__close" aria-label={closeLabel} onClick={() => onClose?.({ reason: "button" })}>
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

/**
 * Upload-history dialog: table of file/uploader/time rows with per-row
 * Preview and Download actions, or an empty-state message. Built on Modal.
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {string} [props.title="Upload History"]
 * @param {Array<{ id?: string, file: string, uploader: string, time: string }>} [props.rows=[]]
 * @param {string} [props.emptyMessage="No upload history yet for this module."]
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onClose]
 * @param {(row: object) => void} [props.onPreview]
 * @param {(row: object) => void} [props.onDownload]
 */
export function UploadHistory({
  open = false,
  title = "Upload History",
  rows = [],
  emptyMessage = "No upload history yet for this module.",
  onClose,
  onPreview,
  onDownload,
}) {
  return (
    <Modal open={open} title={title} className="mh-upload-history" variant="sheet" onClose={onClose}>
      <div className="mh-upload-history__body">
        {rows.length ? (
          <table className="mh-upload-history__table">
            <thead>
              <tr>
                <th scope="col">File Name</th>
                <th scope="col">Uploader</th>
                <th scope="col">Upload Time</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id || index}>
                  <td>
                    <span className="mh-upload-history__file">
                      <Icon name="file" />
                      <span>{row.file}</span>
                    </span>
                  </td>
                  <td className="mh-upload-history__uploader">{row.uploader}</td>
                  <td className="mh-upload-history__time">{row.time}</td>
                  <td>
                    <span className="mh-upload-history__actions">
                      <button type="button" className="mh-upload-history__btn" aria-label={`Preview ${row.file}`} onClick={() => onPreview?.(row)}>
                        <Icon name="eye" />
                        <span>Preview</span>
                      </button>
                      <button type="button" className="mh-upload-history__btn" aria-label={`Download ${row.file}`} onClick={() => onDownload?.(row)}>
                        <Icon name="download" />
                        <span>Download</span>
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="mh-upload-history__empty">{emptyMessage}</div>
        )}
      </div>
    </Modal>
  );
}

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

/**
 * Generic live overview: KPI cards, primary/comparison bar chart, and the
 * "Leading views" rank list (first five chart rows, original chart order).
 * @param {object} props
 * @param {Array<[string, string, string]>} [props.metrics=[]] [name, value, delta]
 * @param {Array<[string, number, number]>} [props.chart=[]] [label, primary, comparison]
 * @param {string} [props.accent] project accent color for rank bars
 */
export function LiveOverview({ metrics = [], chart = [], accent }) {
  return (
    <div className="mh-live-dashboard">
      <div className="mh-live-kpis">
        {metrics.map((metric) => (
          <article className="mh-live-kpi" key={metric[0]}>
            <span>{metric[0]}</span>
            <strong>{metric[1]}</strong>
            <small>{metric[2]}</small>
          </article>
        ))}
      </div>
      <div className="mh-live-grid">
        <section className="mh-live-card">
          <header className="mh-live-card__head">
            <div>
              <span>PERFORMANCE</span>
              <h2>Current period versus baseline</h2>
            </div>
            <span>Primary / comparison</span>
          </header>
          <div className="mh-live-chart">
            {chart.map((item) => (
              <div className="mh-live-chart__group" key={item[0]}>
                <i style={{ height: item[1] + "%" }} />
                <b style={{ height: item[2] + "%" }} />
                <span>{item[0]}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="mh-live-card">
          <header className="mh-live-card__head">
            <div>
              <span>PRIORITY</span>
              <h2>Leading views</h2>
            </div>
            <span>Index</span>
          </header>
          <div className="mh-live-ranks">
            {chart.slice(0, 5).map((item, index) => (
              <div className="mh-live-rank" key={item[0]}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{item[0]}</strong>
                  <i style={{ width: item[1] + "%", background: accent }} />
                </div>
                <b>{item[1]}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * City-invest analysis embed — the live report view rendered when a report
 * carries `embed: "city-invest"`. All data arrives via props; the seeded
 * scenario generator lives in demo/report-demo.js.
 * ---------------------------------------------------------------------- */

function ScFilterDropdown({ label, options, selected, multi = false, suffix = "", copy, open = false, onToggle, onChange }) {
  const name = React.useId();
  const text = multi ? selectionLabel(selected, options.length, copy) : selected[0];
  const pick = (option, checked) => {
    if (multi) {
      onChange?.(checked ? [...selected, option] : selected.filter((item) => item !== option));
    } else {
      onChange?.([option]);
    }
  };
  return (
    <div className="mh-sc-fitem">
      <span className="mh-sc-flabel">{label}</span>
      <span
        className={cx("mh-sc-fval", open && "is-open")}
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            onToggle?.();
          }
        }}
      >
        <span className="mh-sc-fval__txt">
          {text}
          {suffix ? " " + suffix : ""}
        </span>
        <span className="mh-sc-panel" role="listbox" onClick={(event) => event.stopPropagation()}>
          {multi ? (
            <span className="mh-sc-phead">
              <span className="mh-sc-phead__label">{copy.multiSelect}</span>
              <span>
                <button type="button" onClick={() => onChange?.(options.slice())}>
                  {copy.selectAll}
                </button>{" "}
                ·{" "}
                <button type="button" onClick={() => onChange?.([])}>
                  {copy.clear}
                </button>
              </span>
            </span>
          ) : null}
          {options.map((option) => (
            <label className="mh-sc-prow" key={option}>
              <input
                type={multi ? "checkbox" : "radio"}
                name={name}
                value={option}
                checked={selected.includes(option)}
                onChange={(event) => pick(option, event.target.checked)}
              />
              <span>{option}</span>
            </label>
          ))}
        </span>
      </span>
    </div>
  );
}

const SC_CHART_W = 440;
const SC_CHART_H = 150;
const SC_PAD_L = 42;
const SC_PAD_R = 16;
const SC_PAD_T = 10;
const SC_PAD_B = 30;

function ScTrendChart({ name, data, endIdx, decimals = 0, periods, startIndex, copy, totalLabel }) {
  const chartRef = React.useRef(null);
  const tipRef = React.useRef(null);
  const [tipWidth, setTipWidth] = React.useState(0);
  const [hover, setHover] = React.useState(null);
  const s = Math.min(startIndex, endIdx);
  const labels = periods.slice(s, endIdx + 1);
  const t = data.t.slice(s, endIdx + 1);
  const n = data.n.slice(s, endIdx + 1);
  const all = t.concat(n);
  let min = Math.min(...all);
  let max = Math.max(...all);
  const span = max - min || 1;
  min -= span * 0.12;
  max += span * 0.12;
  const X = (i) => SC_PAD_L + (SC_CHART_W - SC_PAD_L - SC_PAD_R) * (i / (labels.length - 1));
  const Y = (v) => SC_PAD_T + (SC_CHART_H - SC_PAD_T - SC_PAD_B) * (1 - (v - min) / (max - min));
  const ticks = new Set(pickTicks(labels.length));
  const grid = [0, 1, 2, 3].map((g) => min + ((max - min) * g) / 3);
  const points = (arr) => arr.map((v, i) => X(i).toFixed(1) + "," + Y(v).toFixed(1)).join(" ");
  React.useEffect(() => {
    setHover(null);
  }, [data, endIdx]);
  /* A hover recorded against a previous `data`/`endIdx` is dropped at render
     time (the original destroys the tooltip DOM on rebuild), so no stale frame
     ever paints; `hi` also clamps as a belt-and-braces index guard. */
  const liveHover = hover && hover.data === data && hover.endIdx === endIdx ? hover : null;
  const hi = liveHover ? Math.min(liveHover.index, labels.length - 1) : 0;
  React.useLayoutEffect(() => {
    if (liveHover && tipRef.current) {
      const width = tipRef.current.offsetWidth;
      if (width !== tipWidth) setTipWidth(width);
    }
  }, [liveHover, tipWidth]);
  const onMove = (event) => {
    if (labels.length < 2) return;
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    if (!rect.width) return;
    const lx = (event.clientX - rect.left) * (SC_CHART_W / rect.width);
    let best = 0;
    let bd = Infinity;
    for (let i = 0; i < labels.length; i++) {
      const dx = Math.abs(X(i) - lx);
      if (dx < bd) {
        bd = dx;
        best = i;
      }
    }
    const host = chartRef.current?.getBoundingClientRect();
    setHover({
      index: best,
      x: event.clientX - (host?.left || 0) + 14,
      y: event.clientY - (host?.top || 0) + 10,
      hostWidth: host?.width || 0,
      data,
      endIdx,
    });
  };
  const tipLeft = liveHover && tipWidth && liveHover.x + tipWidth > liveHover.hostWidth ? liveHover.x - tipWidth - 28 : liveHover?.x;
  return (
    <div className="mh-sc-chart" ref={chartRef}>
      <div className="mh-sc-chart__head">
        <span className="mh-sc-chart__name">{name}</span>
        <span className="mh-sc-chart__legend">
          <span>
            <i style={{ background: "#333" }} />
            {totalLabel}
          </span>
          <span>
            <i style={{ background: "#c9a876" }} />
            {copy.nonInvestAvg}
          </span>
        </span>
      </div>
      <svg
        viewBox={`0 0 ${SC_CHART_W} ${SC_CHART_H}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <rect x="0" y="0" width={SC_CHART_W} height={SC_CHART_H} fill="transparent" pointerEvents="all" />
        {grid.map((val, g) => (
          <line key={g} x1={SC_PAD_L} y1={Y(val)} x2={SC_CHART_W - SC_PAD_R} y2={Y(val)} stroke="#eef0f3" strokeWidth="1" />
        ))}
        {grid.map((val, g) => (
          <text key={"y" + g} x={SC_PAD_L - 6} y={Y(val) + 3} textAnchor="end" fontSize="9" fill="#aab0b8">
            {val.toFixed(decimals)}
          </text>
        ))}
        {labels.map((cat, i) =>
          /* A single-period range makes X() a 0/0 division — the original emits
             NaN attributes the browser rejects (and logs console errors for);
             skip those elements so nothing NaN reaches the DOM. */
          ticks.has(i) && labels.length > 1 ? (
            <text key={cat} x={X(i)} y={SC_CHART_H - 12} textAnchor="middle" fontSize="8" fill="#aab0b8">
              {cat}
            </text>
          ) : null
        )}
        {labels.length > 1 ? (
          <React.Fragment>
            <polyline points={points(n)} fill="none" stroke="#c9a876" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={points(t)} fill="none" stroke="#333333" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
          </React.Fragment>
        ) : null}
        {liveHover ? (
          <g>
            <line
              x1={X(hi).toFixed(1)}
              y1={SC_PAD_T}
              x2={X(hi).toFixed(1)}
              y2={SC_CHART_H - SC_PAD_B}
              stroke="#9aa0a8"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
            <circle cx={X(hi).toFixed(1)} cy={Y(t[hi]).toFixed(1)} r="3.2" fill="#333" stroke="#fff" strokeWidth="1" />
            <circle cx={X(hi).toFixed(1)} cy={Y(n[hi]).toFixed(1)} r="3.2" fill="#c9a876" stroke="#fff" strokeWidth="1" />
          </g>
        ) : null}
      </svg>
      {liveHover ? (
        <div className="mh-sc-tip" ref={tipRef} style={{ left: tipLeft, top: liveHover.y }}>
          <b>{labels[hi]}</b>
          <br />
          <span>● {totalLabel}: {t[hi].toFixed(decimals)}</span>
          <br />
          <span>● {copy.nonInvest}: {n[hi].toFixed(decimals)}</span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * City-invest analysis embed. Filter state (end period, channel, pilot,
 * multi-select cities and cascading stores) stays local and uncontrolled —
 * seeded from `defaultFilters`, every change regenerates the scenario via
 * `getScenario(filters)` and briefly dims the canvas, matching
 * `initCityInvestDashboard`. All data and visible copy arrive via props.
 * @param {object} props
 * @param {object} props.copy every visible label (title, footnote, basePeriod,
 *   investStart, formula, trendHeading + filter/KPI/chart labels)
 * @param {string[]} props.periods period axis labels
 * @param {number} props.startIndex index of the invest-start period
 * @param {{ end: string[], channel: string[], pilot: string[], cities: string[], cityStores: Record<string, string[]> }} props.options
 * @param {Array<object>} props.kpis KPI meta rows (key/name/uplift/var/trend/baseAfter/fmt/dec)
 * @param {string[][]} props.kpiRows KPI key grid layout
 * @param {string[]} props.charts trend-chart order (baseline keys)
 * @param {object} props.defaultFilters initial filter values
 * @param {(filters: { end: string, channel: string, pilot: string, city: string[], store: string[] }) => object} props.getScenario deterministic scenario source
 * @param {(filters: { end: string, channel: string, pilot: string, cities: string[], stores: string[] }) => void} [props.onFiltersChange]
 */
export function CityInvestDashboard({ copy, periods, startIndex, options, kpis, kpiRows, charts, defaultFilters, getScenario, onFiltersChange }) {
  const [end, setEnd] = React.useState(defaultFilters.end);
  const [channel, setChannel] = React.useState(defaultFilters.channel);
  const [pilot, setPilot] = React.useState(defaultFilters.pilot);
  const [cities, setCities] = React.useState(defaultFilters.cities);
  const [stores, setStores] = React.useState(defaultFilters.stores);
  const [openFilter, setOpenFilter] = React.useState(null);
  const [dim, setDim] = React.useState(false);

  const storeOptions = storeOptionsFor(options.cityStores, cities);
  const total = totalLabel(cities, options.cities, copy);
  const scenario = React.useMemo(
    () => getScenario({ end, channel, pilot, city: cities, store: stores }),
    [getScenario, end, channel, pilot, cities, stores]
  );

  React.useEffect(() => {
    if (!openFilter) return undefined;
    const close = () => setOpenFilter(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openFilter]);

  React.useEffect(() => {
    if (!dim) return undefined;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setDim(false)));
    return () => cancelAnimationFrame(raf);
  }, [dim]);

  const commit = (patch) => {
    const next = {
      end: patch.end ?? end,
      channel: patch.channel ?? channel,
      pilot: patch.pilot ?? pilot,
      cities: patch.cities ?? cities,
      stores: patch.stores ?? stores,
    };
    setEnd(next.end);
    setChannel(next.channel);
    setPilot(next.pilot);
    setCities(next.cities);
    setStores(next.stores);
    setDim(true);
    onFiltersChange?.(next);
  };

  const toggleFilter = (key) => setOpenFilter((current) => (current === key ? null : key));

  return (
    <div className="mh-sixcity">
      <div className="mh-sc-canvas" style={{ opacity: dim ? 0.55 : 1 }}>
        <div className="mh-sc-titlebar">
          <p className="mh-sc-title">{copy.title}</p>
          <div className="mh-sc-footnotes">
            <p className="mh-sc-footnote">{copy.footnote}</p>
          </div>
        </div>
        <div className="mh-sc-filters">
          <div className="mh-sc-fitem">
            <span className="mh-sc-flabel">{copy.labelBasePeriod}</span>
            <span className="mh-sc-fstatic">{copy.basePeriod}</span>
          </div>
          <div className="mh-sc-fitem">
            <span className="mh-sc-flabel">{copy.labelInvestStart}</span>
            <span className="mh-sc-fstatic">{copy.investStart}</span>
          </div>
          <ScFilterDropdown
            label={copy.labelInvestEnd}
            options={options.end}
            selected={[end]}
            copy={copy}
            open={openFilter === "end"}
            onToggle={() => toggleFilter("end")}
            onChange={(value) => commit({ end: value[0] })}
          />
          <ScFilterDropdown
            label={copy.labelChannel}
            options={options.channel}
            selected={[channel]}
            copy={copy}
            open={openFilter === "channel"}
            onToggle={() => toggleFilter("channel")}
            onChange={(value) => commit({ channel: value[0] })}
          />
          <ScFilterDropdown
            label={copy.labelPilot}
            options={options.pilot}
            selected={[pilot]}
            copy={copy}
            open={openFilter === "pilot"}
            onToggle={() => toggleFilter("pilot")}
            onChange={(value) => commit({ pilot: value[0] })}
          />
          <ScFilterDropdown
            label={copy.labelCity}
            options={options.cities}
            selected={cities}
            multi
            copy={copy}
            open={openFilter === "city"}
            onToggle={() => toggleFilter("city")}
            onChange={(value) => commit({ cities: value, stores: storeOptionsFor(options.cityStores, value) })}
          />
          <ScFilterDropdown
            label={copy.labelStore}
            options={storeOptions}
            selected={stores.filter((store) => storeOptions.includes(store))}
            multi
            suffix={storeScopeSuffix(cities, copy)}
            copy={copy}
            open={openFilter === "store"}
            onToggle={() => toggleFilter("store")}
            onChange={(value) => commit({ stores: value })}
          />
        </div>
        {kpiRows.map((row, rowIndex) => (
          <div className="mh-sc-kpi-grid" key={rowIndex} style={rowIndex > 0 ? { marginTop: 10 } : undefined}>
            {row.map((key) => {
              const meta = kpis.find((item) => item.key === key);
              const value = scenario.kpi[key];
              if (meta.uplift === null) {
                return (
                  <div className="mh-sc-kpi is-plain" key={key}>
                    <div className="mh-sc-kpi__top">
                      <span className="mh-sc-kpi__name">{meta.name}</span>
                    </div>
                    <div className="mh-sc-kpi__uplift">{fmtAfter(meta, value.after)}</div>
                  </div>
                );
              }
              const up = value.uplift;
              return (
                <div className="mh-sc-kpi" key={key}>
                  <div className="mh-sc-kpi__top">
                    <span className="mh-sc-kpi__name">{meta.name}</span>
                  </div>
                  <div className="mh-sc-kpi__uplift-label">{copy.uplift}</div>
                  <div className={cx("mh-sc-kpi__uplift", up >= 0 ? "is-pos" : "is-neg")}>
                    {up > 0 ? "+" : ""}
                    {up}%<span className="mh-sc-kpi__arrow">{up >= 0 ? "▲" : "▼"}</span>
                  </div>
                  <div className="mh-sc-kpi__row2">
                    <span className="mh-sc-kpi__var">
                      {copy.varPct} {value.vari > 0 ? "+" : ""}
                      {value.vari}%
                    </span>
                    <span className="mh-sc-kpi__after">
                      {copy.after} <b>{fmtAfter(meta, value.after)}</b>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div className="mh-sc-kpi-legend">
          <span className="mh-sc-formula">{copy.formula}</span>
        </div>
        <div className="mh-sc-sec-title">{total} {copy.trendHeading}</div>
        <div className="mh-sc-chart-grid">
          {charts.map((name) => (
            <ScTrendChart
              key={name}
              name={name}
              data={scenario.trends[name]}
              endIdx={scenario.endIdx}
              decimals={name === "UPT" ? 2 : 0}
              periods={periods}
              startIndex={startIndex}
              copy={copy}
              totalLabel={total}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Report Copilot — the report-scoped AI workspace (aiWorkspace) on the
   live report view: right-side drawer with summary/scenario start view,
   contextual answers, chat thread, history popup and the report skill
   menu. Deterministic local port of report-core.js's workspace block.
   ============================================================ */

const COPILOT_STREAM_MS = { holistic: 110, rich: 140 };

/** Inline segment renderer shared by copilot content (text/bold/signed value/badge/break). */
function CopilotSegments({ segments }) {
  return segments.map((segment, index) => {
    if (typeof segment === "string") return <React.Fragment key={index}>{segment}</React.Fragment>;
    if (segment.br) return <br key={index} />;
    if (segment.b) return <b key={index}>{segment.b}</b>;
    if (segment.n !== undefined) return <HrNum key={index} value={segment.n} />;
    if (segment.d) return <HrDot key={index} kind={segment.d} />;
    if (segment.badge) {
      return (
        <span key={index} className={cx("mh-ra-badge", `mh-ra-badge--${segment.tone}`)}>
          {segment.badge}
        </span>
      );
    }
    return <React.Fragment key={index}>{segment.text}</React.Fragment>;
  });
}

function HrDot({ kind }) {
  return (
    <span className="mh-hr-dot-cell">
      <i className={cx("mh-hr-dot", `mh-hr-dot--${kind}`)} />
    </span>
  );
}

function HrNum({ value }) {
  const negative = String(value).startsWith("-") || String(value).startsWith("−");
  return <span className={cx("mh-hr-num", negative ? "mh-hr-neg" : "mh-hr-pos")}>{value}</span>;
}

function HrCell({ cell }) {
  if (cell && typeof cell === "object") {
    if (cell.d) return <HrDot kind={cell.d} />;
    if (cell.n !== undefined) return <HrNum value={cell.n} />;
  }
  return <React.Fragment>{cell}</React.Fragment>;
}

function HrTable({ headers, rows, total }) {
  return (
    <table className="mh-hr-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className={cx(total && rowIndex === rows.length - 1 && "mh-hr-total")}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>
                <HrCell cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HrInsight({ label, segments }) {
  return (
    <div className="mh-hr-insight">
      <b>{label}</b>
      <CopilotSegments segments={segments} />
    </div>
  );
}

const HR_SERIES_TONES = { ink: "var(--mh-sc-ink)", pos: "var(--mh-sc-pos)", neg: "var(--mh-sc-neg)" };

function HrTrendChart({ chart }) {
  const { periods, min, max, ticks, series } = chart;
  const W = 520;
  const H = 170;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 26;
  const X = (i) => padL + (W - padL - padR) * (i / (periods.length - 1));
  const Y = (v) => padT + (H - padT - padB) * (1 - (v - min) / (max - min));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="mh-hr-chart-svg" role="img" aria-label="Monthly uplift trend">
      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={padL}
            y1={Y(tick)}
            x2={W - padR}
            y2={Y(tick)}
            stroke={tick === 0 ? "var(--mh-hr-grid-zero)" : "var(--mh-sc-gridline)"}
            strokeWidth="1"
            strokeDasharray={tick === 0 ? "4 3" : undefined}
          />
          <text x={padL - 6} y={Y(tick) + 3} textAnchor="end" fontSize="9" fill="var(--mh-hr-axis)">
            {tick > 0 ? `+${tick}` : tick}%
          </text>
        </g>
      ))}
      {periods.map((period, i) => (
        <text key={period} x={X(i)} y={H - 10} textAnchor="middle" fontSize="8.5" fill="var(--mh-hr-axis)">
          {period}
        </text>
      ))}
      {series.map((s) => {
        const color = HR_SERIES_TONES[s.tone];
        const pts = s.values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
        const lastX = X(s.values.length - 1);
        const lastY = Y(s.values[s.values.length - 1]);
        const last = s.values[s.values.length - 1];
        return (
          <g key={s.name}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={lastX} cy={lastY} r="3" fill={color} stroke="#fff" strokeWidth="1" />
            <text x={lastX - 2} y={lastY - 6} textAnchor="end" fontSize="9" fontWeight="600" fill={color}>
              {last > 0 ? "+" : ""}
              {last.toFixed(1)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** One block of a streamed answer: mounts hidden, reveals on the next frame. */
function StreamBlock({ animate = true, children }) {
  const [revealed, setRevealed] = React.useState(!animate);
  React.useEffect(() => {
    if (!animate) return undefined;
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, [animate]);
  return <div className={cx("mh-stream-block", revealed && "is-revealed")}>{children}</div>;
}

/* Progressive reveal driver: mounts blocks one interval at a time with a trailing cursor.
   streamBlocksInto() calls cancelActiveStream() — one stream at a time; a new
   card freezes the previous mid-render and drops its cursor. The registry is
   scoped per ReportCopilot instance via context (a bare useStream falls back
   to a shared registry). */
const defaultStreamRegistry = { current: null };
const CopilotStreamContext = React.createContext(defaultStreamRegistry);
function useStream(total, stream, interval, scrollSelector) {
  const registry = React.useContext(CopilotStreamContext);
  const hostRef = React.useRef(null);
  const [shown, setShown] = React.useState(stream ? 0 : total);
  const [cancelled, setCancelled] = React.useState(false);
  React.useEffect(() => {
    setShown(stream ? 0 : total);
    setCancelled(false);
  }, [stream, total]);
  React.useEffect(() => {
    const token = { cancel: () => setCancelled(true) };
    registry.current?.cancel();
    registry.current = token;
    return () => {
      if (registry.current === token) registry.current = null;
    };
  }, [registry]);
  React.useEffect(() => {
    if (shown >= total || cancelled) return undefined;
    const timer = window.setTimeout(() => {
      setShown((n) => n + 1);
      const scroller = hostRef.current?.closest(scrollSelector);
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    }, interval);
    return () => window.clearTimeout(timer);
  }, [shown, total, cancelled, interval, scrollSelector]);
  return { hostRef, shown, streaming: shown < total && !cancelled };
}

function HolisticReport({ data, stream = true }) {
  const blocks = data.blocks;
  const { hostRef, shown, streaming } = useStream(blocks.length, stream, COPILOT_STREAM_MS.holistic, ".mh-copilot__answer");
  const renderBlock = (block, index) => {
    switch (block.type) {
      case "meta":
        return (
          <div className="mh-hr-meta">
            {data.meta.map(([label, value]) => (
              <span key={label}>
                {label} <b>{value}</b>
              </span>
            ))}
          </div>
        );
      case "chart":
        return (
          <React.Fragment>
            {block.heading ? (
              <div className="mh-hr-h">
                <i>{block.heading.index}</i>
                <strong>{block.heading.title}</strong>
              </div>
            ) : null}
            <div className="mh-hr-h4">{block.sub}</div>
            <p className="mh-hr-note">{block.note}</p>
            <div className="mh-hr-chart">
              <div className="mh-hr-chart-legend">
                {data.chart.series.map((s) => (
                  <span key={s.name}>
                    <i style={{ background: HR_SERIES_TONES[s.tone] }} />
                    {s.name}
                  </span>
                ))}
              </div>
              <HrTrendChart chart={data.chart} />
            </div>
          </React.Fragment>
        );
      case "insight":
        return <HrInsight label={block.label} segments={block.segments} />;
      case "group":
      default:
        return (
          <React.Fragment>
            {block.heading ? (
              <div className="mh-hr-h">
                <i>{block.heading.index}</i>
                <strong>{block.heading.title}</strong>
              </div>
            ) : null}
            {block.sub ? <div className="mh-hr-h4">{block.sub}</div> : null}
            {block.note ? <p className="mh-hr-note">{block.note}</p> : null}
            {block.alerts ? (
              <ul className="mh-hr-alerts">
                {block.alerts.map((item, i) => (
                  <li key={i}>
                    <HrDot kind={item.dot} />
                    <span>
                      <CopilotSegments segments={item.segments} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            {block.table ? <HrTable headers={block.table.headers} rows={block.table.rows} total={block.table.total} /> : null}
            {block.dotLegend ? (
              <p className="mh-hr-note">
                {(data.dotLegend || []).map((item, i) => (
                  <React.Fragment key={i}>
                    <HrDot kind={item.dot} />
                    {item.text}
                    {i < data.dotLegend.length - 1 ? "  " : ""}
                  </React.Fragment>
                ))}
              </p>
            ) : null}
            {block.insight ? <HrInsight label={block.insight.label} segments={block.insight.segments} /> : null}
          </React.Fragment>
        );
    }
  };
  return (
    <div className="mh-holistic" ref={hostRef}>
      {blocks.slice(0, shown).map((block, index) => (
        <StreamBlock key={index} animate={stream}>
          {renderBlock(block, index)}
        </StreamBlock>
      ))}
      {streaming ? <span className="mh-stream-cursor" /> : null}
    </div>
  );
}

function PilotSalesBody({ data, sources, stream = true, trailing, onExplore }) {
  const blocks = [
    <p className="mh-ra-lead" key="lead">
      <CopilotSegments segments={data.lead} />
    </p>,
    <React.Fragment key="channels">
      <div className="mh-ra-divider" />
      <p className="mh-ra-sec-title">{data.channelsTitle}</p>
      <p className="mh-ra-sec-sub">{data.channelsSub}</p>
      <div className="mh-ra-channels">
        {data.channels.map((channel) => (
          <div className="mh-ra-channel" key={channel.name}>
            <div className="mh-ra-ch-head">
              <span className={cx("mh-ra-icon", `mh-ra-icon--${channel.tone}`)}>
                <Icon name={channel.icon} />
              </span>
              <span className="mh-ra-ch-name">{channel.name}</span>
            </div>
            <div className="mh-ra-ch-main">
              <span className={cx("mh-ra-value", channel.up ? "mh-ra-up" : "mh-ra-down")}>
                {channel.uplift}
                <i className="mh-ra-arrow" aria-hidden="true">
                  {channel.up ? "▲" : "▼"}
                </i>
              </span>
            </div>
            <div className="mh-ra-ch-label">Sales uplift</div>
            <div className="mh-ra-ch-stats">
              {channel.stats.map((stat) => (
                <span className="mh-ra-stat" key={stat.label}>
                  <i>{stat.label}</i>
                  <b className={stat.up ? "mh-ra-up" : "mh-ra-down"}>{stat.value}</b>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>,
    <p className="mh-ra-insight" key="insight">
      {data.insight}
    </p>,
    <React.Fragment key="explore">
      <div className="mh-ra-divider" />
      <p className="mh-ra-sec-title">{data.exploreTitle}</p>
      <p className="mh-ra-explore-hint">{data.exploreHint}</p>
      <div className="mh-ra-explore">
        {data.explore.map((option) => (
          <button className="mh-ra-option" type="button" key={option.title} onClick={() => onExplore?.({ question: option.question })}>
            <span className="mh-ra-option-icon">
              <Icon name={option.icon} />
            </span>
            <span>
              <strong>{option.title}</strong>
              <small>{option.sub}</small>
            </span>
          </button>
        ))}
      </div>
    </React.Fragment>,
    <React.Fragment key="sources">
      <div className="mh-ra-divider" />
      <div className="mh-ra-source-line" aria-label="Sources">
        <span className="mh-ra-source-label">Sources used</span>
        {sources.slice(0, 3).map((source) => (
          <span className="mh-ra-source-chip" key={source.id}>
            {source.title}
          </span>
        ))}
      </div>
      {trailing}
    </React.Fragment>,
  ];
  const { hostRef, shown, streaming } = useStream(blocks.length, stream, COPILOT_STREAM_MS.rich, ".mh-copilot__answer");
  return (
    <div className="mh-ra-body" ref={hostRef}>
      {blocks.slice(0, shown).map((block, index) => (
        <StreamBlock key={index} animate={stream}>
          {block}
        </StreamBlock>
      ))}
      {streaming ? <span className="mh-stream-cursor" /> : null}
    </div>
  );
}

function CopilotChatEntry({ entry, stream = true, onChatFeedback, onCopy, onExplore }) {
  const [feedback, setFeedback] = React.useState(null);
  const cardRef = React.useRef(null);
  const entryRef = React.useRef(null);
  React.useEffect(() => {
    entryRef.current?.scrollIntoView({ block: "nearest" });
  }, []);
  const copyCard = () => {
    const text = cardRef.current?.innerText.trim();
    if (text && navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    onCopy?.({ id: entry.id });
  };
  /* data-chat-feedback is a per-card radio: clicking marks, no toggle-off. */
  const pick = (value) => {
    setFeedback(value);
    onChatFeedback?.({ id: entry.id, value });
  };
  const rich = entry.kind === "rich";
  const headCount = rich ? entry.sources.length : entry.sources.slice(0, 3).length;
  const feedbackRow = (
    <div className="mh-copilot__entry-feedback">
      <button
        type="button"
        className="mh-copilot__fb"
        aria-pressed={feedback === "helpful"}
        onClick={() => pick("helpful")}
      >
        <Icon name="thumb-up" />
        <span>Helpful</span>
      </button>
      <button
        type="button"
        className="mh-copilot__fb"
        aria-pressed={feedback === "not-helpful"}
        onClick={() => pick("not-helpful")}
      >
        <Icon name="thumb-down" />
        <span>Not helpful</span>
      </button>
      <button type="button" className="mh-copilot__fb mh-copilot__copy" aria-label="Copy answer" onClick={copyCard}>
        <Icon name="copy" />
        <span>Copy</span>
      </button>
    </div>
  );
  return (
    <article className="mh-copilot__entry" ref={entryRef}>
      <div className="mh-copilot__query">
        <span className="mh-copilot__bubble">{entry.question}</span>
      </div>
      <article className={cx("mh-copilot__card", rich && "mh-copilot__card--rich")} ref={cardRef}>
        <div className="mh-copilot__card-head">
          <span>Connected report view</span>
          <small>{headCount} grounded sources</small>
        </div>
        {rich ? (
          <PilotSalesBody
            data={entry.card}
            sources={entry.sources}
            stream={stream}
            trailing={feedbackRow}
            onExplore={onExplore}
          />
        ) : (
          <React.Fragment>
            <h3>Recommended next move.</h3>
            <p>{entry.summary}</p>
            <div className="mh-copilot__source-line" aria-label="Sources">
              {entry.sources.slice(0, 3).map((source) => (
                <span key={source.id}>{source.title}</span>
              ))}
            </div>
            <div className="mh-copilot__card-actions" aria-label="Related actions">
              <a href={entry.sources[0]?.href || "/assets/pages/knowledge.html"}>Open report context</a>
              <span>Compare movement</span>
              <span>Save learning</span>
            </div>
            {feedbackRow}
          </React.Fragment>
        )}
      </article>
    </article>
  );
}

/** Collapsible workspace section (summary drawer / scenario start view), also used docked in the answer view. */
function CopilotSection({ index, className, heading, chevron = false, extra, collapsed = false, docked = false, onToggle, children }) {
  const headingId = React.useId();
  const toggleFromHeading = (event) => {
    if (event.target.closest("button, a, input, select, textarea")) return;
    onToggle?.();
  };
  /* The original head is a click-only div; role/tabindex add the missing
     keyboard path without changing the visual contract. */
  const keyToggle = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("button, a, input, select, textarea")) return;
    event.preventDefault();
    onToggle?.();
  };
  return (
    <section className={cx("mh-copilot__section", className, docked && "mh-copilot__section--docked")} aria-labelledby={headingId}>
      <div
        className="mh-copilot__section-head"
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        onClick={toggleFromHeading}
        onKeyDown={keyToggle}
      >
        <span className="mh-copilot__section-num">{index}</span>
        <div className="mh-copilot__section-title">
          <h3 id={headingId}>{heading}</h3>
        </div>
        {extra}
        {chevron ? (
          <button
            type="button"
            className="mh-copilot__collapse"
            aria-expanded={!collapsed}
            aria-label={`Toggle ${heading}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggle?.();
            }}
          >
            <i aria-hidden="true">›</i>
          </button>
        ) : null}
      </div>
      <div className={cx("mh-copilot__collapse-content", collapsed && "is-collapsed")}>{children}</div>
    </section>
  );
}

/**
 * Report Copilot workspace: fixed right drawer on the live report view.
 * Start view = AI summary card + scenario recommendations; an open answer or
 * chat exchange swaps in the answer view with context-dock shortcuts. Chat and
 * answer content are controlled props — the host owns the deterministic
 * "AI" simulation (`resolveCopilotAnswer` / `buildCopilotChatEntry`).
 * `stream` controls the progressive reveal used by the holistic report and
 * the rich pilot-sales card (set false for instant render).
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {string} props.title panel title (from the report's assistant profile)
 * @param {string} props.eyebrow eyebrow label over the title
 * @param {{ title: string, status: string, paragraphs: Array<Array<object|string>> }} [props.summary]
 * @param {Array<{ title: string, meta?: string }>} [props.recommendations=[]]
 * @param {string} [props.periodHint=""]
 * @param {Array<{ id: string, title: string, href: string }>} [props.sources=[]]
 * @param {{ kind: "answer"|"holistic", title: string, summary?: string, findings?: Array<{ label: string, text: string> }, report?: object }|null} [props.answer=null] holistic answers carry their data as `report`
 * @param {Array<{ id?: string, kind: "standard"|"rich", question: string, summary?: string, card?: object, sources: Array<object> }>} [props.chat=[]] rich entries carry their card data as `card`
 * @param {string} [props.prompt=""]
 * @param {string} props.commandHint helper line above the composer
 * @param {string} props.inputPlaceholder composer placeholder
 * @param {string} props.answerLabel label over an open answer
 * @param {Array<{ title: string, prompt: string }>} [props.history=[]]
 * @param {object} [props.skillMenu] SkillMenu config; renders the "+" menu when set
 * @param {object} [props.flow] ModelFlowDialog props; renders the flow dialog when set
 * @param {boolean} [props.stream=true]
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onClose]
 * @param {(event: { reason: "back" }) => void} [props.onBack] back to the start/context view
 * @param {(event: { reason: "new-session" }) => void} [props.onNewSession]
 * @param {(event: { expanded: boolean }) => void} [props.onMaximize]
 * @param {(event: { title: string, prompt: string }) => void} [props.onHistorySelect]
 * @param {(event: { index: number }) => void} [props.onRecommendation]
 * @param {(event: { question: string }) => void} [props.onAsk]
 * @param {(event: { value: string }) => void} [props.onPromptChange]
 * @param {(event: { value: "helpful"|"not-helpful" }) => void} [props.onFeedback]
 * @param {(event: { id?: string, value: "helpful"|"not-helpful"|null }) => void} [props.onChatFeedback]
 * @param {(event: { id?: string }) => void} [props.onCopy]
 * @param {(event: { question: string }) => void} [props.onExplore] rich-card explore options fill the input
 * @param {(event: { names: string[] }) => void} [props.onAttach]
 * @param {(event: { id: string, type: string, title: string }) => void} [props.onSelectSkill]
 * @param {(event: { action: "history"|"manual" }) => void} [props.onSkillAction]
 */
export function ReportCopilot({
  open = false,
  title,
  eyebrow,
  summary,
  recommendations = [],
  periodHint = "",
  sources = [],
  answer = null,
  chat = [],
  prompt = "",
  commandHint,
  inputPlaceholder,
  answerLabel,
  history = [],
  skillMenu,
  flow,
  stream = true,
  onClose,
  onBack,
  onNewSession,
  onMaximize,
  onHistorySelect,
  onRecommendation,
  onAsk,
  onPromptChange,
  onFeedback,
  onChatFeedback,
  onCopy,
  onExplore,
  onAttach,
  onSelectSkill,
  onSkillAction,
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [dock, setDock] = React.useState(null);
  const [collapsed, setCollapsed] = React.useState({});
  const [showAll, setShowAll] = React.useState(false);
  const [feedback, setFeedback] = React.useState(null);
  const inputRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const layerRef = React.useRef(null);
  const headActionsRef = React.useRef(null);
  const answerRef = React.useRef(null);
  /* Per-instance stream registry: cards inside this copilot cancel each other
     mid-stream, but a stream in another ReportCopilot is unaffected. */
  const streamRegistry = React.useRef(null);

  const answerOpen = Boolean(answer) || chat.length > 0;
  const chatMode = !answer && chat.length > 0;

  /* closeAi() strips only is-ai-expanded — collapsed sections, the show-all
     list, feedback pressed state, dock and the history popup all persist into
     the next open. */
  React.useEffect(() => {
    if (open) return;
    setExpanded(false);
  }, [open]);

  /* openAi(): focus the close control and lock page scroll (ref-counted
     `dialog-open`). `ai-workspace-expanded` mirrors the demo's body hook so
     host pages can react to the expanded state. */
  useBodyScrollLock(open);
  useFocusRestore(open, layerRef);
  React.useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  React.useEffect(() => {
    document.body.classList.toggle("ai-workspace-expanded", open && expanded);
    return () => document.body.classList.remove("ai-workspace-expanded");
  }, [open, expanded]);

  /* Escape closes the whole workspace (the demo has no popup-level handling). */
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.({ reason: "escape" });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* Recent-chats popup closes on outside click. */
  React.useEffect(() => {
    if (!historyOpen) return undefined;
    const onDocClick = (event) => {
      if (!headActionsRef.current?.contains(event.target)) setHistoryOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [historyOpen]);

  /* New answers reset the answer scroll + feedback (resetAiFeedback). */
  React.useEffect(() => {
    setFeedback(null);
    if (answerRef.current) answerRef.current.scrollTop = 0;
  }, [answer]);

  /* enterAiAnswerMode: docking a panel into the answer view resets whenever a
     fresh answer or the first chat exchange opens — but NOT when a follow-up
     question merely appends to the thread over an open answer. */
  const wasAnswerOpen = React.useRef(false);
  React.useEffect(() => {
    if (answerOpen && !wasAnswerOpen.current) setDock(null);
    wasAnswerOpen.current = answerOpen;
  }, [answerOpen]);
  React.useEffect(() => setDock(null), [answer]);

  const autoGrow = (el) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  /* The composer is host-controlled: external fills (history pick, skill
     select, explore option, submit clear, new session) all resize it. */
  React.useEffect(() => {
    if (inputRef.current) autoGrow(inputRef.current);
  }, [prompt]);

  const fillPrompt = (value) => {
    onPromptChange?.({ value });
    inputRef.current?.focus();
  };

  const newSession = () => {
    setDock(null);
    setShowAll(false);
    setHistoryOpen(false);
    onNewSession?.({ reason: "new-session" });
    onPromptChange?.({ value: "" });
    inputRef.current?.focus();
  };

  const maximize = () => {
    setExpanded((value) => {
      const next = !value;
      onMaximize?.({ expanded: next });
      return next;
    });
  };

  const backToStart = () => {
    setDock(null);
    onBack?.({ reason: "back" });
  };

  const toggleDock = (name) => setDock((current) => (current === name ? null : name));
  const toggleCollapsed = (name) => setCollapsed((current) => ({ ...current, [name]: !current[name] }));

  const submit = (event) => {
    event.preventDefault();
    const question = prompt.trim();
    if (!question) return;
    onAsk?.({ question });
    onPromptChange?.({ value: "" });
  };

  const summarySection = (docked) =>
    summary ? (
      <CopilotSection
        index="01"
        className="mh-copilot__summary"
        heading="AI summary"
        chevron
        docked={docked}
        collapsed={Boolean(collapsed.summary)}
        onToggle={() => toggleCollapsed("summary")}
      >
        <div className="mh-copilot__summary-card">
          <div className="mh-copilot__summary-head">
            <span>{summary.title}</span>
            <i>{summary.status}</i>
          </div>
          <div className="mh-copilot__summary-body">
            {summary.paragraphs.map((segments, index) => (
              <p key={index}>
                {segments.map((segment, segIndex) =>
                  segment.tone ? (
                    <span key={segIndex} className={`mh-copilot__metric mh-copilot__metric--${segment.tone}`}>
                      {segment.text}
                    </span>
                  ) : (
                    <React.Fragment key={segIndex}>{segment.text}</React.Fragment>
                  ),
                )}
              </p>
            ))}
          </div>
        </div>
      </CopilotSection>
    ) : null;

  const startSection = (docked) => (
    <CopilotSection
      index="02"
      className="mh-copilot__start"
      heading="Scenario reports"
      docked={docked}
      collapsed={Boolean(collapsed.scenarios)}
      onToggle={() => toggleCollapsed("scenarios")}
      extra={
        <button
          type="button"
          className="mh-copilot__view-more"
          onClick={(event) => {
            /* Once expanded, the original handler early-returns without
               stopPropagation, so the click bubbles to the collapsible head
               and toggles the section. */
            if (showAll) {
              toggleCollapsed("scenarios");
              return;
            }
            event.stopPropagation();
            setShowAll(true);
          }}
        >
          view more
        </button>
      }
    >
      <div className={cx("mh-copilot__recs", showAll && "is-show-all")}>
        {recommendations.map((rec, index) => (
          <button
            key={index}
            type="button"
            className={cx("mh-copilot__rec", index >= 3 && "mh-copilot__rec--extra")}
            onClick={() => onRecommendation?.({ index })}
          >
            <i className="mh-copilot__rec-index">{`0${index + 1}`}</i>
            <span className="mh-copilot__rec-body">
              <strong>{rec.title}</strong>
            </span>
            <span className="mh-copilot__rec-arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </div>
      <p className="mh-copilot__period-hint">{periodHint}</p>
    </CopilotSection>
  );

  return (
    <CopilotStreamContext.Provider value={streamRegistry}>
      <div className="mh-copilot__scrim" hidden={!open} onClick={() => onClose?.({ reason: "scrim" })} />
      <aside
        ref={layerRef}
        className={cx("mh-copilot", open && "is-open", expanded && "mh-copilot--expanded")}
        aria-hidden={!open}
        aria-label="Report AI workspace"
      >
        <header className="mh-copilot__head">
          <div className="mh-copilot__head-title">
            <span>{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <div className="mh-copilot__head-actions" ref={headActionsRef}>
            <button type="button" className="mh-copilot__icon" aria-label="New session" onClick={newSession}>
              <Icon name="plus" />
            </button>
            <button
              type="button"
              className="mh-copilot__icon"
              aria-label={expanded ? "Restore" : "Maximize"}
              title={expanded ? "Restore" : "Maximize"}
              onClick={maximize}
            >
              <Icon name="expand" />
            </button>
            <button
              type="button"
              className="mh-copilot__icon"
              aria-label="History"
              aria-expanded={historyOpen}
              onClick={(event) => {
                event.stopPropagation();
                setHistoryOpen((value) => !value);
              }}
            >
              <Icon name="history" />
            </button>
            <button ref={closeRef} type="button" className="mh-copilot__close" aria-label="Close AI workspace" onClick={() => onClose?.({ reason: "button" })}>
              ×
            </button>
            {historyOpen ? (
              <div className="mh-copilot__history">
                <div className="mh-copilot__history-head">
                  <strong>Recent Chats</strong>
                  <button type="button" aria-label="Close recent chats" onClick={() => setHistoryOpen(false)}>
                    ×
                  </button>
                </div>
                {history.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className="mh-copilot__history-item"
                    onClick={() => {
                      setHistoryOpen(false);
                      onHistorySelect?.(item);
                      fillPrompt(item.prompt);
                    }}
                  >
                    <strong>{item.title}</strong>
                    <span>{item.prompt}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </header>
        {answerOpen ? (
          <div className="mh-copilot__tools" aria-label="Report context shortcuts">
            <button
              type="button"
              className={cx("mh-copilot__tool", dock === "summary" && "is-active")}
              onClick={() => toggleDock("summary")}
            >
              AI summary
            </button>
            <button
              type="button"
              className={cx("mh-copilot__tool", dock === "scenarios" && "is-active")}
              onClick={() => toggleDock("scenarios")}
            >
              Scenario reports
            </button>
          </div>
        ) : null}
        {!answerOpen ? (
          <React.Fragment>
            {summarySection(false)}
            {startSection(false)}
          </React.Fragment>
        ) : null}
        {answerOpen ? (
          <section className={cx("mh-copilot__answer", chatMode && "is-chat-mode")} aria-live="polite" ref={answerRef}>
            <button type="button" className="mh-copilot__back" onClick={backToStart}>
              <span aria-hidden="true">←</span> Suggested questions
            </button>
            <div className="mh-copilot__dock">
              {dock === "summary" ? summarySection(true) : null}
              {dock === "scenarios" ? startSection(true) : null}
            </div>
            {!chatMode && answer ? (
              <React.Fragment>
                <span className="mh-copilot__answer-label">{answerLabel}</span>
                <h3 className="mh-copilot__answer-title">{answer.title}</h3>
                {answer.kind === "holistic" ? (
                  <HolisticReport data={answer.report} stream={stream} />
                ) : (
                  <React.Fragment>
                    <p className="mh-copilot__answer-summary">{answer.summary}</p>
                    {answer.findings?.length ? (
                      <div className="mh-copilot__findings">
                        {answer.findings.map((finding, index) => (
                          <div className="mh-copilot__finding" key={index}>
                            <span>{`0${index + 1}`}</span>
                            <div>
                              <strong>{finding.label}</strong>
                              <p>{finding.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </React.Fragment>
                )}
                <div className="mh-copilot__sources">
                  <span>Sources used</span>
                  <div>
                    {sources.map((source) => (
                      <a key={source.id} href={source.href}>
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ) : null}
            {chat.length ? (
              <div className="mh-copilot__thread">
                {chat.map((entry, index) => (
                  <CopilotChatEntry
                    key={entry.id || index}
                    entry={entry}
                    stream={stream}
                    onChatFeedback={onChatFeedback}
                    onCopy={onCopy}
                    onExplore={(event) => {
                      fillPrompt(event.question);
                      onExplore?.(event);
                    }}
                  />
                ))}
              </div>
            ) : null}
            {!chatMode && answer ? (
              <div className="mh-copilot__feedback">
                <span>Was this answer helpful?</span>
                <div>
                  <button
                    type="button"
                    aria-pressed={feedback === "helpful"}
                    onClick={() => {
                      setFeedback("helpful");
                      onFeedback?.({ value: "helpful" });
                    }}
                  >
                    Helpful
                  </button>
                  <button
                    type="button"
                    aria-pressed={feedback === "not-helpful"}
                    onClick={() => {
                      setFeedback("not-helpful");
                      onFeedback?.({ value: "not-helpful" });
                    }}
                  >
                    Not helpful
                  </button>
                </div>
                <small className="mh-copilot__feedback-status" hidden={!feedback} aria-live="polite">
                  {feedback === "helpful"
                    ? "Thanks. This answer was marked helpful."
                    : "Thanks. This answer was marked not helpful."}
                </small>
              </div>
            ) : null}
          </section>
        ) : null}
        <form className="mh-copilot__command" onSubmit={submit}>
          <p className="mh-copilot__command-hint">{commandHint}</p>
          <div className="mh-copilot__command-box">
            <TextArea
              ref={inputRef}
              label="Ask the report copilot"
              rows={2}
              required
              placeholder={inputPlaceholder}
              value={prompt}
              onChange={(event) => {
                if (inputRef.current) autoGrow(inputRef.current);
                onPromptChange?.(event);
              }}
            />
            <div className="mh-copilot__command-footer">
              <div className="mh-copilot__command-actions">
                {skillMenu ? (
                  <SkillMenu
                    config={skillMenu}
                    composerRef={inputRef}
                    onAttach={onAttach}
                    onSelectSkill={(event) => {
                      fillPrompt("Use " + event.title + " to interpret this report.");
                      onSelectSkill?.(event);
                    }}
                    onAction={onSkillAction}
                  />
                ) : null}
                <button type="submit" className="mh-copilot__send" aria-label="Send question" disabled={!prompt.trim()}>
                  <span>ASK</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </aside>
      {flow ? <ModelFlowDialog {...flow} /> : null}
    </CopilotStreamContext.Provider>
  );
}
