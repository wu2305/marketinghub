import "../../../tokens.css";
import React from "react";
import { Icon } from "../../../icons.jsx";
import "./SkillInlineForm.css";

/** @type {readonly ["", "Global", "Campaign", "Customer", "Audience", "Market"]} */
export const skillScopes = ["", "Global", "Campaign", "Customer", "Audience", "Market"];
const structureIconPaths = { triggerWhen: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2", input: "M3 3h18v18H3zM3 9h18M9 21V9", logic: "M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", output: "M7 16l-4-4m0 0 4-4m-4 4h18", boundary: "M12 9v2m0 4h.01M10.268 4 3.34 16c-.77 1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0Z" };

/**
 * P15 inline configuration form, distinct from the P17 standalone editor.
 * Native required markers remain visual; novalidate preserves source blank-submit behavior.
 * @param {object} props
 * @param {object} props.labels Source-backed form and field copy.
 * @param {object} props.values Controlled name, purpose, scope, owner and five structure fields.
 * @param {(event:{key:string,value:string})=>void} [props.onChange]
 * @param {(event:{values:object})=>void} [props.onSubmit]
 * @param {(event:{reason:"cancel"})=>void} [props.onCancel]
 * @param {(event:{action:"auto-fill"|"run-preview"|"save-draft",field?:string})=>void} [props.onClick] Source-visible no-op controls.
 */
export function SkillInlineForm({ labels, values = {}, onChange, onSubmit, onCancel, onClick }) {
  const id = React.useId();
  const change = (key) => (event) => onChange?.({ key, value: event.target.value });
  const field = (key, label, input, placeholder) => <div className="mh-skill-form__field"><label htmlFor={`${id}-${key}`}><span aria-hidden="true">*</span>{label}</label>{input === "textarea" ? <textarea id={`${id}-${key}`} rows="3" required value={values[key] || ""} placeholder={placeholder} onChange={change(key)} /> : input === "select" ? <select id={`${id}-${key}`} required value={values[key] || ""} onChange={change(key)}><option value="">{labels.selectScope}</option>{values[key] && !labels.scopeOptions.includes(values[key]) ? <option value={values[key]}>{values[key]}</option> : null}{labels.scopeOptions.map((scope) => <option key={scope} value={scope}>{scope}</option>)}</select> : <input id={`${id}-${key}`} required type="text" value={values[key] || ""} placeholder={placeholder} onChange={change(key)} />}</div>;
  return <form className="mh-skill-form" noValidate onSubmit={(event) => { event.preventDefault(); onSubmit?.({ values }); }}>
    <header className="mh-skill-form__head"><h2>{labels.formTitle}</h2><span><Icon path="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2" />{labels.autosaved}</span></header>
    <div className="mh-skill-form__body"><div className="mh-skill-form__field-row">{field("name", labels.name, "input", labels.namePlaceholder)}</div>{field("purpose", labels.purpose, "textarea", labels.purposePlaceholder)}<div className="mh-skill-form__field-row">{field("scope", labels.scope, "select")}{field("owner", labels.owner, "input", labels.ownerPlaceholder)}</div>
      <section className="mh-skill-form__structure"><h3>{labels.structure}</h3><div>{labels.structureFields.map((item) => <div className="mh-skill-form__structure-item" key={item.key}><span className={`mh-skill-form__structure-icon mh-skill-form__structure-icon--${item.key}`}><Icon path={structureIconPaths[item.key]} /></span><div><label htmlFor={`${id}-${item.key}`}>{item.label}</label><div className="mh-skill-form__textarea-wrap"><textarea id={`${id}-${item.key}`} rows="2" value={values[item.key] || ""} placeholder={item.placeholder} onChange={change(item.key)} /><button type="button" onClick={() => onClick?.({ action: "auto-fill", field: item.key })}>{labels.autoFill}</button></div></div></div>)}</div></section>
      <section className="mh-skill-form__preview"><h3>{labels.preview}</h3><button type="button" onClick={() => onClick?.({ action: "run-preview" })}><Icon path="M14.752 11.168 11.555 9.036A1 1 0 0 0 10 9.87v4.263a1 1 0 0 0 1.555.832l3.197-2.132a1 1 0 0 0 0-1.664ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />{labels.runPreview}</button></section>
      <footer className="mh-skill-form__footer"><span><Icon path="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2" />{labels.autosaved}</span><div><button type="button" onClick={() => onCancel?.({ reason: "cancel" })}><Icon name="arrow-left" />{labels.cancel}</button><button type="button" onClick={() => onClick?.({ action: "save-draft" })}><Icon name="file" />{labels.saveDraft}</button><button type="submit" className="mh-skill-form__submit">{labels.submit}<Icon name="arrow-left" /></button></div></footer>
    </div>
  </form>;
}
