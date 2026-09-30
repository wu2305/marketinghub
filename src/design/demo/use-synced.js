import React from "react";

/**
 * Local state seeded from a controlled input and re-synced whenever that input
 * changes: interaction writes back through state (typing keeps its result),
 * while a host or Controls edit still drives the value.
 * Private demo composition, not a public export.
 */
export function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}
