import { ScenarioGovernance, scenarioGovernanceLayouts } from "./index.jsx";
import { SKILL_LIBRARY } from "../../demo/content/skill-library.js";
import { enumProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Scenario governance",
  component: ScenarioGovernance,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Nine scenario governance facts, shared by the detail drawer and full workspace." } } },
  args: { record: SKILL_LIBRARY.records[0], fields: SKILL_LIBRARY.labels.governanceFields, layout: "stacked", userFallback: "Marketing Strategy Team" },
  argTypes: {
    record: prop("ScenarioRecord", { description: "Governance values and call/accuracy counts.", control: "object" }),
    fields: prop("ScenarioGovernanceField[]", { description: "Nine source-backed field labels in display order.", control: "object" }),
    layout: enumProp(scenarioGovernanceLayouts, "stacked", "Single-column drawer rows or two-column workspace grid.", "inline-radio"),
    userFallback: prop("string", { defaultValue: "", description: "Visible fallback when record.user is blank." }),
  },
  render: (args) => <div style={{ maxWidth: args.layout === "columns" ? 1000 : 520, padding: 16, background: "var(--mh-surface-subtle)" }}><ScenarioGovernance {...args} /></div>,
};

export const Default = {};
