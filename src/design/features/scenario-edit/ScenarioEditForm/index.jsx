import "../../../tokens.css";
import React from "react";
import "./ScenarioEditForm.css";

const iconPaths = {
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  report: <><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v5h5M8 12h8M8 16h8" /></>,
  logic: <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
  output: <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />,
  boundary: <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
  play: <><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></>,
  back: <path d="M19 12H5M12 19l-7-7 7-7" />,
  save: <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
  next: <path d="M5 12h14M12 5l7 7-7 7" />,
};
function FormIcon({ name, weight = 1.5 }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={weight} aria-hidden="true">{iconPaths[name]}</svg>; }
function plainPrimary(event) { return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.currentTarget.target; }

/**
 * Controlled Skill Edit form: five required fields, four structure cards, preview and source footer actions.
 * @param {object} props
 * @param {object} props.content Visible labels, scope/report options and static attachment names.
 * @param {{name:string,purpose:string,scope:string,owner:string,report:string,logic:string,output:string,question:string}} props.values
 * @param {Record<string,boolean>} [props.errors] Validation state for name/purpose/scope/owner/report.
 * @param {string|null} [props.preview] Null hides preview; string is the generated or empty-question output.
 * @param {(event:{field:string,value:string})=>void} [props.onChange]
 * @param {(event:{question:string})=>void} [props.onRunPreview] The demo container derives output using the current question.
 * @param {(event:{field:"logic"|"output"})=>void} [props.onAutoFill] Source buttons have no resulting behavior.
 * @param {(event:{files:string[]})=>void} [props.onSelectFiles] Native picker selection; static pills do not change.
 * @param {(event:{values:object})=>void} [props.onSaveDraft] Source button has no resulting behavior.
 * @param {(event:{values:object})=>void} [props.onSubmit] The demo container validates the submitted values and emits the final named payload.
 * @param {(id:string,params?:object)=>string} [props.hrefFor]
 * @param {(event:{id:string,params:object,href:string,label:string})=>void} [props.onNavigate]
 */
export function ScenarioEditForm({ content, values, errors = {}, preview = null, onChange, onRunPreview, onAutoFill, onSelectFiles, onSaveDraft, onSubmit, hrefFor, onNavigate }) {
  const { labels, reports, scopes, attachments, attachmentAccept } = content;
  const rootId = React.useId();
  const ids = Object.fromEntries(["name", "purpose", "scope", "owner", "report", "logic", "output", "files", "question"].map((field) => [field, `${rootId}-${field}`]));
  const nameRef = React.useRef(null);
  const purposeRef = React.useRef(null);
  const scopeRef = React.useRef(null);
  const ownerRef = React.useRef(null);
  const reportRef = React.useRef(null);
  const refs = { name: nameRef, purpose: purposeRef, scope: scopeRef, owner: ownerRef, report: reportRef };
  const errorKey = ["name", "purpose", "scope", "owner", "report"].find((field) => errors[field]);
  React.useEffect(() => { if (errorKey === "name") nameRef.current?.focus(); else if (errorKey === "purpose") purposeRef.current?.focus(); else if (errorKey === "scope") scopeRef.current?.focus(); else if (errorKey === "owner") ownerRef.current?.focus(); else if (errorKey === "report") reportRef.current?.focus(); }, [errors, errorKey]);
  const update = (field) => (event) => onChange?.({ field, value: event.target.value });
  const field = (key, label, control) => <div className="mh-scenario-edit-form__field" key={key}><label htmlFor={ids[key]}><span aria-hidden="true">*</span>{label}</label>{control}{errors[key] && <small role="alert">{labels.required}</small>}</div>;
  const input = (key, placeholder) => <input ref={refs[key]} id={ids[key]} value={values[key] || ""} placeholder={placeholder} required aria-invalid={Boolean(errors[key])} onChange={update(key)} />;
  const report = reports.find((item) => item.value === values.report);
  const reportParams = report ? { project: report.project, dashboard: report.dashboard } : {};
  const reportHref = report ? (hrefFor?.("cockpit", reportParams) || report.href) : undefined;
  const cancelHref = hrefFor?.("scenario-library", {}) || "scenario-library.html";
  // Preserve only a loaded record's unsupported scope as an additional option.
  const scopeOptions = values.scope && !scopes.some((option) => option.value === values.scope) ? [...scopes, { value: values.scope, label: values.scope }] : scopes;
  return <form className="mh-scenario-edit-form" noValidate onSubmit={(event) => { event.preventDefault(); onSubmit?.({ values: { ...values } }); }}>
    <header className="mh-scenario-edit-form__header"><h2>{labels.formTitle}</h2><span><FormIcon name="clock" weight={2} />{labels.saved}</span></header>
    <div className="mh-scenario-edit-form__body">
      <div className="mh-scenario-edit-form__row">{field("name", labels.name, input("name", labels.namePlaceholder))}</div>
      {field("purpose", labels.purpose, <textarea ref={refs.purpose} id={ids.purpose} rows={3} value={values.purpose || ""} placeholder={labels.purposePlaceholder} required aria-invalid={Boolean(errors.purpose)} onChange={update("purpose")} />)}
      <div className="mh-scenario-edit-form__row">
        {field("scope", labels.scope, <select ref={refs.scope} id={ids.scope} value={values.scope || ""} required aria-invalid={Boolean(errors.scope)} onChange={update("scope")}>{!values.scope && <option value="">{labels.scope}</option>}{scopeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>)}
        {field("owner", labels.owner, input("owner", labels.ownerPlaceholder))}
      </div>
      <section className="mh-scenario-edit-form__section"><h3>{labels.structure}</h3><div className="mh-scenario-edit-form__cards">
        <div className="mh-scenario-edit-form__card"><span className="mh-scenario-edit-form__icon mh-scenario-edit-form__icon--report"><FormIcon name="report" /></span><div className="mh-scenario-edit-form__card-body"><strong>{labels.report}</strong><select ref={refs.report} id={ids.report} value={values.report || ""} required aria-invalid={Boolean(errors.report)} aria-label={labels.report} onChange={update("report")}><option value="">{labels.selectReport}</option>{reports.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>{errors.report && <small role="alert">{labels.required}</small>}{report && <a href={reportHref} onClick={(event) => plainPrimary(event) && onNavigate?.({ id: "cockpit", params: reportParams, href: reportHref, label: `${labels.openReportPrefix}${report.label}` })}>{labels.openReportPrefix}{report.label}</a>}</div></div>
        <div className="mh-scenario-edit-form__card"><span className="mh-scenario-edit-form__icon mh-scenario-edit-form__icon--logic"><FormIcon name="logic" /></span><div className="mh-scenario-edit-form__card-body"><strong>{labels.logic}</strong><div className="mh-scenario-edit-form__fill"><textarea id={ids.logic} rows={2} value={values.logic || ""} placeholder={labels.logicPlaceholder} aria-label={labels.logic} onChange={update("logic")} /><button type="button" onClick={() => onAutoFill?.({ field: "logic" })}>{labels.autoFill}</button></div></div></div>
        <div className="mh-scenario-edit-form__card"><span className="mh-scenario-edit-form__icon mh-scenario-edit-form__icon--output"><FormIcon name="output" /></span><div className="mh-scenario-edit-form__card-body"><strong>{labels.output}</strong><div className="mh-scenario-edit-form__fill"><textarea id={ids.output} rows={2} value={values.output || ""} placeholder={labels.outputPlaceholder} aria-label={labels.output} onChange={update("output")} /><button type="button" onClick={() => onAutoFill?.({ field: "output" })}>{labels.autoFill}</button></div></div></div>
        <div className="mh-scenario-edit-form__card"><span className="mh-scenario-edit-form__icon mh-scenario-edit-form__icon--boundary"><FormIcon name="boundary" /></span><div className="mh-scenario-edit-form__card-body"><strong>{labels.materials}</strong><label htmlFor={ids.files} className="mh-scenario-edit-form__upload"><input id={ids.files} type="file" multiple accept={attachmentAccept} onChange={(event) => onSelectFiles?.({ files: Array.from(event.target.files || [], (file) => file.name) })} /><span>{labels.upload}</span><small>{labels.uploadHint}</small></label><div className="mh-scenario-edit-form__attachments">{attachments.map((name) => <span key={name}>{name}</span>)}</div></div></div>
      </div></section>
      <section className="mh-scenario-edit-form__section mh-scenario-edit-form__preview"><div className="mh-scenario-edit-form__preview-head"><h3>{labels.preview}</h3><button type="button" onClick={() => onRunPreview?.({ question: values.question || "" })}><FormIcon name="play" />{labels.runPreview}</button></div>{preview !== null && <div className="mh-scenario-edit-form__preview-body"><label htmlFor={ids.question}>{labels.question}</label><textarea id={ids.question} rows={2} value={values.question || ""} placeholder={labels.questionPlaceholder} onChange={update("question")} /><pre>{preview}</pre></div>}</section>
      <footer className="mh-scenario-edit-form__footer"><span className="mh-scenario-edit-form__saved"><FormIcon name="clock" weight={2} />{labels.saved}</span><div className="mh-scenario-edit-form__actions"><a href={cancelHref} onClick={(event) => plainPrimary(event) && onNavigate?.({ id: "scenario-library", params: {}, href: cancelHref, label: labels.cancel })}><FormIcon name="back" weight={2} />{labels.cancel}</a><button type="button" onClick={() => onSaveDraft?.({ values: { ...values } })}><FormIcon name="save" weight={2} />{labels.saveDraft}</button><button type="submit">{labels.submit}<FormIcon name="next" weight={2} /></button></div></footer>
    </div>
  </form>;
}
