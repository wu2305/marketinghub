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

const cards = () => [...document.querySelectorAll(".mh-srview .mh-library-item")];
const cardTitles = () => cards().map((card) => card.querySelector(".mh-library-item__title button").textContent);
const listButton = (name) => within(screen.getByRole("list", { name: "Scenario reports" })).getByRole("button", { name });

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
    expect(cards()[0].querySelector(".mh-library-item__head > .mh-badge")?.textContent).toBe("Disabled");
    expect(cards()[0].textContent).toContain("Building");
    /* every seed is owned by another user — actions are blocked but operable (B7). */
    const actions = within(screen.getByRole("list", { name: "Scenario reports" })).getAllByRole("button", { name: /^Edit / });
    expect(actions.length).toBe(3);
    for (const action of actions) {
      expect(action.getAttribute("aria-disabled")).toBe("true");
      expect(action.title).toBe("Knowledge created by others cannot be operated.");
    }
    fireEvent.click(actions[0]);
    expect(within(screen.getByRole("dialog")).getByText("Permission denied")).toBeTruthy();
  });

  it("searches across title, description, report, creator and guidance", () => {
    render(<Harness query="sophie" />);
    expect(cardTitles()).toEqual(["Channel Exception Watch"]);
  });

  it("filters by the Status select", () => {
    render(<Harness />);
    fireEvent.click(screen.getByLabelText("Enabled"));
    expect(cardTitles()).toEqual(["Campaign Review Reporting"]);
  });

  it("opens the detail drawer with title pills, sections and meta footer", () => {
    const onOpen = vi.fn();
    render(<Harness onOpen={onOpen} />);
    fireEvent.click(listButton("Channel Performance Analysis"));
    expect(onOpen).toHaveBeenCalled();
    const drawer = document.querySelector(".mh-srview__drawer");
    expect(drawer).toBeTruthy();
    expect(within(drawer).getByText("SCENARIO REPORTING")).toBeTruthy();
    expect(within(drawer).getByText("Channel Performance Analysis")).toBeTruthy();
    expect(within(drawer).getAllByText("Building").length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText("Disabled").length).toBeGreaterThan(0);
    expect(within(drawer).getByText("Invest City Strategy Analysis").getAttribute("href")).toBe(
      "/assets/pages/reports.html?project=city&dashboard=0",
    );
    expect(within(drawer).getByText(/AI Interpreter is enabled automatically/)).toBeTruthy();
    expect(within(drawer).getByText("City strategy briefing")).toBeTruthy();
    expect(within(drawer).getByText(/Emily Wang/)).toBeTruthy();
  });

  it("omits the AI-enable note on a published scenario", () => {
    render(<Harness detail="scenario-campaign-review" />);
    const drawer = document.querySelector(".mh-srview__drawer");
    expect(within(drawer).queryByText(/AI Interpreter is enabled automatically/)).toBeNull();
    expect(within(drawer).getAllByText("Enabled").length).toBeGreaterThan(0);
    expect(within(drawer).getAllByText("Published").length).toBeGreaterThan(0);
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

  it("on an enabled owned record edit offers to go offline; disable confirms and shows a toast", () => {
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
    /* The source's "disable first" dialog was dead code behind native
       disabled buttons (scenario-reports.js:209); A3 makes it the guidance. */
    expect(listButton("Edit My Scenario").getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(listButton("Edit My Scenario"));
    expect(screen.getByText("Please take the knowledge offline first")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(listButton("Disable My Scenario"));
    expect(screen.getByText("Confirm Operation")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm Disable" }));
    expect(screen.queryByText("Confirm Operation")).toBeNull();
    expect(listButton("Edit My Scenario").hasAttribute("aria-disabled")).toBe(false);
    expect(document.querySelector(".mh-toast").textContent).toBe("Disabled successfully");
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
    fireEvent.click(listButton("Delete My Disabled Scenario"));
    expect(screen.getByText("Confirm Operation")).toBeTruthy();
    expect(screen.getByRole("dialog").classList.contains("mh-confirm--danger")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete" }));
    expect(cardTitles()).toEqual([]);
    expect(document.querySelector(".mh-toast").textContent).toBe("Deleted successfully");
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
    fireEvent.click(listButton("Edit Editable Scenario"));
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ id: "own-3", href: expect.stringContaining("knowledge-create.html") }));
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
