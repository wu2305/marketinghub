import "../../tokens.css";
import { Select } from "../../components/Select/index.jsx";
import { TextArea } from "../../components/TextArea/index.jsx";
import { TextInput } from "../../components/TextInput/index.jsx";
import { cx } from "../../cx.js";
import "./FormField.css";

/** @type {readonly ["text", "textarea", "select"]} */
export const formFieldControls = ["text", "textarea", "select"];

/**
 * Labelled form control wrapping TextInput / TextArea / Select.
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.name]
 * @param {typeof formFieldControls[number]} [props.control="text"]
 * @param {boolean} [props.required=false] renders the required marker
 * @param {boolean} [props.invalid=false]
 * @param {string} [props.hint]
 * @param {string} [props.value] pass to control the field
 * @param {string} [props.defaultValue] initial uncontrolled value
 * @param {string} [props.placeholder]
 * @param {string} [props.autoComplete]
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
