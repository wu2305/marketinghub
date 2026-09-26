import React from "react";
import { FormField } from "../../../components/FormField/index.jsx";
import { Button } from "../../../components/Button/index.jsx";
import "../../../tokens.css";
import "./BusinessTermForm.css";

/** @type {readonly ["Business Term", "Global Synonym"]} */
export const businessTermKinds = ["Business Term", "Global Synonym"];

/**
 * Controlled Business Term form. `onChange` receives `{name,value}`; actions receive `{values}`.
 * @param {object} props
 * @param {string} props.title Term name.
 * @param {typeof businessTermKinds[number]} props.kind One of businessTermKinds.
 * @param {string} props.description Meaning and boundary.
 * @param {string} props.synonyms Comma-separated aliases.
 * @param {string[]} props.scope Linked Data Models.
 * @param {string[]} props.scopeOptions Available Data Models.
 * @param {string} props.guidanceTitle
 * @param {string} props.guidance
 * @param {string} props.reminder
 * @param {object} props.labels Visible field and action labels.
 * @param {object} props.placeholders Input hints.
 * @param {string[]} props.invalid Required field names in error state.
 * @param {(event:{name:string,value:unknown}) => void} [props.onChange]
 * @param {(event:{values:object}) => void} [props.onCancel]
 * @param {(event:{values:object}) => void} [props.onSave]
 * @param {(event:{values:object}) => void} [props.onSubmit]
 */
export function BusinessTermForm({
  title = "", kind = "Business Term", description = "", synonyms = "", scope = [],
  scopeOptions = [], guidanceTitle = "Build a common language", guidance = "", reminder = "",
  labels = { title: "Title", kind: "Term Type", description: "Description", synonyms: "Synonyms", scope: "Data Model", select: "Select one or more", cancel: "Cancel", save: "Save", submit: "Submit", required: "This field is required." },
  placeholders = { title: "Enter the business term title.", description: "Explain the meaning, usage, and boundary of this term.", synonyms: "Add aliases, abbreviations, or equivalent terms, separated by commas." },
  invalid = [], onChange, onCancel, onSave, onSubmit,
}) {
  const [scopeOpen, setScopeOpen] = React.useState(false);
  const scopeRef = React.useRef(null);
  React.useEffect(() => {
    if (!scopeOpen) return undefined;
    const closeOutside = (event) => { if (!scopeRef.current?.contains(event.target)) setScopeOpen(false); };
    const closeEscape = (event) => { if (event.key === "Escape") setScopeOpen(false); };
    document.addEventListener("click", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => { document.removeEventListener("click", closeOutside); document.removeEventListener("keydown", closeEscape); };
  }, [scopeOpen]);
  const values = { title, kind, description, synonyms, scope };
  const errors = Array.isArray(invalid) ? invalid : invalid ? ["title", "description"] : [];
  const set = (name, value) => onChange?.({ name, value });
  return <form className="mh-btform" noValidate onSubmit={(event) => { event.preventDefault(); onSubmit?.({ values }); }}>
    <aside className="mh-btform__guidance"><span aria-hidden="true">☼</span><div><strong>{guidanceTitle}</strong><p>{guidance}</p></div></aside>
    <div className="mh-btform__fields">
      <FormField label={labels.title} name="title" value={title} required invalid={errors.includes("title")} hint={errors.includes("title") ? labels.required : undefined} placeholder={placeholders.title} onChange={onChange} />
      <FormField label={labels.kind} name="kind" control="select" value={kind} options={businessTermKinds} required onChange={onChange} />
      <FormField label={labels.description} name="description" control="textarea" rows={3} value={description} required invalid={errors.includes("description")} hint={errors.includes("description") ? labels.required : undefined} placeholder={placeholders.description} onChange={onChange} />
      <FormField label={labels.synonyms} name="synonyms" value={synonyms} placeholder={placeholders.synonyms} onChange={onChange} />
      {kind === "Business Term" && <div className="mh-btform__scope" ref={scopeRef}><span>{labels.scope}</span><button type="button" aria-expanded={scopeOpen} onClick={() => setScopeOpen((x) => !x)}>{scope.length ? scope.map((item) => <i key={item}>{item}</i>) : <em>{labels.select}</em>}</button>{scopeOpen && <div className="mh-btform__scope-menu">{scopeOptions.map((item) => <label key={item}><input type="checkbox" checked={scope.includes(item)} onChange={() => set("scope", scope.includes(item) ? scope.filter((x) => x !== item) : [...scope, item])} />{item}</label>)}</div>}</div>}
    </div>
    <footer className="mh-btform__footer"><div><Button variant="secondary" onClick={() => onCancel?.({ values })}>{labels.cancel}</Button><Button variant="secondary" onClick={() => onSave?.({ values })}>{labels.save}</Button><Button variant="gold" type="submit">{labels.submit}</Button></div><p>ⓘ {reminder}</p></footer>
  </form>;
}
