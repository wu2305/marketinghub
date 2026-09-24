import "../tokens.css";
import React from "react";
import "./overlay.css";


/* `dialog-open` locks body scroll while any overlay is open. The original demo
   toggles it per dialog, but nested overlays must not unlock the page when an
   inner one closes — so holds are ref-counted per document.body and the class
   comes off only when the last open overlay releases. */
const scrollLockHolds = new WeakMap();
export function useBodyScrollLock(active) {
  React.useEffect(() => {
    if (!active) return undefined;
    const body = document.body;
    scrollLockHolds.set(body, (scrollLockHolds.get(body) || 0) + 1);
    body.classList.add("dialog-open");
    return () => {
      const next = (scrollLockHolds.get(body) || 1) - 1;
      scrollLockHolds.set(body, Math.max(0, next));
      if (next <= 0) body.classList.remove("dialog-open");
    };
  }, [active]);
}

/* Each overlay remembers the element that had focus when it opened. On close
   the opener is refocused only when focus is still inside the closing layer or
   on the page body — an inner overlay closing hands focus back to its own
   opener, while an outer overlay closing underneath a focused inner one does
   not steal it. `layerRef` points at the overlay's root element. */
export function useFocusRestore(active, layerRef) {
  const previousRef = React.useRef(null);
  React.useEffect(() => {
    if (!active) {
      previousRef.current = null;
      return undefined;
    }
    previousRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      const previous = previousRef.current;
      previousRef.current = null;
      if (!previous || !previous.isConnected) return;
      const activeEl = document.activeElement;
      const layer = layerRef?.current;
      const inside = layer ? layer.contains(activeEl) : false;
      if (inside || !activeEl || activeEl === document.body || activeEl === document.documentElement) previous.focus();
    };
  }, [active]);
}
