import { LibraryToolbar } from "./index.jsx";
import { callbackProp, prop, bi } from "../../lib/story-helpers.js";

const facets = [
  { id: "status", label: "Status", allLabel: "All statuses", options: [{ id: "Enable", label: "Enabled" }, { id: "Disable", label: "Disabled" }, { id: "Draft", label: "Draft" }], selected: [] },
  { id: "domain", label: "Domain", allLabel: "All domains", options: [{ id: "Sales", label: "Sales" }, { id: "CRM", label: "CRM" }, { id: "Retail", label: "Retail" }], selected: [] },
];

export default {
  title: "Organisms/Library/LibraryToolbar",
  component: LibraryToolbar,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("Find controls of a governed library: search, facets, the always-visible count, optional create link and tabs. Every control reports through `onChange({ field, value, checked? })`.", "受治理库的查找控件：搜索、筛选项、始终可见的数量、可选的创建链接以及标签页。所有控件都通过 `onChange({ field, value, checked? })` 回报。") } } },
  args: {
    search: { label: "Search business terms", placeholder: "Search terms or synonyms", value: "" },
    facets,
    count: "Showing 4 of 4 terms",
    create: { label: "Add Business Term", href: "#knowledge-create" },
  },
  argTypes: {
    search: prop("{ label, placeholder?, value? }", { description: bi("Search field.", "搜索框。") }),
    facets: prop("Array<{ id, label, kind?, options, selected?, allLabel? }>", { description: bi("multi → CheckboxFilter, single → Select.", "multi 使用 CheckboxFilter，single 使用 Select。") }),
    count: prop("string", { description: bi("Result count text (B3).", "结果数量文字（B3）。") }),
    create: prop("{ label, href? }", { description: bi("Optional create action: a link when `href` is set (creation navigates), a button otherwise (creation happens in the page).", "可选的创建操作：设置了 `href` 时为链接（创建会跳转），否则为按钮（在页面内创建）。") }),
    tabs: prop("{ label, value, items }", { description: bi("Optional tabs above the row.", "行上方的可选标签页。") }),
    onChange: callbackProp("onChange", "(event: { field, value, checked? }) => void", { field: "search", value: "gmv" }, bi("Search, facet or tab change.", "搜索、筛选项或标签页发生变化。")),
    onCreate: callbackProp("onCreate", "(event: { href? }) => void", { href: "#knowledge-create" }, bi("Create link or button activated.", "点击创建链接或按钮。")),
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
