import React from "react";
import "./molecules.css";
import { Button, Select, TextArea, TextInput } from "./atoms.jsx";
import { cx } from "./cx.js";
import { Icon } from "./icons.jsx";

export function SearchField({
  label = "Search",
  name,
  value,
  placeholder = "Search",
  size = "md",
  variant = "field",
  onChange,
}) {
  return (
    <label className={cx("mh-search", variant === "plain" && "mh-search--plain")}>
      <span className="mh-sr">{label}</span>
      <Icon name="search" className="mh-search__icon" />
      <TextInput name={name} type="search" size={size} value={value} placeholder={placeholder} label={label} onChange={onChange} />
    </label>
  );
}

export function MetricStat({ label, value, caption, variant = "card", accent = "gold" }) {
  return (
    <article className={cx("mh-metric", `mh-metric--${variant}`, variant === "card" && `mh-metric--${accent}`)}>
      <span className="mh-metric__label">{label}</span>
      <strong className="mh-metric__value">{value}</strong>
      {caption ? <small className="mh-metric__caption">{caption}</small> : null}
    </article>
  );
}

export function SectionHeading({ eyebrow, title, description, as = "h2" }) {
  const Title = as;
  return (
    <header className={cx("mh-heading", !description && "mh-heading--stack")}>
      <div>
        {eyebrow ? <p className="mh-heading__kicker">{eyebrow}</p> : null}
        <Title>{title}</Title>
      </div>
      {description ? <p className="mh-heading__text">{description}</p> : null}
    </header>
  );
}

export function CategoryHeading({ title }) {
  return (
    <header className="mh-category">
      <h2>{title}</h2>
    </header>
  );
}

export function ViewHeading({ eyebrow, title, description, children }) {
  return (
    <header className="mh-view-heading">
      <div>
        {eyebrow ? <p className="mh-view-heading__kicker">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </header>
  );
}

export function Tabs({ label, items = [], value, variant = "underline", onChange }) {
  return (
    <div className={cx("mh-tabs", variant === "segmented" && "mh-tabs--segmented")} role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          className={cx("mh-tabs__tab", item.id === value && "is-active")}
          type="button"
          role="tab"
          aria-selected={item.id === value}
          disabled={item.disabled}
          onClick={() => onChange?.({ id: item.id, label: item.label })}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function FormField({
  label,
  name,
  control = "text",
  required = false,
  invalid = false,
  hint,
  value,
  placeholder,
  options,
  rows,
  onChange,
}) {
  return (
    <label className={cx("mh-field", invalid && "is-invalid")}>
      <span>
        {label}
        {required ? <i className="mh-field__required"> *</i> : null}
      </span>
      {control === "textarea" ? (
        <TextArea name={name} value={value} placeholder={placeholder} rows={rows} invalid={invalid} onChange={onChange} />
      ) : control === "select" ? (
        <Select name={name} value={value} options={options} placeholder={placeholder} invalid={invalid} onChange={onChange} />
      ) : (
        <TextInput name={name} value={value} placeholder={placeholder} invalid={invalid} onChange={onChange} />
      )}
      {hint ? <small className="mh-field__hint">{hint}</small> : null}
    </label>
  );
}

export function Suggestion({ children, onSelect }) {
  return (
    <button className="mh-suggestion" type="button" onClick={() => onSelect?.({ label: children })}>
      {children}
    </button>
  );
}

export function ScopeOption({ label, pressed = false, onChange }) {
  return (
    <button
      className={cx("mh-scope", pressed && "is-active")}
      type="button"
      aria-pressed={pressed}
      onClick={() => onChange?.({ label, pressed: !pressed })}
    >
      {label}
    </button>
  );
}

export function ProgressList({ items = [] }) {
  return (
    <div className="mh-progress">
      {items.map((item) => (
        <div className="mh-progress__row" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <i className="mh-progress__track">
            <b className="mh-progress__bar" style={{ width: `${item.percent}%` }} />
          </i>
        </div>
      ))}
    </div>
  );
}

export function ColumnChart({ label = "Chart", items = [] }) {
  return (
    <div className="mh-columns" aria-label={label}>
      {items.map((item) => (
        <div className="mh-columns__item" key={item.label} style={{ "--mh-column": `${item.height}%` }}>
          <strong>{item.value}</strong>
          <i />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function DataTable({ columns = [], rows = [], caption, onRowClick }) {
  return (
    <div className="mh-table-wrap">
      <table className="mh-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index} onClick={onRowClick ? () => onRowClick(row) : undefined}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption ? <p className="mh-table__note">{caption}</p> : null}
    </div>
  );
}

export function SidebarItem({ label, active = false, badge, count, onSelect }) {
  return (
    <button className={cx("mh-sidebar-item", active && "is-active")} type="button" aria-current={active ? "page" : undefined} onClick={() => onSelect?.({ label })}>
      <span className="mh-sidebar-item__label">{label}</span>
      {badge ? <span className="mh-sidebar-item__badge">{badge}</span> : null}
      {count !== undefined && count !== null && !badge ? <span className="mh-sidebar-item__count">{count}</span> : null}
    </button>
  );
}

export function FilterActions({ onSubmit, onReset, submitLabel = "Filter", resetLabel = "Reset" }) {
  return (
    <>
      <Button variant="primary" size="sm" type="submit" onClick={onSubmit}>
        {submitLabel}
      </Button>
      <Button variant="secondary" size="sm" onClick={onReset}>
        {resetLabel}
      </Button>
    </>
  );
}
