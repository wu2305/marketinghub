/**
 * Governance rules for shared knowledge (handover/design-intent/domain-model.md).
 * R1 only the creator may edit, delete or disable (field-library.js:32-33,
 *    business-term-library.js:106, scenario-reports.js:191).
 * R2 edit and delete need the item offline; disable needs it online
 *    (field-library.js:102, business-term-library.js:111-113, scenario-reports.js:196-198).
 * R3 drafts are always offline (analytical-model-form.js:266-272,
 *    business-term-library.js:112,119).
 */

/** @type {readonly ["edit", "delete", "disable"]} */
export const governedActionNames = ["edit", "delete", "disable"];

/** @type {readonly ["permission", "disable-first", "already-disabled"]} */
export const governanceReasons = ["permission", "disable-first", "already-disabled"];

/** Default copy; callers pass overrides from their content. */
export const governanceMessages = {
  permission: "Knowledge created by others cannot be operated.",
  "disable-first": "Disable knowledge first",
  "already-disabled": "This knowledge is already disabled.",
  dialogs: {
    permission: { title: "Permission denied", message: "Knowledge created by others cannot be operated.", confirmLabel: "OK" },
    "disable-first": {
      title: "Disable knowledge first",
      message: "To edit or delete this knowledge, take it offline first. Once offline, users cannot access it temporarily.",
      confirmLabel: "Disable",
    },
    "already-disabled": { title: "Knowledge already disabled", message: "This knowledge is already disabled.", confirmLabel: "OK" },
  },
};

const OFF = new Set(["disable", "disabled", "close", "closed"]);
const ON = new Set(["enable", "enabled", "open"]);

/**
 * One availability vocabulary for the source's five spellings (domain-model.md §3.1).
 * @param {object} record
 * @returns {"enabled" | "disabled"}
 */
export function availabilityOf(record = {}) {
  if (record.stage === "Draft") return "disabled";
  for (const key of ["availability", "status", "usage_status"]) {
    const value = String(record[key] ?? "").toLowerCase();
    if (OFF.has(value)) return "disabled";
    if (ON.has(value)) return "enabled";
  }
  for (const key of ["ai_interpretation_enabled", "ai_interpreter_enabled"]) {
    if (typeof record[key] === "boolean") return record[key] ? "enabled" : "disabled";
  }
  if (record.isDisabled === true || record.disabled === true) return "disabled";
  return "enabled";
}

/**
 * Which governed actions are blocked for `currentUser`, and why. Blocked
 * actions stay operable in the UI; the reason drives the explanation.
 * @param {object} record needs `created_by` or `creator`
 * @param {{ currentUser: string }} options
 * @returns {Array<{ action: typeof governedActionNames[number], blocked: boolean, reason: null | typeof governanceReasons[number] }>}
 */
export function governedActions(record = {}, { currentUser } = {}) {
  const creator = record.created_by ?? record.creator;
  const disabled = availabilityOf(record) === "disabled";
  return governedActionNames.map((action) => {
    let reason = null;
    if (creator !== currentUser) reason = "permission";
    else if (action === "disable" && disabled) reason = "already-disabled";
    else if (action !== "disable" && !disabled) reason = "disable-first";
    return { action, blocked: reason !== null, reason };
  });
}
