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
          href={logo.href || "/home"}
          aria-label="Tapestry Marketing Portal home"
          onClick={(event) => {
            event.preventDefault();
            onNavigate?.({ id: "home", href: logo.href || "/home", label: "Home" });
          }}
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

export function WorkspaceCard({ title, description, image, links = [], onOpen, onNavigate }) {
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
              <button key={link.label} type="button" onClick={() => onNavigate?.({ id: link.id, href: link.href, label: link.label })}>
                {link.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <a
        className="mh-workspace-card__open"
        href={title}
        aria-label={`Open ${title}`}
        onClick={(event) => {
          event.preventDefault();
          onOpen?.({ title });
        }}
      />
    </article>
  );
}

export function WorkspaceGrid({ cards = [], onOpen, onNavigate }) {
  return (
    <div className="mh-workspace-grid">
      {cards.map((card) => (
        <WorkspaceCard key={card.title} {...card} onOpen={onOpen} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

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

export function KnowledgeSidebar({ brand = "AI Interpreter", overview, groups = [], onSelect }) {
  return (
    <aside className="mh-sidebar" aria-label="Knowledge navigation">
      <div className="mh-sidebar__brand">{brand}</div>
      {overview ? <SidebarItem {...overview} onSelect={() => onSelect?.({ id: overview.id, label: overview.label })} /> : null}
      {groups.map((group) => (
        <div className="mh-sidebar__group" key={group.title}>
          <div className="mh-sidebar__title">{group.title}</div>
          {group.items.map((item) => (
            <SidebarItem key={item.id} {...item} onSelect={() => onSelect?.({ id: item.id, label: item.label })} />
          ))}
        </div>
      ))}
    </aside>
  );
}

export function TypeCard({ title, count, summary, action, art = 0, active = false, onSelect }) {
  return (
    <button
      className={cx("mh-type-card", active && "is-active")}
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

export function TypeGrid({ items = [], onSelect }) {
  return (
    <div className="mh-type-grid">
      {items.map((item, index) => (
        <TypeCard key={item.id} {...item} art={item.art ?? index} onSelect={() => onSelect?.({ id: item.id, title: item.title })} />
      ))}
    </div>
  );
}

export function LibraryToolbar({ query, onQueryChange, status, statusOptions = [], onStatusChange, actionLabel = "Create New Knowledge", onCreate }) {
  return (
    <div className="mh-toolbar">
      <div className="mh-toolbar__filters">
        <label className="mh-filter">
          Status
          <select className="mh-select mh-select--sm" value={status} aria-label="Status" onChange={(event) => onStatusChange?.({ value: event.target.value })}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mh-toolbar__actions">
        <div style={{ width: 280 }}>
          <SearchField label="Search knowledge" value={query} placeholder="Search knowledge..." size="sm" onChange={onQueryChange} />
        </div>
        <Button variant="gold" size="lg" icon="plus" onClick={onCreate}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

export function AssetRow({ title, summary, type, owner, status, active = false, onSelect }) {
  return (
    <button className={cx("mh-asset", active && "is-active")} type="button" onClick={() => onSelect?.({ title })}>
      <span>
        <strong>{title}</strong>
        <small>{summary}</small>
      </span>
      <span>{type}</span>
      <span>{owner}</span>
      <StatusBadge status={status}>{status}</StatusBadge>
      <span />
    </button>
  );
}

export function KnowledgeLibrary({ query, onQueryChange, status, onStatusChange, rows = [], onCreate, onSelect }) {
  return (
    <section className="mh-library" aria-label="Knowledge library">
      <LibraryToolbar
        query={query}
        status={status}
        statusOptions={["All statuses", "Draft", "Under Review", "Published"]}
        onQueryChange={onQueryChange}
        onStatusChange={onStatusChange}
        onCreate={onCreate}
      />
      <div className="mh-asset-head">
        <span>Knowledge Title</span>
        <span>Type</span>
        <span>Creator</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      {rows.map((row) => (
        <AssetRow key={row.id} {...row} onSelect={() => onSelect?.(row)} />
      ))}
    </section>
  );
}

export function AssistantLauncher({ label = "AI Interpreter", onOpen }) {
  return (
    <button className="mh-launcher" type="button" aria-label="Open AI assistant" onClick={onOpen}>
      <span className="mh-launcher__orb">AI</span>
      <span>{label}</span>
    </button>
  );
}

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
  onClose,
  onPromptChange,
  onSubmit,
  onSuggestion,
  onScopeChange,
  onNewSession,
  onMaximize,
  onHistory,
}) {
  if (!open) return null;
  return (
    <section className={cx("mh-assistant", placement === "drawer" && "mh-assistant--drawer")} role="dialog" aria-modal="true" aria-label={title}>
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
            <button className="mh-assistant__icon" type="button" aria-label="Maximize" onClick={onMaximize}>
              <Icon name="expand" />
            </button>
            <button className="mh-assistant__icon" type="button" aria-label="History" onClick={onHistory}>
              <Icon name="history" />
            </button>
            <button className="mh-assistant__close" type="button" aria-label="Close assistant" onClick={onClose}>
              ×
            </button>
          </div>
        </header>
        <div className="mh-assistant__stage">
          <div>
            <h3>{headline}</h3>
            <p>{description}</p>
          </div>
          <div className="mh-assistant__suggestions">
            {suggestions.map((item) => (
              <Suggestion key={item} onSelect={() => onSuggestion?.({ prompt: item })}>
                {item}
              </Suggestion>
            ))}
          </div>
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
            <TextArea label="Ask AI Interpreter" rows={1} value={prompt} placeholder="Type your question or upload Excel/CSV files for data analysis" onChange={onPromptChange} />
            <div className="mh-assistant__tools">
              {showPicks ? <span className="mh-assistant__pick">{model}</span> : null}
              {showPicks ? <span className="mh-assistant__pick">{mode}</span> : null}
              <span style={{ marginLeft: "auto" }}>
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

export { MetricStat, ProgressList, ColumnChart, DataTable, Tabs, SearchField };
