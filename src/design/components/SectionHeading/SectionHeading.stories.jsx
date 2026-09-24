import React from "react";
import { Button } from "../Button/index.jsx";
import { SectionHeading, headingLevels, sectionHeadingVariants } from "./index.jsx";
import { enumProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Section heading",
  component: SectionHeading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Section heading: eyebrow + title + optional description and trailing content. `variant=\"home\"` right-aligns (or stacks) the description; `variant=\"view\"` puts the description under the title, adds a bottom border and renders `children` as trailing actions.",
      },
    },
  },
  args: {
    variant: "home",
    eyebrow: "Workspaces",
    title: "Enter the work that matters",
    description: "Start from execution, reports, or the knowledge behind every answer.",
  },
  argTypes: {
    variant: enumProp(sectionHeadingVariants, "home", "Layout variant: \"home\" right-aligns the description; \"view\" adds a bottom border and a trailing action slot.", "inline-radio"),
    eyebrow: prop("string", { description: "Small kicker above the title." }),
    title: prop("React.ReactNode", { description: "Heading text.", control: "text" }),
    description: prop("React.ReactNode", { description: "Description paragraph — right-aligned in \"home\", under the title in \"view\".", control: "text" }),
    as: enumProp(headingLevels, "h2", "Heading level element.", "inline-radio"),
    children: prop("React.ReactNode", { description: "Optional trailing action slot (view variant carries e.g. a Button or Tabs).", control: false }),
  },
  render: (args) => <SectionHeading {...args} />,
};

export const Default = {};

/* The "view" form as used by the Campaign page: description under the
   title, bottom border, and a trailing action. */
export const View = {
  args: {
    variant: "view",
    eyebrow: "Campaign workspace / Overview",
    title: "Overview Dashboard",
    description: "Monitor automated media operations across accounts, plans, units, and creative assets.",
  },
  render: (args) => (
    <SectionHeading {...args}>
      <Button variant="primary" size="sm">Create Campaign Task</Button>
    </SectionHeading>
  ),
};
