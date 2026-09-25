import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FieldLibraryView } from "../features/interpreter/FieldLibraryView/index.jsx";
import { useFieldLibraryDemo, normalizeFieldRecord, reportContextProjectLabels } from "./field-library-demo.js";
import { INTERPRETER } from "../content.js";

function Harness(props) {
  return <FieldLibraryView {...useFieldLibraryDemo(props)} />;
}

const bundle = INTERPRETER.fieldLibrary;
const AM_ID = "playbook-opportunity-scan";

function renderView(props = {}) {
  return render(<Harness {...bundle} records={INTERPRETER.records} {...props} />);
}

const cards = () => [...document.querySelectorAll(".mh-flview__card")];
const cardTitles = () => cards().map((card) => card.querySelector("h3").textContent);

describe("normalizeFieldRecord", () => {
  it("maps Report Context records to the fm shape (report name, AI flags, thumbnail, project domains)", () => {
    const record = normalizeFieldRecord(INTERPRETER.records.find((item) => item.id === "city-report-context"));
    expect(record.type).toBe("Report Context");
    expect(record.report_name).toBe("Invest City Strategy Analysis");
    expect(record.ai_interpretation_enabled).toBe(true);
    expect(record.report_thumbnail).toBe("assets/images/project-city-tabby.png");
    expect(record.business_domain).toEqual(["City Strategy"]);
    expect(record.scenario_report_ids).toEqual(["scenario-channel-performance", "scenario-campaign-review"]);
    expect(reportContextProjectLabels(record)).toEqual(["D2C Insights"]);
  });

  it("maps Email Reports records (subject, schedule trigger, recipients) and honors legacy Disable", () => {
    const weekly = normalizeFieldRecord(INTERPRETER.records.find((item) => item.id === "email-report-weekly-performance"));
    expect(weekly.email_subject).toBe("Weekly Marketing Performance | Executive Summary");
    expect(weekly.trigger_type).toBe("Scheduled · Every Monday · 09:00");
    expect(weekly.recipients).toEqual(["Emily Wang", "Sophie Taylor", "Daniel Chen"]);
    const monthly = normalizeFieldRecord(INTERPRETER.records.find((item) => item.id === "email-report-monthly-customer"));
    expect(monthly.status).toBe("Disable");
  });
});

describe("FieldLibraryView", () => {
  it("renders Report Context cards with report name, status pill and project label", () => {
    renderView({ type: "Report Context" });
    expect(cardTitles()).toEqual([
      "Invest City Strategy Analysis",
      "4P Executive Overview",
      "Customer Daily Pulse",
      "ABO Campaign Quality",
      "Social Media Performance",
      "OTT/OLV Media Data Tracking",
    ]);
    expect(screen.getAllByText("Enabled").length).toBe(6);
    /* The card meta dd + the filter option label both carry the name. */
    expect(cards().some((card) => card.querySelector(".mh-flview__report-meta dd").textContent === "DC Media Performance")).toBe(true);
    /* The create link only exists for Analytical Model. */
    expect(screen.queryByRole("link", { name: /Add/ })).toBeNull();
    /* Cards have no action buttons on this type. */
    expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
  });

  it("filters Report Context by the Project checkbox set and joins selected labels", () => {
    renderView({ type: "Report Context" });
    fireEvent.click(screen.getByLabelText("D2C Insights"));
    expect(cards().length).toBe(3); // city + fourp + customer
    expect(screen.getByText("D2C Insights", { selector: "summary b" })).toBeTruthy();
    fireEvent.click(screen.getByLabelText("DC Media Performance"));
    expect(cards().length).toBe(4); // + abo
    expect(screen.getByText("D2C Insights, DC Media Performance")).toBeTruthy();
  });

  it("opens the Report Context drawer with description, AI flags, scenario chips and scope", () => {
    const onAction = vi.fn();
    renderView({ type: "Report Context", detail: "city-report-context", onAction });
    const drawer = screen.getByRole("dialog", { name: "Invest City Strategy Analysis" });
    expect(within(drawer).getByText("Report Context")).toBeTruthy();
    expect(within(drawer).getByText("AI Interpreter Status")).toBeTruthy();
    expect(within(drawer).getAllByText("Open").length).toBe(2);
    const scenario = within(drawer).getByRole("link", { name: /Channel Performance Analysis/ });
    expect(scenario.getAttribute("href")).toContain("Scenario%20Reporting");
    expect(scenario.getAttribute("href")).toContain("scenario-channel-performance");
    expect(within(drawer).getByRole("link", { name: /Open Dashboard/ }).getAttribute("href")).toBe("reports.html");
    /* The pencil opens the description dialog through onAction. */
    fireEvent.click(within(drawer).getByRole("button", { name: "Edit report description" }));
    expect(onAction).toHaveBeenCalledWith({ action: "edit-description", id: "city-report-context" });
  });

  it("edits the report description: confirm stays disabled until the text changes, then patches + history", () => {
    const onConfirm = vi.fn();
    renderView({ type: "Report Context", detail: "city-report-context", descriptionEdit: "city-report-context", onDescriptionConfirm: onConfirm });
    const dialog = screen.getByRole("dialog", { name: "Edit Report Description" });
    const area = within(dialog).getByLabelText("Report Description");
    const confirm = within(dialog).getByRole("button", { name: "Submit" });
    expect(confirm.disabled).toBe(true);
    fireEvent.change(area, { target: { value: "Updated description." } });
    expect(confirm.disabled).toBe(false);
    fireEvent.click(confirm);
    expect(onConfirm).toHaveBeenCalledWith({ id: "city-report-context" });
    /* The card + drawer now show the new description. */
    expect(screen.queryByRole("dialog", { name: "Edit Report Description" })).toBeNull();
    expect(screen.getAllByText("Updated description.").length).toBeGreaterThan(0);
  });

  it("renders Metric Dictionary cards with unit/type/data-model meta and the synonym overflow chip", () => {
    renderView({ type: "Metric Dictionary" });
    expect(cardTitles()).toEqual(["Member conversion", "Campaign ROI", "Promotion lift"]);
    /* The "…" overflow marker is an aria-labelled span, matching the original. */
    expect(screen.getAllByLabelText("More synonyms").length).toBe(3);
    /* Metric-type filter narrows to Base only. */
    fireEvent.click(screen.getByLabelText("Base"));
    expect(cardTitles()).toEqual(["Member conversion"]);
    expect(screen.getByText("Base", { selector: "summary b" })).toBeTruthy();
  });

  it("opens the Metric Dictionary drawer with all governed sections", () => {
    renderView({ type: "Metric Dictionary", detail: "metric-dictionary-member-conversion" });
    const drawer = screen.getByRole("dialog", { name: "Member conversion" });
    for (const label of ["Metric Name", "Unit", "Type", "Synonyms", "Data Model", "Business Definition", "Calculation Rules"]) {
      expect(within(drawer).getByText(label)).toBeTruthy();
    }
    expect(within(drawer).getByText("Member CVR")).toBeTruthy();
    /* No actions in the MD drawer footer — it renders empty. */
    expect(within(drawer).queryByRole("button", { name: "Disable" })).toBeNull();
  });

  it("gates Analytical Model actions by owner+status and runs disable → delete-blocked", () => {
    const onNavigate = vi.fn();
    renderView({ type: "Analytical Model", onNavigate });
    expect(cardTitles()).toEqual(["Opportunity scan playbook"]);
    expect(screen.getByRole("link", { name: /Add Analytical Model/ }).getAttribute("href")).toContain("knowledge-create.html");

    /* Enabled + owner: only "Disable" is clickable (edit/delete render disabled). */
    const edit = screen.getByRole("button", { name: "Edit" });
    expect(edit.disabled).toBe(true);
    expect(screen.getByRole("button", { name: "Delete" }).disabled).toBe(true);
    const disable = screen.getByRole("button", { name: "Disable" });
    expect(disable.disabled).toBe(false);

    fireEvent.click(disable);
    fireEvent.click(screen.getByRole("button", { name: "Confirm Offline" }));
    expect(cards()[0].querySelector(".mh-flview__state").textContent).toBe("Disabled");

    /* Now disabled: edit navigates, delete hits the references guard. */
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ id: AM_ID }));
    expect(onNavigate.mock.calls[0][0].href).toContain("mode=edit");

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    const blocked = screen.getByRole("dialog");
    expect(within(blocked).getByText("Deletion blocked")).toBeTruthy();
    expect(within(blocked).getByText(/City Strategy Dashboard/)).toBeTruthy();
  });

  it("renders Email Reports cards with send time, recipient chips and data model", () => {
    renderView({ type: "Email Reports" });
    expect(cardTitles()).toEqual([
      "Weekly Marketing Performance",
      "Campaign Performance Alert",
      "Monthly Customer Growth Review",
    ]);
    expect(screen.getByText("Every Monday · 09:00")).toBeTruthy();
    /* Every card's Data Model value is "All models" (the filter summary is a
       separate element with the same text). */
    expect(
      cards().map((card) => card.querySelector(".mh-flview__email-meta > div:last-child strong").textContent),
    ).toEqual(["All models", "All models", "All models"]);
    /* The disabled record carries the is-disabled class. */
    const monthly = screen.getByText("Monthly Customer Growth Review").closest("article");
    expect(monthly.className).toContain("is-disabled");
  });

  it("opens the Email Reports drawer with subject/trigger/recipients sections", () => {
    renderView({ type: "Email Reports", detail: "email-report-campaign-alert" });
    const drawer = screen.getByRole("dialog", { name: "Campaign Performance Alert | Action Required" });
    expect(within(drawer).getByText("Email Subject")).toBeTruthy();
    expect(within(drawer).getByText("Olivia Zhang")).toBeTruthy();
    expect(within(drawer).getByText("Noah Wang")).toBeTruthy(); // CC
    expect(within(drawer).getByText("Data Snapshot Date")).toBeTruthy();
    /* ER drawer hides the footer entirely. */
    expect(drawer.querySelector(".mh-modal__foot")).toBeNull();
  });

  it("searches the whole record JSON and shows the per-type empty state", () => {
    renderView({ type: "Metric Dictionary" });
    fireEvent.change(screen.getByLabelText("Search knowledge"), { target: { value: "roi" } });
    expect(cardTitles()).toEqual(["Campaign ROI"]);
    fireEvent.change(screen.getByLabelText("Search knowledge"), { target: { value: "zzzzz" } });
    expect(cards().length).toBe(0);
    expect(screen.getByText("No knowledge matches your filters.")).toBeTruthy();
  });

  it("paginates compact style and resets to page 1 on query/filter changes", () => {
    renderView({ type: "Report Context", pageSize: 5 });
    expect(cards().length).toBe(5);
    expect(screen.getByText("1 / 2")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(cards().length).toBe(1);
    expect(screen.getByText("2 / 2")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Search knowledge"), { target: { value: "4P" } });
    expect(screen.getByText("1 / 1")).toBeTruthy();
  });

  it("seeds an open dialog for stories via the dialog prop", () => {
    renderView({ type: "Analytical Model", dialog: { kind: "disable-confirm", id: AM_ID } });
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Confirm Operation")).toBeTruthy();
    expect(within(dialog).getByText(/offline this knowledge/)).toBeTruthy();
  });
});
