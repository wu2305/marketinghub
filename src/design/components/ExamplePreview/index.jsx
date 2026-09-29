import "../../tokens.css";
import React from "react";
import { Icon } from "../../icons.jsx";
import { Button } from "../Button/index.jsx";
import "./ExamplePreview.css";

const PLAY = "M14.752 11.168 11.555 9.036A1 1 0 0 0 10 9.87v4.263a1 1 0 0 0 1.555.832l3.197-2.132a1 1 0 0 0 0-1.664ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z";

/** @type {readonly ["run", "view"]} */
export const examplePreviewVariants = ["run", "view"];

/**
 * A scenario's example question and its simulated output, under a heading with one action.
 * `run` (scenario forms): the action runs the preview and the question is editable.
 * `view` (detail surfaces): the action shows or hides a read-only question and output.
 * Controlled: `output` is null while nothing is shown, a string once it is.
 * @param {object} props
 * @param {typeof examplePreviewVariants[number]} [props.variant="run"]
 * @param {string} props.title Section heading.
 * @param {string} props.actionLabel Action button copy (Run Preview; or Show / Hide Preview for `view`).
 * @param {string} props.questionLabel Example question label.
 * @param {string} [props.questionPlaceholder] `run` only.
 * @param {string} [props.question=""] Example question text.
 * @param {string|null} [props.output=null] Null hides the question and output; a string shows them.
 * @param {(event:{question:string})=>void} [props.onRun] `run`: action pressed with the current question.
 * @param {(event:{value:string})=>void} [props.onQuestionChange] `run` only.
 * @param {(event:{open:boolean})=>void} [props.onToggle] `view`: requested disclosure state.
 */
export function ExamplePreview({ variant = "run", title, actionLabel, questionLabel, questionPlaceholder, question = "", output = null, onRun, onQuestionChange, onToggle }) {
  const id = React.useId();
  const open = output !== null;
  const view = variant === "view";
  return <section className="mh-example-preview">
    <div className="mh-example-preview__head"><h3>{title}</h3>{view
      ? <Button variant="secondary" size="sm" icon={open ? "eye-off" : "eye"} expanded={open} onClick={() => onToggle?.({ open: !open })}>{actionLabel}</Button>
      : <Button variant="secondary" size="sm" onClick={() => onRun?.({ question })}><Icon path={PLAY} className="mh-button__icon" />{actionLabel}</Button>}</div>
    {open && <div className="mh-example-preview__body">{view
      ? <div className="mh-example-preview__question"><strong>{questionLabel}</strong><span>{question}</span></div>
      : <><label htmlFor={id}>{questionLabel}</label><textarea id={id} rows={2} value={question} placeholder={questionPlaceholder} onChange={(event) => onQuestionChange?.({ value: event.target.value })} /></>}<pre>{output}</pre></div>}
  </section>;
}
