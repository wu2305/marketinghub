import { INTERPRETER } from "../../../content.js";
import { FieldLibraryView, fieldLibraryTypes } from "./index.jsx";
import { useFieldLibraryDemo } from "../../../demo/field-library-demo.js";
import { callbackProp, enumProp, prop } from "../../../lib/story-helpers.js";

const bundle = INTERPRETER.fieldLibrary;
const AM_ID = "playbook-opportunity-scan";

export default {
  title: "Features/Interpreter/Field library view",
  component: FieldLibraryView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shared field-mapping library view (field-library.js `#fmLibrary`) serving the Report Context, Metric Dictionary, Analytical Model and Email Reports knowledge types: per-type checkbox filters + the gold search pill (rendered first visually, last in DOM order) + compact fm-pagination + a three-column card grid + the right-side detail drawer. Each type keeps its own card composition and drawer sections; Analytical Model adds the create link and owner/status-gated edit·delete·disable icon actions, Report Context adds the thumbnail drawer with the editable Report Description dialog. Driven by `useFieldLibraryDemo` so canvas interactions are live.",
      },
    },
  },
  args: {
    ...bundle,
    type: "Report Context",
    records: INTERPRETER.records,
    query: "",
    selected: {},
    page: 1,
    pageSize: 10,
    detail: null,
    descriptionEdit: null,
    dialog: null,
  },
  argTypes: {
    type: enumProp(fieldLibraryTypes, "Report Context", "Active knowledge type — switches the card composition, filters, drawer sections and available actions."),
    records: prop("Array<AssetRecord>", {
      description: "All page records — fm types are normalized by the container (`normalizeFieldRecord`); Scenario Reporting records resolve the RC drawer's linked-scenario chips.",
      control: false,
    }),
    currentUser: prop("string", { defaultValue: "Current User", description: "Identity constant — only own Analytical Model records can be managed." }),
    strings: prop("object", { description: "All copy: search/filter labels, card labels, drawer section headings, dialog text, tooltips.", control: false }),
    createHref: prop("string", { description: "\"Add Analytical Model\" link target (knowledge-create.html, M5 — not built)." }),
    editHref: prop("(id: string) => string", { description: "AM edit target — emitted via onNavigate.", control: false }),
    dashboardHref: prop("string", { description: "RC drawer \"Open Dashboard\" link target." }),
    scenarioHref: prop("(id: string) => string", { description: "RC drawer linked-scenario chip href builder.", control: false }),
    query: prop("string", { defaultValue: "", description: "Initial search text (whole-record substring match, like the original)." }),
    selected: prop("{ filterId: string[] }", { description: "Initial filter selections — OR within a filter, AND across.", control: false }),
    page: prop("number", { defaultValue: 1 }),
    pageSize: prop("number", { defaultValue: 10, control: "inline-radio", options: [5, 10, 20] }),
    pageSizes: prop("Array<number>", { defaultValue: [5, 10, 20] }),
    detail: prop("string | null", { defaultValue: null, description: "Record id opened in the detail drawer (the `?detail=` deep link)." }),
    descriptionEdit: prop("string | null", { defaultValue: null, description: "Record id with the Report Description edit dialog open.", control: false }),
    dialog: prop('{ kind: "disable-confirm" | "delete-confirm" | "delete-blocked", id: string } | null', { defaultValue: null, description: "Seeds an open confirm/info dialog (stories only — normally opened via the AM action buttons).", control: false }),
    totals: prop("{ shown: number, total: number }", { description: "Count line data — rendered but hidden, matching the original's display:none rule.", control: false }),
    filters: prop("Array<FilterDef>", { description: "Checkbox disclosure descriptors computed by the container (per type).", control: false }),
    searchRef: prop("React.Ref", { description: "Forwarded to the search input so page-level '/' and Cmd/Ctrl+K shortcuts focus it.", control: false }),
    onQueryChange: callbackProp("onQueryChange", "(event: { name, value }) => void", { name: "search", value: "gmv" }, "Search input change; resets to page 1."),
    onFilterToggle: callbackProp("onFilterToggle", "(event: { id, value, checked }) => void", { id: "status", value: "Disable", checked: true }, "Checkbox toggle inside a filter disclosure; resets to page 1."),
    onPage: callbackProp("onPage", "(event: { page: number }) => void", { page: 2 }, "Previous/Next page."),
    onPageSize: callbackProp("onPageSize", "(event: { pageSize: number }) => void", { pageSize: 20 }, "Rows-per-page change; resets to page 1."),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "city-report-context" }, "Card click / Enter / Space opens the detail drawer."),
    onAction: callbackProp("onAction", "(event: { action, id }) => void", { action: "disable", id: AM_ID }, "AM edit/delete/disable icon button, or the RC drawer's edit-description pencil (action \"edit-description\")."),
    onCloseDetail: callbackProp("onCloseDetail", "(event: { reason }) => void", { reason: "button" }, "Detail drawer dismissed (×, scrim, Escape, Close button)."),
    onDialogConfirm: callbackProp("onDialogConfirm", "(event: { confirmed: true }) => void", { confirmed: true }, "Confirm dialog's primary action — runs the pending operation."),
    onDialogCancel: callbackProp("onDialogCancel", "(event: { reason }) => void", { reason: "cancel" }, "Confirm/info dialog dismissed."),
    onDescriptionChange: callbackProp("onDescriptionChange", "(event: { value }) => void", { value: "Updated description." }, "Textarea input in the RC description dialog; Confirm enables once the value differs."),
    onDescriptionConfirm: callbackProp("onDescriptionConfirm", "(event: { id }) => void", { id: "city-report-context" }, "Description dialog Confirm — writes the new text and appends the history entry."),
    onDescriptionCancel: callbackProp("onDescriptionCancel", "(event: { reason }) => void", { reason: "cancel" }, "Description dialog dismissed."),
    onCreate: callbackProp("onCreate", "(event: { href }) => void", { href: bundle.createHref }, "Add Analytical Model link activated."),
    onNavigate: callbackProp("onNavigate", "(event: { href, id? }) => void", { href: "knowledge-create.html?type=Analytical%20Model&mode=edit&id=" + AM_ID, id: AM_ID }, "AM edit action navigates to the create page in edit mode."),
  },
  render: function FieldLibraryStory(args) {
    const viewProps = useFieldLibraryDemo(args);
    return <FieldLibraryView {...viewProps} />;
  },
};

export const ReportContext = {};

export const MetricDictionary = {
  args: { type: "Metric Dictionary" },
};

export const AnalyticalModel = {
  args: { type: "Analytical Model" },
};

export const EmailReports = {
  args: { type: "Email Reports" },
};

export const ReportContextDetail = {
  args: { type: "Report Context", detail: "city-report-context" },
};

export const ReportContextDescriptionEdit = {
  args: { type: "Report Context", detail: "city-report-context", descriptionEdit: "city-report-context" },
};

export const MetricDictionaryDetail = {
  args: { type: "Metric Dictionary", detail: "metric-dictionary-member-conversion" },
};

export const AnalyticalModelDetail = {
  args: { type: "Analytical Model", detail: AM_ID },
};

export const AnalyticalModelDisabled = {
  args: {
    type: "Analytical Model",
    records: INTERPRETER.records.map((record) =>
      record.id === AM_ID ? { ...record, status: "Disable" } : record,
    ),
  },
};

export const AnalyticalModelDisableConfirm = {
  args: { type: "Analytical Model", dialog: { kind: "disable-confirm", id: AM_ID } },
};

export const AnalyticalModelDeleteBlocked = {
  args: { type: "Analytical Model", detail: AM_ID, dialog: { kind: "delete-blocked", id: AM_ID } },
};

export const EmailReportsDetail = {
  args: { type: "Email Reports", detail: "email-report-weekly-performance" },
};

export const FilteredEmpty = {
  args: { query: "zzzzz" },
};
