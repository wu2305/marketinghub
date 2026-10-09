import "../../tokens.css";
import { cx } from "../../cx.js";
import "./Tabs.css";

/** @type {readonly ["underline", "segmented"]} */
export const tabsVariants = ["underline", "segmented"];

const TAB_STEPS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * Tab strip (role=tablist). Items may be disabled. The selected tab is the only
 * Tab stop; arrow keys, Home and End move focus and select, skipping disabled items.
 * @param {object} props
 * @param {string} props.label tablist aria-label
 * @param {Array<{ id: string, label: string, disabled?: boolean, title?: string }>} [props.items=[]]
 * @param {string} [props.value] id of the selected tab
 * @param {typeof tabsVariants[number]} [props.variant="underline"]
 * @param {(event: { id: string, label: string }) => void} [props.onChange]
 */
export function Tabs({ label, items = [], value, variant = "underline", onChange }) {
  const selected = items.findIndex((item) => item.id === value);
  const tabStop = selected >= 0 ? selected : items.findIndex((item) => !item.disabled);
  const onKeyDown = (event, index) => {
    const step = TAB_STEPS[event.key] ?? (event.key === "Home" ? 1 : event.key === "End" ? -1 : 0);
    if (!step) return;
    event.preventDefault();
    let at = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : index + step;
    for (let tries = 0; tries < items.length; tries += 1, at += step) {
      const next = (at + items.length) % items.length;
      if (items[next].disabled) continue;
      event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();
      onChange?.({ id: items[next].id, label: items[next].label });
      return;
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
          tabIndex={index === tabStop ? 0 : -1}
          title={item.title}
          onClick={() => onChange?.({ id: item.id, label: item.label })}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
