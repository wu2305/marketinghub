import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { INTERPRETER } from "../content.js";
import { useScenarioDemo, normalizeScenarioRecord } from "./scenario-demo.js";
import { ScenarioReportsView } from "../features/interpreter/ScenarioReportsView/index.jsx";

const RECORDS = INTERPRETER.scenarioReports.records;

function Harness(props) {
  const demo = useScenarioDemo({ records: RECORDS, ...props });
  return <ScenarioReportsView {...demo} />;
}

const cards = () => [...document.querySelectorAll(".mh-srview__card")];
const cardTitles = () => cards().map((card) => card.querySelector("h3").textContent);

describe("useScenarioDemo + ScenarioReportsView", () => {
  it("normalizes the seeded records (workflow status, enabled flag, report href)", () => {
    const channel = normalizeScenarioRecord(RECORDS[0]);
    expect(channel.workflow_status).toBe("Building");
    expect(channel.ai_interpreter_enabled).toBe(false);
    expect(channel.reportHref).toBe("/assets/pages/reports.html?project=city&dashboard=0");
    const review = normalizeScenarioRecord(RECORDS[1]);
    expect(review.workflow_status).toBe("Published");
    expect(review.ai_interpreter_enabled).toBe(true);
  });

  it("renders the seeded cards with process pills and gated actions", () => {
    render(<Harness />);
    expect(cardTitles()).toEqual([
      "Channel Performance Analysis",
      "Campaign Review Reporting",
      "Channel Exception Watch",
    ]);
    expect(cards()[0].querySelector(".mh-badge--knowledge")?.textContent).toBe("Disabled");
    /* every seed is owned by another user — all three icons are disabled with
       the permission tooltip, matching the original's real `disabled` attr. */
    const actions = screen.getAllByRole("button", { name: /^Edit / });
    expect(actions.length).toBe(3);
    for (const action of actions) {
      expect(action.disabled).toBe(true);
      expect(action.title).toBe("Knowledge created by others cannot be operated.");
    }
  });

  it("searches across title, description, report, creator and guidance", () => {
    render(<Harness query="sophie" />);
    expect(cardTitles()).toEqual(["Channel Exception Watch"]);
  });

  it("filters by the Status select", () => {
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "Enabled" } });
    expect(cardTitles()).toEqual(["Campaign Review Reporting"]);
  });

  it("opens the detail drawer with title pills, sections and meta footer", () => {
    const onOpen = vi.fn();
    render(<Harness onOpen={onOpen} />);
    fireEvent.click(document.querySelector(".mh-srview__card[data-id='scenario-channel-performance'] h3"));
    expect(onOpen).toHaveBeenCalled();
    const drawer = document.querySelector(".mh-srview__drawer");
    expect(drawer).toBeTruthy();
    expect(within(drawer).getByText("SCENARIO REPORTING")).toBeTruthy();
    expect(within(drawer).getByText("Channel Performance Analysis")).toBeTruthy();
    expect(within(drawer).getByText("Building")).toBeTruthy();
    expect(within(drawer).getByText("Disabled")).toBeTruthy();
    expect(within(drawer).getByText("Invest City Strategy Analysis").getAttribute("href")).toBe(
      "/assets/pages/reports.html?project=city&dashboard=0",
    );
    expect(within(drawer).getByText(/AI Interpreter is enabled automatically/)).toBeTruthy();
    expect(within(drawer).getByText("City strategy briefing")).toBeTruthy();
    expect(within(drawer).getByText("Emily Wang")).toBeTruthy();
  });

  it("omits the AI-enable note on a published scenario", () => {
    render(<Harness detail="scenario-campaign-review" />);
    const drawer = document.querySelector(".mh-srview__drawer");
    expect(within(drawer).queryByText(/AI Interpreter is enabled automatically/)).toBeNull();
    expect(within(drawer).getByText("Enabled")).toBeTruthy();
    expect(within(drawer).getByText("Published")).toBeTruthy();
  });

  it("closes the drawer via the close button", () => {
    render(<Harness detail="scenario-channel-performance" />);
    fireEvent.click(screen.getByLabelText("Close knowledge asset"));
    expect(document.querySelector(".mh-srview__drawer")).toBeNull();
  });

  it("shows the empty state when nothing matches", () => {
    render(<Harness query="no such scenario" />);
    expect(screen.getByText("No matching records")).toBeTruthy();
    expect(cards().length).toBe(0);
  });

  it("on an enabled owned record only Disable is clickable and confirms", () => {
    const own = {
      id: "own-1",
      title: "My Scenario",
      description: "Owned.",
      creator: "Current User",
      owner: "Current User",
      workflow_status: "Published",
      ai_interpreter_enabled: true,
    };
    render(<Harness records={[own]} />);
    /* Edit/Delete stay disabled while enabled — the original's
       "Disable knowledge first" dialog is dead code (disabled buttons
       never fire clicks). */
    expect(screen.getByRole("button", { name: "Edit My Scenario" }).disabled).toBe(true);
    expect(screen.getByRole("button", { name: "Delete My Scenario" }).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Disable My Scenario" }));
    expect(screen.getByText("Confirm Operation")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Disable" }));
    expect(screen.queryByText("Confirm Operation")).toBeNull();
    expect(screen.getByRole("button", { name: "Edit My Scenario" }).disabled).toBe(false);
  });

  it("deletes a disabled owned record via the confirm dialog", () => {
    const own = {
      id: "own-2",
      title: "My Disabled Scenario",
      description: "Owned.",
      creator: "Current User",
      owner: "Current User",
      workflow_status: "Draft",
      ai_interpreter_enabled: false,
    };
    render(<Harness records={[own]} />);
    fireEvent.click(screen.getByRole("button", { name: "Delete My Disabled Scenario" }));
    expect(screen.getByText("Confirm Operation")).toBeTruthy();
    expect(screen.getByRole("dialog").classList.contains("mh-confirm--danger")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete" }));
    expect(cardTitles()).toEqual([]);
  });

  it("navigates to the create page when editing a disabled owned record", () => {
    const own = {
      id: "own-3",
      title: "Editable Scenario",
      description: "Owned.",
      creator: "Current User",
      owner: "Current User",
      workflow_status: "Draft",
      ai_interpreter_enabled: false,
    };
    const onNavigate = vi.fn();
    render(<Harness records={[own]} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Editable Scenario" }));
    expect(onNavigate).toHaveBeenCalledWith(expect.stringContaining("knowledge-create.html"));
    expect(onNavigate).toHaveBeenCalledWith(expect.stringContaining("id=own-3"));
  });

  it("hides non-owned draft records (original rule)", () => {
    const draft = {
      id: "other-draft",
      title: "Hidden Draft",
      description: "Not owned.",
      creator: "Emily Wang",
      workflow_status: "Draft",
      ai_interpreter_enabled: false,
    };
    render(<Harness records={[...RECORDS, draft]} />);
    expect(cardTitles()).not.toContain("Hidden Draft");
    expect(cardTitles().length).toBe(3);
  });
});
