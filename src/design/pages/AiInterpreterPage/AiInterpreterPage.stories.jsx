import React from "react";
import { INTERPRETER } from "../../content.js";
import { useInterpreterDemo } from "../../demo/interpreter-demo.js";
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
    onCloseDetail: { action: "onCloseDetail" },
    onAction: { action: "onAction" },
    onDialogConfirm: { action: "onDialogConfirm" },
    onDialogCancel: { action: "onDialogCancel" },
  },
  render: function InterpreterStory(args) {
    const [activeType, setActiveType] = useSynced(args.activeType);
    const onSelectType = (event) => {
      setActiveType(event.id);
      args.onSelectType?.(event);
    };
    /* Page-level container: filter/search/page/detail state survives switching
       to other knowledge types and back (module-level in the original). */
    const demo = useInterpreterDemo({
      types: args.types,
      records: args.records,
      activeType,
      query: args.query,
      filterValues: args.filterValues,
      principles: args.principles,
      businessTermLibrary: INTERPRETER.businessTermLibrary,
      onNavigate: args.onNavigate,
      onQueryChange: args.onQueryChange,
      onFilterChange: args.onFilterChange,
      onCreate: args.onCreate,
      onSelectAsset: args.onSelectAsset,
      onToggleCategory: args.onToggleCategory,
      onPage: args.onPage,
      onPageSize: args.onPageSize,
      onToggleExpand: args.onToggleExpand,
      onFilterToggle: args.onFilterToggle,
      onOpen: args.onOpen,
      onCloseDetail: args.onCloseDetail,
      onAction: args.onAction,
      onDialogConfirm: args.onDialogConfirm,
      onDialogCancel: args.onDialogCancel,
    });
    return <AiInterpreterPage {...args} activeType={activeType} {...demo} onSelectType={onSelectType} />;
  },
};
