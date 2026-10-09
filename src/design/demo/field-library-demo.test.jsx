import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FieldLibraryView } from "../features/interpreter/FieldLibraryView/index.jsx";
import { useFieldLibraryDemo, normalizeFieldRecord, reportContextProjectLabels } from "./field-library-demo.js";
import { demoImage } from "./images.js";
import { INTERPRETER } from "../content.js";

function Harness(props) {
  return <FieldLibraryView {...useFieldLibraryDemo(props)} />;
}

const bundle = INTERPRETER.fieldLibrary;
const AM_ID = "playbook-opportunity-scan";

function renderView(props = {}) {
  return render(<Harness {...bundle} records={INTERPRETER.records} {...props} />);
}
/* The seeded Analytical Model is a draft (offline, R3); these tests need a published, enabled one. */
const publishedRecords = INTERPRETER.records.map((record) => (record.id === AM_ID ? { ...record, stage: "Published", status: "Enable" } : record));

const cards = () => [...document.querySelectorAll(".mh-flview .mh-library-item")];
const cardTitles = () => cards().map((card) => card.querySelector(".mh-library-item__title button").textContent);
const AM_NAME = "Opportunity scan playbook";
const listButton = (name) => within(screen.getByRole("list", { name: "Analytical Model records" })).getByRole("button", { name });

describe("normalizeFieldRecord", () => {
  it("maps Report Context records to the fm shape (report name, AI flags, thumbnail, project domains)", () => {
    const record = normalizeFieldRecord(INTERPRETER.records.find((item) => item.id === "city-report-context"));
    expect(record.type).toBe("Report Context");
    expect(record.report_name).toBe("Invest City Strategy Analysis");
    expect(record.ai_interpretation_enabled).toBe(true);
    expect(record.report_thumbnail).toBe(demoImage("assets/images/project-city-tabby.png"));
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
    expect(cards().some((card) => card.querySelector(".mh-library-item__meta dd").textContent === "DC Media Performance")).toBe(true);
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

  it("renders ordered metric fields and pairs Unit/Type without dropping synonym content", () => {
    renderView({ type: "Metric Dictionary" });
    expect(cardTitles()).toEqual(["Member conversion", "Campaign ROI", "Promotion lift"]);
    expect([...cards()[0].querySelectorAll("dt")].map(e => e.textContent)).toEqual(["Synonyms", "Data model", "Unit", "Type"]);
    expect(cards()[0].querySelector(".mh-library-item__row--pair").querySelectorAll("dt").length).toBe(2);
    expect(cards()[0].querySelectorAll(".mh-chip-list--single-line li").length).toBe(4);
    expect(cards()[0].querySelector(".mh-chip-list li").getAttribute("title")).toBe(cards()[0].querySelector(".mh-chip-list li").textContent);
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

  it("keeps a URL-seeded detail open when the same host instance changes knowledge type", () => {
    const { rerender } = renderView({ type: "Report Context", detail: "city-report-context" });
    expect(screen.getByRole("dialog", { name: "Invest City Strategy Analysis" })).toBeTruthy();
    rerender(<Harness {...bundle} records={INTERPRETER.records} type="Metric Dictionary" detail="metric-dictionary-member-conversion" />);
    expect(screen.getByRole("dialog", { name: "Member conversion" })).toBeTruthy();
    rerender(<Harness {...bundle} records={INTERPRETER.records} type="Email Reports" detail={null} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("governs Analytical Model actions: blocked actions explain, offline-first continues, references block delete", () => {
    const onNavigate = vi.fn();
    renderView({ type: "Analytical Model", onNavigate, records: publishedRecords });
    expect(cardTitles()).toEqual([AM_NAME]);
    expect(screen.getByRole("link", { name: /Add Analytical Model/ }).getAttribute("href")).toContain("knowledge-create.html");

    /* Enabled + owner: edit/delete are blocked but operable (pattern B7). */
    const edit = listButton(`Edit ${AM_NAME}`);
    expect(edit.getAttribute("aria-disabled")).toBe("true");
    expect(edit.getAttribute("title")).toBe("Disable knowledge first");
    expect(listButton(`Disable ${AM_NAME}`).hasAttribute("aria-disabled")).toBe(false);

    /* Edit offers to go offline, then continues to the edit page. */
    fireEvent.click(edit);
    fireEvent.click(screen.getByRole("button", { name: "Go Offline" }));
    expect(cards()[0].querySelector(".mh-library-item__head > .mh-badge").textContent).toBe("Disabled");
    expect(document.querySelector(".mh-toast").textContent).toBe("Disabled successfully");
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ id: AM_ID }));
    expect(onNavigate.mock.calls[0][0].href).toContain("mode=edit");

    /* Now disabled: delete hits the references guard (field-library.js:702-710). */
    fireEvent.click(listButton(`Delete ${AM_NAME}`));
    const blocked = screen.getByRole("dialog");
    expect(within(blocked).getByText("Deletion blocked")).toBeTruthy();
    expect(within(blocked).getByText(/City Strategy Dashboard/)).toBeTruthy();
  });

  it("uses disabled availability consistently even with an obsolete enabled flag", () => {
    renderView({ type: "Analytical Model", records: INTERPRETER.records.map(record => record.id === AM_ID ? { ...record, status: "Disable", availability: "enabled" } : record) });
    expect(cards()[0].querySelector(".mh-library-item__head > .mh-badge").textContent).toBe("Disabled");
    expect(listButton(`Edit ${AM_NAME}`).hasAttribute("aria-disabled")).toBe(false);
    expect(listButton(`Delete ${AM_NAME}`).hasAttribute("aria-disabled")).toBe(false);
    expect(listButton(`Disable ${AM_NAME}`).getAttribute("aria-disabled")).toBe("true");
  });

  it("ignores obsolete draft metadata on Analytical Model and uses availability", () => {
    renderView({ type: "Analytical Model" });
    expect(cards()[0].querySelector(".mh-library-item__head > .mh-badge").textContent).toBe("Enabled");
    expect(cards()[0].querySelector(".mh-library-item__draft")).toBeNull();
    expect(listButton(`Edit ${AM_NAME}`).getAttribute("aria-disabled")).toBe("true");
    expect(listButton(`Disable ${AM_NAME}`).hasAttribute("aria-disabled")).toBe(false);
  });

  it("disables an Analytical Model after confirmation and shows a toast", () => {
    renderView({ type: "Analytical Model", records: publishedRecords });
    fireEvent.click(listButton(`Disable ${AM_NAME}`));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Offline" }));
    expect(cards()[0].querySelector(".mh-library-item__head > .mh-badge").textContent).toBe("Disabled");
    expect(document.querySelector(".mh-toast").hidden).toBe(false);
    fireEvent.click(listButton(`Disable ${AM_NAME}`));
    expect(within(screen.getByRole("dialog")).getByText("Knowledge already disabled")).toBeTruthy();
  });

  it("renders Email Reports with ordered model, recipients and send time", () => {
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
      cards().map((card) => card.querySelector(".mh-library-item__meta > div:first-child dd").textContent),
    ).toEqual(["All models", "All models", "All models"]);
    expect([...cards()[0].querySelectorAll("dt")].map(e => e.textContent)).toEqual(["Data Model", "Recipients", "Send time"]);
    expect(cards()[0].querySelectorAll(".mh-chip-list--single-line li").length).toBe(3);
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
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(cards().length).toBe(3);
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
    renderView({ type: "Analytical Model", records: publishedRecords, dialog: { kind: "disable-confirm", id: AM_ID } });
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Confirm Operation")).toBeTruthy();
    expect(within(dialog).getByText(/offline this knowledge/)).toBeTruthy();
  });
});
