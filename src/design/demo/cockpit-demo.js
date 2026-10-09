/**
 * Demo state container for MarketingCockpitPage — the deterministic local
 * stand-in for the original demo's report-core.js / aiWorkspace scripting.
 * Takes ordinary page props (data + initial state + host callbacks) plus a
 * `demo` bundle of fixture data and returns the fully wired prop set.
 * No Storybook imports; any host can drive the page the same way.
 */
import React from "react";
import { useSynced } from "./use-synced.js";
import { demoHrefFor, demoTargetForHref } from "./navigation.js";
import { useModelFlowState } from "./model-flow-state.js";
import { buildModelDraft } from "../content.js";
import { buildReportModelDraft } from "../features/cockpit/lib/report-logic.js";
import {
  buildCopilotChatEntry,
  copilotProfile,
  copilotSkillItems,
  copilotSources,
  resolveCopilotAnswer,
} from "./report-demo.js";

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
  const hrefFor = props.hrefFor || demoHrefFor;
  const routeSource = (source) => {
    const target = demoTargetForHref(source.href);
    return target?.id && target.id !== "coverage" ? { ...source, href: hrefFor(target.id, target.params) } : source;
  };

  const [query, setQuery] = useSynced(props.query);
  const [project, setProject] = useSynced(props.project);
  const [view, setView] = useSynced(props.view);
  const [dashboard, setDashboard] = useSynced(props.dashboard);
  const [details, setDetails] = useSynced(props.details);
  const [open, setOpen] = useSynced(props.assistantOpen);
  const [prompt, setPrompt] = useSynced(props.prompt);
  const [answers, setAnswers] = React.useState([]);
  const [skill, setSkill] = React.useState(null);
  const flow = useModelFlowState();
  /* Report Copilot host state — the deterministic "AI" the original fakes
     with report-core.js: answers resolve from the active report, custom
     questions append to the chat thread when the answer view is open. */
  const [wsOpen, setWsOpen] = useSynced(props.workspaceOpen);
  const [wsPrompt, setWsPrompt] = useSynced("");
  const [wsAnswer, setWsAnswer] = React.useState(null);
  const [wsChat, setWsChat] = React.useState([]);
  const wsFlow = useModelFlowState();

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
    const built = buildCopilotChatEntry(projects, knowledge, copilot, liveKey, liveRawIndex, question);
    const entry = { ...built, sources: built.sources.map(routeSource) };
    setWsChat((current) => (append ? [...current, entry] : [entry]));
    if (!append) setWsAnswer(null);
    setWsPrompt("");
    props.onWorkspaceAsk?.({ question });
  };

  return {
    ...props,
    hrefFor: props.hrefFor || demoHrefFor,
    assistant: {
      ...props.assistant,
      open,
      prompt,
      answers,
      selectedSkill: skill,
      onOpen: (event) => {
        setOpen(true);
        props.onOpenAssistant?.(event);
      },
      onClose: (event) => {
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
        flow.start(modelFlow.threads, action);
      },
    },
    skillFlow: flow.dialog((messages, rule) => buildModelDraft(messages, rule, modelFlow.generatedDefaults), {
      sections: modelFlow.sections,
      onSave: ({ values }) => props.onFlowSave?.({ values }),
      onSubmit: ({ values }) => props.onFlowSubmit?.({ values }),
    }),
    workspace: {
      title: wsProfile.panelTitle,
      eyebrow: copilot.eyebrow,
      summary: copilot.summary,
      recommendations: (liveReport?.recommendations || []).map((rec) => ({ title: rec.title })),
      periodHint: wsProfile.periodHint,
      sources: copilotSources(knowledge, liveKey, liveReport).map(routeSource),
      contextHref: hrefFor("interpreter", {}),
      answer: wsAnswer,
      chat: wsChat,
      prompt: wsPrompt,
      history: copilot.history,
      commandHint: copilot.commandHint,
      inputPlaceholder: copilot.inputPlaceholder,
      answerLabel: copilot.answerLabel,
      skillMenu: copilot.skillMenu ? { ...copilot.skillMenu, items: copilotSkillItems(knowledge, copilot.skillFallback) } : undefined,
      flow: wsFlow.dialog((messages, rule) => buildReportModelDraft(messages, rule, copilot.flow?.generatedDefaults), {
        submitFirst: true,
        sections: copilot.flow?.sections,
        labels: copilot.flow?.labels,
        onSave: ({ values }) => props.onFlowSave?.({ values }),
        onSubmit: ({ values }) => props.onFlowSubmit?.({ values }),
      }),
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
        wsFlow.start(copilot.flow?.threads, action);
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
    onNavigate: (target) => {
      if (target.id === "cockpit-all" || (target.id === "cockpit" && !target.params?.project && !target.params?.dashboard)) setProject("all");
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
    onOpenDetails: (target) => {
      setDetails({ project: target.project, index: target.index });
      props.onOpenDetails?.(target);
    },
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
      /* The page opens the live report whenever `dashboard` is set (the
         original's `?dashboard=`), so Back has to clear it, not just `view`. */
      setProject(target.project);
      setDashboard(null);
      setView("catalog");
      props.onBack?.(target);
    },
    onOpenWorkspace: (event) => {
      setWsOpen(true);
      props.onOpenWorkspace?.(event);
    },
  };
}
