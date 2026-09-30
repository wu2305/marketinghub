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
          bi("Assistant dialog. `placement=\"drawer\"` renders the right-edge full-height variant used on Home; \"modal\" is the centered variant. Renders nothing when `open` is false. Reachable states mirror the original runtime: suggestion/history items fill the prompt, submit appends entries to the answer feed, the expand button toggles the drawer into a centered dialog, the history button opens a popover, Escape closes the panel, and focus returns to the invoking element on close.", "助手对话框。`placement=\"drawer\"` 是 Home 页使用的右侧全高抽屉形态；\"modal\" 是居中弹窗形态。`open` 为 false 时不渲染。可达状态与原始 Demo 一致：点击建议或历史条目会填入提示词，提交会向回答列表追加条目，展开按钮在抽屉与居中对话框之间切换，历史按钮打开气泡，Escape 关闭面板，关闭后焦点回到触发元素。"),
      },
    },
  },
};

export const AskPanel = {
  args: { open: true, placement: "drawer", variant: "campaign", answerVariant: "default", prompt: "" },
  argTypes: {
    placement: { control: "inline-radio", options: assistantPlacements },
    variant: { control: "inline-radio", options: assistantVariants },
    answerVariant: { control: "select", options: assistantAnswerVariants, description: bi("Story preview of answer.variant; submitting still uses onSubmit.", "在故事中预览 answer.variant；提交仍然使用 onSubmit。") },
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
