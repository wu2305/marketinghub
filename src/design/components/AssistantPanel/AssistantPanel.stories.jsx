import React from "react";
import { AssistantPanel, assistantAnswerVariants, assistantPlacements, assistantVariants } from "./index.jsx";
import { ASSISTANT, LITE_ASSISTANT, buildAssistantAnswer, buildCampaignAnswer, buildLiteAssistantAnswer, buildReportAssistantAnswer } from "../../content.js";
import { useSynced } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Assistant panel",
  component: AssistantPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Assistant dialog. `placement="drawer"` renders the right-edge full-height variant used on Home; "modal" is the centered variant. Renders nothing when `open` is false. Reachable states mirror the original runtime: suggestion/history items fill the prompt, submit appends entries to the answer feed, the expand button toggles the drawer into a centered dialog, the history button opens a popover, Escape closes the panel, and focus returns to the invoking element on close.',
      },
    },
  },
};

export const AskPanel = {
  args: { open: true, placement: "drawer", variant: "campaign", answerVariant: "default", prompt: "" },
  argTypes: {
    placement: { control: "inline-radio", options: assistantPlacements },
    variant: { control: "inline-radio", options: assistantVariants },
    answerVariant: { control: "select", options: assistantAnswerVariants, description: "Story preview of answer.variant; submitting still uses onSubmit." },
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
