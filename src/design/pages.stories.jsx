import React from "react";
import { ASSISTANT, CAMPAIGN, COCKPIT, DATA_UPLOAD, HOME, INTERPRETER, LOGO, NAV, SELF_SERVICE, buildAssistantAnswer } from "./content.js";
import { AiInterpreterPage, CampaignPage, DataUploadPage, HomePage, MarketingCockpitPage, SelfServicePage } from "./pages.jsx";

const shell = { logo: LOGO, navigation: NAV };

export default {
  title: "Pages",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}

export const Home = {
  name: "Home",
  args: {
    assistantOpen: false,
    prompt: "",
    scope: "All",
    ...shell,
    hero: HOME.hero,
    heading: HOME.heading,
    cards: HOME.cards,
    assistant: ASSISTANT,
  },
  argTypes: {
    scope: { control: "select", options: ["All", "Campaigns", "Dashboards", "Knowledge"] },
    onNavigate: { action: "onNavigate" },
    onOpen: { action: "onOpen" },
    onOpenAssistant: { action: "onOpenAssistant" },
    onCloseAssistant: { action: "onCloseAssistant" },
    onSubmit: { action: "onSubmit" },
    onSuggestion: { action: "onSuggestion" },
    onScopeChange: { action: "onScopeChange" },
    onPromptChange: { action: "onPromptChange" },
    onNewSession: { action: "onNewSession" },
    onMaximize: { action: "onMaximize" },
    onHistorySelect: { action: "onHistorySelect" },
    onFeedback: { action: "onFeedback" },
  },
  render: function HomeStory(args) {
    const [open, setOpen] = useSynced(args.assistantOpen);
    const [prompt, setPrompt] = useSynced(args.prompt);
    const [scope, setScope] = useSynced(args.scope);
    const [answers, setAnswers] = React.useState([]);
    const scopeContexts = { All: "personalized", Campaigns: "campaign", Dashboards: "report", Knowledge: "knowledge" };
    return (
      <HomePage
        {...args}
        assistant={{ ...args.assistant, answers }}
        assistantOpen={open}
        prompt={prompt}
        scope={scope}
        onNavigate={args.onNavigate}
        onOpen={args.onOpen}
        onOpenAssistant={() => {
          setOpen(true);
          args.onOpenAssistant?.();
        }}
        onCloseAssistant={() => {
          setOpen(false);
          args.onCloseAssistant?.();
        }}
        onPromptChange={(event) => {
          setPrompt(event.value);
          args.onPromptChange?.(event);
        }}
        onSuggestion={(event) => {
          setPrompt(event.prompt);
          args.onSuggestion?.(event);
        }}
        onScopeChange={(event) => {
          setScope(event.scope);
          args.onScopeChange?.(event);
        }}
        onSubmit={(event) => {
          const text = String(event.prompt || "").trim();
          if (text) {
            setAnswers((items) => [...items, buildAssistantAnswer(text, scopeContexts[scope] || "personalized")]);
            setPrompt("");
          }
          args.onSubmit?.(event);
        }}
        onNewSession={() => {
          setAnswers([]);
          setPrompt("");
          args.onNewSession?.();
        }}
        onMaximize={args.onMaximize}
        onHistorySelect={(event) => {
          setPrompt(event.prompt);
          args.onHistorySelect?.(event);
        }}
        onFeedback={args.onFeedback}
      />
    );
  },
};

export const MarketingCockpit = {
  name: "Marketing Cockpit",
  args: { query: "", ...shell, hero: COCKPIT.hero, groups: COCKPIT.groups },
  argTypes: {
    onNavigate: { action: "onNavigate" },
    onOpen: { action: "onOpen" },
    onQueryChange: { action: "onQueryChange" },
  },
  render: function CockpitStory(args) {
    const [query, setQuery] = useSynced(args.query);
    return (
      <MarketingCockpitPage
        {...args}
        query={query}
        onNavigate={args.onNavigate}
        onOpen={args.onOpen}
        onQueryChange={(event) => {
          setQuery(event.value);
          args.onQueryChange?.(event);
        }}
      />
    );
  },
};

export const SelfService = {
  name: "Self-Service Center",
  args: {
    tab: "analysis",
    category: "all",
    ...shell,
    hero: SELF_SERVICE.hero,
    tabs: SELF_SERVICE.tabs,
    filters: SELF_SERVICE.filters,
    reports: SELF_SERVICE.reports,
    uploads: SELF_SERVICE.uploads,
    uploadHistory: SELF_SERVICE.uploadHistory,
  },
  argTypes: {
    tab: { control: "inline-radio", options: ["analysis", "upload"] },
    category: { control: "inline-radio", options: ["all", "dg", "dc"] },
    onNavigate: { action: "onNavigate" },
    onTabChange: { action: "onTabChange" },
    onCategoryChange: { action: "onCategoryChange" },
    onOpen: { action: "onOpen" },
    onOpenHistory: { action: "onOpenHistory" },
    onCloseHistory: { action: "onCloseHistory" },
    onPreviewFile: { action: "onPreviewFile" },
    onDownloadFile: { action: "onDownloadFile" },
  },
  render: function SelfServiceStory(args) {
    const [tab, setTab] = useSynced(args.tab);
    const [category, setCategory] = useSynced(args.category);
    const [history, setHistory] = React.useState({ open: false, rows: [] });
    return (
      <SelfServicePage
        {...args}
        tab={tab}
        category={category}
        uploadHistory={{ ...args.uploadHistory, ...history }}
        onNavigate={args.onNavigate}
        onOpen={args.onOpen}
        onOpenHistory={({ item }) => {
          setHistory({ open: true, rows: item.history || [] });
          args.onOpenHistory?.({ item });
        }}
        onCloseHistory={() => {
          setHistory((current) => ({ ...current, open: false }));
          args.onCloseHistory?.();
        }}
        onPreviewFile={args.onPreviewFile}
        onDownloadFile={args.onDownloadFile}
        onTabChange={(event) => {
          setTab(event.id);
          setCategory("all");
          args.onTabChange?.(event);
        }}
        onCategoryChange={(event) => {
          setCategory(event.id);
          args.onCategoryChange?.(event);
        }}
      />
    );
  },
};

export const Interpreter = {
  name: "AI Interpreter",
  args: {
    activeType: "overview",
    query: "",
    filterValues: {},
    ...shell,
    hero: INTERPRETER.hero,
    overviewItem: INTERPRETER.overview,
    sidebarTitle: INTERPRETER.sidebarTitle,
    types: INTERPRETER.types,
    records: INTERPRETER.records,
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
  },
  render: function InterpreterStory(args) {
    const [activeType, setActiveType] = useSynced(args.activeType);
    const [query, setQuery] = useSynced(args.query);
    const [filterValues, setFilterValues] = useSynced(args.filterValues);
    return (
      <AiInterpreterPage
        {...args}
        activeType={activeType}
        query={query}
        filterValues={filterValues}
        onNavigate={args.onNavigate}
        onSelectType={(event) => {
          setActiveType(event.id);
          setFilterValues({});
          args.onSelectType?.(event);
        }}
        onQueryChange={(event) => {
          setQuery(event.value);
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

export const Campaign = {
  name: "RedNote Campaign Tool",
  args: {
    section: "overview",
    channel: "rednote",
    query: "",
    assistantOpen: false,
    prompt: "",
    ...shell,
    assistant: ASSISTANT,
    rail: CAMPAIGN.rail,
    channels: CAMPAIGN.channels,
    metrics: CAMPAIGN.metrics,
    distribution: CAMPAIGN.distribution,
    objectives: CAMPAIGN.objectives,
    accountColumns: CAMPAIGN.accountColumns,
    accountRows: CAMPAIGN.accountRows,
    headings: CAMPAIGN.headings,
    panels: CAMPAIGN.panels,
    executionSummary: CAMPAIGN.executionSummary,
    taskQueue: CAMPAIGN.taskQueue,
    actionLog: CAMPAIGN.actionLog,
    creativeColumns: CAMPAIGN.creativeColumns,
    creatives: CAMPAIGN.creatives,
    efficiency: CAMPAIGN.efficiency,
    recommendations: CAMPAIGN.recommendations,
    bindingColumns: CAMPAIGN.bindingColumns,
    accounts: CAMPAIGN.accounts,
    taskDialog: CAMPAIGN.taskDialog,
    taskDialogOpen: false,
    toast: { open: false, message: "" },
  },
  argTypes: {
    section: { control: "select", options: ["overview", "execution", "assets", "analytics", "accounts"] },
    channel: { control: "inline-radio", options: ["rednote", "douyin"] },
    taskDialogOpen: { control: "boolean" },
    onNavigate: { action: "onNavigate" },
    onSectionChange: { action: "onSectionChange" },
    onChannelChange: { action: "onChannelChange" },
    onQueryChange: { action: "onQueryChange" },
    onFilter: { action: "onFilter" },
    onReset: { action: "onReset" },
    onCreateTask: { action: "onCreateTask" },
    onBindAccount: { action: "onBindAccount" },
    onCloseTask: { action: "onCloseTask" },
    onSubmitTask: { action: "onSubmitTask" },
    onSubmit: { action: "onSubmit" },
  },
  render: function CampaignStory(args) {
    const [section, setSection] = useSynced(args.section);
    const [channel, setChannel] = useSynced(args.channel);
    const [query, setQuery] = useSynced(args.query);
    const [open, setOpen] = useSynced(args.assistantOpen);
    const [prompt, setPrompt] = useSynced(args.prompt);
    const [taskOpen, setTaskOpen] = useSynced(args.taskDialogOpen);
    const [toast, setToast] = React.useState(args.toast || { open: false, message: "" });
    const toastTimer = React.useRef(null);
    const showToast = (message) => {
      clearTimeout(toastTimer.current);
      setToast({ open: true, message });
      toastTimer.current = setTimeout(() => setToast((current) => ({ ...current, open: false })), 3000);
    };
    return (
      <CampaignPage
        {...args}
        section={section}
        channel={channel}
        query={query}
        assistantOpen={open}
        prompt={prompt}
        onNavigate={args.onNavigate}
        onSectionChange={(event) => {
          setSection(event.id);
          args.onSectionChange?.(event);
        }}
        onChannelChange={(event) => {
          setChannel(event.id);
          args.onChannelChange?.(event);
        }}
        onQueryChange={(event) => {
          setQuery(event.value);
          args.onQueryChange?.(event);
        }}
        onFilter={args.onFilter}
        onReset={() => {
          setQuery("");
          args.onReset?.();
        }}
        taskDialogOpen={taskOpen}
        toast={toast}
        onCreateTask={() => {
          setTaskOpen(true);
          args.onCreateTask?.();
        }}
        onBindAccount={() => {
          showToast(CAMPAIGN.toasts.bindAccount);
          args.onBindAccount?.();
        }}
        onCloseTask={() => {
          setTaskOpen(false);
          args.onCloseTask?.();
        }}
        onSubmitTask={(event) => {
          setTaskOpen(false);
          showToast(CAMPAIGN.toasts.taskSubmitted);
          args.onSubmitTask?.(event);
        }}
        onOpenAssistant={() => setOpen(true)}
        onCloseAssistant={() => setOpen(false)}
        onPromptChange={(event) => setPrompt(event.value)}
        onSubmit={args.onSubmit}
      />
    );
  },
};

export const DataUpload = {
  name: "Data Upload",
  args: {
    ...shell,
    hero: SELF_SERVICE.hero,
    toolbar: DATA_UPLOAD.toolbar,
    fields: DATA_UPLOAD.fields,
    bulkImport: DATA_UPLOAD.bulkImport,
    submitLabel: "Submit",
    submittingLabel: "Submitted",
    submitting: false,
    bulkImportOpen: false,
    selectedFile: undefined,
  },
  argTypes: {
    submitting: { control: "boolean" },
    bulkImportOpen: { control: "boolean" },
    onNavigate: { action: "onNavigate" },
    onOpenImport: { action: "onOpenImport" },
    onCloseImport: { action: "onCloseImport" },
    onSelectFile: { action: "onSelectFile" },
    onDownloadTemplate: { action: "onDownloadTemplate" },
    onSubmitForm: { action: "onSubmitForm" },
  },
  render: function DataUploadStory(args) {
    const [importOpen, setImportOpen] = useSynced(args.bulkImportOpen);
    const [submitting, setSubmitting] = useSynced(args.submitting);
    const [selectedFile, setSelectedFile] = React.useState(args.selectedFile);
    const submitTimer = React.useRef(null);
    return (
      <DataUploadPage
        {...args}
        bulkImportOpen={importOpen}
        submitting={submitting}
        selectedFile={selectedFile}
        onNavigate={args.onNavigate}
        onOpenImport={() => {
          setImportOpen(true);
          args.onOpenImport?.();
        }}
        onCloseImport={() => {
          setImportOpen(false);
          args.onCloseImport?.();
        }}
        onSelectFile={(file) => {
          setSelectedFile(file.name);
          args.onSelectFile?.(file);
        }}
        onDownloadTemplate={args.onDownloadTemplate}
        onSubmitForm={(values) => {
          clearTimeout(submitTimer.current);
          setSubmitting(true);
          submitTimer.current = setTimeout(() => setSubmitting(false), 1500);
          args.onSubmitForm?.(values);
        }}
      />
    );
  },
};
