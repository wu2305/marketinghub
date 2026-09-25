import "../../tokens.css";
import React from "react";
import { Button } from "../../components/Button/index.jsx";
import { Suggestion } from "./Suggestion.jsx";
import { TextArea } from "../../components/TextArea/index.jsx";
import { cx } from "../../cx.js";
import { Icon } from "../../icons.jsx";
import { SkillMenu } from "../../lib/SkillMenu/index.jsx";
import { AssistantShell } from "../../lib/AssistantShell.jsx";
import "./AssistantPanel.css";


export const assistantPlacements = ["modal", "drawer"];
export const assistantVariants = ["home", "cockpit", "campaign", "lite"];
export const assistantAnswerVariants = ["default", "compact", "workspace", "simple"];

const variantSettings = {
  home: { enterToSubmit: true, hideStageOnAnswers: false, shortMaximizeLabel: true },
  cockpit: { enterToSubmit: false, hideStageOnAnswers: true, shortMaximizeLabel: false },
  campaign: { enterToSubmit: false, hideStageOnAnswers: false, shortMaximizeLabel: false },
  lite: { enterToSubmit: false, hideStageOnAnswers: false, shortMaximizeLabel: true },
};

const panelShellClasses = {
  header: "mh-assistant__header",
  actions: "mh-assistant__actions",
  icon: "mh-assistant__icon",
  historyAnchor: "mh-assistant__history",
  historyPopup: "mh-assistant__history-pop",
  historyHead: "mh-assistant__history-head",
  historyList: "mh-assistant__history-list",
  historyItem: "mh-assistant__history-item",
  close: "mh-assistant__close",
  closeLabel: "Close assistant",
};

/**
 * One assistant answer entry: user query bubble plus the grounded answer card
 * with sources, related actions and feedback buttons.
 * @param {object} props
 * @param {{ query: string, kicker?: string, title?: string, body?: string, sources?: string[], actions?: Array<{ label: string, href?: string }>, variant?: typeof assistantAnswerVariants[number], banner?: string, context?: string, findings?: Array<{ label: string, detail: string }>, lead?: string }} props.answer
 * @param {(event: { query: string, feedback: "helpful"|"not-helpful"|"copy"|null }) => void} [props.onFeedback]
 */
function AssistantAnswer({ answer, onFeedback }) {
  const [feedback, setFeedback] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const cardRef = React.useRef(null);
  const copyTimer = React.useRef(null);
  React.useEffect(() => () => window.clearTimeout(copyTimer.current), []);
  const pick = (kind) => {
    const next = feedback === kind ? null : kind;
    setFeedback(next);
    onFeedback?.({ query: answer.query, feedback: next });
  };
  const copy = () => {
    const text = cardRef.current?.innerText ?? [answer.query, answer.title, answer.body].filter(Boolean).join("\n");
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
    onFeedback?.({ query: answer.query, feedback: "copy" });
  };
  if (answer.variant === "simple") {
    return (
      <div className="mh-assistant__entry">
        <article className="mh-assistant__answer mh-assistant__answer--simple" ref={cardRef}>
          <p>
            {answer.lead} <strong>{answer.query}</strong>
          </p>
        </article>
      </div>
    );
  }
  const feedbackRow = (
    <div className="mh-assistant__feedback">
      <button type="button" data-kind="helpful" aria-pressed={feedback === "helpful"} onClick={() => pick("helpful")}>
        <Icon name="thumb-up" />
        <span>Helpful</span>
      </button>
      <button type="button" data-kind="not-helpful" aria-pressed={feedback === "not-helpful"} onClick={() => pick("not-helpful")}>
        <Icon name="thumb-down" />
        <span>Not helpful</span>
      </button>
      <button type="button" data-kind="copy" aria-label="Copy answer" onClick={copy}>
        <Icon name="copy" />
        <span>{copied ? "Copied!" : "Copy"}</span>
      </button>
    </div>
  );
  if (answer.variant === "workspace") {
    return (
      <div className="mh-assistant__entry">
        <div className="mh-assistant__query">
          <span className="mh-assistant__bubble">{answer.query}</span>
        </div>
        <article className="mh-assistant__answer mh-assistant__answer--workspace" ref={cardRef}>
          <div className="mh-assistant__answer-banner">
            <strong>{answer.banner}</strong>
            <span>{answer.context}</span>
          </div>
          <div className="mh-assistant__answer-body">
            <p>{answer.body}</p>
            {(answer.findings || []).map((finding) => (
              <div className="mh-assistant__finding" key={finding.label}>
                <strong>{finding.label}</strong>
                <p>{finding.detail}</p>
              </div>
            ))}
          </div>
          {answer.sources?.length ? (
            <div className="mh-assistant__sources" aria-label="Sources">
              {answer.sources.map((source) => (
                <span key={source}>{source}</span>
              ))}
            </div>
          ) : null}
          {feedbackRow}
        </article>
      </div>
    );
  }
  if (answer.variant === "compact") {
    return (
      <div className="mh-assistant__entry">
        <div className="mh-assistant__query">
          <span className="mh-assistant__bubble">{answer.query}</span>
        </div>
        <article className="mh-assistant__answer" ref={cardRef}>
          <p>{answer.body}</p>
          {answer.sources?.length ? (
            <div className="mh-assistant__sources-row" aria-label="Sources">
              <span>Sources used</span>
              <div>
                {answer.sources.map((source) => (
                  <span key={source}>{source}</span>
                ))}
              </div>
            </div>
          ) : null}
          {feedbackRow}
        </article>
      </div>
    );
  }
  return (
    <div className="mh-assistant__entry">
      <div className="mh-assistant__query">
        <span className="mh-assistant__bubble">{answer.query}</span>
      </div>
      <article className="mh-assistant__answer" ref={cardRef}>
        <div className="mh-assistant__answer-head">
          <span>{answer.kicker}</span>
          <small>{answer.sources?.length || 0} grounded sources</small>
        </div>
        <h3>{answer.title}</h3>
        <p>{answer.body}</p>
        {answer.sources?.length ? (
          <div className="mh-assistant__sources" aria-label="Sources">
            {answer.sources.map((source) => (
              <span key={source}>{source}</span>
            ))}
          </div>
        ) : null}
        {answer.actions?.length ? (
          <div className="mh-assistant__answer-actions" aria-label="Related actions">
            {answer.actions.map((action) =>
              action.href ? (
                <a key={action.label} href={action.href}>
                  {action.label}
                </a>
              ) : (
                <span key={action.label}>{action.label}</span>
              ),
            )}
          </div>
        ) : null}
        {feedbackRow}
      </article>
    </div>
  );
}

/**
 * Assistant dialog. `placement="drawer"` renders the right-edge full-height
 * variant used on Home; "modal" is the centered variant. Renders nothing when
 * `open` is false.
 *
 * Reachable states mirror the original runtime: suggestion/history items fill
 * the prompt, submit appends entries to the answer feed, the expand button
 * toggles the drawer into a centered dialog, the history button opens a
 * popover (closed by outside click or Escape), Escape closes the panel, and
 * focus returns to the invoking element on close.
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {typeof assistantPlacements[number]} [props.placement="modal"]
 * @param {"home"|undefined} [props.tone] "home" mirrors `home-ask-panel`: white borderless composer strip
 * @param {string} [props.title="Ask AI Interpreter"]
 * @param {string} [props.headline="Ask a question"]
 * @param {string} [props.description]
 * @param {Array<string|{ label: string, prompt: string }>} [props.suggestions=[]]
 * @param {typeof assistantVariants[number]} [props.variant="campaign"] real page behavior preset
 * @param {string} [props.prompt=""]
 * @param {Array<object>} [props.answers=[]] AssistantAnswer entries, oldest first; `{ variant: "simple", lead, query }` renders the lite single-line card
 * @param {Array<{ id?: string, label: string, prompt: string }>} [props.history=[]] recent prompts in the history popover
 * @param {string} [props.historyTitle="Recent"]
 * @param {React.ReactNode} [props.historyCount] e.g. "(121)"
 * @param {object} [props.skillMenu] renders the composer "+" skill menu when provided; `{ triggerLabel?, attachAccept?, categories, searchPlaceholder, emptyLabel, items, historyLabel, manualLabel }`
 * @param {{ id?: string, type: string, title: string }} [props.selectedSkill] chip shown inside the composer when a skill is selected
 * @param {(event: { names: string[] }) => void} [props.onAttach] fired after "Upload File" picks files
 * @param {(event: { id?: string, type: string, title: string }) => void} [props.onSelectSkill]
 * @param {() => void} [props.onClearSkill]
 * @param {(event: { action: "history"|"manual" }) => void} [props.onSkillAction] model-creation menu entries
 * @param {(event: { reason: "backdrop"|"escape"|"button" }) => void} [props.onClose]
 * @param {React.RefObject<HTMLElement>} [props.returnFocusRef] opener kept when the launcher is hidden during this panel
 * @param {(event: { name: string, value: string }) => void} [props.onPromptChange]
 * @param {(event: { prompt: string }) => void} [props.onSubmit]
 * @param {(event: { prompt: string }) => void} [props.onSuggestion]
 * @param {() => void} [props.onNewSession]
 * @param {(event: { expanded: boolean }) => void} [props.onMaximize]
 * @param {(event: { open: boolean }) => void} [props.onHistory]
 * @param {(event: { label: string, prompt: string }) => void} [props.onHistorySelect]
 * @param {(event: { query: string, feedback: string|null }) => void} [props.onFeedback]
 */
export function AssistantPanel({
  open = false,
  placement = "modal",
  tone,
  title = "Ask AI Interpreter",
  headline = "Ask a question",
  description = "Your AI partner for every marketing task",
  suggestions = [],
  variant = "campaign",
  prompt = "",
  answers = [],
  history = [],
  historyTitle = "Recent",
  historyCount,
  skillMenu,
  selectedSkill,
  onAttach,
  onSelectSkill,
  onClearSkill,
  onSkillAction,
  onClose,
  returnFocusRef,
  onPromptChange,
  onSubmit,
  onSuggestion,
  onNewSession,
  onMaximize,
  onHistory,
  onHistorySelect,
  onFeedback,
}) {
  const { enterToSubmit, hideStageOnAnswers, shortMaximizeLabel } = variantSettings[variant] || variantSettings.campaign;
  const titleId = React.useId();
  const layerRef = React.useRef(null);
  const mainRef = React.useRef(null);
  const promptRef = React.useRef(null);

  React.useEffect(() => {
    if (answers.length && mainRef.current) {
      mainRef.current.scrollTo({ top: mainRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [answers.length]);

  // `.query-canvas` auto-grows 44→88px with content (assistant-panel.css
  // min/max-height); a <textarea> needs JS to size to scrollHeight.
  React.useLayoutEffect(() => {
    const el = promptRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [prompt]);

  return (
    <AssistantShell
      open={open}
      title={<div className="mh-assistant__identity"><span className="mh-assistant__mark">AI</span><h2 id={titleId}>{title}</h2></div>}
      classes={panelShellClasses}
      shortMaximizeLabel={shortMaximizeLabel}
      history={history.map((item) => ({ id: item.id, title: item.title ?? item.label, subtitle: item.label, source: item }))}
      historyHeading={<h4>{historyTitle}{historyCount != null ? <span className="mh-assistant__history-count"> {historyCount}</span> : null}</h4>}
      historyAriaLabel="Recent conversations"
      historyCloseLabel="Close"
      layerRef={layerRef}
      initialFocusRef={promptRef}
      returnFocusRef={returnFocusRef}
      onClose={onClose}
      onNewSession={onNewSession}
      onMaximize={onMaximize}
      onHistory={onHistory}
      onHistorySelect={(item) => onHistorySelect?.({ label: item.label, prompt: item.prompt })}
      renderSurface={({ header, body, composer, expanded }) => open ? (
        <section ref={layerRef} data-mh-overlay-surface className={cx("mh-assistant", placement === "drawer" && "mh-assistant--drawer", tone === "home" && "mh-assistant--home", expanded && "mh-assistant--expanded")} aria-label={variant === "lite" ? "AI Interpreter" : title} tabIndex={-1}>
          <button className="mh-assistant__backdrop" type="button" tabIndex={-1} aria-label="Close assistant" onClick={() => onClose?.({ reason: "backdrop" })} />
          <div className="mh-assistant__dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>{header}{body}{composer}</div>
        </section>
      ) : null}
      body={
        <div className="mh-assistant__main" ref={mainRef}>
          {hideStageOnAnswers && answers.length ? null : (
            <div className="mh-assistant__stage">
              <div>
                <h3>{headline}</h3>
                <p>{description}</p>
              </div>
              <div className="mh-assistant__suggestions">
                {suggestions.map((item) => {
                  const suggestion = typeof item === "string" ? { label: item, prompt: item } : item;
                  return (
                    <Suggestion key={suggestion.label} onSelect={() => {
                      onSuggestion?.({ prompt: suggestion.prompt });
                      promptRef.current?.focus();
                    }}>
                      {suggestion.label}
                    </Suggestion>
                  );
                })}
              </div>
            </div>
          )}
          {answers.length ? (
            <div className="mh-assistant__feed">
              {answers.map((answer, index) => (
                <AssistantAnswer key={answer.id ?? `${index}-${answer.query}`} answer={answer} onFeedback={onFeedback} />
              ))}
            </div>
          ) : null}
        </div>
      }
      composer={
        <form
          className="mh-assistant__ask"
          aria-label="Ask AI Interpreter AI"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.({ prompt });
          }}
        >
          {placement === "drawer" ? <div className="mh-assistant__scope-reserve" aria-hidden="true" /> : null}
          <div className="mh-assistant__box">
            {selectedSkill ? (
              <span className="mh-assistant__chip">
                <span>
                  {selectedSkill.type}: {selectedSkill.title}
                </span>
                <button
                  type="button"
                  aria-label="Clear selected skill"
                  onClick={() => {
                    onClearSkill?.();
                    promptRef.current?.focus();
                  }}
                >
                  ×
                </button>
              </span>
            ) : null}
            <TextArea
              label="Ask AI Interpreter AI"
              rows={1}
              value={prompt}
              placeholder="Type your question or upload Excel/CSV files for data analysis"
              onChange={onPromptChange}
              onKeyDown={(event) => {
                if (enterToSubmit && event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (String(prompt).trim()) event.currentTarget.form?.requestSubmit();
                }
              }}
              ref={promptRef}
            />
            <div className="mh-assistant__tools">
              {skillMenu ? (
                <SkillMenu
                  config={skillMenu}
                  selectedSkill={selectedSkill}
                  composerRef={promptRef}
                  onAttach={onAttach}
                  onSelectSkill={onSelectSkill}
                  onAction={onSkillAction}
                />
              ) : null}
              <span className="mh-assistant__send">
                <Button variant="gold" size="sm" type="submit" label="Ask" disabled={!String(prompt).trim()}>
                  ASK
                </Button>
              </span>
            </div>
          </div>
        </form>
      }
    />
  );
}
