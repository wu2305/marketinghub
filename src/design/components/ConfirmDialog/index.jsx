import "../../tokens.css";
import React from "react";
import { Modal } from "../../components/Modal/index.jsx";
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
 * Built on Modal for the shared overlay/focus/Escape lifecycle.
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {typeof confirmDialogPurposes[number]} [props.purpose="confirm"]
 * @param {string} props.title
 * @param {React.ReactNode} [props.message] text or emphasized content
 * @param {string} [props.confirmLabel="Confirm"]
 * @param {string} [props.cancelLabel="Cancel"]
 * @param {string} [props.closeLabel="Close"] single dismiss button for purpose="info"
 * @param {(event: { confirmed: true }) => void} [props.onConfirm]
 * @param {(event: { reason: "cancel"|"close"|"scrim"|"escape" }) => void} [props.onCancel] dismissal of any kind
 */
export function ConfirmDialog({ open = false, purpose = "confirm", title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", closeLabel = "Close", onConfirm, onCancel }) {
  /* Native knowledge dialogs focus the first action. The risk panel is a
     non-native dialog, so focus its surface to start long messages at top. */
  const focusRef = React.useRef(null);
  const isInfo = purpose === "info";
  return (
    <Modal
      open={open}
      className={cx("mh-confirm", `mh-confirm--${purpose}`)}
      eyebrow={purpose === "warning" ? <Icon path={CONFIRM_ICON_PATH} /> : undefined}
      title={title}
      initialFocus={purpose === "warning" ? undefined : focusRef}
      onClose={(event) => onCancel?.({ reason: event.reason === "button" ? "close" : event.reason })}
    >
      <p className="mh-confirm__message">{message}</p>
      <div className="mh-confirm__foot">
        {!isInfo ? (
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
