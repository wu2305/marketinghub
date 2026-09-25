import React from "react";
import { knowledgeActions } from "./knowledge-actions.js";

/**
 * One deterministic confirm/delete-blocked state machine for P07 management.
 * Copy and mutations remain owned by each library, since the source dialogs
 * and persistence models differ.
 */
export function useKnowledgeDialog({
  seed = null, resolveSeed, buildDialog, onDisable, onDelete, onEdit,
  onConfirm, onCancel, blockReferenced = false,
}) {
  const [pending, setPending] = React.useState(() => {
    if (!seed) return null;
    const record = resolveSeed?.(seed) || seed.record;
    return record ? { kind: seed.kind, record } : null;
  });
  const clear = React.useCallback(() => setPending(null), []);
  const request = (action, record, policy) => {
    if (!record) return;
    const gate = knowledgeActions(record, policy).find((item) => item.action === action);
    if (gate?.disabled) return;
    if (action === "edit") {
      onEdit?.(record);
      return;
    }
    if (action === "delete" && blockReferenced && record.references?.length) {
      setPending({ kind: "delete-blocked", record });
      return;
    }
    setPending({ kind: action === "delete" ? "delete-confirm" : "disable-confirm", record });
  };
  const confirm = (event) => {
    if (!pending) return;
    if (pending.kind === "delete-confirm") onDelete?.(pending.record);
    if (pending.kind === "disable-confirm") onDisable?.(pending.record);
    onConfirm?.(event, pending);
    setPending(null);
  };
  const cancel = (event) => {
    onCancel?.(event, pending);
    setPending(null);
  };
  return { dialog: pending ? buildDialog(pending.kind, pending.record) : null,
    pending, request, confirm, cancel, clear };
}
