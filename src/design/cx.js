export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function normalizeOptions(options = []) {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
}

/** Record field read that treats scalar and array fields uniformly. */
export function recordFieldValues(record, field) {
  const value = record[field];
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/** Sorted unique `{id,label}` options for a record field. */
export function uniqueFilterOptions(records, field) {
  const seen = new Set();
  for (const record of records) {
    for (const value of recordFieldValues(record, field)) seen.add(value);
  }
  return [...seen].sort().map((value) => ({ id: value, label: value }));
}

/** Match a record against a filter selection; `option.field` may redirect the record field. */
export function recordMatchesFilter(record, filter, value) {
  const option = (filter.options || []).find((item) => item.id === value);
  const field = option?.field || filter.id;
  const expected = option?.id ?? value;
  return recordFieldValues(record, field).includes(expected);
}
