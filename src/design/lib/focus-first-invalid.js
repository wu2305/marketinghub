import React from "react";

/**
 * A failed Save, Submit or Publish moves focus to the first invalid control
 * inside `rootRef`, as the original forms do. The list of invalid field names
 * is compared across renders: fixing a field (the list only shrinks) or typing
 * elsewhere (the host keeps the same list) leaves focus alone, and the first
 * render never moves it.
 */
export function useFocusFirstInvalid(rootRef, invalid) {
  const previous = React.useRef(null);
  React.useEffect(() => {
    const before = previous.current;
    previous.current = invalid;
    if (before === null || before === invalid || !invalid.length) return;
    if (invalid.length < before.length && invalid.every((name) => before.includes(name))) return;
    rootRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [invalid, rootRef]);
}
