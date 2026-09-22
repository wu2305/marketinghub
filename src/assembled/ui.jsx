import React from "react";
import { usePortalActions } from "./actions.jsx";
import { textFrom, toReactProps } from "./props.js";

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const DROP_BLANK = new Set(["table", "thead", "tbody", "tfoot", "tr", "select"]);

export function markupProps(props = {}) {
  if (!props || !Object.prototype.hasOwnProperty.call(props, "children")) return props || {};
  const { children, ...rest } = props;
  return { ...rest, nodes: children };
}

function optionValue(option) {
  if (option.attrs && Object.prototype.hasOwnProperty.call(option.attrs, "value")) return option.attrs.value;
  return textFrom(option.children);
}

function applySelectedDefault(props, nodes) {
  if (Object.prototype.hasOwnProperty.call(props, "value") || Object.prototype.hasOwnProperty.call(props, "defaultValue")) return;
  const selected = (nodes || []).filter((node) => node?.kind === "el" && node.tag === "option" && node.attrs && Object.prototype.hasOwnProperty.call(node.attrs, "selected")).at(-1);
  if (selected) props.defaultValue = optionValue(selected);
}

export function Nodes({ nodes, parent }) {
  if (!nodes?.length) return null;
  const list = DROP_BLANK.has(parent) ? nodes.filter((node) => !(node?.kind === "text" && !String(node.value).trim())) : nodes;
  if (!list.length) return null;
  return list.map((node, index) => <Node key={index} node={node} />);
}

export function Node({ node }) {
  if (!node) return null;
  if (node.kind === "text") return node.value;
  if (node.kind === "comp") {
    const Component = COMPONENTS[node.name];
    if (!Component) return null;
    return <Component {...markupProps(node.props)} />;
  }
  if (node.kind === "el") {
    const Tag = node.tag;
    const props = toReactProps(node.attrs);
    if (VOID.has(node.tag)) return <Tag {...props} />;
    if (node.tag === "option") {
      delete props.selected;
      const complex = (node.children || []).some((child) => child && child.kind !== "text");
      if (!complex) return <option {...props}>{textFrom(node.children)}</option>;
    }
    if (node.tag === "textarea") {
      const text = textFrom(node.children);
      delete props.value;
      return <textarea {...props} {...(String(text).trim() ? { defaultValue: text } : {})} />;
    }
    if (node.tag === "select") applySelectedDefault(props, node.children);
    return (
      <Tag {...props}>
        <Nodes nodes={node.children} parent={node.tag} />
      </Tag>
    );
  }
  return null;
}

function clickLabel(nodes) {
  return textFrom(nodes).replace(/\s+/g, " ").trim();
}

export function Button({ attrs = {}, nodes = [], onClick }) {
  const actions = usePortalActions();
  return (
    <button
      {...toReactProps(attrs)}
      onClick={(event) => (onClick || actions.onClick)?.({ id: attrs.id || "", label: event.currentTarget.textContent.replace(/\s+/g, " ").trim() })}
    >
      <Nodes nodes={nodes} />
    </button>
  );
}

export function Link({ attrs = {}, nodes = [], onNavigate }) {
  const actions = usePortalActions();
  return (
    <a
      {...toReactProps(attrs)}
      onClick={() => (onNavigate || actions.onNavigate)?.({ href: attrs.href || "", label: clickLabel(nodes) })}
    >
      <Nodes nodes={nodes} />
    </a>
  );
}

export function TextInput({ attrs = {}, onChange }) {
  const actions = usePortalActions();
  const props = toReactProps(attrs);
  const checkable = props.type === "checkbox" || props.type === "radio";
  const report = (event) =>
    (onChange || actions.onChange)?.({
      name: attrs.name || attrs.id || attrs["aria-label"] || "",
      value: event.target.value,
      checked: event.target.checked,
    });
  if (checkable) {
    const checked = Object.prototype.hasOwnProperty.call(attrs, "checked");
    delete props.checked;
    return <input {...props} {...(checked ? { defaultChecked: true } : {})} onChange={report} />;
  }
  const hasValue = Object.prototype.hasOwnProperty.call(attrs, "value");
  const value = props.value;
  delete props.value;
  return <input {...props} {...(hasValue ? { defaultValue: value } : {})} onChange={report} />;
}

export function TextArea({ attrs = {}, nodes = [], onChange }) {
  const actions = usePortalActions();
  const props = toReactProps(attrs);
  delete props.value;
  const text = textFrom(nodes);
  return (
    <textarea
      {...props}
      {...(text ? { defaultValue: text } : {})}
      onChange={(event) => (onChange || actions.onChange)?.({ name: attrs.name || attrs.id || "", value: event.target.value })}
    />
  );
}

export function Select({ attrs = {}, nodes = [], onChange }) {
  const actions = usePortalActions();
  const props = toReactProps(attrs);
  delete props.value;
  applySelectedDefault(props, nodes);
  return (
    <select
      {...props}
      onChange={(event) => (onChange || actions.onChange)?.({ name: attrs.name || attrs.id || "", value: event.target.value })}
    >
      <Nodes nodes={nodes} parent="select" />
    </select>
  );
}

export function StatusBadge({ className = "v20-status", status = "", text = "" }) {
  return (
    <span className={className} {...(status ? { "data-status": status } : {})}>
      {text}
    </span>
  );
}

export function Suggestion({ attrs = {}, label, onSelect }) {
  const actions = usePortalActions();
  return (
    <button
      {...toReactProps(attrs)}
      onClick={() => (onSelect || actions.onSelect)?.({ prompt: attrs["data-prompt"] || label, label })}
    >
      {label}
    </button>
  );
}

export function ScopeOption({ attrs = {}, label, onChange }) {
  const actions = usePortalActions();
  return (
    <button
      {...toReactProps(attrs)}
      onClick={() => (onChange || actions.onChange)?.({ scope: attrs["data-context"] || "", label })}
    >
      {label}
    </button>
  );
}

export function Signal({ label, value, valueId = "", caption }) {
  return (
    <article className="home-signal">
      <div className="home-signal-body">
        <span>{label}</span>
        <strong id={valueId || undefined}>{value}</strong>
        <small>{caption}</small>
      </div>
    </article>
  );
}

export function HeroStat({ label, value, caption }) {
  return (
    <article className="knowledge-hero-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{caption}</small>
    </article>
  );
}

export function SearchField({ className, label = "", icon = null, input = {}, onChange }) {
  return (
    <label className={className}>
      {label ? <span className="sr-only">{label}</span> : null}
      {icon ? <Node node={icon} /> : null}
      <TextInput attrs={input} onChange={onChange} />
    </label>
  );
}

export function SidebarItem({ attrs = {}, icon, label, count = "", countId = "", onSelect }) {
  const actions = usePortalActions();
  return (
    <a {...toReactProps(attrs)} onClick={() => (onSelect || actions.onSelect)?.({ href: attrs.href || "", label })}>
      <span className="sidebar-icon" aria-hidden="true">
        <Node node={icon} />
      </span>
      <span className="sidebar-label">{label}</span>
      {count !== "" ? (
        <strong className="sidebar-count" id={countId || undefined}>
          {count}
        </strong>
      ) : null}
    </a>
  );
}

export function Breadcrumb({ className, ariaLabel = "", items = [], onNavigate }) {
  const actions = usePortalActions();
  const pieces = [];
  items.forEach((item, index) => {
    if (index > 0) pieces.push(<span key={`sep-${index}`}>/</span>);
    if (item.current) {
      const Tag = item.tag || "b";
      pieces.push(
        <Tag key={`item-${index}`} id={item.id || undefined}>
          {item.label}
        </Tag>,
      );
    } else {
      pieces.push(
        <a
          key={`item-${index}`}
          href={item.href}
          onClick={() => (onNavigate || actions.onNavigate)?.({ href: item.href, label: item.label })}
        >
          {item.label}
        </a>,
      );
    }
  });
  return (
    <div className={className} aria-label={ariaLabel || undefined}>
      {pieces}
    </div>
  );
}

export function AddButton({ attrs = {}, nodes = [], onClick }) {
  const actions = usePortalActions();
  const Tag = Object.prototype.hasOwnProperty.call(attrs, "href") ? "a" : "button";
  return (
    <Tag
      {...toReactProps(attrs)}
      onClick={() => (onClick || actions.onClick)?.({ href: attrs.href || "", label: clickLabel(nodes) })}
    >
      <Nodes nodes={nodes} />
    </Tag>
  );
}

export function SectionHeading({ kicker, title, titleId = "", description = "" }) {
  return (
    <header className="home-section-heading">
      <div>
        <span>{kicker}</span>
        <h2 id={titleId || undefined}>{title}</h2>
      </div>
      {description ? <p>{description}</p> : null}
    </header>
  );
}

export function WorkspaceCard({
  className,
  image,
  imageAlt = "",
  title,
  description = "",
  linksLabel = "",
  links = [],
  openHref = "",
  openLabel = "",
  onOpen,
  onNavigate,
}) {
  const actions = usePortalActions();
  return (
    <article className={className}>
      <div className="workspace-card-image">
        <img src={image} alt={imageAlt} />
      </div>
      <div className="workspace-card-body">
        <header className="workspace-card-heading">
          <div>
            <h3>{title}</h3>
          </div>
        </header>
        {description ? <p className="workspace-description">{description}</p> : null}
        {links.length ? (
          <div className="workspace-links" aria-label={linksLabel || undefined}>
            {links.map((link) => (
              <a
                key={`${link.href}-${link.label}`}
                href={link.href}
                onClick={() => (onNavigate || actions.onNavigate)?.({ href: link.href, label: link.label })}
              >
                <span className="ws-link-icon">
                  <Node node={link.icon} />
                </span>
                <span>{link.label}</span>
                <b aria-hidden="true">→</b>
              </a>
            ))}
          </div>
        ) : null}
      </div>
      {openHref ? (
        <a
          className="workspace-card-link"
          href={openHref}
          aria-label={openLabel || undefined}
          onClick={() => (onOpen || actions.onOpen)?.({ href: openHref, label: openLabel })}
        />
      ) : null}
    </article>
  );
}

export function SiteHeader({ logoHref, logoSrc, logoAlt = "", logoLabel = "", navLabel = "", items = [], onNavigate }) {
  const actions = usePortalActions();
  const navigate = onNavigate || actions.onNavigate;
  return (
    <header className="site-header">
      <nav className="primary-nav" aria-label={navLabel || undefined}>
        <a href={logoHref} className="brand-mark" aria-label={logoLabel || undefined} onClick={() => navigate?.({ href: logoHref, label: logoAlt || "Home" })}>
          <img src={logoSrc} alt={logoAlt} />
        </a>
        <div className="nav-links">
          {items.map((item) => (
            <a
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={item.className || "nav-link"}
              aria-current={item.current ? "page" : undefined}
              onClick={() => navigate?.({ href: item.href, label: item.label })}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function WorkspaceHeader({ logoHref, logoSrc, logoAlt = "", logoLabel = "", navLabel = "", items = [], onNavigate }) {
  const actions = usePortalActions();
  const navigate = onNavigate || actions.onNavigate;
  return (
    <header className="workspace-header">
      <a className="brand" href={logoHref} aria-label={logoLabel || undefined} onClick={() => navigate?.({ href: logoHref, label: logoAlt || "Home" })}>
        <img src={logoSrc} alt={logoAlt} />
      </a>
      <nav aria-label={navLabel || undefined}>
        {items.map((item) => (
          <a key={`${item.href}-${item.label}`} href={item.href} onClick={() => navigate?.({ href: item.href, label: item.label })}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export function WorkspaceGrid({ cards = [], onOpen, onNavigate }) {
  return (
    <div className="workspace-card-grid">
      {cards.map((card) => (
        <WorkspaceCard key={card.title} {...card} onOpen={onOpen} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

export function CommandHero({
  className,
  labelledBy,
  image,
  imageAlt = "",
  eyebrow = "",
  title,
  titleId = "",
  description,
  accent = false,
  metricsLabel = "",
  statsLabel = "",
  signals = null,
  stats = null,
}) {
  return (
    <section className={className} aria-labelledby={labelledBy || undefined}>
      <div className="home-command-hero" aria-hidden="true">
        <img src={image} alt={imageAlt} />
        <div className="home-command-hero-overlay"></div>
      </div>
      <div className="home-command-layout">
        <div className="home-command-copy">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 id={titleId || undefined}>{title}</h1>
          <p>{description}</p>
          {accent ? <span className="knowledge-hero-accent" aria-hidden="true"></span> : null}
        </div>
        {signals ? (
          <section className="home-metrics" aria-label={metricsLabel || undefined}>
            <div className="home-signal-grid">
              {signals.map((signal) => (
                <Signal key={signal.label} {...signal} />
              ))}
            </div>
          </section>
        ) : (
          <div className="knowledge-hero-stats" aria-label={statsLabel || undefined}>
            {(stats || []).map((stat) => (
              <HeroStat key={stat.label} {...stat} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function KnowledgeSidebar({ ariaLabel = "", navLabel = "", nodes = [] }) {
  return (
    <aside className="knowledge-sidebar" aria-label={ariaLabel || undefined}>
      <nav className="sidebar-nav" aria-label={navLabel || undefined}>
        <Nodes nodes={nodes} />
      </nav>
    </aside>
  );
}

export function LibraryToolbar({ attrs = {}, nodes = [] }) {
  return (
    <header {...toReactProps(attrs)}>
      <Nodes nodes={nodes} />
    </header>
  );
}

export function PageHead({ breadcrumb, eyebrow, title, titleId = "", description = "", status, onNavigate }) {
  return (
    <header className="v20-page-head">
      <div>
        {breadcrumb ? <Breadcrumb {...breadcrumb} onNavigate={onNavigate} /> : null}
        {eyebrow ? <p className="v20-eyebrow">{eyebrow}</p> : null}
        <h1 id={titleId || undefined}>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {status ? <StatusBadge {...status} /> : null}
    </header>
  );
}

export function AiLauncher({ attrs = {}, orb = "AI", label = "AI Interpreter", onOpen }) {
  const actions = usePortalActions();
  return (
    <button {...toReactProps(attrs)} onClick={() => (onOpen || actions.onOpen)?.({ label })}>
      <span className="global-ai-orb" aria-hidden="true">
        {orb}
      </span>
      <span className="global-ai-label">{label}</span>
    </button>
  );
}

export function AssistantPanel({ attrs = {}, nodes = [] }) {
  return (
    <section {...toReactProps(attrs)}>
      <Nodes nodes={nodes} />
    </section>
  );
}

export function ManagementRules({
  title = "Operation Reminder",
  rules = [
    "Only knowledge created by you can be managed.",
    "Disable knowledge before editing or deleting it.",
    "Deletion is permanent and cannot be undone.",
    "Disabled knowledge is unavailable for AI use and can be enabled again.",
  ],
}) {
  return (
    <div className="knowledge-management-rules">
      <button className="knowledge-management-rules-trigger" type="button" aria-label="Management rules" aria-describedby="knowledgeManagementRulesTooltip">
        !
      </button>
      <section className="knowledge-management-rules-tooltip" id="knowledgeManagementRulesTooltip" role="tooltip">
        <h3>{title}</h3>
        <ol>
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export function OperationReminder({ children }) {
  return (
    <p className="knowledge-operation-reminder">
      <span aria-hidden="true">i</span>
      <span>{children}</span>
    </p>
  );
}

export function FormActions({ variant = "term", onCancel, onSave, onSubmit }) {
  const actions = usePortalActions();
  const cancel = onCancel || actions.onCancel;
  const save = onSave || actions.onSave;
  const submit = onSubmit || actions.onSubmit;
  if (variant === "model") {
    return (
      <footer className="fm-editor-footer">
        <div>
          <button className="fm-button" type="button" id="fmCancel" onClick={() => cancel?.({ action: "cancel" })}>
            Cancel
          </button>
          <button className="fm-button" type="button" id="fmSave" onClick={() => save?.({ action: "save", status: "Disable", stage: "Draft" })}>
            Save
          </button>
          <button className="fm-button primary" type="submit" onClick={() => submit?.({ action: "submit", stage: "Published" })}>
            Submit
          </button>
        </div>
      </footer>
    );
  }
  return (
    <div className="bt-form-actions">
      <button type="button" id="cancelBtn" onClick={() => cancel?.({ action: "cancel" })}>
        Cancel
      </button>
      <button type="button" id="saveBtn" onClick={() => save?.({ action: "save", status: "Disable", stage: "Draft" })}>
        Save
      </button>
      <button type="submit" className="primary" onClick={() => submit?.({ action: "submit", status: "Enable", stage: "Published" })}>
        Submit
      </button>
    </div>
  );
}

export function FormField({
  className = "fm-field",
  label,
  required = false,
  control = "input",
  name,
  value = "",
  placeholder = "",
  options = [],
  invalid = false,
  error = "This field is required.",
  onChange,
}) {
  const actions = usePortalActions();
  const fieldClass = [className, invalid ? "is-invalid" : ""].filter(Boolean).join(" ");
  const report = (next) => (onChange || actions.onChange)?.({ name, value: next });
  let editor = (
    <input
      name={name}
      value={value}
      placeholder={placeholder}
      required={required || undefined}
      aria-required={required || undefined}
      onChange={(event) => report(event.target.value)}
    />
  );
  if (control === "textarea") {
    editor = (
      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        required={required || undefined}
        aria-required={required || undefined}
        onChange={(event) => report(event.target.value)}
      />
    );
  }
  if (control === "select") {
    editor = (
      <select name={name} value={value} required={required || undefined} onChange={(event) => report(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
  return (
    <label className={fieldClass}>
      <span>
        {label}
        {required ? (
          <>
            {" "}
            <i className="unified-required" aria-hidden="true">
              *
            </i>
          </>
        ) : null}
      </span>
      {editor}
      {invalid ? <span className="fm-field-error">{error}</span> : null}
    </label>
  );
}

const MENU_ICON = {
  kind: "el",
  tag: "svg",
  attrs: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2" },
  children: [
    { kind: "el", tag: "circle", attrs: { cx: "12", cy: "5", r: "1.5", fill: "currentColor", stroke: "none" }, children: [] },
    { kind: "el", tag: "circle", attrs: { cx: "12", cy: "12", r: "1.5", fill: "currentColor", stroke: "none" }, children: [] },
    { kind: "el", tag: "circle", attrs: { cx: "12", cy: "19", r: "1.5", fill: "currentColor", stroke: "none" }, children: [] },
  ],
};

export function AssetRow({
  id = "",
  mark = "",
  title = "",
  summary = "",
  type = "",
  scope = "",
  owner = "",
  status = "Draft",
  usage = "",
  created = "",
  active = false,
  menuOpen = false,
  onSelect,
  onAction,
}) {
  const actions = usePortalActions();
  return (
    <button
      className={`asset-row${active ? " active" : ""}`}
      type="button"
      data-asset-id={id}
      aria-pressed={active ? "true" : "false"}
      onClick={() => (onSelect || actions.onSelect)?.({ id, title })}
    >
      <span className="asset-main">
        <span className="asset-mark">{mark}</span>
        <span className="asset-copy">
          <strong>{title}</strong>
          <small>{summary}</small>
        </span>
      </span>
      <span className="asset-type-badge" data-type={type}>
        {type}
      </span>
      <span className="asset-scope">{scope}</span>
      <span className="asset-owner">{owner}</span>
      <span className="asset-status" data-status={status}>
        {status}
      </span>
      <span className="asset-usage">{usage}</span>
      <span className="asset-created">{created}</span>
      <span className="asset-actions">
        <div className="asset-actions-dropdown">
          <span
            className="asset-actions-btn"
            role="button"
            tabIndex={0}
            aria-label="More actions"
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : "false"}
            onClick={(event) => {
              event.stopPropagation();
              (onAction || actions.onClick)?.({ id, action: "menu", open: !menuOpen });
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              event.stopPropagation();
              (onAction || actions.onClick)?.({ id, action: "menu", open: !menuOpen });
            }}
          >
            <Node node={MENU_ICON} />
          </span>
          <div className="asset-actions-menu" role="menu" aria-label="Asset actions" hidden={menuOpen ? undefined : true}>
            {["Edit", "Disable", "Delete", "View versions"].map((action) => (
              <span
                key={action}
                className="asset-menu-item"
                role="menuitem"
                tabIndex={0}
                data-action={action === "View versions" ? "versions" : action.toLowerCase()}
                onClick={(event) => {
                  event.stopPropagation();
                  (onAction || actions.onClick)?.({ id, action: action === "View versions" ? "versions" : action.toLowerCase() });
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  event.stopPropagation();
                  (onAction || actions.onClick)?.({ id, action: action === "View versions" ? "versions" : action.toLowerCase() });
                }}
              >
                <span className="asset-menu-label">{action}</span>
              </span>
            ))}
          </div>
        </div>
      </span>
    </button>
  );
}

export function TypeStatCard({ type, label, count, active = false, onSelect }) {
  const actions = usePortalActions();
  return (
    <div
      className={`type-stat-card${active ? " active" : ""}`}
      data-type={type}
      onClick={() => (onSelect || actions.onSelect)?.({ type, label })}
    >
      <div className="type-stat-icon" aria-hidden="true"></div>
      <div className="type-stat-body">
        <strong>{count}</strong>
        <span className="type-stat-label">{label}</span>
      </div>
    </div>
  );
}

const COMPONENTS = {
  SiteHeader,
  WorkspaceHeader,
  CommandHero,
  WorkspaceGrid,
  WorkspaceCard,
  SectionHeading,
  AssistantPanel,
  KnowledgeSidebar,
  LibraryToolbar,
  PageHead,
  AiLauncher,
  Signal,
  HeroStat,
  SearchField,
  SidebarItem,
  Breadcrumb,
  StatusBadge,
  AddButton,
  Suggestion,
  ScopeOption,
  Button,
  Link,
  TextInput,
  TextArea,
  Select,
};
