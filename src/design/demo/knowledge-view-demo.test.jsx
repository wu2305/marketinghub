import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KNOWLEDGE_VIEW } from "./content/knowledge-view.js";
import { useKnowledgeViewDemo, knowledgeViewHrefFor, knowledgeViewRedirectFor } from "./knowledge-view-demo.js";
import { KnowledgeViewPage } from "../pages/KnowledgeViewPage/index.jsx";

const shell = { logo: { src: "/assets/images/tapestry-logo.png", alt: "Tapestry" }, navigation: [{ id: "home", label: "Home" }, { id: "interpreter", label: "AI Interpreter" }] };
function Fixture({ content, recordId, hrefFor, onNavigate, onAction, onOpen, onCancel, onChange, onSelect }) {
  const demo = useKnowledgeViewDemo({ content, recordId, hrefFor, onNavigate, onAction, onOpen, onCancel, onChange, onSelect });
  return <KnowledgeViewPage {...shell} {...demo} />;
}

describe("P09 knowledge detail flow", () => {
  it("falls back to GMV for missing and unknown IDs, as the effective source does", () => {
    const { rerender } = render(<Fixture />);
    expect(screen.getByRole("heading", { name: /^GMV/ })).toBeTruthy();
    rerender(<Fixture recordId="unknown-record" />);
    expect(screen.getByRole("heading", { name: /^GMV/ })).toBeTruthy();
  });

  it("uses source Edit URL params and emits the same named navigation payload", () => {
    const onNavigate = vi.fn();
    render(<Fixture recordId="business-term-gmv" onNavigate={onNavigate} />);
    const edit = screen.getByRole("link", { name: "Edit" });
    expect(edit.getAttribute("href")).toBe("/assets/pages/knowledge-create.html?mode=edit&id=business-term-gmv");
    fireEvent.click(edit);
    expect(onNavigate).toHaveBeenCalledWith({ id: "knowledgeCreate", params: { mode: "edit", id: "business-term-gmv" }, href: edit.getAttribute("href") });
  });

  it("keeps modified navigation on the native anchor without notifying a host route", () => {
    const onNavigate = vi.fn();
    render(<Fixture recordId="business-term-gmv" onNavigate={onNavigate} />);
    const edit = screen.getByRole("link", { name: "Edit" });
    fireEvent.click(edit, { ctrlKey: true });
    fireEvent.click(edit, { metaKey: true });
    fireEvent.click(edit, { shiftKey: true });
    fireEvent.click(edit, { button: 1 });
    expect(onNavigate).not.toHaveBeenCalled();
    fireEvent.click(edit);
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("renders a known Principles ID as the gated Principles detail rather than the source's BT hijack", () => {
    render(<Fixture recordId="investment-principles" />);
    expect(screen.getByRole("heading", { name: "Campaign investment decision principles" })).toBeTruthy();
    expect(screen.getByText("Role and mission")).toBeTruthy();
    expect(screen.queryByText("Basic Definition")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Collapse Role and mission" }));
    expect(screen.queryByText("Avoids inventing data, metric definitions, report cards, or tool output.")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "View Versions" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Refined decision thresholds and confidence requirements.")).toBeTruthy();
  });

  it("keeps the original Data Model highlight-only tab while retaining five rows and all four notices", () => {
    const onAction = vi.fn();
    render(<Fixture recordId="channel-data-model" onAction={onAction} />);
    expect(screen.getAllByRole("row").length).toBe(6);
    fireEvent.click(screen.getByRole("button", { name: "Basic Info" }));
    expect(screen.getByRole("button", { name: "Basic Info" }).className).toContain("is-active");
    expect(screen.getAllByRole("row").length).toBe(6);
    for (const [button, text] of [
      ["◉ Preview Data", "Preview data is ready for this model."],
      ["◇ Smart Modeling", "Smart Modeling has prepared a configuration draft."],
      ["⇧ Export", "The model configuration is ready to export."],
      ["Edit Model", "Edit Model is ready."],
    ]) {
      fireEvent.click(screen.getByRole("button", { name: button }));
      expect(within(screen.getByRole("dialog")).getByText(text)).toBeTruthy();
      fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Back to Knowledge Management" }));
    }
    expect(onAction.mock.calls.map(([event]) => event.id)).toEqual(["preview", "smart", "export", "edit"]);
  });

  it("wires source controls, overlay lifecycle, and named callback payloads", () => {
    const onOpen = vi.fn();
    const onCancel = vi.fn();
    const onChange = vi.fn();
    const onSelect = vi.fn();
    const { rerender } = render(<Fixture recordId="business-term-gmv" onOpen={onOpen} onCancel={onCancel} onChange={onChange} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "View Versions" }));
    expect(onOpen).toHaveBeenCalledWith({ kind: "versions", recordId: "business-term-gmv" });
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Close version history" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onCancel).toHaveBeenCalledWith({ reason: "button", recordId: "business-term-gmv" });

    rerender(<Fixture recordId="channel-data-model" onOpen={onOpen} onCancel={onCancel} onChange={onChange} onSelect={onSelect} />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Search table name or description..." }), { target: { value: "region" } });
    expect(onChange).toHaveBeenCalledWith({ name: "query", id: undefined, value: "region" });
    expect(screen.getByRole("button", { name: /Region Dimension/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Channel Dimension/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Event · 1" }));
    expect(onSelect).toHaveBeenCalledWith({ kind: "group", id: "event" });
    fireEvent.click(screen.getByRole("button", { name: "Basic Info" }));
    expect(onSelect).toHaveBeenCalledWith({ kind: "tab", id: "basic" });
    expect(screen.getAllByRole("row")).toHaveLength(6);
  });

  it("accepts a replacement record/copy fixture and resyncs record changes without leaking overlay state", () => {
    const alt = { ...KNOWLEDGE_VIEW, copy: { ...KNOWLEDGE_VIEW.copy, versionButton: "History archive", business: { ...KNOWLEDGE_VIEW.copy.business, emptyRelated: "No linked rows in this host" } }, records: {
      one: { ...KNOWLEDGE_VIEW.records["global-synonym-revenue"], id: "one", title: "Custom term A" },
      two: { ...KNOWLEDGE_VIEW.records["global-synonym-customer"], id: "two", title: "Custom term B" },
    } };
    const { rerender } = render(<Fixture content={alt} recordId="one" />);
    expect(screen.getByRole("heading", { name: "Custom term A" })).toBeTruthy();
    expect(screen.getByText("No linked rows in this host")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "History archive" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    rerender(<Fixture content={alt} recordId="two" />);
    expect(screen.getByRole("heading", { name: "Custom term B" })).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByText("Revenue")).toBeNull();
  });

  it("supports two independent instances under a host route resolver", () => {
    const hrefFor = (id, params = {}) => `/host/${id}${params.id ? `?id=${params.id}` : ""}`;
    const { container } = render(<><Fixture recordId="business-term-gmv" hrefFor={hrefFor} /><Fixture recordId="global-synonym-revenue" hrefFor={hrefFor} /></>);
    const details = container.querySelectorAll(".mh-kdetail");
    expect(details).toHaveLength(2);
    fireEvent.click(within(details[0]).getByRole("button", { name: "View Versions" }));
    expect(within(details[0]).getByRole("dialog")).toBeTruthy();
    expect(within(details[1]).queryByRole("dialog")).toBeNull();
    expect(within(details[1]).getByRole("link", { name: "Edit" }).getAttribute("href")).toBe("/host/knowledgeCreate?id=global-synonym-revenue");
  });

  it("selects an injected model's first table and accepts a BT-only fixture without model data", () => {
    const model = { tables: [{ id: "alternate-table", name: "Alternate Table", meta: "alternate · 2 rows" }], fields: [{ id: "alternate_id", format: "int", name: "Alternate ID", synonyms: "Alt Key", fuzzy: false }] };
    const alt = { ...KNOWLEDGE_VIEW, model, records: { alt: { id: "alt", type: "Data Model", title: "Alternate model" } } };
    const { container, unmount } = render(<Fixture content={alt} recordId="alt" />);
    expect(container.querySelector(".mh-kdetail__model-tables button.is-active")?.textContent).toContain("Alternate Table");
    expect(screen.getAllByRole("row")).toHaveLength(2);
    unmount();
    const termOnly = { copy: KNOWLEDGE_VIEW.copy, promptSections: [], records: { only: { ...KNOWLEDGE_VIEW.records["global-synonym-revenue"], id: "only", title: "Host-only term" } } };
    render(<Fixture content={termOnly} recordId="only" />);
    expect(screen.getByRole("heading", { name: "Host-only term" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Alternate Table" })).toBeNull();
  });

  it("resolves all four source redirects from injected P07 records and preserves email prefix fallback", () => {
    const records = [
      { id: "rc", typeId: "Report Context" },
      { id: "md", typeId: "Metric Dictionary" },
      { id: "am", typeId: "Analytical Model" },
      { id: "em", typeId: "Email Reports" },
      { id: "bt", typeId: "Business Term" },
    ];
    for (const [id, type] of [["rc", "Report Context"], ["md", "Metric Dictionary"], ["am", "Analytical Model"], ["em", "Email Reports"]]) {
      expect(knowledgeViewRedirectFor(id, records)).toEqual({ id: "interpreter", params: { type, detail: id } });
    }
    expect(knowledgeViewRedirectFor("email-report-unknown", records)).toEqual({ id: "interpreter", params: { type: "Email Reports", detail: "email-report-unknown" } });
    expect(knowledgeViewRedirectFor("bt", records)).toBeNull();
    expect(knowledgeViewRedirectFor("unknown", records)).toBeNull();
  });

  it("keeps type-less source URLs for P08's known-record type inference", () => {
    expect(knowledgeViewHrefFor("knowledgeCreate", { mode: "edit", id: "investment-principles" })).toBe("/assets/pages/knowledge-create.html?mode=edit&id=investment-principles");
  });
});
