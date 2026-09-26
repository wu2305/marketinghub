import React from "react";
import { ReportCopilot } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { COPILOT, KNOWLEDGE_ASSETS } from "../../../demo/report-fixtures.js";
import { buildCopilotChatEntry, copilotProfile, copilotSkillItems, copilotSources, resolveCopilotAnswer } from "../../../demo/report-demo.js";
import { buildReportModelDraft } from "../../../report-logic.js";
import { useSynced } from "../../../lib/story-helpers.js";

export default {
  title: "Features/Cockpit/Report Copilot workspace",
  component: ReportCopilot,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Report Copilot workspace: fixed right drawer on the live report view. Start view = AI summary card + scenario recommendations; an open answer or chat exchange swaps in the answer view with context-dock shortcuts. Chat and answer content are controlled props — the host owns the deterministic AI simulation.",
      },
    },
  },
};

export const Default = {
  args: { open: true, stream: true, project: "city", index: 0 },
  argTypes: {
    project: { control: "select", options: Object.keys(COCKPIT.projects) },
    index: { control: { type: "number", min: 0, max: 1 } },
    onClose: { action: "onClose" },
    onBack: { action: "onBack" },
    onNewSession: { action: "onNewSession" },
    onMaximize: { action: "onMaximize" },
    onHistorySelect: { action: "onHistorySelect" },
    onRecommendation: { action: "onRecommendation" },
    onAsk: { action: "onAsk" },
    onPromptChange: { action: "onPromptChange" },
    onFeedback: { action: "onFeedback" },
    onChatFeedback: { action: "onChatFeedback" },
    onCopy: { action: "onCopy" },
    onExplore: { action: "onExplore" },
    onAttach: { action: "onAttach" },
    onSelectSkill: { action: "onSelectSkill" },
    onSkillAction: { action: "onSkillAction" },
    onFlowSave: { action: "onFlowSave" },
    onFlowSubmit: { action: "onFlowSubmit" },
  },
  render: function ReportCopilotStory(args) {
    const projectKey = COCKPIT.projects[args.project] ? args.project : "city";
    const reportIndex = Math.min(Math.max(Number(args.index) || 0, 0), COCKPIT.projects[projectKey].reports.length - 1);
    const report = COCKPIT.projects[projectKey].reports[reportIndex];
    const profile = copilotProfile(COCKPIT.projects, COPILOT, projectKey, reportIndex);
    const [open, setOpen] = useSynced(args.open);
    const [prompt, setPrompt] = useSynced("");
    const [answer, setAnswer] = React.useState(null);
    const [chat, setChat] = React.useState([]);
    const [flow, setFlow] = React.useState(null);
    return (
      <div style={{ minHeight: 720, background: "#eef1f4" }}>
        <ReportCopilot
          open={open}
          stream={args.stream}
          title={profile.panelTitle}
          eyebrow={COPILOT.eyebrow}
          commandHint={COPILOT.commandHint}
          inputPlaceholder={COPILOT.inputPlaceholder}
          answerLabel={COPILOT.answerLabel}
          summary={COPILOT.summary}
          recommendations={report.recommendations.map((rec) => ({ title: rec.title }))}
          periodHint={profile.periodHint}
          sources={copilotSources(KNOWLEDGE_ASSETS, projectKey, report)}
          answer={answer}
          chat={chat}
          prompt={prompt}
          history={COPILOT.history}
          skillMenu={{ ...COPILOT.skillMenu, items: copilotSkillItems(KNOWLEDGE_ASSETS, COPILOT.skillFallback) }}
          flow={
            flow
              ? {
                  step: flow.step,
                  submitFirst: true,
                  threads: flow.threads,
                  rule: flow.rule,
                  draft: flow.draft,
                  sections: COPILOT.flow.sections,
                  labels: COPILOT.flow.labels,
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
                    setFlow((current) => ({ ...current, step: "generated", rule, draft: buildReportModelDraft(messages, rule, COPILOT.flow.generatedDefaults) })),
                  onBack: () => setFlow((current) => ({ ...current, step: "history" })),
                  onClose: () => setFlow(null),
                  onSave: ({ values }) => args.onFlowSave?.({ values }),
                  onSubmit: ({ values }) => args.onFlowSubmit?.({ values }),
                }
              : undefined
          }
          onClose={() => {
            setOpen(false);
            args.onClose?.();
          }}
          onBack={() => {
            setAnswer(null);
            setChat([]);
            args.onBack?.();
          }}
          onNewSession={() => {
            setAnswer(null);
            setChat([]);
            setPrompt("");
            args.onNewSession?.();
          }}
          onMaximize={args.onMaximize}
          onHistorySelect={args.onHistorySelect}
          onRecommendation={({ index }) => {
            setAnswer(resolveCopilotAnswer(COCKPIT.projects, COPILOT, projectKey, reportIndex, index));
            setChat([]);
            args.onRecommendation?.({ index });
          }}
          onAsk={({ question }) => {
            const append = Boolean(answer) || chat.length > 0;
            const entry = buildCopilotChatEntry(COCKPIT.projects, KNOWLEDGE_ASSETS, COPILOT, projectKey, reportIndex, question);
            setChat((current) => (append ? [...current, entry] : [entry]));
            if (!append) setAnswer(null);
            setPrompt("");
            args.onAsk?.({ question });
          }}
          onPromptChange={({ value }) => {
            setPrompt(value);
            args.onPromptChange?.({ value });
          }}
          onFeedback={args.onFeedback}
          onChatFeedback={args.onChatFeedback}
          onCopy={args.onCopy}
          onExplore={args.onExplore}
          onAttach={args.onAttach}
          onSelectSkill={args.onSelectSkill}
          onSkillAction={({ action }) => {
            args.onSkillAction?.({ action });
            setFlow({
              step: action === "history" ? "history" : "manual",
              threads: COPILOT.flow.threads.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) })),
              rule: "",
              draft: {},
            });
          }}
        />
      </div>
    );
  },
};
