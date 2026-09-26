import "../../tokens.css";
import { cx } from "../../cx.js";
import "./Tabs.css";

/** @type {readonly ["underline", "segmented"]} */
export const tabsVariants = ["underline", "segmented"];

/**
 * Tab strip (role=tablist). Items may be disabled.
 * @param {object} props
 * @param {string} props.label tablist aria-label
 * @param {Array<{ id: string, label: string, disabled?: boolean, title?: string }>} [props.items=[]]
 * @param {string} [props.value] id of the selected tab
 * @param {typeof tabsVariants[number]} [props.variant="underline"]
 * @param {(event: { id: string, label: string }) => void} [props.onChange]
 */
export function Tabs({ label, items = [], value, variant = "underline", onChange }) {
  return (
    <div className={cx("mh-tabs", variant === "segmented" && "mh-tabs--segmented")} role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          className={cx("mh-tabs__tab", item.id === value && "is-active")}
          type="button"
          role="tab"
          aria-selected={item.id === value}
          aria-disabled={item.disabled || undefined}
          disabled={item.disabled}
          title={item.title}
          onClick={() => onChange?.({ id: item.id, label: item.label })}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
