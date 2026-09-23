import React from "react";
import "./organisms.css";
import { Button, StatusBadge, TextArea } from "./atoms.jsx";
import { cx } from "./cx.js";
import { Icon } from "./icons.jsx";
import {
  CategoryHeading,
  ColumnChart,
  DataTable,
  FormField,
  MetricStat,
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
        {children ? <div className="mh-hero__aside">{children}</div> : null}
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
 * @param {(target: object) => void} [props.onClose]
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
  const [fullscreen, setFullscreen] = React.useState(false);
  const [activeScenario, setActiveScenario] = React.useState(null);
  const [showAll, setShowAll] = React.useState(false);
  React.useEffect(() => {
    setFullscreen(false);
    setActiveScenario(null);
    setShowAll(false);
  }, [resetKey]);
  React.useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    closeRef.current?.focus();
    document.body.classList.add("dialog-open");
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.({});
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("dialog-open");
      document.removeEventListener("keydown", onKey);
      if (previous && previous.isConnected) previous.focus();
    };
  }, [open, resetKey]);
  if (!open) return null;
  return (
    <React.Fragment>
      <div className="mh-details-scrim" onClick={() => onClose?.({})} />
      <aside className={cx("mh-details", fullscreen && "is-fullscreen")} aria-labelledby={titleId}>
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
            <button ref={closeRef} className="mh-details__close" type="button" aria-label="Close report details" onClick={() => onClose?.({})}>
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
 * @param {Array<{ id: string, title: string, icon?: string, manageable?: boolean, stats?: { total: number } }>} [props.types=[]]
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
              count={type.stats?.total}
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
 * Floating corner button that opens the assistant panel.
 * @param {object} props
 * @param {string} [props.label="AI Interpreter"]
 * @param {boolean} [props.hidden=false] mirrors the original `display:none` while the panel is open
 * @param {() => void} [props.onOpen]
 */
export function AssistantLauncher({ label = "AI Interpreter", hidden = false, onOpen }) {
  return (
    <button className="mh-launcher" type="button" aria-label="Open AI assistant" hidden={hidden} onClick={onOpen}>
      <span className="mh-launcher__orb">AI</span>
      <span>{label}</span>
    </button>
  );
}

/**
 * One assistant answer entry: user query bubble plus the grounded answer card
 * with sources, related actions and feedback buttons.
 * @param {object} props
 * @param {{ query: string, kicker?: string, title: string, body: string, sources?: string[], actions?: Array<{ label: string, href?: string }> }} props.answer
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
      <button type="button" aria-pressed={feedback === "helpful"} onClick={() => pick("helpful")}>
        <Icon name="thumb-up" />
        <span>Helpful</span>
      </button>
      <button type="button" aria-pressed={feedback === "not-helpful"} onClick={() => pick("not-helpful")}>
        <Icon name="thumb-down" />
        <span>Not helpful</span>
      </button>
      <button type="button" aria-label="Copy answer" onClick={copy}>
        <Icon name="copy" />
        <span>{copied ? "Copied!" : "Copy"}</span>
      </button>
    </div>
  );
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
 * @param {object} [props.skillMenu] renders the composer "+" skill menu when provided; `{ attachAccept?, categories, searchPlaceholder, emptyLabel, items, historyLabel, manualLabel }`
 * @param {{ id?: string, type: string, title: string }} [props.selectedSkill] chip shown inside the composer when a skill is selected
 * @param {boolean} [props.enterToSubmit=true] false mirrors the lite panel where Enter inserts a newline
 * @param {boolean} [props.hideStageOnAnswers=false] true mirrors the reports panel where the ask stage hides once the feed has entries
 * @param {(event: { names: string[] }) => void} [props.onAttach] fired after "Upload File" picks files
 * @param {(event: { id?: string, type: string, title: string }) => void} [props.onSelectSkill]
 * @param {() => void} [props.onClearSkill]
 * @param {(event: { action: "history"|"manual" }) => void} [props.onSkillAction] model-creation menu entries
 * @param {() => void} [props.onClose]
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
  hideStageOnAnswers = false,
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
  const mainRef = React.useRef(null);
  const promptRef = React.useRef(null);
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  React.useEffect(() => {
    if (!open) {
      setExpanded(false);
      setHistoryOpen(false);
      return undefined;
    }
    const previous = document.activeElement;
    document.body.classList.add("dialog-open");
    const timer = window.setTimeout(() => promptRef.current?.focus(), 80);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("dialog-open");
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKeydown = (event) => {
      if (event.key !== "Escape") return;
      setHistoryOpen(false);
      onCloseRef.current?.();
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

  if (!open) return null;
  return (
    <section
      className={cx("mh-assistant", placement === "drawer" && "mh-assistant--drawer", expanded && "mh-assistant--expanded")}
      aria-label={title}
    >
      <button className="mh-assistant__backdrop" type="button" aria-label="Close assistant" onClick={onClose} />
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
              aria-label={expanded ? "Restore" : "Maximize"}
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
            <button className="mh-assistant__close" type="button" aria-label="Close assistant" onClick={onClose}>
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
              label="Ask AI Interpreter"
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
                <Button variant="gold" size="sm" type="submit" disabled={!String(prompt).trim()}>
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
        aria-label="Choose AI skill"
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
 * @param {() => void} [props.onBack]
 * @param {() => void} [props.onClose]
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
    doneTimer.current = window.setTimeout(() => onClose?.(), 450);
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
          <button type="button" aria-label="Close" onClick={onClose}>
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
            <button type="button" className="mh-flow__btn mh-flow__btn--secondary mh-flow__back" onClick={onBack}>
              {copy.backLabel}
            </button>
          ) : null}
          <button type="button" className="mh-flow__btn mh-flow__btn--secondary" onClick={onClose}>
            {copy.cancelLabel}
          </button>
          {isHistory ? (
            <button type="button" className="mh-flow__btn mh-flow__btn--primary" onClick={generate}>
              {copy.generateLabel}
            </button>
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
 * @param {() => void} [props.onClose]
 */
export function Modal({ open = false, eyebrow, title, children, className, closeLabel = "Close", titleId, variant = "modal", onClose }) {
  const generatedTitleId = React.useId();
  const dialogRef = React.useRef(null);
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;
  React.useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    document.body.classList.add("dialog-open");
    dialogRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
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
    return () => {
      document.body.classList.remove("dialog-open");
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className={cx("mh-modal", variant === "sheet" && "mh-modal--sheet")}>
      <div className="mh-modal__scrim" onClick={onClose} />
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
          <button type="button" className="mh-modal__close" aria-label={closeLabel} onClick={onClose}>
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
 * @param {() => void} [props.onClose]
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
