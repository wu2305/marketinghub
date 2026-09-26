/**
 * Demo state container for MarketingCockpitPage — the deterministic local
 * stand-in for the original demo's report-core.js / aiWorkspace scripting.
 * Takes ordinary page props (data + initial state + host callbacks) plus a
 * `demo` bundle of fixture data and returns the fully wired prop set.
 * No Storybook imports; any host can drive the page the same way.
 */
import React from "react";
import { buildModelDraft } from "../content.js";
import { buildReportModelDraft } from "../report-logic.js";
import {
  buildCopilotChatEntry,
  copilotProfile,
  copilotSkillItems,
  copilotSources,
  resolveCopilotAnswer,
} from "./report-demo.js";

/** Controlled-prop mirror: local state re-syncs when the input value changes. */
function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}

/**
 * @param {object} props ordinary MarketingCockpitPage props:
 *   data (logo, navigation, hero, groups, projects, knowledge, cityInvest,
 *   detailsSections, assistant) + initial state values (query, project, view,
 *   dashboard, details, assistantOpen, workspaceOpen, prompt) + host callbacks
 *   (onNavigate, onQueryChange, onOpenProject, onOpenReport, onOpenDetails,
 *   onCloseDetails, onOpenLive, onBack, onOpenWorkspace, onWorkspaceClose,
 *   onWorkspaceBack, onWorkspaceRecommendation, onWorkspaceAsk,
 *   onWorkspacePromptChange, onWorkspaceExplore, onChatFeedback, onCopy,
 *   onOpenAssistant, onCloseAssistant, onPromptChange, onSubmit, onSuggestion,
 *   onNewSession, onMaximize, onHistory, onHistorySelect, onFeedback, onAttach,
 *   onSelectSkill, onClearSkill, onSkillAction, onFlowSave({ values }),
 *   onFlowSubmit({ values }),
 *   onFiltersChange)
 * @param {object} props.demo deterministic content simulators:
 *   `copilot` (Copilot fixture bundle), `modelFlow` (assistant model-flow data),
 *   `reportAnswerFor` (query → compact assistant answer entry)
 * @returns {object} MarketingCockpitPage props
 */
export function useCockpitDemo(props) {
  const { copilot = {}, modelFlow = {}, reportAnswerFor } = props.demo || {};
  const projects = props.projects || {};
  const knowledge = props.knowledge || [];

  const [query, setQuery] = useSynced(props.query);
  const [project, setProject] = useSynced(props.project);
  const [view, setView] = useSynced(props.view);
  const [dashboard, setDashboard] = useSynced(props.dashboard);
  const [details, setDetails] = useSynced(props.details);
  const [open, setOpen] = useSynced(props.assistantOpen);
  const [prompt, setPrompt] = useSynced(props.prompt);
  const [answers, setAnswers] = React.useState([]);
  const [skill, setSkill] = React.useState(null);
  const [flow, setFlow] = React.useState(null);
  /* Report Copilot host state — the deterministic "AI" the original fakes
     with report-core.js: answers resolve from the active report, custom
     questions append to the chat thread when the answer view is open. */
  const [wsOpen, setWsOpen] = useSynced(props.workspaceOpen);
  const [wsPrompt, setWsPrompt] = useSynced("");
  const [wsAnswer, setWsAnswer] = React.useState(null);
  const [wsChat, setWsChat] = React.useState([]);
  const [wsFlow, setWsFlow] = React.useState(null);

  const submitAnswer = (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed) return;
    const entry = reportAnswerFor?.(trimmed);
    if (entry) setAnswers((current) => [...current, entry]);
    setPrompt("");
  };
  const liveKey = projects[project] ? project : Object.keys(projects)[0];
  const liveProject = projects[liveKey];
  const liveIndex = liveProject?.reports[Number(dashboard)] ? Number(dashboard) : 0;
  /* Raw param index — the holistic gate tests it un-resolved, matching
     `activeReportIndex`; content helpers resolve `reports[i] ? i : 0`
     internally. */
  const liveRawIndex = Number.isFinite(Number(dashboard)) ? Number(dashboard) : 0;
  const liveReport = liveProject?.reports?.[liveIndex];
  const wsProfile = copilotProfile(projects, copilot, liveKey, liveRawIndex);
  const wsAsk = ({ question }) => {
    /* showAiAnswer: appends only while the answer view is open, else clears
       the thread and enters chat mode. */
    const append = Boolean(wsAnswer) || wsChat.length > 0;
    const entry = buildCopilotChatEntry(projects, knowledge, copilot, liveKey, liveRawIndex, question);
    setWsChat((current) => (append ? [...current, entry] : [entry]));
    if (!append) setWsAnswer(null);
    setWsPrompt("");
    props.onWorkspaceAsk?.({ question });
  };

  return {
    ...props,
    assistant: {
      ...props.assistant,
      answers,
      selectedSkill: skill,
      onSuggestion: (event) => {
        submitAnswer(event.prompt);
        props.onSuggestion?.(event);
      },
      onNewSession: () => {
        setAnswers([]);
        setPrompt("");
        props.onNewSession?.();
      },
      onMaximize: props.onMaximize,
      onHistory: props.onHistory,
      onHistorySelect: (event) => {
        setPrompt(event.prompt);
        props.onHistorySelect?.(event);
      },
      onFeedback: props.onFeedback,
      onAttach: props.onAttach,
      onSelectSkill: (event) => {
        setSkill({ id: event.id, type: event.type, title: event.title });
        props.onSelectSkill?.(event);
      },
      onClearSkill: () => {
        setSkill(null);
        props.onClearSkill?.();
      },
      onSkillAction: ({ action }) => {
        props.onSkillAction?.({ action });
        setFlow({
          step: action === "history" ? "history" : "manual",
          threads: (modelFlow.threads || []).map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) })),
          rule: "",
          draft: {},
        });
      },
    },
    assistantOpen: open,
    prompt,
    skillFlow: flow
      ? {
          step: flow.step,
          threads: flow.threads,
          rule: flow.rule,
          draft: flow.draft,
          sections: modelFlow.sections,
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
            setFlow((current) => ({ ...current, step: "generated", rule, draft: buildModelDraft(messages, rule, modelFlow.generatedDefaults) })),
          onBack: () => setFlow((current) => ({ ...current, step: "history" })),
          onClose: () => setFlow(null),
          onSave: ({ values }) => props.onFlowSave?.({ values }),
          onSubmit: ({ values }) => props.onFlowSubmit?.({ values }),
        }
      : undefined,
    workspace: {
      title: wsProfile.panelTitle,
      eyebrow: copilot.eyebrow,
      summary: copilot.summary,
      recommendations: (liveReport?.recommendations || []).map((rec) => ({ title: rec.title })),
      periodHint: wsProfile.periodHint,
      sources: copilotSources(knowledge, liveKey, liveReport),
      answer: wsAnswer,
      chat: wsChat,
      prompt: wsPrompt,
      history: copilot.history,
      commandHint: copilot.commandHint,
      inputPlaceholder: copilot.inputPlaceholder,
      answerLabel: copilot.answerLabel,
      skillMenu: copilot.skillMenu ? { ...copilot.skillMenu, items: copilotSkillItems(knowledge, copilot.skillFallback) } : undefined,
      flow: wsFlow
        ? {
            step: wsFlow.step,
            submitFirst: true,
            threads: wsFlow.threads,
            rule: wsFlow.rule,
            draft: wsFlow.draft,
            sections: copilot.flow?.sections,
            labels: copilot.flow?.labels,
            onToggleMessage: ({ threadIndex, messageIndex, checked }) =>
              setWsFlow((current) => ({
                ...current,
                threads: current.threads.map((thread, ti) =>
                  ti === threadIndex
                    ? { ...thread, messages: thread.messages.map((message, mi) => (mi === messageIndex ? { ...message, checked } : message)) }
                    : thread,
                ),
              })),
            onRuleChange: ({ value }) => setWsFlow((current) => ({ ...current, rule: value })),
            onGenerate: ({ messages, rule }) =>
              setWsFlow((current) => ({ ...current, step: "generated", rule, draft: buildReportModelDraft(messages, rule, copilot.flow?.generatedDefaults) })),
            onBack: () => setWsFlow((current) => ({ ...current, step: "history" })),
            onClose: () => setWsFlow(null),
            onSave: ({ values }) => props.onFlowSave?.({ values }),
            onSubmit: ({ values }) => props.onFlowSubmit?.({ values }),
          }
        : undefined,
      onClose: (event) => {
        setWsOpen(false);
        props.onWorkspaceClose?.(event);
      },
      onBack: (event) => {
        /* data-ai-back: answer view closes, context panels come home. */
        setWsAnswer(null);
        setWsChat([]);
        props.onWorkspaceBack?.(event);
      },
      onNewSession: (event) => {
        setWsAnswer(null);
        setWsChat([]);
        setWsPrompt("");
        props.onNewSession?.(event);
      },
      onMaximize: props.onMaximize,
      onHistorySelect: props.onHistorySelect,
      onRecommendation: ({ index }) => {
        setWsAnswer(resolveCopilotAnswer(projects, copilot, liveKey, liveRawIndex, index));
        setWsChat([]);
        props.onWorkspaceRecommendation?.({ index });
      },
      onAsk: wsAsk,
      onPromptChange: ({ value }) => {
        setWsPrompt(value);
        props.onWorkspacePromptChange?.({ value });
      },
      onFeedback: props.onFeedback,
      onChatFeedback: props.onChatFeedback,
      onCopy: props.onCopy,
      onExplore: props.onWorkspaceExplore,
      onAttach: props.onAttach,
      onSelectSkill: props.onSelectSkill,
      onSkillAction: ({ action }) => {
        props.onSkillAction?.({ action });
        setWsFlow({
          step: action === "history" ? "history" : "manual",
          threads: (copilot.flow?.threads || []).map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) })),
          rule: "",
          draft: {},
        });
      },
    },
    workspaceOpen: wsOpen,
    query,
    project,
    view,
    dashboard,
    details,
    cityInvest: props.cityInvest
      ? { ...props.cityInvest, onFiltersChange: props.onFiltersChange || props.cityInvest.onFiltersChange }
      : props.cityInvest,
    onOpenAssistant: (event) => {
      setOpen(true);
      props.onOpenAssistant?.(event);
    },
    onCloseAssistant: (event) => {
      setOpen(false);
      props.onCloseAssistant?.(event);
    },
    onPromptChange: (event) => {
      setPrompt(event.value);
      props.onPromptChange?.(event);
    },
    onSubmit: (event) => {
      submitAnswer(event.prompt);
      props.onSubmit?.(event);
    },
    onNavigate: (target) => {
      if (target.id === "cockpit-all") setProject("all");
      props.onNavigate?.(target);
    },
    onQueryChange: (event) => {
      setQuery(event.value);
      props.onQueryChange?.(event);
    },
    onOpenProject: (target) => {
      setProject(target.id);
      props.onOpenProject?.(target);
    },
    onOpenReport: (target) => {
      setProject(target.project);
      setDashboard(target.index);
      setView("live");
      props.onOpenReport?.(target);
    },
    onOpenDetails: props.onOpenDetails,
    onCloseDetails: (event) => {
      setDetails(null);
      props.onCloseDetails?.(event);
    },
    onOpenLive: (target) => {
      if (details) {
        setProject(details.project);
        setDashboard(details.index);
        setView("live");
        setDetails(null);
      }
      props.onOpenLive?.(target);
    },
    onBack: (target) => {
      setProject(target.project);
      setView("catalog");
      props.onBack?.(target);
    },
    onOpenWorkspace: (event) => {
      setWsOpen(true);
      props.onOpenWorkspace?.(event);
    },
  };
}
