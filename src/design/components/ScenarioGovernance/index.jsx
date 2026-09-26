import "../../tokens.css";
import { Icon } from "../../icons.jsx";
import "./ScenarioGovernance.css";

export const scenarioGovernanceLayouts = ["stacked", "columns"];

const iconFor = {
  knowledgeId: "file",
  owner: "user",
  source: "layers",
  version: "clock",
  reviewStatus: "check-circle",
  usageCount: "chart",
  accuracyScore: "file",
  updated: "clock",
  user: "user",
};

function valueFor(record, key, userFallback) {
  if (key === "usageCount") return `${record.callCount} / ${record.callPeriod}`;
  if (key === "accuracyScore") return `${record.accuracyScore}%`;
  if (key === "user") return record.user || userFallback;
  return record[key];
}

/**
 * Nine fixed governance facts for a scenario. The parent owns section copy and frame.
 * @param {object} props
 * @param {object} props.record Scenario record with governance fields, callCount/callPeriod and accuracyScore.
 * @param {{key:"knowledgeId"|"owner"|"source"|"version"|"reviewStatus"|"usageCount"|"accuracyScore"|"updated"|"user",label:string}[]} props.fields Nine source-backed labels in display order.
 * @param {"stacked"|"columns"} [props.layout="stacked"] Drawer list or wide workspace grid.
 * @param {string} [props.userFallback=""] Visible value when the record has no user.
 */
export function ScenarioGovernance({ record, fields, layout = "stacked", userFallback = "" }) {
  return <div className={`mh-scenario-governance mh-scenario-governance--${layout}`}>{fields.map((field) => <div className="mh-scenario-governance__item" key={field.key}><Icon name={iconFor[field.key]} /><span className="mh-scenario-governance__label">{field.label}</span><strong className={`mh-scenario-governance__value ${field.key === "reviewStatus" ? `mh-scenario-governance__value--${record.reviewStatus.toLowerCase()}` : ""}`}>{valueFor(record, field.key, userFallback)}</strong></div>)}</div>;
}
