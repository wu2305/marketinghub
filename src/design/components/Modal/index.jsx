import "../../tokens.css";
import React from "react";
import { cx } from "../../cx.js";
import { useOverlayLayer } from "../../lib/overlay.js";
import "./Modal.css";

export const modalVariants = ["modal", "sheet", "drawer"];


/**
 * Centered modal dialog: dimmed scrim, framed panel with eyebrow/title and a
 * close button, arbitrary `children` body. Closes on scrim click and Escape,
 * locks body scroll (`dialog-open` class, matching the static demo), focuses
 * the panel on open and restores focus on close.
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {string} [props.eyebrow]
 * @param {string} [props.title]
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className] extra class on the dialog panel
 * @param {string} [props.closeLabel="Close"]
 * @param {string} [props.titleId] defaults to a generated useId
 * @param {typeof modalVariants[number]} [props.variant="modal"] "sheet" is the borderless radius-8 chrome with deep scrim used by the Self-Service dialogs; "drawer" is the full-height right-side panel used by knowledge detail views
 * @param {React.ReactNode} [props.titleExtra] rendered inline next to the title (e.g. a status pill) — drawer variant
 * @param {React.ReactNode} [props.footer] rendered in a bordered footer strip — drawer variant
 * @param {React.RefObject} [props.initialFocus] element focused on open instead of the dialog panel
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onClose]
 */
export function Modal({ open = false, eyebrow, title, children, className, closeLabel = "Close", titleId, variant = "modal", titleExtra, footer, initialFocus, onClose }) {
  const generatedTitleId = React.useId();
  const dialogRef = React.useRef(null);
  useOverlayLayer({ open, onClose, layerRef: dialogRef, initialFocusRef: initialFocus });
  if (!open) return null;
  const isDrawer = variant === "drawer";
  return (
    <div data-mh-overlay-surface className={cx("mh-modal", variant === "sheet" && "mh-modal--sheet", isDrawer && "mh-modal--drawer")}>
      <div className="mh-modal__scrim" onClick={() => onClose?.({ reason: "scrim" })} />
      <div
        className={cx("mh-modal__dialog", className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId || generatedTitleId}
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="mh-modal__header">
          <div className="mh-modal__heading">
            {eyebrow ? <span className="mh-modal__eyebrow">{eyebrow}</span> : null}
            {titleExtra ? (
              <div className="mh-modal__titleline">
                <h2 className="mh-modal__title" id={titleId || generatedTitleId}>
                  {title}
                </h2>
                {titleExtra}
              </div>
            ) : (
              <h2 className="mh-modal__title" id={titleId || generatedTitleId}>
                {title}
              </h2>
            )}
          </div>
          <button type="button" className="mh-modal__close" aria-label={closeLabel} onClick={() => onClose?.({ reason: "button" })}>
            ×
          </button>
        </header>
        {isDrawer ? <div className="mh-modal__body">{children}</div> : children}
        {isDrawer && footer ? <footer className="mh-modal__foot">{footer}</footer> : null}
      </div>
    </div>
  );
}
