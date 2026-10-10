import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReviewCenterPage } from "../pages/ReviewCenterPage/index.jsx";
import { REVIEW_CENTER, REVIEW_SHELL } from "./content/review-center.js";
import { filterReviews, reviewAgeDays, useReviewCenterDemo } from "./review-center-demo.js";

Element.prototype.scrollTo ??= () => {};
const RESTORE_WARNING = { id: "restore-warning", title: "Restored review", summary: "Lineage needs review", type: "Data Model", source: "Shared", submittedBy: "Current User", submitted: "Today", status: "pending", aiCheck: "Warning", warning: "Review lineage before approval." };
const RESTORE_PASS = { ...RESTORE_WARNING, id: "restore-pass", title: "Restored pass", aiCheck: "Pass", warning: "" };
const data = { content: REVIEW_CENTER, records: REVIEW_CENTER.records, suggestions: REVIEW_CENTER.suggestions, fallbackSuggestions: REVIEW_CENTER.fallbackSuggestions, ...REVIEW_SHELL, hrefFor: (id) => ({ interpreter: "/mh-host/interpreter", "review-center": "/mh-host/review-center", "scenario-library": "/mh-host/coverage/scenario-library", "feedback-quality": "/mh-host/coverage/feedback-quality" })[id] };
function Harness(props) { return <ReviewCenterPage {...useReviewCenterDemo(props)} />; }
function mount(overrides = {}) { return render(<Harness {...data} {...overrides} />); }
const TITLES = Object.fromEntries([...REVIEW_CENTER.records, RESTORE_WARNING, RESTORE_PASS].map((item) => [item.id, item.title]));
const rows = () => [...document.querySelectorAll(".mh-review-page tbody tr:not(.mh-table__empty-row)")];
/* Queue rows are DataTable rows; the first cell's open button carries the title. */
const row = (id, title = TITLES[id]) => rows().find((tr) => tr.querySelector(".mh-table__open strong")?.textContent === title) || null;
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
    mount({ records: [{ ...REVIEW_CENTER.records[0], id: "custom", title: "Custom restored", restored: true }, { ...REVIEW_CENTER.records[0], id: "restore-plain", title: "Plain record", restored: false }] });
    expect(within(row("custom", "Custom restored")).getByText("Restore")).toBeTruthy();
    expect(within(row("restore-plain", "Plain record")).queryByText("Restore")).toBeNull();
  });

  it("reads the submitted day count from the source's relative text", () => {
    expect(["2 hours ago", "Today", "Yesterday", "3 days ago", "2 weeks ago", "someday"].map(reviewAgeDays)).toEqual([0, 0, 1, 3, 14, Infinity]);
    const pending = REVIEW_CENTER.records.filter((item) => item.status === "pending");
    expect(filterReviews(REVIEW_CENTER.records, { time: "today" }).map((item) => item.id)).toEqual(pending.filter((item) => reviewAgeDays(item.submitted) === 0).map((item) => item.id));
    expect(filterReviews(REVIEW_CENTER.records, { time: "week" })).toHaveLength(pending.length);
  });

  it("filters by tab, type, Submitted window and search; counts are computed", () => {
    mount();
    expect(rows()).toHaveLength(6);
    expect(count("PENDING REVIEW")).toBe("6");
    expect(count("APPROVED THIS WEEK")).toBe("21");
    expect(count("REJECTED THIS WEEK")).toBe("0");
    expect(screen.getByRole("tab", { name: "Rejected 0" })).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Today"));
    expect(screen.getByLabelText("Today").checked).toBe(true);
    expect(rows()).toHaveLength(3);
    expect(screen.getByText("3 items")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("All time"));
    fireEvent.click(screen.getByLabelText("Data Model"));
    expect(rows()).toHaveLength(2);
    fireEvent.change(screen.getByRole("searchbox", { name: "Search review items" }), { target: { value: "Rednote" } });
    expect(rows()).toHaveLength(1);
    expect(row("pending-11")).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: /Approved/ }));
    expect(screen.getByText("No matching items")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(rows()).toHaveLength(21);
    expect(screen.getByRole("searchbox", { name: "Search review items" }).value).toBe("");
  });

  it("opens detail from its keyboard button, then rejects into the Rejected tab with a toast", () => {
    const onConfirmReject = vi.fn();
    mount({ onConfirmReject });
    fireEvent.click(row("pending-1").querySelector(".mh-table__open"));
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
    expect(count("REJECTED THIS WEEK")).toBe("1");
    expect(screen.getByRole("status").textContent).toBe("Rejected");
    fireEvent.click(screen.getByRole("tab", { name: "Rejected 1" }));
    expect(rows()).toHaveLength(1);
    fireEvent.click(within(row("pending-1")).getByRole("button", { name: "View Campaign investment decision principles" }));
    const rejected = screen.getByRole("dialog", { name: "Campaign investment decision principles" });
    expect(within(rejected).getByText("Rejected")).toBeTruthy();
    expect(within(rejected).queryByText("Rejection Reason")).toBeNull();
    expect(within(rejected).queryByRole("button", { name: /Approve|Reject|View in Knowledge Base/ })).toBeNull();
  });

  it("keeps a typed rejection reason and shows it on the rejected item", () => {
    mount();
    fireEvent.click(within(row("pending-3")).getByRole("button", { name: "Reject Commerce performance model" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Rejection Reason" }), { target: { value: "Lineage is incomplete." } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm Reject" }));
    fireEvent.click(screen.getByRole("tab", { name: "Rejected 1" }));
    fireEvent.click(row("pending-3").querySelector(".mh-table__open"));
    const detail = screen.getByRole("dialog", { name: "Commerce performance model" });
    expect(within(detail).getByText("Rejection Reason")).toBeTruthy();
    expect(within(detail).getByText("Lineage is incomplete.")).toBeTruthy();
  });

  it("keeps risk confirmation for Reviewing/Warning and approves Pass directly", () => {
    mount({ restorations: [RESTORE_WARNING, RESTORE_PASS, { ...RESTORE_PASS, title: "Duplicate id ignored" }] });
    expect(rows()).toHaveLength(8);
    fireEvent.click(within(row("pending-3")).getByRole("button", { name: "Approve Commerce performance model" }));
    expect(screen.getByRole("dialog", { name: "AI Review In Progress" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(row("pending-3")).toBeTruthy();
    fireEvent.click(within(row("restore-warning")).getByRole("button", { name: "Approve Restored review" }));
    expect(screen.getByRole("dialog", { name: "AI Warning Detected" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Approve Anyway" }));
    expect(row("restore-warning")).toBeNull();
    fireEvent.click(within(row("restore-pass")).getByRole("button", { name: "Approve Restored pass" }));
    expect(screen.queryByRole("dialog", { name: /AI (Warning|Review)/ })).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("Approved");
    expect(row("restore-pass")).toBeNull();
    expect(count("APPROVED THIS WEEK")).toBe("23");
  });

  it("reopens approved detail for View in Knowledge Base without navigation", () => {
    const onNavigate = vi.fn();
    mount({ onNavigate });
    fireEvent.click(screen.getByRole("tab", { name: /Approved/ }));
    fireEvent.click(within(row("approved-1")).getByRole("button", { name: "View Trusted analysis guardrails" }));
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
    fireEvent.click(within(pair.container.querySelector('[data-instance="a"]')).getByRole("button", { name: "Reject Only alternate record" }));
    expect(pair.container.querySelector('[data-instance="a"] .mh-modal--drawer')).toBeTruthy();
    expect(pair.container.querySelector('[data-instance="b"] .mh-modal--drawer')).toBeNull();
    expect(within(pair.container.querySelector('[data-instance="b"]')).getByText("Campaign investment decision principles")).toBeTruthy();
  });

  it("consumes restored records once across equivalent prop rerenders", () => {
    const view = mount({ restorations: [RESTORE_PASS] });
    expect(row("restore-pass")).toBeTruthy();
    fireEvent.click(within(row("restore-pass")).getByRole("button", { name: "Reject Restored pass" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Reject" }));
    expect(row("restore-pass")).toBeNull();
    expect(count("PENDING REVIEW")).toBe("6");
    view.rerender(<Harness {...data} restorations={[{ ...RESTORE_PASS }]} />);
    expect(row("restore-pass")).toBeNull();
    expect(count("PENDING REVIEW")).toBe("6");
    view.rerender(<Harness {...data} records={[{ ...RESTORE_PASS, title: "Explicit replacement" }]} restorations={[{ ...RESTORE_PASS }]} />);
    expect(row("restore-pass", "Explicit replacement")).toBeTruthy();
  });
});
