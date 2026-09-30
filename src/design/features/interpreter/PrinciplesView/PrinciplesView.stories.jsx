import { PrinciplesView } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { filterPrinciples, paginateRows } from "../../../demo/interpreter-demo.js";
import { useSynced, bi } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Interpreter/Principles library",
  component: PrinciplesView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("Principles library (`?type=Principles`) on the governed-library pattern: LibraryToolbar (search, Category facet, \"Showing X of Y\" count), read-only LibraryList cards whose long descriptions expand in place, compact Pagination. List states (filtered, empty, paged) are shown by the Organisms/Library stories.", "基于受治理库模式的 Principles 库（`?type=Principles`）：LibraryToolbar（搜索、Category 筛选、\"Showing X of Y\" 数量）、长描述可原地展开的只读 LibraryList 卡片，以及紧凑分页。列表状态（筛选后、空、分页）在 Organisms/Library 故事中展示。"),
      },
    },
  },
  args: {
    query: "",
    selectedCategories: [],
    page: 1,
    pageSize: 10,
    expanded: [],
  },
  argTypes: {
    selectedCategories: {
      control: "check",
      options: INTERPRETER.principles.map((item) => item.category),
    },
    pageSize: { control: "inline-radio", options: [5, 10, 20] },
    onQueryChange: { action: "onQueryChange" },
    onToggleCategory: { action: "onToggleCategory" },
    onClearFilters: { action: "onClearFilters" },
    onPage: { action: "onPage" },
    onPageSize: { action: "onPageSize" },
    onToggleExpand: { action: "onToggleExpand" },
  },
  render: function PrinciplesStory(args) {
    const [query, setQuery] = useSynced(args.query);
    const [selected, setSelected] = useSynced(args.selectedCategories);
    const [page, setPage] = useSynced(args.page);
    const [pageSize, setPageSize] = useSynced(args.pageSize);
    const [expanded, setExpanded] = useSynced(args.expanded);
    const filtered = filterPrinciples(INTERPRETER.principles, { query, selectedCategories: selected });
    const window_ = paginateRows(filtered, { page, pageSize });
    const categories = [...new Set(INTERPRETER.principles.map((item) => item.category))].map((id) => ({ id, label: id }));
    return (
      <PrinciplesView
        items={window_.rows}
        totals={{ shown: window_.total, total: INTERPRETER.principles.length }}
        categories={categories}
        strings={INTERPRETER.principlesLibrary}
        query={query}
        selectedCategories={selected}
        page={window_.page}
        pageSize={pageSize}
        expanded={expanded}
        onQueryChange={(event) => {
          setQuery(event.value);
          setPage(1);
          args.onQueryChange?.(event);
        }}
        onToggleCategory={(event) => {
          setSelected(event.checked ? [...selected, event.id] : selected.filter((id) => id !== event.id));
          setPage(1);
          args.onToggleCategory?.(event);
        }}
        onClearFilters={(event) => {
          setQuery("");
          setSelected([]);
          setPage(1);
          args.onClearFilters?.(event);
        }}
        onPage={(event) => {
          setPage(event.page);
          args.onPage?.(event);
        }}
        onPageSize={(event) => {
          setPageSize(event.pageSize);
          setPage(1);
          args.onPageSize?.(event);
        }}
        onToggleExpand={(event) => {
          setExpanded(event.expanded ? [...expanded, event.id] : expanded.filter((id) => id !== event.id));
          args.onToggleExpand?.(event);
        }}
      />
    );
  },
};

export const Default = {};

export const CategorySelected = {
  name: "System category selected",
  args: { selectedCategories: ["System"] },
};

export const NoResults = {
  name: "No matching principles",
  args: { query: "zzzz-nothing" },
};

export const ExpandedDescription = {
  name: "Expanded principle description",
  args: { expanded: ["principle-04"] },
};
