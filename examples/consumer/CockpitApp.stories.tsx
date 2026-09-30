import { CockpitApp, demoData, type CockpitData } from "./CockpitApp.tsx";
import { ALT_COPILOT, ALT_GROUPS, ALT_KNOWLEDGE, ALT_PROJECTS } from "../../src/design/demo/__fixtures__/alt-cockpit.js";

export default {
  title: "Examples/Consumer cockpit",
  component: CockpitApp,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A Marketing Cockpit built the way a package consumer would (`examples/consumer/CockpitApp.tsx`): `MarketingCockpitPage` plus the app's own state. Two independent assistants on one page: the corner workspace assistant, and on a live report the Report Copilot, each with its own answers. The data comes in through the `data` prop.",
      },
    },
  },
  args: { data: demoData },
  argTypes: { data: { control: false } },
};

/** The demo's own catalog and Copilot content. */
export const Workspace = {};

/** Replacement data: a different catalog, knowledge and Copilot text, same page and interactions. */
export const ReplacementData = {
  args: { data: { projects: ALT_PROJECTS, groups: ALT_GROUPS, knowledge: ALT_KNOWLEDGE, detailsSections: [], copilot: ALT_COPILOT } as unknown as CockpitData },
};
