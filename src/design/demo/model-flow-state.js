import React from "react";

/**
 * Deterministic state of the model-creation dialog: the manual or history
 * step, message selection, the rule text and the generated draft.
 * Private demo composition shared by the assistant hooks.
 * @param {object|null} [initial] flow state to start in (a story opens the dialog directly)
 * @returns {{ flow: object|null, setFlow: Function, start: (threads: object[], action?: string) => void, dialog: (draftFor: (messages: object[], rule: string) => object, extra?: object) => object|undefined }}
 */
export function useModelFlowState(initial = null) {
  const [flow, setFlow] = React.useState(initial);
  const start = (threads, action) =>
    setFlow({
      step: action === "history" ? "history" : "manual",
      threads: (threads || []).map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) })),
      rule: "",
      draft: {},
    });
  /** The dialog's props (`extra`: sections, labels and the Save/Submit callbacks), or undefined while closed. */
  const dialog = (draftFor, extra) =>
    flow
      ? {
          step: flow.step,
          threads: flow.threads,
          rule: flow.rule,
          draft: flow.draft,
          onToggleMessage: ({ threadIndex, messageIndex, checked }) =>
            setFlow((current) => ({
              ...current,
              threads: current.threads.map((thread, ti) =>
                ti === threadIndex
                  ? { ...thread, messages: thread.messages.map((message, mi) => (mi === messageIndex ? { ...message, checked } : message)) }
                  : thread,
              ),
            })),
          onRuleChange: ({ value }) => setFlow((current) => ({ ...current, rule: value })),
          onGenerate: ({ messages, rule }) => setFlow((current) => ({ ...current, step: "generated", rule, draft: draftFor(messages, rule) || {} })),
          onBack: () => setFlow((current) => ({ ...current, step: "history" })),
          onClose: () => setFlow(null),
          ...extra,
        }
      : undefined;
  return { flow, setFlow, start, dialog };
}
