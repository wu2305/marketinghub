import "../../tokens.css";
import React from "react";
import { useOverlayLayer } from "../../lib/overlay.js";
import { confirmDialogTokens as tokens, confirmDialogVariants } from "./confirm-dialog-tokens.js";
export { confirmDialogTokens, confirmDialogVariants } from "./confirm-dialog-tokens.js";
/** @type {readonly ["default", "warning", "danger"]} */
export const confirmDialogVariantNames = ["default", "warning", "danger"];
import { cx } from "../../cx.js";
import { Icon } from "../../icons.jsx";
import "./ConfirmDialog.css";


/** @type {readonly ["confirm", "info", "warning", "danger"]} */
export const confirmDialogPurposes = ["confirm", "info", "warning", "danger"];

const CONFIRM_ICON_PATH =
  "M12 8v4m0 4h.01 M10.3 3.6 2.5 17.1A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.9L13.7 3.6a2 2 0 0 0-3.4 0Z";

/**
 * Confirmation and notice dialog shared by knowledge and governance flows.
 * Purpose controls the action hierarchy and emphasis; content controls height.
 * Uses the shared overlay/focus/Escape lifecycle with its approved surface parameters.
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {typeof confirmDialogPurposes[number]} [props.purpose="confirm"]
 * @param {typeof confirmDialogVariantNames[number]} [props.variant] explicit semantic color; defaults from purpose // 语义配色，默认由 purpose 推导
 * @param {string} props.title
 * @param {React.ReactNode} [props.message] text or emphasized content
 * @param {string} [props.confirmLabel="Confirm"]
 * @param {string} [props.cancelLabel="Cancel"]
 * @param {string} [props.closeLabel="Close"] single dismiss button for purpose="info"
 * @param {(event: { confirmed: true }) => void} [props.onConfirm]
 * @param {(event: { reason: "cancel"|"close"|"scrim"|"escape" }) => void} [props.onCancel] dismissal of any kind
 */
export function ConfirmDialog({ open = false, purpose = "confirm", variant, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", closeLabel = "Close", onConfirm, onCancel }) {
  const focusRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const titleId = React.useId();
  const messageId = React.useId();
  const isInfo = purpose === "info";
  const resolvedVariant = variant || (purpose === "danger" ? "danger" : purpose === "warning" ? "warning" : "default");
  const colors = confirmDialogVariants[resolvedVariant] || confirmDialogVariants.default;
  useOverlayLayer({ open, onClose: onCancel, layerRef: dialogRef, initialFocusRef: focusRef });
  if (!open) return null;
  return (
    <div data-mh-overlay-surface className="mh-confirm-overlay" style={{ ...tokens.overlay, padding: "16px" }}>
      <div className="mh-confirm__scrim" onClick={() => onCancel?.({ reason: "scrim" })} />
      <section
        className={cx("mh-confirm", `mh-confirm--${resolvedVariant}`)}
        style={{ ...tokens.dialog, position: "relative", maxHeight: "calc(100dvh - 32px)", display: "flex", flexDirection: "column" }}
        role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={message ? messageId : undefined}
        tabIndex={-1} ref={dialogRef}
      >
        <div className="mh-confirm__content" style={{ ...tokens.content, display: "flex", alignItems: "flex-start", overflowY: "auto", minHeight: 0 }}>
          <span className="mh-confirm__icon" aria-hidden="true" style={{ width: tokens.icon.size, height: tokens.icon.size, flex: `0 0 ${tokens.icon.size}`, borderRadius: tokens.icon.borderRadius, background: colors.iconBackground, color: colors.iconColor, display: "grid", placeItems: "center" }}>
            <span style={{ width: tokens.icon.iconSize, height: tokens.icon.iconSize, display: "block" }}><Icon path={CONFIRM_ICON_PATH} /></span>
          </span>
          <div className="mh-confirm__text" style={{ minWidth: 0 }}>
            <h2 id={titleId} style={{ ...tokens.title, margin: 0 }}>{title}</h2>
            {message ? <p id={messageId} className="mh-confirm__message" style={{ ...tokens.description, marginBottom: 0 }}>{message}</p> : null}
          </div>
        </div>
        <footer className="mh-confirm__foot" style={{ ...tokens.footer, display: "flex", flexWrap: "wrap", flexShrink: 0 }}>
          <button type="button" className="mh-confirm__btn" style={{ ...tokens.button, ...tokens.cancelButton }} ref={focusRef} onClick={() => onCancel?.({ reason: isInfo ? "close" : "cancel" })}>
            {isInfo ? closeLabel : cancelLabel}
          </button>
          {!isInfo ? <button type="button" className="mh-confirm__btn mh-confirm__btn--primary" style={{ ...tokens.button, background: colors.confirmBackground, border: `1px solid ${colors.confirmBorder}`, color: colors.confirmColor }} onClick={() => onConfirm?.({ confirmed: true })}>{confirmLabel}</button> : null}
        </footer>
      </section>
    </div>
  );
}
