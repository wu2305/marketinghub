/* A consumer-built Marketing Cockpit (Phase 3 WP5, step 3): one page that holds
 * two independent assistants, the workspace assistant (corner launcher) and the
 * live-report Report Copilot, each with its own state and its own answers.
 *
 * Like BusinessTermApp it imports only package entries: `MarketingCockpitPage`
 * from "marketing-hub" and copy/seed content (upper-case constants) from
 * "marketing-hub/demo". Navigation, both assistants and every answer are this
 * app's own; the data comes in through `data`, so swapping it changes what is
 * listed and answered, never how the page looks or behaves.
 */
import React from "react";
import { MarketingCockpitPage } from "marketing-hub";
import { ASSISTANT_SKILL_MENU, COCKPIT, COPILOT, KNOWLEDGE_ASSETS, LOGO, NAV } from "marketing-hub/demo";
import { EMPTY_THREAD, answerThread, askThread, chatEntry, sourcesFor, type Asset, type Projects, type Report, type Thread, type Workspace } from "./copilotThread";

type Props = React.ComponentProps<typeof MarketingCockpitPage>;
type Copilot = Workspace;
type Answer = NonNullable<NonNullable<Props["assistant"]>["answers"]>[number];
type Route = { project: string; dashboard: number | null };

export type CockpitData = {
  projects: Projects;
  groups: NonNullable<Props["groups"]>;
  knowledge: Asset[];
  detailsSections: NonNullable<Props["detailsSections"]>;
  copilot: {
    eyebrow: string;
    summary: Copilot["summary"];
    history: Copilot["history"];
    commandHint: string;
    inputPlaceholder: string;
    answerLabel: string;
    defaultTitle?: string;
  };
};

/** The demo's data; any object of the same shape works. */
export const demoData: CockpitData = {
  projects: COCKPIT.projects,
  groups: COCKPIT.groups,
  knowledge: KNOWLEDGE_ASSETS,
  detailsSections: COCKPIT.detailsSections,
  copilot: COPILOT,
};

const hrefFor = (id: string, params: Record<string, string> = {}) => {
  const query = new URLSearchParams(params).toString();
  return `#${id}${query ? `?${query}` : ""}`;
};

/**
 * @param props.data catalog, knowledge and Copilot content (defaults to the demo's)
 */
export function CockpitApp({ data = demoData }: { data?: CockpitData }) {
  const [route, setRoute] = React.useState<Route>({ project: "all", dashboard: null });
  const [query, setQuery] = React.useState("");
  const [details, setDetails] = React.useState<{ project: string; index: number } | null>(null);

  /* Workspace assistant (the corner launcher). */
  const [assistant, setAssistant] = React.useState<{ open: boolean; prompt: string; answers: Answer[] }>({ open: false, prompt: "", answers: [] });
  /* Report Copilot (live report only): its own open flag, prompt, answer and chat. */
  const [copilot, setCopilot] = React.useState<Thread & { open: boolean }>({ open: false, ...EMPTY_THREAD });

  const liveProject = data.projects[route.project] ?? Object.values(data.projects)[0];
  const report: Report | undefined = route.dashboard === null ? undefined : liveProject?.reports[route.dashboard] ?? liveProject?.reports[0];
  const sources = sourcesFor(report, data.knowledge, (type) => hrefFor("interpreter", { type }));

  const askAssistant = (prompt: string) => {
    if (!prompt.trim()) return;
    const answer: Answer = {
      query: prompt,
      variant: "compact",
      body: `${Object.keys(data.projects).length} report projects are in the catalog. Ask about a project or open a live report for its own Copilot.`,
      sources: ["Report catalog"],
    };
    setAssistant((prior) => ({ ...prior, prompt: "", answers: [...prior.answers, answer] }));
  };

  const askCopilot = ({ question }: { question: string }) => {
    if (!question.trim()) return;
    const entry = chatEntry(question, report, data.copilot.eyebrow, sources);
    setCopilot((prior) => ({ ...prior, ...askThread(prior, question, entry) }));
  };

  const recommendations = report?.recommendations ?? [];
  const workspace: Copilot = {
    title: report?.assistant?.panelTitle ?? data.copilot.defaultTitle ?? "Report Copilot",
    eyebrow: data.copilot.eyebrow,
    summary: data.copilot.summary,
    recommendations: recommendations.map((item) => ({ title: item.title })),
    periodHint: report?.assistant?.periodHint ?? "",
    sources,
    contextHref: hrefFor("interpreter"),
    answer: copilot.answer,
    chat: copilot.chat,
    prompt: copilot.prompt,
    history: data.copilot.history,
    commandHint: data.copilot.commandHint,
    inputPlaceholder: data.copilot.inputPlaceholder,
    answerLabel: data.copilot.answerLabel,
    onClose: () => setCopilot((prior) => ({ ...prior, open: false })),
    onBack: () => setCopilot((prior) => ({ ...prior, answer: null, chat: [] })),
    onNewSession: () => setCopilot((prior) => ({ ...prior, ...EMPTY_THREAD })),
    onRecommendation: ({ index }) => setCopilot((prior) => ({ ...prior, ...answerThread(prior, report, index) })),
    onAsk: askCopilot,
    onPromptChange: ({ value }) => setCopilot((prior) => ({ ...prior, prompt: value })),
    onHistorySelect: ({ prompt }) => setCopilot((prior) => ({ ...prior, prompt })),
  };

  return (
    <MarketingCockpitPage
      logo={LOGO}
      navigation={NAV}
      hero={COCKPIT.hero}
      copy={COCKPIT.copy}
      hrefFor={hrefFor}
      groups={data.groups}
      projects={data.projects}
      knowledge={data.knowledge}
      detailsSections={data.detailsSections}
      query={query}
      project={route.project}
      dashboard={route.dashboard}
      details={details}
      onQueryChange={({ value }) => setQuery(value)}
      onNavigate={({ id, params }) => {
        if (id !== "cockpit") return;
        setRoute({ project: params.project ?? "all", dashboard: params.dashboard === undefined ? null : Number(params.dashboard) });
        setCopilot({ open: false, ...EMPTY_THREAD });
      }}
      onOpenDetails={({ project, index }) => setDetails({ project, index })}
      onCloseDetails={() => setDetails(null)}
      onOpenLive={() => setDetails(null)}
      workspace={workspace}
      workspaceOpen={copilot.open}
      onOpenWorkspace={() => setCopilot((prior) => ({ ...prior, open: true }))}
      assistant={{
        ...COCKPIT.assistant,
        open: assistant.open,
        prompt: assistant.prompt,
        answers: assistant.answers,
        skillMenu: ASSISTANT_SKILL_MENU,
        onOpen: () => setAssistant((prior) => ({ ...prior, open: true })),
        onClose: () => setAssistant((prior) => ({ ...prior, open: false })),
        onPromptChange: ({ value }) => setAssistant((prior) => ({ ...prior, prompt: value })),
        onSubmit: ({ prompt }) => askAssistant(prompt),
        onSuggestion: ({ prompt }) => askAssistant(prompt),
        onHistorySelect: ({ prompt }) => setAssistant((prior) => ({ ...prior, prompt })),
        onNewSession: () => setAssistant((prior) => ({ ...prior, prompt: "", answers: [] })),
      }}
    />
  );
}
