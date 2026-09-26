import "../../tokens.css";
import { Icon } from "../../icons.jsx";
import "./ScenarioGovernance.css";

export const scenarioGovernanceLayouts = ["stacked", "columns"];

const iconFor = {
  knowledgeId: { name: "file" },
  owner: { path: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" },
  source: { name: "layers" },
  version: { path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2" },
  reviewStatus: { name: "check-circle" },
  usageCount: { name: "chart" },
  accuracyScore: { name: "file" },
  updated: { path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2" },
  user: { path: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" },
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
 * @param {{key:string,label:string}[]} props.fields Nine source-backed labels in display order.
 * @param {"stacked"|"columns"} [props.layout="stacked"] Drawer list or wide workspace grid.
 * @param {string} [props.userFallback=""] Visible value when the record has no user.
 */
export function ScenarioGovernance({ record, fields, layout = "stacked", userFallback = "" }) {
  return <div className={`mh-scenario-governance mh-scenario-governance--${layout}`}>{fields.map((field) => <div className="mh-scenario-governance__item" key={field.key}><Icon {...iconFor[field.key]} /><span className="mh-scenario-governance__label">{field.label}</span><strong className={`mh-scenario-governance__value ${field.key === "reviewStatus" ? `mh-scenario-governance__value--${record.reviewStatus.toLowerCase()}` : ""}`}>{valueFor(record, field.key, userFallback)}</strong></div>)}</div>;
}
