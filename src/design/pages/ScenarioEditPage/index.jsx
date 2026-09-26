import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { GovernanceNav } from "../../components/GovernanceNav/index.jsx";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { AssistantPanel } from "../../components/AssistantPanel/index.jsx";
import { ModelFlowDialog } from "../../components/ModelFlowDialog/index.jsx";
import { ScenarioEditForm } from "../../features/scenario-edit/ScenarioEditForm/index.jsx";
import "./ScenarioEditPage.css";

/**
 * Controlled Skill Edit page; stories and host supply all source-backed content and flow state.
 * @param {object} props
 * @param {object} props.content Hero, sidebar, form labels/options, and default values.
 * @param {object} props.logo Header logo.
 * @param {object[]} [props.navigation=[]] Header destinations.
 * @param {object} [props.form={}] ScenarioEditForm values, validation, preview and named callbacks.
 * @param {object} [props.assistant={}] Lite assistant content/state/callbacks.
 * @param {object} [props.skillFlow] Model-flow dialog content/state/callbacks.
 * @param {(id:string,params?:object)=>string} [props.hrefFor]
 * @param {(event:{id:string,params:object,href:string,label:string})=>void} [props.onNavigate]
 */
export function ScenarioEditPage({ content, logo, navigation = [], form = {}, assistant = {}, skillFlow, hrefFor, onNavigate }) {
  const { hero, sidebar, labels } = content;
  const launcherRef = React.useRef(null);
  const { open: aiOpen = false, prompt: aiPrompt = "", answers = [], selectedSkill, onOpen: onAssistantOpen, onClose: onAssistantClose, onPromptChange, onSubmit, onSuggestion, onHistorySelect, onNewSession, onSelectSkill, onClearSkill, onSkillAction, onAttach, onMaximize, onHistory, ...aiCopy } = assistant;
  return <div className="mh-scenario-edit-page">
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={hero.image} eyebrow={hero.eyebrow} title={hero.title} description={hero.description} asideLabel={hero.asideLabel} height={360} variant="home" scrim="home"><div className="mh-scenario-edit-page__stats">{hero.stats.map((stat) => <MetricStat key={stat.key} label={stat.label} value={stat.value} caption={stat.caption} variant="glass" />)}</div></Hero>
    <div className="mh-scenario-edit-page__body">
      <GovernanceNav items={sidebar} current="scenario-library" navigationAria={labels.navigationAria} categoriesAria={labels.categoriesAria} hrefFor={hrefFor} onNavigate={onNavigate} />
      <main className="mh-scenario-edit-page__main"><ScenarioEditForm content={content} {...form} hrefFor={hrefFor} onNavigate={onNavigate} /></main>
    </div>
    <AssistantLauncher ref={launcherRef} hidden={aiOpen} label={aiCopy.launcherLabel} onOpen={onAssistantOpen} />
    <AssistantPanel open={aiOpen} returnFocusRef={launcherRef} placement="drawer" variant="lite" {...aiCopy} prompt={aiPrompt} answers={answers} selectedSkill={selectedSkill} onClose={onAssistantClose} onPromptChange={onPromptChange} onSubmit={onSubmit} onSuggestion={onSuggestion} onHistorySelect={onHistorySelect} onNewSession={onNewSession} onSelectSkill={onSelectSkill} onClearSkill={onClearSkill} onSkillAction={onSkillAction} onAttach={onAttach} onMaximize={onMaximize} onHistory={onHistory} />
    {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
  </div>;
}
