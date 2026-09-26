import React from "react";
import { LITE_ASSISTANT, MEDIA_TRACKING, MODEL_FLOW, buildLiteAssistantAnswer, buildModelDraft } from "../../content.js";
import { pageShell, useSynced } from "../../lib/story-helpers.js";
import { MediaTrackingDetailPage } from "./index.jsx";

export default {
  title: "Pages",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export const MediaTrackingDetail = {
  name: "Media Tracking Detail",
  args: {
    ...pageShell,
    toolbar: MEDIA_TRACKING.toolbar,
    labels: MEDIA_TRACKING.labels,
    head: MEDIA_TRACKING.head,
    periods: MEDIA_TRACKING.periods,
    period: "monthly",
    filters: MEDIA_TRACKING.filters,
    notes: MEDIA_TRACKING.notes,
    table: MEDIA_TRACKING.table,
    assistant: LITE_ASSISTANT,
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
                onSave: (event) => args.onFlowSave?.(event),
                onSubmit: (event) => args.onFlowSubmit?.(event),
              }
            : undefined
        }
        onNavigate={args.onNavigate}
        onPeriodChange={(event) => {
          setPeriod(event.id);
          args.onPeriodChange?.(event);
        }}
        onFilterChange={args.onFilterChange}
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
