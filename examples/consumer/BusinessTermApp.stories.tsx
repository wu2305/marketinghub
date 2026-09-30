import { BusinessTermApp, seedTerms } from "./BusinessTermApp.tsx";

export default {
  title: "Examples/Consumer business term",
  component: BusinessTermApp,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A Business Term workspace built the way a package consumer would: only the public components, `governedActions` and content constants, with all state and rules in the app itself (`examples/consumer/BusinessTermApp.tsx`). Add a term, save it, edit it, disable or delete it: the screens and results match the demo's Business Term library and form.",
      },
    },
  },
  argTypes: {
    currentUser: { control: "select", options: [...new Set(seedTerms.map((term) => term.creator))] },
  },
};

export const Workspace = {};
