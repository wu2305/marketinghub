import "../../../tokens.css";
import { SkillForm } from "../../../components/SkillForm/index.jsx";
import { SkillFormFillCard } from "../../../components/SkillForm/cards.jsx";

const structureCards = { triggerWhen: { tone: "info", icon: "clock" }, input: { tone: "info", icon: "grid-four" }, logic: { tone: "success", icon: "bulb" }, output: { tone: "rose", icon: "arrow-left" }, boundary: { tone: "violet", icon: "alert-triangle" } };

/**
 * P15 inline configuration form: the shared `SkillForm` frame with the five structure fields, each with AI Auto-fill.
 * Native required markers remain visual; novalidate preserves source blank-submit behavior.
 * @param {object} props
 * @param {object} props.labels Source-backed form and field copy.
 * @param {object} props.values Controlled name, purpose, scope, owner, five structure fields and the example question.
 * @param {string|null} [props.preview=null] Null hides the example question and output; a string shows them.
 * @param {(event:{field:string,value:string})=>void} [props.onChange]
 * @param {(event:{values:object})=>void} [props.onSubmit]
 * @param {(event:{reason:"cancel"})=>void} [props.onCancel]
 * @param {(event:{field:"triggerWhen"|"input"|"logic"|"output"|"boundary"})=>void} [props.onAutoFill] AI Auto-fill pressed; the demo container fills that field.
 * @param {(event:{question:string})=>void} [props.onRunPreview] Run Preview pressed with the current question.
 * @param {(event:{values:object})=>void} [props.onSaveDraft] Save Draft pressed; the demo container saves and acknowledges it.
 */
export function SkillInlineForm({ labels, values = {}, preview = null, onChange, onSubmit, onCancel, onAutoFill, onRunPreview, onSaveDraft }) {
  return <SkillForm labels={labels} values={values} scopes={labels.scopeOptions} preview={preview} onChange={onChange} onSubmit={onSubmit} onCancel={onCancel} onRunPreview={onRunPreview} onSaveDraft={onSaveDraft}>
    {labels.structureFields.map((item) => <SkillFormFillCard key={item.key} {...structureCards[item.key]} label={item.label} value={values[item.key] || ""} placeholder={item.placeholder} autoFillLabel={labels.autoFill} onChange={({ value }) => onChange?.({ field: item.key, value })} onAutoFill={() => onAutoFill?.({ field: item.key })} />)}
  </SkillForm>;
}
