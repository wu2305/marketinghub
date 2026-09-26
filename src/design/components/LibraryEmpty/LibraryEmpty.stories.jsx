import { LibraryEmpty, libraryEmptyKinds } from "./index.jsx";
import { callbackProp, enumProp, prop } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Library/LibraryEmpty",
  component: LibraryEmpty,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Empty state of a governed library: filters hid everything (offers to clear them), or nothing exists yet." } } },
  args: { kind: "no-results", title: "No matching terms", message: "Try another keyword or clear the filters.", clearLabel: "Clear filters" },
  argTypes: {
    kind: enumProp(libraryEmptyKinds, "no-results", "Why the list is empty.", "inline-radio"),
    title: prop("string", { description: "Headline." }),
    message: prop("string", { description: "Supporting sentence." }),
    clearLabel: prop("string", { defaultValue: "Clear filters", description: "no-results only." }),
    onClear: callbackProp("onClear", "(event: { kind }) => void", { kind: "no-results" }, "Clears search and facets; omit to hide the button."),
  },
};

export const NoResults = {};
export const NothingYet = { args: { kind: "empty", title: "No business terms yet", message: "Terms you create appear here." } };
