import { ScenarioStructure } from "./index.jsx";
import { SKILL_LIBRARY } from "../../demo/content/skill-library.js";
import { prop, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Scenario structure",
  component: ScenarioStructure,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: bi("Five fixed scenario parts. The parent supplies the section heading and placement.", "固定的五个场景组成部分。区块标题和位置由父级提供。") } } },
  args: { record: SKILL_LIBRARY.records[0], fields: SKILL_LIBRARY.labels.structureFields },
  argTypes: {
    record: prop("ScenarioRecord", { description: bi("Values for the five structure parts.", "五个结构部分的取值。"), control: "object" }),
    fields: prop("ScenarioStructureField[]", { description: bi("Five source-backed field labels in display order.", "按显示顺序排列的五个源页面字段标签。"), control: "object" }),
  },
  render: (args) => <div style={{ maxWidth: 650, padding: 16 }}><ScenarioStructure {...args} /></div>,
};

export const Default = {};
