import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { GovernanceNav } from "../../components/GovernanceNav/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { AssistantPanel } from "../../components/AssistantPanel/index.jsx";
import { ModelFlowDialog } from "../../components/ModelFlowDialog/index.jsx";
import { SkillLibrary } from "../../features/scenario-library/SkillLibrary/index.jsx";
import { SkillDetail } from "../../features/scenario-library/SkillDetail/index.jsx";
import { SkillInlineForm } from "../../features/scenario-library/SkillInlineForm/index.jsx";
import "./ScenarioLibraryPage.css";

/** @type {readonly ["list", "create", "edit"]} */
export const skillLibraryModes = ["list", "create", "edit"];

/**
 * Controlled P15 page. All visible page copy, rows, workflow state and navigation are props.
 * @param {object} props
 * @param {object} props.content Hero, navigation, table, detail and form copy.
 * @param {object} props.logo Header logo.
 * @param {object[]} [props.navigation=[]] Primary navigation links.
 * @param {string} props.image Hero image URL.
 * @param {object} [props.library={}] Controlled list/filter state and callbacks.
 * @param {object} [props.detail={}] Selected record and preview state.
 * @param {object} [props.form={}] Controlled inline create/edit state.
 * @param {object} [props.assistant={}] Controlled lite assistant.
 * @param {object|null} props.skillFlow Optional model flow overlay.
 * @param {(id:string,params?:object)=>string} props.hrefFor Route adapter.
 * @param {(event:{id:string,params:object,href:string,label:string})=>void} [props.onNavigate]
 */
export function ScenarioLibraryPage({ content, logo, navigation = [], image, library = {}, detail = {}, form = {}, assistant = {}, skillFlow, hrefFor, onNavigate }) {
  const launcherRef = React.useRef(null);
  const ai = assistant || {};
  const { open: aiOpen = false, prompt: aiPrompt = "", answers: aiAnswers = [], selectedSkill, onOpen: onAssistantOpen, onClose: onAssistantClose, onPromptChange, onSubmit, onSuggestion, onHistorySelect, onNewSession, onSelectSkill, onClearSkill, onSkillAction, onAttach, onMaximize, onHistory, ...aiCopy } = ai;
  return <div className="mh-skill-page" data-skill-mode={form.mode || "list"} data-skill-status={library.status || "all"}>
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={image} eyebrow={content.hero.eyebrow} title={content.hero.title} description={content.hero.description} height={372} variant="home" scrim="none" asideLabel={content.labels.summaryAria}><div className="mh-skill-page__stats">{content.hero.stats.map((stat) => <MetricStat key={stat.label} label={stat.label} value={stat.value} caption={stat.caption} variant="glass" />)}</div></Hero>
    <div className="mh-skill-page__body"><GovernanceNav items={content.sidebar} current="scenario-library" navigationAria={content.labels.navigationAria} categoriesAria={content.labels.categoriesAria} hrefFor={hrefFor} onNavigate={onNavigate} /><main className="mh-skill-page__main">{form.mode === "create" || form.mode === "edit" ? <SkillInlineForm labels={content.labels} values={form.values} onChange={form.onChange} onSubmit={form.onSubmit} onCancel={form.onCancel} onClick={form.onClick} /> : <SkillLibrary labels={content.labels} items={library.items} totalCount={library.totalCount} search={library.search} status={library.status} onChange={library.onChange} onSelect={library.onSelect} onOpen={library.onOpen} onAdvance={library.onAdvance} onClick={library.onClick} />}</main></div>
    <AssistantLauncher ref={launcherRef} hidden={aiOpen} label={aiCopy.launcherLabel} onOpen={onAssistantOpen} />
    <AssistantPanel open={aiOpen} returnFocusRef={launcherRef} placement="drawer" variant="lite" {...aiCopy} prompt={aiPrompt} answers={aiAnswers} selectedSkill={selectedSkill} onClose={onAssistantClose} onPromptChange={onPromptChange} onSubmit={onSubmit} onSuggestion={onSuggestion} onHistorySelect={onHistorySelect} onNewSession={onNewSession} onSelectSkill={onSelectSkill} onClearSkill={onClearSkill} onSkillAction={onSkillAction} onAttach={onAttach} onMaximize={onMaximize} onHistory={onHistory} />
    {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    <SkillDetail skill={detail.skill} labels={content.labels} previewOpen={detail.previewOpen} onCancel={detail.onCancel} onChange={detail.onChange} onOpen={detail.onOpen} onClick={detail.onClick} />
  </div>;
}
