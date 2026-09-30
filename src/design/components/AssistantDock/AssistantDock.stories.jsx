import React from "react";
import { AssistantDock } from "./index.jsx";
import { assistantPlacements, assistantVariants } from "../AssistantPanel/index.jsx";
import { ASSISTANT, ASSISTANT_SKILL_MENU, MODEL_FLOW, buildCampaignAnswer, buildModelDraft } from "../../content.js";
import { useWorkspaceAssistantDemo } from "../../demo/workspace-assistant-demo.js";
import { bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Assistant dock",
  component: AssistantDock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          bi("Launcher, assistant panel and model-creation dialog as one element, so a page wires the assistant once. Closed, only the launcher shows; opening it hides the launcher and shows the panel; the skill menu's model actions open the dialog. State here comes from the same `useWorkspaceAssistantDemo` container the pages use.", "启动器、助手面板和建模对话框合为一个元素，页面只需接线一次助手。关闭时只显示启动器；打开后隐藏启动器并显示面板；技能菜单中的建模操作会打开对话框。这里的状态来自页面所用的同一个 `useWorkspaceAssistantDemo` 容器。"),
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
  render: function DockStory({ assistant, initialFlow, onLauncherOpen, ...args }) {
    const { assistant: state, skillFlow } = useWorkspaceAssistantDemo({
      variant: args.variant,
      assistant,
      initial: { flow: initialFlow },
      demo: { answerFor: buildCampaignAnswer, modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft },
    });
    // The Actions panel injects an `onLauncherOpen` spy; passed straight through it
    // would replace the demo's `onOpen` and the launcher could never open the panel.
    const openAndLog = (event) => {
      onLauncherOpen?.(event);
      state.onOpen?.(event);
    };
    return (
      <div style={{ minHeight: 480 }}>
        <AssistantDock {...args} assistant={state} skillFlow={skillFlow} onLauncherOpen={openAndLog} />
      </div>
    );
  },
};

export const Closed = { args: { assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU, open: false } } };

export const Open = { args: { assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU, open: true } } };

// `initialFlow` is the state the skill menu's "create model" action sets; starting from
// it keeps the dialog reachable here without a play function clicking through the menu.
export const ModelDialog = {
  args: {
    assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU, open: true },
    initialFlow: { step: "manual", threads: MODEL_FLOW.threads, rule: "", draft: {} },
  },
};
