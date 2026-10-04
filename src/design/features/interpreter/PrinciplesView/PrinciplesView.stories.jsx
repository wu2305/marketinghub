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
          bi("This component is the Principles library on AI Interpreter. The user can search. The user can filter by Category. The toolbar shows a Showing X of Y count. Each card is read-only. A long description can expand on the card. Compact pagination sits under the list. There is no status badge, no item action, and no create control. Set `items` to the current page of rows. The host filters, pages, and stores which descriptions are open.", "这是 AI Interpreter 上的 Principles 库。用户可以搜索。用户可以按 Category 筛选。工具栏显示 Showing X of Y 数量。每张卡片是只读的。长描述可以在卡片上展开。列表下方是紧凑分页。没有状态标签，没有条目操作，也没有创建控件。把当前页的行传入 `items`。筛选、分页和展开状态由宿主保存。"),
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
