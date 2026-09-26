import "../../tokens.css";
import { cx } from "../../cx.js";
import "./StatusBadge.css";


/** @type {readonly ["default", "knowledge"]} */
export const statusBadgeVariants = ["default", "knowledge"];

/**
 * Status pill. `status` is the label; tone is derived by substring/token
 * matching — contains "publish" or equals success/token-valid/enabled →
 * success; contains "review" or equals syncing/building → review; contains
 * "pending" or equals watch/queued → pending; contains "pause" or equals
 * danger/disabled → paused; else draft. Note: matching is substring-based,
 * so e.g. "Unpublished" still maps to success.
 * @param {object} props
 * @param {string} [props.status="draft"]
 * @param {"default"|"knowledge"} [props.variant="default"]
 * @param {boolean} [props.outline=false]
 * @param {React.ReactNode} [props.children] overrides `status` as label
 */
export function StatusBadge({ status = "draft", variant = "default", outline = false, children }) {
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
  return <span className={cx("mh-badge", `mh-badge--${tone}`, variant === "knowledge" && "mh-badge--knowledge", outline && "mh-badge--outline")}>{children || status}</span>;
}
