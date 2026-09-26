import { INTERPRETER } from "../../../content.js";
import { BusinessTermView } from "./index.jsx";
import { useBusinessTermDemo } from "../../../demo/business-term-demo.js";
import { callbackProp, prop } from "../../../lib/story-helpers.js";

const bundle = INTERPRETER.businessTermLibrary;

export default {
  title: "Features/Interpreter/Business term view",
  component: BusinessTermView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Business Term library (`?type=Business Term` on the AI Interpreter page) on the governed-library pattern: LibraryToolbar (search, Status/Creator facets, count, Add link), LibraryList cards with synonym chips (three shown, the rest counted), compact pagination, detail drawer, ConfirmDialog and success Toast. `useBusinessTermDemo` owns filtering, lib/governance.js rules and dialogs.",
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
    totals: prop("{ shown: number, total: number }", { description: "Result count shown in the toolbar.", control: false }),
    toast: prop("string", { description: "Success message after disable/delete; empty = hidden.", control: false }),
    filters: prop("Array<FilterDef>", { description: "Checkbox disclosure filters computed by the container (Status, Creator).", control: false }),
    searchRef: prop("React.Ref", { description: "Forwarded to the search input so page-level '/' and Cmd/Ctrl+K shortcuts focus it.", control: false }),
    dialog: prop("object | null", { description: "ConfirmDialog content ({ purpose, title, message, labels }) driven by the container; null = closed.", control: false }),
    onQueryChange: callbackProp("onQueryChange", "(event: { name, value }) => void", { name: "search", value: "gmv" }, "Search input change; also resets to page 1."),
    onFilterToggle: callbackProp("onFilterToggle", "(event: { id, value, checked }) => void", { id: "status", value: "Disable", checked: true }, "Checkbox toggle inside a filter disclosure (stays open); resets to page 1."),
    onPage: callbackProp("onPage", "(event: { page: number }) => void", { page: 2 }, "Previous/Next page."),
    onPageSize: callbackProp("onPageSize", "(event: { pageSize: number }) => void", { pageSize: 20 }, "Rows-per-page change; resets to page 1."),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "business-term-gmv" }, "Title button or card click opens the detail drawer."),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "edit", id: "business-term-gmv", blocked: true, reason: "disable-first" }, "Every action click; blocked actions report why (pattern B7)."),
    onClearFilters: callbackProp("onClearFilters", "(event: { reason }) => void", { reason: "empty-state" }, "Clear filters from the no-results state."),
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

const openAction = (selector, expectedText) => async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  const button = doc.querySelector(selector);
  if (!button) throw new Error(`Business Term action missing: ${selector}`);
  button.click();
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (doc.querySelector(".mh-confirm")?.textContent.includes(expectedText)) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`Business Term dialog missing: ${expectedText}`);
};

export const DisableConfirmation = {
  name: "Confirm disabling own term",
  play: openAction(".mh-btview [aria-label='Disable GMV (Gross Merchandise Value)']", "Confirm Offline"),
};

export const PermissionDenied = {
  name: "Cannot edit another creator's term",
  play: openAction(".mh-btview [aria-label='Edit Paid Customer']", "Permission denied"),
};

export const OfflineFirst = {
  name: "Edit an enabled term: take it offline first",
  play: openAction(".mh-btview [aria-label='Edit GMV (Gross Merchandise Value)']", "Go Offline"),
};
