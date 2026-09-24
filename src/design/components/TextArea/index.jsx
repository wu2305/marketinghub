import "../../tokens.css";
import React from "react";
import { cx } from "../../cx.js";
import "./TextArea.css";


/**
 * Multi-line input. Controlled when `value` is passed, uncontrolled otherwise.
 * @param {object} props
 * @param {string} [props.name]
 * @param {string} [props.value]
 * @param {string} [props.defaultValue=""]
 * @param {string} [props.placeholder]
 * @param {string} [props.autoComplete]
 * @param {number} [props.rows=4]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.invalid=false]
 * @param {boolean} [props.required=false] native required attribute
 * @param {string} [props.label] accessible label (visually hidden)
 * @param {React.Ref<HTMLTextAreaElement>} [props.ref] forwarded to the textarea
 * @param {(event: { name: string, value: string }) => void} [props.onChange]
 * @param {(event: React.KeyboardEvent<HTMLTextAreaElement>) => void} [props.onKeyDown]
 */
export const TextArea = React.forwardRef(function TextArea({
  name,
  value,
  defaultValue = "",
  placeholder,
  autoComplete,
  rows = 4,
  disabled = false,
  invalid = false,
  required = false,
  label,
  onChange,
  onKeyDown,
}, ref) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : uncontrolled;
  return (
    <textarea
      ref={ref}
      className={cx("mh-textarea", invalid && "is-invalid")}
      name={name}
      rows={rows}
      value={current}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      required={required}
      aria-invalid={invalid || undefined}
      aria-label={label}
      onKeyDown={onKeyDown}
      onChange={(event) => {
        if (!controlled) setUncontrolled(event.target.value);
        onChange?.({ name: name || "", value: event.target.value });
      }}
    />
  );
});
