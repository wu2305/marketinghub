import { demoImage } from "./images.js";

/**
 * Demo state container for FieldLibraryView — the deterministic local
 * stand-in for field-library.js + knowledge-fields.js on the four
 * field-mapping knowledge types (`?type=Report Context | Metric Dictionary |
 * Analytical Model | Email Reports`). `normalizeFieldRecord` is a verbatim
 * port of knowledgeFields.js normalize(); the hook owns search/filters,
 * pagination, the detail drawer, Analytical Model edit/delete/disable rules
 * and the Report Context description dialog — all as local React state
 * instead of localStorage. No Storybook imports; any host can drive the view
 * the same way. Mounted at page level so a type switch reseeds the module
 * state the way the original's sync() does.
 */
import React from "react";
import { knowledgeActions, knowledgeStatus } from "./knowledge-actions.js";
import { useKnowledgeDialog } from "./knowledge-dialog.js";

export const fieldLibraryTypes = ["Report Context", "Metric Dictionary", "Analytical Model", "Email Reports"];

/* knowledge-fields.js lookup tables (project key -> governed domain label,
   report-context rules/linked scenarios/scope per project). */
const DOMAINS = {
  city: "City Strategy",
  fourp: "4P",
  customer: "Customer",
  abo: "ABO",
  rednote: "Rednote",
  ottolv: "OTTOLV",
};

const REPORT_CONTEXTS = {
  city: {
    rules: [
      "Invest cities deliver xx% daily traffic uplift, driving xx% daily sales growth and xx% AUR improvement.",
      "Key gaps: CR (xx%), SV (xx%), new customer ratio (xx%) and UPT (xx%) reveal potential conversion and basket-size weaknesses.",
      "Prioritize conversion optimization when supported by the evidence, and state the comparison period and data limitations.",
    ],
    reports: ["scenario-channel-performance", "scenario-campaign-review"],
    scope:
      "Covers the selected invest cities, reporting period and comparable stores. Includes governed traffic, sales, conversion and basket metrics. Excludes test stores, cancelled transactions and returns; incomplete periods must be identified.",
  },
  fourp: {
    rules: [
      "Review Place, Price, Product and Promotion performance. Summarize sales movement of xx% and conversion movement of xx%.",
      "Compare promotion lift of xx% with the approved baseline and distinguish mix changes from underlying demand.",
      "Rank opportunities by supported business impact. State the comparison scope and avoid unsupported causal conclusions.",
    ],
    reports: ["scenario-campaign-review", "scenario-channel-performance"],
    scope:
      "Covers governed 4P metrics for the selected products, stores and reporting period. Uses comparable promotion and baseline scopes. Excludes test campaigns, cancelled orders and returns.",
  },
  customer: {
    rules: [
      "Summarize customer acquisition growth of xx%, activation of xx% and retention of xx% for the selected period.",
      "Compare funnel stages and highlight the largest supported movement of xx percentage points.",
      "Explain cohort definitions and identification coverage before recommending follow-up analysis.",
    ],
    reports: [],
    scope:
      "Covers identified customers and governed acquisition, activation and retention cohorts for the selected period. Excludes test accounts and duplicate customer records; anonymous visits are outside customer-level analysis.",
  },
  abo: {
    rules: [
      "Summarize campaign delivery and conversion performance against the approved targets, with variance of xx%.",
      "Highlight spend movement of xx% and attributed revenue movement of xx%, using the same attribution window.",
      "Identify supported campaign exceptions and distinguish measurement gaps from performance changes.",
    ],
    reports: ["scenario-campaign-review"],
    scope:
      "Covers approved ABO campaigns, media delivery and attributed conversions for the selected dates. Excludes test campaigns, invalid traffic and conversions outside the governed attribution window.",
  },
  rednote: {
    rules: [
      "Summarize reach movement of xx% and engagement rate of xx% across the selected Rednote content.",
      "Compare content and campaign groups using the same reporting window and available conversion coverage.",
      "Separate observed engagement from attributed business outcomes and flag missing attribution.",
    ],
    reports: ["scenario-campaign-review"],
    scope:
      "Covers tracked Rednote campaigns and content with available reach, engagement and attributed conversion data. Excludes deleted or unavailable content metrics and untracked off-platform activity.",
  },
  ottolv: {
    rules: [
      "Summarize video reach movement of xx%, completion rate of xx% and channel efficiency.",
      "Compare OTT and OLV outcomes within the governed deduplication and attribution scope.",
      "Flag cross-channel measurement limitations and recommend only evidence-supported follow-up actions.",
    ],
    reports: ["scenario-channel-performance"],
    scope:
      "Covers available OTT and OLV delivery, reach and completion data for the selected period. Excludes invalid traffic and unsupported cross-device deduplication; conversions follow the approved attribution window.",
  },
};

/* field-library.js reportContextProjects — domain -> product label. */
const REPORT_CONTEXT_PROJECTS = [
  { label: "D2C Insights", domains: ["City Strategy", "4P", "Customer"] },
  { label: "DC Media Performance", domains: ["ABO"] },
  { label: "DG Media Tracking", domains: ["Rednote", "OTTOLV"] },
];

export const list = (value) =>
  Array.isArray(value)
    ? value
    : String(value || "")
        .split(/[;,，]/)
        .map((x) => x.trim())
        .filter(Boolean);

/** field-library.js reportContextProjectLabels(). */
export function reportContextProjectLabels(record) {
  const domains = list(record.business_domain);
  const labels = REPORT_CONTEXT_PROJECTS.filter((project) =>
    project.domains.some((domain) => domains.includes(domain)),
  ).map((project) => project.label);
  return labels.length ? labels : domains;
}

const METRIC_DEFINITIONS = {
  "Member conversion":
    "Qualified member transactions divided by identified member visits within the same conversion window. Excludes unidentified visits and invalid transactions.",
  "Campaign ROI":
    "Attributed campaign revenue divided by media spend for the same reporting period. Excludes unattributed revenue and cancelled transactions.",
  "Promotion lift":
    "Promotion-period sales minus the comparable baseline sales. Uses the same store and product scope; excludes test stores and returns.",
};

const METRIC_ALIASES = {
  "Member conversion": ["Member conversion KPI", "Member Conversion Rate", "Member Visit-to-Purchase Rate", "Member CVR"],
  "Campaign ROI": ["Campaign ROI KPI", "Campaign Return on Investment", "Campaign Investment Return", "Marketing Campaign ROI"],
  "Promotion lift": ["Promotion lift KPI", "Promotional Sales Lift", "Incremental Promotion Sales", "Sales Uplift"],
};

/** Verbatim port of knowledgeFields.js normalize() — the shared field-mapping
    record shape the four fm card/drawer renderers consume. */
export function normalizeFieldRecord(asset) {
  const domain = asset.business_domain || (asset.projects || []).map((p) => DOMAINS[p]).filter(Boolean);
  const legacyDisabled =
    asset.status === "Disable" ||
    asset.status === "disable" ||
    asset.usage_status === "Disabled" ||
    asset.isDisabled === true ||
    asset.disabled === true ||
    asset.availability === "disabled";
  const common = {
    ...asset,
    business_domain:
      asset.business_domain !== undefined ? list(asset.business_domain) : list(domain).length ? list(domain) : ["Marketing"],
    updated_at: asset.updated_at || asset.updated || "Not recorded",
    status: knowledgeStatus({ ...asset, disabled: legacyDisabled }),
  };
  if (asset.typeId === "Report Context" || asset.type === "Report Context") {
    const project = (asset.projects || []).find((key) => REPORT_CONTEXTS[key]);
    const context = REPORT_CONTEXTS[project] || { rules: [], reports: [], scope: "Report data scope has not been configured." };
    return {
      ...common,
      type: "Report Context",
      report_name:
        asset.report_name || asset.connections?.find((x) => x.kind === "Report")?.name || asset.title,
      report_description: asset.report_description || asset.summary,
      ai_interpretation_enabled: asset.ai_interpretation_enabled ?? Boolean(asset.aiUse?.length),
      ai_summary_enabled: asset.ai_summary_enabled ?? Boolean(asset.aiUse?.length),
      report_thumbnail: demoImage(asset.report_thumbnail || (project ? `assets/images/project-${project}-tabby.png` : "")),
      ai_interpretation_rules: asset.ai_interpretation_rules ?? context.rules,
      scenario_report_ids: asset.scenario_report_ids ?? context.reports,
      report_data_scope: asset.report_data_scope ?? context.scope,
    };
  }
  if (asset.typeId === "Metric Dictionary" || asset.type === "Metric Dictionary") {
    return {
      ...common,
      type: "Metric Dictionary",
      metric_name: asset.metric_name || asset.title,
      metric_aliases: asset.metric_aliases || METRIC_ALIASES[asset.title] || [asset.title + " KPI"],
      business_definition: asset.business_definition || asset.summary,
      calculation_definition:
        asset.calculation_definition || METRIC_DEFINITIONS[asset.title] || "Calculation definition has not been configured.",
      unit: asset.unit || (asset.title === "Campaign ROI" ? "Ratio" : asset.title === "Promotion lift" ? "CNY" : "%"),
      metric_type: asset.metric_type || "Base",
    };
  }
  if (asset.typeId === "Analytical Model" || asset.type === "Analytical Model") {
    const model = {
      ...common,
      type: "Analytical Model",
      stage: ["Draft", "Under Review", "Published"].includes(asset.stage)
        ? asset.stage
        : asset.published
          ? "Published"
          : "Draft",
      analysis_name: asset.analysis_name ?? asset.title,
      visibility_scope: asset.visibility_scope || "Public",
      trigger_when:
        asset.trigger_when ||
        asset.triggerWhen ||
        "When a user request matches this analysis approach and its supported business context.",
      aliases: list(asset.aliases ?? ["Opportunity scan"]),
      trigger_keywords: list(asset.trigger_keywords ?? ["Find growth opportunities", "Identify performance gaps"]),
      applicable_scenarios: asset.applicable_scenarios ?? asset.summary,
      analysis_steps: list(
        asset.analysis_steps ?? [
          "Confirm the reporting period, business scope and comparison baseline.",
          "Compare performance across channels and regions to locate material gaps.",
          "Evaluate supported drivers and rank opportunities by impact and confidence.",
        ],
      ),
      referenced_metrics: list(asset.referenced_metrics ?? ["Member conversion", "Campaign ROI"]),
      recommended_dimensions: list(asset.recommended_dimensions ?? ["Channel", "Region", "Reporting period"]),
      analysis_constraints:
        asset.analysis_constraints ??
        "Do not infer causality from correlation or analyze dimensions without supporting data.",
      output_requirements:
        asset.output_requirements ??
        "Start with an executive summary, then list evidence, prioritized opportunities, limitations and recommended actions.",
      created_by: asset.created_by || asset.owner || "Current User",
      created_at: asset.created_at || asset.created || "Not recorded",
      references: asset.references ?? (asset.connections || []).map((x) => x.name),
    };
    delete model.workflow_status;
    delete model.statusDisplay;
    return model;
  }
  return {
    ...common,
    type: "Email Reports",
    email_subject: asset.email_subject || asset.emailSubject || asset.title,
    trigger_type: asset.trigger_type || (asset.schedule ? "Scheduled · " + asset.schedule : "Not configured"),
    recipients: list(asset.recipients).length ? list(asset.recipients) : ["Emily Wang", "Sophie Taylor", "Daniel Chen"],
    cc_recipients: list(asset.cc_recipients).length ? list(asset.cc_recipients) : ["Grace Liu", "Michael Zhao"],
    sent_at: asset.sent_at || asset.lastSent || "Not recorded",
    data_as_of: asset.data_as_of || "Not recorded",
  };
}

function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}

const EMPTY_SELECTED = {};
/**
 * @param {object} props FieldLibraryView inputs:
 *   `type` (active knowledge type id), `records` (all page records — fm types
 *   are normalized, Scenario Reporting ids resolve linked report contexts),
 *   `currentUser`, `strings`, `pageSizes`, `createHref`, `editHref`,
 *   `dashboardHref`, `scenarioHref(id)`; initial state `query`, `selected`
 *   (filter id -> checked ids), `page`, `pageSize`, `detail` (record id —
 *   the `?detail=` deep link), `descriptionEdit` (record id with the edit
 *   dialog open), `dialog` ({ kind: "disable-confirm" | "delete-confirm" |
 *   "delete-blocked", id } — seeds an open dialog for stories); host
 *   callbacks `onNavigate`, `onQueryChange`,
 *   `onFilterToggle`, `onPage`, `onPageSize`, `onOpen`, `onCloseDetail`,
 *   `onAction`, `onDialogConfirm`, `onDialogCancel`, `onCreate`,
 *   `onDescriptionChange`, `onDescriptionConfirm`, `onDescriptionCancel`.
 * @returns {object} FieldLibraryView props
 */
export function useFieldLibraryDemo(props) {
  const strings = props.strings || {};
  const dialogs = strings.dialogs || {};
  const filterStrings = strings.filters || {};
  const drawerStrings = strings.drawer || {};
  const currentUser = props.currentUser || "Current User";
  const type = props.type;

  /* Normalized field-mapping records, mirroring localStorage mutations in
     memory so they survive type switches (the original persists globally). */
  const seed = React.useCallback(
    () => (props.records || []).filter((record) => fieldLibraryTypes.includes(record.typeId)).map(normalizeFieldRecord),
    [props.records],
  );
  const shouldDerive = props.active !== false || Boolean(props.peek);
  const [all, setAll] = React.useState(() => shouldDerive ? seed() : []);
  const seeded = React.useRef({ active: shouldDerive, records: props.records });
  React.useEffect(() => {
    if (!shouldDerive || seeded.current.active && seeded.current.records === props.records) return;
    seeded.current = { active: true, records: props.records };
    setAll(seed());
  }, [shouldDerive, props.records, seed]);

  const [query, setQuery] = useSynced(props.query || "");
  const [selected, setSelected] = useSynced(props.selected || EMPTY_SELECTED);
  const [page, setPage] = useSynced(props.page || 1);
  const [pageSize, setPageSize] = useSynced(props.pageSize || 10);
  const [detailId, setDetailId] = useSynced(props.detail ?? null);
  const now = () => new Date().toLocaleString("en-GB");
  const patchRecord = (id, patch) =>
    setAll((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  /* The three reachable dialog shapes (field-library.js notice()): the
     disable/delete confirms and the referenced-delete info dialog. `run`
     closures only execute on confirm, so this is safe to call in the lazy
     initializer below even though patchRecord/now are consts. */
  const management = useKnowledgeDialog({
    seed: props.dialog,
    resolveSeed: (seedDialog) => seed().find((record) => record.id === seedDialog.id),
    blockReferenced: true,
    buildDialog: (kind, record) => {
      if (kind === "delete-blocked") return {
        tone: "info",
        title: dialogs.deleteBlockedTitle || "Deletion blocked",
        message: dialogs.deleteBlocked?.(record.references || []) ||
          `This analysis is referenced by: ${(record.references || []).join(", ")}. Remove these references before deleting.`,
        closeLabel: dialogs.closeLabel || "Close",
      };
      return {
        tone: "confirm",
        title: dialogs.confirmTitle || "Confirm Operation",
        message: kind === "delete-confirm" ? dialogs.deleteMessage || "Please confirm whether to delete this knowledge. Deletion cannot be undone." : dialogs.offlineMessage || "Please confirm whether to offline this knowledge.",
        confirmLabel: kind === "delete-confirm" ? dialogs.deleteConfirm || "Confirm Delete" : dialogs.offlineConfirm || "Confirm Offline",
        cancelLabel: dialogs.cancelLabel || "Cancel",
      };
    },
    onDisable: (record) => patchRecord(record.id, { status: "Disable", isDisabled: true, updated_at: now() }),
    onDelete: (record) => {
      setAll((current) => current.filter((item) => item.id !== record.id));
      setDetailId((current) => current === record.id ? null : current);
    },
    onEdit: (record) => props.onNavigate?.({ href: props.editHref ? props.editHref(record.id) : undefined, id: record.id }),
    onConfirm: (event) => props.onDialogConfirm?.(event),
    onCancel: (event) => props.onDialogCancel?.(event),
  });
  const actionPolicy = { currentUser, strings: { ...strings, draftCannotDisable: false } };
  const clearDialog = management.clear;
  const [descriptionEdit, setDescriptionEdit] = React.useState(() =>
    props.descriptionEdit ? { id: props.descriptionEdit, value: null } : null,
  );

  /* field-library.js sync(): a knowledge type change clears local overlays,
     search/filter/page state; a new URL detail remains open on its target type.
     The library itself keeps its module-level record state — our normalized list. */
  const prevType = React.useRef(type);
  React.useEffect(() => {
    if (prevType.current === type) return undefined;
    prevType.current = type;
    setQuery("");
    setSelected({});
    setPage(1);
    setDetailId(props.detail ?? null);
    clearDialog();
    setDescriptionEdit(null);
    return undefined;
  }, [type, props.detail, setQuery, setSelected, setPage, setDetailId, clearDialog]);

  if (props.active === false && !props.peek) return null;

  const isOwner = (record) => record.created_by === currentUser;
  const typeRecords = all.filter((record) => record.type === type);
  const visible = typeRecords.filter(
    (record) => type !== "Analytical Model" || record.stage !== "Draft" || isOwner(record),
  );

  /* field-library.js rows() — the status/domain/metric-type/creator checks
     plus a whole-record JSON substring search. RC has no status filter in
     the original UI, so `status` selections only exist on AM/ER. */
  const filtered = visible.filter((record) => {
    const picks = selected || {};
    const statusPick = picks.status || [];
    if (
      statusPick.length &&
      !statusPick.some((value) => (value === "Draft" ? record.stage === "Draft" : value === record.status))
    )
      return false;
    const domainPick = picks.domain || [];
    if (domainPick.length) {
      const labels = type === "Report Context" ? reportContextProjectLabels(record) : list(record.business_domain);
      if (!labels.some((label) => domainPick.includes(label))) return false;
    }
    const typePick = picks["metric-type"] || [];
    if (typePick.length && !typePick.includes(record.metric_type)) return false;
    const creatorPick = picks.creator || [];
    if (creatorPick.length && !creatorPick.includes(record.created_by)) return false;
    return JSON.stringify(record).toLowerCase().includes(query.toLowerCase());
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const detail = detailId ? typeRecords.find((record) => record.id === detailId) || null : null;

  const act = ({ action, id }) => {
    /* Resolve across `all` — the drawer can be peeked for a Report Context
       record from another type page (reportcontext:view). */
    const record = all.find((item) => item.id === id);
    if (!record) return;
    props.onAction?.({ action, id });
    if (action === "edit-description" && record.type === "Report Context") {
      setDescriptionEdit({ id, value: record.report_description || "" });
      return;
    }
    if (record.type !== "Analytical Model") return;
    management.request(action, record, actionPolicy);
  };

  /* Filter descriptors per type — field-library.js render(): insertion-order
     domain/creator options derived from the visible records. */
  const domains = [...new Set(visible.flatMap((record) => list(record.business_domain)))];
  const creators = [...new Set(typeRecords.map((record) => record.created_by).filter(Boolean))];
  const statusOptions = strings.statusOptions || [
    { id: "Enable", label: "Enabled" },
    { id: "Disable", label: "Disabled" },
  ];
  const projectOptions = (strings.reportContextProjects || REPORT_CONTEXT_PROJECTS.map((p) => p.label)).map((label) => ({
    id: label,
    label,
  }));
  const filters =
    type === "Report Context"
      ? [
          {
            id: "domain",
            label: filterStrings.project?.label || "Project",
            allLabel: filterStrings.project?.allLabel || "All projects",
            options: projectOptions,
            selected: [...(selected.domain || [])],
          },
        ]
      : type === "Metric Dictionary"
        ? [
            {
              id: "domain",
              label: filterStrings.domain?.label || "Data Model",
              allLabel: filterStrings.domain?.allLabel || "All models",
              options: domains.map((domain) => ({ id: domain, label: domain })),
              selected: [...(selected.domain || [])],
            },
            {
              id: "metric-type",
              label: filterStrings.metricType?.label || "Type",
              allLabel: filterStrings.metricType?.allLabel || "All types",
              options: [
                { id: "Base", label: "Base" },
                { id: "Calculated", label: "Calculated" },
              ],
              selected: [...(selected["metric-type"] || [])],
            },
          ]
        : [
            {
              id: "status",
              label: filterStrings.status?.label || "Status",
              allLabel: filterStrings.status?.allLabel || "All statuses",
              options: statusOptions,
              selected: [...(selected.status || [])],
            },
            {
              id: "domain",
              label: filterStrings.domain?.label || "Data Model",
              allLabel: filterStrings.domain?.allLabel || "All models",
              options: domains.map((domain) => ({ id: domain, label: domain })),
              selected: [...(selected.domain || [])],
            },
            ...(type === "Analytical Model"
              ? [
                  {
                    id: "creator",
                    label: filterStrings.creator?.label || "Creator",
                    allLabel: filterStrings.creator?.allLabel || "All creators",
                    options: creators.map((creator) => ({ id: creator, label: creator })),
                    selected: [...(selected.creator || [])],
                  },
                ]
              : []),
          ];

  const countUnit = (strings.countUnits || {})[type] || "records";
  const pageRows = filtered
    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    .map((record) => ({
      ...record,
      projectLabels: type === "Report Context" ? reportContextProjectLabels(record) : undefined,
      actions: type === "Analytical Model" ? knowledgeActions(record, actionPolicy) : [],
    }));
  /* field-library.js open(): drawer title + status pill per record type —
     keyed off record.type so the peeked detail resolves the same on any page. */
  const drawerStatus = (record) => {
    const raw =
      record.type === "Report Context"
        ? record.ai_interpretation_enabled
          ? "Enable"
          : "Disable"
        : record.type === "Analytical Model"
          ? record.status || record.stage
          : record.status;
    return raw === "Enable" ? "Enabled" : raw === "Disable" ? "Disabled" : raw || "";
  };
  const toDetailRecord = (record) => ({
    ...record,
    detailTitle: record.report_name || record.metric_name || record.analysis_name || record.email_subject,
    detailStatus: drawerStatus(record),
    projectLabels: record.type === "Report Context" ? reportContextProjectLabels(record) : undefined,
    actions: record.type === "Analytical Model" ? knowledgeActions(record, actionPolicy) : [],
    scenarioLinks: (record.scenario_report_ids || [])
      .map((id) => (props.records || []).find((item) => item.id === id && item.typeId === "Scenario Reporting"))
      .filter(Boolean)
      .map((asset) => ({ id: asset.id, title: asset.title, href: props.scenarioHref ? props.scenarioHref(asset.id) : undefined })),
  });
  const detailRecord = detail ? toDetailRecord(detail) : null;
  /* reportcontext:view — a peeked record from a non-fm page (the Data Model
     related-report buttons). Same drawer, record-typed. */
  const peeked = props.peek ? all.find((record) => record.id === props.peek) || null : null;
  const peekDetail = peeked ? toDetailRecord(peeked) : null;

  return {
    type,
    records: pageRows,
    totals: { shown: filtered.length, total: visible.length },
    filters,
    query,
    page: currentPage,
    pageSize,
    pageSizes: props.pageSizes || [5, 10, 20],
    strings,
    countUnit,
    createHref: type === "Analytical Model" ? props.createHref : undefined,
    createLabel: (strings.createLabels || {})[type],
    dashboardHref: props.dashboardHref,
    detail: detailRecord,
    peek: peekDetail ? { type: peeked.type, detail: peekDetail } : null,
    dialog: management.dialog,
    descriptionEdit: descriptionEdit
      ? {
          id: descriptionEdit.id,
          value: descriptionEdit.value ?? (all.find((item) => item.id === descriptionEdit.id)?.report_description ?? ""),
          original: all.find((item) => item.id === descriptionEdit.id)?.report_description ?? "",
          eyebrow: drawerStrings.editDialog?.eyebrow,
          title: drawerStrings.editDialog?.title,
          fieldLabel: drawerStrings.editDialog?.fieldLabel,
          cancelLabel: drawerStrings.editDialog?.cancelLabel,
          confirmLabel: drawerStrings.editDialog?.confirmLabel,
          closeLabel: drawerStrings.editDialog?.closeLabel,
        }
      : null,
    onQueryChange: (event) => {
      setQuery(event.value);
      setPage(1);
      props.onQueryChange?.(event);
    },
    onFilterToggle: (event) => {
      setSelected((current) => {
        const next = { ...(current || {}) };
        const values = [...(next[event.id] || [])];
        if (event.checked && !values.includes(event.value)) values.push(event.value);
        if (!event.checked) next[event.id] = values.filter((value) => value !== event.value);
        else next[event.id] = values;
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
    onDialogConfirm: management.confirm,
    onDialogCancel: management.cancel,
    onDescriptionChange: (event) => {
      setDescriptionEdit((current) => (current ? { ...current, value: event.value } : current));
      props.onDescriptionChange?.(event);
    },
    onDescriptionConfirm: (event) => {
      if (descriptionEdit) {
        const changedAt = now();
        const record = all.find((item) => item.id === descriptionEdit.id);
        patchRecord(descriptionEdit.id, {
          report_description: descriptionEdit.value,
          report_description_history: [
            ...(record?.report_description_history || []),
            { editor: currentUser, changed_at: changedAt, content: descriptionEdit.value },
          ],
          updated_at: changedAt,
        });
      }
      setDescriptionEdit(null);
      props.onDescriptionConfirm?.(event);
    },
    onDescriptionCancel: (event) => {
      setDescriptionEdit(null);
      props.onDescriptionCancel?.(event);
    },
    onCreate: (event) => props.onCreate?.(event),
  };
}
