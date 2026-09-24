import "../../tokens.css";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { AssistantPanel } from "../../components/AssistantPanel/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { ModelFlowDialog } from "../../components/ModelFlowDialog/index.jsx";
import { SectionHeading } from "../../components/SectionHeading/index.jsx";
import { WorkspaceGrid } from "../../features/home/WorkspaceGrid/index.jsx";
import { Shell } from "../../pages/Shell/index.jsx";
import "./HomePage.css";


/**
 * Home page: header, hero with stats, workspace grid, assistant drawer.
 * @param {object} props
 * @param {string} [props.current="home"] active nav id
 * @param {{ src: string, alt?: string, href?: string }} props.logo
 * @param {Array<{ id: string, label: string, href: string }>} [props.navigation=[]]
 * @param {{ image?: string, eyebrow?: string, title: React.ReactNode, description?: React.ReactNode, stats?: Array<object> }} [props.hero]
 * @param {{ eyebrow?: string, title: React.ReactNode, description?: React.ReactNode }} props.heading section heading over the workspace grid
 * @param {Array<object>} [props.cards=[]] WorkspaceCard props
 * @param {object} [props.assistant={}] AssistantPanel props
 * @param {boolean} [props.assistantOpen=false]
 * @param {string} [props.prompt=""]
 * @param {string} [props.scope="All"]
 * @param {(target: { id: string, href?: string, label: string }) => void} [props.onNavigate]
 * @param {(target: { title: string }) => void} [props.onOpen] workspace card open
 * @param {() => void} [props.onOpenAssistant]
 * @param {(event: { reason: string }) => void} [props.onCloseAssistant]
 * @param {(event: { name: string, value: string }) => void} [props.onPromptChange]
 * @param {(event: object) => void} [props.onSubmit]
 * @param {(event: { prompt: string }) => void} [props.onSuggestion]
 * @param {(event: { scope: string }) => void} [props.onScopeChange]
 * @param {() => void} [props.onNewSession]
 * @param {(event: { expanded: boolean }) => void} [props.onMaximize]
 * @param {(event: { open: boolean }) => void} [props.onHistory]
 * @param {(event: { label: string, prompt: string }) => void} [props.onHistorySelect]
 * @param {(event: { query: string, feedback: string|null }) => void} [props.onFeedback]
 * @param {object} [props.skillFlow] ModelFlowDialog props; `skillFlow.step` truthy renders the model-generation dialog
 */
export function HomePage({
  current = "home",
  logo,
  navigation = [],
  hero = { stats: [] },
  heading,
  cards = [],
  assistant = {},
  assistantOpen = false,
  skillFlow,
  prompt = "",
  scope = "All",
  onNavigate,
  onOpen,
  onOpenAssistant,
  onCloseAssistant,
  onPromptChange,
  onSubmit,
  onSuggestion,
  onScopeChange,
  onNewSession,
  onMaximize,
  onHistory,
  onHistorySelect,
  onFeedback,
}) {
  return (
    <Shell tone="home">
      <Header logo={logo} items={navigation} current={current} highlightCurrent={false} position="fixed" tone="overlay" onNavigate={onNavigate} />
      <Hero image={hero.image} title={hero.title} description={hero.description} height={300} variant="home" scrim="home">
        {hero.stats.map((stat) => (
          <MetricStat key={stat.label} {...stat} variant="glass" />
        ))}
      </Hero>
      <div className="mh-page__inset">
        <SectionHeading {...heading} />
        <WorkspaceGrid cards={cards} onOpen={onOpen} onNavigate={onNavigate} />
      </div>
      <AssistantLauncher hidden={assistantOpen} onOpen={onOpenAssistant} />
      <AssistantPanel
        open={assistantOpen}
        placement="drawer"
        tone="home"
        {...assistant}
        suggestions={assistant.homeSuggestions || assistant.suggestions}
        scope={scope}
        showScopes={false}
        showPicks={false}
        prompt={prompt}
        onClose={onCloseAssistant}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        onSuggestion={onSuggestion}
        onScopeChange={onScopeChange}
        onNewSession={onNewSession}
        onMaximize={onMaximize}
        onHistory={onHistory}
        onHistorySelect={onHistorySelect}
        onFeedback={onFeedback}
      />
      {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    </Shell>
  );
}
