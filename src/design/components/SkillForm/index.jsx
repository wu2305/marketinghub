import "../../tokens.css";
import React from "react";
import { Icon } from "../../icons.jsx";
import { normalizeOptions } from "../../lib/options.js";
import { ExamplePreview } from "../ExamplePreview/index.jsx";
import "./SkillForm.css";

function plainPrimary(event) { return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.currentTarget.target; }

/**
 * Scenario Configuration form frame shared by the Skill Library inline form and the standalone Skill Edit page:
 * header, the four basics (name, purpose, scope, owner), a structure section that takes the caller's cards,
 * the runnable example preview and the Cancel / Save Draft / Submit footer. Validation is the container's: pass `errors`
 * and the first invalid control is focused.
 * @param {object} props
 * @param {object} props.labels Form copy: formTitle, saved, name, namePlaceholder, purpose, purposePlaceholder, scope, selectScope, owner, ownerPlaceholder, structure, required, preview, runPreview, question, questionPlaceholder, cancel, saveDraft, submit.
 * @param {{name?:string,purpose?:string,scope?:string,owner?:string,question?:string}} [props.values={}] A scope outside `scopes` is kept as an extra option.
 * @param {Array<string|{value:string,label:string}>} [props.scopes=[]]
 * @param {Record<string,boolean>} [props.errors={}] Invalid basics (name, purpose, scope, owner) show the required message.
 * @param {string|null} [props.preview=null] Null hides the example question and output; a string shows them.
 * @param {string} [props.cancelHref] Renders Cancel as a link (navigation); without it Cancel is a button.
 * @param {(event:{field:string,value:string})=>void} [props.onChange]
 * @param {(event:{question:string})=>void} [props.onRunPreview]
 * @param {(event:{values:object})=>void} [props.onSaveDraft]
 * @param {(event:{values:object})=>void} [props.onSubmit]
 * @param {(event:{reason:"cancel",href?:string})=>void} [props.onCancel]
 * @param {React.ReactNode} [props.children] Structure cards (`SkillFormCard`, `SkillFormFillCard`).
 */
export function SkillForm({ labels, values = {}, scopes = [], errors = {}, preview = null, cancelHref, onChange, onRunPreview, onSaveDraft, onSubmit, onCancel, children }) {
  const rootId = React.useId();
  const formRef = React.useRef(null);
  React.useEffect(() => { if (Object.values(errors).some(Boolean)) formRef.current?.querySelector('[aria-invalid="true"]')?.focus(); }, [errors]);
  const update = (field) => (event) => onChange?.({ field, value: event.target.value });
  const options = normalizeOptions(scopes);
  const extraScope = values.scope && !options.some((option) => option.value === values.scope) ? [{ value: values.scope, label: values.scope }] : [];
  const field = (key, control) => <div className="mh-skill-form__field"><label htmlFor={`${rootId}-${key}`}><span aria-hidden="true">*</span>{labels[key]}</label>{control}{errors[key] && <small role="alert">{labels.required}</small>}</div>;
  const common = (key) => ({ id: `${rootId}-${key}`, required: true, value: values[key] || "", "aria-invalid": Boolean(errors[key]), onChange: update(key) });
  return <form ref={formRef} className="mh-skill-form" noValidate onSubmit={(event) => { event.preventDefault(); onSubmit?.({ values: { ...values } }); }}>
    <header className="mh-skill-form__head"><h2>{labels.formTitle}</h2><span><Icon name="clock" />{labels.saved}</span></header>
    <div className="mh-skill-form__body">
      <div className="mh-skill-form__row">{field("name", <input {...common("name")} type="text" placeholder={labels.namePlaceholder} />)}</div>
      {field("purpose", <textarea {...common("purpose")} rows={3} placeholder={labels.purposePlaceholder} />)}
      <div className="mh-skill-form__row">
        {field("scope", <select {...common("scope")}><option value="">{labels.selectScope}</option>{[...options, ...extraScope].map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>)}
        {field("owner", <input {...common("owner")} type="text" placeholder={labels.ownerPlaceholder} />)}
      </div>
      <section className="mh-skill-form__structure"><h3>{labels.structure}</h3><div className="mh-skill-form__cards">{children}</div></section>
      <div className="mh-skill-form__preview"><ExamplePreview title={labels.preview} actionLabel={labels.runPreview} questionLabel={labels.question} questionPlaceholder={labels.questionPlaceholder} question={values.question || ""} output={preview} onRun={onRunPreview} onQuestionChange={({ value }) => onChange?.({ field: "question", value })} /></div>
      <footer className="mh-skill-form__footer"><span className="mh-skill-form__saved"><Icon name="clock" />{labels.saved}</span><div className="mh-skill-form__actions">
        {cancelHref === undefined
          ? <button type="button" onClick={() => onCancel?.({ reason: "cancel" })}><Icon name="arrow-left" />{labels.cancel}</button>
          : <a href={cancelHref} onClick={(event) => plainPrimary(event) && onCancel?.({ reason: "cancel", href: cancelHref })}><Icon name="arrow-left" />{labels.cancel}</a>}
        <button type="button" onClick={() => onSaveDraft?.({ values: { ...values } })}><Icon name="file" />{labels.saveDraft}</button>
        <button type="submit" className="mh-skill-form__submit">{labels.submit}<Icon name="arrow-left" /></button>
      </div></footer>
    </div>
  </form>;
}
