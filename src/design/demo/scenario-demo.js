import React from "react";

/**
 * Deterministic demo state for the Scenario Reporting library —
 * `useScenarioDemo` mirrors assets/js/knowledge/scenario-reports.js: the
 * `normalizeScenarioRecord` mapping, the query/status/process filters, the
 * Draft-visibility rule for records owned by others, the gated card/drawer
 * actions and the shared detail drawer.
 */

const SCENARIO_REPORTS = {
  "Invest City Strategy Analysis": "/assets/pages/reports.html?project=city&dashboard=0",
  "City Analysis Dashboard": "/assets/pages/reports.html?project=city&dashboard=1",
  "4P Executive Overview": "/assets/pages/reports.html?project=fourp&dashboard=0",
  "Promotion Lift Analysis": "/assets/pages/reports.html?project=fourp&dashboard=1",
  "Customer Daily Pulse": "/assets/pages/reports.html?project=customer&dashboard=0",
  "Customer Funnel Watch": "/assets/pages/reports.html?project=customer&dashboard=1",
  "Audience Build Overview": "/assets/pages/reports.html?project=abo&dashboard=0",
  "Campaign Quality Watch": "/assets/pages/reports.html?project=abo&dashboard=1",
  "Rednote Media Tracking": "/assets/pages/reports.html?project=rednote&dashboard=0",
  "Creative Quality Monitor": "/assets/pages/reports.html?project=rednote&dashboard=1",
  "OTT / OLV Exposure Tracking": "/assets/pages/reports.html?project=ottolv&dashboard=0",
  "Source Integrity Monitor": "/assets/pages/reports.html?project=ottolv&dashboard=1",
};

const WORKFLOW_STATES = ["Draft", "Queued", "Building", "Published"];

function workflowStatus(value, fallback = "Draft") {
  const candidate = String(value || "").trim();
  if (WORKFLOW_STATES.includes(candidate)) return candidate;
  if (/queued/i.test(candidate)) return "Queued";
  if (/build|develop|processing|review/i.test(candidate)) return "Building";
  if (/ready|live|published|calibrate/i.test(candidate)) return "Published";
  return fallback;
}

function list(value) {
  return Array.isArray(value)
    ? value
    : String(value || "")
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean);
}

/** Verbatim port of scenario-reports.js normalizeScenarioRecord(). */
export function normalizeScenarioRecord(asset) {
  const report = asset.report || asset.report_name || "";
  const workflow = workflowStatus(
    asset.workflow_status || asset.stage || asset.statusDisplay || asset.status,
    asset.published ? "Published" : "Draft",
  );
  const enabled =
    typeof asset.ai_interpreter_enabled === "boolean"
      ? asset.ai_interpreter_enabled
      : asset.status === "Enable" ||
        asset.statusDisplay === "Published" ||
        (workflow === "Published" && asset.disabled !== true);
  const description = asset.description || asset.summary || "";
  const structureGuidance = asset.structure_guidance || asset.analysisLogic || asset.output || "";
  return {
    ...asset,
    type: "Scenario Reporting",
    title: asset.title || asset.name || "Untitled Scenario Reporting",
    description,
    summary: asset.summary || description,
    report,
    reportHref: asset.reportHref || SCENARIO_REPORTS[report] || "",
    creator: asset.creator || asset.owner || "Current User",
    owner: asset.owner || asset.creator || "Current User",
    updated: asset.updated || asset.update || "Not recorded",
    workflow_status: workflow,
    ai_interpreter_enabled: Boolean(enabled),
    status: Boolean(enabled) ? "Enable" : "Disable",
    stage: workflow,
    statusDisplay: workflow,
    structure_guidance: structureGuidance,
    analysisLogic: structureGuidance,
    attachments: list(asset.attachments),
    created: asset.created || asset.created_at || "Not recorded",
    created_at: asset.created_at || asset.created || "Not recorded",
  };
}

/** scenario-reports.js editUrl — the knowledge-create deep link. */
function editScenarioHref(record) {
  const url = new URL("/assets/pages/knowledge-create.html", "http://local/");
  url.searchParams.set("type", "Scenario Reporting");
  url.searchParams.set("mode", "edit");
  url.searchParams.set("id", record.id);
  url.searchParams.set("title", record.title || "");
  url.searchParams.set("report", record.report || "");
  url.searchParams.set("reportHref", record.reportHref || "");
  url.searchParams.set("description", record.description || "");
  url.searchParams.set("blueprint", record.structure_guidance || record.analysisLogic || "");
  url.searchParams.set("workflow_status", record.workflow_status || "");
  url.searchParams.set("ai_interpreter_enabled", String(Boolean(record.ai_interpreter_enabled)));
  url.searchParams.set("attachments", (record.attachments || []).join("|"));
  url.searchParams.set("creator", record.creator || "");
  return url.pathname + url.search;
}

const DEFAULT_STRINGS = {
  eyebrow: "SCENARIO REPORTING",
  searchLabel: "Search knowledge",
  searchPlaceholder: "Search knowledge...",
  createLabel: "Add Scenario reporting",
  filters: [
    { id: "status", label: "Status", allLabel: "All statuses", options: ["Enabled", "Disabled"].map((id) => ({ id, label: id })) },
    { id: "process", label: "Process", allLabel: "All statuses", options: WORKFLOW_STATES.map((id) => ({ id, label: id })) },
  ],
  empty: "No matching records",
  recordsLabel: "records",
  rowsPerPage: "Rows per page",
  previous: "Previous",
  next: "Next",
  relatedReport: "Related Report",
  description: "Description",
  structureGuidance: "Structure & Guidance",
  supportingFiles: "Supporting Files",
  workflowNote: "AI Interpreter is enabled automatically when Processing Status becomes Published.",
  createdBy: "Created By",
  createdAt: "Created At",
  updatedAt: "Updated At",
  enabled: "Enabled",
  disabled: "Disabled",
  editLabel: "Edit",
  deleteLabel: "Delete",
  disableLabel: "Disable",
  permissionTitle: "Knowledge created by others cannot be operated.",
  alreadyDisabled: "This knowledge is already disabled.",
  confirmTitle: "Confirm Operation",
  deleteConfirmMessage: "Please confirm whether to delete this knowledge. Deletion cannot be undone.",
  deleteConfirmLabel: "Confirm Delete",
  disableConfirmMessage: "Please confirm whether to disable this knowledge.",
  disableConfirmLabel: "Confirm Disable",
  cancelLabel: "Cancel",
  closeDetailLabel: "Close knowledge asset",
};

const EMPTY_SELECTED = {};

function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}

/**
 * @param {object} props
 * @param {Array<object>} [props.records] raw records — normalized internally
 * @param {string} [props.currentUser="Current User"] owner identity for the action gate
 * @param {object} [props.strings] copy overrides (defaults reproduce the original copy)
 * @param {Array<number>} [props.pageSizes=[5,10,20]]
 * @param {string} [props.createHref] knowledge-create.html?type=Scenario Reporting
 * @param {string} [props.query] initial search text
 * @param {Object<string,string>} [props.filterValues] initial `status`/`process` selections
 * @param {number} [props.page=1]
 * @param {number} [props.pageSize=10]
 * @param {string|object|null} [props.detail] record id (or record) open in the drawer
 * @param {object} [props.dialog] seeded dialog `{ kind, record }` — kinds:
 *   `"disable-first"`, `"delete-confirm"`, `"disable-confirm"`
 * @param {(href: string) => void} [props.onNavigate] create/edit/report links
 * @param {(record: object) => void} [props.onOpen] / [props.onCloseDetail]
 * @param {(event: { action: string, record: object }) => void} [props.onAction]
 * @param {(dialog: object) => void} [props.onDialogConfirm] / [props.onDialogCancel]
 * @param {(value: string) => void} [props.onQueryChange]
 * @param {(event: { id: string, value: string }) => void} [props.onFilterChange]
 * @param {(page: number) => void} [props.onPage] / [props.onPageSize]
 * @param {() => void} [props.onCreate]
 */
export function useScenarioDemo(props = {}) {
  const strings = { ...DEFAULT_STRINGS, ...(props.strings || {}) };
  const pageSizes = props.pageSizes || [5, 10, 20];
  const currentUser = props.currentUser || "Current User";
  const all = React.useMemo(() => (props.records || []).map(normalizeScenarioRecord), [props.records]);

  const [query, setQuery] = useSynced(props.query || "");
  const [selected, setSelected] = useSynced(props.filterValues || EMPTY_SELECTED);
  const [page, setPage] = useSynced(props.page ?? 1);
  const [pageSize, setPageSize] = useSynced(props.pageSize ?? 10);
  const [detailId, setDetailId] = useSynced(
    typeof props.detail === "string" ? props.detail : props.detail?.id ?? null,
  );
  const [records, setRecords] = React.useState(null);
  const list = records || all;

  React.useEffect(() => {
    setPage(1);
  }, [query, selected.status, selected.process, pageSize, setPage]);

  const isOwn = (item) => (item.creator || item.owner) === currentUser;
  const queryText = query.trim().toLowerCase();
  const filtered = list.filter((item) => {
    if (item.workflow_status === "Draft" && !isOwn(item)) return false;
    const matchesQuery =
      !queryText ||
      [
        item.title,
        item.description,
        item.report,
        item.creator,
        item.workflow_status,
        item.structure_guidance,
        (item.attachments || []).join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(queryText);
    const matchesProcess = !selected.process || item.workflow_status === selected.process;
    const matchesStatus =
      !selected.status ||
      (selected.status === "Enabled" ? item.ai_interpreter_enabled : !item.ai_interpreter_enabled);
    return matchesQuery && matchesProcess && matchesStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const detailRecord = list.find((record) => record.id === detailId) || null;

  const patch = (id, next) =>
    setRecords((prev) => (prev || all).map((item) => (item.id === id ? { ...item, ...next } : item)));

  /* Seeded shape is light: `{ kind, record: { id } }` resolves to the
     normalized record, matching how stories seed the dialog. */
  const dialogFor = (kind, record) => ({
    kind,
    record,
    title: strings.confirmTitle,
    message:
      kind === "delete-confirm" ? strings.deleteConfirmMessage : strings.disableConfirmMessage,
    confirmLabel:
      kind === "delete-confirm" ? strings.deleteConfirmLabel : strings.disableConfirmLabel,
    cancelLabel: strings.cancelLabel,
  });
  const [dialog, setDialog] = React.useState(() =>
    props.dialog
      ? dialogFor(props.dialog.kind, all.find((item) => item.id === props.dialog.record?.id) || props.dialog.record)
      : null,
  );

  /* Only the non-blocked branches are reachable: the original renders blocked
     actions with a real `disabled` attribute, so the permission and
     "disable knowledge first" dialogs in scenario-reports.js never fire. */
  const act = (action, record) => {
    props.onAction?.({ action, record });
    if (!isOwn(record)) return;
    if (action === "edit" && !record.ai_interpreter_enabled) {
      props.onNavigate?.(editScenarioHref(record));
      return;
    }
    if (action === "delete" && !record.ai_interpreter_enabled) {
      setDialog(dialogFor("delete-confirm", record));
      return;
    }
    if (action === "disable" && record.ai_interpreter_enabled) {
      setDialog(dialogFor("disable-confirm", record));
    }
  };

  const onDialogConfirm = () => {
    const current = dialog;
    if (!current) return;
    props.onDialogConfirm?.(current);
    setDialog(null);
    if (current.kind === "delete-confirm") {
      setRecords((prev) => (prev || all).filter((item) => item.id !== current.record.id));
      if (detailId === current.record.id) {
        setDetailId(null);
        props.onCloseDetail?.();
      }
      return;
    }
    /* the original's "Knowledge disabled" notice is a no-op toast call. */
    patch(current.record.id, { ai_interpreter_enabled: false, status: "Disable" });
  };

  const openDetail = (record) => {
    setDetailId(record.id);
    props.onOpen?.(record);
  };
  const closeDetail = () => {
    setDetailId(null);
    props.onCloseDetail?.();
  };

  /** Card/drawer action buttons — identical gating to the original. */
  const actionsFor = (record) => {
    const owner = isOwn(record);
    const disabled = !record.ai_interpreter_enabled;
    return ["edit", "delete", "disable"].map((action) => {
      const permissionBlocked = !owner;
      const statusBlocked = (disabled && action === "disable") || (!disabled && action !== "disable");
      const blocked = permissionBlocked || statusBlocked;
      const label = action === "edit" ? strings.editLabel : action === "delete" ? strings.deleteLabel : strings.disableLabel;
      return {
        id: action,
        label,
        ariaLabel: `${label} ${record.title}`,
        danger: action === "delete",
        disabled: blocked,
        title: permissionBlocked
          ? strings.permissionTitle
          : blocked
            ? disabled && action === "disable"
              ? strings.alreadyDisabled
              : strings.disableFirstTitle
            : label,
        tooltip: permissionBlocked
          ? strings.permissionTitle
          : disabled && action === "disable"
            ? strings.alreadyDisabled
            : "",
      };
    });
  };

  return {
    strings,
    filters: strings.filters,
    filterValues: selected,
    query,
    onQueryChange: (value) => {
      setQuery(typeof value === "string" ? value : value?.value || "");
      props.onQueryChange?.(value);
    },
    onFilterChange: (event) => {
      setSelected((prev) => ({ ...prev, [event.id]: event.value }));
      props.onFilterChange?.(event);
    },
    records: visible,
    total: filtered.length,
    totalAll: list.length,
    page: currentPage,
    totalPages,
    onPage: (next) => {
      setPage(next);
      props.onPage?.(next);
    },
    pageSize,
    pageSizeOptions: pageSizes,
    onPageSize: (next) => {
      setPageSize(Number(next));
      props.onPageSize?.(next);
    },
    actionsFor,
    onAction: act,
    detail: detailRecord,
    detailEnabled: detailRecord ? Boolean(detailRecord.ai_interpreter_enabled) : false,
    showWorkflowNote: detailRecord
      ? !detailRecord.ai_interpreter_enabled && detailRecord.workflow_status !== "Published"
      : false,
    onOpen: openDetail,
    onCloseDetail: closeDetail,
    dialog,
    onDialogConfirm,
    onDialogCancel: () => {
      props.onDialogCancel?.(dialog);
      setDialog(null);
    },
    createHref: props.createHref || "/assets/pages/knowledge-create.html?type=Scenario%20Reporting",
    onCreate: props.onCreate,
  };
}
