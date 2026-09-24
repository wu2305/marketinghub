import { controlSizes } from "../Button/index.jsx";
import { SearchField, searchIconPositions, searchVariants } from "./index.jsx";
import { callbackProp, enumProp, prop, useSynced } from "../../lib/story-helpers.js";

export default {
  title: "Molecules/Search field",
  component: SearchField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Labeled search input with an icon that can lead, trail, or be omitted.",
      },
    },
  },
  args: { label: "Search dashboards", placeholder: "Search dashboards", value: "", size: "lg", variant: "field", icon: "end" },
  argTypes: {
    label: prop("string", { defaultValue: "Search", description: "Accessible label (visually hidden)." }),
    name: prop("string", { description: "Field name echoed in the onChange payload." }),
    value: prop("string", { description: "Controlled value — omit for uncontrolled." }),
    placeholder: prop("string", { defaultValue: "Search", description: "Placeholder text." }),
    size: enumProp(controlSizes, "md", "Control height.", "inline-radio"),
    variant: enumProp(searchVariants, "field", '"plain" is the original `.overview-global-search` gold pill.', "inline-radio"),
    icon: enumProp(searchIconPositions, "start", "Icon position, or none.", "inline-radio"),
    inputRef: prop("React.Ref<HTMLInputElement>", { description: "Forwarded to the input element.", control: false }),
    onChange: callbackProp(
      "onChange",
      "(event: { name: string, value: string }) => void",
      { name: "query", value: "AUDIT" },
      "Fired on every edit.",
    ),
  },
  render: function SearchFieldStory(args) {
    const [value, setValue] = useSynced(args.value);
    return (
      <div style={{ width: args.variant === "plain" ? 520 : 360 }}>
        <SearchField
          {...args}
          value={value}
          onChange={(event) => {
            setValue(event.value);
            args.onChange?.(event);
          }}
        />
      </div>
    );
  },
};

export const Default = {};
