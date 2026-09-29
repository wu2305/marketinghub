import React from "react";
import { AssistantDock } from "./index.jsx";
import { assistantPlacements, assistantVariants } from "../AssistantPanel/index.jsx";
import { ASSISTANT, ASSISTANT_SKILL_MENU, MODEL_FLOW, buildCampaignAnswer, buildModelDraft } from "../../content.js";
import { useWorkspaceAssistantDemo } from "../../demo/workspace-assistant-demo.js";

export default {
  title: "Organisms/Assistant dock",
  component: AssistantDock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Launcher, assistant panel and model-creation dialog as one element, so a page wires the assistant once. Closed, only the launcher shows; opening it hides the launcher and shows the panel; the skill menu's model actions open the dialog. State here comes from the same `useWorkspaceAssistantDemo` container the pages use.",
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: assistantVariants },
    placement: { control: "inline-radio", options: assistantPlacements },
    tone: { control: "inline-radio", options: [undefined, "home"] },
    launcherLabel: { control: "text" },
    launcherHidden: { control: "boolean" },
    onLauncherOpen: { action: "onLauncherOpen" },
  },
  args: { variant: "campaign", placement: "drawer" },
  render: function DockStory({ assistant, ...args }) {
    const { assistant: state, skillFlow } = useWorkspaceAssistantDemo({
      variant: args.variant,
      assistant,
      demo: { answerFor: buildCampaignAnswer, modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft },
    });
    return (
      <div style={{ minHeight: 480 }}>
        <AssistantDock {...args} assistant={state} skillFlow={skillFlow} />
      </div>
    );
  },
};

export const Closed = { args: { assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU, open: false } } };

export const Open = { args: { assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU, open: true } } };

export const CustomLauncherLabel = { args: { assistant: { ...ASSISTANT, open: false }, launcherLabel: "Ask Cockpit" } };
