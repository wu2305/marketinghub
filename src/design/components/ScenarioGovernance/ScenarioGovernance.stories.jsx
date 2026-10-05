import { ScenarioGovernance, scenarioGovernanceLayouts } from "./index.jsx";
import { SKILL_LIBRARY } from "../../demo/content/skill-library.js";
import { enumProp, prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Scenario governance",
  component: ScenarioGovernance,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("This component shows nine governance facts for one skill. The parent supplies the section heading and the frame. The Skill Library detail drawer uses a single column. Scenario Detail uses two columns.", "这个组件显示一项技能的九条治理信息。区块标题和外框由父级提供。Skill Library 的详情抽屉使用单列。Scenario Detail 使用两列。") } } },
  args: { record: SKILL_LIBRARY.records[0], fields: SKILL_LIBRARY.labels.governanceFields, layout: "stacked", userFallback: "Marketing Strategy Team" },
  argTypes: {
    record: prop("ScenarioRecord", { description: bi("Governance values, call counts, and the accuracy score.", "治理取值、调用次数和准确率。"), control: "object" }),
    fields: prop("ScenarioGovernanceField[]", { description: bi("Nine field labels in display order.", "按显示顺序排列的九个字段标签。"), control: "object" }),
    layout: enumProp(scenarioGovernanceLayouts, "stacked", bi("`stacked` is one column. `columns` is two columns.", "`stacked` 是单列。`columns` 是两列。"), "inline-radio"),
    userFallback: prop("string", { defaultValue: "", description: bi("Visible text when `record.user` is empty.", "`record.user` 为空时显示的文字。") }),
  },
  render: (args) => <div style={{ maxWidth: args.layout === "columns" ? 1000 : 520, padding: 16, background: "var(--mh-surface-subtle)" }}><ScenarioGovernance {...args} /></div>,
};

export const Default = {};
