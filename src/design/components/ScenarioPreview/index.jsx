import "../../tokens.css";
import { Icon } from "../../icons.jsx";
import "./ScenarioPreview.css";

/**
 * Controlled scenario example output with an accessible disclosure button.
 * @param {object} props
 * @param {string} props.title Section heading.
 * @param {string} props.showLabel Collapsed button copy.
 * @param {string} props.hideLabel Expanded button copy.
 * @param {string} props.questionLabel Example question label.
 * @param {string} props.question Example question text.
 * @param {string} props.output Example output text.
 * @param {boolean} [props.open=false] Whether the example is expanded.
 * @param {(event:{open:boolean})=>void} [props.onChange] Requested disclosure state.
 */
export function ScenarioPreview({ title, showLabel, hideLabel, questionLabel, question, output, open = false, onChange }) {
  return <div className="mh-scenario-preview"><div className="mh-scenario-preview__head"><h3>{title}</h3><button type="button" aria-expanded={open} onClick={() => onChange?.({ open: !open })}><Icon name={open ? "eye-off" : "eye"} />{open ? hideLabel : showLabel}</button></div>{open ? <div className="mh-scenario-preview__body"><div className="mh-scenario-preview__question"><strong>{questionLabel}</strong><span>{question}</span></div><div className="mh-scenario-preview__output"><pre>{output}</pre></div></div> : null}</div>;
}
