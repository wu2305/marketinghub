import React from "react";
import { ModelFlowDialog, modelFlowSteps } from "./index.jsx";
import { MODEL_FLOW, buildModelDraft } from "../../content.js";
import { bi } from "../../lib/story-helpers.js";

export default {
  title: "Organisms/Model flow dialog",
  component: ModelFlowDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          bi("This component is the Generate Analytical Model dialog. It opens from the assistant skill menu. Set `step` to `history` to show chat threads. Each message has a checkbox. A text area holds the generation rule. Generate needs at least one checked message. Set `step` to `generated` to show the filled model form. Set `step` to `manual` to show the same form empty. Save and Submit check required fields. The dialog then shows Saved or Submitted, and closes. Escape closes only this dialog. Focus returns to the opener.", "这个组件是 Generate Analytical Model 对话框。它从助手的技能菜单打开。`step` 设为 `history` 时，显示聊天会话。每条消息有复选框。文本域保存生成规则。Generate 至少需要勾选一条消息。`step` 设为 `generated` 时，显示已填好的模型表单。`step` 设为 `manual` 时，显示同一表单的空白版。Save 和 Submit 会检查必填字段。对话框随后显示 Saved 或 Submitted，然后关闭。Escape 只关闭这个对话框。焦点回到打开它的元素。"),
      },
    },
  },
};

export const Default = {
  args: { step: "history" },
  argTypes: {
    step: { control: "inline-radio", options: modelFlowSteps, description: bi("`history` shows chat threads. `generated` shows the filled model form. `manual` shows the same form empty.", "`history` 显示聊天会话。`generated` 显示已填好的模型表单。`manual` 显示同一表单的空白版。") },
    onToggleMessage: { action: "onToggleMessage", description: bi("The function runs when a message checkbox changes. The result has `threadIndex`, `messageIndex`, and `checked`.", "消息复选框变化时会调用这个函数。结果里有 `threadIndex`、`messageIndex` 和 `checked`。") },
    onRuleChange: { action: "onRuleChange", description: bi("The function runs at each change in the generation rule. The result has `value`.", "生成规则每次变化都会调用这个函数。结果里有 `value`。") },
    onGenerate: { action: "onGenerate", description: bi("The function runs on Generate. The result has `messages` and `rule`.", "点击 Generate 时会调用这个函数。结果里有 `messages` 和 `rule`。") },
    onBack: { action: "onBack", description: bi("The function runs on Back. The result has `reason: \"back\"`.", "点击 Back 时会调用这个函数。结果里的 `reason` 是 `\"back\"`。") },
    onClose: { action: "onClose", description: bi("The function runs when the dialog closes. The result has `reason`.", "对话框关闭时会调用这个函数。结果里有 `reason`。") },
    onSave: { action: "onSave", description: bi("The function runs on Save. The result has `values`.", "点击 Save 时会调用这个函数。结果里有 `values`。") },
    onSubmit: { action: "onSubmit", description: bi("The function runs on Submit. The result has `values`.", "点击 Submit 时会调用这个函数。结果里有 `values`。") },
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
