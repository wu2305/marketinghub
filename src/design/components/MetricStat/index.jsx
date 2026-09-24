import "../../tokens.css";
import { cx } from "../../cx.js";
import "./MetricStat.css";

export const metricStatVariants = ["card", "glass"];
export const metricStatAccents = ["gold", "green", "amber", "blue", "red"];

/**
 * Label + value KPI block used in heroes and dashboards.
 * @param {object} props
 * @param {string} props.label
 * @param {React.ReactNode} props.value
 * @param {string} [props.caption]
 * @param {typeof metricStatVariants[number]} [props.variant="card"] glass sits on hero imagery
 * @param {typeof metricStatAccents[number]} [props.accent="gold"] only applies to card variant
 * @param {boolean} [props.compact=false]
 */
export function MetricStat({ label, value, caption, variant = "card", accent = "gold", compact = false }) {
  return (
    <article className={cx("mh-metric", `mh-metric--${variant}`, compact && "mh-metric--compact", variant === "card" && `mh-metric--${accent}`)}>
      <span className="mh-metric__label">{label}</span>
      <strong className="mh-metric__value">{value}</strong>
      {caption ? <small className="mh-metric__caption">{caption}</small> : null}
    </article>
  );
}
