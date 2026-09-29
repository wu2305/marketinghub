import "../../tokens.css";
import React from "react";
import { cx } from "../../cx.js";
import "./TextArea.css";


/**
 * @typedef {object} TextAreaProps
 * @property {string} [name]
 * @property {string} [value]
 * @property {string} [defaultValue=""]
 * @property {string} [placeholder]
 * @property {string} [autoComplete]
 * @property {number} [rows=4]
 * @property {boolean} [disabled=false]
 * @property {boolean} [invalid=false]
 * @property {boolean} [required=false] native required attribute
 * @property {string} [label] accessible label (visually hidden)
 * @property {(event: { name: string, value: string }) => void} [onChange]
 * @property {(event: React.KeyboardEvent<HTMLTextAreaElement>) => void} [onKeyDown]
 */

/**
 * Multi-line input. Controlled when `value` is passed, uncontrolled otherwise.
 * The forwarded ref points at the textarea.
 * @type {React.ForwardRefExoticComponent<TextAreaProps & React.RefAttributes<HTMLTextAreaElement>>}
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
