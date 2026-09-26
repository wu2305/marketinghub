/** Accept string or labeled-value choices from a component's options prop. */
export function normalizeOptions(options = []) {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
}
