import "../../tokens.css";
import React from "react";
import { Modal } from "../../components/Modal/index.jsx";
import { cx } from "../../cx.js";
import { Icon } from "../../icons.jsx";
import "./ConfirmDialog.css";


export const confirmDialogTones = ["confirm", "info"];

const CONFIRM_ICON_PATH =
  "M12 8v4m0 4h.01 M10.3 3.6 2.5 17.1A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.9L13.7 3.6a2 2 0 0 0-3.4 0Z";

/**
 * Small confirm/info dialog shared by the knowledge libraries
 * (business-term-library.js / field-library.js / scenario-reports.js all build
 * the same `.fm-dialog` element). "confirm" shows a warning icon with
 * Cancel + a primary confirm button; "info" shows title + message + a single
 * Close button. Built on Modal for overlay/focus/Escape lifecycle.
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {typeof confirmDialogTones[number]} [props.tone="confirm"]
 * @param {string} props.title
 * @param {string} [props.message]
 * @param {string} [props.confirmLabel="Confirm"]
 * @param {string} [props.cancelLabel="Cancel"]
 * @param {string} [props.closeLabel="Close"] single dismiss button for tone="info"
 * @param {(event: { confirmed: true }) => void} [props.onConfirm]
 * @param {(event: { reason: "cancel"|"close"|"scrim"|"escape" }) => void} [props.onCancel] dismissal of any kind
 */
export function ConfirmDialog({ open = false, tone = "confirm", title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", closeLabel = "Close", onConfirm, onCancel }) {
  /* The original is a native <dialog> — showModal() focuses the first
     focusable element: Cancel on confirm dialogs, Close on info dialogs. */
  const focusRef = React.useRef(null);
  return (
    <Modal
      open={open}
      className={cx("mh-confirm", `mh-confirm--${tone}`)}
      eyebrow={tone === "confirm" ? <Icon path={CONFIRM_ICON_PATH} /> : undefined}
      title={title}
      initialFocus={focusRef}
      onClose={(event) => onCancel?.({ reason: event.reason === "button" ? "close" : event.reason })}
    >
      <p className="mh-confirm__message">{message}</p>
      <div className="mh-confirm__foot">
        {tone === "confirm" ? (
          <>
            <button type="button" className="mh-confirm__btn" ref={focusRef} onClick={() => onCancel?.({ reason: "cancel" })}>
              {cancelLabel}
            </button>
            <button type="button" className="mh-confirm__btn mh-confirm__btn--primary" onClick={() => onConfirm?.({ confirmed: true })}>
              {confirmLabel}
            </button>
          </>
        ) : (
          <button type="button" className="mh-confirm__btn" ref={focusRef} onClick={() => onCancel?.({ reason: "close" })}>
            {closeLabel}
          </button>
        )}
      </div>
    </Modal>
  );
}
