import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiInterpreterPage } from "./pages/AiInterpreterPage/index.jsx";
import { buildInterpreterAnswer, useInterpreterDemo } from "./demo/interpreter-demo.js";
import { INTERPRETER, MODEL_FLOW, buildModelDraft } from "./content.js";

Element.prototype.scrollTo ??= () => {};

const baseProps = {
  hero: INTERPRETER.hero,
  overviewItem: INTERPRETER.overview,
  sidebarTitle: INTERPRETER.sidebarTitle,
  copy: INTERPRETER.copy,
  types: INTERPRETER.types,
};

const demoInputs = {
  types: INTERPRETER.types,
  records: INTERPRETER.records,
  principles: {
    items: INTERPRETER.principles,
    strings: INTERPRETER.principlesLibrary,
  },
  businessTermLibrary: INTERPRETER.businessTermLibrary,
  scenarioReports: INTERPRETER.scenarioReports,
};

/* The dedicated views need the page-level container (same wiring as the
   pages--interpreter story): useInterpreterDemo holds the filter/search/page
   state and produces the active `view` plus an independent overlay slot. */
function Page(props) {
  const { activeType: initialType = "overview", ...rest } = props;
  const demo = useInterpreterDemo({ ...demoInputs, ...rest, activeType: initialType });
  return <AiInterpreterPage {...baseProps} {...rest} {...demo} activeType={initialType} />;
}

function renderPage(props = {}) {
  return render(<Page {...props} />);
}

// Mirrors the story wiring: controlled props driven by state, so clicks in the
// UI exercise the real filtering path.
function Harness({ onSelectType, ...rest }) {
  const [activeType, setActiveType] = React.useState(rest.activeType ?? "overview");
  const demo = useInterpreterDemo({
    ...demoInputs,
    activeType,
    ...rest,
    query: rest.query,
    principles: { ...demoInputs.principles, ...rest.principles },
  });
  return (
    <AiInterpreterPage
      {...baseProps}
      {...rest}
      {...demo}
      activeType={activeType}
      onSelectType={(event) => {
        setActiveType(event.id);
        onSelectType?.(event);
      }}
    />
  );
}


describe("AI Interpreter type contract", () => {
  it("filters records by stable typeId even when the visible title changes", () => {
    const renamed = INTERPRETER.types.map((type) =>
      type.id === "Scenario Reporting" ? { ...type, title: "Renamed Scenarios" } : type,
    );
    renderPage({ types: renamed, activeType: "Scenario Reporting" });
    /* scenario-reports.js swaps in its own card grid — assert on the cards. */
    const titles = [...document.querySelectorAll(".mh-srview__card h3")].map((el) => el.textContent);
    expect(titles.some((text) => text.includes("Channel Performance Analysis"))).toBe(true);
    expect(titles.every((text) => !text.includes("GMV (Gross Merchandise Value)"))).toBe(true);
    expect(screen.getAllByText("Renamed Scenarios").length).toBeGreaterThan(0);
  });

  it("shows an explicit empty state for an unknown type instead of all records", () => {
    renderPage({ activeType: "not-a-real-type" });
    expect(screen.getByText("Unknown knowledge type")).toBeTruthy();
    expect(document.querySelectorAll(".mh-asset").length).toBe(0);
    expect(screen.queryByText("Trusted analysis guardrails")).toBeNull();
  });

  it("uses host copy for every knowledge shell label and callback", () => {
    const onNavigate = vi.fn();
    const onAssistantOpen = vi.fn();
    const copy = {
      unknown: {
        typeTitle: "Unsupported kind",
        typeDescription: ({ typeId, count }) => `Choose one of ${count} kinds instead of ${typeId}.`,
        viewTitle: "Unsupported view",
      },
      stats: {
        fallbackUnit: "widgets",
        publishedLabel: "Ready items",
        monthlyLabel: "Fresh items",
        governedCaption: ({ unit }) => `Governed ${unit}`,
        addedCaption: ({ unit }) => `Added ${unit}`,
      },
      heroAsideLabel: ({ typeTitle }) => typeTitle ? `Statistics for ${typeTitle}` : "Statistics for all kinds",
      management: {
        triggerLabel: "Usage policy",
        title: "Team guidance",
        rules: ["Ask your owner before editing.", "Keep the record available."],
      },
      assistantLabel: "Knowledge helper",
    };
    const types = INTERPRETER.types.map((type) => type.id === "Business Term"
      ? { ...type, stats: { ...type.stats, units: [], total: 1, monthly: 2 } }
      : type);
    const hero = { ...INTERPRETER.hero, stats: [...INTERPRETER.hero.stats].reverse() };
    const { unmount } = renderPage({ activeType: "Business Term", types, hero, copy, onNavigate, assistant: { ...INTERPRETER.assistant, onOpen: onAssistantOpen } });
    expect(screen.getByText("Ready items")).toBeTruthy();
    expect(screen.getByText("Fresh items")).toBeTruthy();
    expect(screen.getByText("Governed widget")).toBeTruthy();
    expect(screen.getByText("Added widgets")).toBeTruthy();
    expect(screen.queryByText("Published Knowledge")).toBeNull();
    expect(screen.queryByText("New This Month")).toBeNull();
    expect(screen.getByRole("group", { name: "Statistics for Business Terms" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Usage policy" })).toBeTruthy();
    expect(screen.getByText("Team guidance")).toBeTruthy();
    expect(screen.getByText("Ask your owner before editing.")).toBeTruthy();
    expect(screen.getByText("Keep the record available.")).toBeTruthy();
    fireEvent.click(screen.getByText("Knowledge helper").closest("button"));
    expect(screen.getByRole("dialog", { name: "Ask AI Interpreter" })).toBeTruthy();
    expect(onAssistantOpen).toHaveBeenCalledWith({ reason: "open", typeId: "Business Term" });
    expect(onNavigate).not.toHaveBeenCalled();

    unmount();
    const unknown = renderPage({ activeType: "other", types, hero, copy });
    expect(screen.getByText("Unsupported kind")).toBeTruthy();
    expect(screen.getByText(`Choose one of ${types.length} kinds instead of other.`)).toBeTruthy();
    expect(screen.getByRole("group", { name: "Statistics for all kinds" })).toBeTruthy();
    unknown.unmount();
    renderPage({ activeType: "Business Term", types: types.map((type) => type.id === "Business Term" ? { ...type, view: "unregistered" } : type), hero, copy });
    expect(screen.getByText("Unsupported view")).toBeTruthy();
  });

  it("hides create controls on read-only types and shows them on manageable types", () => {
    const { unmount } = renderPage({ activeType: "Principles" });
    expect(screen.queryByRole("button", { name: /Add|Create/i })).toBeNull();

    unmount();
    renderPage({ activeType: "Business Term" });
    /* The dedicated view's Add control is a real link to the M5 create page
       (business-term-library.js renders <a target="_blank">). */
    expect(screen.getByRole("link", { name: "Add Business Term" })).toBeTruthy();
  });

  it("does not expose a create action on read-only types even when onCreate is provided", () => {
    const onCreate = vi.fn();
    renderPage({ activeType: "Email Reports", onCreate });
    expect(screen.queryByRole("button", { name: /Add|Create/i })).toBeNull();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("switches across all eight knowledge types", () => {
    render(<Harness onSelectType={() => {}} />);
    for (const type of INTERPRETER.types) {
      fireEvent.click(screen.getAllByRole("button", { name: new RegExp(type.title) })[0]);
      // types.js: ?type=Principles swaps the asset table for the card grid.
      if (type.view === "principles") {
        const cards = document.querySelectorAll(".mh-principle");
        expect(cards.length).toBe(INTERPRETER.principles.length);
        expect(document.querySelector(".mh-asset")).toBeNull();
        continue;
      }
      // business-term-library.js swaps in #businessTermOverview's term cards.
      if (type.view === "business-term") {
        const cards = document.querySelectorAll(".mh-btview__card");
        expect(cards.length).toBe(INTERPRETER.businessTermLibrary.records.length);
        expect(document.querySelector(".mh-asset")).toBeNull();
        continue;
      }
      // field-library.js swaps in #fmLibrary's per-type card grid.
      if (type.view === "field-library") {
        const expected = INTERPRETER.records.filter((record) => record.typeId === type.id);
        const cards = document.querySelectorAll(".mh-flview__card");
        expect(cards.length).toBe(expected.length);
        expect(document.querySelector(".mh-asset")).toBeNull();
        continue;
      }
      // scenario-reports.js swaps in #scenarioReportOverview's two-column cards.
      if (type.view === "scenario-reports") {
        const cards = document.querySelectorAll(".mh-srview__card");
        expect(cards.length).toBe(INTERPRETER.scenarioReports.records.length);
        expect(document.querySelector(".mh-asset")).toBeNull();
        continue;
      }
      // data-model-browser.js swaps in #dataModelOverview's domain browser —
      // the hidden "Customer Growth" domain never renders.
      if (type.view === "data-model") {
        const cards = document.querySelectorAll(".mh-dmview__domain");
        expect(cards.length).toBe(3);
        expect(document.querySelector(".mh-asset")).toBeNull();
        continue;
      }

    }
  });

  it("peeks the Report Context drawer from the Data Model related reports", () => {
    /* data-model-browser.js related-report buttons dispatch reportcontext:view
       → field-library.js opens the fm drawer over the current type page. */
    render(<Harness activeType="Data Model" />);
    fireEvent.click(screen.getByRole("button", { name: "Open 4P Report Report Context" }));
    const drawer = document.querySelector(".mh-modal--drawer");
    expect(drawer).toBeTruthy();
    expect(drawer.querySelector(".mh-modal__eyebrow").textContent).toBe("Report Context");
    /* stays on the Data Model page — the type view is still the domain shell */
    expect(document.querySelector(".mh-dmview__shell")).toBeTruthy();
  });

  it("skips inactive view derivation and accepts an independent host overlay", () => {
    const poison = { get status() { throw new Error("inactive Business Term filter evaluated"); } };
    const businessRecordPoison = { get status() { throw new Error("inactive Business Term record normalized"); } };
    const poisonedDomains = [{ get hidden() { throw new Error("inactive Data Model derived"); } }];
    const scenarioPoison = { get process() { throw new Error("inactive Scenario filter evaluated"); } };
    const fieldPoison = { get status() { throw new Error("inactive Field Library filter evaluated"); } };
    const scenarioRecordPoison = { get title() { throw new Error("inactive Scenario record normalized"); } };
    const fieldRecordPoison = { get typeId() { throw new Error("inactive Field Library record normalized"); } };
    const probeInputs = {
      ...demoInputs,
      records: [fieldRecordPoison],
      activeType: "Principles",
      businessTermLibrary: { ...demoInputs.businessTermLibrary, records: [businessRecordPoison], selected: poison },
      dataModel: { domains: poisonedDomains },
      scenarioReports: { ...demoInputs.scenarioReports, records: [scenarioRecordPoison], filterValues: scenarioPoison },
      fieldLibrary: { selected: fieldPoison },
    };
    function ActiveProbe() {
      const props = useInterpreterDemo(probeInputs);
      return <AiInterpreterPage {...baseProps} {...props} activeType="Principles" overlay={<div data-testid="host-overlay">Host overlay</div>} />;
    }
    render(<ActiveProbe />);
    expect(screen.getByTestId("host-overlay").textContent).toBe("Host overlay");
    expect(document.querySelectorAll(".mh-principle").length).toBe(INTERPRETER.principles.length);
  });

  it("includes typeId in view, Data Model, overlay, and shell callbacks", () => {
    const onOpenReportContext = vi.fn();
    const onSelectDomain = vi.fn();
    const onCloseDetail = vi.fn();
    const { unmount } = render(<Harness activeType="Data Model" onOpenReportContext={onOpenReportContext} onSelectDomain={onSelectDomain} onCloseDetail={onCloseDetail} />);
    fireEvent.click(screen.getByRole("button", { name: "Open 4P Report Report Context" }));
    expect(onOpenReportContext).toHaveBeenCalledWith({ typeId: "Data Model", id: "fourp-report-context" });
    fireEvent.click(screen.getByRole("button", { name: "Close details" }));
    expect(onCloseDetail).toHaveBeenCalledWith(expect.objectContaining({ typeId: "Data Model" }));
    fireEvent.click(document.querySelectorAll(".mh-dmview__domain")[1]);
    expect(onSelectDomain).toHaveBeenCalledWith(expect.objectContaining({ typeId: "Data Model" }));
    unmount();
    const onAction = vi.fn();
    render(<Harness activeType="Business Term" onAction={onAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Disable GMV (Gross Merchandise Value)" }));
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ typeId: "Business Term", action: "disable" }));
  });

  it("fires onSelectType with the stable type id", () => {
    const onSelectType = vi.fn();
    renderPage({ onSelectType });
    fireEvent.click(screen.getAllByRole("button", { name: /Metric Dictionary/ })[0]);
    expect(onSelectType).toHaveBeenCalledWith({ id: "Metric Dictionary", label: "Metric Dictionary", typeId: "overview" });
  });

  it("filters scenario records by process stage and AI availability independently", () => {
    render(<Harness activeType="Scenario Reporting" />);
    const cardTitles = () => [...document.querySelectorAll(".mh-srview__card h3")].map((el) => el.textContent);
    const process = screen.getByLabelText("Process");
    fireEvent.change(process, { target: { value: "Queued" } });
    let titles = cardTitles();
    expect(titles.length).toBe(1);
    expect(titles[0]).toContain("Channel Exception Watch");

    fireEvent.change(process, { target: { value: "" } });
    const status = screen.getByLabelText("Status");
    fireEvent.change(status, { target: { value: "Disabled" } });
    titles = cardTitles();
    expect(titles.length).toBe(2);
    expect(titles.some((text) => text.includes("Channel Performance Analysis"))).toBe(true);
    expect(titles.some((text) => text.includes("Channel Exception Watch"))).toBe(true);
  });

  it("renders the dedicated Business Term view", () => {
    render(<Harness activeType="Business Term" />);
    expect(document.querySelectorAll(".mh-btview__card").length).toBe(
      INTERPRETER.businessTermLibrary.records.length,
    );
    expect(document.querySelector(".mh-asset")).toBeNull();
    expect(screen.getByLabelText("Search knowledge")).toBeTruthy();
    /* the "AI Interpreter" launcher stays visible on the dedicated page. */
    expect(document.querySelector(".mh-launcher")).toBeTruthy();
  });

  it("query narrows principle cards and produces the dedicated empty state", () => {
    render(<Harness activeType="Principles" />);
    fireEvent.change(screen.getByLabelText("Search knowledge"), { target: { value: "requested scope" } });
    expect(document.querySelectorAll(".mh-principle").length).toBe(1);
    expect(document.querySelector(".mh-principle").textContent).toContain("Match the Requested Scope");

    fireEvent.change(screen.getByLabelText("Search knowledge"), { target: { value: "zzzzz" } });
    expect(document.querySelectorAll(".mh-principle").length).toBe(0);
    expect(screen.getByText("No matching principles. Change the category or search.")).toBeTruthy();
  });

  it("filters principle cards by the category checkbox set", () => {
    render(<Harness activeType="Principles" />);
    fireEvent.click(screen.getByLabelText("System"));
    expect(document.querySelectorAll(".mh-principle").length).toBe(1);
    expect(document.querySelector(".mh-principle").textContent).toContain("Handle Runtime Context Carefully");
    expect(screen.getByText("1 selected")).toBeTruthy();
  });

  it("scopes the '/' shortcut to one instance when two pages are mounted", () => {
    render(
      <>
        <Harness activeType="Principles" />
        <Harness activeType="Principles" />
      </>,
    );
    const searches = screen.getAllByLabelText("Search knowledge");
    expect(searches.length).toBe(2);
    /* Focus on body: only the most recently mounted instance answers. */
    fireEvent.keyDown(document, { key: "/" });
    expect(document.activeElement).toBe(searches[1]);

    /* Focus inside the first instance routes the keypress back to it. */
    const firstSidebarItem = document.querySelectorAll(".mh-interpreter")[0].querySelector("button");
    firstSidebarItem.focus();
    fireEvent.keyDown(document, { key: "/" });
    expect(document.activeElement).toBe(searches[0]);
  });
});

describe("AI Interpreter assistant demo", () => {
  it("uses knowledge suggestions, replaces answers, and types every host callback", () => {
    const onOpen = vi.fn();
    const onSuggestion = vi.fn();
    const onSubmit = vi.fn();
    const onHistorySelect = vi.fn();
    const onHistory = vi.fn();
    const onMaximize = vi.fn();
    const onFeedback = vi.fn();
    const onNewSession = vi.fn();
    const onClose = vi.fn();
    const assistant = { ...INTERPRETER.assistant, onOpen, onSuggestion, onSubmit, onHistorySelect, onHistory, onMaximize, onFeedback, onNewSession, onClose };
    renderPage({ activeType: "Business Term", assistant, demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft } });
    const launcher = screen.getByRole("button", { name: "Open AI assistant" });
    fireEvent.click(launcher);
    expect(onOpen).toHaveBeenCalledWith({ reason: "open", typeId: "Business Term" });
    fireEvent.click(screen.getByRole("button", { name: "Definition of Attributed ROI" }));
    expect(onSuggestion).toHaveBeenCalledWith({ prompt: INTERPRETER.assistant.suggestions[0].prompt, typeId: "Business Term" });
    expect(screen.getByText("Context: Knowledge Base")).toBeTruthy();
    expect(document.querySelectorAll(".mh-assistant__finding")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "Maximize AI Interpreter panel" }));
    expect(onMaximize).toHaveBeenCalledWith({ expanded: true, typeId: "Business Term" });
    fireEvent.click(screen.getByRole("button", { name: "Restore AI Interpreter panel" }));
    fireEvent.click(document.querySelector(".mh-assistant__feedback button[data-kind='helpful']"));
    expect(onFeedback).toHaveBeenCalledWith({ query: INTERPRETER.assistant.suggestions[0].prompt, feedback: "helpful", typeId: "Business Term" });
    const composer = screen.getByRole("textbox", { name: "Ask AI Interpreter AI" });
    fireEvent.change(composer, { target: { value: "A second knowledge question" } });
    fireEvent.keyDown(composer, { key: "Enter" });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    expect(onSubmit).toHaveBeenCalledWith({ prompt: "A second knowledge question", typeId: "Business Term" });
    expect(document.querySelectorAll(".mh-assistant__answer")).toHaveLength(1);
    expect(screen.getByText("A second knowledge question")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    expect(onHistory).toHaveBeenCalledWith({ open: true, typeId: "Business Term" });
    fireEvent.click(document.querySelector(".mh-assistant__history-item"));
    expect(composer.value).toBe(INTERPRETER.assistant.history[0].prompt);
    expect(onHistorySelect).toHaveBeenCalledWith({ label: INTERPRETER.assistant.history[0].label, prompt: INTERPRETER.assistant.history[0].prompt, typeId: "Business Term" });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "New session" }));
    expect(onNewSession).toHaveBeenCalledWith({ typeId: "Business Term" });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-assistant")).toBeNull();
    expect(document.activeElement).toBe(launcher);
    expect(onClose).toHaveBeenCalledWith({ reason: "escape", typeId: "Business Term" });
  });

  it("uses the one loaded knowledge skill and sends typed skill events", () => {
    const onSelectSkill = vi.fn();
    const onSkillAction = vi.fn();
    const onAttach = vi.fn();
    const onClearSkill = vi.fn();
    const onFlowSubmit = vi.fn();
    renderPage({ activeType: "Analytical Model", assistant: { ...INTERPRETER.assistant, onSelectSkill, onSkillAction, onAttach, onClearSkill }, demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft }, onFlowSubmit });
    fireEvent.click(screen.getByRole("button", { name: "Open AI assistant" }));
    fireEvent.click(screen.getByRole("button", { name: "Choose AI skill" }));
    const fileInput = document.querySelector('.mh-ai-skill-menu input[type="file"]') || document.querySelector('.mh-assistant input[type="file"]');
    expect(fileInput).toBeTruthy();
    fireEvent.change(fileInput, { target: { files: [new File(["x"], "knowledge.csv", { type: "text/csv" })] } });
    expect(onAttach).toHaveBeenCalledWith({ names: ["knowledge.csv"], typeId: "Analytical Model" });
    fireEvent.click(screen.getByRole("menuitem", { name: /Analytical Model/ }));
    expect(document.querySelectorAll(".mh-skill__option")).toHaveLength(1);
    fireEvent.click(document.querySelector(".mh-skill__option"));
    expect(onSelectSkill).toHaveBeenCalledWith(expect.objectContaining({ id: "playbook-opportunity-scan", typeId: "Analytical Model" }));
    fireEvent.click(document.querySelector(".mh-assistant__chip button"));
    expect(onClearSkill).toHaveBeenCalledWith({ typeId: "Analytical Model" });
    fireEvent.click(screen.getByRole("button", { name: "Choose AI skill" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Analytical Model/ }));
    fireEvent.click(screen.getByRole("button", { name: /Create Analytical Model Manually/ }));
    expect(document.querySelector(".mh-flow")).toBeTruthy();
    expect(onSkillAction).toHaveBeenCalledWith({ action: "manual", typeId: "Analytical Model" });
    fireEvent.change(document.querySelector(".mh-flow input[name='name']"), { target: { value: "Knowledge model" } });
    fireEvent.change(document.querySelector(".mh-flow textarea[name='trigger']"), { target: { value: "Knowledge changes" } });
    fireEvent.change(document.querySelector(".mh-flow textarea[name='structure']"), { target: { value: "Explain the governed definition" } });
    fireEvent.click(document.querySelector(".mh-flow__foot .mh-flow__btn--primary"));
    expect(onFlowSubmit).toHaveBeenCalledWith(expect.objectContaining({ typeId: "Analytical Model", values: expect.objectContaining({ name: "Knowledge model" }) }));
  });

  it("uses replacement host copy and answer callbacks without stale type context", () => {
    const first = vi.fn((query) => ({ query, variant: "compact", body: "First knowledge answer", sources: [] }));
    const second = vi.fn((query) => ({ query, variant: "compact", body: "Second knowledge answer", sources: [] }));
    const base = { assistant: { ...INTERPRETER.assistant, title: "First helper" }, demo: { answerFor: first, modelFlow: MODEL_FLOW } };
    const view = render(<Page {...base} activeType="overview" />);
    fireEvent.click(screen.getByRole("button", { name: "Open AI assistant" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Ask AI Interpreter AI" }), { target: { value: "First prompt" } });
    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    expect(screen.getByText("First knowledge answer")).toBeTruthy();
    view.rerender(<Page {...base} activeType="Principles" assistant={{ ...base.assistant, title: "Updated helper" }} demo={{ answerFor: second, modelFlow: MODEL_FLOW }} />);
    expect(screen.getByText("Updated helper")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: "Ask AI Interpreter AI" }), { target: { value: "Second prompt" } });
    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledWith("Second prompt");
    expect(screen.getByText("Second knowledge answer")).toBeTruthy();
    expect(screen.queryByText("First knowledge answer")).toBeNull();
  });

  it("uses the current type after a host switches views while the assistant stays open", () => {
    const onHistory = vi.fn();
    const onMaximize = vi.fn();
    const onFeedback = vi.fn();
    const onAttach = vi.fn();
    const onNewSession = vi.fn();
    const onClose = vi.fn();
    const assistant = {
      ...INTERPRETER.assistant,
      open: true,
      answers: [buildInterpreterAnswer("A knowledge question")],
      onHistory, onMaximize, onFeedback, onAttach, onNewSession, onClose,
    };
    const view = render(<Page activeType="Business Term" assistant={assistant} demo={{ modelFlow: MODEL_FLOW }} />);
    view.rerender(<Page activeType="Principles" assistant={assistant} demo={{ modelFlow: MODEL_FLOW }} />);
    fireEvent.click(screen.getByRole("button", { name: "Maximize AI Interpreter panel" }));
    expect(onMaximize).toHaveBeenCalledWith({ expanded: true, typeId: "Principles" });
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    expect(onHistory).toHaveBeenCalledWith({ open: true, typeId: "Principles" });
    fireEvent.click(document.querySelector(".mh-assistant__history-head button"));
    fireEvent.click(document.querySelector(".mh-assistant__feedback button[data-kind='helpful']"));
    expect(onFeedback).toHaveBeenCalledWith({ query: "A knowledge question", feedback: "helpful", typeId: "Principles" });
    fireEvent.click(screen.getByRole("button", { name: "Choose AI skill" }));
    const fileInput = document.querySelector('.mh-assistant input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [new File(["x"], "current.csv", { type: "text/csv" })] } });
    expect(onAttach).toHaveBeenCalledWith({ names: ["current.csv"], typeId: "Principles" });
    fireEvent.click(screen.getByRole("button", { name: "New session" }));
    expect(onNewSession).toHaveBeenCalledWith({ typeId: "Principles" });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledWith({ reason: "escape", typeId: "Principles" });
  });

  it.each(["Save", "Submit"])("types model-flow %s with the active host view after switching", (kind) => {
    const onFlowSave = vi.fn();
    const onFlowSubmit = vi.fn();
    const assistant = { ...INTERPRETER.assistant };
    const demo = { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft };
    const callbacks = { onFlowSave, onFlowSubmit };
    const view = render(<Page activeType="Business Term" assistant={assistant} demo={demo} {...callbacks} />);
    fireEvent.click(screen.getByRole("button", { name: "Open AI assistant" }));
    fireEvent.click(screen.getByRole("button", { name: "Choose AI skill" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Analytical Model/ }));
    fireEvent.click(screen.getByRole("button", { name: /Create Analytical Model Manually/ }));
    view.rerender(<Page activeType="Principles" assistant={assistant} demo={demo} {...callbacks} />);
    fireEvent.change(document.querySelector(".mh-flow input[name='name']"), { target: { value: "Scoped model" } });
    fireEvent.change(document.querySelector(".mh-flow textarea[name='trigger']"), { target: { value: "When knowledge changes" } });
    fireEvent.change(document.querySelector(".mh-flow textarea[name='structure']"), { target: { value: "Explain the governed answer" } });
    fireEvent.click(screen.getByRole("button", { name: kind }));
    const callback = kind === "Save" ? onFlowSave : onFlowSubmit;
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ typeId: "Principles", values: expect.objectContaining({ name: "Scoped model" }) }));
  });
});
