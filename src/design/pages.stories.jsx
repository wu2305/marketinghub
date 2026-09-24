import React from "react";
import { ASSISTANT, ASSISTANT_SKILL_MENU, CAMPAIGN, COCKPIT, COCKPIT_SKILL_MENU, DATA_UPLOAD, HOME, INTERPRETER, LITE_ASSISTANT, LOGO, MEDIA_TRACKING, MODEL_FLOW, NAV, SELF_SERVICE, buildCampaignAnswer, buildHomeAssistantAnswer, buildLiteAssistantAnswer, buildModelDraft, buildReportAssistantAnswer } from "./content.js";
import { AiInterpreterPage } from "./pages/AiInterpreterPage/index.jsx";
import { CampaignPage } from "./pages/CampaignPage/index.jsx";
import { DataUploadPage } from "./pages/DataUploadPage/index.jsx";
import { HomePage } from "./pages/HomePage/index.jsx";
import { MarketingCockpitPage, cockpitViews } from "./pages/MarketingCockpitPage/index.jsx";
import { MediaTrackingDetailPage } from "./pages/MediaTrackingDetailPage/index.jsx";
import { SelfServicePage } from "./pages/SelfServicePage/index.jsx";
import { CITY_INVEST, COPILOT, KNOWLEDGE_ASSETS } from "./demo/report-fixtures.js";
import { cityInvestScenarioSource } from "./demo/report-demo.js";
import { useCockpitDemo } from "./demo/cockpit-demo.js";
import { useHomeDemo } from "./demo/home-demo.js";
import { useBusinessTermDemo } from "./demo/business-term-demo.js";

const shell = { logo: LOGO, navigation: NAV };
const HOME_DEMO = { answerFor: buildHomeAssistantAnswer, modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft };

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
    assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU },
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
    onHistory: { action: "onHistory" },
    onHistorySelect: { action: "onHistorySelect" },
    onFeedback: { action: "onFeedback" },
    onAttach: { action: "onAttach" },
    onSelectSkill: { action: "onSelectSkill" },
    onClearSkill: { action: "onClearSkill" },
    onSkillAction: { action: "onSkillAction" },
    onFlowSave: { action: "onFlowSave" },
    onFlowSubmit: { action: "onFlowSubmit" },
  },
  render: function HomeStory(args) {
    return <HomePage {...useHomeDemo({ ...args, demo: HOME_DEMO })} />;
  },
};

/* CityInvestDashboard arg data: the component never reads `baseline` — only the
   getScenario source built from it does. */
const { baseline: _baseline, ...CITY_INVEST_VIEW } = CITY_INVEST;

export const MarketingCockpit = {
  name: "Marketing Cockpit",
  args: {
    query: "",
    project: "all",
    view: "catalog",
    details: null,
    assistantOpen: false,
    workspaceOpen: false,
    prompt: "",
    ...shell,
    hero: COCKPIT.hero,
    groups: COCKPIT.groups,
    projects: COCKPIT.projects,
    knowledge: KNOWLEDGE_ASSETS,
    cityInvest: { ...CITY_INVEST_VIEW, getScenario: cityInvestScenarioSource(CITY_INVEST) },
    demo: { copilot: COPILOT, modelFlow: MODEL_FLOW, reportAnswerFor: buildReportAssistantAnswer },
    detailsSections: COCKPIT.detailsSections,
    assistant: { ...COCKPIT.assistant, showScopes: false, showPicks: false, hideStageOnAnswers: true, enterToSubmit: false, skillMenu: COCKPIT_SKILL_MENU },
  },
  argTypes: {
    project: { control: "select", options: ["all", "city", "fourp", "customer", "abo", "rednote", "ottolv"] },
    view: { control: "select", options: cockpitViews },
    dashboard: { control: { type: "number", min: 0, max: 1 } },
    knowledge: { control: false },
    cityInvest: { control: false },
    demo: { control: false },
    onFiltersChange: { action: "onFiltersChange" },
    onNavigate: { action: "onNavigate" },
    onQueryChange: { action: "onQueryChange" },
    onOpenProject: { action: "onOpenProject" },
    onOpenReport: { action: "onOpenReport" },
    onOpenDetails: { action: "onOpenDetails" },
    onCloseDetails: { action: "onCloseDetails" },
    onOpenLive: { action: "onOpenLive" },
    onBack: { action: "onBack" },
    onOpenWorkspace: { action: "onOpenWorkspace" },
    onWorkspaceClose: { action: "onWorkspaceClose" },
    onWorkspaceBack: { action: "onWorkspaceBack" },
    onWorkspaceRecommendation: { action: "onWorkspaceRecommendation" },
    onWorkspaceAsk: { action: "onWorkspaceAsk" },
    onWorkspacePromptChange: { action: "onWorkspacePromptChange" },
    onWorkspaceExplore: { action: "onWorkspaceExplore" },
    onChatFeedback: { action: "onChatFeedback" },
    onCopy: { action: "onCopy" },
    onOpenAssistant: { action: "onOpenAssistant" },
    onCloseAssistant: { action: "onCloseAssistant" },
    onPromptChange: { action: "onPromptChange" },
    onSubmit: { action: "onSubmit" },
    onSuggestion: { action: "onSuggestion" },
    onNewSession: { action: "onNewSession" },
    onMaximize: { action: "onMaximize" },
    onHistory: { action: "onHistory" },
    onHistorySelect: { action: "onHistorySelect" },
    onFeedback: { action: "onFeedback" },
    onAttach: { action: "onAttach" },
    onSelectSkill: { action: "onSelectSkill" },
    onClearSkill: { action: "onClearSkill" },
    onSkillAction: { action: "onSkillAction" },
    onFlowSave: { action: "onFlowSave" },
    onFlowSubmit: { action: "onFlowSubmit" },
  },
  render: function CockpitStory(args) {
    return <MarketingCockpitPage {...useCockpitDemo(args)} />;
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
    const [categories, setCategories] = React.useState({ analysis: args.category, upload: "all" });
    const [history, setHistory] = React.useState(null);
    const uploadHistory = { ...args.uploadHistory, ...(history || {}) };
    return (
      <SelfServicePage
        {...args}
        tab={tab}
        category={categories[tab] || "all"}
        uploadHistory={uploadHistory}
        onNavigate={args.onNavigate}
        onOpen={args.onOpen}
        onOpenHistory={({ item }) => {
          setHistory({ open: true, rows: item.history || [] });
          args.onOpenHistory?.({ item });
        }}
        onCloseHistory={() => {
          setHistory((current) => ({ ...(current || {}), open: false }));
          args.onCloseHistory?.();
        }}
        onPreviewFile={args.onPreviewFile}
        onDownloadFile={args.onDownloadFile}
        onTabChange={(event) => {
          setTab(event.id);
          args.onTabChange?.(event);
        }}
        onCategoryChange={(event) => {
          setCategories((current) => ({ ...current, [tab]: event.id }));
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

export const Campaign = {
  name: "RedNote Campaign Tool",
  args: {
    section: "overview",
    channel: "rednote",
    query: "",
    assistantOpen: false,
    prompt: "",
    ...shell,
    assistant: CAMPAIGN.assistant,
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
    taskDraft: { control: "object" },
    onTaskDraftChange: { action: "onTaskDraftChange" },
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
    onSuggestion: { action: "onSuggestion" },
    onNewSession: { action: "onNewSession" },
    onMaximize: { action: "onMaximize" },
    onHistorySelect: { action: "onHistorySelect" },
    onFeedback: { action: "onFeedback" },
    onAttach: { action: "onAttach" },
    onSelectSkill: { action: "onSelectSkill" },
    onClearSkill: { action: "onClearSkill" },
    onSkillAction: { action: "onSkillAction" },
    onFlowSave: { action: "onFlowSave" },
    onFlowSubmit: { action: "onFlowSubmit" },
  },
  render: function CampaignStory(args) {
    const [section, setSection] = useSynced(args.section);
    const [channel, setChannel] = useSynced(args.channel);
    const [query, setQuery] = useSynced(args.query);
    const [open, setOpen] = useSynced(args.assistantOpen);
    const [prompt, setPrompt] = useSynced(args.prompt);
    const [answers, setAnswers] = React.useState([]);
    const [skill, setSkill] = React.useState(null);
    const [flow, setFlow] = React.useState(null);
    const [taskOpen, setTaskOpen] = useSynced(args.taskDialogOpen);
    const [toast, setToast] = useSynced(args.toast || { open: false, message: "" });
    const toastTimer = React.useRef(null);
    React.useEffect(() => () => clearTimeout(toastTimer.current), []);
    const showToast = (message) => {
      clearTimeout(toastTimer.current);
      setToast({ open: true, message });
      toastTimer.current = setTimeout(() => setToast((current) => ({ ...current, open: false })), 2600);
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
        /* workspace.js: submit replaces the feed with one answer entry; a
           suggestion click submits immediately and clears the composer. */
        onSuggestion={(event) => {
          setAnswers([buildCampaignAnswer(event.prompt)]);
          setPrompt("");
          args.onSuggestion?.(event);
        }}
        onSubmit={(event) => {
          const text = String(event.prompt || "").trim();
          if (text) {
            setAnswers([buildCampaignAnswer(text)]);
            setPrompt("");
          }
          args.onSubmit?.(event);
        }}
        assistant={{
          ...args.assistant,
          answers,
          selectedSkill: skill,
          onNewSession: () => {
            setAnswers([]);
            setPrompt("");
            args.onNewSession?.();
          },
          onMaximize: args.onMaximize,
          onHistorySelect: (event) => {
            setPrompt(event.prompt);
            args.onHistorySelect?.(event);
          },
          onFeedback: args.onFeedback,
          onAttach: args.onAttach,
          onSelectSkill: (event) => {
            setSkill({ id: event.id, type: event.type, title: event.title });
            args.onSelectSkill?.(event);
          },
          onClearSkill: () => {
            setSkill(null);
            args.onClearSkill?.();
          },
          onSkillAction: ({ action }) => {
            args.onSkillAction?.({ action });
            setFlow({
              step: action === "history" ? "history" : "manual",
              threads: MODEL_FLOW.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) })),
              rule: "",
              draft: {},
            });
          },
        }}
        skillFlow={
          flow
            ? {
                step: flow.step,
                threads: flow.threads,
                rule: flow.rule,
                draft: flow.draft,
                sections: MODEL_FLOW.sections,
                onToggleMessage: ({ threadIndex, messageIndex, checked }) =>
                  setFlow((current) => ({
                    ...current,
                    threads: current.threads.map((thread, ti) =>
                      ti === threadIndex
                        ? { ...thread, messages: thread.messages.map((message, mi) => (mi === messageIndex ? { ...message, checked } : message)) }
                        : thread,
                    ),
                  })),
                onRuleChange: ({ value }) => setFlow((current) => ({ ...current, rule: value })),
                onGenerate: ({ messages, rule }) =>
                  setFlow((current) => ({ ...current, step: "generated", rule, draft: buildModelDraft(messages, rule) })),
                onBack: () => setFlow((current) => ({ ...current, step: "history" })),
                onClose: () => setFlow(null),
                onSave: ({ values }) => args.onFlowSave?.(values),
                onSubmit: ({ values }) => args.onFlowSubmit?.(values),
              }
            : undefined
        }
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
    const [selectedFile, setSelectedFile] = useSynced(args.selectedFile);
    const submitTimer = React.useRef(null);
    React.useEffect(() => () => clearTimeout(submitTimer.current), []);
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

export const MediaTrackingDetail = {
  name: "Media Tracking Detail",
  args: {
    ...shell,
    toolbar: MEDIA_TRACKING.toolbar,
    head: MEDIA_TRACKING.head,
    periods: MEDIA_TRACKING.periods,
    period: "monthly",
    filters: MEDIA_TRACKING.filters,
    notes: MEDIA_TRACKING.notes,
    table: MEDIA_TRACKING.table,
    assistant: { ...LITE_ASSISTANT, showScopes: false, showPicks: false },
    assistantOpen: false,
    prompt: "",
  },
  argTypes: {
    period: { control: "inline-radio", options: ["daily", "weekly", "monthly", "spot"] },
    onNavigate: { action: "onNavigate" },
    onPeriodChange: { action: "onPeriodChange" },
    onFilterChange: { action: "onFilterChange" },
    onOpenAssistant: { action: "onOpenAssistant" },
    onCloseAssistant: { action: "onCloseAssistant" },
    onPromptChange: { action: "onPromptChange" },
    onSubmit: { action: "onSubmit" },
    onSuggestion: { action: "onSuggestion" },
    onNewSession: { action: "onNewSession" },
    onMaximize: { action: "onMaximize" },
    onHistory: { action: "onHistory" },
    onHistorySelect: { action: "onHistorySelect" },
    onAttach: { action: "onAttach" },
    onSelectSkill: { action: "onSelectSkill" },
    onClearSkill: { action: "onClearSkill" },
    onSkillAction: { action: "onSkillAction" },
    onFlowSave: { action: "onFlowSave" },
    onFlowSubmit: { action: "onFlowSubmit" },
  },
  render: function MediaTrackingStory(args) {
    const [period, setPeriod] = useSynced(args.period);
    const [open, setOpen] = useSynced(args.assistantOpen);
    const [prompt, setPrompt] = useSynced(args.prompt);
    const [answers, setAnswers] = React.useState([]);
    const [skill, setSkill] = React.useState(null);
    const [flow, setFlow] = React.useState(null);
    return (
      <MediaTrackingDetailPage
        {...args}
        period={period}
        assistant={{ ...args.assistant, answers, selectedSkill: skill }}
        assistantOpen={open}
        prompt={prompt}
        skillFlow={
          flow
            ? {
                step: flow.step,
                threads: flow.threads,
                rule: flow.rule,
                draft: flow.draft,
                sections: MODEL_FLOW.sections,
                onToggleMessage: ({ threadIndex, messageIndex, checked }) =>
                  setFlow((current) => ({
                    ...current,
                    threads: current.threads.map((thread, ti) =>
                      ti === threadIndex
                        ? { ...thread, messages: thread.messages.map((message, mi) => (mi === messageIndex ? { ...message, checked } : message)) }
                        : thread,
                    ),
                  })),
                onRuleChange: ({ value }) => setFlow((current) => ({ ...current, rule: value })),
                onGenerate: ({ messages, rule }) =>
                  setFlow((current) => ({ ...current, step: "generated", rule, draft: buildModelDraft(messages, rule) })),
                onBack: () => setFlow((current) => ({ ...current, step: "history" })),
                onClose: () => setFlow(null),
                onSave: ({ values }) => args.onFlowSave?.(values),
                onSubmit: ({ values }) => args.onFlowSubmit?.(values),
              }
            : undefined
        }
        onNavigate={args.onNavigate}
        onPeriodChange={(event) => {
          setPeriod(event.id);
          args.onPeriodChange?.(event);
        }}
        onFilterChange={args.onFilterChange}
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
        onSubmit={(event) => {
          const text = String(event.prompt || "").trim();
          if (text) {
            setAnswers([buildLiteAssistantAnswer(text)]);
            setPrompt("");
          }
          args.onSubmit?.(event);
        }}
        onSuggestion={(event) => {
          setPrompt(event.prompt);
          args.onSuggestion?.(event);
        }}
        onNewSession={() => {
          setAnswers([]);
          setPrompt("");
          args.onNewSession?.();
        }}
        onMaximize={args.onMaximize}
        onHistory={args.onHistory}
        onHistorySelect={(event) => {
          setPrompt(event.prompt);
          args.onHistorySelect?.(event);
        }}
        onAttach={args.onAttach}
        onSelectSkill={(event) => {
          setSkill({ id: event.id, type: event.type, title: event.title });
          args.onSelectSkill?.(event);
        }}
        onClearSkill={() => {
          setSkill(null);
          args.onClearSkill?.();
        }}
        onSkillAction={({ action }) => {
          args.onSkillAction?.({ action });
          setFlow({
            step: action === "history" ? "history" : "manual",
            threads: MODEL_FLOW.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) })),
            rule: "",
            draft: {},
          });
        }}
      />
    );
  },
};
