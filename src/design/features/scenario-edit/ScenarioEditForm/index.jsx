import "../../../tokens.css";
import React from "react";
import { SkillForm } from "../../../components/SkillForm/index.jsx";
import { SkillFormCard, SkillFormFillCard } from "../../../components/SkillForm/cards.jsx";
import "./ScenarioEditForm.css";

function plainPrimary(event) { return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.currentTarget.target; }

/**
 * Controlled Skill Edit form: the shared `SkillForm` frame with the report, logic, output and reference-material cards.
 * @param {object} props
 * @param {object} props.content Visible labels, scope/report options and static attachment names.
 * @param {{name:string,purpose:string,scope:string,owner:string,report:string,logic:string,output:string,question:string}} props.values
 * @param {Record<string,boolean>} [props.errors] Validation state for name/purpose/scope/owner/report.
 * @param {string|null} [props.preview] Null hides preview; string is the generated or empty-question output.
 * @param {(event:{field:string,value:string})=>void} [props.onChange]
 * @param {(event:{question:string})=>void} [props.onRunPreview] The demo container derives output using the current question.
 * @param {(event:{field:"logic"|"output"})=>void} [props.onAutoFill] AI Auto-fill pressed; the demo container fills that field.
 * @param {(event:{files:string[]})=>void} [props.onSelectFiles] Native picker selection; static pills do not change.
 * @param {(event:{values:object})=>void} [props.onSaveDraft] Save Draft pressed; the demo container saves and acknowledges it.
 * @param {(event:{values:object})=>void} [props.onSubmit] The demo container validates the submitted values and emits the final named payload.
 * @param {(id:string,params?: Record<string,string>)=>string} [props.hrefFor]
 * @param {(event:{id:string,params: Record<string,string>,href:string,label:string})=>void} [props.onNavigate]
 */
export function ScenarioEditForm({ content, values, errors = {}, preview = null, onChange, onRunPreview, onAutoFill, onSelectFiles, onSaveDraft, onSubmit, hrefFor, onNavigate }) {
  const { labels, reports, scopes, attachments, attachmentAccept } = content;
  const id = React.useId();
  const report = reports.find((item) => item.value === values.report);
  const reportParams = report ? { project: report.project, dashboard: report.dashboard } : {};
  const reportHref = report ? (hrefFor?.("cockpit", reportParams) || report.href) : undefined;
  const cancelHref = hrefFor?.("scenario-library", {}) || "scenario-library.html";
  const fill = (field, tone, icon, placeholder) => <SkillFormFillCard tone={tone} icon={icon} label={labels[field]} value={values[field] || ""} placeholder={placeholder} autoFillLabel={labels.autoFill} onChange={({ value }) => onChange?.({ field, value })} onAutoFill={() => onAutoFill?.({ field })} />;
  return <SkillForm labels={labels} values={values} scopes={scopes} errors={errors} preview={preview} cancelHref={cancelHref} onChange={onChange} onRunPreview={onRunPreview} onSaveDraft={onSaveDraft} onSubmit={onSubmit} onCancel={({ href }) => onNavigate?.({ id: "scenario-library", params: {}, href, label: labels.cancel })}>
    <SkillFormCard tone="info" icon="file" label={labels.report} htmlFor={`${id}-report`}>
      <select id={`${id}-report`} value={values.report || ""} required aria-invalid={Boolean(errors.report)} onChange={(event) => onChange?.({ field: "report", value: event.target.value })}><option value="">{labels.selectReport}</option>{reports.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
      {errors.report && <small role="alert">{labels.required}</small>}
      {report && <a className="mh-scenario-edit-form__report-link" href={reportHref} onClick={(event) => plainPrimary(event) && onNavigate?.({ id: "cockpit", params: reportParams, href: reportHref, label: `${labels.openReportPrefix}${report.label}` })}>{labels.openReportPrefix}{report.label}</a>}
    </SkillFormCard>
    {fill("logic", "success", "bulb", labels.logicPlaceholder)}
    {fill("output", "rose", "arrow-left", labels.outputPlaceholder)}
    <SkillFormCard tone="violet" icon="alert-triangle" label={labels.materials}>
      <label htmlFor={`${id}-files`} className="mh-scenario-edit-form__upload"><input id={`${id}-files`} type="file" multiple accept={attachmentAccept} onChange={(event) => onSelectFiles?.({ files: Array.from(event.target.files || [], (file) => file.name) })} /><span>{labels.upload}</span><small>{labels.uploadHint}</small></label>
      <div className="mh-scenario-edit-form__attachments">{attachments.map((name) => <span key={name}>{name}</span>)}</div>
    </SkillFormCard>
  </SkillForm>;
}
