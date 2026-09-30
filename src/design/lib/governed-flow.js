import React from "react";
import { governanceMessages } from "./governance.js";

/**
 * @typedef {object} GovernedFlowCopy Dialog labels; every key falls back to the shared English default.
 * @property {string} [permissionDeniedTitle]
 * @property {string} [alreadyDisabledTitle]
 * @property {string} [closeLabel]
 * @property {string} [cancelLabel]
 * @property {string} [offlineFirstTitle]
 * @property {string} [offlineFirstMessage]
 * @property {string} [offlineFirstConfirm]
 * @property {string} [confirmTitle]
 * @property {string} [offlineMessage]
 * @property {string} [offlineConfirm]
 * @property {string} [deleteMessage]
 * @property {string} [deleteConfirm]
 */

/**
 * @typedef {object} GovernedFlowOptions
 * @property {GovernedFlowCopy} [copy]
 * @property {Partial<Record<"permission"|"disable-first"|"already-disabled", string>>} [tooltips] Blocked-action explanations; defaults to `governanceMessages`.
 * @property {(id: string) => any} find Look a record up by the `id` of the view's `onAction` event.
 * @property {(record: any) => any} [onDisable] Take the record offline (and show the toast). May return the updated record; the flow continues with it.
 * @property {(record: any) => void} [onDelete] Remove the record (and show the toast).
 * @property {(record: any) => void} [onEdit] Open the editor.
 * @property {(record: any) => ({ title?: string, message: string } | null | undefined)} [deleteBlocked] An explanation when this record cannot be deleted; shown instead of the delete confirm.
 */

/**
 * The blocked-reason, dialog, confirm, change flow that the governed library views leave to the page:
 * a blocked action explains itself, "disable first" offers the fix and then continues the requested
 * action, delete and disable ask for confirmation. Wire `onAction`, `dialog`, `onDialogConfirm` and
 * `onDialogCancel` to a library view (`BusinessTermView`, `FieldLibraryView`, `ScenarioReportsView`);
 * the record changes and toasts stay with the callbacks.
 * @param {GovernedFlowOptions} options
 * @returns {{
 *   dialog: null | { purpose: "info"|"warning"|"danger", title: string, message: string, closeLabel?: string, confirmLabel?: string, cancelLabel?: string },
 *   onAction: (event: { action: "edit"|"delete"|"disable", id: string, reason?: string|null }) => void,
 *   onDialogConfirm: () => void,
 *   onDialogCancel: () => void,
 * }}
 */
export function useGovernedFlow({ find, copy = {}, tooltips = governanceMessages, onDisable, onDelete, onEdit, deleteBlocked }) {
  const [pending, setPending] = React.useState(null);
  const dialogs = governanceMessages.dialogs;

  const requestDelete = (record) => {
    const blocked = deleteBlocked?.(record);
    setPending(blocked ? { kind: "info", title: blocked.title || copy.deleteBlockedTitle || "Deletion blocked", message: blocked.message } : { kind: "delete", record });
  };
  const disable = (record) => onDisable?.(record) || { ...record, status: "Disable" };

  const onAction = ({ action, id, reason = null }) => {
    const record = find(id);
    if (!record) return;
    if (reason === "permission") setPending({ kind: "info", title: copy.permissionDeniedTitle || dialogs.permission.title, message: tooltips.permission ?? governanceMessages.permission });
    else if (reason === "already-disabled") setPending({ kind: "info", title: copy.alreadyDisabledTitle || dialogs["already-disabled"].title, message: tooltips["already-disabled"] ?? governanceMessages["already-disabled"] });
    else if (reason === "disable-first") setPending({ kind: "disable-first", record, then: action });
    else if (action === "edit") onEdit?.(record);
    else if (action === "delete") requestDelete(record);
    else setPending({ kind: "disable", record });
  };

  const onDialogConfirm = () => {
    const state = pending;
    setPending(null);
    if (!state || state.kind === "info") return;
    if (state.kind === "disable-first") {
      const offline = disable(state.record);
      if (state.then === "edit") onEdit?.(offline);
      if (state.then === "delete") requestDelete(offline);
    } else if (state.kind === "disable") disable(state.record);
    else if (state.kind === "delete") onDelete?.(state.record);
  };

  let dialog = null;
  if (pending?.kind === "info") dialog = { purpose: "info", title: pending.title, message: pending.message, closeLabel: copy.closeLabel || "Close" };
  else if (pending?.kind === "disable-first") {
    dialog = {
      purpose: "warning",
      title: copy.offlineFirstTitle || dialogs["disable-first"].title,
      message: copy.offlineFirstMessage || dialogs["disable-first"].message,
      confirmLabel: copy.offlineFirstConfirm || "Go Offline",
      cancelLabel: copy.cancelLabel || "Cancel",
    };
  } else if (pending) {
    const isDelete = pending.kind === "delete";
    dialog = {
      purpose: isDelete ? "danger" : "warning",
      title: copy.confirmTitle || "Confirm Operation",
      message: isDelete ? copy.deleteMessage || "Please confirm whether to delete this knowledge. Deletion cannot be undone." : copy.offlineMessage || "Please confirm whether to offline this knowledge.",
      confirmLabel: isDelete ? copy.deleteConfirm || "Confirm Delete" : copy.offlineConfirm || "Confirm Offline",
      cancelLabel: copy.cancelLabel || "Cancel",
    };
  }

  return { dialog, onAction, onDialogConfirm, onDialogCancel: () => setPending(null) };
}
