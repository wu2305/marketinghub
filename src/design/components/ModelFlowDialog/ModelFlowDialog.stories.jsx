import React from "react";
import { ModelFlowDialog, modelFlowSteps } from "./index.jsx";
import { MODEL_FLOW, buildModelDraft } from "../../content.js";

export default {
  title: "Organisms/Model flow dialog",
  component: ModelFlowDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          '"Generate Analytical Model" flow dialog reached from the skill menu. `step="history"` replays chat threads with per-message checkboxes and a generation-rule textarea; `step="generated"` shows the drafted model form; `step="manual"` shows the same form empty. Escape closes only this dialog and restores focus to its opener.',
      },
    },
  },
};

export const Default = {
  args: { step: "history" },
  argTypes: {
    step: { control: "inline-radio", options: modelFlowSteps },
    onToggleMessage: { action: "onToggleMessage" },
    onRuleChange: { action: "onRuleChange" },
    onGenerate: { action: "onGenerate" },
    onBack: { action: "onBack" },
    onClose: { action: "onClose" },
    onSave: { action: "onSave" },
    onSubmit: { action: "onSubmit" },
  },
  render: function ModelFlowStory(args) {
    const [step, setStep] = React.useState(args.step);
    React.useEffect(() => setStep(args.step), [args.step]);
    const [threads, setThreads] = React.useState(MODEL_FLOW.threads);
    const [rule, setRule] = React.useState("");
    const [draft, setDraft] = React.useState({});
    return (
      <ModelFlowDialog
        step={step}
        threads={threads}
        rule={rule}
        draft={draft}
        sections={MODEL_FLOW.sections}
        onToggleMessage={({ threadIndex, messageIndex, checked }) => {
          setThreads((current) =>
            current.map((thread, ti) =>
              ti === threadIndex
                ? { ...thread, messages: thread.messages.map((message, mi) => (mi === messageIndex ? { ...message, checked } : message)) }
                : thread,
            ),
          );
          args.onToggleMessage?.({ threadIndex, messageIndex, checked });
        }}
        onRuleChange={({ value }) => {
          setRule(value);
          args.onRuleChange?.({ value });
        }}
        onGenerate={(event) => {
          setDraft(buildModelDraft(event.messages, event.rule));
          setStep("generated");
          args.onGenerate?.(event);
        }}
        onBack={() => {
          setStep("history");
          args.onBack?.();
        }}
        onClose={(event) => {
          setStep(null);
          args.onClose?.(event);
        }}
        onSave={args.onSave}
        onSubmit={args.onSubmit}
      />
    );
  },
};
