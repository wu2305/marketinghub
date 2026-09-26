import "../../tokens.css";
import { Icon } from "../../icons.jsx";
import "./ScenarioPreview.css";

const eyeOffPath = "M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 0 1 1.574-2.99M9.88 9.88l-3.29-3.29m7.532 7.532 3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.542 7a10.058 10.058 0 0 1-3.704 4.976m0 0L21 21";

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
  return <div className="mh-scenario-preview"><div className="mh-scenario-preview__head"><h3>{title}</h3><button type="button" aria-expanded={open} onClick={() => onChange?.({ open: !open })}>{open ? <Icon path={eyeOffPath} /> : <Icon name="eye" />}{open ? hideLabel : showLabel}</button></div>{open ? <div className="mh-scenario-preview__body"><div className="mh-scenario-preview__question"><strong>{questionLabel}</strong><span>{question}</span></div><div className="mh-scenario-preview__output"><pre>{output}</pre></div></div> : null}</div>;
}
