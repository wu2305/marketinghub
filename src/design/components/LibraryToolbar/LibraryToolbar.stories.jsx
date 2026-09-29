import { LibraryToolbar } from "./index.jsx";
import { callbackProp, prop } from "../../lib/story-helpers.js";

const facets = [
  { id: "status", label: "Status", allLabel: "All statuses", options: [{ id: "Enable", label: "Enabled" }, { id: "Disable", label: "Disabled" }, { id: "Draft", label: "Draft" }], selected: [] },
  { id: "domain", label: "Domain", allLabel: "All domains", options: [{ id: "Sales", label: "Sales" }, { id: "CRM", label: "CRM" }, { id: "Retail", label: "Retail" }], selected: [] },
];

export default {
  title: "Organisms/Library/LibraryToolbar",
  component: LibraryToolbar,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Find controls of a governed library: search, facets, the always-visible count, optional create link and tabs. Every control reports through `onChange({ field, value, checked? })`." } } },
  args: {
    search: { label: "Search business terms", placeholder: "Search terms or synonyms", value: "" },
    facets,
    count: "Showing 4 of 4 terms",
    create: { label: "Add Business Term", href: "#knowledge-create" },
  },
  argTypes: {
    search: prop("{ label, placeholder?, value? }", { description: "Search field." }),
    facets: prop("Array<{ id, label, kind?, options, selected?, allLabel? }>", { description: "multi → CheckboxFilter, single → Select." }),
    count: prop("string", { description: "Result count text (B3)." }),
    create: prop("{ label, href? }", { description: "Optional create action: a link when `href` is set (creation navigates), a button otherwise (creation happens in the page)." }),
    tabs: prop("{ label, value, items }", { description: "Optional tabs above the row." }),
    onChange: callbackProp("onChange", "(event: { field, value, checked? }) => void", { field: "search", value: "gmv" }, "Search, facet or tab change."),
    onCreate: callbackProp("onCreate", "(event: { href? }) => void", { href: "#knowledge-create" }, "Create link or button activated."),
  },
};

export const Default = {};
export const Searched = { args: { search: { label: "Search business terms", value: "gmv" }, count: "Showing 1 of 4 terms" } };
export const FacetSelected = { name: "Facet selected", args: { facets: [{ ...facets[0], selected: ["Disable"] }, facets[1]], count: "Showing 1 of 4 terms" } };
export const MultipleFacets = { name: "Multiple facets", args: { facets: [{ ...facets[0], selected: ["Enable", "Draft"] }, { ...facets[1], selected: ["Sales"] }], count: "Showing 1 of 4 terms" } };
export const CreateInPage = { name: "Create in page", args: { create: { label: "Create New Scenario" } } };
export const WithTabsAndSelect = {
  name: "Tabs and single-choice facet",
  args: {
    create: undefined,
    tabs: { label: "Review status", value: "pending", items: [{ id: "pending", label: "Pending 6" }, { id: "approved", label: "Approved 21" }, { id: "rejected", label: "Rejected 3" }] },
    facets: [{ id: "type", label: "Type", kind: "single", allLabel: "All types", options: [{ id: "Principles", label: "Principles" }, { id: "Data Model", label: "Data Model" }], selected: "" }],
    count: "6 items",
  },
};
