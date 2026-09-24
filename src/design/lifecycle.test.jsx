import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AssistantLauncher,
  AssistantPanel,
  CampaignPage,
  Modal,
  ModelFlowDialog,
  ReportCopilot,
  demoContent,
} from "./index.js";

// jsdom does not implement scrollIntoView/scrollTo; the copilot chat entry and
// the assistant scroll effect call them.
window.HTMLElement.prototype.scrollIntoView ??= () => {};
window.HTMLElement.prototype.scrollTo ??= () => {};

afterEach(() => {
  document.body.classList.remove("dialog-open");
});

/* ------------------------------------------------------------------ *
 * 1. Campaign task dialog: the original native <dialog> never resets —
 *    Cancel, ×, scrim, Escape and Submit all keep the draft values.
 * ------------------------------------------------------------------ */

const TASK_DIALOG = {
  eyebrow: "Campaign execution",
  title: "Create Campaign Task",
  description: "Review the media action before it enters the automation queue.",
  fields: {
    actionLabel: "Action",
    actions: ["Bulk create plans", "Adjust daily budget"],
    platformLabel: "Platform",
    platforms: ["Rednote", "Douyin"],
    accountLabel: "Account",
    accounts: ["Coach_XHS_01", "Coach_XHS_02"],
  },
  object: { label: "Object", value: "341 plans" },
  preview: { eyebrow: "Review state", state: "Pending confirmation", note: "note" },
  cancelLabel: "Cancel",
  submitLabel: "Add to Review Queue",
};

function TaskHost() {
  const [open, setOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(null);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open task
      </button>
      <CampaignPage
        taskDialog={TASK_DIALOG}
        taskDialogOpen={open}
        onCloseTask={() => setOpen(false)}
        onSubmitTask={(event) => {
          setSubmitted(event);
          setOpen(false);
        }}
      />
      <output data-testid="submitted">{submitted ? JSON.stringify(submitted) : ""}</output>
    </div>
  );
}

function editDraft(container) {
  fireEvent.change(container.querySelector("input[name=object]"), { target: { value: "12 plans" } });
  fireEvent.change(container.querySelector("select[name=platform]"), { target: { value: "Douyin" } });
}

function assertDraftKept(container) {
  expect(container.querySelector("input[name=object]").value).toBe("12 plans");
  expect(container.querySelector("select[name=platform]").value).toBe("Douyin");
}

describe("Campaign task dialog draft persists", () => {
  const closes = {
    cancel: (container) => fireEvent.click(within(container).getByText("Cancel")),
    x: (container) => fireEvent.click(within(container).getByLabelText("Close")),
    scrim: (container) => fireEvent.click(container.querySelector(".mh-modal__scrim")),
    escape: () => fireEvent.keyDown(document, { key: "Escape" }),
  };
  for (const [name, close] of Object.entries(closes)) {
    it(`keeps field values across ${name} → reopen`, () => {
      const { container } = render(<TaskHost />);
      fireEvent.click(screen.getByText("Open task"));
      editDraft(container);
      close(container);
      expect(container.querySelector(".mh-modal")).toBeNull();
      fireEvent.click(screen.getByText("Open task"));
      assertDraftKept(container);
    });
  }

  it("keeps field values across Submit → reopen, and submits the edited draft", () => {
    const { container } = render(<TaskHost />);
    fireEvent.click(screen.getByText("Open task"));
    editDraft(container);
    fireEvent.click(within(container).getByText("Add to Review Queue"));
    expect(JSON.parse(screen.getByTestId("submitted").textContent)).toEqual({
      action: "Bulk create plans",
      platform: "Douyin",
      account: "Coach_XHS_01",
      object: "12 plans",
    });
    fireEvent.click(screen.getByText("Open task"));
    assertDraftKept(container);
  });
});

/* ------------------------------------------------------------------ *
 * 2. ModelFlow lifecycle: Generate → generated form; Back → history with
 *    ticks + rule intact and generated edits discarded; Cancel → reopen
 *    starts fresh.
 * ------------------------------------------------------------------ */

const FLOW_THREADS = [
  {
    title: "Chat one",
    messages: [
      { role: "user", text: "Message one", checked: false },
      { role: "assistant", label: "AI", title: "Answer", text: "Answer body", sources: ["S1"], checked: false },
    ],
  },
];

function FlowHost() {
  const [flow, setFlow] = React.useState(null);
  const open = () =>
    setFlow({
      step: "history",
      threads: FLOW_THREADS.map((t) => ({ ...t, messages: t.messages.map((m) => ({ ...m })) })),
      rule: "",
      draft: {},
    });
  return (
    <div>
      <button type="button" onClick={open}>
        Open flow
      </button>
      {flow ? (
        <ModelFlowDialog
          {...flow}
          onToggleMessage={({ threadIndex, messageIndex, checked }) =>
            setFlow((current) => ({
              ...current,
              threads: current.threads.map((t, ti) =>
                ti === threadIndex
                  ? { ...t, messages: t.messages.map((m, mi) => (mi === messageIndex ? { ...m, checked } : m)) }
                  : t,
              ),
            }))
          }
          onRuleChange={({ value }) => setFlow((current) => ({ ...current, rule: value }))}
          onGenerate={({ messages, rule }) =>
            setFlow((current) => ({ ...current, step: "generated", rule, draft: demoContent.buildModelDraft(messages, rule) }))
          }
          onBack={() => setFlow((current) => ({ ...current, step: "history" }))}
          onClose={() => setFlow(null)}
        />
      ) : null}
    </div>
  );
}

describe("ModelFlow lifecycle", () => {
  it("Back keeps ticks + rule and re-Generate re-drafts; Cancel → reopen is fresh", () => {
    const { container } = render(<FlowHost />);
    fireEvent.click(screen.getByText("Open flow"));
    // tick one message + type a rule
    fireEvent.click(container.querySelectorAll(".mh-flow__msg input")[0]);
    fireEvent.change(container.querySelector(".mh-flow__rule"), { target: { value: "keep drivers" } });
    fireEvent.click(screen.getByText("Generate"));
    // generated form — edit Name away from the draft default
    const name = container.querySelector("input[name=name]");
    const generatedName = name.value;
    expect(generatedName).toBeTruthy();
    fireEvent.change(name, { target: { value: "Edited Name" } });
    // Back: ticks + rule survive, generated edits are discarded
    fireEvent.click(screen.getByText("← Back"));
    expect(container.querySelectorAll(".mh-flow__msg input")[0].checked).toBe(true);
    expect(container.querySelector(".mh-flow__rule").value).toBe("keep drivers");
    fireEvent.click(screen.getByText("Generate"));
    expect(container.querySelector("input[name=name]").value).toBe(generatedName);
    // Cancel ends the flow; reopening starts fresh
    fireEvent.click(screen.getByText("Cancel"));
    expect(container.querySelector(".mh-flow")).toBeNull();
    fireEvent.click(screen.getByText("Open flow"));
    expect(container.querySelectorAll(".mh-flow__msg input")[0].checked).toBe(false);
    expect(container.querySelector(".mh-flow__rule").value).toBe("");
  });
});

/* ------------------------------------------------------------------ *
 * 3. Copilot stream registry is per-instance: a new card in instance A
 *    freezes A's stream but B keeps streaming; unmounting A leaves B alone.
 * ------------------------------------------------------------------ */

const HOLISTIC = {
  meta: [["Date", "x"]],
  blocks: [
    { type: "meta" },
    { type: "group", heading: { index: "I", title: "A" }, sub: "s", alerts: [{ dot: "g", segments: ["a"] }] },
    { type: "group", heading: { index: "II", title: "B" }, sub: "s" },
    { type: "group", heading: { index: "III", title: "C" }, sub: "s" },
    { type: "group", heading: { index: "IV", title: "D" }, sub: "s" },
    { type: "group", heading: { index: "V", title: "E" }, sub: "s" },
  ],
  chart: { periods: ["p1"], min: 0, max: 1, ticks: [0, 1], series: [{ name: "s", tone: "ink", values: [1] }] },
  dotLegend: [{ dot: "g", text: " legend" }],
};

const RICH_CARD = {
  lead: ["Lead text"],
  channelsTitle: "Channels",
  channelsSub: "sub",
  channels: [{ icon: "cart", tone: "retail", name: "Retail", uplift: "+1%", up: true, stats: [{ label: "L", value: "+1%", up: true }] }],
  insight: "insight",
  exploreTitle: "explore",
  exploreHint: "hint",
  explore: [{ icon: "chart", title: "x", sub: "y", question: "q" }],
};

function CopilotHost({ testId, mount = true, chat = [] }) {
  return (
    <div data-testid={testId}>
      {mount ? (
        <ReportCopilot
          open
          stream
          title={testId}
          summary={{ title: "S", paragraphs: [] }}
          recommendations={[]}
          answer={{ kind: "holistic", title: "Holistic", report: HOLISTIC }}
          chat={chat}
          prompt=""
        />
      ) : null}
    </div>
  );
}

const countBlocks = (testId) => screen.getByTestId(testId).querySelectorAll(".mh-stream-block").length;
/* The next stream block is scheduled from an effect, so each tick needs its
   own act() commit — one big advanceTimersByTime would batch to a single step. */
const tick = (ms, times = 1) => {
  for (let i = 0; i < times; i += 1) act(() => vi.advanceTimersByTime(ms));
};

describe("Copilot stream registry is instance-scoped", () => {
  it("two copilots stream independently; A's new card freezes only A; unmounting A lets B finish", () => {
    vi.useFakeTimers();
    try {
      const { rerender } = render(
        <React.Fragment>
          <CopilotHost testId="A" />
          <CopilotHost testId="B" />
        </React.Fragment>,
      );
      // both start streaming from zero
      expect(countBlocks("A")).toBe(0);
      expect(countBlocks("B")).toBe(0);
      tick(110, 3);
      expect(countBlocks("A")).toBe(3);
      expect(countBlocks("B")).toBe(3);
      // a new rich card in A freezes A's holistic stream mid-render
      rerender(
        <React.Fragment>
          <CopilotHost testId="A" chat={[{ kind: "rich", question: "q?", card: RICH_CARD, sources: ["s1"] }]} />
          <CopilotHost testId="B" />
        </React.Fragment>,
      );
      tick(140, 10);
      expect(countBlocks("B")).toBe(6); // B ran to completion
      expect(screen.getByTestId("A").querySelectorAll(".mh-holistic .mh-stream-block").length).toBeLessThan(6); // A's holistic froze partway
      expect(screen.getByTestId("A").querySelectorAll(".mh-ra-channel").length).toBeGreaterThan(0);
      // unmounting A does not disturb B
      rerender(
        <React.Fragment>
          <CopilotHost testId="A" mount={false} />
          <CopilotHost testId="B" />
        </React.Fragment>,
      );
      tick(110, 3);
      expect(countBlocks("B")).toBe(6);
      expect(screen.getByTestId("B").querySelector(".mh-stream-cursor")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

/* ------------------------------------------------------------------ *
 * 4. Nested overlays: ref-counted scroll lock + per-layer focus restore.
 * ------------------------------------------------------------------ */

function NestedHost() {
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <div>
      <AssistantLauncher onOpen={() => setPanelOpen(true)} />
      <AssistantPanel open={panelOpen} title="Panel" onClose={() => setPanelOpen(false)} prompt="" />
      <button type="button" onClick={() => setModalOpen(true)}>
        Open modal
      </button>
      <Modal open={modalOpen} title="Inner modal" onClose={() => setModalOpen(false)}>
        <p>body</p>
      </Modal>
    </div>
  );
}

describe("nested overlays", () => {
  it("closing the inner Modal keeps the lock and returns focus into the panel; closing the panel unlocks and refocuses the launcher", () => {
    render(<NestedHost />);
    const launcher = screen.getByLabelText("Open AI assistant");
    launcher.focus();
    fireEvent.click(launcher);
    expect(document.body.classList.contains("dialog-open")).toBe(true);
    // simulate the user having interacted with something inside the panel
    const panelClose = screen.getAllByLabelText("Close assistant").at(-1);
    panelClose.focus();
    fireEvent.click(screen.getByText("Open modal"));
    expect(document.body.classList.contains("dialog-open")).toBe(true);
    const dialog = document.querySelector(".mh-modal__dialog");
    expect(dialog).toBeTruthy();
    // close the Modal → page still locked, focus back inside the panel
    fireEvent.click(within(dialog).getByLabelText("Close"));
    expect(document.querySelector(".mh-modal")).toBeNull();
    expect(document.body.classList.contains("dialog-open")).toBe(true);
    expect(document.activeElement).toBe(panelClose);
    // close the panel → lock released, focus back on the launcher
    fireEvent.click(panelClose);
    expect(document.body.classList.contains("dialog-open")).toBe(false);
    expect(document.activeElement).toBe(launcher);
  });

  it("unmounting the inner overlay while open also keeps the outer lock", () => {
    function Host() {
      const [modalOpen, setModalOpen] = React.useState(false);
      return (
        <div>
          <AssistantPanel open title="Panel" onClose={() => {}} prompt="" />
          <button type="button" onClick={() => setModalOpen(true)}>
            Open modal
          </button>
          {modalOpen ? (
            <Modal open title="Inner" onClose={() => setModalOpen(false)}>
              <p>x</p>
            </Modal>
          ) : null}
        </div>
      );
    }
    render(<Host />);
    fireEvent.click(screen.getByText("Open modal"));
    expect(document.body.classList.contains("dialog-open")).toBe(true);
    // unmount the modal outright
    fireEvent.click(within(document.querySelector(".mh-modal")).getByLabelText("Close"));
    expect(document.body.classList.contains("dialog-open")).toBe(true);
  });
});

/* ------------------------------------------------------------------ *
 * 5. New Session regression: copilot + assistant clear via host callbacks.
 * ------------------------------------------------------------------ */

describe("New Session clears answers/chat", () => {
  it("ReportCopilot New Session asks the host to reset and clears the composer", () => {
    function Host() {
      const [answer, setAnswer] = React.useState({ kind: "standard", title: "T", summary: "S", findings: [], sources: [] });
      const [prompt, setPrompt] = React.useState("typed");
      return (
        <ReportCopilot
          open
          stream={false}
          title="C"
          summary={{ title: "S", paragraphs: [] }}
          recommendations={[]}
          answer={answer}
          chat={[]}
          prompt={prompt}
          onNewSession={() => setAnswer(null)}
          onPromptChange={({ value }) => setPrompt(value)}
        />
      );
    }
    const { container } = render(<Host />);
    expect(within(container).getByText("T")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("New session"));
    expect(within(container).queryByText("T")).toBeNull();
    expect(container.querySelector("textarea").value).toBe("");
  });

  it("AssistantPanel New Session delegates to the host which clears answers", () => {
    function Host() {
      const [answers, setAnswers] = React.useState([{ query: "q", title: "A1", body: "b", sources: [] }]);
      return <AssistantPanel open title="P" prompt="" answers={answers} onNewSession={() => setAnswers([])} />;
    }
    const { container } = render(<Host />);
    expect(within(container).getByText("A1")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("New session"));
    expect(within(container).queryByText("A1")).toBeNull();
  });
});
