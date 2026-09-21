import React, { useRef, useState } from "react";

const suggestions = [
  {
    label: "What's the ROI trend across my active campaigns?",
    prompt: "What's the ROI trend across my active campaigns this quarter?",
    context: "campaign",
  },
  {
    label: "Campaigns near budget threshold",
    prompt: "Which campaigns are near budget threshold and need attention?",
    context: "campaign",
  },
  {
    label: "Automation task queue overview",
    prompt: "Show me the automation task queue and next best actions.",
    context: "campaign",
  },
];

const scopes = [
  { id: "personalized", label: "All" },
  { id: "campaign", label: "Campaigns" },
  { id: "report", label: "Dashboards" },
  { id: "knowledge", label: "Knowledge" },
];

const history = [
  ["What's the ROI trend across my active campaigns?", "Campaigns · 2 days ago"],
  ["Compare channel performance for the last 3 campaigns", "Dashboards · 1 day ago"],
  ["Which cities have the highest growth potential?", "Campaigns · 3 days ago"],
];

export function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [scope, setScope] = useState("personalized");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const canvasRef = useRef(null);

  const close = () => {
    setOpen(false);
    setExpanded(false);
    setUploadOpen(false);
    setHistoryOpen(false);
  };

  const ask = (text) => {
    const query = text.trim();
    if (!query) return;
    setAnswer(query);
    setPrompt("");
    if (canvasRef.current) canvasRef.current.textContent = "";
  };

  return (
    <>
      <section
        className={`assistant-panel home-ask-panel${expanded ? " is-ai-expanded" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistantTitle"
        hidden={!open}
      >
        <div className="panel-backdrop" onClick={close} />
        <div className="assistant-modal home-ask-modal" tabIndex={-1}>
          <header className="assistant-header">
            <div className="assistant-identity">
              <span className="assistant-mark" aria-hidden="true">
                AI
              </span>
              <div>
                <h2 id="assistantTitle">Ask AI Interpreter</h2>
              </div>
            </div>
            <div className="assistant-header-actions">
              <button
                className="ai-workspace-icon"
                type="button"
                aria-label="New session"
                onClick={() => {
                  setAnswer("");
                  setPrompt("");
                  if (canvasRef.current) canvasRef.current.textContent = "";
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <button
                className="ai-workspace-icon"
                type="button"
                aria-label={expanded ? "Restore" : "Maximize"}
                onClick={() => setExpanded((value) => !value)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 9V5a1 1 0 0 1 1-1h4" />
                  <path d="M20 9V5a1 1 0 0 0-1-1h-4" />
                  <path d="M4 15v4a1 1 0 0 0 1 1h4" />
                  <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
                </svg>
              </button>
              <button className="ai-workspace-icon" type="button" aria-label="History" onClick={() => setHistoryOpen((value) => !value)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </button>
              <button className="close-btn" type="button" aria-label="Close assistant" onClick={close}>
                ×
              </button>
            </div>
          </header>
          <div className="assistant-main">
            <div className="assistant-ask-stage" hidden={Boolean(answer)}>
              <div className="ask-stage-hero">
                <div className="ask-stage-headline">
                  <h3>Ask a question</h3>
                  <p>Your AI partner for every marketing task</p>
                </div>
                <div className="ask-stage-suggestions">
                  {suggestions.map((item) => (
                    <button key={item.prompt} className="ask-suggestion" type="button" onClick={() => ask(item.prompt)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="answer-feed" hidden={!answer}>
              {answer ? (
                <article className="answer-card">
                  <p>
                    I will use the AI Interpreter knowledge context to answer: <strong>{answer}</strong>
                  </p>
                </article>
              ) : null}
            </div>
          </div>
          <section className="ask-zone" aria-label="Ask AI Interpreter AI">
            <div className="ask-meta">
              <div className="ask-scope" role="group" aria-label="Response scope">
                <span>Scope</span>
                {scopes.map((item) => (
                  <button
                    key={item.id}
                    className={`scope-option${scope === item.id ? " active" : ""}`}
                    type="button"
                    aria-pressed={scope === item.id}
                    onClick={() => setScope(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="ask-composer home-ask-composer">
              <div
                className="query-canvas"
                ref={canvasRef}
                contentEditable
                role="textbox"
                aria-multiline="true"
                aria-label="Ask AI Interpreter AI"
                data-placeholder="Type your question or upload Excel/CSV files for data analysis"
                onInput={(event) => setPrompt(event.currentTarget.textContent || "")}
                suppressContentEditableWarning
              />
              <div className="composer-toolbar">
                <div className="composer-actions">
                  <button className="upload-action" type="button" aria-label="Upload file" onClick={() => setUploadOpen((value) => !value)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <div className="upload-popup" hidden={!uploadOpen}>
                    <button className="upload-popup-item" type="button" onClick={() => setUploadOpen(false)}>
                      Business Knowledge
                    </button>
                  </div>
                </div>
                <button className="send-action" type="button" aria-label="Ask" disabled={!prompt.trim()} onClick={() => ask(prompt)}>
                  <span>ASK</span>
                </button>
              </div>
            </div>
          </section>
          <div className="home-history-popup" hidden={!historyOpen}>
            <div className="home-history-popup-head">
              <h4>
                Recent <span className="home-history-popup-count">({history.length})</span>
              </h4>
            </div>
            <div className="home-history-list">
              {history.map(([title]) => (
                <button key={title} type="button" className="home-history-item" onClick={() => ask(title)}>
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <button className="global-ai-launcher" type="button" aria-label="Open AI assistant" onClick={() => setOpen(true)}>
        <span className="global-ai-orb" aria-hidden="true">
          AI
        </span>
        <span className="global-ai-label">AI Interpreter</span>
      </button>
    </>
  );
}
