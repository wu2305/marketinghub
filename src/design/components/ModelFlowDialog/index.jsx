import "../../tokens.css";
import React from "react";
import { cx } from "../../cx.js";
import { useOverlayLayer } from "../../lib/overlay.js";
import { useFocusFirstInvalid } from "../../lib/focus-first-invalid.js";
import "./ModelFlowDialog.css";


/** @type {readonly ["history", "generated", "manual"]} */
export const modelFlowSteps = ["history", "generated", "manual"];

const MODEL_FLOW_LABELS = {
  historyTitle: "Generate Analytical Model",
  historySubtitle: "Select conversations and describe the generation rule for the analysis logic.",
  selectLabel: "1 · Select Conversations",
  ruleLabel: "2 · Generation Rule",
  optionalLabel: "optional",
  rulePlaceholder:
    "Describe how AI should distill the analysis logic, for example: focus on the channel dimension and keep only the driver with the strongest evidence.",
  emptyError: "Select at least one message to continue.",
  generatedTitle: "New Analytical Model",
  generatedSubtitle: "Generated from selected conversations and your generation rule.",
  generatedSubtitlePlain: "Generated from selected conversations.",
  generatedNotice: "Submit will send this knowledge for review.",
  manualTitle: "Create Analytical Model Manually",
  manualSubtitle: "Draft the model fields and submit them for review.",
  cancelLabel: "Cancel",
  generateLabel: "Generate",
  backLabel: "← Back",
  saveLabel: "Save",
  submitLabel: "Submit",
  savedLabel: "Saved",
  submittedLabel: "Submitted",
};

const MODEL_FLOW_SECTIONS = [
  {
    title: "Basic Information",
    fields: [
      { key: "name", label: "Name", required: true, placeholder: "Enter analytical model name" },
      { key: "description", label: "Description", textarea: true, placeholder: "Describe what this model helps interpret" },
      { key: "trigger", label: "Trigger When", required: true, textarea: true, placeholder: "Describe when AI should use this model" },
    ],
  },
  {
    title: "Metrics",
    fields: [
      { key: "domain", label: "Business Domain", placeholder: "Campaign Performance; Customer Conversion" },
      { key: "metrics", label: "Referenced Metrics", placeholder: "ROI; Conversion Rate; Spend" },
    ],
  },
  {
    title: "Structure & Guidance",
    fields: [
      { key: "structure", label: "Structure & Guidance", required: true, textarea: true, tall: true, placeholder: "Write the step-by-step interpretation logic" },
    ],
  },
  {
    title: "Constraints",
    fields: [
      { key: "constraints", label: "Prohibited Analysis Directions", textarea: true, placeholder: "Add limits, warnings, or blocked analysis directions" },
    ],
  },
];

/**
 * "Generate Analytical Model" flow dialog reached from the skill menu.
 * `step="history"` replays chat threads with per-message checkboxes and a
 * generation-rule textarea; Generate requires at least one ticked message.
 * `step="generated"` and `step="manual"` show the same model form with
 * different titles; only `generated` has Back (it returns to the history step
 * with ticks and rule preserved). Neither step fills or clears the fields, the
 * initial values come from `draft`. Save/Submit validate required fields, then flash Saved/Submitted and
 * close after ~450ms — matching the demo's deterministic simulation.
 * @param {object} props
 * @param {typeof modelFlowSteps[number]} [props.step] falsy renders nothing
 * @param {Array<{ title: string, messages: Array<{ role: "user"|"ai", text: string, label?: string, title?: string, sources?: string[], checked?: boolean }> }>} [props.threads=[]]
 * @param {string} [props.rule=""] persisted generation rule (survives Back)
 * @param {object} [props.draft={}] field values for generated/manual steps, keyed by field key
 * @param {Array<{ title: string, fields: Array<{ key: string, label: string, required?: boolean, textarea?: boolean, tall?: boolean, placeholder?: string }> }>} [props.sections]
 * @param {object} [props.labels={}] copy overrides merged over the demo strings
 * @param {(event: { threadIndex: number, messageIndex: number, checked: boolean }) => void} [props.onToggleMessage]
 * @param {(event: { value: string }) => void} [props.onRuleChange]
 * @param {(event: { messages: Array<object>, rule: string }) => void} [props.onGenerate]
 * @param {(event: { reason: "back" }) => void} [props.onBack]
 * @param {(event: { reason: "button"|"cancel"|"escape"|"save"|"submit" }) => void} [props.onClose]
 * @param {boolean} [props.submitFirst=false] report variant orders Submit before Save
 * @param {(event: { values: object }) => void} [props.onSave]
 * @param {(event: { values: object }) => void} [props.onSubmit]
 */
export function ModelFlowDialog({
  step,
  threads = [],
  rule = "",
  draft = {},
  sections = MODEL_FLOW_SECTIONS,
  labels = {},
  submitFirst = false,
  onToggleMessage,
  onRuleChange,
  onGenerate,
  onBack,
  onClose,
  onSave,
  onSubmit,
}) {
  const copy = { ...MODEL_FLOW_LABELS, ...labels };
  const titleId = React.useId();
  const layerRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const formRef = React.useRef(null);
  const ruleRef = React.useRef(null);
  const doneTimer = React.useRef(null);
  const [error, setError] = React.useState(false);
  const [invalid, setInvalid] = React.useState({});
  const [done, setDone] = React.useState(null);
  const errorId = React.useId();
  const invalidKeys = React.useMemo(() => Object.keys(invalid), [invalid]);
  useFocusFirstInvalid(formRef, invalidKeys);
  useOverlayLayer({ open: Boolean(step), onClose, layerRef, initialFocusRef: closeRef });
  React.useEffect(() => () => window.clearTimeout(doneTimer.current), []);
  React.useEffect(() => {
    setError(false);
    setInvalid({});
    setDone(null);
  }, [step]);

  if (!step) return null;
  const isHistory = step === "history";
  const isGenerated = step === "generated";

  const selectedCount = threads.reduce((sum, thread) => sum + thread.messages.filter((message) => message.checked).length, 0);
  const totalCount = threads.reduce((sum, thread) => sum + thread.messages.length, 0);

  const generate = () => {
    const messages = [];
    threads.forEach((thread, threadIndex) =>
      thread.messages.forEach((message, messageIndex) => {
        if (message.checked) {
          messages.push({
            threadIndex,
            messageIndex,
            role: message.role,
            title: message.title || "",
            text: message.text,
            conversation: thread.title,
          });
        }
      }),
    );
    if (!messages.length) {
      setError(true);
      return;
    }
    setError(false);
    onGenerate?.({ messages, rule: ruleRef.current?.value || "" });
  };

  const finish = (kind) => {
    const values = Object.fromEntries(new FormData(formRef.current).entries());
    const missing = {};
    sections.forEach((section) =>
      section.fields.forEach((field) => {
        if (field.required && !String(values[field.key] || "").trim()) missing[field.key] = `${field.label} is required.`;
      }),
    );
    setInvalid(missing);
    if (Object.keys(missing).length) return;
    (kind === "save" ? onSave : onSubmit)?.({ values });
    setDone(kind);
    window.clearTimeout(doneTimer.current);
    doneTimer.current = window.setTimeout(() => onClose?.({ reason: kind }), 450);
  };

  const title = isHistory ? copy.historyTitle : isGenerated ? copy.generatedTitle : copy.manualTitle;
  const subtitle = isHistory
    ? copy.historySubtitle
    : isGenerated
      ? `${rule.trim() ? copy.generatedSubtitle : copy.generatedSubtitlePlain} ${copy.generatedNotice}`
      : copy.manualSubtitle;

  return (
    <div data-mh-overlay-surface className="mh-flow">
      <div
        ref={layerRef}
        className={cx("mh-flow__card", isHistory ? "mh-flow__card--history" : "mh-flow__card--form")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="mh-flow__head">
          <div>
            <strong id={titleId}>{title}</strong>
            <span>{subtitle}</span>
          </div>
          <button ref={closeRef} type="button" aria-label="Close" onClick={() => onClose?.({ reason: "button" })}>
            ×
          </button>
        </header>
        {isHistory ? (
          <div className="mh-flow__body">
            <section className="mh-flow__block">
              <div className="mh-flow__block-head">
                <span>{copy.selectLabel}</span>
                <span className="mh-flow__count">
                  Selected {selectedCount} / {totalCount} messages
                </span>
              </div>
              <div className="mh-flow__thread">
                {threads.map((thread, threadIndex) =>
                  thread.messages.map((message, messageIndex) => (
                    <label
                      key={`${threadIndex}-${messageIndex}`}
                      className={cx("mh-flow__msg", message.checked && "is-selected")}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(message.checked)}
                        onChange={(event) => {
                          if (event.target.checked) setError(false);
                          onToggleMessage?.({ threadIndex, messageIndex, checked: event.target.checked });
                        }}
                      />
                      {message.role === "user" ? (
                        <span className="mh-flow__bubble">{message.text}</span>
                      ) : (
                        <span className="mh-flow__answer">
                          <span className="mh-flow__answer-head">
                            {message.label} · {message.sources?.length || 0} grounded sources
                          </span>
                          <strong>{message.title}</strong>
                          <small>{message.text}</small>
                          {message.sources?.length ? (
                            <span className="mh-flow__sources">
                              {message.sources.map((source) => (
                                <span key={source}>{source}</span>
                              ))}
                            </span>
                          ) : null}
                        </span>
                      )}
                    </label>
                  )),
                )}
              </div>
              <p className="mh-flow__error" hidden={!error}>
                {copy.emptyError}
              </p>
            </section>
            <section className="mh-flow__block">
              <div className="mh-flow__block-head">
                <span>{copy.ruleLabel}</span>
                <span className="mh-flow__optional">{copy.optionalLabel}</span>
              </div>
              <textarea
                ref={ruleRef}
                className="mh-flow__rule"
                aria-label={copy.ruleLabel}
                rows={3}
                defaultValue={rule}
                placeholder={copy.rulePlaceholder}
                onChange={(event) => onRuleChange?.({ value: event.target.value })}
              />
            </section>
          </div>
        ) : (
          <form className="mh-flow__form" ref={formRef} noValidate onSubmit={(event) => event.preventDefault()}>
            {sections.map((section) => (
              <section key={section.title} className="mh-flow__section">
                <h4>{section.title}</h4>
                {section.fields.map((field) => {
                  const Tag = field.textarea ? "textarea" : "input";
                  return (
                    <label key={field.key} className="mh-flow__field">
                      <span className="mh-flow__field-label">
                        {field.label}
                        {field.required ? (
                          <span className="mh-flow__required" aria-hidden="true">
                            *
                          </span>
                        ) : null}
                      </span>
                      <Tag
                        name={field.key}
                        aria-label={field.label}
                        required={field.required || undefined}
                        aria-invalid={invalid[field.key] ? true : undefined}
                        aria-describedby={invalid[field.key] ? `${errorId}-${field.key}` : undefined}
                        defaultValue={draft[field.key] ?? ""}
                        placeholder={field.placeholder}
                        className={cx(invalid[field.key] && "is-invalid", field.tall && "mh-flow__tall")}
                        onChange={() => {
                          if (invalid[field.key]) {
                            setInvalid((previous) => {
                              const next = { ...previous };
                              delete next[field.key];
                              return next;
                            });
                          }
                        }}
                      />
                      {invalid[field.key] ? <span id={`${errorId}-${field.key}`} className="mh-flow__field-error">{invalid[field.key]}</span> : null}
                    </label>
                  );
                })}
              </section>
            ))}
          </form>
        )}
        <footer className="mh-flow__foot">
          {isGenerated ? (
            <button type="button" className="mh-flow__btn mh-flow__btn--secondary mh-flow__back" onClick={() => onBack?.({ reason: "back" })}>
              {copy.backLabel}
            </button>
          ) : null}
          <button type="button" className="mh-flow__btn mh-flow__btn--secondary" onClick={() => onClose?.({ reason: "cancel" })}>
            {copy.cancelLabel}
          </button>
          {isHistory ? (
            <button type="button" className="mh-flow__btn mh-flow__btn--primary" onClick={generate}>
              {copy.generateLabel}
            </button>
          ) : submitFirst ? (
            <>
              <button type="button" className="mh-flow__btn mh-flow__btn--primary" onClick={() => finish("submit")}>
                {done === "submit" ? copy.submittedLabel : copy.submitLabel}
              </button>
              <button type="button" className="mh-flow__btn mh-flow__btn--secondary" onClick={() => finish("save")}>
                {done === "save" ? copy.savedLabel : copy.saveLabel}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="mh-flow__btn mh-flow__btn--secondary" onClick={() => finish("save")}>
                {done === "save" ? copy.savedLabel : copy.saveLabel}
              </button>
              <button type="button" className="mh-flow__btn mh-flow__btn--primary" onClick={() => finish("submit")}>
                {done === "submit" ? copy.submittedLabel : copy.submitLabel}
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
