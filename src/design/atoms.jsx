import React from "react";
import "./atoms.css";
import { cx, normalizeOptions } from "./cx.js";
import { Icon } from "./icons.jsx";

const BUTTON_VARIANTS = ["primary", "gold", "secondary", "quiet", "danger"];
const SIZES = ["sm", "md", "lg"];

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

export function Link({ href = "#", children, onNavigate }) {
  return (
    <a
      className="mh-link"
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onNavigate?.({ href, label: event.currentTarget.textContent.trim() });
      }}
    >
      {children}
    </a>
  );
}

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
