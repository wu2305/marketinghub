import "../../tokens.css";
import { Icon } from "../../icons.jsx";
import "./ScenarioStructure.css";

const structureIcons = {
  triggerWhen: { path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2" },
  input: { name: "grid-four" },
  logic: { name: "bulb" },
  output: { name: "arrow-left" },
  boundary: { path: "M12 9v2m0 4h.01M10.268 4 3.34 16c-.77 1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0Z" },
};

/**
 * Five semantic parts of a scenario, without a heading or outer page section.
 * @param {object} props
 * @param {object} props.record Scenario values keyed by triggerWhen, input, logic, output and boundary.
 * @param {{key:"triggerWhen"|"input"|"logic"|"output"|"boundary",label:string}[]} props.fields Source-backed labels in the desired order.
 */
export function ScenarioStructure({ record, fields }) {
  return <div className="mh-scenario-structure">{fields.map((field) => <div className="mh-scenario-structure__item" key={field.key}><span className={`mh-scenario-structure__icon mh-scenario-structure__icon--${field.key}`}><Icon {...structureIcons[field.key]} /></span><div><strong>{field.label}</strong><p>{record[field.key]}</p></div></div>)}</div>;
}
