import React from "react";
import "./molecules.css";
import { Button, Select, TextArea, TextInput } from "./atoms.jsx";
import { cx } from "./cx.js";
import { Icon } from "./icons.jsx";

export const searchIconPositions = ["start", "end", "none"];
export const metricStatVariants = ["card", "glass"];
export const metricStatAccents = ["gold", "green", "amber", "blue", "red"];
export const tabsVariants = ["underline", "segmented"];

/**
 * Labeled search input with an icon that can lead, trail, or be omitted.
 * @param {object} props
 * @param {string} [props.label="Search"] accessible label
 * @param {string} [props.name]
 * @param {string} [props.value] pass to control the field
 * @param {string} [props.placeholder="Search"]
 * @param {"sm"|"md"|"lg"} [props.size="md"]
 * @param {"field"|"plain"} [props.variant="field"] plain = the original `.overview-global-search` gold pill
 * @param {typeof searchIconPositions[number]} [props.icon="start"]
 * @param {React.Ref<HTMLInputElement>} [props.inputRef] forwarded to the input
 * @param {(event: { name: string, value: string }) => void} [props.onChange]
 */
export function SearchField({
  label = "Search",
  name,
  value,
  placeholder = "Search",
  size = "md",
  variant = "field",
  icon = "start",
  inputRef,
  onChange,
}) {
  return (
    <label className={cx("mh-search", variant === "plain" && "mh-search--plain", icon === "end" && "mh-search--end", icon === "none" && "mh-search--bare")}>
      <span className="mh-sr">{label}</span>
      {icon === "none" ? null : icon === "end" ? (
        <span className="mh-search__mark" aria-hidden="true">
          ⌕
        </span>
      ) : (
        <Icon name="search" className="mh-search__icon" />
      )}
      <TextInput name={name} type="search" size={size} value={value} placeholder={placeholder} label={label} inputRef={inputRef} onChange={onChange} />
    </label>
  );
}

/**
 * Label + value KPI block used in heroes and dashboards.
 * @param {object} props
 * @param {string} props.label
 * @param {React.ReactNode} props.value
 * @param {string} [props.caption]
 * @param {typeof metricStatVariants[number]} [props.variant="card"] glass sits on hero imagery
 * @param {typeof metricStatAccents[number]} [props.accent="gold"] only applies to card variant
 * @param {boolean} [props.compact=false]
 */
export function MetricStat({ label, value, caption, variant = "card", accent = "gold", compact = false }) {
  return (
    <article className={cx("mh-metric", `mh-metric--${variant}`, compact && "mh-metric--compact", variant === "card" && `mh-metric--${accent}`)}>
      <span className="mh-metric__label">{label}</span>
      <strong className="mh-metric__value">{value}</strong>
      {caption ? <small className="mh-metric__caption">{caption}</small> : null}
    </article>
  );
}

/**
 * Section heading with optional eyebrow and trailing description.
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {"h1"|"h2"|"h3"} [props.as="h2"] heading level element
 */
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

/**
 * Mid-page category heading (h2).
 * @param {object} props
 * @param {React.ReactNode} props.title
 * @param {string} [props.id] heading id for aria-labelledby
 */
export function CategoryHeading({ title, id }) {
  return (
    <header className="mh-category">
      <h2 id={id}>{title}</h2>
    </header>
  );
}

/**
 * In-page view heading; `children` render as trailing actions (e.g. Tabs).
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {React.ReactNode} [props.children]
 */
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

/**
 * Single-select pill filter group.
 * @param {object} props
 * @param {string} [props.label="Filters"] group aria-label
 * @param {Array<{ id: string, label: string }>} [props.items=[]]
 * @param {string} [props.value] id of the active pill
 * @param {(event: { id: string, label: string }) => void} [props.onChange]
 */
export function FilterPills({ label = "Filters", items = [], value, onChange }) {
  return (
    <div className="mh-pills" role="group" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          className={cx("mh-pills__item", item.id === value && "is-active")}
          type="button"
          aria-pressed={item.id === value}
          onClick={() => onChange?.({ id: item.id, label: item.label })}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Tab strip (role=tablist). Items may be disabled.
 * @param {object} props
 * @param {string} props.label tablist aria-label
 * @param {Array<{ id: string, label: string, disabled?: boolean, title?: string }>} [props.items=[]]
 * @param {string} [props.value] id of the selected tab
 * @param {typeof tabsVariants[number]} [props.variant="underline"]
 * @param {(event: { id: string, label: string }) => void} [props.onChange]
 */
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
          aria-disabled={item.disabled || undefined}
          disabled={item.disabled}
          title={item.title}
          onClick={() => onChange?.({ id: item.id, label: item.label })}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Labelled form control wrapping TextInput / TextArea / Select.
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.name]
 * @param {"text"|"textarea"|"select"} [props.control="text"]
 * @param {boolean} [props.required=false] renders the required marker
 * @param {boolean} [props.invalid=false]
 * @param {string} [props.hint]
 * @param {string} [props.value] pass to control the field
 * @param {string} [props.defaultValue] initial uncontrolled value
 * @param {string} [props.placeholder]
 * @param {Array<{ id?: string, value?: string, label: string } | string>} [props.options] select only
 * @param {number} [props.rows] textarea only
 * @param {string} [props.className] extra class on the field wrapper
 * @param {(event: { name: string, value: string }) => void} [props.onChange]
 */
export function FormField({
  label,
  name,
  control = "text",
  required = false,
  invalid = false,
  hint,
  value,
  defaultValue,
  placeholder,
  autoComplete,
  options,
  rows,
  className,
  onChange,
}) {
  return (
    <label className={cx("mh-field", className, invalid && "is-invalid")}>
      <span>
        {label}
        {required ? <i className="mh-field__required"> *</i> : null}
      </span>
      {control === "textarea" ? (
        <TextArea name={name} value={value} defaultValue={defaultValue} placeholder={placeholder} autoComplete={autoComplete} rows={rows} invalid={invalid} onChange={onChange} />
      ) : control === "select" ? (
        <Select name={name} value={value} defaultValue={defaultValue} options={options} placeholder={placeholder} autoComplete={autoComplete} invalid={invalid} onChange={onChange} />
      ) : (
        <TextInput name={name} value={value} defaultValue={defaultValue} placeholder={placeholder} autoComplete={autoComplete} invalid={invalid} onChange={onChange} />
      )}
      {hint ? <small className="mh-field__hint">{hint}</small> : null}
    </label>
  );
}

/**
 * Clickable suggested prompt chip.
 * @param {object} props
 * @param {React.ReactNode} props.children suggestion text
 * @param {(event: { label: React.ReactNode }) => void} [props.onSelect]
 */
export function Suggestion({ children, onSelect }) {
  return (
    <button className="mh-suggestion" type="button" onClick={() => onSelect?.({ label: children })}>
      {children}
    </button>
  );
}

/**
 * Toggleable scope option inside the assistant ask box.
 * @param {object} props
 * @param {string} props.label
 * @param {boolean} [props.pressed=false]
 * @param {(event: { label: string, pressed: boolean }) => void} [props.onChange]
 */
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

/**
 * Label / value / bar rows for distribution summaries.
 * @param {object} props
 * @param {Array<{ label: string, value: React.ReactNode, percent: number }>} [props.items=[]]
 */
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

/**
 * CSS-only column chart; `height` is a 0–100 percentage.
 * @param {object} props
 * @param {string} [props.label="Chart"] aria-label
 * @param {Array<{ label: string, value: React.ReactNode, height: number }>} [props.items=[]]
 */
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

/**
 * Simple data table. `columns[].key` indexes into each row object;
 * `columns[].header` is the displayed heading.
 * @param {object} props
 * @param {Array<{ key: string, header: React.ReactNode }>} [props.columns=[]]
 * @param {Array<{ id?: string|number, [key: string]: React.ReactNode }>} [props.rows=[]]
 * @param {React.ReactNode} [props.caption] note under the table
 * @param {(row: object) => void} [props.onRowClick] makes rows clickable
 */
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

/**
 * Sidebar navigation entry with optional icon, badge, and count.
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.icon] SVG path data
 * @param {boolean} [props.active=false]
 * @param {React.ReactNode} [props.badge]
 * @param {number} [props.count]
 * @param {(event: { label: string }) => void} [props.onSelect]
 */
export function SidebarItem({ label, icon, active = false, badge, count, onSelect }) {
  return (
    <button
      className={cx("mh-sidebar-item", active && "is-active")}
      type="button"
      aria-current={active ? "page" : undefined}
      title={count !== undefined && count !== null ? `${label} · ${count}` : label}
      onClick={() => onSelect?.({ label })}
    >
      {icon ? <Icon path={icon} className="mh-sidebar-item__icon" /> : null}
      <span className="mh-sidebar-item__label">{label}</span>
      {badge ? <span className="mh-sidebar-item__badge">{badge}</span> : null}
      {count !== undefined && count !== null ? <span className="mh-sidebar-item__count">{count}</span> : null}
    </button>
  );
}

/**
 * Filter / Reset button pair for filter toolbars.
 * @param {object} props
 * @param {() => void} [props.onSubmit]
 * @param {() => void} [props.onReset]
 * @param {string} [props.submitLabel="Filter"]
 * @param {string} [props.resetLabel="Reset"]
 */
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

/**
 * Transient status toast pinned to the lower-right viewport. Always mounted
 * so the aria-live region exists before `message` changes; the host owns
 * the auto-dismiss timer (the static demo hides it after ~3s).
 * @param {object} props
 * @param {string} [props.message=""]
 * @param {boolean} [props.open=false]
 */
export function Toast({ message = "", open = false }) {
  return (
    <div className="mh-toast" role="status" aria-live="polite" hidden={!open}>
      {message}
    </div>
  );
}

/**
 * Clickable / drag-and-drop file target. Clicking opens the native file
 * picker; dragover adds the `is-dragover` visual state; selecting or dropping
 * a file calls `onSelect` with the file name. `fileName` switches the hint to
 * the selected-file message.
 * @param {object} props
 * @param {string} [props.title="Click or drag a file to upload here"]
 * @param {string} [props.hint]
 * @param {string} [props.selectedPrefix="Selected:"]
 * @param {string} [props.fileName] selected file name shown in the hint
 * @param {string} [props.accept=".xlsx,.xls"]
 * @param {(file: { name: string }) => void} [props.onSelect]
 */
export function FileDropzone({
  title = "Click or drag a file to upload here",
  hint,
  selectedPrefix = "Selected:",
  fileName,
  accept = ".xlsx,.xls",
  onSelect,
}) {
  const inputRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  return (
    <div
      className={cx("mh-dropzone", dragging && "is-dragover")}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer?.files?.[0];
        if (file) onSelect?.({ name: file.name });
      }}
    >
      <input
        ref={inputRef}
        className="mh-dropzone__input"
        type="file"
        accept={accept}
        hidden
        aria-hidden="true"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect?.({ name: file.name });
        }}
      />
      <Icon name="file-upload" className="mh-dropzone__icon" />
      <p className="mh-dropzone__title">{title}</p>
      <p className="mh-dropzone__hint">{fileName ? `${selectedPrefix} ${fileName}` : hint}</p>
    </div>
  );
}

/**
 * Multi-select dropdown filter — a field label plus a `<details>`/`<summary>`
 * disclosure holding checkbox options. Mirrors the shared
 * `.business-filter-field` / `.fm-options` control used for status, data-model
 * and category filters in the original knowledge libraries.
 * @param {object} props
 * @param {string} props.label field label, e.g. "Category"
 * @param {string} [props.allLabel="All"] summary when nothing is selected
 * @param {string} [props.selectedLabel="{count} selected"] summary template once options are checked
 * @param {Array<{ id: string, label: string }>} [props.options=[]]
 * @param {Array<string>} [props.selected=[]] checked option ids
 * @param {(event: { id: string, checked: boolean }) => void} [props.onToggle]
 */
export function CheckboxFilter({ label, allLabel = "All", selectedLabel = "{count} selected", options = [], selected = [], onToggle }) {
  const summary = selected.length ? selectedLabel.replace("{count}", String(selected.length)) : allLabel;
  return (
    <div className="mh-check-filter">
      <span className="mh-check-filter__label">{label}</span>
      <details className="mh-check-filter__details">
        <summary className="mh-check-filter__summary">
          <b>{summary}</b>
        </summary>
        <div className="mh-check-filter__options">
          {options.map((option) => (
            <label key={option.id} className="mh-check-filter__option">
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={(event) => onToggle?.({ id: option.id, checked: event.target.checked })}
              />
              {option.label}
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}

/**
 * Footer pagination row — total label, rows-per-page select and ‹ 1 2 3 ›
 * buttons. Mirrors `#businessPagination` / `renderPagination` in the original.
 * @param {object} props
 * @param {number} props.total total item count
 * @param {[string, string]} [props.units=["asset", "assets"]] singular/plural for the total label
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=10]
 * @param {Array<number>} [props.pageSizes=[10, 20, 50]]
 * @param {string} [props.rowsLabel="Rows per page"]
 * @param {(event: { page: number }) => void} [props.onPage]
 * @param {(event: { pageSize: number }) => void} [props.onPageSize]
 */
export function Pagination({ total, units = ["asset", "assets"], page = 1, pageSize = 10, pageSizes = [10, 20, 50], rowsLabel = "Rows per page", onPage, onPageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  const totalLabel = `${total} ${total === 1 ? units[0] : units[1]}`;
  return (
    <nav className="mh-pagination" aria-label="Knowledge pagination">
      <span className="mh-pagination__total">{totalLabel}</span>
      <label className="mh-pagination__size">
        {rowsLabel}{" "}
        <select
          value={pageSize}
          onChange={(event) => onPageSize?.({ pageSize: Number(event.target.value) || pageSize })}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <div className="mh-pagination__pages">
        <button type="button" disabled={current === 1} onClick={() => onPage?.({ page: Math.max(1, current - 1) })}>
          ‹
        </button>
        {Array.from({ length: pages }, (_, index) => index + 1).map((item) => (
          <button
            key={item}
            type="button"
            className={item === current ? "is-active" : undefined}
            onClick={() => onPage?.({ page: item })}
          >
            {item}
          </button>
        ))}
        <button type="button" disabled={current === pages} onClick={() => onPage?.({ page: Math.min(pages, current + 1) })}>
          ›
        </button>
      </div>
    </nav>
  );
}
