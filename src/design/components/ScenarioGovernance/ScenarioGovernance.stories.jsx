import { ScenarioGovernance, scenarioGovernanceLayouts } from "./index.jsx";
import { SKILL_LIBRARY } from "../../demo/content/skill-library.js";
import { enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Scenario governance",
  component: ScenarioGovernance,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("Nine scenario governance facts, shared by the detail drawer and full workspace.", "九项场景治理信息，由详情抽屉与完整工作区共用。") } } },
  args: { record: SKILL_LIBRARY.records[0], fields: SKILL_LIBRARY.labels.governanceFields, layout: "stacked", userFallback: "Marketing Strategy Team" },
  argTypes: {
    record: prop("ScenarioRecord", { description: bi("Governance values and call/accuracy counts.", "治理取值及调用/准确率计数。"), control: "object" }),
    fields: prop("ScenarioGovernanceField[]", { description: bi("Nine source-backed field labels in display order.", "按显示顺序排列的九个源页面字段标签。"), control: "object" }),
    layout: enumProp(scenarioGovernanceLayouts, "stacked", bi("Single-column drawer rows or two-column workspace grid.", "单列的抽屉行布局，或两列的工作区网格布局。"), "inline-radio"),
    userFallback: prop("string", { defaultValue: "", description: bi("Visible fallback when record.user is blank.", "`record.user` 为空时显示的回退文字。") }),
  },
  render: (args) => <div style={{ maxWidth: args.layout === "columns" ? 1000 : 520, padding: 16, background: "var(--mh-surface-subtle)" }}><ScenarioGovernance {...args} /></div>,
};

export const Default = {};
