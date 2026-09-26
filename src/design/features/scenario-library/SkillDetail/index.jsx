import "../../../tokens.css";
import { Icon } from "../../../icons.jsx";
import { Modal } from "../../../components/Modal/index.jsx";
import { ScenarioGovernance } from "../../../components/ScenarioGovernance/index.jsx";
import { ScenarioStructure } from "../../../components/ScenarioStructure/index.jsx";
import { ScenarioPreview } from "../../../components/ScenarioPreview/index.jsx";
import "./SkillDetail.css";

/**
 * Full Skill detail drawer with governance, structure, preview and source-visible actions.
 * @param {object} props
 * @param {object|null} props.skill Selected semantic record.
 * @param {object} props.labels Source-backed visible copy.
 * @param {boolean} props.previewOpen Controlled preview.
 * @param {(event:{reason:"scrim"|"escape"|"button"})=>void} [props.onCancel]
 * @param {(event:{value:boolean})=>void} [props.onChange] Preview toggle.
 * @param {(event:{id:string})=>void} [props.onOpen] Edit Scenario.
 * @param {(event:{id:string,action:"delete"})=>void} [props.onClick] Visible source no-op Delete action.
 */
export function SkillDetail({ skill, labels, previewOpen = false, onCancel, onChange, onOpen, onClick }) {
  const usage = skill ? `${labels.usagePrefix} ${skill.usedInReports} ${labels.reports} / ${skill.usedInScenarios} ${labels.scenarios}` : "";
  return <Modal open={Boolean(skill)} variant="drawer" className="mh-skill-detail" eyebrow={labels.detailEyebrow} title={labels.detailTitle} closeLabel={labels.closeDetail} onClose={onCancel} footer={skill ? <div className="mh-skill-detail__actions"><button type="button" onClick={() => onOpen?.({ id: skill.id })}><Icon name="pen" />{labels.edit}</button><button type="button" className="mh-skill-detail__danger" onClick={() => onClick?.({ id: skill.id, action: "delete" })}><Icon path="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />{labels.delete}</button></div> : null}>
    {skill ? <div className="mh-skill-detail__content" aria-label={labels.detailAria}>
      <header className="mh-skill-detail__intro"><div className="mh-skill-detail__tags"><span data-status={skill.status}>{skill.status}</span><span>{skill.scope}</span><span>{skill.version}</span></div><h2>{skill.name}</h2><p>{skill.purpose}</p></header>
      <section className="mh-skill-detail__governance"><h3>{labels.governance}</h3><ScenarioGovernance record={skill} fields={labels.governanceFields} userFallback={labels.userFallback} /></section>
      <section className="mh-skill-detail__structure"><h3>{labels.structure}</h3><ScenarioStructure record={skill} fields={labels.structureFields} /></section>
      <section className="mh-skill-detail__preview"><ScenarioPreview title={labels.preview} showLabel={labels.showPreview} hideLabel={labels.hidePreview} questionLabel={labels.exampleQuestion} question={skill.previewQuestion} output={skill.previewOutput} open={previewOpen} onChange={({ open }) => onChange?.({ value: open })} /></section>
      <a className="mh-skill-detail__usage" href="#"><Icon name="file" />{usage}</a>
    </div> : null}
  </Modal>;
}
