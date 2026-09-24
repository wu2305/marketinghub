import React from "react";
import { INTERPRETER } from "../../content.js";
import { useBusinessTermDemo } from "../../demo/business-term-demo.js";
import { pageShell, useSynced } from "../../lib/story-helpers.js";
import { AiInterpreterPage } from "./index.jsx";

export default {
  title: "Pages",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export const Interpreter = {
  name: "AI Interpreter",
  args: {
    activeType: "overview",
    query: "",
    filterValues: {},
    ...pageShell,
    hero: INTERPRETER.hero,
    overviewItem: INTERPRETER.overview,
    sidebarTitle: INTERPRETER.sidebarTitle,
    types: INTERPRETER.types,
    records: INTERPRETER.records,
    principles: {
      items: INTERPRETER.principles,
      strings: INTERPRETER.principlesLibrary,
      selectedCategories: [],
      page: 1,
      pageSize: 10,
      expanded: [],
    },
  },
  argTypes: {
    activeType: {
      control: "select",
      options: ["overview", "unknown-type", ...INTERPRETER.types.map((type) => type.id)],
    },
    onNavigate: { action: "onNavigate" },
    onSelectType: { action: "onSelectType" },
    onQueryChange: { action: "onQueryChange" },
    onFilterChange: { action: "onFilterChange" },
    onCreate: { action: "onCreate" },
    onSelectAsset: { action: "onSelectAsset" },
    onToggleCategory: { action: "onToggleCategory" },
    onPage: { action: "onPage" },
    onPageSize: { action: "onPageSize" },
    onToggleExpand: { action: "onToggleExpand" },
    onFilterToggle: { action: "onFilterToggle" },
    onOpen: { action: "onOpen" },
    onAction: { action: "onAction" },
  },
  render: function InterpreterStory(args) {
    const [activeType, setActiveType] = useSynced(args.activeType);
    const [query, setQuery] = useSynced(args.query);
    const [filterValues, setFilterValues] = useSynced(args.filterValues);
    const [selCategories, setSelCategories] = useSynced(args.principles?.selectedCategories || []);
    const [principlePage, setPrinciplePage] = useSynced(args.principles?.page || 1);
    const [principlePageSize, setPrinciplePageSize] = useSynced(args.principles?.pageSize || 10);
    const [principleExpanded, setPrincipleExpanded] = useSynced(args.principles?.expanded || []);
    /* Page-level container: filter/search/page/detail state survives switching
       to other knowledge types and back (module-level in the original). */
    const businessTerms = useBusinessTermDemo({
      ...INTERPRETER.businessTermLibrary,
      onNavigate: args.onNavigate,
      onQueryChange: args.onQueryChange,
      onFilterToggle: args.onFilterToggle,
      onPage: args.onPage,
      onPageSize: args.onPageSize,
      onOpen: args.onOpen,
      onAction: args.onAction,
      onCreate: args.onCreate,
    });
    return (
      <AiInterpreterPage
        {...args}
        activeType={activeType}
        query={query}
        filterValues={filterValues}
        businessTerms={businessTerms}
        principles={{
          ...args.principles,
          selectedCategories: selCategories,
          page: principlePage,
          pageSize: principlePageSize,
          expanded: principleExpanded,
          // types.js: query/category/page-size/type changes reset to page 1.
          onToggleCategory: (event) => {
            setSelCategories(
              event.checked
                ? [...selCategories, event.id]
                : selCategories.filter((id) => id !== event.id),
            );
            setPrinciplePage(1);
            args.onToggleCategory?.(event);
          },
          onPage: (event) => {
            setPrinciplePage(event.page);
            args.onPage?.(event);
          },
          onPageSize: (event) => {
            setPrinciplePageSize(event.pageSize);
            setPrinciplePage(1);
            args.onPageSize?.(event);
          },
          onToggleExpand: (event) => {
            setPrincipleExpanded(
              event.expanded
                ? [...principleExpanded, event.id]
                : principleExpanded.filter((id) => id !== event.id),
            );
            args.onToggleExpand?.(event);
          },
        }}
        onNavigate={args.onNavigate}
        onSelectType={(event) => {
          setActiveType(event.id);
          setFilterValues({});
          setPrinciplePage(1);
          args.onSelectType?.(event);
        }}
        onQueryChange={(event) => {
          setQuery(event.value);
          setPrinciplePage(1);
          args.onQueryChange?.(event);
        }}
        onFilterChange={(event) => {
          setFilterValues((values) => ({ ...values, [event.id]: event.value }));
          args.onFilterChange?.(event);
        }}
        onCreate={args.onCreate}
        onSelectAsset={args.onSelectAsset}
      />
    );
  },
};
