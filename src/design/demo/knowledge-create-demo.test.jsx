import React from "react";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KNOWLEDGE_CREATE } from "./content/knowledge-create.js";
import { knowledgeCreateHrefFor, useKnowledgeCreateDemo, validateKnowledgeCreate } from "./knowledge-create-demo.js";
import { KnowledgeCreatePage } from "../pages/KnowledgeCreatePage/index.jsx";
import { Header } from "../components/Header/index.jsx";

function demoPropsFor(type) {
  return renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type })).result.current;
}

describe("P08 demo flow", () => {
  it("validates the dedicated required fields while a generic draft can be saved incomplete", () => {
    expect(validateKnowledgeCreate("Business Term", {}, "create")).toEqual(["title", "kind", "description"]);
    expect(validateKnowledgeCreate("Analytical Model", { analysis_name: "A" }, "create")).toEqual(["trigger_when", "output_requirements"]);
    expect(validateKnowledgeCreate("Scenario Reporting", {}, "create")).toHaveLength(4);
    expect(validateKnowledgeCreate("Metric Dictionary", { metricName: "Sales" }, "create")).toEqual(["metricFormula"]);
  });

  it("renders a real controlled Business Term form; errors clear and a selected model survives save", () => {
    const saved = vi.fn();
    const navigate = vi.fn();
    function Test() { const props = useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, onSave: saved, onNavigate: navigate }); return <KnowledgeCreatePage {...props} />; }
    render(<Test />);
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getAllByText("This field is required.")).toHaveLength(2);
    fireEvent.change(screen.getByRole("textbox", { name: /Title/ }), { target: { value: "Local term" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Description/ }), { target: { value: "Meaning and boundary" } });
    fireEvent.click(screen.getByRole("button", { name: "Select one or more" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Marketing" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(saved).toHaveBeenCalledWith(expect.objectContaining({ type: "Business Term", stage: "Draft", values: expect.objectContaining({ title: "Local term", scope: ["Marketing"] }) }));
    expect(saved.mock.calls[0][0].values.status).toBe(false);
    expect(saved.mock.calls[0][0].values.enabled).toBe(false);
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ id: "interpreter", params: { type: "Business Term", notice: "saved" } }));
  });

  it("reports one { type, mode, values } payload from Save, Submit and Cancel for every form", () => {
    for (const type of ["Business Term", "Principles", "Analytical Model"]) {
      const events = { onSave: vi.fn(), onSubmit: vi.fn(), onCancel: vi.fn() };
      const values = { title: "Probe", description: "Probe text" };
      const { unmount } = render(<KnowledgeCreatePage {...demoPropsFor(type)} values={values} {...events} />);
      fireEvent.click(screen.getByRole("button", { name: "Save" }));
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      fireEvent.click(screen.getByRole("button", { name: "Submit" }));
      const expected = { type, mode: "create", values };
      expect(events.onSave).toHaveBeenCalledWith(expected);
      expect(events.onCancel).toHaveBeenCalledWith(expected);
      expect(events.onSubmit).toHaveBeenCalledWith(expected);
      unmount();
    }
  });

  it("renders injected Business Term copy and scope options without leaking defaults", () => {
    const saved = vi.fn();
    const alternate = {
      ...KNOWLEDGE_CREATE,
      businessTerm: { ...KNOWLEDGE_CREATE.businessTerm, title: "Create Regional Term", labels: { ...KNOWLEDGE_CREATE.businessTerm.labels, title: "Regional Title" } },
      shared: { ...KNOWLEDGE_CREATE.shared, scope: ["Regional Model"] },
    };
    function Test() { return <KnowledgeCreatePage {...useKnowledgeCreateDemo({ content: alternate, onSave: saved })} />; }
    render(<Test />);
    expect(screen.getByRole("heading", { name: "Create Regional Term" })).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: /Regional Title/ }), { target: { value: "Regional GMV" } });
    fireEvent.change(screen.getByRole("textbox", { name: /Description/ }), { target: { value: "Regional meaning" } });
    fireEvent.click(screen.getByRole("button", { name: "Select one or more" }));
    expect(screen.getByRole("checkbox", { name: "Regional Model" })).toBeTruthy();
    expect(screen.queryByRole("checkbox", { name: "Marketing" })).toBeNull();
    fireEvent.click(screen.getByRole("checkbox", { name: "Regional Model" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(saved).toHaveBeenCalledWith(expect.objectContaining({ values: expect.objectContaining({ title: "Regional GMV", scope: ["Regional Model"] }) }));
  });

  it("prefills edit without mutating fixtures and isolates two instances", () => {
    const first = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, mode: "edit", id: "business-term-gmv" }));
    const second = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE }));
    expect(first.result.current.values.title).toContain("GMV");
    act(() => first.result.current.onChange({ name: "title", value: "Edited GMV" }));
    expect(second.result.current.values.title).toBeUndefined();
    expect(KNOWLEDGE_CREATE.records["business-term-gmv"].title).toContain("GMV");
  });

  it("switches type and resets draft, with explicit navigation payload", () => {
    const navigate = vi.fn();
    const { result } = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Principles", onNavigate: navigate }));
    act(() => result.current.onChange({ name: "title", value: "To be reset" }));
    act(() => result.current.onTypeChange({ value: "Metric Dictionary" }));
    expect(result.current.type).toBe("Metric Dictionary");
    expect(result.current.values.title).toBeUndefined();
    act(() => result.current.onCancel());
    expect(navigate).toHaveBeenCalledWith({ id: "interpreter", params: {}, href: "/assets/pages/knowledge.html" });
    expect(knowledgeCreateHrefFor("knowledgeCreate", { type: "Business Term", mode: "edit" })).toContain("type=Business+Term");
  });

  it("resolves a P09 edit or copy link from the fixture record when the URL omits type", () => {
    for (const mode of ["edit", "copy"]) {
      const { result, unmount } = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, mode, id: "investment-principles" }));
      expect(result.current.type).toBe("Principles");
      expect(result.current.mode).toBe(mode);
      expect(result.current.values.title).toBe("Campaign investment decision principles");
      unmount();
    }
    const unknown = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, mode: "copy", id: "missing-record" }));
    expect(unknown.result.current.type).toBe("Business Term");
    expect(unknown.result.current.values.title).toBeUndefined();
    unknown.unmount();
  });

  it("shows the final Analytical Model unavailable state for a missing or other-owner edit only", () => {
    const missing = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Analytical Model", mode: "edit", id: "missing-analysis" }));
    expect(missing.result.current.unavailable).toBe(true);
    const { unmount } = render(<KnowledgeCreatePage {...missing.result.current} />);
    expect(screen.getByText(KNOWLEDGE_CREATE.analysis.unavailable)).toBeTruthy();
    expect(screen.queryByRole("textbox", { name: /Analysis Name/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Submit" })).toBeNull();
    unmount();
    missing.unmount();

    const foreignContent = {
      ...KNOWLEDGE_CREATE,
      records: { ...KNOWLEDGE_CREATE.records,
        "foreign-analysis": { type: "Analytical Model", created_by: "Another User", analysis_name: "Foreign" } },
    };
    const foreign = renderHook(() => useKnowledgeCreateDemo({ content: foreignContent, type: "Analytical Model", mode: "edit", id: "foreign-analysis" }));
    expect(foreign.result.current.unavailable).toBe(true);
    foreign.unmount();

    const own = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Analytical Model", mode: "edit", id: "playbook-opportunity-scan" }));
    expect(own.result.current.unavailable).toBe(false);
    own.unmount();
    const create = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Analytical Model" }));
    expect(create.result.current.unavailable).toBe(false);
    create.unmount();
  });

  it("keeps an unknown Report Context edit in generic form rather than fabricating a record", () => {
    const navigate = vi.fn();
    const flow = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Report Context", mode: "edit", id: "missing-report-context", onNavigate: navigate }));
    expect(flow.result.current.mode).toBe("edit");
    expect(flow.result.current.reportEditAvailable).toBe(false);
    const page = render(<KnowledgeCreatePage {...flow.result.current} />);
    expect(screen.getByRole("heading", { name: "Edit Knowledge" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Dashboard Description" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Version history" })).toBeNull();
    act(() => flow.result.current.onChange({ name: "description", value: "Local report description" }));
    act(() => flow.result.current.onSubmit());
    expect(flow.result.current.result?.action).toBe("submit");
    expect(navigate).not.toHaveBeenCalled();
    act(() => flow.result.current.onCancel());
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ id: "interpreter", params: {} }));
    page.unmount();
    flow.unmount();

    const known = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Report Context", mode: "edit", id: "city-report-context" }));
    expect(known.result.current.reportEditAvailable).toBe(true);
    known.unmount();
  });

  it("keeps the final Metric formula locked and treats a multiword metric as one token", () => {
    function Test() { return <KnowledgeCreatePage {...useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Metric Dictionary" })} />; }
    render(<Test />);
    const formula = screen.getByRole("textbox", { name: "Formula Builder" });
    expect(formula.getAttribute("aria-readonly")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: /Visit Count/ }));
    fireEvent.click(screen.getByRole("button", { name: /Exposure Count/ }));
    expect(formula.textContent).toContain("Visit Count");
    fireEvent.click(screen.getByRole("button", { name: "Delete last token" }));
    expect(formula.textContent).toContain("Visit Count");
    expect(formula.textContent).not.toContain("Exposure Count");
    fireEvent.click(screen.getByRole("button", { name: "Remove metric Visit Count" }));
    expect(formula.textContent).toContain("Click a metric");
    fireEvent.click(screen.getByRole("button", { name: /Visit Count/ }));
    fireEvent.click(screen.getByRole("button", { name: "Clear formula" }));
    expect(formula.textContent).toContain("Click a metric");
  });

  it("adds Data Model synonyms on Enter or blur, removes only new tags, and cancels with Escape", () => {
    function Test() { return <KnowledgeCreatePage {...useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Data Model" })} />; }
    render(<Test />);
    expect(screen.queryByRole("button", { name: "Remove synonym Channel Key" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Add synonym to channel_id" }));
    fireEvent.change(screen.getByRole("textbox", { name: "New synonym" }), { target: { value: "Customer Channel" } });
    fireEvent.keyDown(screen.getByRole("textbox", { name: "New synonym" }), { key: "Enter" });
    expect(screen.getByRole("button", { name: "Remove synonym Customer Channel" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Add synonym to channel_id" }));
    fireEvent.change(screen.getByRole("textbox", { name: "New synonym" }), { target: { value: "discard" } });
    fireEvent.keyDown(screen.getByRole("textbox", { name: "New synonym" }), { key: "Escape" });
    expect(screen.queryByText("discard")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Add synonym to channel_id" }));
    fireEvent.change(screen.getByRole("textbox", { name: "New synonym" }), { target: { value: "Blur saved" } });
    fireEvent.blur(screen.getByRole("textbox", { name: "New synonym" }));
    expect(screen.getByRole("button", { name: "Remove synonym Blur saved" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Remove synonym Customer Channel" }));
    expect(screen.queryByRole("button", { name: "Remove synonym Customer Channel" })).toBeNull();
    expect(screen.getByText("Channel Key ×")).toBeTruthy();
  });

  it("binds Data Model fields and Basic Info edits to the selected table", () => {
    function Test() { return <KnowledgeCreatePage {...useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Data Model" })} />; }
    render(<Test />);
    expect(screen.getByRole("textbox", { name: "channel_id name" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /User & Member Dimension/ }));
    expect(screen.getByRole("textbox", { name: "channel_id name" })).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: "channel_id name" }), { target: { value: "Member channel" } });
    fireEvent.click(screen.getByRole("button", { name: /Channel Dimension/ }));
    expect(screen.getByRole("textbox", { name: "channel_id name" }).value).toBe("Channel ID");
    fireEvent.click(screen.getByRole("button", { name: /User & Member Dimension/ }));
    expect(screen.getByRole("textbox", { name: "channel_id name" }).value).toBe("Member channel");
    fireEvent.click(screen.getByRole("button", { name: "Basic Info" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Table Name" }), { target: { value: "Member model" } });
    fireEvent.click(screen.getByRole("button", { name: /Channel Dimension/ }));
    expect(screen.getByRole("textbox", { name: "Table Name" }).value).toBe("Channel Dimension");
    fireEvent.click(screen.getByRole("button", { name: /User & Member Dimension/ }));
    expect(screen.getByRole("textbox", { name: "Table Name" }).value).toBe("Member model");
  });

  it("preserves an intentionally cleared Data Model field instead of restoring fixture text", () => {
    function Test() { return <KnowledgeCreatePage {...useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Data Model", initial: { "table:dim_channel:field:channel_id:name": "", "table:dim_channel:field:channel_id:synonym": "" } })} />; }
    const { container } = render(<Test />);
    expect(screen.getByRole("textbox", { name: "channel_id name" }).value).toBe("");
    expect(container.querySelectorAll(".mh-kcf__table-scroll tbody tr:first-child .mh-kcf__chip")).toHaveLength(0);
  });

  it("keeps Report Context submit available after a changed description is cleared and locked again", () => {
    const submitted = vi.fn();
    const navigate = vi.fn();
    function Test() { return <KnowledgeCreatePage {...useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Report Context", mode: "edit", id: "city-report-context", onSubmit: submitted, onNavigate: navigate })} />; }
    render(<Test />);
    const submit = screen.getByRole("button", { name: "Submit" });
    expect(submit.disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Unlock report description" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Report description" }), { target: { value: "" } });
    expect(submit.disabled).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Lock report description" }));
    expect(submit.disabled).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Version history" }));
    expect(screen.getByText(KNOWLEDGE_CREATE.records["city-report-context"].originalDescription)).toBeTruthy();
    expect(screen.getByText(/3 days ago/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(submit);
    expect(screen.getByText("Submit description update?")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Submit" }).at(-1));
    expect(submitted).toHaveBeenCalledWith(expect.objectContaining({ type: "Report Context", values: expect.objectContaining({ description: "" }) }));
    expect(submitted.mock.calls[0][0]).not.toHaveProperty("stage");
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ params: { type: "Report Context" } }));
  });

  it("shows Report Context relationships as tags and maps AI Summary independently", () => {
    const source = KNOWLEDGE_CREATE.records["city-report-context"];
    const content = { ...KNOWLEDGE_CREATE, records: { ...KNOWLEDGE_CREATE.records,
      "city-report-context": { ...source, ai_interpretation_enabled: true, ai_summary_enabled: false },
    } };
    function Test() { return <KnowledgeCreatePage {...useKnowledgeCreateDemo({ content, type: "Report Context", mode: "edit", id: "city-report-context" })} />; }
    const { container } = render(<Test />);
    expect([...container.querySelectorAll(".mh-kcf__rc-meta .mh-badge--detail")].map((badge) => badge.textContent)).toEqual(["Enabled", "Disabled"]);
    expect([...container.querySelectorAll(".mh-kcf__rc-tags .mh-kcf__rc-tag")].map((tag) => tag.textContent)).toEqual([
      "City Strategy", "scenario-channel-performance", "scenario-campaign-review",
    ]);
  });

  it("routes Report Context edit Cancel to its scoped library", () => {
    const navigate = vi.fn();
    const { result } = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Report Context", mode: "edit", id: "city-report-context", onNavigate: navigate }));
    act(() => result.current.onCancel());
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ params: { type: "Report Context" } }));
  });

  it("only exposes source-backed workflow stages and persisted availability", () => {
    const analysisSave = vi.fn();
    const analysisSubmit = vi.fn();
    const analysis = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Analytical Model", initial: { analysis_name: "A", trigger_when: "T", output_requirements: "O", status: true }, onSave: analysisSave, onSubmit: analysisSubmit }));
    act(() => analysis.result.current.onSave());
    expect(analysisSave.mock.calls[0][0]).toMatchObject({ stage: "Draft", values: { status: false, enabled: false } });
    act(() => analysis.result.current.onSubmit());
    expect(analysisSubmit.mock.calls[0][0]).toMatchObject({ stage: "Under Review", values: { status: true, enabled: true } });
    analysis.unmount();

    const scenarioSubmit = vi.fn();
    const scenario = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Scenario Reporting", initial: { scenario_report_title: "S", scenario_report_linked: "R", scenario_report_description: "D", scenario_report_blueprint: "B" }, onSubmit: scenarioSubmit }));
    act(() => scenario.result.current.onSubmit());
    expect(scenarioSubmit.mock.calls[0][0]).toMatchObject({ stage: "Queued", values: { status: false, enabled: false } });
    scenario.unmount();

    const genericSubmit = vi.fn();
    const generic = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Principles", initial: { title: "Rule", description: "Detail" }, onSubmit: genericSubmit }));
    act(() => generic.result.current.onSubmit());
    expect(genericSubmit.mock.calls[0][0]).toMatchObject({ stage: "Under Review" });
    generic.unmount();
  });

  it("Submit sends Business Terms and Analytical Models to review and keeps the form's availability", () => {
    const navigate = vi.fn();
    const submit = vi.fn();
    const term = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Business Term", initial: { title: "T", description: "D", scope: ["Marketing"], enabled: false, status: false }, onSubmit: submit, onNavigate: navigate }));
    act(() => term.result.current.onSubmit());
    expect(submit.mock.calls[0][0]).toMatchObject({ stage: "Under Review", values: { enabled: false, status: false } });
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ params: { type: "Business Term", notice: "submitted" } }));
    term.unmount();
  });

  it("prefills Analytical Model edit from source-linked record values and only source metrics", () => {
    function Test() { return <KnowledgeCreatePage {...useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Analytical Model", mode: "edit", id: "playbook-opportunity-scan" })} />; }
    const { container } = render(<Test />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Edit Analysis");
    expect(container.querySelector(".mh-kcreate__breadcrumb b")?.textContent).toBe("Opportunity scan playbook");
    expect(screen.getByRole("textbox", { name: "Description" }).value).toBe("Repeatable routine for identifying and prioritizing growth opportunities across channels and regions.");
    expect(screen.getByRole("textbox", { name: /Trigger When/ }).value).toBe("When a user request matches this analysis approach and its supported business context.");
    expect(screen.getByRole("textbox", { name: /Structure & Guidance/ }).value).toBe("Start with an executive summary, then list evidence, prioritized opportunities, limitations and recommended actions.");
    expect(container.querySelector(".mh-kcf__tag-input")?.textContent).toContain("City Strategy");
    expect(container.querySelector(".mh-kcf__tag-input")?.textContent).toContain("4P");
    expect(screen.getByRole("button", { name: /Member conversion, Campaign ROI/ })).toBeTruthy();
    expect(screen.queryByRole("checkbox")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Member conversion, Campaign ROI/ }));
    expect(screen.getByRole("checkbox", { name: "Promotion lift" })).toBeTruthy();
    expect(screen.queryByRole("checkbox", { name: "Exposure Count" })).toBeNull();
  });

  it("uses the source Business Term edit heading and preserves its breadcrumb links", () => {
    function Test() { return <KnowledgeCreatePage {...useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, mode: "edit", id: "business-term-gmv" })} />; }
    const { container } = render(<Test />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Edit GMV (Gross Merchandise Value)");
    expect(container.querySelectorAll(".mh-kcreate__breadcrumb a")).toHaveLength(4);
    expect(container.querySelector(".mh-kcreate__breadcrumb b")?.textContent).toBe("Edit GMV (Gross Merchandise Value)");
  });

  it("returns to Knowledge Management only from the result button, while Escape dismisses in place", () => {
    const navigate = vi.fn();
    const test = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Data Model", onNavigate: navigate }));
    act(() => test.result.current.onDialog({ kind: "preview" }));
    act(() => test.result.current.onDialogClose({ reason: "escape" }));
    expect(test.result.current.dialog).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
    act(() => test.result.current.onDialog({ kind: "smart" }));
    act(() => test.result.current.onDialogClose({ reason: "close" }));
    expect(navigate).toHaveBeenCalledWith({ id: "interpreter", params: {}, href: "/assets/pages/knowledge.html" });
    test.unmount();

    navigate.mockClear();
    const generic = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Principles", onNavigate: navigate }));
    act(() => generic.result.current.onSave());
    expect(generic.result.current.result?.action).toBe("save");
    act(() => generic.result.current.onResultClose({ reason: "escape" }));
    expect(navigate).not.toHaveBeenCalled();
    act(() => generic.result.current.onSave());
    act(() => generic.result.current.onResultClose({ reason: "close" }));
    expect(navigate).toHaveBeenCalledWith({ id: "interpreter", params: {}, href: "/assets/pages/knowledge.html" });
    generic.unmount();
  });

  it("leaves modified header and breadcrumb clicks to native link navigation", () => {
    const navigate = vi.fn();
    const { container } = render(<><Header logo={{ src: "/logo.png", href: "#home" }} items={[{ id: "interpreter", label: "AI Interpreter", href: "#interpreter" }]} onNavigate={navigate} /><KnowledgeCreatePage content={KNOWLEDGE_CREATE} type="Scenario Reporting" values={{}} hrefFor={() => "#breadcrumb"} onNavigate={navigate} /></>);
    fireEvent.click(container.querySelector(".mh-header__logo"), { metaKey: true });
    fireEvent.click(container.querySelector(".mh-header__link"), { ctrlKey: true });
    fireEvent.click(container.querySelector(".mh-kcreate__breadcrumb a"), { shiftKey: true });
    expect(navigate).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector(".mh-kcreate__breadcrumb a"));
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ id: "home" }));
  });
});
