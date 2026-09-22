export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function normalizeOptions(options = []) {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
}
