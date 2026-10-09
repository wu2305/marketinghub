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
    variant: { control: "inline-radio", options: assistantVariants, description: bi("Assistant panel preset. This value wins over `assistant.variant`.", "助手面板预设。这个值优先于 `assistant.variant`。") },
    placement: { control: "inline-radio", options: assistantPlacements, description: bi("`drawer` is the full-height panel on the right. `modal` is a centered dialog. This value wins over `assistant.placement`.", "`drawer` 是右侧全高面板。`modal` 是居中对话框。这个值优先于 `assistant.placement`。") },
    tone: { control: "inline-radio", options: [undefined, "home"], description: bi("Set `home` for the Home assistant tone. This value wins over `assistant.tone`.", "Home 助手用 `home`。这个值优先于 `assistant.tone`。") },
    launcherLabel: { control: "text", description: bi("Corner button label. If you leave it out (or pass `null`), the dock uses `assistant.launcherLabel`. An empty string is used as given and leaves the button blank.", "角落按钮的文字。省略（或传 `null`）时使用 `assistant.launcherLabel`。传空字符串时按空字符串显示，按钮会没有文字。") },
    launcherHidden: { control: "boolean", description: bi("Set true to hide the corner button while another overlay is open.", "设为 true 时，在其他覆盖层打开期间隐藏角落按钮。") },
    onLauncherOpen: { action: "onLauncherOpen", description: bi("The function runs when the corner button is pressed. It replaces `assistant.onOpen`: when you set it, the launcher calls only this function, so call `assistant.onOpen` yourself if the panel must still open. The result has `reason: \"open\"`. This story calls both, so the Actions panel logs the press and the panel still opens.", "按下角落按钮时会调用这个函数。它会替换 `assistant.onOpen`：设置后，启动器只调用这个函数，所以面板仍要打开时，你得自己调用 `assistant.onOpen`。结果里的 `reason` 是 `\"open\"`。本故事两个都调用，所以 Actions 面板会记录这次按下，面板也照常打开。") },
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
