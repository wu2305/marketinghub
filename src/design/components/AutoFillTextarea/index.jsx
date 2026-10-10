import "../../tokens.css";
import "./AutoFillTextarea.css";

/**
 * Textarea with an "AI Auto-fill" pill in its bottom-right corner. Controlled;
 * the container decides what pressing the pill puts in the field.
 * @param {object} props
 * @param {string} [props.id] Lets an outside `<label htmlFor>` name the textarea.
 * @param {string} [props.value=""]
 * @param {string} [props.placeholder]
 * @param {string} [props.label] Accessible name when no outside label exists.
 * @param {string} props.autoFillLabel Pill copy.
 * @param {number} [props.rows=2]
 * @param {boolean} [props.invalid=false]
 * @param {boolean} [props.required=false] native required attribute
 * @param {string} [props.describedBy] id of the element that describes the field, for example its error message
 * @param {React.Ref<HTMLTextAreaElement>} [props.textareaRef] Forwarded to the textarea, for focusing it on a validation error.
 * @param {(event:{value:string})=>void} [props.onChange]
 * @param {() => void} [props.onAutoFill] Auto-fill pressed.
 */
export function AutoFillTextarea({ id, value = "", placeholder, label, autoFillLabel, rows = 2, invalid = false, required = false, describedBy, textareaRef, onChange, onAutoFill }) {
  return <div className="mh-autofill">
    <textarea ref={textareaRef} id={id} rows={rows} value={value} placeholder={placeholder} aria-label={label} required={required || undefined} aria-invalid={invalid || undefined} aria-describedby={describedBy} onChange={(event) => onChange?.({ value: event.target.value })} />
    <button type="button" onClick={() => onAutoFill?.()}>{autoFillLabel}</button>
  </div>;
}
