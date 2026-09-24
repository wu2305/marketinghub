import { CategoryHeading } from "../../molecules.jsx";
import { prop } from "../story-helpers.js";

export default {
  title: "Molecules/Category heading",
  component: CategoryHeading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Mid-page category heading (h2).",
      },
    },
  },
  args: { title: "D2C Insight" },
  argTypes: {
    title: prop("React.ReactNode", { description: "Heading text.", control: "text" }),
    id: prop("string", { description: "Heading id, for aria-labelledby on the section it leads." }),
  },
  render: (args) => <CategoryHeading {...args} />,
};

export const Default = {};
