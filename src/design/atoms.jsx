import React from "react";
import "./atoms.css";
import { cx, normalizeOptions } from "./cx.js";
import { Icon } from "./icons.jsx";

const BUTTON_VARIANTS = ["primary", "gold", "secondary", "quiet", "danger"];
const SIZES = ["sm", "md", "lg"];

/**
 * Action button. Renders `<button type="button">`; never use it for navigation.
 * @param {object} props
 * @param {typeof BUTTON_VARIANTS[number]} [props.variant="primary"]
 * @param {typeof SIZES[number]} [props.size="md"]
 * @param {boolean} [props.disabled=false]
 * @param {"button"|"submit"} [props.type="button"]
 * @param {string} [props.icon] icon name from icons.jsx
 * @param {React.ReactNode} props.children
 * @param {() => void} [props.onClick]
 */
export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  icon,
  children,
  onClick,
}) {
  return (
    <button
      className={cx("mh-button", `mh-button--${variant}`, `mh-button--${size}`)}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {icon ? <Icon name={icon} className="mh-button__icon" /> : null}
      {children}
    </button>
  );
}

/**
 * Navigation link. Renders `<a href>`; host decides routing via onNavigate.
 * @param {object} props
 * @param {string} [props.href="#"]
 * @param {React.ReactNode} props.children
 * @param {(target: { href: string, label: string }) => void} [props.onNavigate]
 */
export function Link({ href = "#", children, onNavigate }) {
  return (
    <a
      className="mh-link"
      href={href}
      onClick={(event) => onNavigate?.({ href, label: event.currentTarget.textContent.trim() })}
    >
      {children}
    </a>
  );
}

/**
 * Single-line input. Controlled when `value` is passed, uncontrolled otherwise.
 * @param {object} props
 * @param {string} [props.name]
 * @param {string} [props.type="text"]
 * @param {string} [props.value] pass to control the field
 * @param {string} [props.defaultValue=""] initial uncontrolled value
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.invalid=false] adds aria-invalid and error styling
 * @param {typeof SIZES[number]} [props.size="md"]
 * @param {string} [props.label] accessible label (visually hidden)
 * @param {(event: { name: string, value: string }) => void} [props.onChange]
 */
export function TextInput({
  name,
  type = "text",
  value,
  defaultValue = "",
  placeholder,
  disabled = false,
  invalid = false,
  size = "md",
  label,
  onChange,
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : uncontrolled;
  return (
    <input
      className={cx("mh-input", `mh-input--${size}`, invalid && "is-invalid")}
      name={name}
      type={type}
      value={current}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-label={label}
      onChange={(event) => {
        if (!controlled) setUncontrolled(event.target.value);
        onChange?.({ name: name || "", value: event.target.value });
      }}
    />
  );
}

/**
 * Multi-line input. Controlled when `value` is passed, uncontrolled otherwise.
 * @param {object} props
 * @param {string} [props.name]
 * @param {string} [props.value]
 * @param {string} [props.defaultValue=""]
 * @param {string} [props.placeholder]
 * @param {number} [props.rows=4]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.invalid=false]
 * @param {string} [props.label] accessible label (visually hidden)
 * @param {(event: { name: string, value: string }) => void} [props.onChange]
 */
export function TextArea({
  name,
  value,
  defaultValue = "",
  placeholder,
  rows = 4,
  disabled = false,
  invalid = false,
  label,
  onChange,
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : uncontrolled;
  return (
    <textarea
      className={cx("mh-textarea", invalid && "is-invalid")}
      name={name}
      rows={rows}
      value={current}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-label={label}
      onChange={(event) => {
        if (!controlled) setUncontrolled(event.target.value);
        onChange?.({ name: name || "", value: event.target.value });
      }}
    />
  );
}

/**
 * Native select. `options` accept `{ id|value, label }` or plain strings.
 * @param {object} props
 * @param {string} [props.name]
 * @param {string} [props.value] pass to control the field
 * @param {string} [props.defaultValue=""]
 * @param {Array<{ id?: string, value?: string, label: string } | string>} [props.options=[]]
 * @param {string} [props.placeholder] renders a leading empty option
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.invalid=false]
 * @param {typeof SIZES[number]} [props.size="md"]
 * @param {string} [props.label] accessible label (visually hidden)
 * @param {(event: { name: string, value: string }) => void} [props.onChange]
 */
export function Select({
  name,
  value,
  defaultValue = "",
  options = [],
  placeholder,
  disabled = false,
  invalid = false,
  size = "md",
  label,
  onChange,
}) {
  const items = normalizeOptions(options);
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : uncontrolled;
  return (
    <select
      className={cx("mh-select", `mh-select--${size}`, invalid && "is-invalid")}
      name={name}
      value={current}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-label={label}
      onChange={(event) => {
        if (!controlled) setUncontrolled(event.target.value);
        onChange?.({ name: name || "", value: event.target.value });
      }}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

/**
 * Status pill. `status` is the label; tone is derived from known status tokens
 * (published/success/enabled → success; review/syncing/building → review;
 * pending/queued → pending; paused/danger/disabled → paused; else draft).
 * @param {object} props
 * @param {string} [props.status="draft"]
 * @param {boolean} [props.outline=false]
 * @param {React.ReactNode} [props.children] overrides `status` as label
 */
export function StatusBadge({ status = "draft", outline = false, children }) {
  const key = String(status).toLowerCase().replace(/\s+/g, "-");
  const tone =
    key.includes("publish") || key === "success" || key === "token-valid" || key === "enabled"
      ? "success"
      : key.includes("review") || key === "syncing" || key === "building"
        ? "review"
        : key.includes("pending") || key === "watch" || key === "queued"
          ? "pending"
          : key.includes("pause") || key === "danger" || key === "disabled"
            ? "paused"
            : key.includes("draft")
              ? "draft"
              : "draft";
  return <span className={cx("mh-badge", `mh-badge--${tone}`, outline && "mh-badge--outline")}>{children || status}</span>;
}

export const buttonVariants = BUTTON_VARIANTS;
export const controlSizes = SIZES;
