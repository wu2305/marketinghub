import { INTERPRETER } from "../../content.js";
import { BusinessTermView } from "../../organisms.jsx";
import { useBusinessTermDemo } from "../../demo/business-term-demo.js";
import { callbackProp, prop } from "../story-helpers.js";

const bundle = INTERPRETER.businessTermLibrary;

export default {
  title: "Organisms/Business term view",
  component: BusinessTermView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Business Term dedicated library view (`?type=Business Term` on the AI Interpreter page) — toolbar with multi-select status/creator filters + search + Add link, three-column term cards (title + Draft badge, description, one-line clamped synonyms, creator, status pill, edit/delete/disable icon actions), compact fm-pagination, right-side detail drawer and confirm/info dialogs. Driven by `useBusinessTermDemo` so canvas interactions are live; state mirrors business-term-library.js.",
      },
    },
  },
  args: {
    ...bundle,
    drafts: [],
    query: "",
    selected: { status: [], creator: [] },
    page: 1,
    pageSize: 10,
    detail: null,
  },
  argTypes: {
    records: prop("Array<BusinessTermRecord>", {
      description: "Seed records (id, title, description, synonyms, scope, kind, creator, status, stage).",
      detail: "status: \"Enable\" | \"Disable\"; stage: \"Draft\" adds the superscript Draft badge.",
    }),
    drafts: prop("Array<object>", {
      defaultValue: [],
      description: "localStorage-style drafts — unshifted ahead of records when `stage !== \"Draft\" || creator === currentUser` (the M5 create page writes these).",
    }),
    currentUser: prop("string", { defaultValue: "Current User", description: "Identity constant — only own records can be managed." }),
    strings: prop("object", { description: "All copy: labels, tooltips, dialog text, detail section headings.", control: false }),
    createHref: prop("string", { description: "\"Add Business Term\" link target (M5 create page, not built)." }),
    editHref: prop("(id: string) => string", { description: "Edit target for disabled records (M5 create page, not built) — emitted via onNavigate.", control: false }),
    query: prop("string", { defaultValue: "", description: "Initial search text (trimmed lowercase substring over title/description/synonyms/scope/creator)." }),
    selected: prop("{ status: string[], creator: string[] }", { description: "Initial filter selections — OR within a filter, AND across.", control: false }),
    page: prop("number", { defaultValue: 1, description: "Initial page (clamped after deletes)." }),
    pageSize: prop("number", { defaultValue: 10, description: "Initial rows per page.", control: "inline-radio", options: [5, 10, 20] }),
    pageSizes: prop("Array<number>", { defaultValue: [5, 10, 20], description: "Rows-per-page options." }),
    detail: prop("string | null", { defaultValue: null, description: "Record id to open in the detail drawer.", control: false }),
    totals: prop("{ shown: number, total: number }", { description: "Count line data — rendered but hidden, matching the original's display:none rule.", control: false }),
    filters: prop("Array<FilterDef>", { description: "Checkbox disclosure filters computed by the container (Status, Creator).", control: false }),
    searchRef: prop("React.Ref", { description: "Forwarded to the search input so page-level '/' and Cmd/Ctrl+K shortcuts focus it.", control: false }),
    dialog: prop("object | null", { description: "ConfirmDialog content ({ tone, title, message, labels }) driven by the container; null = closed.", control: false }),
    onQueryChange: callbackProp("onQueryChange", "(event: { name, value }) => void", { name: "search", value: "gmv" }, "Search input change; also resets to page 1."),
    onFilterToggle: callbackProp("onFilterToggle", "(event: { id, value, checked }) => void", { id: "status", value: "Disable", checked: true }, "Checkbox toggle inside a filter disclosure (stays open); resets to page 1."),
    onPage: callbackProp("onPage", "(event: { page: number }) => void", { page: 2 }, "Previous/Next page."),
    onPageSize: callbackProp("onPageSize", "(event: { pageSize: number }) => void", { pageSize: 20 }, "Rows-per-page change; resets to page 1."),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "gmv" }, "Card click / Enter / Space opens the detail drawer."),
    onAction: callbackProp("onAction", "(event: { action, id }) => void", { action: "disable", id: "gmv" }, "edit/delete/disable icon button — fires even when aria-disabled, matching the original."),
    onCloseDetail: callbackProp("onCloseDetail", "(event: { reason }) => void", { reason: "button" }, "Detail drawer dismissed (×, scrim, Escape)."),
    onDialogConfirm: callbackProp("onDialogConfirm", "(event: { confirmed: true }) => void", { confirmed: true }, "Confirm dialog's primary action — runs the pending operation."),
    onDialogCancel: callbackProp("onDialogCancel", "(event: { reason }) => void", { reason: "cancel" }, "Confirm/info dialog dismissed."),
    onCreate: callbackProp("onCreate", "(event: { href }) => void", { href: "knowledge-create.html?type=Business%20Term" }, "Add Business Term link activated."),
  },
  render: function BusinessTermStory(args) {
    const viewProps = useBusinessTermDemo(args);
    return <BusinessTermView {...viewProps} />;
  },
};

export const Default = {};

export const WithDraft = {
  args: {
    drafts: [
      {
        id: "story-draft",
        title: "Draft Term Example",
        description: "A staged business term drafted in the create page.",
        synonyms: ["Staged Term"],
        status: "Disable",
        stage: "Draft",
        creator: "Current User",
      },
    ],
  },
};

export const FilteredEmpty = {
  args: { query: "zzzzz" },
};

export const DetailOpen = {
  args: { detail: "business-term-gmv" },
};
