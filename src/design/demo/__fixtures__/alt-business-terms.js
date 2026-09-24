/**
 * TEST FIXTURE, not demo data.
 * Alternative Business Term bundle used by ../business-term-demo.test.jsx and
 * the standalone host to prove the view + demo container render only what
 * props supply. Every value is deliberately different from the real
 * fixtures — nothing here may copy demo text, names or labels.
 */
export const ALT_BUSINESS_TERMS = {
  currentUser: "Fixture User",
  createHref: "fixture-create.html?type=Alt%20Term",
  editHref: (id) => `fixture-create.html?type=Alt%20Term&mode=edit&id=${id}`,
  pageSizes: [5, 10, 20],
  records: [
    {
      id: "alt-alpha",
      title: "Alt Alpha Metric",
      description: "Alt description for alpha.",
      synonyms: ["Alt Alpha Synonym", "Alt Alpha Alias"],
      scope: ["Alt Model One"],
      kind: "Business Term",
      creator: "Fixture User",
      status: "Enable",
    },
    {
      id: "alt-beta",
      title: "Alt Beta Metric",
      description: "Alt description for beta.",
      synonyms: ["Alt Beta Synonym"],
      scope: ["Alt Model Two"],
      kind: "Business Term",
      creator: "Other Owner",
      status: "Disable",
    },
  ],
  drafts: [
    {
      id: "alt-draft",
      title: "Alt Draft Term",
      description: "Alt draft description.",
      synonyms: ["Alt Draft Synonym"],
      creator: "Fixture User",
      status: "Disable",
      stage: "Draft",
    },
  ],
  strings: {
    searchLabel: "Alt search",
    searchPlaceholder: "Alt search placeholder...",
    selectedLabel: "{count} alt selected",
    statusLabel: "Alt status",
    statusAll: "All alt statuses",
    creatorLabel: "Alt creator",
    creatorAll: "All alt creators",
    createLabel: "Add Alt Term",
    synonymsLabel: "Alt synonyms",
    moreSynonymsLabel: "Alt more synonyms",
    statusLabels: { Enable: "Alt On", Disable: "Alt Off" },
    statusOptions: [
      { id: "Enable", label: "Alt on option" },
      { id: "Disable", label: "Alt off option" },
    ],
    emptyMessage: "Alt empty state",
    countLabel: "Alt showing {shown} of {total}",
    units: ["alt records", "alt records"],
    rowsPerPageLabel: "Alt rows per page",
    previousLabel: "Alt previous",
    nextLabel: "Alt next",
    detailEyebrow: "Alt Term",
    detailCloseLabel: "Alt close details",
    sections: {
      termType: "Alt type",
      description: "Alt description",
      synonyms: "Alt synonyms",
      dataModel: "Alt model",
      creator: "Alt creator",
    },
    actions: { edit: "Alt edit", delete: "Alt delete", disable: "Alt disable" },
    tooltips: {
      permission: (action) => `Alt permission denied for ${action}.`,
      offlineFirst: "Alt offline first",
      draftDisabled: "Alt draft already disabled.",
      alreadyDisabled: "Alt already disabled.",
    },
    dialogs: {
      permissionDeniedTitle: "Alt permission denied",
      permissionDenied: (action) => `Alt permission denied for ${action}.`,
      confirmTitle: "Alt confirm",
      offlineMessage: "Alt offline message.",
      offlineConfirm: "Alt confirm offline",
      deleteMessage: "Alt delete message.",
      deleteConfirm: "Alt confirm delete",
      alreadyDisabledTitle: "Alt already disabled",
      alreadyDisabledMessage: "Alt already disabled message.",
      cancelLabel: "Alt cancel",
      closeLabel: "Alt close",
    },
  },
};
