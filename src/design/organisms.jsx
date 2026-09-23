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
 * Cockpit project card with image opener and action button.
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.kicker]
 * @param {string} [props.description]
 * @param {string} [props.image]
 * @param {string} [props.updated]
 * @param {string} [props.actionLabel="View Dashboards"]
 * @param {(target: { title: string, id?: string }) => void} [props.onOpen]
 */
export function ProjectCard({ title, kicker, description, image, updated, actionLabel = "View Dashboards", onOpen }) {
  return (
    <article className="mh-project-card">
      <button className="mh-project-card__image" type="button" aria-label={`View ${title} reports`} onClick={() => onOpen?.({ title })}>
        <img src={image} alt="" />
      </button>
      <div className="mh-project-card__body">
        <span className="mh-project-card__kicker">{kicker}</span>
        <h3>
          <button className="mh-project-card__title" type="button" onClick={() => onOpen?.({ title })}>
            {title}
          </button>
        </h3>
        <p>{description}</p>
        <div className="mh-project-card__footer">
          <span>{updated}</span>
          <Button variant="gold" size="sm" onClick={() => onOpen?.({ title })}>
            {actionLabel}
            <span className="mh-project-card__arrow" aria-hidden="true">
              →
            </span>
          </Button>
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
        <section key={group.id} className="mh-catalog__group">
          <CategoryHeading title={group.title} />
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
 * Self-Service entry card with a single action.
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.actionLabel]
 * @param {(target: { title: string }) => void} [props.onOpen]
 */
export function ActionCard({ title, description, actionLabel, onOpen }) {
  return (
    <article className="mh-action-card">
      <div className="mh-action-card__copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Button variant="gold" size="md" onClick={() => onOpen?.({ title })}>
        {actionLabel}
      </Button>
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
 * @param {() => void} [props.onOpen]
 */
export function AssistantLauncher({ label = "AI Interpreter", onOpen }) {
  return (
    <button className="mh-launcher" type="button" aria-label="Open AI assistant" onClick={onOpen}>
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
  const pick = (kind) => {
    const next = feedback === kind ? null : kind;
    setFeedback(next);
    onFeedback?.({ query: answer.query, feedback: next });
  };
  const copy = () => {
    const text = [answer.query, answer.title, answer.body].filter(Boolean).join("\n");
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
    onFeedback?.({ query: answer.query, feedback: "copy" });
  };
  return (
    <div className="mh-assistant__entry">
      <div className="mh-assistant__query">
        <span className="mh-assistant__bubble">{answer.query}</span>
      </div>
      <article className="mh-assistant__answer">
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
 * @param {Array<object>} [props.answers=[]] AssistantAnswer entries, oldest first
 * @param {Array<{ id?: string, label: string, prompt: string }>} [props.history=[]] recent prompts in the history popover
 * @param {React.ReactNode} [props.historyCount] e.g. "(121)"
 * @param {() => void} [props.onClose]
 * @param {(event: { name: string, value: string }) => void} [props.onPromptChange]
 * @param {(event: { prompt: string, scope?: string, model: string, mode: string }) => void} [props.onSubmit]
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
  historyCount,
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
  const [expanded, setExpanded] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const mainRef = React.useRef(null);
  const promptRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const timer = window.setTimeout(() => promptRef.current?.focus(), 80);
    return () => {
      window.clearTimeout(timer);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKeydown = (event) => {
      if (event.key !== "Escape") return;
      if (historyOpen) setHistoryOpen(false);
      else onClose?.();
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [open, historyOpen, onClose]);

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
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button className="mh-assistant__backdrop" type="button" aria-label="Close assistant" onClick={onClose} />
      <div className="mh-assistant__dialog">
        <header className="mh-assistant__header">
          <div className="mh-assistant__identity">
            <span className="mh-assistant__mark">AI</span>
            <h2>{title}</h2>
          </div>
          <div className="mh-assistant__actions">
            <button className="mh-assistant__icon" type="button" aria-label="New session" onClick={onNewSession}>
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
                      Recent <span className="mh-assistant__history-count">{historyCount}</span>
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
                        }}
                      >
                        {item.label}
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
          <div className="mh-assistant__stage">
            <div>
              <h3>{headline}</h3>
              <p>{description}</p>
            </div>
            <div className="mh-assistant__suggestions">
              {suggestions.map((item) => {
                const suggestion = typeof item === "string" ? { label: item, prompt: item } : item;
                return (
                  <Suggestion key={suggestion.label} onSelect={() => onSuggestion?.({ prompt: suggestion.prompt })}>
                    {suggestion.label}
                  </Suggestion>
                );
              })}
            </div>
          </div>
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
            onSubmit?.({ prompt, scope, model, mode });
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
            <TextArea label="Ask AI Interpreter" rows={1} value={prompt} placeholder="Type your question or upload Excel/CSV files for data analysis" onChange={onPromptChange} ref={promptRef} />
            <div className="mh-assistant__tools">
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

