import React from "react";
import { ReportCopilot } from "./index.jsx";
import { COCKPIT } from "../../../content.js";
import { COPILOT, KNOWLEDGE_ASSETS } from "../../../demo/report-fixtures.js";
import { buildCopilotChatEntry, copilotProfile, copilotSkillItems, copilotSources, resolveCopilotAnswer } from "../../../demo/report-demo.js";
import { buildReportModelDraft } from "../lib/report-logic.js";
import { useSynced, bi } from "../../../lib/story-helpers.js";
import { demoHrefFor } from "../../../demo/navigation.js";

export default {
  title: "Features/Cockpit/Report Copilot workspace",
  component: ReportCopilot,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          bi("This component is the report Copilot on Marketing Cockpit. It is a drawer on the right of the live report. The start view shows an AI summary card and scenario recommendations. After the user opens an answer or sends a question, the drawer shows the answer view. Chat and answer text come from props. The host supplies that text. Set `stream` if the answer should appear in steps.", "这是 Marketing Cockpit 上的报表 Copilot。它是实时报表右侧的抽屉。起始视图显示一张 AI 摘要卡片和场景推荐。用户打开某个回答或发出问题后，抽屉切到回答视图。对话和回答的文字来自 props。这些文字由宿主提供。如果回答需要逐步出现，就设置 `stream`。"),
      },
    },
  },
};

export const Default = {
  args: { open: true, stream: true, project: "city", index: 0, contextHref: demoHrefFor("interpreter") },
  argTypes: {
    project: { control: "select", options: Object.keys(COCKPIT.projects), description: bi("Cockpit project key for this Copilot.", "这个 Copilot 所用的 Cockpit 项目键。") },
    index: { control: { type: "number", min: 0, max: 1 }, description: bi("Report index inside the selected project.", "所选项目里的报表序号。") },
    contextHref: { control: "text", description: bi("Fallback link for a chat entry that has no linked source.", "没有关联来源的对话条目所使用的回退链接。") },
    onClose: { action: "onClose", description: bi("The function runs when the drawer closes. The result has `reason`: `\"scrim\"`, `\"escape\"`, or `\"button\"`.", "抽屉关闭时会调用这个函数。结果里的 `reason` 是 `\"scrim\"`、`\"escape\"` 或 `\"button\"`。") },
    onBack: { action: "onBack", description: bi("The function runs when the user returns to the start view. The result has `reason: \"back\"`.", "用户回到起始视图时会调用这个函数。结果里的 `reason` 是 `\"back\"`。") },
    onNewSession: { action: "onNewSession", description: bi("The function runs when the user starts a new chat. The result has `reason: \"new-session\"`.", "用户开始新对话时会调用这个函数。结果里的 `reason` 是 `\"new-session\"`。") },
    onMaximize: { action: "onMaximize", description: bi("The function runs when the user expands or restores the Copilot. The result has `expanded`.", "用户展开或还原 Copilot 时会调用这个函数。结果里有 `expanded`。") },
    onHistorySelect: { action: "onHistorySelect", description: bi("The function runs when the user selects a recent chat. The result has `title` and `prompt`.", "用户选择一条最近对话时会调用这个函数。结果里有 `title` 和 `prompt`。") },
    onRecommendation: { action: "onRecommendation", description: bi("The function runs when the user opens a scenario recommendation. The result has `index`.", "用户打开一条场景推荐时会调用这个函数。结果里有 `index`。") },
    onAsk: { action: "onAsk", description: bi("The function runs when the user sends a question. The result has `question`.", "用户发出问题时会调用这个函数。结果里有 `question`。") },
    onPromptChange: { action: "onPromptChange", description: bi("The function runs at each change in the composer. The result has `value`.", "输入框每次变化都会调用这个函数。结果里有 `value`。") },
    onFeedback: { action: "onFeedback", description: bi("The function runs when the user marks an answer. The result has `value`: `\"helpful\"` or `\"not-helpful\"`.", "用户给回答打标时会调用这个函数。结果里的 `value` 是 `\"helpful\"` 或 `\"not-helpful\"`。") },
    onChatFeedback: { action: "onChatFeedback", description: bi("The function runs when the user marks a chat card. The result has `id` and `value`.", "用户给对话卡片打标时会调用这个函数。结果里有 `id` 和 `value`。") },
    onCopy: { action: "onCopy", description: bi("The function runs when the user copies a chat card. The result has `id`.", "用户复制对话卡片时会调用这个函数。结果里有 `id`。") },
    onExplore: { action: "onExplore", description: bi("The function runs when the user picks an explore option. The result has `question`.", "用户选择一条探索选项时会调用这个函数。结果里有 `question`。") },
    onAttach: { action: "onAttach", description: bi("The function runs after the user picks files in Upload File. The result has `names`.", "用户在 Upload File 里选完文件后，会调用这个函数。结果里有 `names`。") },
    onSelectSkill: { action: "onSelectSkill", description: bi("The function runs when the user selects a skill. The result has `id`, `type`, and `title`.", "用户选择一项技能时会调用这个函数。结果里有 `id`、`type` 和 `title`。") },
    onSkillAction: { action: "onSkillAction", description: bi("The function runs when the user starts a model action. The result has `action`: `\"history\"` or `\"manual\"`.", "用户启动一项建模操作时会调用这个函数。结果里的 `action` 是 `\"history\"` 或 `\"manual\"`。") },
    onFlowSave: { action: "onFlowSave", description: bi("The function runs when the user saves a model draft. The result has `values`.", "用户保存模型草稿时会调用这个函数。结果里有 `values`。") },
    onFlowSubmit: { action: "onFlowSubmit", description: bi("The function runs when the user submits a model. The result has `values`.", "用户提交模型时会调用这个函数。结果里有 `values`。") },
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
          contextHref={args.contextHref}
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
