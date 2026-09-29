import React from "react";
import { createPortal } from "react-dom";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AssistantDock,
  AssistantLauncher,
  AssistantPanel,
  CampaignPage,
  ConfirmDialog,
  Modal,
  ModelFlowDialog,
  ReportCopilot,
} from "./index.js";
import { demoContent } from "./demo/index.js";
import { DataModelView } from "./features/interpreter/DataModelView/index.jsx";
import { useDataModelDemo } from "./demo/data-model-demo.js";
import { useCampaignDemo } from "./demo/campaign-demo.js";
import { useOverlayLayer } from "./lib/overlay.js";

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
  const [submitted, setSubmitted] = React.useState(null);
  const props = useCampaignDemo({
    labels: demoContent.CAMPAIGN.labels,
    taskDialog: TASK_DIALOG,
    onSubmitTask: setSubmitted,
  });
  return (
    <div>
      <button type="button" onClick={() => props.onCreateTask({ reason: "button" })}>
        Open task
      </button>
      <CampaignPage {...props} />
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

function DeleteHost() {
  const [items, setItems] = React.useState(["Alpha", "Beta", "Gamma"]);
  const [pending, setPending] = React.useState(null);
  return (
    <div>
      <ul aria-label="items">
        {items.map((item) => <li key={item}><button type="button">{item}</button><button type="button" onClick={() => setPending(item)}>{`Delete ${item}`}</button></li>)}
      </ul>
      <ConfirmDialog open={Boolean(pending)} purpose="danger" title="Delete" message="Delete?" confirmLabel="Confirm Delete" onCancel={() => setPending(null)} onConfirm={() => { setItems((list) => list.filter((item) => item !== pending)); setPending(null); }} />
    </div>
  );
}

describe("nested overlays", () => {
  it("Escape closes only the top layer, restores focus in order, and unlocks after the last layer", () => {
    render(<NestedHost />);
    const launcher = screen.getByLabelText("Open AI assistant");
    launcher.focus();
    fireEvent.click(launcher);
    const panelClose = screen.getAllByLabelText("Close assistant").at(-1);
    panelClose.focus();
    fireEvent.click(screen.getByText("Open modal"));
    expect(document.querySelector(".mh-modal__dialog")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-modal__dialog")).toBeNull();
    expect(document.querySelector(".mh-assistant__dialog")).toBeTruthy();
    expect(document.activeElement).toBe(panelClose);
    expect(document.body.classList.contains("dialog-open")).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-assistant__dialog")).toBeNull();
    expect(document.activeElement).toBe(launcher);
    expect(document.body.classList.contains("dialog-open")).toBe(false);
  });

  it("returns focus to the list, not <body>, when the confirm deletes its opener", () => {
    render(<DeleteHost />);
    const opener = screen.getByText("Delete Beta");
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(screen.getByText("Confirm Delete"));
    expect(screen.queryByText("Delete Beta")).toBeNull();
    expect(document.activeElement).toBe(screen.getByText("Alpha"));
  });

  it("cycles Tab in the top layer and redirects programmatic focus from the background", () => {
    render(<><button type="button">Outside</button><Modal open title="Focus ring" onClose={() => {}}><button type="button">First</button><button type="button">Last</button></Modal></>);
    const dialog = document.querySelector(".mh-modal__dialog");
    const first = within(dialog).getByLabelText("Close");
    const last = within(dialog).getByText("Last");
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
    screen.getByText("Outside").focus();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("skips controls inside CSS-hidden ancestors when cycling the focus ring", () => {
    render(<Modal open title="Hidden descendants" onClose={() => {}}><div style={{ display: "none" }}><button type="button">Hidden</button></div><button type="button">Visible</button></Modal>);
    const dialog = document.querySelector(".mh-modal__dialog");
    const visible = within(dialog).getByText("Visible");
    const close = within(dialog).getByLabelText("Close");
    visible.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(visible);
  });

  it("cycles the AssistantPanel from its last control to its first without entering the backdrop", () => {
    render(<AssistantPanel open title="Panel" prompt="" onClose={() => {}} />);
    const panel = document.querySelector(".mh-assistant");
    const backdrop = panel.querySelector(".mh-assistant__backdrop");
    const first = within(panel).getByLabelText("New session");
    const last = panel.querySelector(".mh-assistant__box textarea");
    expect(backdrop.tabIndex).toBe(-1);
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);
    expect(document.activeElement).not.toBe(backdrop);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("orders nested layers opened in the same initial render, including StrictMode replay", () => {
    function Host() {
      const [outerOpen, setOuterOpen] = React.useState(true);
      const [innerOpen, setInnerOpen] = React.useState(true);
      return <Modal open={outerOpen} title="Outer" onClose={() => setOuterOpen(false)}><Modal open={innerOpen} title="Inner" onClose={() => setInnerOpen(false)}><button type="button">Inner action</button></Modal></Modal>;
    }
    render(<React.StrictMode><Host /></React.StrictMode>);
    const inner = screen.getByRole("dialog", { name: "Inner" });
    expect(inner.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Inner" })).toBeNull();
    expect(screen.getByRole("dialog", { name: "Outer" })).toBeTruthy();
    expect(document.body.classList.contains("dialog-open")).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Outer" })).toBeNull();
    expect(document.body.classList.contains("dialog-open")).toBe(false);
  });

  it("puts an initially open Copilot model flow above its workspace", () => {
    function Host() {
      const [workspaceOpen, setWorkspaceOpen] = React.useState(true);
      const [flowOpen, setFlowOpen] = React.useState(true);
      return <ReportCopilot open={workspaceOpen} stream={false} title="Workspace" summary={{ title: "Summary", paragraphs: [] }} recommendations={[]} flow={flowOpen ? { step: "history", onClose: () => setFlowOpen(false) } : null} onClose={() => setWorkspaceOpen(false)} />;
    }
    render(<React.StrictMode><Host /></React.StrictMode>);
    const flow = document.querySelector(".mh-flow__card");
    expect(flow.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-flow__card")).toBeNull();
    expect(document.querySelector(".mh-copilot.is-open")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-copilot.is-open")).toBeNull();
  });

  it("gives a nested Data Model table dialog the top Escape and restores its graph trigger", () => {
    function TableHost() {
      const [open, setOpen] = React.useState(true);
      const view = useDataModelDemo({ activeTab: "graph" });
      return <Modal open={open} title="Parent" onClose={() => setOpen(false)}><DataModelView {...view} /></Modal>;
    }
    render(<TableHost />);
    const graphNode = document.querySelector(".mh-dmview__node.is-fact");
    graphNode.focus();
    fireEvent.click(graphNode);
    expect(document.querySelector(".mh-dmview__dialog")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-dmview__dialog")).toBeNull();
    expect(document.querySelector(".mh-modal__dialog")).toBeTruthy();
    expect(document.activeElement).toBe(graphNode);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-modal__dialog")).toBeNull();
  });

  it("lets ModelFlowDialog close on Escape without also closing its parent", () => {
    function Host() {
      const [parentOpen, setParentOpen] = React.useState(true);
      const [flowOpen, setFlowOpen] = React.useState(false);
      return <><Modal open={parentOpen} title="Parent" onClose={() => setParentOpen(false)}><button type="button" onClick={() => setFlowOpen(true)}>Open flow</button></Modal>{flowOpen ? <ModelFlowDialog step="history" onClose={() => setFlowOpen(false)} /> : null}</>;
    }
    render(<Host />);
    const opener = screen.getByText("Open flow");
    opener.focus();
    fireEvent.click(opener);
    expect(document.querySelector(".mh-flow__card")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-flow__card")).toBeNull();
    expect(document.querySelector(".mh-modal__dialog")).toBeTruthy();
    expect(document.activeElement).toBe(opener);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-modal__dialog")).toBeNull();
  });

  it("preserves the assistant skill-menu Escape outcome: the menu and panel close together", () => {
    function Host() {
      const [open, setOpen] = React.useState(true);
      return <AssistantPanel open={open} title="Panel" prompt="" skillMenu={demoContent.CAMPAIGN.assistant.skillMenu} onClose={() => setOpen(false)} />;
    }
    render(<Host />);
    fireEvent.click(screen.getByLabelText("Choose AI skill"));
    expect(document.querySelector(".mh-skill")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-assistant")).toBeNull();
    expect(document.querySelector(".mh-skill")).toBeNull();
  });

  it("shares one stack across separate React roots without closing both instances", () => {
    const a = document.createElement("div");
    const b = document.createElement("div");
    document.body.append(a, b);
    const closeA = vi.fn();
    const closeB = vi.fn();
    const rootA = render(<Modal open title="A" onClose={closeA}><button>A action</button></Modal>, { container: a });
    const rootB = render(<Modal open title="B" onClose={closeB}><button>B action</button></Modal>, { container: b });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeB).toHaveBeenCalledOnce();
    expect(closeA).not.toHaveBeenCalled();
    rootB.unmount();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeA).toHaveBeenCalledOnce();
    rootA.unmount();
    a.remove();
    b.remove();
  });

  it("uses DOM stacking for independently mounted roots in one tick, then promotes a later-opened root", async () => {
    const a = document.createElement("div");
    const b = document.createElement("div");
    document.body.append(a, b);
    const closeA = vi.fn();
    const closeB = vi.fn();
    // B paints over A. Effects may register in the opposite order when roots
    // commit within one task, but the visible upper layer owns the first key.
    const rootB = render(<Modal open title="B" onClose={closeB}><button>B action</button></Modal>, { container: b });
    const rootA = render(<Modal open title="A" onClose={closeA}><button>A action</button></Modal>, { container: a });
    expect(screen.getByRole("dialog", { name: "B" }).contains(document.activeElement)).toBe(true);
    expect(Number(b.querySelector("[data-mh-overlay-surface]").style.zIndex)).toBeGreaterThan(Number(a.querySelector("[data-mh-overlay-surface]").style.zIndex));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeB).toHaveBeenCalledOnce();
    expect(closeA).not.toHaveBeenCalled();

    await act(async () => { await Promise.resolve(); });
    rootA.rerender(<Modal open={false} title="A" onClose={closeA}><button>A action</button></Modal>);
    rootA.rerender(<Modal open title="A" onClose={closeA}><button>A action</button></Modal>);
    expect(screen.getByRole("dialog", { name: "A" }).contains(document.activeElement)).toBe(true);
    expect(Number(a.querySelector("[data-mh-overlay-surface]").style.zIndex)).toBeGreaterThan(Number(b.querySelector("[data-mh-overlay-surface]").style.zIndex));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeA).toHaveBeenCalledOnce();
    rootA.unmount();
    rootB.unmount();
    a.remove();
    b.remove();
  });

  it("uses the higher natural z-index before DOM order for initially open surfaces", () => {
    function Layer({ name, zIndex, onClose }) {
      const layerRef = React.useRef(null);
      useOverlayLayer({ open: true, onClose, layerRef });
      return <div data-mh-overlay-surface style={{ position: "fixed", zIndex }}><section ref={layerRef} role="dialog" aria-label={name} tabIndex={-1}><button type="button">{name} action</button></section></div>;
    }
    const closeHigh = vi.fn();
    const closeLow = vi.fn();
    render(<><Layer name="High" zIndex={800} onClose={closeHigh} /><Layer name="Low" zIndex={100} onClose={closeLow} /></>);
    expect(screen.getByRole("dialog", { name: "High" }).contains(document.activeElement)).toBe(true);
    const surfaces = document.querySelectorAll("[data-mh-overlay-surface]");
    expect(Number(surfaces[0].style.zIndex)).toBeGreaterThan(Number(surfaces[1].style.zIndex));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeHigh).toHaveBeenCalledOnce();
    expect(closeLow).not.toHaveBeenCalled();
  });

  it("keeps an initially open nested child above its higher-z parent context", () => {
    function Layer({ name, zIndex, onClose, children }) {
      const layerRef = React.useRef(null);
      useOverlayLayer({ open: true, onClose, layerRef });
      return <div data-mh-overlay-surface style={{ position: "fixed", zIndex }}><section ref={layerRef} role="dialog" aria-label={name} tabIndex={-1}><button type="button">{name} action</button>{children}</section></div>;
    }
    const closeParent = vi.fn();
    const closeChild = vi.fn();
    render(<Layer name="Parent" zIndex={800} onClose={closeParent}><Layer name="Child" zIndex={100} onClose={closeChild} /></Layer>);
    expect(screen.getByRole("dialog", { name: "Child" }).contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeChild).toHaveBeenCalledOnce();
    expect(closeParent).not.toHaveBeenCalled();
  });

  it("keeps focus and the scroll lock on the upper layer when an underlying root unmounts", () => {
    const a = document.createElement("div");
    const b = document.createElement("div");
    document.body.append(a, b);
    const rootA = render(<Modal open title="Underlying" onClose={() => {}}><button>Under action</button></Modal>, { container: a });
    const rootB = render(<Modal open title="Upper" onClose={() => {}}><button>Upper action</button></Modal>, { container: b });
    const upper = screen.getByRole("dialog", { name: "Upper" });
    expect(upper.contains(document.activeElement)).toBe(true);
    rootA.unmount();
    expect(upper.contains(document.activeElement)).toBe(true);
    expect(document.body.classList.contains("dialog-open")).toBe(true);
    expect(b.querySelector("[data-mh-overlay-surface]").style.zIndex).toBe("");
    rootB.unmount();
    expect(document.body.classList.contains("dialog-open")).toBe(false);
    a.remove();
    b.remove();
  });

  it("restores the invoking launcher for each assistant instance when launchers hide on open", () => {
    function Pair({ name }) {
      const [open, setOpen] = React.useState(false);
      return <AssistantDock assistant={{ launcherLabel: name, open, title: name, onOpen: () => setOpen(true), onClose: () => setOpen(false) }} />;
    }
    render(<><Pair name="First" /><Pair name="Second" /></>);
    const launchers = screen.getAllByLabelText("Open AI assistant");
    for (const launcher of launchers) {
      launcher.focus();
      fireEvent.click(launcher);
      expect(document.body.classList.contains("dialog-open")).toBe(true);
      fireEvent.keyDown(document, { key: "Escape" });
      expect(document.activeElement).toBe(launcher);
      expect(document.body.classList.contains("dialog-open")).toBe(false);
    }
  });

  it("isolates stacks, Escape, and scroll locks by owner document", () => {
    const frame = document.createElement("iframe");
    document.body.append(frame);
    const frameDoc = frame.contentDocument;
    const closeMain = vi.fn();
    const closeFrame = vi.fn();
    const view = render(<><Modal open title="Main" onClose={closeMain}><button>Main action</button></Modal>{createPortal(<Modal open title="Frame" onClose={closeFrame}><button>Frame action</button></Modal>, frameDoc.body)}</>);
    expect(document.body.classList.contains("dialog-open")).toBe(true);
    expect(frameDoc.body.classList.contains("dialog-open")).toBe(true);
    fireEvent.keyDown(frameDoc, { key: "Escape" });
    expect(closeFrame).toHaveBeenCalledOnce();
    expect(closeMain).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeMain).toHaveBeenCalledOnce();
    view.unmount();
    expect(document.body.classList.contains("dialog-open")).toBe(false);
    expect(frameDoc.body.classList.contains("dialog-open")).toBe(false);
    frame.remove();
  });

  it("does not duplicate a layer or lose its scroll lock under StrictMode effect replay", () => {
    const close = vi.fn();
    const view = render(<React.StrictMode><Modal open title="Strict" onClose={close}><button>Action</button></Modal></React.StrictMode>);
    expect(document.body.classList.contains("dialog-open")).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(close).toHaveBeenCalledOnce();
    view.unmount();
    expect(document.body.classList.contains("dialog-open")).toBe(false);
  });

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
