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
    placement: { control: "inline-radio", options: assistantPlacements },
    variant: { control: "inline-radio", options: assistantVariants },
    answerVariant: { control: "select", options: assistantAnswerVariants, description: bi("This control only changes the answer card in this story. Submit still uses `onSubmit`.", "这个控件只改变本故事里的回答卡片。提交仍然使用 `onSubmit`。") },
    onClose: { action: "onClose" },
    onSubmit: { action: "onSubmit" },
    onPromptChange: { action: "onPromptChange" },
    onSuggestion: { action: "onSuggestion" },
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
    open: { control: "boolean" },
    variant: { control: "inline-radio", options: assistantVariants },
    onClose: { action: "onClose" },
    onSubmit: { action: "onSubmit" },
    onAttach: { action: "onAttach" },
    onSelectSkill: { action: "onSelectSkill" },
    onClearSkill: { action: "onClearSkill" },
    onSkillAction: { action: "onSkillAction" },
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
