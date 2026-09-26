import "../../tokens.css";
import React from "react";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { AssistantPanel } from "../../components/AssistantPanel/index.jsx";
import { FormField } from "../../components/FormField/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { ModelFlowDialog } from "../../components/ModelFlowDialog/index.jsx";
import { Tabs } from "../../components/Tabs/index.jsx";
import { normalizeOptions } from "../../cx.js";
import { Icon } from "../../icons.jsx";
import { Shell } from "../../pages/Shell/index.jsx";
import "./MediaTrackingDetailPage.css";


/**
 * Media Tracking Detail report page (media-tracking-detail.html): back link,
 * page head, Daily/Weekly/Monthly/Spot Info Mapping period tabs, a 15-field
 * filter grid, the dimension-notes paragraph, and a wide scrollable data
 * table. The assistant is the lite drawer variant (scope row, skill "+"
 * trigger, simple answer cards, "Recent Chats" popover).
 * @param {object} props
 * @param {string} [props.current] nav id for aria-current; the original media-tracking page marks no item
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {{ backHref?: string, backLabel?: string }} [props.toolbar={}]
 * @param {{ eyebrow?: string, title?: string }} [props.head={}]
 * @param {Array<{ id: string, label: string }>} [props.periods=[]]
 * @param {string} [props.period="monthly"]
 * @param {Array<{ name: string, label: string, required?: boolean, options?: Array<string|object>, placeholder?: string, defaultValue?: string }>} [props.filters=[]]
 * @param {Array<{ term: string, text: string }>} [props.notes=[]]
 * @param {{ title?: string, count?: string, columns?: Array<{ key: string, header: string }>, rows?: Array<object> }} [props.table={}]
 * @param {object} [props.assistant={}] AssistantPanel props (lite variant); `skillMenu`/`selectedSkill` pass through
 * @param {boolean} [props.assistantOpen=false]
 * @param {string} [props.prompt=""]
 * @param {object} [props.skillFlow] ModelFlowDialog props; `skillFlow.step` truthy renders the flow dialog
 * @param {(target: object) => void} [props.onNavigate]
 * @param {(event: { id: string, label: string }) => void} [props.onPeriodChange]
 * @param {(event: { name: string, value: string }) => void} [props.onFilterChange]
 * @param {() => void} [props.onOpenAssistant]
 * @param {(event: { reason: string }) => void} [props.onCloseAssistant]
 * @param {(event: object) => void} [props.onPromptChange]
 * @param {(event: object) => void} [props.onSubmit]
 * @param {(event: object) => void} [props.onSuggestion]
 * @param {() => void} [props.onNewSession]
 * @param {(event: object) => void} [props.onMaximize]
 * @param {(event: object) => void} [props.onHistory]
 * @param {(event: object) => void} [props.onHistorySelect]
 * @param {(event: { names: string[] }) => void} [props.onAttach]
 * @param {(event: { id?: string, type: string, title: string }) => void} [props.onSelectSkill]
 * @param {() => void} [props.onClearSkill]
 * @param {(event: { action: "history"|"manual" }) => void} [props.onSkillAction]
 */
export function MediaTrackingDetailPage({
  current,
  logo,
  navigation = [],
  toolbar = {},
  head = {},
  periods = [],
  period = "monthly",
  filters = [],
  notes = [],
  table = {},
  assistant = {},
  assistantOpen = false,
  prompt = "",
  skillFlow,
  onNavigate,
  onPeriodChange,
  onFilterChange,
  onOpenAssistant,
  onCloseAssistant,
  onPromptChange,
  onSubmit,
  onSuggestion,
  onNewSession,
  onMaximize,
  onHistory,
  onHistorySelect,
  onAttach,
  onSelectSkill,
  onClearSkill,
  onSkillAction,
}) {
  const assistantLauncherRef = React.useRef(null);
  return (
    <Shell tone="tracking">
      <Header logo={logo} items={navigation} current={current} highlightCurrent={false} onNavigate={onNavigate} />
      <main className="mh-tracking">
        <div className="mh-tracking__topbar">
          <a className="mh-tracking__back" href={toolbar.backHref || "#"} onClick={() => onNavigate?.({ href: toolbar.backHref })}>
            <Icon name="arrow-left" />
            <span>{toolbar.backLabel || "Back"}</span>
          </a>
        </div>
        <header className="mh-tracking__head">
          <span className="mh-tracking__eyebrow">{head.eyebrow}</span>
          <h1>{head.title}</h1>
        </header>
        <Tabs label="Period" items={periods} value={period} onChange={onPeriodChange} />
        <section className="mh-tracking__filters" aria-label="Filters">
          {filters.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              name={field.name}
              required={field.required}
              control="select"
              options={field.options || []}
              placeholder={field.placeholder}
              defaultValue={field.defaultValue ?? normalizeOptions(field.options)[0]?.value}
              onChange={onFilterChange}
            />
          ))}
        </section>
        <p className="mh-tracking__description">
          {notes.map((note, index) => (
            <React.Fragment key={note.term}>
              {index > 0 ? " " : null}
              <strong>{note.term}</strong>: {note.text}
            </React.Fragment>
          ))}
        </p>
        <section className="mh-tracking__table-wrap" aria-label="Data table">
          <header className="mh-tracking__table-head">
            <h2>{table.title}</h2>
            <span className="mh-tracking__count">
              {table.count}
              <Icon name="chevron-down" />
            </span>
          </header>
          <div className="mh-tracking__scroll">
            <table className="mh-tracking__table">
              <thead>
                <tr>
                  {(table.columns || []).map((column) => (
                    <th key={column.key}>{column.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(table.rows || []).map((row, index) => (
                  <tr key={index}>
                    {(table.columns || []).map((column) => (
                      <td key={column.key}>{row[column.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <AssistantLauncher ref={assistantLauncherRef} hidden={assistantOpen} onOpen={onOpenAssistant} />
      <AssistantPanel
        open={assistantOpen}
        returnFocusRef={assistantLauncherRef}
        placement="drawer"
        {...assistant}
        variant="lite"
        prompt={prompt}
        onClose={onCloseAssistant}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        onSuggestion={onSuggestion}
        onNewSession={onNewSession}
        onMaximize={onMaximize}
        onHistory={onHistory}
        onHistorySelect={onHistorySelect}
        onAttach={onAttach}
        onSelectSkill={onSelectSkill}
        onClearSkill={onClearSkill}
        onSkillAction={onSkillAction}
      />
      {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    </Shell>
  );
}
