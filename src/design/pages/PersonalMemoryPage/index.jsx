import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { GovernanceNav } from "../../components/GovernanceNav/index.jsx";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { AssistantPanel } from "../../components/AssistantPanel/index.jsx";
import { ModelFlowDialog } from "../../components/ModelFlowDialog/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
import { ConfirmDialog } from "../../components/ConfirmDialog/index.jsx";
import { MemoryWorkspace } from "../../features/personal-memory/MemoryWorkspace/index.jsx";
import { Icon } from "../../icons.jsx";
import "./PersonalMemoryPage.css";

export const memoryCategories = ["all", "analysis", "meeting", "findings", "reference"];

/**
 * Controlled Personal Memory page; all data and visible copy arrive as props.
 * @param {object} props
 * @param {object} props.content Hero/sidebar/category options and all visible labels.
 * @param {object} props.logo Header logo.
 * @param {object[]} props.navigation Header navigation.
 * @param {{items:object[],counts:object,category:typeof memoryCategories[number],bannerOpen:boolean,selected:object|null,menuId:string|null,editing:boolean,draft:object}} props.memory Workspace state and named action callbacks; see MemoryWorkspace.
 * @param {{open:boolean,draft:{title:string,category:string,description:string},errors:{title?:boolean,description?:boolean},onOpen?:Function,onClose?:(event:{reason:string})=>void,onChange?:(event:{field:string,value:string})=>void,onAutoFill?:Function,onSave?:Function}} props.create Create drawer state/actions.
 * @param {{target:object|null,onCancel?:(event:{reason:string})=>void,onConfirm?:(event:{confirmed:true})=>void}} props.deletion Delete confirmation state/actions.
 * @param {object} props.assistant Lite assistant props and named callbacks.
 * @param {object} [props.skillFlow] Model-flow props.
 * @param {(id:string,params?:object)=>string} [props.hrefFor]
 * @param {(event:{id:string,params:object,href:string,label:string})=>void} [props.onNavigate]
 */
export function PersonalMemoryPage({ content, logo, navigation = [], memory = {}, create = {}, deletion = {}, assistant = {}, skillFlow, hrefFor, onNavigate }) {
  const { labels, hero, categories, sidebar } = content;
  const launcherRef = React.useRef(null);
  const createButtonRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const descriptionRef = React.useRef(null);
  React.useEffect(() => { if (create.open && create.errors?.title) titleRef.current?.focus(); else if (create.open && create.errors?.description) descriptionRef.current?.focus(); }, [create.open, create.errors?.title, create.errors?.description]);
  const { open: aiOpen = false, prompt: aiPrompt = "", answers = [], selectedSkill, onOpen: onAssistantOpen, onClose: onAssistantClose, onPromptChange, onSubmit, onSuggestion, onHistorySelect, onNewSession, onSelectSkill, onClearSkill, onSkillAction, onAttach, onMaximize, onHistory, ...aiCopy } = assistant;
  return <div className="mh-memory-page" data-memory-category={memory.category || "all"}>
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={hero.image} eyebrow={hero.eyebrow} title={hero.title} description={hero.description} height={372} variant="home" scrim="none" />
    <div className="mh-memory-page__body">
      <GovernanceNav items={sidebar} current="personal-memory" navigationAria={labels.navigationAria} categoriesAria={labels.categoriesAria} hrefFor={hrefFor} onNavigate={onNavigate} />
      <main className="mh-memory-page__main">
        {memory.bannerOpen && <div className="mh-memory-page__banner"><span className="mh-memory-page__banner-icon"><Icon name="info" /></span><div><strong>{labels.bannerTitle}</strong><span>{labels.bannerDescription}</span></div><button type="button" aria-label={labels.closeBanner} onClick={() => memory.onCloseBanner?.()}><Icon name="close" /></button></div>}
        <div className="mh-memory-page__tabs" role="tablist" aria-label={labels.listAria}>{categories.map((option) => <button key={option.value} type="button" role="tab" aria-selected={memory.category === option.value} onClick={() => memory.onCategoryChange?.({ value: option.value })}>{option.label} <span>{memory.counts?.[option.value] ?? 0}</span></button>)}<button ref={createButtonRef} type="button" className="mh-memory-page__new" onClick={() => create.onOpen?.()}><Icon name="plus" />{labels.newMemory}</button></div>
        <MemoryWorkspace {...memory} labels={labels} />
      </main>
    </div>
    <AssistantLauncher ref={launcherRef} hidden={aiOpen} label={aiCopy.launcherLabel} onOpen={onAssistantOpen} />
    <AssistantPanel open={aiOpen} returnFocusRef={launcherRef} placement="drawer" variant="lite" {...aiCopy} prompt={aiPrompt} answers={answers} selectedSkill={selectedSkill} onClose={onAssistantClose} onPromptChange={onPromptChange} onSubmit={onSubmit} onSuggestion={onSuggestion} onHistorySelect={onHistorySelect} onNewSession={onNewSession} onSelectSkill={onSelectSkill} onClearSkill={onClearSkill} onSkillAction={onSkillAction} onAttach={onAttach} onMaximize={onMaximize} onHistory={onHistory} />
    {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    <Modal open={Boolean(create.open)} variant="drawer" className="mh-memory-page__create" eyebrow={labels.createEyebrow} title={labels.createTitle} closeLabel={labels.closeCreate} initialFocus={titleRef} onClose={create.onClose} footer={<div className="mh-memory-page__create-actions"><button type="button" onClick={() => create.onClose?.({ reason: "cancel" })}>{labels.cancel}</button><button type="button" onClick={() => create.onSave?.()}>{labels.saveMemory}</button></div>}>
      <div className="mh-memory-page__form"><label><span><span className="mh-memory-page__required">* </span>{labels.title}</span><input ref={titleRef} type="text" value={create.draft?.title || ""} placeholder={labels.titlePlaceholder} aria-invalid={Boolean(create.errors?.title)} onChange={(event) => create.onChange?.({ field: "title", value: event.target.value })} />{create.errors?.title && <small>{labels.cannotBeEmpty}</small>}</label><label>{labels.category}<select value={create.draft?.category || "analysis"} onChange={(event) => create.onChange?.({ field: "category", value: event.target.value })}>{categories.filter((option) => option.value !== "all").map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label><span><span className="mh-memory-page__required">* </span>{labels.description}</span><span className="mh-memory-page__textarea"><textarea ref={descriptionRef} value={create.draft?.description || ""} placeholder={labels.descriptionPlaceholder} aria-invalid={Boolean(create.errors?.description)} onChange={(event) => create.onChange?.({ field: "description", value: event.target.value })} /><button type="button" onClick={() => create.onAutoFill?.()}>{labels.autoFill}</button></span>{create.errors?.description && <small>{labels.cannotBeEmpty}</small>}</label></div>
    </Modal>
    <ConfirmDialog open={Boolean(deletion.target)} purpose="danger" title={labels.deleteTitle} message={deletion.target ? <>{labels.deleteBefore}<strong>{deletion.target.title}</strong>{labels.deleteAfter}</> : ""} cancelLabel={labels.cancel} confirmLabel={labels.delete} onCancel={deletion.onCancel} onConfirm={deletion.onConfirm} />
  </div>;
}
