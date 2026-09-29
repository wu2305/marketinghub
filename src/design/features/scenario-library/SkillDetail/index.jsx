import "../../../tokens.css";
import { Icon, knowledgeActionIconPaths } from "../../../icons.jsx";
import { Button } from "../../../components/Button/index.jsx";
import { StatusBadge } from "../../../components/StatusBadge/index.jsx";
import { Modal } from "../../../components/Modal/index.jsx";
import { ScenarioGovernance } from "../../../components/ScenarioGovernance/index.jsx";
import { ScenarioStructure } from "../../../components/ScenarioStructure/index.jsx";
import { ExamplePreview } from "../../../components/ExamplePreview/index.jsx";
import "./SkillDetail.css";

/** Workflow status → StatusBadge tone, shared by the list and the drawer. */
export const skillStatusTones = { Published: "success", "In Development": "info", "Under Review": "warning", Draft: "neutral" };

/**
 * Full Skill detail drawer with governance, structure, preview and source-visible actions.
 * @param {object} props
 * @param {object|null} props.skill Selected semantic record.
 * @param {object} props.labels Source-backed visible copy.
 * @param {boolean} props.previewOpen Controlled preview.
 * @param {(event:{reason:"scrim"|"escape"|"button"})=>void} [props.onCancel]
 * @param {(event:{value:boolean})=>void} [props.onChange] Preview toggle.
 * @param {(event:{id:string})=>void} [props.onOpen] Edit Scenario.
 * @param {(event:{id:string,action:"delete"})=>void} [props.onClick] Delete pressed; the caller confirms it (pattern B8).
 */
export function SkillDetail({ skill, labels, previewOpen = false, onCancel, onChange, onOpen, onClick }) {
  const usage = skill ? `${labels.usagePrefix} ${skill.usedInReports} ${labels.reports} / ${skill.usedInScenarios} ${labels.scenarios}` : "";
  return <Modal open={Boolean(skill)} variant="drawer" className="mh-skill-detail" eyebrow={labels.detailEyebrow} title={labels.detailTitle} closeLabel={labels.closeDetail} onClose={onCancel} footer={skill ? <div className="mh-skill-detail__actions"><Button variant="secondary" icon="pen" onClick={() => onOpen?.({ id: skill.id })}>{labels.edit}</Button><Button variant="danger" onClick={() => onClick?.({ id: skill.id, action: "delete" })}><Icon path={knowledgeActionIconPaths.delete} className="mh-button__icon" />{labels.delete}</Button></div> : null}>
    {skill ? <div className="mh-skill-detail__content" aria-label={labels.detailAria}>
      <header className="mh-skill-detail__intro"><div className="mh-skill-detail__tags"><StatusBadge status={skill.status} tone={skillStatusTones[skill.status]} /><span className="mh-skill-detail__tag mh-skill-detail__tag--scope">{skill.scope}</span><span className="mh-skill-detail__tag">{skill.version}</span></div><h2>{skill.name}</h2><p>{skill.purpose}</p></header>
      <section className="mh-skill-detail__governance"><h3>{labels.governance}</h3><ScenarioGovernance record={skill} fields={labels.governanceFields} userFallback={labels.userFallback} /></section>
      <section className="mh-skill-detail__structure"><h3>{labels.structure}</h3><ScenarioStructure record={skill} fields={labels.structureFields} /></section>
      <section className="mh-skill-detail__preview"><ExamplePreview variant="view" title={labels.preview} actionLabel={previewOpen ? labels.hidePreview : labels.showPreview} questionLabel={labels.question} question={skill.previewQuestion} output={previewOpen ? skill.previewOutput : null} onToggle={({ open }) => onChange?.({ value: open })} /></section>
      <p className="mh-skill-detail__usage"><Icon name="file" />{usage}</p>
    </div> : null}
  </Modal>;
}
