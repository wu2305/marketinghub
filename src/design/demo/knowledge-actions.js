/**
 * Shared availability and management rules for the three P07 libraries.
 * Source gates: business-term-library.js:108-126, field-library.js:96-107,
 * scenario-reports.js:191-211. References are checked after a delete click
 * in field-library.js:702-710, so they do not disable the action button.
 */
export function knowledgeStatus(record) {
  const status = String(record?.status ?? "").toLowerCase();
  if (["disable", "disabled"].includes(status) || record?.disabled === true || record?.isDisabled === true || record?.usage_status === "Disabled" || record?.availability === "disabled") return "Disable";
  if (["enable", "enabled"].includes(status)) return "Enable";
  if (typeof record?.ai_interpreter_enabled === "boolean") return record.ai_interpreter_enabled ? "Enable" : "Disable";
  return "Enable";
}

export function knowledgeActions(record, { currentUser = "Current User", strings = {} } = {}) {
  const owner = (record.created_by || record.creator || record.owner) === currentUser;
  const disabled = knowledgeStatus(record) === "Disable";
  const labels = strings.actions || {};
  const tips = strings.tooltips || {};
  return ["edit", "delete", "disable"].map((action) => {
    const label = labels[action] || action[0].toUpperCase() + action.slice(1);
    const permission = typeof tips.permission === "function" ? tips.permission(action) : tips.permission || "Knowledge created by others cannot be operated.";
    const blocked = !owner || (action === "disable" ? disabled || record.stage === "Draft" && strings.draftCannotDisable !== false : !disabled);
    const title = !owner ? permission
      : action === "disable" && record.stage === "Draft" && strings.draftCannotDisable !== false ? tips.draftDisabled || "Draft knowledge is already disabled."
      : action === "disable" && disabled ? tips.alreadyDisabled || "Knowledge is already disabled."
      : action !== "disable" && !disabled ? tips.offlineFirst || "Disable knowledge first"
      : label;
    return { action, disabled: blocked, title, label };
  });
}
