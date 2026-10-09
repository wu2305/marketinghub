import "../../tokens.css";
import { cx } from "../../cx.js";
import "./StatusBadge.css";


/** @type {readonly ["default", "knowledge", "detail", "process"]} */
export const statusBadgeVariants = ["default", "knowledge", "detail", "process"];
/** @type {readonly ["sm", "lg"]} */
export const statusBadgeSizes = ["sm", "lg"];
/** @type {readonly ["auto", "neutral", "success", "info", "warning", "danger"]} */
export const statusBadgeTones = ["auto", "neutral", "success", "info", "warning", "danger"];

const toneForStatus = {
  published: "success",
  success: "success",
  "token-valid": "success",
  enabled: "success",
  review: "info",
  "under-review": "info",
  syncing: "info",
  building: "info",
  pending: "warning",
  "pending-confirmation": "warning",
  watch: "warning",
  queued: "warning",
  paused: "danger",
  danger: "danger",
  disabled: "neutral",
  draft: "neutral",
};

/**
 * Status pill. `status` supplies the label; auto tone recognizes exact known
 * states and leaves unknown labels neutral. `tone` overrides that mapping.
 * @param {object} props
 * @param {string} [props.status="draft"]
 * @param {typeof statusBadgeVariants[number]} [props.variant="default"] knowledge reserves a card slot; detail grows with its label
 * @param {typeof statusBadgeSizes[number]} [props.size="sm"] lg makes any variant 32px high
 * @param {typeof statusBadgeTones[number]} [props.tone="auto"] exact status mapping or explicit semantic tone; auto preserves knowledge/detail availability colors
 * @param {boolean} [props.outline=false]
 * @param {React.ReactNode} [props.children] overrides `status` as label
 */
export function StatusBadge({ status = "draft", variant = "default", size = "sm", tone = "auto", outline = false, children }) {
  const key = String(status).trim().toLowerCase().replace(/\s+/g, "-");
  const resolvedTone = tone === "auto" ? (Object.hasOwn(toneForStatus, key) ? toneForStatus[key] : "neutral") : tone;
  return <span className={cx("mh-badge", `mh-badge--${resolvedTone}`, tone === "auto" && "mh-badge--auto", variant !== "default" && `mh-badge--${variant}`, size !== "sm" && `mh-badge--${size}`, outline && "mh-badge--outline")}>{children || status}</span>;
}
