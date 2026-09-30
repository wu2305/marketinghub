import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { GovernanceNav } from "../../components/GovernanceNav/index.jsx";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { AutoFillTextarea } from "../../components/AutoFillTextarea/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
import { ConfirmDialog } from "../../components/ConfirmDialog/index.jsx";
import { LibraryList } from "../../components/LibraryList/index.jsx";
import { Toast } from "../../components/Toast/index.jsx";
import { MemoryWorkspace } from "../../features/personal-memory/MemoryWorkspace/index.jsx";
import { Icon } from "../../icons.jsx";
import "./PersonalMemoryPage.css";

const MEMORY_ACTIONS = [{ action: "edit", blocked: false, reason: null }, { action: "delete", blocked: false, reason: null }];

/** @type {readonly ["all", "analysis", "meeting", "findings", "reference"]} */
export const memoryCategories = ["all", "analysis", "meeting", "findings", "reference"];

/**
 * Controlled Personal Memory page; all data and visible copy arrive as props.
 * @param {object} props
 * @param {object} props.content Hero/sidebar/category options and all visible labels. // Hero/侧栏/分类选项以及全部可见标签。
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {object[]} [props.navigation=[]] Header navigation. // 页头导航。
 * @param {{items:object[],counts:object,category:typeof memoryCategories[number],bannerOpen:boolean,selected:object|null,editing:boolean,draft:object}} [props.memory={}] Workspace state and named action callbacks; see MemoryWorkspace. // 工作区状态与具名操作回调；参见 MemoryWorkspace。
 * @param {{open:boolean,draft:{title:string,category:string,description:string},errors:{title?:boolean,description?:boolean},onOpen?:Function,onClose?:(event:{reason:string})=>void,onChange?:(event:{field:string,value:string})=>void,onAutoFill?:(event:{field:"description"})=>void,onSave?:Function}} [props.create={}] Create drawer state/actions. // 创建抽屉的状态/操作。
 * @param {{target:object|null,onCancel?:(event:{reason:string})=>void,onConfirm?:(event:{confirmed:true})=>void}} [props.deletion={}] Delete confirmation state/actions. // 删除确认的状态/操作。
 * @param {string} [props.toast=""] Success message after a delete (hidden when empty). // 删除后的成功消息（为空时隐藏）。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState} [props.assistant={}] Lite assistant props and named callbacks. // 轻量助手 props 与具名回调。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model-flow props. // 建模流程 props。
 * @param {(id:string,params?: Record<string,string>)=>string} [props.hrefFor]
 * @param {(event:{id:string,params: Record<string,string>,href:string,label:string})=>void} [props.onNavigate]
 */
export function PersonalMemoryPage({ content, logo, navigation = [], memory = {}, create = {}, deletion = {}, toast = "", assistant = {}, skillFlow, hrefFor, onNavigate }) {
  const { labels, hero, categories, sidebar } = content;
  const createButtonRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const descriptionRef = React.useRef(null);
  React.useEffect(() => { if (create.open && create.errors?.title) titleRef.current?.focus(); else if (create.open && create.errors?.description) descriptionRef.current?.focus(); }, [create.open, create.errors?.title, create.errors?.description]);
  const items = (memory.items || []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    selected: memory.selected?.id === item.id,
    meta: [{ label: labels.source, value: item.source }, { label: labels.updated, value: item.updated }],
    actions: { actions: MEMORY_ACTIONS, labels: { edit: labels.edit, delete: labels.delete } },
  }));
  return <div className="mh-memory-page" data-memory-category={memory.category || "all"}>
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={hero.image} eyebrow={hero.eyebrow} title={hero.title} description={hero.description} height={372} variant="home" scrim="none" />
    <div className="mh-memory-page__body">
      <GovernanceNav items={sidebar} current="personal-memory" navigationAria={labels.navigationAria} categoriesAria={labels.categoriesAria} hrefFor={hrefFor} onNavigate={onNavigate} />
      <main className="mh-memory-page__main">
        {memory.bannerOpen && <div className="mh-memory-page__banner"><span className="mh-memory-page__banner-icon"><Icon name="info" /></span><div><strong>{labels.bannerTitle}</strong><span>{labels.bannerDescription}</span></div><button type="button" aria-label={labels.closeBanner} onClick={() => memory.onCloseBanner?.()}><Icon name="close" /></button></div>}
        <div className="mh-memory-page__tabs" role="tablist" aria-label={labels.listAria}>{categories.map((option) => <button key={option.value} type="button" role="tab" aria-selected={memory.category === option.value} onClick={() => memory.onCategoryChange?.({ value: option.value })}>{option.label} <span>{memory.counts?.[option.value] ?? 0}</span></button>)}<button ref={createButtonRef} type="button" className="mh-memory-page__new" onClick={() => create.onOpen?.()}><Icon name="plus" />{labels.newMemory}</button></div>
        <MemoryWorkspace selected={memory.selected} editing={memory.editing} draft={memory.draft} labels={labels} onEdit={memory.onEdit} onDelete={memory.onDelete} onDraftChange={memory.onDraftChange} onCancelEdit={memory.onCancelEdit} onSaveEdit={memory.onSaveEdit} onShare={memory.onShare}>
          <LibraryList label={labels.listAria} layout="cards" items={items} empty={{ kind: "empty", title: labels.emptyList, message: labels.emptyListPrompt }} onOpen={memory.onSelect} onAction={({ action, id }) => (action === "edit" ? memory.onEdit : memory.onDelete)?.({ id })} />
        </MemoryWorkspace>
      </main>
    </div>
    <AssistantDock assistant={assistant} skillFlow={skillFlow} variant="lite" />
    <Modal open={Boolean(create.open)} variant="drawer" className="mh-memory-page__create" eyebrow={labels.createEyebrow} title={labels.createTitle} closeLabel={labels.closeCreate} initialFocus={titleRef} onClose={create.onClose} footer={<div className="mh-memory-page__create-actions"><button type="button" onClick={() => create.onClose?.({ reason: "cancel" })}>{labels.cancel}</button><button type="button" onClick={() => create.onSave?.()}>{labels.saveMemory}</button></div>}>
      <div className="mh-memory-page__form"><label><span><span className="mh-memory-page__required">* </span>{labels.title}</span><input ref={titleRef} type="text" value={create.draft?.title || ""} placeholder={labels.titlePlaceholder} aria-invalid={Boolean(create.errors?.title)} onChange={(event) => create.onChange?.({ field: "title", value: event.target.value })} />{create.errors?.title && <small>{labels.cannotBeEmpty}</small>}</label><label>{labels.category}<select value={create.draft?.category || "analysis"} onChange={(event) => create.onChange?.({ field: "category", value: event.target.value })}>{categories.filter((option) => option.value !== "all").map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label><span><span className="mh-memory-page__required">* </span>{labels.description}</span><AutoFillTextarea textareaRef={descriptionRef} rows={5} value={create.draft?.description || ""} placeholder={labels.descriptionPlaceholder} autoFillLabel={labels.autoFill} invalid={Boolean(create.errors?.description)} onChange={({ value }) => create.onChange?.({ field: "description", value })} onAutoFill={() => create.onAutoFill?.({ field: "description" })} />{create.errors?.description && <small>{labels.cannotBeEmpty}</small>}</label></div>
    </Modal>
    <Toast open={Boolean(toast)} message={toast} />
    <ConfirmDialog open={Boolean(deletion.target)} purpose="danger" title={labels.deleteTitle} message={deletion.target ? <>{labels.deleteBefore}<strong>{deletion.target.title}</strong>{labels.deleteAfter}</> : ""} cancelLabel={labels.cancel} confirmLabel={labels.delete} onCancel={deletion.onCancel} onConfirm={deletion.onConfirm} />
  </div>;
}
