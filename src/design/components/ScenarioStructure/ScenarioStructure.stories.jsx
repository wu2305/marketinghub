import { ScenarioStructure } from "./index.jsx";
import { SKILL_LIBRARY } from "../../demo/content/skill-library.js";
import { prop } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Scenario structure",
  component: ScenarioStructure,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Five fixed scenario parts. The parent supplies the section heading and placement." } } },
  args: { record: SKILL_LIBRARY.records[0], fields: SKILL_LIBRARY.labels.structureFields },
  argTypes: {
    record: prop("ScenarioRecord", { description: "Values for the five structure parts.", control: "object" }),
    fields: prop("ScenarioStructureField[]", { description: "Five source-backed field labels in display order.", control: "object" }),
  },
  render: (args) => <div style={{ maxWidth: 650, padding: 16 }}><ScenarioStructure {...args} /></div>,
};

export const Default = {};
