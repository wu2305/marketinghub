import { PrinciplesView } from "./index.jsx";
import { INTERPRETER } from "../../../content.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Organisms/Principles library",
  component: PrinciplesView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Principles library view — the dedicated card list that replaces the generic asset table when `?type=Principles`: gold search pill, category checkbox filter, "Showing X of Y" count line, numbered cards with clamped descriptions, and shared pagination.',
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
    pageSize: { control: "inline-radio", options: [10, 20, 50] },
    onQueryChange: { action: "onQueryChange" },
    onToggleCategory: { action: "onToggleCategory" },
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
    return (
      <PrinciplesView
        items={INTERPRETER.principles}
        strings={INTERPRETER.principlesLibrary}
        query={query}
        selectedCategories={selected}
        page={page}
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
