import React from "react";
import { ASSISTANT, CAMPAIGN, COCKPIT, HOME, INTERPRETER, LOGO, NAV } from "./content.js";
import {
  ActionCard,
  AssetRow,
  AssistantLauncher,
  AssistantPanel,
  assistantPlacements,
  BusinessTermForm,
  CampaignRail,
  Header,
  Hero,
  KnowledgeLibrary,
  KnowledgeSidebar,
  LibraryToolbar,
  Panel,
  ProjectCard,
  ProjectCatalog,
  SummaryStrip,
  TaskList,
  TypeCard,
  TypeGrid,
  WorkspaceCard,
  WorkspaceGrid,
} from "./organisms.jsx";
import { MetricStat } from "./molecules.jsx";

export default { title: "Organisms", tags: ["autodocs"] };

function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}

export const PortalHeader = {
  name: "Header",
  args: { current: "home", tone: "solid", position: "sticky" },
  argTypes: {
    current: { control: "select", options: NAV.map((item) => item.id) },
    tone: { control: "inline-radio", options: ["solid", "overlay"] },
    position: { control: "inline-radio", options: ["sticky", "fixed"] },
    onNavigate: { action: "onNavigate" },
  },
  render: (args) => (
    <div style={{ minHeight: 120, background: args.tone === "overlay" ? "#2a211c" : "#f4f6f8" }}>
      <Header logo={LOGO} items={NAV} {...args} />
    </div>
  ),
};

export const HomeHero = {
  name: "Hero",
  args: { title: HOME.hero.title, description: HOME.hero.description, eyebrow: "" },
  render: (args) => (
    <Hero image={HOME.hero.image} height={300} variant="home" scrim="home" {...args}>
      {HOME.hero.stats.map((stat) => (
        <MetricStat key={stat.label} {...stat} variant="glass" />
      ))}
    </Hero>
  ),
};

export const Workspace = {
  name: "Workspace card",
  args: { title: HOME.cards[0].title, description: HOME.cards[0].description },
  argTypes: { onOpen: { action: "onOpen" }, onNavigate: { action: "onNavigate" } },
  render: (args) => (
    <div style={{ width: 320 }}>
      <WorkspaceCard {...HOME.cards[0]} {...args} />
    </div>
  ),
};

export const Project = {
  name: "Project card",
  args: { title: COCKPIT.groups[0].projects[0].title, description: COCKPIT.groups[0].projects[0].description },
  argTypes: { onOpen: { action: "onOpen" } },
  render: (args) => (
    <div style={{ width: 360 }}>
      <ProjectCard {...COCKPIT.groups[0].projects[0]} {...args} />
    </div>
  ),
};

export const ReportAction = {
  name: "Action card",
  args: { title: "MZ Tracking Detail", description: "Miaozhen OTV/OLV media monitoring self-analysis.", actionLabel: "Open data view" },
  argTypes: { onOpen: { action: "onOpen" } },
  render: (args) => <ActionCard {...args} />,
};

export const Sidebar = {
  name: "Knowledge sidebar",
  args: { active: "overview" },
  argTypes: {
    active: { control: "select", options: ["overview", ...INTERPRETER.types.map((type) => type.id)] },
    onSelect: { action: "onSelect" },
  },
  render: (args) => (
    <div style={{ width: 240 }}>
      <KnowledgeSidebar
        overview={INTERPRETER.overview}
        title={INTERPRETER.sidebarTitle}
        types={INTERPRETER.types}
        activeId={args.active}
        onSelect={args.onSelect}
      />
    </div>
  ),
};

export const KnowledgeType = {
  name: "Type card",
  args: { ...INTERPRETER.types[0], count: "10 principles", active: false, manageable: false, art: 0 },
  argTypes: {
    manageable: { control: "boolean" },
    onSelect: { action: "onSelect" },
  },
  render: (args) => <TypeCard {...args} />,
};

export const Library = {
  name: "Knowledge library",
  args: {
    typeId: "Scenario Reporting",
    query: "",
    filterValues: {},
  },
  argTypes: {
    typeId: { control: "select", options: INTERPRETER.types.map((type) => type.id) },
    onQueryChange: { action: "onQueryChange" },
    onFilterChange: { action: "onFilterChange" },
    onCreate: { action: "onCreate" },
    onSelect: { action: "onSelect" },
  },
  render: function LibraryStory(args) {
    const type = INTERPRETER.types.find((item) => item.id === args.typeId);
    const [query, setQuery] = useSynced(args.query);
    const [filterValues, setFilterValues] = useSynced(args.filterValues);
    const typeRecords = INTERPRETER.records.filter((record) => record.typeId === args.typeId);
    const filters = (type?.statusFilters || []).map((filter) => ({
      ...filter,
      options:
        filter.options ||
        [...new Set(typeRecords.flatMap((record) => record[filter.id] ?? []))].map((value) => ({ id: value, label: value })),
    }));
    const rows = typeRecords.filter((record) => {
      const queryMatch = !query || `${record.title} ${record.summary}`.toLowerCase().includes(query.toLowerCase());
      const filterMatch = filters.every((filter) => {
        const selected = filterValues[filter.id];
        if (!selected) return true;
        const field = (filter.options || []).find((option) => option.id === selected)?.field || filter.id;
        const values = record[field];
        return (Array.isArray(values) ? values : [values]).includes(selected);
      });
      return queryMatch && filterMatch;
    });
    return (
      <KnowledgeLibrary
        type={{ ...type, statusFilters: filters }}
        query={query}
        filterValues={filterValues}
        rows={rows}
        onQueryChange={(event) => {
          setQuery(event.value);
          args.onQueryChange?.(event);
        }}
        onFilterChange={(event) => {
          setFilterValues((values) => ({ ...values, [event.id]: event.value }));
          args.onFilterChange?.(event);
        }}
        onCreate={args.onCreate}
        onSelect={args.onSelect}
      />
    );
  },
};

export const TypeOverview = {
  name: "Type grid",
  args: { activeId: "overview" },
  argTypes: {
    activeId: { control: "select", options: ["overview", ...INTERPRETER.types.map((type) => type.id)] },
    onSelect: { action: "onSelect" },
  },
  render: (args) => <TypeGrid items={INTERPRETER.types} {...args} />,
};

export const Launcher = {
  name: "Assistant launcher",
  argTypes: { onOpen: { action: "onOpen" } },
  render: (args) => (
    <div style={{ height: 120 }}>
      <AssistantLauncher {...args} />
    </div>
  ),
};

export const AskPanel = {
  name: "Assistant panel",
  args: { open: true, placement: "modal", showScopes: true, scope: "All", prompt: "" },
  argTypes: {
    placement: { control: "inline-radio", options: assistantPlacements },
    showScopes: { control: "boolean" },
    scope: { control: "select", options: ASSISTANT.scopes },
    onClose: { action: "onClose" },
    onSubmit: { action: "onSubmit" },
    onPromptChange: { action: "onPromptChange" },
    onSuggestion: { action: "onSuggestion" },
    onScopeChange: { action: "onScopeChange" },
  },
  parameters: { layout: "fullscreen" },
  render: (args) => <AssistantPanel {...ASSISTANT} {...args} />,
};

export const TradingRail = {
  name: "Campaign rail",
  args: { current: "overview" },
  argTypes: {
    current: { control: "select", options: CAMPAIGN.rail.items.map((item) => item.id) },
    onSelect: { action: "onSelect" },
  },
  render: (args) => (
    <div style={{ width: 260 }}>
      <CampaignRail {...CAMPAIGN.rail} {...args} />
    </div>
  ),
};

export const TermForm = {
  name: "Business term form",
  args: { title: "", kind: "Business Term", description: "", synonyms: "", invalid: false },
  argTypes: {
    kind: { control: "select", options: ["Business Term", "Global Synonym"] },
    onChange: { action: "onChange" },
    onCancel: { action: "onCancel" },
    onSave: { action: "onSave" },
    onSubmit: { action: "onSubmit" },
  },
  render: (args) => <BusinessTermForm {...args} />,
};

export const WorkspaceCards = {
  name: "Workspace grid",
  argTypes: {
    onOpen: { action: "onOpen" },
    onNavigate: { action: "onNavigate" },
  },
  render: (args) => <WorkspaceGrid cards={HOME.cards} {...args} />,
};

export const Catalog = {
  name: "Project catalog",
  args: { groups: COCKPIT.groups },
  argTypes: { onOpen: { action: "onOpen" } },
  render: (args) => <ProjectCatalog {...args} />,
};

export const Toolbar = {
  name: "Library toolbar",
  args: { typeId: "Business Term", query: "", filterValues: {} },
  argTypes: {
    typeId: { control: "select", options: INTERPRETER.types.map((type) => type.id) },
    onQueryChange: { action: "onQueryChange" },
    onFilterChange: { action: "onFilterChange" },
    onCreate: { action: "onCreate" },
  },
  render: function ToolbarStory(args) {
    const type = INTERPRETER.types.find((item) => item.id === args.typeId);
    const [query, setQuery] = useSynced(args.query);
    const [filterValues, setFilterValues] = useSynced(args.filterValues);
    return (
      <LibraryToolbar
        filters={type?.statusFilters || []}
        filterValues={filterValues}
        query={query}
        createLabel={type?.manageable ? type.createLabel : undefined}
        onQueryChange={(event) => {
          setQuery(event.value);
          args.onQueryChange?.(event);
        }}
        onFilterChange={(event) => {
          setFilterValues((values) => ({ ...values, [event.id]: event.value }));
          args.onFilterChange?.(event);
        }}
        onCreate={args.onCreate}
      />
    );
  },
};

export const Asset = {
  name: "Asset row",
  args: {
    ...INTERPRETER.records.find((record) => record.typeId === "Business Term"),
    active: false,
  },
  argTypes: {
    stage: { control: "select", options: ["draft", "under-review", "queued", "building", "published"] },
    availability: { control: "inline-radio", options: ["enabled", "disabled"] },
    onSelect: { action: "onSelect" },
  },
  render: (args) => <AssetRow {...args} />,
};

export const SectionPanel = {
  name: "Panel",
  args: { eyebrow: "Trading Desk", title: "Account Operation Details", meta: "3 accounts shown" },
  render: (args) => (
    <Panel {...args}>
      <p style={{ margin: 0 }}>Panel body content — tables, lists, or charts render here.</p>
    </Panel>
  ),
};

export const ExecutionSummary = {
  name: "Summary strip",
  render: () => <SummaryStrip items={CAMPAIGN.executionSummary} />,
};

export const Queue = {
  name: "Task list",
  render: () => <TaskList items={CAMPAIGN.taskQueue} />,
};
