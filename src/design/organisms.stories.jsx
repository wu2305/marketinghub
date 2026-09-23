import React from "react";
import { ASSISTANT, CAMPAIGN, COCKPIT, HOME, INTERPRETER, LOGO, NAV } from "./content.js";
import {
  ActionCard,
  AssistantLauncher,
  AssistantPanel,
  assistantPlacements,
  BusinessTermForm,
  CampaignRail,
  Header,
  Hero,
  KnowledgeLibrary,
  KnowledgeSidebar,
  MetricStat,
  ProjectCard,
  TypeCard,
  WorkspaceCard,
} from "./organisms.jsx";

export default { title: "Organisms" };

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
    return (
      <KnowledgeLibrary
        type={type}
        query={args.query}
        filterValues={args.filterValues}
        rows={INTERPRETER.records.filter((record) => record.typeId === args.typeId)}
        onQueryChange={args.onQueryChange}
        onFilterChange={args.onFilterChange}
        onCreate={args.onCreate}
        onSelect={args.onSelect}
      />
    );
  },
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
