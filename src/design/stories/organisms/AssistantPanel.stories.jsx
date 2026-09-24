import React from "react";
import { AssistantPanel, assistantPlacements } from "../../organisms.jsx";
import { ASSISTANT, LITE_ASSISTANT, buildLiteAssistantAnswer } from "../../content.js";
import { useSynced } from "../story-helpers.js";

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
  args: { open: true, placement: "modal", showScopes: true, scope: "All", prompt: "" },
  argTypes: {
    placement: { control: "inline-radio", options: assistantPlacements },
    showScopes: { control: "boolean" },
    scope: { control: "select", options: ASSISTANT.scopes },
    onClose: { action: "onClose" },
    onSubmit: { action: "onSubmit" },
    onPromptChange: { action: "onPromptChange" },
    onSuggestion: { action: "onSuggestion" },
    onScopeChange: { action: "onScopeChange" },
  },
  render: function AskPanelStory(args) {
    const [open, setOpen] = useSynced(args.open);
    const [scope, setScope] = useSynced(args.scope);
    const [prompt, setPrompt] = useSynced(args.prompt);
    return (
      <AssistantPanel
        {...ASSISTANT}
        {...args}
        open={open}
        scope={scope}
        prompt={prompt}
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
        onScopeChange={(event) => {
          setScope(event.scope);
          args.onScopeChange?.(event);
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
  args: { open: true },
  argTypes: {
    open: { control: "boolean" },
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
        showPicks={false}
        enterToSubmit={false}
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
