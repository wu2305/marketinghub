import React from "react";

/**
 * Instance-scoped "/" and Cmd/Ctrl+K search shortcut (types.js focuses the
 * visible search field on type pages). A shared dispatch picks exactly one
 * mounted instance — the one whose root contains the focused element, else
 * the most recently mounted — so two page instances on one host never both
 * steal the keypress.
 */
const instances = [];
let attached = false;

function dispatch(event) {
  const shortcut = event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k");
  if (!shortcut) return;
  const active = document.activeElement;
  const editing =
    active &&
    (active.matches("input, textarea, select") || active.getAttribute("contenteditable") === "true");
  if (editing) return;
  const entry =
    [...instances].reverse().find((item) => item.root()?.contains(active)) ||
    instances[instances.length - 1];
  const field = entry?.searchRef?.current;
  if (!field) return;
  event.preventDefault();
  field.focus();
}

/**
 * @param {object} props
 * @param {boolean} [props.enabled=true]
 * @param {React.RefObject} props.searchRef the search input to focus
 * @param {React.RefObject} props.rootRef element identifying this instance's scope
 */
export function useSearchShortcut({ enabled = true, searchRef, rootRef }) {
  React.useEffect(() => {
    if (!enabled) return undefined;
    const entry = { searchRef, root: () => rootRef?.current };
    instances.push(entry);
    if (!attached) {
      document.addEventListener("keydown", dispatch);
      attached = true;
    }
    return () => {
      const index = instances.indexOf(entry);
      if (index >= 0) instances.splice(index, 1);
      if (attached && !instances.length) {
        document.removeEventListener("keydown", dispatch);
        attached = false;
      }
    };
  }, [enabled, searchRef, rootRef]);
}
