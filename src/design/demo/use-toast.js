import React from "react";

const TOAST_MS = 3000;

/**
 * Transient success message for demo hooks (pattern B8): `showToast(text)`
 * shows it for three seconds, a newer message replaces the older one and
 * `hideToast()` clears it at once.
 * @returns {{ toast: string, showToast: (message: string) => void, hideToast: () => void }}
 */
export function useToast() {
  const [toast, setToast] = React.useState("");
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const showToast = React.useCallback((message) => {
    clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(""), TOAST_MS);
  }, []);
  const hideToast = React.useCallback(() => {
    clearTimeout(timer.current);
    setToast("");
  }, []);
  return { toast, showToast, hideToast };
}
