import { Button } from "../Button/index.jsx";
import { ViewHeading } from "./index.jsx";
import { prop } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/View heading",
  component: ViewHeading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "In-page view heading; `children` render as trailing actions (e.g. Tabs or a Button).",
      },
    },
  },
  args: {
    eyebrow: "Campaign workspace / Overview",
    title: "Overview Dashboard",
    description: "Monitor automated media operations across accounts, plans, units, and creative assets.",
  },
  argTypes: {
    eyebrow: prop("string", { description: "Small kicker above the title." }),
    title: prop("React.ReactNode", { description: "Heading text.", control: "text" }),
    description: prop("React.ReactNode", { description: "Description paragraph under the title.", control: "text" }),
    children: prop("React.ReactNode", { description: "Trailing action slot — the story renders a Button.", control: false }),
  },
  render: (args) => (
    <ViewHeading {...args}>
      <Button variant="primary" size="sm">Create Campaign Task</Button>
    </ViewHeading>
  ),
};

export const Default = {};
