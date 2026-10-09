import "../../tokens.css";
import { cx } from "../../cx.js";
import "./Tabs.css";

/** @type {readonly ["underline", "segmented"]} */
export const tabsVariants = ["underline", "segmented"];

const TAB_KEY_STEPS = { ArrowRight: 1, ArrowLeft: -1 };

/**
 * Tab strip (role=tablist). Items may be disabled. The selected tab is the only
 * Tab stop; Left/Right arrows (plus Home/End) move focus and select, skipping
 * disabled items and wrapping at the ends.
 * @param {object} props
 * @param {string} props.label tablist aria-label
 * @param {Array<{ id: string, label: string, disabled?: boolean, title?: string }>} [props.items=[]]
 * @param {string} [props.value] id of the selected tab
 * @param {typeof tabsVariants[number]} [props.variant="underline"]
 * @param {(event: { id: string, label: string }) => void} [props.onChange]
 */
export function Tabs({ label, items = [], value, variant = "underline", onChange }) {
  const selected = items.findIndex((item) => item.id === value);
  const stopIndex = selected >= 0 ? selected : items.findIndex((item) => !item.disabled);
  const moveFocus = (event, index) => {
    const step = TAB_KEY_STEPS[event.key] ?? (event.key === "Home" ? 1 : event.key === "End" ? -1 : 0);
    if (!step) return;
    event.preventDefault();
    let target = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : index + step;
    for (let tried = 0; tried < items.length; tried += 1) {
      const at = ((target % items.length) + items.length) % items.length;
      if (!items[at].disabled) {
        event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[at]?.focus();
        onChange?.({ id: items[at].id, label: items[at].label });
        return;
      }
      target += step;
    }
  };
  return (
    <div className={cx("mh-tabs", variant === "segmented" && "mh-tabs--segmented")} role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item.id}
          className={cx("mh-tabs__tab", item.id === value && "is-active")}
          type="button"
          role="tab"
          aria-selected={item.id === value}
          aria-disabled={item.disabled || undefined}
          disabled={item.disabled}
          tabIndex={index === stopIndex ? 0 : -1}
          title={item.title}
          onClick={() => onChange?.({ id: item.id, label: item.label })}
          onKeyDown={(event) => moveFocus(event, index)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
