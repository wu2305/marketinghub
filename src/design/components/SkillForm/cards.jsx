import "../../tokens.css";
import React from "react";
import { Icon } from "../../icons.jsx";
import { AutoFillTextarea } from "../AutoFillTextarea/index.jsx";
import "./SkillForm.css";

/** @type {readonly ["info", "success", "rose", "violet"]} */
export const skillFormTones = ["info", "success", "rose", "violet"];

/**
 * One bordered card of a skill form's structure section: a tinted icon, a heading and the card's controls.
 * @param {object} props
 * @param {typeof skillFormTones[number]} [props.tone="info"]
 * @param {typeof import("../../icons.jsx").iconNames[number]} props.icon
 * @param {string} props.label Card heading.
 * @param {string} [props.htmlFor] Id of the control the heading names; without it the heading is plain text.
 * @param {React.ReactNode} props.children Controls.
 */
export function SkillFormCard({ tone = "info", icon, label, htmlFor, children }) {
  return <div className="mh-skill-form__card">
    <span className={`mh-skill-form__card-icon mh-skill-form__card-icon--${tone}`}><Icon name={icon} /></span>
    <div className="mh-skill-form__card-body">{htmlFor ? <label className="mh-skill-form__card-title" htmlFor={htmlFor}>{label}</label> : <strong className="mh-skill-form__card-title">{label}</strong>}{children}</div>
  </div>;
}

/**
 * A `SkillFormCard` whose control is a textarea with an AI Auto-fill pill.
 * @param {object} props
 * @param {typeof skillFormTones[number]} [props.tone="info"]
 * @param {typeof import("../../icons.jsx").iconNames[number]} props.icon
 * @param {string} props.label Card heading, also the textarea's label.
 * @param {string} [props.value=""]
 * @param {string} [props.placeholder]
 * @param {string} props.autoFillLabel Pill copy.
 * @param {(event:{value:string})=>void} [props.onChange]
 * @param {() => void} [props.onAutoFill]
 */
export function SkillFormFillCard({ tone, icon, label, value, placeholder, autoFillLabel, onChange, onAutoFill }) {
  const id = React.useId();
  return <SkillFormCard tone={tone} icon={icon} label={label} htmlFor={id}><AutoFillTextarea id={id} value={value} placeholder={placeholder} autoFillLabel={autoFillLabel} onChange={onChange} onAutoFill={onAutoFill} /></SkillFormCard>;
}
