import "../../tokens.css";
import { TextInput } from "../../components/TextInput/index.jsx";
import { cx } from "../../cx.js";
import { Icon } from "../../icons.jsx";
import "./SearchField.css";


/** @type {readonly ["start", "end", "none"]} */
export const searchIconPositions = ["start", "end", "none"];
/** @type {readonly ["field", "plain"]} */
export const searchVariants = ["field", "plain"];

/**
 * Labeled search input with an icon that can lead, trail, or be omitted.
 * @param {object} props
 * @param {string} [props.label="Search"] accessible label
 * @param {string} [props.name]
 * @param {string} [props.value] pass to control the field
 * @param {string} [props.placeholder="Search"]
 * @param {"sm"|"md"|"lg"} [props.size="md"]
 * @param {typeof searchVariants[number]} [props.variant="field"] plain = the original `.overview-global-search` gold pill
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
