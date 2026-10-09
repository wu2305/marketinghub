import React from "react";
import { AssistantPanel, assistantAnswerVariants, assistantPlacements, assistantVariants } from "./index.jsx";
import { ASSISTANT, LITE_ASSISTANT, buildAssistantAnswer, buildCampaignAnswer, buildLiteAssistantAnswer, buildReportAssistantAnswer } from "../../content.js";
import { useSynced, bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Assistant panel",
  component: AssistantPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          bi("This component is the assistant dialog. Set `placement` to `drawer` for the full-height panel on the right. Home uses that layout. Set `placement` to `modal` for a centered dialog. If `open` is false, the component shows nothing. A suggestion or a history item fills the prompt. Submit sends the prompt. The expand control switches the drawer to a centered dialog. The history control opens a list. Escape closes the panel. When the panel closes, focus returns to the opener.", "这个组件是助手对话框。`placement` 设为 `drawer` 时，是右侧全高面板。Home 使用这种布局。`placement` 设为 `modal` 时，是居中对话框。`open` 为 false 时，组件不显示任何内容。建议或历史条目会填入提示词。提交会送出提示词。展开控件把抽屉换成居中对话框。历史控件打开列表。Escape 关闭面板。面板关闭后，焦点回到打开它的元素。"),
      },
    },
  },
};

export const AskPanel = {
  args: { open: true, placement: "drawer", variant: "campaign", answerVariant: "default", prompt: "" },
  argTypes: {
    placement: { control: "inline-radio", options: assistantPlacements, description: bi("`drawer` is the full-height panel on the right. `modal` is a centered dialog.", "`drawer` 是右侧全高面板。`modal` 是居中对话框。") },
    variant: { control: "inline-radio", options: assistantVariants, description: bi("Assistant behavior preset.", "助手行为预设。") },
    answerVariant: { control: "select", options: assistantAnswerVariants, description: bi("This control only changes the answer card in this story. Submit still uses `onSubmit`.", "这个控件只改变本故事里的回答卡片。提交仍然使用 `onSubmit`。") },
    onClose: { action: "onClose", description: bi("The function runs when the panel closes. The result has `reason`: `\"backdrop\"`, `\"escape\"`, or `\"button\"`.", "面板关闭时会调用这个函数。结果里的 `reason` 是 `\"backdrop\"`、`\"escape\"` 或 `\"button\"`。") },
    onSubmit: { action: "onSubmit", description: bi("The function runs when the user sends a prompt. The result has `prompt`.", "用户发送提示时会调用这个函数。结果里有 `prompt`。") },
    onPromptChange: { action: "onPromptChange", description: bi("The function runs at each change in the composer. The result has `name` and `value`.", "输入框每次变化都会调用这个函数。结果里有 `name` 和 `value`。") },
    onSuggestion: { action: "onSuggestion", description: bi("The function runs when the user selects a suggestion. The result has `prompt`.", "用户选择一条建议时会调用这个函数。结果里有 `prompt`。") },
    onHistorySelect: { action: "onHistorySelect", description: bi("The function runs when the user picks a history item. The result has `label` and `prompt`. This story puts the prompt into the composer.", "用户选择一条历史记录时会调用这个函数。结果里有 `label` 和 `prompt`。本故事会把这条提示词放进输入框。") },
  },
  render: function AskPanelStory(args) {
    const [open, setOpen] = useSynced(args.open);
    const [prompt, setPrompt] = useSynced(args.prompt);
    const query = "What's the ROI trend across my active campaigns?";
    const answerByVariant = {
      default: buildAssistantAnswer(query),
      compact: buildReportAssistantAnswer(query),
      workspace: buildCampaignAnswer(query),
      simple: buildLiteAssistantAnswer(query),
    };
    return (
      <AssistantPanel
        {...ASSISTANT}
        {...args}
        open={open}
        prompt={prompt}
        answers={[answerByVariant[args.answerVariant]]}
        onClose={(event) => {
          setOpen(false);
          args.onClose?.(event);
        }}
        onPromptChange={(event) => {
          setPrompt(event.value);
          args.onPromptChange?.(event);
        }}
        onSuggestion={(event) => {
          setPrompt(event.prompt);
          args.onSuggestion?.(event);
        }}
        onHistorySelect={(event) => {
          setPrompt(event.prompt);
          args.onHistorySelect?.(event);
        }}
        onSubmit={(event) => {
          setPrompt("");
          args.onSubmit?.(event);
        }}
      />
    );
  },
};

export const LiteAskPanel = {
  args: { open: true, variant: "lite" },
  argTypes: {
    open: { control: "boolean", description: bi("Set true to show the panel.", "设为 true 时显示面板。") },
    variant: { control: "inline-radio", options: assistantVariants, description: bi("Assistant behavior preset. This story uses `lite`.", "助手行为预设。这个故事使用 `lite`。") },
    onClose: { action: "onClose", description: bi("The function runs when the panel closes.", "面板关闭时会调用这个函数。") },
    onSubmit: { action: "onSubmit", description: bi("The function runs when the user sends a prompt. The result has `prompt`.", "用户发送提示时会调用这个函数。结果里有 `prompt`。") },
    onAttach: { action: "onAttach", description: bi("The function runs after the user picks files in Upload File. The result has `names`.", "用户在 Upload File 里选完文件后，会调用这个函数。结果里有 `names`。") },
    onSelectSkill: { action: "onSelectSkill", description: bi("The function runs when the user selects a skill. The result has `type` and `title`. `id` is present when the skill has one.", "用户选择一项技能时，会调用这个函数。结果里有 `type` 和 `title`。技能有 `id` 时，结果里也会带上。") },
    onClearSkill: { action: "onClearSkill", description: bi("The function runs when the user clears the selected skill.", "用户清除已选技能时，会调用这个函数。") },
    onSkillAction: { action: "onSkillAction", description: bi("The function runs when the user starts a model action. The result has `action`: `\"history\"` or `\"manual\"`.", "用户启动一项建模操作时，会调用这个函数。结果里的 `action` 是 `\"history\"` 或 `\"manual\"`。") },
  },
  render: function LiteAskPanelStory(args) {
    const [open, setOpen] = useSynced(args.open);
    const [prompt, setPrompt] = React.useState("");
    const [answers, setAnswers] = React.useState([]);
    const [skill, setSkill] = React.useState(null);
    return (
      <AssistantPanel
        {...LITE_ASSISTANT}
        {...args}
        open={open}
        placement="drawer"
        prompt={prompt}
        answers={answers}
        selectedSkill={skill}
        onClose={() => {
          setOpen(false);
          args.onClose?.();
        }}
        onPromptChange={(event) => setPrompt(event.value)}
        onSuggestion={(event) => setPrompt(event.prompt)}
        onHistorySelect={(event) => setPrompt(event.prompt)}
        onNewSession={() => {
          setAnswers([]);
          setPrompt("");
        }}
        onSubmit={(event) => {
          const text = String(event.prompt || "").trim();
          if (text) {
            setAnswers([buildLiteAssistantAnswer(text)]);
            setPrompt("");
          }
          args.onSubmit?.(event);
        }}
        onAttach={args.onAttach}
        onSelectSkill={(event) => {
          setSkill(event);
          args.onSelectSkill?.(event);
        }}
        onClearSkill={() => {
          setSkill(null);
          args.onClearSkill?.();
        }}
        onSkillAction={args.onSkillAction}
      />
    );
  },
};
