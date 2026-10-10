/* Drives the consumer-built report desk (WP5 step 4): the host owns the Report
 * Copilot's whole state, and a thread belongs to the report it was about. */
import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReportCopilotApp } from "./ReportCopilotApp.tsx";
import { demoData, type CockpitData } from "./CockpitApp.tsx";
import { ALT_COPILOT, ALT_GROUPS, ALT_KNOWLEDGE, ALT_PROJECTS } from "../../src/design/demo/__fixtures__/alt-cockpit.js";

window.HTMLElement.prototype.scrollIntoView ??= () => {};
window.HTMLElement.prototype.scrollTo ??= () => {};

const altData = { projects: ALT_PROJECTS, groups: ALT_GROUPS, knowledge: ALT_KNOWLEDGE, detailsSections: [], copilot: ALT_COPILOT } as unknown as CockpitData;

const opener = () => screen.getByRole("button", { name: "ALT COPILOT" });
const copilot = () => document.querySelector(".mh-copilot") as HTMLElement;
const isOpen = () => copilot().classList.contains("is-open");
const picker = () => screen.getByLabelText("Report") as HTMLSelectElement;
const recommendations = () => [...copilot().querySelectorAll(".mh-copilot__rec")] as HTMLElement[];
const composer = () => within(copilot()).getByPlaceholderText("Alt composer placeholder...") as HTMLTextAreaElement;
const ask = (question: string) => {
  fireEvent.change(composer(), { target: { value: question } });
  fireEvent.click(within(copilot()).getByText("ASK"));
};
const reportKeys = () => [...picker().options].map((option) => option.value);

describe("consumer-built report desk", () => {
  it("lists every report of the data and opens the Copilot on the selected one", () => {
    render(<ReportCopilotApp data={altData} />);
    expect(reportKeys()).toEqual(["alpha:0", "alpha:1", "beta:0"]);
    expect(isOpen()).toBe(false);
    fireEvent.click(opener());
    expect(isOpen()).toBe(true);
    expect(within(copilot()).getByText("Alt Assistant")).toBeTruthy();
    expect(recommendations()).toHaveLength(2);
  });

  it("an answer and a follow-up live in the host's state", () => {
    render(<ReportCopilotApp data={altData} />);
    fireEvent.click(opener());
    fireEvent.click(recommendations()[1]);
    expect(within(copilot()).getByText("Alt standard answer title")).toBeTruthy();
    ask("Why did it move?");
    expect(within(copilot()).getByText("Why did it move?")).toBeTruthy();
    // the follow-up appends under the answer instead of replacing it
    expect(within(copilot()).getByText("Alt standard answer title")).toBeTruthy();
    expect(composer().value).toBe("");
  });

  it("closing and reopening on the same report keeps the thread", () => {
    render(<ReportCopilotApp data={altData} />);
    fireEvent.click(opener());
    fireEvent.click(recommendations()[1]);
    fireEvent.click(within(copilot()).getByRole("button", { name: /Close AI workspace/i }));
    expect(isOpen()).toBe(false);
    fireEvent.click(opener());
    expect(within(copilot()).getByText("Alt standard answer title")).toBeTruthy();
  });

  it("switching the report starts an empty thread under the new report's profile", () => {
    render(<ReportCopilotApp data={altData} />);
    fireEvent.click(opener());
    fireEvent.click(recommendations()[1]);
    ask("Why did it move?");
    fireEvent.change(composer(), { target: { value: "half-typed" } });
    fireEvent.change(picker(), { target: { value: "alpha:1" } });
    // still open, new report's recommendations, nothing carried over
    expect(isOpen()).toBe(true);
    expect(within(copilot()).queryByText("Alt standard answer title")).toBeNull();
    expect(within(copilot()).queryByText("Why did it move?")).toBeNull();
    expect(composer().value).toBe("");
    expect(within(copilot()).getByText("Alt digest pick")).toBeTruthy();
    expect(within(copilot()).queryByText("Alt driver pick")).toBeNull();
  });

  it("returning to a report does not bring its old thread back", () => {
    render(<ReportCopilotApp data={altData} />);
    fireEvent.click(opener());
    fireEvent.click(recommendations()[1]);
    fireEvent.change(picker(), { target: { value: "alpha:1" } });
    fireEvent.change(picker(), { target: { value: "alpha:0" } });
    expect(within(copilot()).queryByText("Alt standard answer title")).toBeNull();
  });

  it("Back and New session clear what the host holds", () => {
    render(<ReportCopilotApp data={altData} />);
    fireEvent.click(opener());
    fireEvent.click(recommendations()[1]);
    fireEvent.click(within(copilot()).getByRole("button", { name: /Suggested questions/i }));
    expect(within(copilot()).queryByText("Alt standard answer title")).toBeNull();
    expect(recommendations()).toHaveLength(2);
    ask("One more?");
    fireEvent.click(within(copilot()).getByRole("button", { name: /New session|New chat/i }));
    expect(within(copilot()).queryByText("One more?")).toBeNull();
  });

  it("Escape closes the drawer and focus returns to the opener", () => {
    render(<ReportCopilotApp data={altData} />);
    opener().focus();
    fireEvent.click(opener());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(opener());
  });

  it("swapping the data changes the reports and answers, not the desk", () => {
    const { unmount } = render(<ReportCopilotApp data={altData} />);
    expect(document.body.textContent).toContain("Alt Metro Uplift Study");
    unmount();
    render(<ReportCopilotApp data={demoData} />);
    expect(document.body.textContent).not.toContain("Alt Metro Uplift Study");
    expect(document.body.textContent).toContain("REPORT COPILOT");
  });

  it("two desks on one page keep separate state", () => {
    render(<><div data-app="a"><ReportCopilotApp data={altData} /></div><div data-app="b"><ReportCopilotApp data={altData} /></div></>);
    const [first] = screen.getAllByRole("button", { name: "ALT COPILOT" });
    fireEvent.click(first);
    const [a, b] = [...document.querySelectorAll(".mh-copilot")];
    expect(a.classList.contains("is-open")).toBe(true);
    expect(b.classList.contains("is-open")).toBe(false);
  });
});
