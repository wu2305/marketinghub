import "../tokens.css";
import React from "react";
import "./overlay.css";

// Overlay ownership belongs to the document, not a React root. This lets a
// host mount independent roots (or portals into another document) safely.
const documents = new WeakMap();
const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

function focusables(layer) {
  const view = layer.ownerDocument.defaultView;
  return [...layer.querySelectorAll(FOCUSABLE)].filter((element) => {
    for (let node = element; node && layer.contains(node); node = node.parentElement) {
      if (node.hidden || node.hasAttribute("inert") || node.getAttribute("aria-hidden") === "true") return false;
      const style = view?.getComputedStyle(node);
      if (style?.display === "none" || style?.visibility === "hidden") return false;
    }
    return true;
  });
}

function focusLayer(entry) {
  const layer = entry.layer;
  const preferred = entry.initialFocusRef?.current;
  const target = preferred && layer.contains(preferred) ? preferred : layer;
  target.focus();
}

function top(state) {
  return state.stack.at(-1);
}

function syncPaintOrder(state) {
  // The keyboard owner must also be the painted upper surface. A later opened
  // dialog may live in an earlier React root/DOM branch, while an initially
  // mounted child may register before its parent. Keep the original CSS when
  // one layer is open; only overlapping layers need inline stacking values.
  if (state.stack.length < 2) {
    for (const entry of state.stack) {
      entry.surface.style.zIndex = entry.originalZ;
      if (entry.scrim) entry.scrim.style.zIndex = entry.originalScrimZ;
    }
    return;
  }
  const base = Math.max(...state.stack.map((entry) => entry.naturalZ)) + 1;
  state.stack.forEach((entry, index) => {
    // A nested child cannot escape its parent's stacking context. Promote the
    // parent surface along with its upper child when another root overlaps it.
    const descendantTop = state.stack.reduce((highest, other, otherIndex) =>
      entry.surface.contains(other.surface) ? Math.max(highest, otherIndex) : highest, index);
    entry.surface.style.zIndex = String(base + descendantTop * 2 + 1);
    if (entry.scrim) entry.scrim.style.zIndex = String(base + descendantTop * 2);
  });
}

function stateFor(doc) {
  let state = documents.get(doc);
  if (state) return state;
  state = { stack: [], redirecting: false, batch: 0, batching: false };
  state.onKeyDown = (event) => {
    const entry = top(state);
    if (!entry) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      entry.onCloseRef.current?.({ reason: "escape" });
      return;
    }
    if (event.key !== "Tab" || !entry.trapFocus) return;
    const items = focusables(entry.layer);
    const first = items[0];
    const last = items.at(-1);
    const active = doc.activeElement;
    if (!first) {
      event.preventDefault();
      entry.layer.focus();
    } else if (!entry.layer.contains(active) || active === entry.layer) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey ? active === first : active === last) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  };
  state.onFocusIn = (event) => {
    const entry = top(state);
    if (!entry?.trapFocus || entry.layer.contains(event.target) || state.redirecting) return;
    state.redirecting = true;
    try {
      focusLayer(entry);
    } finally {
      state.redirecting = false;
    }
  };
  documents.set(doc, state);
  return state;
}

/**
 * Register one open dialog in its owner document. The last opened layer owns
 * Escape and the focus ring; closing it restores focus to its opener while
 * other layers keep the body scroll lock.
 * @param {object} options
 * @param {boolean} options.open
 * @param {(event: { reason: "escape" }) => void} [options.onClose]
 * @param {React.RefObject<HTMLElement>} options.layerRef
 * @param {React.RefObject<HTMLElement>} [options.initialFocusRef]
 * @param {React.RefObject<HTMLElement>} [options.returnFocusRef] stable opener when it becomes hidden as the overlay opens
 * @param {boolean} [options.trapFocus=true]
 * @returns {() => boolean} whether this layer currently owns keyboard focus
 */
export function useOverlayLayer({ open, onClose, layerRef, initialFocusRef, returnFocusRef, trapFocus = true }) {
  const onCloseRef = React.useRef(onClose);
  const entryRef = React.useRef(null);
  onCloseRef.current = onClose;

  React.useEffect(() => {
    if (!open || !layerRef.current) return undefined;
    const layer = layerRef.current;
    const doc = layer.ownerDocument;
    const state = stateFor(doc);
    const surface = layer.closest("[data-mh-overlay-surface]") ?? layer;
    const scrim = surface.previousElementSibling?.matches("[data-mh-overlay-scrim]") ? surface.previousElementSibling : null;
    // React runs descendant passive effects before ancestor effects. Layers
    // opened by one render therefore share a batch and follow DOM order; a
    // later user action starts a new batch and goes on top, even across roots.
    if (!state.batching) {
      state.batching = true;
      queueMicrotask(() => {
        state.batch += 1;
        state.batching = false;
      });
    }
    const entry = {
      layer, surface, scrim,
      originalZ: surface.style.zIndex,
      originalScrimZ: scrim?.style.zIndex,
      naturalZ: Number.parseInt(doc.defaultView?.getComputedStyle(surface).zIndex, 10) || 0,
      previous: returnFocusRef?.current ?? doc.activeElement,
      initialFocusRef, onCloseRef, trapFocus, batch: state.batch,
    };
    entryRef.current = { doc, entry };
    if (!state.stack.length) {
      doc.addEventListener("keydown", state.onKeyDown, true);
      doc.addEventListener("focusin", state.onFocusIn, true);
    }
    const follows = doc.defaultView?.Node?.DOCUMENT_POSITION_FOLLOWING ?? 4;
    const insertAt = state.stack.findIndex((other) => other.batch === entry.batch && (layer.compareDocumentPosition(other.layer) & follows));
    if (insertAt < 0) state.stack.push(entry);
    else {
      const upper = state.stack[insertAt];
      entry.previous = upper.previous;
      upper.previous = initialFocusRef?.current ?? layer;
      state.stack.splice(insertAt, 0, entry);
    }
    syncPaintOrder(state);
    doc.body.classList.add("dialog-open");
    if (top(state) === entry) focusLayer(entry);

    return () => {
      const wasTop = top(state) === entry;
      const active = doc.activeElement;
      state.stack.splice(state.stack.indexOf(entry), 1);
      surface.style.zIndex = entry.originalZ;
      if (scrim) scrim.style.zIndex = entry.originalScrimZ;
      syncPaintOrder(state);
      entryRef.current = null;
      if (!state.stack.length) {
        doc.removeEventListener("keydown", state.onKeyDown, true);
        doc.removeEventListener("focusin", state.onFocusIn, true);
        doc.body.classList.remove("dialog-open");
      }
      if (!wasTop) return;
      const next = top(state);
      const shouldRestore = layer.contains(active) || active === doc.body || active === doc.documentElement;
      if (!shouldRestore) return;
      if (entry.previous?.isConnected && (!next || next.layer.contains(entry.previous))) entry.previous.focus();
      else if (next) focusLayer(next);
    };
  }, [open, layerRef, initialFocusRef, returnFocusRef, trapFocus]);

  return React.useCallback(() => {
    const current = entryRef.current;
    return Boolean(current && top(stateFor(current.doc)) === current.entry);
  }, []);
}
