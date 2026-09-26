import React from "react";
import { CAMPAIGN, MODEL_FLOW, buildCampaignAnswer, buildModelDraft } from "../../content.js";
import { pageShell, useSynced } from "../../lib/story-helpers.js";
import { CampaignPage } from "./index.jsx";

export default {
  title: "Pages",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export const Campaign = {
  name: "RedNote Campaign Tool",
  args: {
    section: "overview",
    channel: "rednote",
    query: "",
    assistantOpen: false,
    prompt: "",
    ...pageShell,
    assistant: CAMPAIGN.assistant,
    labels: CAMPAIGN.labels,
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
        onReset={(event) => {
          setQuery("");
          args.onReset?.(event);
        }}
        taskDialogOpen={taskOpen}
        toast={toast}
        onCreateTask={(event) => {
          setTaskOpen(true);
          args.onCreateTask?.(event);
        }}
        onBindAccount={(event) => {
          showToast(CAMPAIGN.toasts.bindAccount);
          args.onBindAccount?.(event);
        }}
        onCloseTask={(event) => {
          setTaskOpen(false);
          args.onCloseTask?.(event);
        }}
        onSubmitTask={(event) => {
          setTaskOpen(false);
          showToast(CAMPAIGN.toasts.taskSubmitted);
          args.onSubmitTask?.(event);
        }}
        onOpenAssistant={(event) => {
          setOpen(true);
          args.onOpenAssistant?.(event);
        }}
        onCloseAssistant={(event) => {
          setOpen(false);
          args.onCloseAssistant?.(event);
        }}
        onPromptChange={(event) => {
          setPrompt(event.value);
          args.onPromptChange?.(event);
        }}
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
                onSave: (event) => args.onFlowSave?.(event),
                onSubmit: (event) => args.onFlowSubmit?.(event),
              }
            : undefined
        }
      />
    );
  },
};
