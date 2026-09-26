import "../../../tokens.css";
import { Icon } from "../../../icons.jsx";
import { Modal } from "../../../components/Modal/index.jsx";
import "./SkillDetail.css";

const iconPaths = {
  file: "M10 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2h-5M14 2v6h6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  layers: "M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2",
  check: "M9 12l2 2 4-4M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  grid: "M3 3h18v18H3zM3 9h18M9 21V9",
  bulb: "M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  output: "M7 16l-4-4m0 0 4-4m-4 4h18",
  warning: "M12 9v2m0 4h.01M10.268 4 3.34 16c-.77 1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0Z",
};
const governanceIcons = { knowledgeId: "file", owner: "user", source: "layers", version: "clock", reviewStatus: "check", usageCount: "chart", accuracyScore: "file", updated: "clock", user: "user" };
const structureIcons = { triggerWhen: "clock", input: "grid", logic: "bulb", output: "output", boundary: "warning" };

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
  const values = skill ? { ...skill, usageCount: `${skill.callCount} / ${skill.callPeriod}`, accuracyScore: `${skill.accuracyScore}%` } : {};
  return <Modal open={Boolean(skill)} variant="drawer" className="mh-skill-detail" eyebrow={labels.detailEyebrow} title={labels.detailTitle} closeLabel={labels.closeDetail} onClose={onCancel} footer={skill ? <div className="mh-skill-detail__actions"><button type="button" onClick={() => onOpen?.({ id: skill.id })}><Icon name="pen" />{labels.edit}</button><button type="button" className="mh-skill-detail__danger" onClick={() => onClick?.({ id: skill.id, action: "delete" })}><Icon path="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />{labels.delete}</button></div> : null}>
    {skill ? <div className="mh-skill-detail__content" aria-label={labels.detailAria}>
      <header className="mh-skill-detail__intro"><div className="mh-skill-detail__tags"><span data-status={skill.status}>{skill.status}</span><span>{skill.scope}</span><span>{skill.version}</span></div><h2>{skill.name}</h2><p>{skill.purpose}</p></header>
      <section className="mh-skill-detail__governance"><h3>{labels.governance}</h3><div className="mh-skill-detail__governance-list">{labels.governanceFields.map((field) => <div key={field.key} className="mh-skill-detail__governance-item"><Icon path={iconPaths[governanceIcons[field.key]]} /><span>{field.label}</span><strong className={field.key === "reviewStatus" ? `mh-skill-detail__review--${skill.reviewStatus.toLowerCase()}` : ""}>{values[field.key]}</strong></div>)}</div></section>
      <section className="mh-skill-detail__structure"><h3>{labels.structure}</h3><div>{labels.structureFields.map((field) => <div className="mh-skill-detail__structure-item" key={field.key}><span className={`mh-skill-detail__structure-icon mh-skill-detail__structure-icon--${field.key}`}><Icon path={iconPaths[structureIcons[field.key]]} /></span><span><strong>{field.label}</strong><p>{skill[field.key]}</p></span></div>)}</div></section>
      <section className="mh-skill-detail__preview"><div className="mh-skill-detail__preview-head"><h3>{labels.preview}</h3><button type="button" onClick={() => onChange?.({ value: !previewOpen })}>{previewOpen ? <Icon path="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 0 1 1.574-2.99M9.88 9.88l-3.29-3.29m7.532 7.532 3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.542 7a10.058 10.058 0 0 1-3.704 4.976m0 0L21 21" /> : <Icon name="eye" />}{previewOpen ? labels.hidePreview : labels.showPreview}</button></div>{previewOpen ? <div className="mh-skill-detail__preview-body"><div><strong>{labels.exampleQuestion}</strong><span>{skill.previewQuestion}</span></div><pre>{skill.previewOutput}</pre></div> : null}</section>
      <a className="mh-skill-detail__usage" href="#"><Icon name="file" />{usage}</a>
    </div> : null}
  </Modal>;
}
