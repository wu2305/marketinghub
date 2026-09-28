import { LibraryItem } from "./index.jsx";
import { callbackProp, prop } from "../../lib/story-helpers.js";
import { records, toItem } from "../../lib/library-story-data.js";

export default {
  title: "Organisms/Library/LibraryItem",
  component: LibraryItem,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "One card in a governed library. The title is the card's button; a click anywhere outside other controls also opens it. `children` is the single slot for view-specific content." } } },
  args: toItem(records[1]),
  argTypes: {
    title: prop("string", { description: "Item name; also the open button." }),
    draft: prop("boolean", { defaultValue: false, description: "Shows the Draft marker." }),
    selected: prop("boolean", { defaultValue: false, description: "The item the surrounding view currently shows (e.g. the Data Model domain in the browser)." }),
    description: prop("string", { description: "Clamped to two lines." }),
    meta: prop("Array<{ label, value }>", { description: "Label/value pairs under the description." }),
    status: prop("{ status, tone?, label? }", { description: "StatusBadge content." }),
    actions: prop("ItemActions props", { description: "Omit to hide actions (views without `manage`)." }),
    children: prop("React.ReactNode", { description: "View-specific content the pattern keeps." }),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "aov" }, "Title button or card click."),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "disable", id: "aov", blocked: false, reason: null }, "From ItemActions."),
  },
  render: (args) => <div style={{ maxWidth: 420 }}><LibraryItem {...args} /></div>,
};

export const Enabled = {};
export const Disabled = { args: toItem(records[0]) };
export const Draft = { args: toItem(records[2]) };
export const OtherCreator = { name: "Created by others", args: toItem(records[3]) };
export const Selected = { args: { ...toItem(records[1]), actions: undefined, selected: true } };
export const ReadOnly = { name: "Without actions", args: { ...toItem(records[1]), actions: undefined } };
export const WithExtraContent = {
  name: "With view-specific content",
  args: { ...toItem(records[1]), children: <span style={{ fontSize: "var(--mh-font-size-sm)", color: "var(--mh-text-muted)" }}>Synonyms: basket size, ticket size</span> },
};
