import React from "react";
import { Icon } from "../icons.jsx";
import { useOverlayLayer } from "./overlay.js";

/**
 * Shared assistant behavior and real header/history markup. Each assistant
 * supplies its existing outer surface, feed, and composer as distinct slots.
 */
export function AssistantShell({
  open,
  layerRef,
  initialFocusRef,
  actionFocusRef = initialFocusRef,
  closeRef,
  returnFocusRef,
  title,
  classes,
  history = [],
  historyHeading,
  historyAriaLabel,
  historyCloseLabel,
  shortMaximizeLabel = true,
  onClose,
  onNewSession,
  onMaximize,
  onHistory,
  onHistorySelect,
  renderSurface,
  body,
  composer,
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const historyRef = React.useRef(null);

  useOverlayLayer({
    open,
    onClose: (event) => {
      setHistoryOpen(false);
      onClose?.(event);
    },
    layerRef,
    initialFocusRef,
    returnFocusRef,
  });

  React.useEffect(() => {
    if (open) return;
    setExpanded(false);
    setHistoryOpen(false);
  }, [open]);

  React.useEffect(() => {
    if (!historyOpen) return undefined;
    const doc = layerRef.current?.ownerDocument;
    const onClick = (event) => {
      if (!historyRef.current?.contains(event.target)) setHistoryOpen(false);
    };
    doc?.addEventListener("click", onClick);
    return () => doc?.removeEventListener("click", onClick);
  }, [historyOpen, layerRef]);

  const popup = historyOpen ? (
    <div className={classes.historyPopup} role="dialog" aria-label={historyAriaLabel}>
      <div className={classes.historyHead}>
        {historyHeading}
        <button type="button" aria-label={historyCloseLabel} onClick={() => setHistoryOpen(false)}>×</button>
      </div>
      <div className={classes.historyList}>
        {history.map((item) => (
          <button
            key={item.id || item.title || item.subtitle}
            className={classes.historyItem}
            type="button"
            onClick={() => {
              setHistoryOpen(false);
              onHistorySelect?.(item.source);
              actionFocusRef.current?.focus();
            }}
          >
            <strong>{item.title}</strong>
            <span>{item.subtitle}</span>
          </button>
        ))}
      </div>
    </div>
  ) : null;

  const header = (
    <header className={classes.header}>
      {title}
      <div className={classes.actions}>
        <button type="button" className={classes.icon} aria-label="New session" onClick={() => {
          setHistoryOpen(false);
          onNewSession?.();
          actionFocusRef.current?.focus();
        }}><Icon name="plus" /></button>
        <button
          type="button"
          className={classes.icon}
          aria-label={shortMaximizeLabel ? (expanded ? "Restore" : "Maximize") : expanded ? "Restore AI Interpreter panel" : "Maximize AI Interpreter panel"}
          title={expanded ? "Restore" : "Maximize"}
          onClick={() => {
            const next = !expanded;
            setExpanded(next);
            onMaximize?.({ expanded: next });
          }}
        ><Icon name="expand" /></button>
        <div className={classes.historyAnchor} ref={historyRef}>
          <button type="button" className={classes.icon} aria-label="History" aria-expanded={historyOpen} onClick={(event) => {
            event.stopPropagation();
            const next = !historyOpen;
            setHistoryOpen(next);
            onHistory?.({ open: next });
          }}><Icon name="history" /></button>
          {popup}
        </div>
        <button ref={closeRef} type="button" className={classes.close} aria-label={classes.closeLabel} onClick={() => onClose?.({ reason: "button" })}>×</button>
      </div>
    </header>
  );

  return renderSurface({ header, body, composer, expanded });
}
