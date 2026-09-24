import { SectionHeading, headingLevels } from "./index.jsx";
import { enumProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Section heading",
  component: SectionHeading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Section heading with optional eyebrow and trailing description.",
      },
    },
  },
  args: {
    eyebrow: "Workspaces",
    title: "Enter the work that matters",
    description: "Start from execution, reports, or the knowledge behind every answer.",
  },
  argTypes: {
    eyebrow: prop("string", { description: "Small kicker above the title." }),
    title: prop("React.ReactNode", { description: "Heading text.", control: "text" }),
    description: prop("React.ReactNode", { description: "Trailing description paragraph.", control: "text" }),
    as: enumProp(headingLevels, "h2", "Heading level element.", "inline-radio"),
  },
  render: (args) => <SectionHeading {...args} />,
};

export const Default = {};
