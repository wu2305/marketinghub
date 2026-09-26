/**
 * Demo state container for BusinessTermView — the deterministic local
 * stand-in for business-term-library.js on `?type=Business Term`. Takes
 * ordinary view props (data + initial state + host callbacks) and returns the
 * fully wired prop set. No Storybook imports; any host can drive the view the
 * same way. Mounted at page level so filter/search/page state survives type
 * switches, matching the module-level state in the original script.
 *
 * Governance follows lib/governance.js and patterns/library.md B6–B8:
 * blocked actions explain themselves; "disable first" offers the fix and
 * then continues the requested action; completed changes show a toast.
 */
import React from "react";
import { availabilityOf, governanceMessages, governedActions } from "../lib/governance.js";

/** Controlled-prop mirror: local state re-syncs when the input value changes. */
function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}

const statusOf = (record) => (availabilityOf(record) === "enabled" ? "Enable" : "Disable");

/* Drafts written by the create page are unshifted ahead of the seed records
   (business-term-library.js:85-93). A draft is always offline (R3). */
function normalizeDraft(item, currentUser) {
  const stage = item.stage || (item.status === "Disable" ? "Draft" : "Published");
  return {
    ...item,
    stage,
    status: stage === "Draft" ? "Disable" : statusOf(item),
    creator: item.creator || currentUser,
    kind: item.kind || "Business Term",
    synonyms: Array.isArray(item.synonyms) ? [...item.synonyms] : [],
    scope: Array.isArray(item.scope) ? [...item.scope] : item.scope ? [item.scope] : [],
  };
}

const EMPTY_SELECTED = { status: [], creator: [] };

function cloneRecord(record) {
  return { ...record, status: statusOf(record), synonyms: [...(record.synonyms || [])], scope: [...(record.scope || [])] };
}

function buildList(records, drafts, currentUser) {
  /* A draft is visible only to its creator (R3). The source checks the raw
     draft before deriving its stage (business-term-library.js:85-89), so a
     stage-less draft of another user leaked through; normalising first
     applies the rule to every draft (dispositions BT-04). */
  const visibleDrafts = (drafts || [])
    .map((item) => normalizeDraft(item, currentUser))
    .filter((item) => item.stage !== "Draft" || item.creator === currentUser);
  return [...visibleDrafts, ...(records || []).map(cloneRecord)];
}

const TOAST_MS = 3000;

/**
 * @param {object} props ordinary BusinessTermView inputs:
 *   data (`records` seed rows, `drafts`, `currentUser`, `strings`,
 *   `createHref`, `editHref(id)`) + initial state (`query`, `selected`
 *   { status, creator }, `page`, `pageSize`, `detail` record id) + host
 *   callbacks (`onNavigate`, `onCreate`, `onQueryChange`, `onFilterToggle`,
 *   `onClearFilters`, `onPage`, `onPageSize`, `onOpen`, `onCloseDetail`,
 *   `onAction`, `onDialogConfirm`, `onDialogCancel`)
 * @returns {object} BusinessTermView props
 */
export function useBusinessTermDemo(props) {
  const strings = props.strings || {};
  const copy = strings.dialogs || {};
  const tooltips = { ...governanceMessages, ...(strings.tooltips || {}) };
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
  /* { kind: "info"|"disable-first"|"disable"|"delete", record?, then?, title?, message? } */
  const [pending, setPending] = React.useState(null);
  const [toast, setToast] = React.useState("");
  const toastTimer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(toastTimer.current), []);

  if (props.active === false) return null;

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), TOAST_MS);
  };
  const setStatus = (id, status) => setList((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  const remove = (id) => {
    setList((current) => current.filter((item) => item.id !== id));
    setDetailId((current) => current === id ? null : current);
  };
  const edit = (record) => props.onNavigate?.({ href: props.editHref ? props.editHref(record.id) : undefined, id: record.id });

  const queryText = query.trim().toLowerCase();
  const matches = (record) =>
    [record.title, record.description, (record.synonyms || []).join(" "), (record.scope || []).join(" "), record.creator].some((field) =>
      String(field || "").toLowerCase().includes(queryText),
    );
  const filtered = list.filter((record) => {
    const statusPick = selected.status || [];
    if (statusPick.length && !statusPick.includes(record.status)) return false;
    const creatorPick = selected.creator || [];
    if (creatorPick.length && !creatorPick.includes(record.creator)) return false;
    if (queryText && !matches(record)) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const detail = detailId ? list.find((record) => record.id === detailId) || null : null;
  const withActions = (record) => ({ ...record, actions: governedActions(record, { currentUser }) });

  /* Pattern B6-B8. business-term-library.js:199-250 is the source flow. */
  const act = (event) => {
    const record = list.find((item) => item.id === event.id);
    if (!record) return;
    props.onAction?.(event);
    if (event.reason === "permission") {
      setPending({ kind: "info", title: copy.permissionDeniedTitle || "Permission denied", message: tooltips.permission });
    } else if (event.reason === "already-disabled") {
      setPending({ kind: "info", title: copy.alreadyDisabledTitle || "Knowledge already disabled", message: tooltips["already-disabled"] });
    } else if (event.reason === "disable-first") {
      setPending({ kind: "disable-first", record, then: event.action });
    } else if (event.action === "edit") {
      edit(record);
    } else {
      setPending({ kind: event.action, record });
    }
  };

  const dialogFor = (state) => {
    if (!state) return null;
    if (state.kind === "info") return { purpose: "info", title: state.title, message: state.message, closeLabel: copy.closeLabel || "Close" };
    if (state.kind === "disable-first") {
      return {
        purpose: "warning",
        title: copy.offlineFirstTitle || "Please take the knowledge offline first",
        message: copy.offlineFirstMessage || governanceMessages.dialogs["disable-first"].message,
        confirmLabel: copy.offlineFirstConfirm || "Go Offline",
        cancelLabel: copy.cancelLabel || "Cancel",
      };
    }
    const isDelete = state.kind === "delete";
    return {
      purpose: isDelete ? "danger" : "warning",
      title: copy.confirmTitle || "Confirm Operation",
      message: isDelete ? copy.deleteMessage || "Please confirm whether to delete this knowledge. Deletion cannot be undone." : copy.offlineMessage || "Please confirm whether to offline this knowledge.",
      confirmLabel: isDelete ? copy.deleteConfirm || "Confirm Delete" : copy.offlineConfirm || "Confirm Offline",
      cancelLabel: copy.cancelLabel || "Cancel",
    };
  };

  const confirm = (event) => {
    const state = pending;
    setPending(null);
    props.onDialogConfirm?.(event);
    if (!state || state.kind === "info") return;
    if (state.kind === "disable-first") {
      setStatus(state.record.id, "Disable");
      showToast(copy.disabledToast || "Disabled successfully");
      if (state.then === "edit") edit(state.record);
      if (state.then === "delete") setPending({ kind: "delete", record: { ...state.record, status: "Disable" } });
      return;
    }
    if (state.kind === "disable") {
      setStatus(state.record.id, "Disable");
      showToast(copy.disabledToast || "Disabled successfully");
    }
    if (state.kind === "delete") {
      remove(state.record.id);
      showToast(copy.deletedToast || "Deleted successfully");
    }
  };

  const creators = [...new Set(list.map((record) => record.creator))];
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(withActions);

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
    strings: { ...strings, tooltips },
    createHref: props.createHref,
    detail: detail ? withActions(detail) : null,
    dialog: dialogFor(pending),
    toast,
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
    onClearFilters: (event) => {
      setQuery("");
      setSelected(EMPTY_SELECTED);
      setPage(1);
      props.onClearFilters?.(event);
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
    onDialogConfirm: confirm,
    onDialogCancel: (event) => {
      setPending(null);
      props.onDialogCancel?.(event);
    },
    onCreate: (event) => props.onCreate?.(event),
  };
}
