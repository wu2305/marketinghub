import React from "react";

/**
 * Runs `reset` once, during render, whenever `key` changes. For demo state that
 * belongs to one record (for example a Copilot thread about one report): the
 * thread must not outlive the record it was about, and the reset has to land
 * before the next paint so no frame shows the old thread under the new record.
 * Private demo composition, not a public export.
 */
export function useResetOnChange(key, reset) {
  const [seen, setSeen] = React.useState(key);
  if (seen !== key) {
    setSeen(key);
    reset();
  }
}
