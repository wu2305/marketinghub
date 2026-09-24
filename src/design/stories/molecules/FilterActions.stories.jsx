import { FilterActions } from "../../molecules.jsx";
import { callbackProp, prop } from "../story-helpers.js";

export default {
  title: "Molecules/Filter actions",
  component: FilterActions,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Filter / Reset button pair for filter toolbars.",
      },
    },
  },
  args: { submitLabel: "Filter", resetLabel: "Reset" },
  argTypes: {
    submitLabel: prop("string", { defaultValue: "Filter", description: "Label on the submit button (type=submit)." }),
    resetLabel: prop("string", { defaultValue: "Reset", description: "Label on the reset button." }),
    onSubmit: callbackProp("onSubmit", "(event: { label: string }) => void", { label: "Filter" }, "Fired on Filter click — payload comes from Button."),
    onReset: callbackProp("onReset", "(event: { label: string }) => void", { label: "Reset" }, "Fired on Reset click — payload comes from Button."),
  },
  render: (args) => <FilterActions {...args} />,
};

export const Default = {};
