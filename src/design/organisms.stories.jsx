import React from "react";
import { ASSISTANT, CAMPAIGN, COCKPIT, HOME, INTERPRETER, LITE_ASSISTANT, LOGO, MODEL_FLOW, NAV, SELF_SERVICE, buildLiteAssistantAnswer, buildModelDraft } from "./content.js";
import {
  ActionCard,
  AssetRow,
  AssistantLauncher,
  AssistantPanel,
  assistantPlacements,
  headerPositions,
  headerTones,
  BusinessTermForm,
  CampaignRail,
  Header,
  Hero,
  KnowledgeLibrary,
  KnowledgeSidebar,
  LibraryToolbar,
  Modal,
  modalVariants,
  ModelFlowDialog,
  modelFlowSteps,
  Panel,
  ProjectCard,
  ProjectCatalog,
  SummaryStrip,
  TaskList,
  TypeCard,
  TypeGrid,
  UploadHistory,
  WorkspaceCard,
  WorkspaceGrid,
} from "./organisms.jsx";
import { Button } from "./atoms.jsx";
import { MetricStat } from "./molecules.jsx";
import { recordMatchesFilter, uniqueFilterOptions } from "./cx.js";

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
    tone: { control: "inline-radio", options: headerTones },
    position: { control: "inline-radio", options: headerPositions },
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
  args: {
    title: "MZ Tracking Detail",
    description: "Miaozhen OTV/OLV media monitoring self-analysis.",
    actionLabel: "Open data view",
    href: "/assets/pages/media-tracking-detail.html",
    history: undefined,
  },
  argTypes: {
    onOpen: { action: "onOpen" },
    onShowHistory: { action: "onShowHistory" },
  },
  render: (args) => <ActionCard {...args} />,
};

export const UploadHistoryDialog = {
  name: "Upload history",
  args: {
    open: true,
    title: SELF_SERVICE.uploadHistory.title,
    rows: SELF_SERVICE.uploads[0].history,
    emptyMessage: SELF_SERVICE.uploadHistory.emptyMessage,
  },
  argTypes: {
    open: { control: "boolean" },
    onClose: { action: "onClose" },
    onPreview: { action: "onPreview" },
    onDownload: { action: "onDownload" },
  },
  parameters: { layout: "fullscreen" },
  render: function UploadHistoryStory(args) {
    const [open, setOpen] = React.useState(args.open);
    React.useEffect(() => setOpen(args.open), [args.open]);
    return (
      <UploadHistory
        {...args}
        open={open}
        onClose={() => {
          setOpen(false);
          args.onClose?.();
        }}
      />
    );
  },
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
      options: filter.options || uniqueFilterOptions(typeRecords, filter.id),
    }));
    const rows = typeRecords.filter((record) => {
      const queryMatch = !query || `${record.title} ${record.summary}`.toLowerCase().includes(query.toLowerCase());
      const filterMatch = filters.every((filter) => {
        const selected = filterValues[filter.id];
        return !selected || recordMatchesFilter(record, filter, selected);
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

export const LiteAskPanel = {
  name: "Assistant panel (lite)",
  args: { open: true },
  argTypes: {
    open: { control: "boolean" },
    onClose: { action: "onClose" },
    onSubmit: { action: "onSubmit" },
    onAttach: { action: "onAttach" },
    onSelectSkill: { action: "onSelectSkill" },
    onClearSkill: { action: "onClearSkill" },
    onSkillAction: { action: "onSkillAction" },
  },
  parameters: { layout: "fullscreen" },
  render: function LiteAskPanelStory(args) {
    const [open, setOpen] = React.useState(args.open);
    React.useEffect(() => setOpen(args.open), [args.open]);
    const [prompt, setPrompt] = React.useState("");
    const [answers, setAnswers] = React.useState([]);
    const [skill, setSkill] = React.useState(null);
    return (
      <AssistantPanel
        {...LITE_ASSISTANT}
        {...args}
        open={open}
        placement="drawer"
        showPicks={false}
        enterToSubmit={false}
        prompt={prompt}
        answers={answers}
        selectedSkill={skill}
        onClose={() => {
          setOpen(false);
          args.onClose?.();
        }}
        onPromptChange={(event) => setPrompt(event.value)}
        onSuggestion={(event) => setPrompt(event.prompt)}
        onHistorySelect={(event) => setPrompt(event.prompt)}
        onNewSession={() => {
          setAnswers([]);
          setPrompt("");
        }}
        onSubmit={(event) => {
          const text = String(event.prompt || "").trim();
          if (text) {
            setAnswers([buildLiteAssistantAnswer(text)]);
            setPrompt("");
          }
          args.onSubmit?.(event);
        }}
        onAttach={args.onAttach}
        onSelectSkill={(event) => {
          setSkill(event);
          args.onSelectSkill?.(event);
        }}
        onClearSkill={() => {
          setSkill(null);
          args.onClearSkill?.();
        }}
        onSkillAction={args.onSkillAction}
      />
    );
  },
};

export const ModelFlow = {
  name: "Model flow dialog",
  args: { step: "history" },
  argTypes: {
    step: { control: "inline-radio", options: modelFlowSteps },
    onToggleMessage: { action: "onToggleMessage" },
    onRuleChange: { action: "onRuleChange" },
    onGenerate: { action: "onGenerate" },
    onBack: { action: "onBack" },
    onClose: { action: "onClose" },
    onSave: { action: "onSave" },
    onSubmit: { action: "onSubmit" },
  },
  parameters: { layout: "fullscreen" },
  render: function ModelFlowStory(args) {
    const [step, setStep] = React.useState(args.step);
    React.useEffect(() => setStep(args.step), [args.step]);
    const [threads, setThreads] = React.useState(MODEL_FLOW.threads);
    const [rule, setRule] = React.useState("");
    const [draft, setDraft] = React.useState({});
    return (
      <ModelFlowDialog
        step={step}
        threads={threads}
        rule={rule}
        draft={draft}
        sections={MODEL_FLOW.sections}
        onToggleMessage={({ threadIndex, messageIndex, checked }) => {
          setThreads((current) =>
            current.map((thread, ti) =>
              ti === threadIndex
                ? { ...thread, messages: thread.messages.map((message, mi) => (mi === messageIndex ? { ...message, checked } : message)) }
                : thread,
            ),
          );
          args.onToggleMessage?.({ threadIndex, messageIndex, checked });
        }}
        onRuleChange={({ value }) => {
          setRule(value);
          args.onRuleChange?.({ value });
        }}
        onGenerate={(event) => {
          setDraft(buildModelDraft(event.messages, event.rule));
          setStep("generated");
          args.onGenerate?.(event);
        }}
        onBack={() => {
          setStep("history");
          args.onBack?.();
        }}
        onClose={() => args.onClose?.()}
        onSave={args.onSave}
        onSubmit={args.onSubmit}
      />
    );
  },
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

export const DialogModal = {
  name: "Modal",
  args: {
    open: false,
    eyebrow: "Campaign execution",
    title: "Create Campaign Task",
    closeLabel: "Close",
  },
  argTypes: {
    open: { control: "boolean" },
    variant: { control: "inline-radio", options: modalVariants },
    onClose: { action: "onClose" },
  },
  render: function ModalStory(args) {
    const [open, setOpen] = React.useState(args.open);
    React.useEffect(() => setOpen(args.open), [args.open]);
    return (
      <>
        <p>
          <Button variant="primary" onClick={() => setOpen(true)}>
            Open modal
          </Button>
        </p>
        <Modal
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
            args.onClose?.();
          }}
        >
          <p>Modal body content — forms, previews, and footers render here.</p>
        </Modal>
      </>
    );
  },
};
