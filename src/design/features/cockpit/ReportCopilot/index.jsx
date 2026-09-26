import "../../../tokens.css";
import React from "react";
import { ModelFlowDialog } from "../../../components/ModelFlowDialog/index.jsx";
import { TextArea } from "../../../components/TextArea/index.jsx";
import { cx } from "../../../cx.js";
import { Icon } from "../../../icons.jsx";
import { SkillMenu } from "../../../lib/SkillMenu/index.jsx";
import { AssistantShell } from "../../../lib/AssistantShell.jsx";
import "./ReportCopilot.css";


/* ============================================================
   Report Copilot — the report-scoped AI workspace (aiWorkspace) on the
   live report view: right-side drawer with summary/scenario start view,
   contextual answers, chat thread, history popup and the report skill
   menu. Deterministic local port of report-core.js's workspace block.
   ============================================================ */

const COPILOT_STREAM_MS = { holistic: 110, rich: 140 };
const copilotShellClasses = {
  header: "mh-copilot__head",
  actions: "mh-copilot__head-actions",
  icon: "mh-copilot__icon",
  historyAnchor: "mh-copilot__history-anchor",
  historyPopup: "mh-copilot__history",
  historyHead: "mh-copilot__history-head",
  historyList: "mh-copilot__history-list",
  historyItem: "mh-copilot__history-item",
  close: "mh-copilot__close",
  closeLabel: "Close AI workspace",
};

/** Inline segment renderer shared by copilot content (text/bold/signed value/badge/break). */
function CopilotSegments({ segments }) {
  return segments.map((segment, index) => {
    if (typeof segment === "string") return <React.Fragment key={index}>{segment}</React.Fragment>;
    if (segment.br) return <br key={index} />;
    if (segment.b) return <b key={index}>{segment.b}</b>;
    if (segment.n !== undefined) return <HrNum key={index} value={segment.n} />;
    if (segment.d) return <HrDot key={index} kind={segment.d} />;
    if (segment.badge) {
      return (
        <span key={index} className={cx("mh-ra-badge", `mh-ra-badge--${segment.tone}`)}>
          {segment.badge}
        </span>
      );
    }
    return <React.Fragment key={index}>{segment.text}</React.Fragment>;
  });
}

function HrDot({ kind }) {
  return (
    <span className="mh-hr-dot-cell">
      <i className={cx("mh-hr-dot", `mh-hr-dot--${kind}`)} />
    </span>
  );
}

function HrNum({ value }) {
  const negative = String(value).startsWith("-") || String(value).startsWith("−");
  return <span className={cx("mh-hr-num", negative ? "mh-hr-neg" : "mh-hr-pos")}>{value}</span>;
}

function HrCell({ cell }) {
  if (cell && typeof cell === "object") {
    if (cell.d) return <HrDot kind={cell.d} />;
    if (cell.n !== undefined) return <HrNum value={cell.n} />;
  }
  return <React.Fragment>{cell}</React.Fragment>;
}

function HrTable({ headers, rows, total }) {
  return (
    <table className="mh-hr-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className={cx(total && rowIndex === rows.length - 1 && "mh-hr-total")}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>
                <HrCell cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HrInsight({ label, segments }) {
  return (
    <div className="mh-hr-insight">
      <b>{label}</b>
      <CopilotSegments segments={segments} />
    </div>
  );
}

const HR_SERIES_TONES = { ink: "var(--mh-sc-ink)", pos: "var(--mh-indicator-positive-chart)", neg: "var(--mh-indicator-negative-chart)" };

function HrTrendChart({ chart }) {
  const { periods, min, max, ticks, series } = chart;
  const W = 520;
  const H = 170;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 26;
  const X = (i) => padL + (W - padL - padR) * (i / (periods.length - 1));
  const Y = (v) => padT + (H - padT - padB) * (1 - (v - min) / (max - min));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="mh-hr-chart-svg" role="img" aria-label="Monthly uplift trend">
      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={padL}
            y1={Y(tick)}
            x2={W - padR}
            y2={Y(tick)}
            stroke={tick === 0 ? "var(--mh-hr-grid-zero)" : "var(--mh-sc-gridline)"}
            strokeWidth="1"
            strokeDasharray={tick === 0 ? "4 3" : undefined}
          />
          <text x={padL - 6} y={Y(tick) + 3} textAnchor="end" fontSize="9" fill="var(--mh-hr-axis)">
            {tick > 0 ? `+${tick}` : tick}%
          </text>
        </g>
      ))}
      {periods.map((period, i) => (
        <text key={period} x={X(i)} y={H - 10} textAnchor="middle" fontSize="8.5" fill="var(--mh-hr-axis)">
          {period}
        </text>
      ))}
      {series.map((s) => {
        const color = HR_SERIES_TONES[s.tone];
        const pts = s.values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
        const lastX = X(s.values.length - 1);
        const lastY = Y(s.values[s.values.length - 1]);
        const last = s.values[s.values.length - 1];
        return (
          <g key={s.name}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={lastX} cy={lastY} r="3" fill={color} stroke="#fff" strokeWidth="1" />
            <text x={lastX - 2} y={lastY - 6} textAnchor="end" fontSize="9" fontWeight="600" fill={color}>
              {last > 0 ? "+" : ""}
              {last.toFixed(1)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** One block of a streamed answer: mounts hidden, reveals on the next frame. */
function StreamBlock({ animate = true, children }) {
  const [revealed, setRevealed] = React.useState(!animate);
  React.useEffect(() => {
    if (!animate) return undefined;
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, [animate]);
  return <div className={cx("mh-stream-block", revealed && "is-revealed")}>{children}</div>;
}

/* Progressive reveal driver: mounts blocks one interval at a time with a trailing cursor.
   streamBlocksInto() calls cancelActiveStream() — one stream at a time; a new
   card freezes the previous mid-render and drops its cursor. The registry is
   scoped per ReportCopilot instance via context (a bare useStream falls back
   to a shared registry). */
const defaultStreamRegistry = { current: null };
const CopilotStreamContext = React.createContext(defaultStreamRegistry);
function useStream(total, stream, interval, scrollSelector) {
  const registry = React.useContext(CopilotStreamContext);
  const hostRef = React.useRef(null);
  const [shown, setShown] = React.useState(stream ? 0 : total);
  const [cancelled, setCancelled] = React.useState(false);
  React.useEffect(() => {
    setShown(stream ? 0 : total);
    setCancelled(false);
  }, [stream, total]);
  React.useEffect(() => {
    const token = { cancel: () => setCancelled(true) };
    registry.current?.cancel();
    registry.current = token;
    return () => {
      if (registry.current === token) registry.current = null;
    };
  }, [registry]);
  React.useEffect(() => {
    if (shown >= total || cancelled) return undefined;
    const timer = window.setTimeout(() => {
      setShown((n) => n + 1);
      const scroller = hostRef.current?.closest(scrollSelector);
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    }, interval);
    return () => window.clearTimeout(timer);
  }, [shown, total, cancelled, interval, scrollSelector]);
  return { hostRef, shown, streaming: shown < total && !cancelled };
}

function HolisticReport({ data, stream = true }) {
  const blocks = data.blocks;
  const { hostRef, shown, streaming } = useStream(blocks.length, stream, COPILOT_STREAM_MS.holistic, ".mh-copilot__answer");
  const renderBlock = (block) => {
    switch (block.type) {
      case "meta":
        return (
          <div className="mh-hr-meta">
            {data.meta.map(([label, value]) => (
              <span key={label}>
                {label} <b>{value}</b>
              </span>
            ))}
          </div>
        );
      case "chart":
        return (
          <React.Fragment>
            {block.heading ? (
              <div className="mh-hr-h">
                <i>{block.heading.index}</i>
                <strong>{block.heading.title}</strong>
              </div>
            ) : null}
            <div className="mh-hr-h4">{block.sub}</div>
            <p className="mh-hr-note">{block.note}</p>
            <div className="mh-hr-chart">
              <div className="mh-hr-chart-legend">
                {data.chart.series.map((s) => (
                  <span key={s.name}>
                    <i style={{ background: HR_SERIES_TONES[s.tone] }} />
                    {s.name}
                  </span>
                ))}
              </div>
              <HrTrendChart chart={data.chart} />
            </div>
          </React.Fragment>
        );
      case "insight":
        return <HrInsight label={block.label} segments={block.segments} />;
      case "group":
      default:
        return (
          <React.Fragment>
            {block.heading ? (
              <div className="mh-hr-h">
                <i>{block.heading.index}</i>
                <strong>{block.heading.title}</strong>
              </div>
            ) : null}
            {block.sub ? <div className="mh-hr-h4">{block.sub}</div> : null}
            {block.note ? <p className="mh-hr-note">{block.note}</p> : null}
            {block.alerts ? (
              <ul className="mh-hr-alerts">
                {block.alerts.map((item, i) => (
                  <li key={i}>
                    <HrDot kind={item.dot} />
                    <span>
                      <CopilotSegments segments={item.segments} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            {block.table ? <HrTable headers={block.table.headers} rows={block.table.rows} total={block.table.total} /> : null}
            {block.dotLegend ? (
              <p className="mh-hr-note">
                {(data.dotLegend || []).map((item, i) => (
                  <React.Fragment key={i}>
                    <HrDot kind={item.dot} />
                    {item.text}
                    {i < data.dotLegend.length - 1 ? "  " : ""}
                  </React.Fragment>
                ))}
              </p>
            ) : null}
            {block.insight ? <HrInsight label={block.insight.label} segments={block.insight.segments} /> : null}
          </React.Fragment>
        );
    }
  };
  return (
    <div className="mh-holistic" ref={hostRef}>
      {blocks.slice(0, shown).map((block, index) => (
        <StreamBlock key={index} animate={stream}>
          {renderBlock(block)}
        </StreamBlock>
      ))}
      {streaming ? <span className="mh-stream-cursor" /> : null}
    </div>
  );
}

function PilotSalesBody({ data, sources, stream = true, trailing, onExplore }) {
  const blocks = [
    <p className="mh-ra-lead" key="lead">
      <CopilotSegments segments={data.lead} />
    </p>,
    <React.Fragment key="channels">
      <div className="mh-ra-divider" />
      <p className="mh-ra-sec-title">{data.channelsTitle}</p>
      <p className="mh-ra-sec-sub">{data.channelsSub}</p>
      <div className="mh-ra-channels">
        {data.channels.map((channel) => (
          <div className="mh-ra-channel" key={channel.name}>
            <div className="mh-ra-ch-head">
              <span className={cx("mh-ra-icon", `mh-ra-icon--${channel.tone}`)}>
                <Icon name={channel.icon} />
              </span>
              <span className="mh-ra-ch-name">{channel.name}</span>
            </div>
            <div className="mh-ra-ch-main">
              <span className={cx("mh-ra-value", channel.up ? "mh-ra-up" : "mh-ra-down")}>
                {channel.uplift}
                <i className="mh-ra-arrow" aria-hidden="true">
                  {channel.up ? "▲" : "▼"}
                </i>
              </span>
            </div>
            <div className="mh-ra-ch-label">Sales uplift</div>
            <div className="mh-ra-ch-stats">
              {channel.stats.map((stat) => (
                <span className="mh-ra-stat" key={stat.label}>
                  <i>{stat.label}</i>
                  <b className={stat.up ? "mh-ra-up" : "mh-ra-down"}>{stat.value}</b>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>,
    <p className="mh-ra-insight" key="insight">
      {data.insight}
    </p>,
    <React.Fragment key="explore">
      <div className="mh-ra-divider" />
      <p className="mh-ra-sec-title">{data.exploreTitle}</p>
      <p className="mh-ra-explore-hint">{data.exploreHint}</p>
      <div className="mh-ra-explore">
        {data.explore.map((option) => (
          <button className="mh-ra-option" type="button" key={option.title} onClick={() => onExplore?.({ question: option.question })}>
            <span className="mh-ra-option-icon">
              <Icon name={option.icon} />
            </span>
            <span>
              <strong>{option.title}</strong>
              <small>{option.sub}</small>
            </span>
          </button>
        ))}
      </div>
    </React.Fragment>,
    <React.Fragment key="sources">
      <div className="mh-ra-divider" />
      <div className="mh-ra-source-line" aria-label="Sources">
        <span className="mh-ra-source-label">Sources used</span>
        {sources.slice(0, 3).map((source) => (
          <span className="mh-ra-source-chip" key={source.id}>
            {source.title}
          </span>
        ))}
      </div>
      {trailing}
    </React.Fragment>,
  ];
  const { hostRef, shown, streaming } = useStream(blocks.length, stream, COPILOT_STREAM_MS.rich, ".mh-copilot__answer");
  return (
    <div className="mh-ra-body" ref={hostRef}>
      {blocks.slice(0, shown).map((block, index) => (
        <StreamBlock key={index} animate={stream}>
          {block}
        </StreamBlock>
      ))}
      {streaming ? <span className="mh-stream-cursor" /> : null}
    </div>
  );
}

function CopilotChatEntry({ entry, stream = true, onChatFeedback, onCopy, onExplore }) {
  const [feedback, setFeedback] = React.useState(null);
  const cardRef = React.useRef(null);
  const entryRef = React.useRef(null);
  React.useEffect(() => {
    entryRef.current?.scrollIntoView({ block: "nearest" });
  }, []);
  const copyCard = () => {
    const text = cardRef.current?.innerText.trim();
    if (text && navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    onCopy?.({ id: entry.id });
  };
  /* data-chat-feedback is a per-card radio: clicking marks, no toggle-off. */
  const pick = (value) => {
    setFeedback(value);
    onChatFeedback?.({ id: entry.id, value });
  };
  const rich = entry.kind === "rich";
  const headCount = rich ? entry.sources.length : entry.sources.slice(0, 3).length;
  const feedbackRow = (
    <div className="mh-copilot__entry-feedback">
      <button
        type="button"
        className="mh-copilot__fb"
        aria-pressed={feedback === "helpful"}
        onClick={() => pick("helpful")}
      >
        <Icon name="thumb-up" />
        <span>Helpful</span>
      </button>
      <button
        type="button"
        className="mh-copilot__fb"
        aria-pressed={feedback === "not-helpful"}
        onClick={() => pick("not-helpful")}
      >
        <Icon name="thumb-down" />
        <span>Not helpful</span>
      </button>
      <button type="button" className="mh-copilot__fb mh-copilot__copy" aria-label="Copy answer" onClick={copyCard}>
        <Icon name="copy" />
        <span>Copy</span>
      </button>
    </div>
  );
  return (
    <article className="mh-copilot__entry" ref={entryRef}>
      <div className="mh-copilot__query">
        <span className="mh-copilot__bubble">{entry.question}</span>
      </div>
      <article className={cx("mh-copilot__card", rich && "mh-copilot__card--rich")} ref={cardRef}>
        <div className="mh-copilot__card-head">
          <span>Connected report view</span>
          <small>{headCount} grounded sources</small>
        </div>
        {rich ? (
          <PilotSalesBody
            data={entry.card}
            sources={entry.sources}
            stream={stream}
            trailing={feedbackRow}
            onExplore={onExplore}
          />
        ) : (
          <React.Fragment>
            <h3>Recommended next move.</h3>
            <p>{entry.summary}</p>
            <div className="mh-copilot__source-line" aria-label="Sources">
              {entry.sources.slice(0, 3).map((source) => (
                <span key={source.id}>{source.title}</span>
              ))}
            </div>
            <div className="mh-copilot__card-actions" aria-label="Related actions">
              <a href={entry.sources[0]?.href || "/assets/pages/knowledge.html"}>Open report context</a>
              <span>Compare movement</span>
              <span>Save learning</span>
            </div>
            {feedbackRow}
          </React.Fragment>
        )}
      </article>
    </article>
  );
}

/** Collapsible workspace section (summary drawer / scenario start view), also used docked in the answer view. */
function CopilotSection({ index, className, heading, chevron = false, extra, collapsed = false, docked = false, onToggle, children }) {
  const headingId = React.useId();
  const toggleFromHeading = (event) => {
    if (event.target.closest("button, a, input, select, textarea")) return;
    onToggle?.();
  };
  /* The original head is a click-only div; role/tabindex add the missing
     keyboard path without changing the visual contract. */
  const keyToggle = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("button, a, input, select, textarea")) return;
    event.preventDefault();
    onToggle?.();
  };
  return (
    <section className={cx("mh-copilot__section", className, docked && "mh-copilot__section--docked")} aria-labelledby={headingId}>
      <div
        className="mh-copilot__section-head"
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        onClick={toggleFromHeading}
        onKeyDown={keyToggle}
      >
        <span className="mh-copilot__section-num">{index}</span>
        <div className="mh-copilot__section-title">
          <h3 id={headingId}>{heading}</h3>
        </div>
        {extra}
        {chevron ? (
          <button
            type="button"
            className="mh-copilot__collapse"
            aria-expanded={!collapsed}
            aria-label={`Toggle ${heading}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggle?.();
            }}
          >
            <i aria-hidden="true">›</i>
          </button>
        ) : null}
      </div>
      <div className={cx("mh-copilot__collapse-content", collapsed && "is-collapsed")}>{children}</div>
    </section>
  );
}

/**
 * Report Copilot workspace: fixed right drawer on the live report view.
 * Start view = AI summary card + scenario recommendations; an open answer or
 * chat exchange swaps in the answer view with context-dock shortcuts. Chat and
 * answer content are controlled props — the host owns the deterministic
 * "AI" simulation (`resolveCopilotAnswer` / `buildCopilotChatEntry`).
 * `stream` controls the progressive reveal used by the holistic report and
 * the rich pilot-sales card (set false for instant render).
 * @param {object} props
 * @param {boolean} [props.open=false]
 * @param {string} props.title panel title (from the report's assistant profile)
 * @param {string} props.eyebrow eyebrow label over the title
 * @param {{ title: string, status: string, paragraphs: Array<Array<object|string>> }} [props.summary]
 * @param {Array<{ title: string, meta?: string }>} [props.recommendations=[]]
 * @param {string} [props.periodHint=""]
 * @param {Array<{ id: string, title: string, href: string }>} [props.sources=[]]
 * @param {{ kind: "answer"|"holistic", title: string, summary?: string, findings?: Array<{ label: string, text: string> }, report?: object }|null} [props.answer=null] holistic answers carry their data as `report`
 * @param {Array<{ id?: string, kind: "standard"|"rich", question: string, summary?: string, card?: object, sources: Array<object> }>} [props.chat=[]] rich entries carry their card data as `card`
 * @param {string} [props.prompt=""]
 * @param {string} props.commandHint helper line above the composer
 * @param {string} props.inputPlaceholder composer placeholder
 * @param {string} props.answerLabel label over an open answer
 * @param {Array<{ title: string, prompt: string }>} [props.history=[]]
 * @param {object} [props.skillMenu] SkillMenu config; renders the "+" menu when set
 * @param {object} [props.flow] ModelFlowDialog props; renders the flow dialog when set
 * @param {boolean} [props.stream=true]
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onClose]
 * @param {React.RefObject<HTMLElement>} [props.returnFocusRef] opener kept when the launcher is hidden during this workspace
 * @param {(event: { reason: "back" }) => void} [props.onBack] back to the start/context view
 * @param {(event: { reason: "new-session" }) => void} [props.onNewSession]
 * @param {(event: { expanded: boolean }) => void} [props.onMaximize]
 * @param {(event: { title: string, prompt: string }) => void} [props.onHistorySelect]
 * @param {(event: { index: number }) => void} [props.onRecommendation]
 * @param {(event: { question: string }) => void} [props.onAsk]
 * @param {(event: { value: string }) => void} [props.onPromptChange]
 * @param {(event: { value: "helpful"|"not-helpful" }) => void} [props.onFeedback]
 * @param {(event: { id?: string, value: "helpful"|"not-helpful"|null }) => void} [props.onChatFeedback]
 * @param {(event: { id?: string }) => void} [props.onCopy]
 * @param {(event: { question: string }) => void} [props.onExplore] rich-card explore options fill the input
 * @param {(event: { names: string[] }) => void} [props.onAttach]
 * @param {(event: { id: string, type: string, title: string }) => void} [props.onSelectSkill]
 * @param {(event: { action: "history"|"manual" }) => void} [props.onSkillAction]
 */
export function ReportCopilot({
  open = false,
  title,
  eyebrow,
  summary,
  recommendations = [],
  periodHint = "",
  sources = [],
  answer = null,
  chat = [],
  prompt = "",
  commandHint,
  inputPlaceholder,
  answerLabel,
  history = [],
  skillMenu,
  flow,
  stream = true,
  onClose,
  returnFocusRef,
  onBack,
  onNewSession,
  onMaximize,
  onHistorySelect,
  onRecommendation,
  onAsk,
  onPromptChange,
  onFeedback,
  onChatFeedback,
  onCopy,
  onExplore,
  onAttach,
  onSelectSkill,
  onSkillAction,
}) {
  const [dock, setDock] = React.useState(null);
  const [collapsed, setCollapsed] = React.useState({});
  const [showAll, setShowAll] = React.useState(false);
  const [feedback, setFeedback] = React.useState(null);
  const inputRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const layerRef = React.useRef(null);
  const answerRef = React.useRef(null);
  /* Per-instance stream registry: cards inside this copilot cancel each other
     mid-stream, but a stream in another ReportCopilot is unaffected. */
  const streamRegistry = React.useRef(null);

  const answerOpen = Boolean(answer) || chat.length > 0;
  const chatMode = !answer && chat.length > 0;


  /* New answers reset the answer scroll + feedback (resetAiFeedback). */
  React.useEffect(() => {
    setFeedback(null);
    if (answerRef.current) answerRef.current.scrollTop = 0;
  }, [answer]);

  /* enterAiAnswerMode: docking a panel into the answer view resets whenever a
     fresh answer or the first chat exchange opens — but NOT when a follow-up
     question merely appends to the thread over an open answer. */
  const wasAnswerOpen = React.useRef(false);
  React.useEffect(() => {
    if (answerOpen && !wasAnswerOpen.current) setDock(null);
    wasAnswerOpen.current = answerOpen;
  }, [answerOpen]);
  React.useEffect(() => setDock(null), [answer]);

  const autoGrow = (el) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  /* The composer is host-controlled: external fills (history pick, skill
     select, explore option, submit clear, new session) all resize it. */
  React.useEffect(() => {
    if (inputRef.current) autoGrow(inputRef.current);
  }, [prompt]);

  const fillPrompt = (value) => {
    onPromptChange?.({ value });
    inputRef.current?.focus();
  };

  const newSession = () => {
    setDock(null);
    setShowAll(false);
    onNewSession?.({ reason: "new-session" });
    onPromptChange?.({ value: "" });
    inputRef.current?.focus();
  };

  const backToStart = () => {
    setDock(null);
    onBack?.({ reason: "back" });
  };

  const toggleDock = (name) => setDock((current) => (current === name ? null : name));
  const toggleCollapsed = (name) => setCollapsed((current) => ({ ...current, [name]: !current[name] }));

  const submit = (event) => {
    event.preventDefault();
    const question = prompt.trim();
    if (!question) return;
    onAsk?.({ question });
    onPromptChange?.({ value: "" });
  };

  const summarySection = (docked) =>
    summary ? (
      <CopilotSection
        index="01"
        className="mh-copilot__summary"
        heading="AI summary"
        chevron
        docked={docked}
        collapsed={Boolean(collapsed.summary)}
        onToggle={() => toggleCollapsed("summary")}
      >
        <div className="mh-copilot__summary-card">
          <div className="mh-copilot__summary-head">
            <span>{summary.title}</span>
            <i>{summary.status}</i>
          </div>
          <div className="mh-copilot__summary-body">
            {summary.paragraphs.map((segments, index) => (
              <p key={index}>
                {segments.map((segment, segIndex) =>
                  segment.tone ? (
                    <span key={segIndex} className={`mh-copilot__metric mh-copilot__metric--${segment.tone}`}>
                      {segment.text}
                    </span>
                  ) : (
                    <React.Fragment key={segIndex}>{segment.text}</React.Fragment>
                  ),
                )}
              </p>
            ))}
          </div>
        </div>
      </CopilotSection>
    ) : null;

  const startSection = (docked) => (
    <CopilotSection
      index="02"
      className="mh-copilot__start"
      heading="Scenario reports"
      docked={docked}
      collapsed={Boolean(collapsed.scenarios)}
      onToggle={() => toggleCollapsed("scenarios")}
      extra={
        <button
          type="button"
          className="mh-copilot__view-more"
          onClick={(event) => {
            event.stopPropagation();
            if (!showAll) setShowAll(true);
          }}
        >
          view more
        </button>
      }
    >
      <div className={cx("mh-copilot__recs", showAll && "is-show-all")}>
        {recommendations.map((rec, index) => (
          <button
            key={index}
            type="button"
            className={cx("mh-copilot__rec", index >= 3 && "mh-copilot__rec--extra")}
            onClick={() => onRecommendation?.({ index })}
          >
            <i className="mh-copilot__rec-index">{`0${index + 1}`}</i>
            <span className="mh-copilot__rec-body">
              <strong>{rec.title}</strong>
            </span>
            <span className="mh-copilot__rec-arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </div>
      <p className="mh-copilot__period-hint">{periodHint}</p>
    </CopilotSection>
  );

  return (
    <CopilotStreamContext.Provider value={streamRegistry}>
      <AssistantShell
        open={open}
        layerRef={layerRef}
        initialFocusRef={closeRef}
        actionFocusRef={inputRef}
        closeRef={closeRef}
        returnFocusRef={returnFocusRef}
        title={<div className="mh-copilot__head-title"><span>{eyebrow}</span><h2>{title}</h2></div>}
        classes={copilotShellClasses}
        history={history.map((item) => ({ id: item.id, title: item.title, subtitle: item.prompt, source: item }))}
        historyHeading={<strong>Recent Chats</strong>}
        historyAriaLabel="Recent Chats"
        historyCloseLabel="Close recent chats"
        shortMaximizeLabel
        onClose={onClose}
        onNewSession={newSession}
        onMaximize={onMaximize}
        onHistorySelect={(item) => {
          onHistorySelect?.(item);
          fillPrompt(item.prompt);
        }}
        renderSurface={({ header, body, composer, expanded }) => (
          <React.Fragment>
            <div data-mh-overlay-scrim className="mh-copilot__scrim" hidden={!open} onClick={() => onClose?.({ reason: "scrim" })} />
            <aside ref={layerRef} data-mh-overlay-surface className={cx("mh-copilot", open && "is-open", expanded && "mh-copilot--expanded")} aria-hidden={!open} aria-label="Report AI workspace" role="dialog" aria-modal={open} tabIndex={-1}>
              {header}{body}{composer}
            </aside>
          </React.Fragment>
        )}
        body={
          <React.Fragment>
        {answerOpen ? (
          <div className="mh-copilot__tools" aria-label="Report context shortcuts">
            <button
              type="button"
              className={cx("mh-copilot__tool", dock === "summary" && "is-active")}
              onClick={() => toggleDock("summary")}
            >
              AI summary
            </button>
            <button
              type="button"
              className={cx("mh-copilot__tool", dock === "scenarios" && "is-active")}
              onClick={() => toggleDock("scenarios")}
            >
              Scenario reports
            </button>
          </div>
        ) : null}
        {!answerOpen ? (
          <React.Fragment>
            {summarySection(false)}
            {startSection(false)}
          </React.Fragment>
        ) : null}
        {answerOpen ? (
          <section className={cx("mh-copilot__answer", chatMode && "is-chat-mode")} aria-live="polite" ref={answerRef}>
            <button type="button" className="mh-copilot__back" onClick={backToStart}>
              <span aria-hidden="true">←</span> Suggested questions
            </button>
            <div className="mh-copilot__dock">
              {dock === "summary" ? summarySection(true) : null}
              {dock === "scenarios" ? startSection(true) : null}
            </div>
            {!chatMode && answer ? (
              <React.Fragment>
                <span className="mh-copilot__answer-label">{answerLabel}</span>
                <h3 className="mh-copilot__answer-title">{answer.title}</h3>
                {answer.kind === "holistic" ? (
                  <HolisticReport data={answer.report} stream={stream} />
                ) : (
                  <React.Fragment>
                    <p className="mh-copilot__answer-summary">{answer.summary}</p>
                    {answer.findings?.length ? (
                      <div className="mh-copilot__findings">
                        {answer.findings.map((finding, index) => (
                          <div className="mh-copilot__finding" key={index}>
                            <span>{`0${index + 1}`}</span>
                            <div>
                              <strong>{finding.label}</strong>
                              <p>{finding.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </React.Fragment>
                )}
                <div className="mh-copilot__sources">
                  <span>Sources used</span>
                  <div>
                    {sources.map((source) => (
                      <a key={source.id} href={source.href}>
                        {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ) : null}
            {chat.length ? (
              <div className="mh-copilot__thread">
                {chat.map((entry, index) => (
                  <CopilotChatEntry
                    key={entry.id || index}
                    entry={entry}
                    stream={stream}
                    onChatFeedback={onChatFeedback}
                    onCopy={onCopy}
                    onExplore={(event) => {
                      fillPrompt(event.question);
                      onExplore?.(event);
                    }}
                  />
                ))}
              </div>
            ) : null}
            {!chatMode && answer ? (
              <div className="mh-copilot__feedback">
                <span>Was this answer helpful?</span>
                <div>
                  <button
                    type="button"
                    aria-pressed={feedback === "helpful"}
                    onClick={() => {
                      setFeedback("helpful");
                      onFeedback?.({ value: "helpful" });
                    }}
                  >
                    Helpful
                  </button>
                  <button
                    type="button"
                    aria-pressed={feedback === "not-helpful"}
                    onClick={() => {
                      setFeedback("not-helpful");
                      onFeedback?.({ value: "not-helpful" });
                    }}
                  >
                    Not helpful
                  </button>
                </div>
                <small className="mh-copilot__feedback-status" hidden={!feedback} aria-live="polite">
                  {feedback === "helpful"
                    ? "Thanks. This answer was marked helpful."
                    : "Thanks. This answer was marked not helpful."}
                </small>
              </div>
            ) : null}
          </section>
        ) : null}
          </React.Fragment>
        }
        composer={
        <form className="mh-copilot__command" onSubmit={submit}>
          <p className="mh-copilot__command-hint">{commandHint}</p>
          <div className="mh-copilot__command-box">
            <TextArea
              ref={inputRef}
              label="Ask the report copilot"
              rows={2}
              required
              placeholder={inputPlaceholder}
              value={prompt}
              onChange={(event) => {
                if (inputRef.current) autoGrow(inputRef.current);
                onPromptChange?.(event);
              }}
            />
            <div className="mh-copilot__command-footer">
              <div className="mh-copilot__command-actions">
                {skillMenu ? (
                  <SkillMenu
                    config={skillMenu}
                    composerRef={inputRef}
                    onAttach={onAttach}
                    onSelectSkill={(event) => {
                      fillPrompt("Use " + event.title + " to interpret this report.");
                      onSelectSkill?.(event);
                    }}
                    onAction={onSkillAction}
                  />
                ) : null}
                <button type="submit" className="mh-copilot__send" aria-label="Send question" disabled={!prompt.trim()}>
                  <span>ASK</span>
                </button>
              </div>
            </div>
          </div>
        </form>
        }
      />
      {flow ? <ModelFlowDialog {...flow} /> : null}
    </CopilotStreamContext.Provider>
  );
}
