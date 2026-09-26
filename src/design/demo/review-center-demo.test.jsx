import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReviewCenterPage } from "../pages/ReviewCenterPage/index.jsx";
import { ReviewQueue } from "../features/review-center/ReviewQueue/index.jsx";
import { REVIEW_CENTER, REVIEW_SHELL } from "./content/review-center.js";
import { useReviewCenterDemo } from "./review-center-demo.js";

Element.prototype.scrollTo ??= () => {};
const RESTORE_WARNING = { id: "restore-warning", title: "Restored review", summary: "Lineage needs review", type: "Data Model", source: "Shared", submittedBy: "Current User", submitted: "Today", status: "pending", aiCheck: "Warning", warning: "Review lineage before approval." };
const RESTORE_PASS = { ...RESTORE_WARNING, id: "restore-pass", title: "Restored pass", aiCheck: "Pass", warning: "" };
const data = { content: REVIEW_CENTER, records: REVIEW_CENTER.records, suggestions: REVIEW_CENTER.suggestions, fallbackSuggestions: REVIEW_CENTER.fallbackSuggestions, ...REVIEW_SHELL, hrefFor: (id) => ({ interpreter: "/mh-host/interpreter", "review-center": "/mh-host/review-center", "scenario-library": "/mh-host/coverage/scenario-library", "feedback-quality": "/mh-host/coverage/feedback-quality" })[id] };
function Harness(props) { return <ReviewCenterPage {...useReviewCenterDemo(props)} />; }
function mount(overrides = {}) { return render(<Harness {...data} {...overrides} />); }
const row = (id) => document.querySelector(`[data-review-id="${id}"]`);
const count = (name) => screen.getByText(name).closest("article").querySelector("strong").textContent;

describe("Review Center demo", () => {
  it("exposes named Reject payloads and keyed stats to a controlled page consumer", () => {
    const onConfirmReject = vi.fn();
    const content = { ...REVIEW_CENTER, hero: { ...REVIEW_CENTER.hero, stats: [REVIEW_CENTER.hero.stats[1], REVIEW_CENTER.hero.stats[0], REVIEW_CENTER.hero.stats[2]] } };
    render(<ReviewCenterPage content={content} logo={REVIEW_SHELL.logo} navigation={REVIEW_SHELL.navigation} image={REVIEW_SHELL.image} filters={{}} queue={{ items: [], counts: { pending: 6, approved: 21, rejected: 3 } }} decision={{ panel: "reject", selected: REVIEW_CENTER.records[0], reason: "Needs updated lineage", rejectSuggestions: [], onConfirmReject }} assistant={{ open: false }} />);
    expect(within(screen.getByText("APPROVED THIS WEEK").closest("article")).getByText("21")).toBeTruthy();
    expect(within(screen.getByText("PENDING REVIEW").closest("article")).getByText("6")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Reject" }));
    expect(onConfirmReject).toHaveBeenCalledExactlyOnceWith({ id: "pending-1", reason: "Needs updated lineage" });
  });

  it("shows the Restore badge from semantic record data rather than an id prefix", () => {
    render(<ReviewQueue items={[{ ...REVIEW_CENTER.records[0], id: "custom", restored: true }, { ...REVIEW_CENTER.records[0], id: "restore-plain", restored: false }]} columns={REVIEW_CENTER.labels.columns} labels={REVIEW_CENTER.labels} />);
    expect(within(row("custom")).getByText("Restore")).toBeTruthy();
    expect(within(row("restore-plain")).queryByText("Restore")).toBeNull();
  });

  it("filters by tab, type and search while Submitted remains only a visible selection", () => {
    mount();
    expect(document.querySelectorAll(".mh-review-queue__row")).toHaveLength(6);
    expect(count("PENDING REVIEW")).toBe("6");
    expect(count("APPROVED THIS WEEK")).toBe("21");
    expect(count("REJECTED THIS WEEK")).toBe("3");
    fireEvent.change(screen.getByLabelText("Submitted"), { target: { value: "today" } });
    expect(screen.getByLabelText("Submitted").value).toBe("today");
    expect(document.querySelectorAll(".mh-review-queue__row")).toHaveLength(6);
    fireEvent.change(screen.getByLabelText("Type"), { target: { value: "Data Model" } });
    expect(document.querySelectorAll(".mh-review-queue__row")).toHaveLength(2);
    fireEvent.change(screen.getByRole("searchbox", { name: "Search review items" }), { target: { value: "Rednote" } });
    expect(document.querySelectorAll(".mh-review-queue__row")).toHaveLength(1);
    expect(row("pending-11")).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: /Approved/ }));
    expect(screen.getByText("No matching items")).toBeTruthy();
  });

  it("opens detail from its keyboard button, then rejects with an empty reason and static Rejected count", () => {
    const onConfirmReject = vi.fn();
    mount({ onConfirmReject });
    fireEvent.click(within(row("pending-1")).getByRole("button", { name: "Campaign investment decision principles" }));
    const detail = screen.getByRole("dialog", { name: "Campaign investment decision principles" });
    expect(within(detail).getByText("AI Suggestions")).toBeTruthy();
    expect(within(detail).getByText("Warning")).toBeTruthy();
    fireEvent.click(within(detail).getByRole("button", { name: "Reject" }));
    expect(screen.queryByRole("dialog", { name: "Campaign investment decision principles" })).toBeNull();
    const reject = screen.getByRole("dialog", { name: /Reject: Campaign investment/ });
    expect(within(reject).getAllByRole("listitem")).toHaveLength(3);
    expect(within(reject).getByRole("textbox", { name: "Rejection Reason" }).value).toBe("");
    fireEvent.click(within(reject).getByRole("button", { name: "Confirm Reject" }));
    expect(onConfirmReject).toHaveBeenCalledWith({ id: "pending-1", reason: "" });
    expect(row("pending-1")).toBeNull();
    expect(count("PENDING REVIEW")).toBe("5");
    expect(count("REJECTED THIS WEEK")).toBe("3");
  });

  it("keeps risk confirmation for Reviewing/Warning and approves Pass directly", () => {
    mount({ restorations: [RESTORE_WARNING, RESTORE_PASS, { ...RESTORE_PASS, title: "Duplicate id ignored" }] });
    expect(document.querySelectorAll(".mh-review-queue__row")).toHaveLength(8);
    fireEvent.click(within(row("pending-3")).getByRole("button", { name: "Approve" }));
    expect(screen.getByRole("dialog", { name: "AI Review In Progress" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(row("pending-3")).toBeTruthy();
    fireEvent.click(within(row("restore-warning")).getByRole("button", { name: "Approve" }));
    expect(screen.getByRole("dialog", { name: "AI Warning Detected" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Approve Anyway" }));
    expect(row("restore-warning")).toBeNull();
    fireEvent.click(within(row("restore-pass")).getByRole("button", { name: "Approve" }));
    expect(screen.queryByRole("dialog", { name: /AI (Warning|Review)/ })).toBeNull();
    expect(row("restore-pass")).toBeNull();
    expect(count("APPROVED THIS WEEK")).toBe("23");
  });

  it("reopens approved detail for View in Knowledge Base without navigation", () => {
    const onNavigate = vi.fn();
    mount({ onNavigate });
    fireEvent.click(screen.getByRole("tab", { name: /Approved/ }));
    fireEvent.click(within(row("approved-1")).getByRole("button", { name: "View" }));
    const detail = screen.getByRole("dialog", { name: "Trusted analysis guardrails" });
    expect(within(detail).queryByText("AI Suggestions")).toBeNull();
    fireEvent.click(within(detail).getByRole("button", { name: "View in Knowledge Base" }));
    expect(screen.getByRole("dialog", { name: "Trusted analysis guardrails" })).toBeTruthy();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("fills lite suggestions/history without submit and retains skill through New Session", () => {
    const onAssistantSubmit = vi.fn();
    mount({ onAssistantSubmit });
    fireEvent.click(screen.getByRole("button", { name: "Open AI assistant" }));
    fireEvent.click(screen.getByRole("button", { name: "Definition of Attributed ROI" }));
    const prompt = screen.getByRole("textbox", { name: "Ask AI Interpreter AI" });
    expect(prompt.value).toBe("Definition of Attributed ROI");
    expect(document.querySelector(".mh-assistant__answer")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    expect(onAssistantSubmit).toHaveBeenCalledWith({ prompt: "Definition of Attributed ROI" });
    expect(document.querySelector(".mh-assistant__answer--simple")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    fireEvent.click(document.querySelector(".mh-assistant__history-item"));
    expect(prompt.value).toBe(REVIEW_SHELL.assistant.history[0].prompt);
    fireEvent.click(screen.getByRole("button", { name: "Choose AI skill" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Analytical Model/ }));
    expect(document.querySelectorAll(".mh-skill__option")).toHaveLength(3);
    fireEvent.click(document.querySelector(".mh-skill__option"));
    fireEvent.click(screen.getByRole("button", { name: "New session" }));
    expect(document.querySelector(".mh-assistant__answer")).toBeNull();
    expect(prompt.value).toBe("");
    expect(document.querySelector(".mh-assistant__chip")).toBeTruthy();
  });

  it("accepts replacement records and isolates two host instances", () => {
    const alt = [{ ...REVIEW_CENTER.records[0], id: "alt", title: "Only alternate record" }];
    const view = mount({ records: alt });
    expect(screen.getByText("Only alternate record")).toBeTruthy();
    view.rerender(<Harness {...data} records={[{ ...alt[0], title: "Replacement record" }]} />);
    expect(screen.getByText("Replacement record")).toBeTruthy();
    expect(screen.queryByText("Only alternate record")).toBeNull();
    view.unmount();
    const pair = render(<><div data-instance="a"><Harness {...data} records={alt} /></div><div data-instance="b"><Harness {...data} /></div></>);
    fireEvent.click(within(pair.container.querySelector('[data-instance="a"]')).getByRole("button", { name: "Reject" }));
    expect(pair.container.querySelector('[data-instance="a"] .mh-modal--drawer')).toBeTruthy();
    expect(pair.container.querySelector('[data-instance="b"] .mh-modal--drawer')).toBeNull();
    expect(within(pair.container.querySelector('[data-instance="b"]')).getByText("Campaign investment decision principles")).toBeTruthy();
  });

  it("consumes restored records once across equivalent prop rerenders", () => {
    const view = mount({ restorations: [RESTORE_PASS] });
    expect(row("restore-pass")).toBeTruthy();
    fireEvent.click(within(row("restore-pass")).getByRole("button", { name: "Reject" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Reject" }));
    expect(row("restore-pass")).toBeNull();
    expect(count("PENDING REVIEW")).toBe("6");
    view.rerender(<Harness {...data} restorations={[{ ...RESTORE_PASS }]} />);
    expect(row("restore-pass")).toBeNull();
    expect(count("PENDING REVIEW")).toBe("6");
    view.rerender(<Harness {...data} records={[{ ...RESTORE_PASS, title: "Explicit replacement" }]} restorations={[{ ...RESTORE_PASS }]} />);
    expect(row("restore-pass")).toBeTruthy();
    expect(within(row("restore-pass")).getByText("Explicit replacement")).toBeTruthy();
  });
});
