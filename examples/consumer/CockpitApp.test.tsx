/* Drives the consumer-built Marketing Cockpit (WP5 step 3): one page, two
 * independent assistants, data swapped without touching look or behaviour. */
import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CockpitApp, demoData, type CockpitData } from "./CockpitApp.tsx";
import { ALT_COPILOT, ALT_GROUPS, ALT_KNOWLEDGE, ALT_PROJECTS } from "../../src/design/demo/__fixtures__/alt-cockpit.js";

window.HTMLElement.prototype.scrollIntoView ??= () => {};
window.HTMLElement.prototype.scrollTo ??= () => {};

const altData = { projects: ALT_PROJECTS, groups: ALT_GROUPS, knowledge: ALT_KNOWLEDGE, detailsSections: [], copilot: ALT_COPILOT } as unknown as CockpitData;

const openLive = () => {
  fireEvent.click(screen.getByText("Alpha Portfolio").closest("a")!);
  fireEvent.click(screen.getAllByRole("link", { name: /Alt Metro Uplift Study/ })[0]);
};
const launcher = () => document.querySelector(".mh-launcher") as HTMLElement;
const panel = () => document.querySelector(".mh-assistant") as HTMLElement | null;
const copilot = () => document.querySelector(".mh-copilot") as HTMLElement;
const copilotOpen = () => copilot().classList.contains("is-open");

describe("consumer-built Marketing Cockpit", () => {
  it("lists the demo catalog and narrows it by search", () => {
    render(<CockpitApp />);
    expect(screen.getByText("City Strategy")).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText("Search dashboards"), { target: { value: "zzz-nothing" } });
    expect(screen.getByText("No matching reports.")).toBeTruthy();
  });

  it("walks catalog → project → live report and back", () => {
    render(<CockpitApp data={altData} />);
    expect(screen.getByText("Beta Portfolio")).toBeTruthy();
    fireEvent.click(screen.getByText("Alpha Portfolio").closest("a")!);
    expect(screen.getByText("Alt Weekly Digest")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("link", { name: /Alt Metro Uplift Study/ })[0]);
    expect(document.querySelector(".mh-live-report, .mh-live")).toBeTruthy();
    fireEvent.click(screen.getByRole("link", { name: /Report library/i }));
    expect(screen.getByText("Alt Weekly Digest")).toBeTruthy();
  });

  it("workspace assistant: opens, answers a suggestion, closes; Copilot stays closed", () => {
    render(<CockpitApp data={altData} />);
    fireEvent.click(launcher());
    expect(panel()).toBeTruthy();
    fireEvent.click(screen.getByText("ROI trend across active campaigns"));
    expect(screen.getByText(/2 report projects are in the catalog/)).toBeTruthy();
    fireEvent.click(panel()!.querySelector(".mh-assistant__close")!);
    expect(panel()).toBeNull();
  });

  it("live report: the launcher opens the Report Copilot, which answers on its own", () => {
    render(<CockpitApp data={altData} />);
    openLive();
    fireEvent.click(launcher());
    expect(screen.getByText("ALT COPILOT")).toBeTruthy();
    const recommendations = [...document.querySelectorAll(".mh-copilot__rec")];
    expect(recommendations).toHaveLength(2);
    fireEvent.click(recommendations[1]);
    expect(screen.getByText("Alt standard answer title")).toBeTruthy();
    expect(screen.getByText("Alt finding one.")).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText("Alt composer placeholder..."), { target: { value: "Why?" } });
    fireEvent.click(screen.getByText("ASK"));
    expect(screen.getByText("Why?")).toBeTruthy();
    // the workspace assistant was never opened
    expect(panel()).toBeNull();
    fireEvent.click(within(copilot()).getByRole("button", { name: /Close AI workspace/i }));
    expect(copilotOpen()).toBe(false);
  });

  it("the two assistants keep separate state: an answer in one never shows in the other", () => {
    render(<CockpitApp data={altData} />);
    // ask the workspace assistant on the catalog, then open a live report
    fireEvent.click(launcher());
    fireEvent.click(screen.getByText("ROI trend across active campaigns"));
    fireEvent.click(panel()!.querySelector(".mh-assistant__close")!);
    openLive();
    fireEvent.click(launcher());
    expect(screen.queryByText(/2 report projects are in the catalog/)).toBeNull();
    expect(screen.getByText("ALT COPILOT")).toBeTruthy();
  });

  it("swapping the data changes what is listed, not the page", () => {
    const { unmount } = render(<CockpitApp data={altData} />);
    const altText = document.body.textContent!;
    expect(altText).toContain("Alpha Portfolio");
    expect(altText).not.toContain("City Strategy");
    unmount();
    render(<CockpitApp data={demoData} />);
    expect(document.body.textContent).toContain("City Strategy");
    expect(document.body.textContent).not.toContain("Alpha Portfolio");
  });

  it("two apps on one page do not share state", () => {
    render(<><div data-app="a"><CockpitApp data={altData} /></div><div data-app="b"><CockpitApp data={altData} /></div></>);
    const [first] = [...document.querySelectorAll(".mh-launcher")] as HTMLElement[];
    fireEvent.click(first);
    expect(document.querySelectorAll(".mh-assistant").length).toBe(1);
    expect(document.querySelector('[data-app="a"] .mh-assistant')).toBeTruthy();
    expect(document.querySelector('[data-app="b"] .mh-assistant')).toBeNull();
  });
});
