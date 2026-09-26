import "../../tokens.css";
import React from "react";
import { cx } from "../../cx.js";
import { normalizeOptions } from "../../lib/options.js";
import "./Select.css";


/**
 * Native select. `options` accept `{ id|value, label }` or plain strings.
 * @param {object} props
 * @param {string} [props.name]
 * @param {string} [props.value] pass to control the field
 * @param {string} [props.defaultValue=""]
 * @param {Array<{ id?: string, value?: string, label: string } | string>} [props.options=[]]
 * @param {string} [props.placeholder] renders a leading placeholder option (implicit value = its text, matching the demo markup)
 * @param {string} [props.autoComplete]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.invalid=false]
 * @param {"sm"|"md"|"lg"} [props.size="md"]
 * @param {string} [props.label] accessible label (visually hidden)
 * @param {(event: { name: string, value: string }) => void} [props.onChange]
 */
export function Select({
  name,
  value,
  defaultValue = "",
  options = [],
  placeholder,
  autoComplete,
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
      autoComplete={autoComplete}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-label={label}
      onChange={(event) => {
        if (!controlled) setUncontrolled(event.target.value);
        onChange?.({ name: name || "", value: event.target.value });
      }}
    >
      {placeholder ? <option>{placeholder}</option> : null}
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
