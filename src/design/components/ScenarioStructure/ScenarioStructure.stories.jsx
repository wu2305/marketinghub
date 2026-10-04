import { ScenarioStructure } from "./index.jsx";
import { SKILL_LIBRARY } from "../../demo/content/skill-library.js";
import { prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Scenario structure",
  component: ScenarioStructure,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("This component shows five parts of one skill. The parts are trigger, input, logic, output, and boundary. The parent supplies the section heading and the placement. Skill Library and Scenario Detail use this component.", "这个组件显示一项技能的五个部分。这五部分是触发、输入、逻辑、输出和边界。区块标题和位置由父级提供。Skill Library 与 Scenario Detail 使用这个组件。") } } },
  args: { record: SKILL_LIBRARY.records[0], fields: SKILL_LIBRARY.labels.structureFields },
  argTypes: {
    record: prop("ScenarioRecord", { description: bi("Values for the five parts.", "五个部分的取值。"), control: "object" }),
    fields: prop("ScenarioStructureField[]", { description: bi("Five field labels in display order.", "按显示顺序排列的五个字段标签。"), control: "object" }),
  },
  render: (args) => <div style={{ maxWidth: 650, padding: 16 }}><ScenarioStructure {...args} /></div>,
};

export const Default = {};
