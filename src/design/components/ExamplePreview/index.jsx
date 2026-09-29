import "../../tokens.css";
import React from "react";
import { Icon } from "../../icons.jsx";
import "./ExamplePreview.css";

const PLAY = "M14.752 11.168 11.555 9.036A1 1 0 0 0 10 9.87v4.263a1 1 0 0 0 1.555.832l3.197-2.132a1 1 0 0 0 0-1.664ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z";

/**
 * Runnable example output of a scenario form: a heading with a Run Preview
 * button, and — once it has run — the example question and the simulated
 * output. Controlled: the container decides the output.
 * @param {object} props
 * @param {string} props.title Section heading.
 * @param {string} props.runLabel Run button copy.
 * @param {string} props.questionLabel Example question label.
 * @param {string} [props.questionPlaceholder]
 * @param {string} [props.question=""] Example question text.
 * @param {string|null} [props.output=null] Null hides the question and output; a string shows them.
 * @param {(event:{question:string})=>void} [props.onRun] Run Preview pressed with the current question.
 * @param {(event:{value:string})=>void} [props.onQuestionChange]
 */
export function ExamplePreview({ title, runLabel, questionLabel, questionPlaceholder, question = "", output = null, onRun, onQuestionChange }) {
  const id = React.useId();
  return <section className="mh-example-preview">
    <div className="mh-example-preview__head"><h3>{title}</h3><button type="button" onClick={() => onRun?.({ question })}><Icon path={PLAY} />{runLabel}</button></div>
    {output !== null && <div className="mh-example-preview__body"><label htmlFor={id}>{questionLabel}</label><textarea id={id} rows={2} value={question} placeholder={questionPlaceholder} onChange={(event) => onQuestionChange?.({ value: event.target.value })} /><pre>{output}</pre></div>}
  </section>;
}
