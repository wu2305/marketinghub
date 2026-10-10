/* A consumer-built report desk that owns a Report Copilot (Phase 3 WP5, step 4).
 *
 * Unlike CockpitApp this app does not use a page: it is its own layout (a report
 * picker and a summary) and mounts the public `ReportCopilot` drawer next to it.
 * Everything the Copilot shows is this app's state: which report is selected,
 * whether the drawer is open, the composer text, the open answer and the chat.
 *
 * The rule it demonstrates: a thread belongs to one report. Whenever the selected
 * report changes, the thread is emptied during that same render, so no frame shows
 * report A's answer under report B's profile; closing and reopening the drawer on
 * the same report keeps it, and a report you come back to starts fresh.
 */
import React from "react";
import { Button, ReportCopilot, Select } from "marketing-hub";
import { EMPTY_THREAD, answerThread, askThread, chatEntry, sourcesFor, type Report, type Thread } from "./copilotThread";
import { demoData, type CockpitData } from "./CockpitApp.tsx";

type Entry = { key: string; project: string; report: Report };

/** Every report of every project, in catalog order. */
const entriesOf = (data: CockpitData): Entry[] =>
  Object.entries(data.projects).flatMap(([project, { reports }]) => reports.map((report, index) => ({ key: `${project}:${index}`, project, report })));

/**
 * @param props.data catalog, knowledge and Copilot content (defaults to the demo's)
 */
export function ReportCopilotApp({ data = demoData }: { data?: CockpitData }) {
  const entries = entriesOf(data);
  const [selected, setSelected] = React.useState(entries[0]?.key ?? "");
  const [open, setOpen] = React.useState(false);
  const [thread, setThread] = React.useState<Thread>(EMPTY_THREAD);

  const current = entries.find((entry) => entry.key === selected) ?? entries[0];
  const report = current?.report;
  /* The thread is about `threadOf`; when the report changes, empty it before painting. */
  const [threadOf, setThreadOf] = React.useState(current?.key);
  if (threadOf !== current?.key) {
    setThreadOf(current?.key);
    setThread(EMPTY_THREAD);
  }

  const sources = sourcesFor(report, data.knowledge, (type) => `#interpreter?type=${type}`);

  return (
    <div style={{ minHeight: "100vh", background: "var(--mh-surface-page)", color: "var(--mh-text)", fontFamily: "var(--mh-font-sans)", padding: "var(--mh-space-6)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: "var(--mh-space-5)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--mh-font-size-2xl)", color: "var(--mh-text-strong)" }}>Report desk</h1>
        <div style={{ display: "flex", gap: "var(--mh-space-3)", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px" }}>
            <Select
              label="Report"
              value={current?.key}
              options={entries.map((entry) => ({ value: entry.key, label: `${data.projects[entry.project].title}: ${entry.report.title}` }))}
              onChange={({ value }) => setSelected(value)}
            />
          </div>
          <Button icon="spark" expanded={open} onClick={() => setOpen(true)}>
            {data.copilot.eyebrow}
          </Button>
        </div>
        {report ? (
          <section aria-label="Selected report" style={{ background: "var(--mh-surface)", border: "1px solid var(--mh-line)", borderRadius: "var(--mh-radius-surface)", padding: "var(--mh-space-5)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--mh-font-size-heading)", color: "var(--mh-text-strong)" }}>{report.title}</h2>
            <p style={{ color: "var(--mh-text-muted)" }}>{report.description}</p>
          </section>
        ) : null}
      </div>
      <ReportCopilot
        open={open}
        title={report?.assistant?.panelTitle ?? data.copilot.defaultTitle ?? "Report Copilot"}
        eyebrow={data.copilot.eyebrow}
        summary={data.copilot.summary}
        recommendations={(report?.recommendations ?? []).map((item) => ({ title: item.title }))}
        periodHint={report?.assistant?.periodHint ?? ""}
        sources={sources}
        contextHref="#interpreter"
        answer={thread.answer}
        chat={thread.chat}
        prompt={thread.prompt}
        history={data.copilot.history}
        commandHint={data.copilot.commandHint}
        inputPlaceholder={data.copilot.inputPlaceholder}
        answerLabel={data.copilot.answerLabel}
        onClose={() => setOpen(false)}
        onBack={() => setThread((prior) => ({ ...prior, answer: null, chat: [] }))}
        onNewSession={() => setThread(() => EMPTY_THREAD)}
        onRecommendation={({ index }) => setThread((prior) => answerThread(prior, report, index))}
        onAsk={({ question }) => setThread((prior) => askThread(prior, question, chatEntry(question, report, data.copilot.eyebrow, sources)))}
        onPromptChange={({ value }) => setThread((prior) => ({ ...prior, prompt: value }))}
      />
    </div>
  );
}
