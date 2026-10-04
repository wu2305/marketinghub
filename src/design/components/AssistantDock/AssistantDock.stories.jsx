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
          bi("This component is the page assistant. It holds the corner button, the assistant panel, and the model dialog. A page mounts this component once. When the panel is closed, only the button shows. When the panel is open, the button is hidden. A model action in the skill menu opens the dialog. When the panel closes, focus returns to the button. The story uses `useWorkspaceAssistantDemo`. Pages use the same container.", "这个组件是页面上的助手。它包含角落按钮、助手面板和建模对话框。页面只需挂载一次。面板关闭时只显示按钮。面板打开时按钮隐藏。技能菜单里的建模操作会打开对话框。面板关闭后，焦点回到按钮。这个故事使用 `useWorkspaceAssistantDemo`。页面使用同一个容器。"),
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
