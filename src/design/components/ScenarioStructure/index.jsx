import "../../tokens.css";
import { Icon } from "../../icons.jsx";
import "./ScenarioStructure.css";

const structureIcons = {
  triggerWhen: "clock",
  input: "grid-four",
  logic: "bulb",
  output: "arrow-left",
  boundary: "alert-triangle",
};

/**
 * Five semantic parts of a scenario, without a heading or outer page section.
 * @param {object} props
 * @param {object} props.record Scenario values keyed by triggerWhen, input, logic, output and boundary.
 * @param {{key:"triggerWhen"|"input"|"logic"|"output"|"boundary",label:string}[]} props.fields Source-backed labels in the desired order.
 */
export function ScenarioStructure({ record, fields }) {
  return <div className="mh-scenario-structure">{fields.map((field) => <div className="mh-scenario-structure__item" key={field.key}><span className={`mh-scenario-structure__icon mh-scenario-structure__icon--${field.key}`}><Icon name={structureIcons[field.key]} /></span><div><strong>{field.label}</strong><p>{record[field.key]}</p></div></div>)}</div>;
}
