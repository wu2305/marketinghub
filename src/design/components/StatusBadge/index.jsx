import "../../tokens.css";
import { cx } from "../../cx.js";
import "./StatusBadge.css";


export const statusBadgeVariants = ["default", "knowledge", "detail"];
export const statusBadgeSizes = ["sm", "lg"];
export const statusBadgeTones = ["auto", "neutral", "success", "review", "pending", "paused", "draft", "warning"];

const toneForStatus = {
  published: "success",
  success: "success",
  "token-valid": "success",
  enabled: "success",
  review: "review",
  "under-review": "review",
  syncing: "review",
  building: "review",
  pending: "pending",
  "pending-confirmation": "pending",
  watch: "pending",
  queued: "pending",
  paused: "paused",
  danger: "paused",
  disabled: "paused",
  draft: "draft",
};

/**
 * Status pill. `status` supplies the label; auto tone recognizes exact known
 * states and leaves unknown labels neutral. `tone` overrides that mapping.
 * @param {object} props
 * @param {string} [props.status="draft"]
 * @param {typeof statusBadgeVariants[number]} [props.variant="default"] knowledge reserves a card slot; detail grows with its label
 * @param {typeof statusBadgeSizes[number]} [props.size="sm"] lg gives the plain status pill the 32px header-action height
 * @param {typeof statusBadgeTones[number]} [props.tone="auto"] exact status mapping or explicit semantic tone
 * @param {boolean} [props.outline=false]
 * @param {React.ReactNode} [props.children] overrides `status` as label
 */
export function StatusBadge({ status = "draft", variant = "default", size = "sm", tone = "auto", outline = false, children }) {
  const key = String(status).trim().toLowerCase().replace(/\s+/g, "-");
  const resolvedTone = tone === "auto" ? (Object.hasOwn(toneForStatus, key) ? toneForStatus[key] : "neutral") : tone;
  return <span className={cx("mh-badge", `mh-badge--${resolvedTone}`, variant !== "default" && `mh-badge--${variant}`, size !== "sm" && `mh-badge--${size}`, outline && "mh-badge--outline")}>{children || status}</span>;
}
