import { useEffect } from "react";

export function useDocumentClass(className) {
  useEffect(() => {
    const names = className.split(/\s+/).filter(Boolean);
    document.body.classList.add(...names);
    return () => document.body.classList.remove(...names);
  }, [className]);
}
