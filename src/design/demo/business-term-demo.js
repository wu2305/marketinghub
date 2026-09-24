/**
 * Demo state container for BusinessTermView — the deterministic local
 * stand-in for business-term-library.js on `?type=Business Term`. Takes
 * ordinary view props (data + initial state + host callbacks) and returns the
 * fully wired prop set. No Storybook imports; any host can drive the view the
 * same way. Mounted at page level so filter/search/page state survives type
 * switches, matching the module-level state in the original script.
 */
import React from "react";

/** Controlled-prop mirror: local state re-syncs when the input value changes. */
function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}

/* localStorage drafts in the original are normalised the same way before they
   are unshifted in front of the seed records. */
function normalizeDraft(item, currentUser) {
  return {
    ...item,
    status: item.status === "Disable" ? "Disable" : "Enable",
    stage: item.stage || (item.status === "Disable" ? "Draft" : "Published"),
    creator: item.creator || currentUser,
    kind: item.kind || "Business Term",
    synonyms: Array.isArray(item.synonyms) ? [...item.synonyms] : [],
    scope: Array.isArray(item.scope) ? [...item.scope] : item.scope ? [item.scope] : [],
  };
}

const EMPTY_SELECTED = { status: [], creator: [] };

function cloneRecord(record) {
  return { ...record, synonyms: [...(record.synonyms || [])], scope: [...(record.scope || [])] };
}

function buildList(records, drafts, currentUser) {
  /* Visibility is decided on the raw draft before normalisation, as in the original. */
  const visibleDrafts = (drafts || [])
    .filter((item) => item.stage !== "Draft" || item.creator === currentUser)
    .map((item) => normalizeDraft(item, currentUser));
  return [...visibleDrafts, ...(records || []).map(cloneRecord)];
}

const ACTION_IDS = ["edit", "delete", "disable"];

/* actButtonTooltips() in the original. */
function actionTooltip(record, action, own, strings) {
  const labels = strings.actions || {};
  const tooltips = strings.tooltips || {};
  if (!own) return tooltips.permission ? tooltips.permission(action) : `You do not have permission to ${action} knowledge created by another user.`;
  if (action !== "disable" && record.status === "Enable") return tooltips.offlineFirst || "Disable knowledge first";
  if (action === "disable" && record.stage === "Draft") return tooltips.draftDisabled || "Draft knowledge is already disabled.";
  if (action === "disable" && record.status === "Disable") return tooltips.alreadyDisabled || "Knowledge is already disabled.";
  return labels[action] || action;
}

function recordActions(record, currentUser, strings) {
  const own = record.creator === currentUser;
  const labels = strings.actions || {};
  return ACTION_IDS.map((action) => ({
    action,
    disabled:
      !own ||
      (action === "disable" && (record.status === "Disable" || record.stage === "Draft")) ||
      (action !== "disable" && record.status !== "Disable"),
    title: actionTooltip(record, action, own, strings),
    label: labels[action] || action,
  }));
}

/**
 * @param {object} props ordinary BusinessTermView inputs:
 *   data (`records` seed rows, `drafts`, `currentUser`, `strings`,
 *   `createHref`, `editHref(id)`) + initial state (`query`, `selected`
 *   { status, creator }, `page`, `pageSize`, `detail` record id) + host
 *   callbacks (`onNavigate`, `onCreate`, `onQueryChange`, `onFilterToggle`,
 *   `onPage`, `onPageSize`, `onOpen`, `onCloseDetail`, `onAction`,
 *   `onDialogConfirm`, `onDialogCancel`)
 * @returns {object} BusinessTermView props
 */
export function useBusinessTermDemo(props) {
  const strings = props.strings || {};
  const dialogCopy = strings.dialogs || {};
  const currentUser = props.currentUser || "Current User";

  const [list, setList] = React.useState(() => buildList(props.records, props.drafts, currentUser));
  React.useEffect(() => setList(buildList(props.records, props.drafts, currentUser)), [props.records, props.drafts, currentUser]);
  const [query, setQuery] = useSynced(props.query || "");
  const [selected, setSelected] = useSynced(props.selected || EMPTY_SELECTED);
  const [page, setPage] = useSynced(props.page || 1);
  const [pageSize, setPageSize] = useSynced(props.pageSize || 10);
  const [detailId, setDetailId] = useSynced(props.detail ?? null);
  const [dialog, setDialog] = React.useState(null);

  const queryText = query.trim().toLowerCase();
  const matches = (record) =>
    [record.title, record.description, (record.synonyms || []).join(" "), (record.scope || []).join(" "), record.creator].some((field) =>
      String(field || "").toLowerCase().includes(queryText),
    );
  const filtered = list.filter((record) => {
    const statusPick = selected.status || [];
    if (statusPick.length && ![record.status, record.stage === "Draft" ? "Draft" : ""].some((value) => statusPick.includes(value))) return false;
    const creatorPick = selected.creator || [];
    if (creatorPick.length && !creatorPick.includes(record.creator)) return false;
    if (queryText && !matches(record)) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const detail = detailId ? list.find((record) => record.id === detailId) || null : null;

  const infoDialog = (title, message) =>
    setDialog({ tone: "info", title, message, closeLabel: dialogCopy.closeLabel || "Close" });
  const confirmDialog = (message, confirmLabel, run) =>
    setDialog({
      tone: "confirm",
      title: dialogCopy.confirmTitle || "Confirm Operation",
      message,
      confirmLabel,
      cancelLabel: dialogCopy.cancelLabel || "Cancel",
      run,
    });

  const act = ({ action, id }) => {
    const record = list.find((item) => item.id === id);
    if (!record) return;
    props.onAction?.({ action, id });
    const own = record.creator === currentUser;
    if (!own) {
      infoDialog(
        dialogCopy.permissionDeniedTitle || "Permission denied",
        dialogCopy.permissionDenied
          ? dialogCopy.permissionDenied(action)
          : `You do not have permission to ${action} knowledge created by another user.`,
      );
      return;
    }
    const enabledEdit = action !== "disable" && record.status === "Enable";
    if (enabledEdit) {
      /* The original asks to confirm offlining the knowledge before editing or
         deleting it. Confirming only flips the status; no toast is emitted
         (window.showKnowledgeSuccessToast is undefined in the original). */
      confirmDialog(
        dialogCopy.offlineMessage || "Please confirm whether to offline this knowledge.",
        dialogCopy.offlineConfirm || "Confirm Offline",
        () => setList((current) => current.map((item) => (item.id === id ? { ...item, status: "Disable" } : item))),
      );
      return;
    }
    if (action === "edit") {
      /* M5 create page (`mode=edit`) is not built — emit the real navigation
         target through the host callback instead of rendering a fake editor. */
      props.onNavigate?.({ href: props.editHref ? props.editHref(id) : undefined, id });
      return;
    }
    if (action === "delete") {
      confirmDialog(
        dialogCopy.deleteMessage || "Please confirm whether to delete this knowledge. Deletion cannot be undone.",
        dialogCopy.deleteConfirm || "Confirm Delete",
        () => {
          setList((current) => current.filter((item) => item.id !== id));
          if (detailId === id) setDetailId(null);
        },
      );
      return;
    }
    if (record.status === "Disable") {
      infoDialog(dialogCopy.alreadyDisabledTitle || "Knowledge already disabled", dialogCopy.alreadyDisabledMessage || "This knowledge is already disabled.");
      return;
    }
    confirmDialog(
      dialogCopy.offlineMessage || "Please confirm whether to offline this knowledge.",
      dialogCopy.offlineConfirm || "Confirm Offline",
      () => setList((current) => current.map((item) => (item.id === id ? { ...item, status: "Disable" } : item))),
    );
  };

  const creators = [...new Set(list.map((record) => record.creator))];
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((record) => ({
    ...record,
    actions: recordActions(record, currentUser, strings),
  }));
  const detailRow = detail ? { ...detail, actions: recordActions(detail, currentUser, strings) } : null;

  return {
    records: pageRows,
    totals: { shown: filtered.length, total: list.length },
    filters: [
      {
        id: "status",
        label: strings.statusLabel || "Status",
        allLabel: strings.statusAll || "All statuses",
        options: (strings.statusOptions || [
          { id: "Enable", label: "Enabled" },
          { id: "Disable", label: "Disabled" },
        ]),
        selected: [...(selected.status || [])],
      },
      {
        id: "creator",
        label: strings.creatorLabel || "Creator",
        allLabel: strings.creatorAll || "All creators",
        options: creators.map((creator) => ({ id: creator, label: creator })),
        selected: [...(selected.creator || [])],
      },
    ],
    query,
    page: currentPage,
    pageSize,
    pageSizes: props.pageSizes || [5, 10, 20],
    strings,
    createHref: props.createHref,
    detail: detailRow,
    dialog: dialog ? { tone: dialog.tone, title: dialog.title, message: dialog.message, confirmLabel: dialog.confirmLabel, cancelLabel: dialog.cancelLabel, closeLabel: dialog.closeLabel } : null,
    onQueryChange: (event) => {
      setQuery(event.value);
      setPage(1);
      props.onQueryChange?.(event);
    },
    onFilterToggle: (event) => {
      setSelected((current) => {
        const next = { status: [...(current.status || [])], creator: [...(current.creator || [])] };
        const values = next[event.id] || (next[event.id] = []);
        if (event.checked && !values.includes(event.value)) values.push(event.value);
        if (!event.checked) next[event.id] = values.filter((value) => value !== event.value);
        return next;
      });
      setPage(1);
      props.onFilterToggle?.(event);
    },
    onPage: (event) => {
      setPage(event.page);
      props.onPage?.(event);
    },
    onPageSize: (event) => {
      setPageSize(event.pageSize);
      setPage(1);
      props.onPageSize?.(event);
    },
    onOpen: (event) => {
      setDetailId(event.id);
      props.onOpen?.(event);
    },
    onAction: act,
    onCloseDetail: (event) => {
      setDetailId(null);
      props.onCloseDetail?.(event);
    },
    onDialogConfirm: (event) => {
      dialog?.run?.();
      setDialog(null);
      props.onDialogConfirm?.(event);
    },
    onDialogCancel: (event) => {
      setDialog(null);
      props.onDialogCancel?.(event);
    },
    onCreate: (event) => props.onCreate?.(event),
  };
}
