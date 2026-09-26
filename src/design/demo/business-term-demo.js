/**
 * Demo state container for BusinessTermView — the deterministic local
 * stand-in for business-term-library.js on `?type=Business Term`. Takes
 * ordinary view props (data + initial state + host callbacks) and returns the
 * fully wired prop set. No Storybook imports; any host can drive the view the
 * same way. Mounted at page level so filter/search/page state survives type
 * switches, matching the module-level state in the original script.
 */
import React from "react";
import { knowledgeActions, knowledgeStatus } from "./knowledge-actions.js";
import { useKnowledgeDialog } from "./knowledge-dialog.js";

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
    status: knowledgeStatus(item),
    stage: item.stage || (item.status === "Disable" ? "Draft" : "Published"),
    creator: item.creator || currentUser,
    kind: item.kind || "Business Term",
    synonyms: Array.isArray(item.synonyms) ? [...item.synonyms] : [],
    scope: Array.isArray(item.scope) ? [...item.scope] : item.scope ? [item.scope] : [],
  };
}

const EMPTY_SELECTED = { status: [], creator: [] };

function cloneRecord(record) {
  return { ...record, status: knowledgeStatus(record), synonyms: [...(record.synonyms || [])], scope: [...(record.scope || [])] };
}

function buildList(records, drafts, currentUser) {
  /* Visibility is decided on the raw draft before normalisation, as in the original. */
  const visibleDrafts = (drafts || [])
    .filter((item) => item.stage !== "Draft" || item.creator === currentUser)
    .map((item) => normalizeDraft(item, currentUser));
  return [...visibleDrafts, ...(records || []).map(cloneRecord)];
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

  const shouldDerive = props.active !== false;
  const [list, setList] = React.useState(() => shouldDerive ? buildList(props.records, props.drafts, currentUser) : []);
  const seeded = React.useRef({ active: shouldDerive, records: props.records, drafts: props.drafts, currentUser });
  React.useEffect(() => {
    if (!shouldDerive || seeded.current.active && seeded.current.records === props.records && seeded.current.drafts === props.drafts && seeded.current.currentUser === currentUser) return;
    seeded.current = { active: true, records: props.records, drafts: props.drafts, currentUser };
    setList(buildList(props.records, props.drafts, currentUser));
  }, [shouldDerive, props.records, props.drafts, currentUser]);
  const [query, setQuery] = useSynced(props.query || "");
  const [selected, setSelected] = useSynced(props.selected || EMPTY_SELECTED);
  const [page, setPage] = useSynced(props.page || 1);
  const [pageSize, setPageSize] = useSynced(props.pageSize || 10);
  const [detailId, setDetailId] = useSynced(props.detail ?? null);
  const management = useKnowledgeDialog({
    buildDialog: (kind) => ({
      purpose: kind === "delete-confirm" ? "danger" : "confirm",
      title: dialogCopy.confirmTitle || "Confirm Operation",
      message: kind === "delete-confirm" ? dialogCopy.deleteMessage || "Please confirm whether to delete this knowledge. Deletion cannot be undone." : dialogCopy.offlineMessage || "Please confirm whether to offline this knowledge.",
      confirmLabel: kind === "delete-confirm" ? dialogCopy.deleteConfirm || "Confirm Delete" : dialogCopy.offlineConfirm || "Confirm Offline",
      cancelLabel: dialogCopy.cancelLabel || "Cancel",
    }),
    onDisable: (record) => setList((current) => current.map((item) => item.id === record.id ? { ...item, status: "Disable" } : item)),
    onDelete: (record) => {
      setList((current) => current.filter((item) => item.id !== record.id));
      setDetailId((current) => current === record.id ? null : current);
    },
    onEdit: (record) => props.onNavigate?.({ href: props.editHref ? props.editHref(record.id) : undefined, id: record.id }),
    onConfirm: (event) => props.onDialogConfirm?.(event),
    onCancel: (event) => props.onDialogCancel?.(event),
  });
  const [info, setInfo] = React.useState(null);
  const actionPolicy = { currentUser, strings };

  if (props.active === false) return null;

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

  const infoDialog = (title, message) => setInfo({ purpose: "info", title, message, closeLabel: dialogCopy.closeLabel || "Close" });
  const act = ({ action, id }) => {
    const record = list.find((item) => item.id === id);
    if (!record) return;
    props.onAction?.({ action, id });
    if (record.creator !== currentUser) {
      infoDialog(dialogCopy.permissionDeniedTitle || "Permission denied",
        dialogCopy.permissionDenied?.(action) || `You do not have permission to ${action} knowledge created by another user.`);
      return;
    }
    if (action !== "disable" && knowledgeStatus(record) === "Enable") {
      management.request("disable", record, actionPolicy);
      return;
    }
    if (action === "disable" && (knowledgeStatus(record) === "Disable" || record.stage === "Draft")) {
      infoDialog(dialogCopy.alreadyDisabledTitle || "Knowledge already disabled",
        dialogCopy.alreadyDisabledMessage || "This knowledge is already disabled.");
      return;
    }
    management.request(action, record, actionPolicy);
  };

  const creators = [...new Set(list.map((record) => record.creator))];
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((record) => ({
    ...record,
    actions: knowledgeActions(record, actionPolicy),
  }));
  const detailRow = detail ? { ...detail, actions: knowledgeActions(detail, actionPolicy) } : null;

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
    dialog: info || management.dialog,
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
      if (info) { setInfo(null); props.onDialogConfirm?.(event); }
      else management.confirm(event);
    },
    onDialogCancel: (event) => {
      if (info) { setInfo(null); props.onDialogCancel?.(event); }
      else management.cancel(event);
    },
    onCreate: (event) => props.onCreate?.(event),
  };
}
