import React from "react";
import { LibraryToolbar } from "./index.jsx";
import { callbackProp, prop, useSynced, bi } from "../../lib/story-helpers.js";

const facets = [
  { id: "status", label: "Status", allLabel: "All statuses", options: [{ id: "Enable", label: "Enabled" }, { id: "Disable", label: "Disabled" }, { id: "Draft", label: "Draft" }], selected: [] },
  { id: "domain", label: "Domain", allLabel: "All domains", options: [{ id: "Sales", label: "Sales" }, { id: "CRM", label: "CRM" }, { id: "Retail", label: "Retail" }], selected: [] },
];

/* The toolbar is controlled: it shows only the values it is given. This story
   host keeps them in state, so typing, ticking a box, choosing an option and
   switching a tab all stick. The Actions panel still logs every change. The
   host would also recompute `count` from its filtered data; here it stays as
   the story arg. Changing a Control resets the state. */
function ToolbarStory(args) {
  const [search, setSearch] = useSynced(args.search?.value ?? "");
  const initialSelected = React.useMemo(
    () => Object.fromEntries((args.facets || []).map((facet) => [facet.id, facet.selected ?? (facet.kind === "single" ? "" : [])])),
    [args.facets],
  );
  const [selected, setSelected] = useSynced(initialSelected);
  const [tab, setTab] = useSynced(args.tabs?.value);
  const handleChange = (event) => {
    if (event.field === "search") setSearch(event.value);
    else if (event.field === "tab") setTab(event.value);
    else {
      setSelected((current) => ({
        ...current,
        [event.field]: event.checked === undefined
          ? event.value
          : event.checked ? [...(current[event.field] || []), event.value] : (current[event.field] || []).filter((id) => id !== event.value),
      }));
    }
    args.onChange?.(event);
  };
  return (
    <LibraryToolbar
      {...args}
      search={{ ...args.search, value: search }}
      facets={(args.facets || []).map((facet) => ({ ...facet, selected: selected[facet.id] ?? facet.selected }))}
      tabs={args.tabs ? { ...args.tabs, value: tab } : undefined}
      onChange={handleChange}
    />
  );
}

export default {
  title: "Organisms/Library/LibraryToolbar",
  component: LibraryToolbar,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("This component is the find row of a governed library. It can show search, filters, a count, a create link, and tabs. Every control change runs `onChange`. The result has `field` and `value`. A checkbox change also has `checked`. The toolbar is controlled: it shows only the values you pass in. In these stories a small story host keeps the values, so changes stay on screen, and the Actions panel logs each event. A real host also filters its data and updates `count`.", "这个组件是受治理库的查找行。它可以显示搜索、筛选、数量、创建链接和标签。每次控件变化都会调用 `onChange`。结果里有 `field` 和 `value`。复选框变化时还有 `checked`。工具栏是受控组件：它只显示你传入的值。在这些故事里，由一个小的故事宿主保存这些值，所以修改会留在画面上，Actions 面板会记录每个事件。真实的宿主还要筛选数据并更新 `count`。") } } },
  render: (args) => <ToolbarStory {...args} />,
  args: {
    search: { label: "Search business terms", placeholder: "Search terms or synonyms", value: "" },
    facets,
    count: "Showing 4 of 4 terms",
    create: { label: "Add Business Term", href: "#knowledge-create" },
  },
  argTypes: {
    search: prop("{ label, placeholder?, value? }", { description: bi("Search field.", "搜索框。") }),
    facets: prop("Array<{ id, label, kind?, options, selected?, allLabel? }>", { description: bi("multi → CheckboxFilter, single → Select.", "multi 使用 CheckboxFilter，single 使用 Select。") }),
    count: prop("string", { description: bi("Result count text. The count is always visible.", "结果数量文字。数量始终显示。") }),
    create: prop("{ label, href? }", { description: bi("Optional create action: a link when `href` is set (creation navigates), a button otherwise (creation happens in the page).", "可选的创建操作：设置了 `href` 时为链接（创建会跳转），否则为按钮（在页面内创建）。") }),
    tabs: prop("{ label, value, items }", { description: bi("Optional tabs above the row.", "行上方的可选标签页。") }),
    onChange: callbackProp("onChange", "(event: { field, value, checked? }) => void", { field: "search", value: "gmv" }, bi("The function runs when search, a filter, or a tab changes.", "搜索、筛选或标签变化时会调用这个函数。")),
    onCreate: callbackProp("onCreate", "(event: { href? }) => void", { href: "#knowledge-create" }, bi("The function runs when the create link or button is used.", "点击创建链接或按钮时会调用这个函数。")),
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
