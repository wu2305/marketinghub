import React from "react";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KNOWLEDGE_CREATE } from "./content/knowledge-create.js";
import { knowledgeCreateHrefFor, useKnowledgeCreateDemo, validateKnowledgeCreate } from "./knowledge-create-demo.js";
import { KnowledgeCreatePage } from "../pages/KnowledgeCreatePage/index.jsx";
import { Header } from "../components/Header/index.jsx";

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
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ id: "interpreter", params: { type: "Business Term", notice: "saved" } }));
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
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ params: { type: "Report Context" } }));
  });

  it("routes Report Context edit Cancel to its scoped library", () => {
    const navigate = vi.fn();
    const { result } = renderHook(() => useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type: "Report Context", mode: "edit", id: "city-report-context", onNavigate: navigate }));
    act(() => result.current.onCancel());
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ params: { type: "Report Context" } }));
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
