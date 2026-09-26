import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarketingCockpitPage } from "../index.js";
import { cityInvestScenarioSource, useCockpitDemo } from "./index.js";
import { ALT_CITY_INVEST, ALT_COPILOT, ALT_GROUPS, ALT_KNOWLEDGE, ALT_MODEL_FLOW, ALT_PROJECTS, altReportAnswer } from "./__fixtures__/alt-cockpit.js";

// jsdom does not implement scrollIntoView; the copilot chat entry calls it on mount.
window.HTMLElement.prototype.scrollIntoView ??= () => {};

function Harness(props) {
  return <MarketingCockpitPage {...useCockpitDemo(props)} />;
}

function baseProps(overrides = {}) {
  return {
    logo: { src: "/assets/images/tapestry-logo.png", alt: "Alt logo", href: "/alt" },
    navigation: [],
    hero: { title: "Alt Cockpit" },
    query: "",
    project: "all",
    view: "catalog",
    dashboard: null,
    details: null,
    assistantOpen: false,
    workspaceOpen: false,
    prompt: "",
    groups: ALT_GROUPS,
    projects: ALT_PROJECTS,
    knowledge: ALT_KNOWLEDGE,
    cityInvest: { ...ALT_CITY_INVEST, getScenario: cityInvestScenarioSource(ALT_CITY_INVEST) },
    demo: { copilot: ALT_COPILOT, modelFlow: ALT_MODEL_FLOW, reportAnswerFor: altReportAnswer },
    assistant: { title: "Alt Page Assistant" },
    ...overrides,
  };
}

function openFilter(container, labelText) {
  const item = screen.getByText(labelText).closest(".mh-sc-fitem");
  const fval = item.querySelector(".mh-sc-fval");
  fireEvent.click(fval);
  return item.querySelector(".mh-sc-panel");
}

function pickOption(panel, text) {
  const row = [...panel.querySelectorAll(".mh-sc-prow")].find((el) => el.textContent.trim() === text);
  fireEvent.click(row.querySelector("input"));
}

describe("useCockpitDemo + MarketingCockpitPage with replacement fixtures", () => {
  it("catalog shows only the alt projects; opening one drives the alt project view", () => {
    const onOpenProject = vi.fn();
    render(<Harness {...baseProps({ onOpenProject })} />);
    expect(screen.getByText("Alpha Portfolio")).toBeTruthy();
    expect(screen.getByText("Beta Portfolio")).toBeTruthy();
    expect(screen.queryByText("City Strategy")).toBeNull();
    expect(screen.queryByText("Invest City Strategy Analysis")).toBeNull();
    // the card action carries the alt project id, and the page follows it
    fireEvent.click(screen.getByText("Alpha Portfolio").closest("a"));
    expect(onOpenProject).toHaveBeenCalledWith(expect.objectContaining({ id: "alpha" }));
    expect(screen.getByText("Alt Metro Uplift Study")).toBeTruthy();
    expect(screen.getByText("Alt Weekly Digest")).toBeTruthy();
  });

  it("searching an alt knowledge title filters to the owning project; knowledge count resolves", () => {
    render(<Harness {...baseProps()} />);
    fireEvent.change(screen.getByPlaceholderText("Search dashboards"), { target: { value: "alt metro report context" } });
    expect(screen.getByText("Alpha Portfolio")).toBeTruthy();
    expect(screen.queryByText("Beta Portfolio")).toBeNull();
  });

  it("project view shows the resolved knowledge-asset count per report", () => {
    const { container } = render(<Harness {...baseProps({ project: "alpha" })} />);
    // report 0 resolves 2 linked assets; report 1 resolves 1
    expect(within(container).getByText("2 assets")).toBeTruthy();
    expect(within(container).getByText("1 asset")).toBeTruthy();
  });

  it("live embed renders alt city options + KPI names; filter change fires onFiltersChange and re-runs getScenario", () => {
    const onFiltersChange = vi.fn();
    const source = cityInvestScenarioSource(ALT_CITY_INVEST);
    const getScenario = vi.fn((filters) => source(filters));
    const { container } = render(
      <Harness
        {...baseProps({
          project: "alpha",
          view: "live",
          dashboard: 0,
          cityInvest: { ...ALT_CITY_INVEST, getScenario, onFiltersChange },
        })}
      />,
    );
    // alt KPI names + city options rendered
    expect(screen.getByText("Alt Visitors")).toBeTruthy();
    expect(screen.getByText("Alt Orders")).toBeTruthy();
    expect(screen.getByText("Alt Metro Uplift Study (3 Metros)")).toBeTruthy();
    const cityPanel = openFilter(container, "Alt Metro");
    expect(within(cityPanel).getByText("Osaka")).toBeTruthy();
    expect(within(cityPanel).getByText("Porto")).toBeTruthy();
    expect(within(cityPanel).queryByText("Chengdu")).toBeNull();
    const callsBefore = getScenario.mock.calls.length;
    const endPanel = openFilter(container, "Alt End");
    pickOption(endPanel, "Q7");
    expect(onFiltersChange).toHaveBeenCalledWith(expect.objectContaining({ end: "Q7" }));
    expect(getScenario.mock.calls.length).toBeGreaterThan(callsBefore);
    expect(getScenario.mock.lastCall[0]).toMatchObject({ end: "Q7", channel: "All" });
  });

  it("copilot: recommendation shows alt answer text; a question shows the alt generic summary", () => {
    const { container } = render(
      <Harness {...baseProps({ project: "alpha", view: "live", dashboard: 0, workspaceOpen: true })} />,
    );
    const recs = [...container.querySelectorAll(".mh-copilot__rec")];
    expect(recs.length).toBe(2);
    // index 1 → standard alt answer
    fireEvent.click(recs[1]);
    expect(screen.getByText("Alt standard answer title")).toBeTruthy();
    expect(screen.getByText("Alt standard answer summary.")).toBeTruthy();
    expect(screen.getByText("Alt finding one.")).toBeTruthy();
    // back to start, then index 0 → holistic alt report
    fireEvent.click(screen.getByText(/Suggested questions/));
    fireEvent.click([...container.querySelectorAll(".mh-copilot__rec")][0]);
    expect(screen.getByText("Alt Holistic Report — Metro Pilot")).toBeTruthy();
    // custom question → chat entry with the alt generic summary
    const input = screen.getByPlaceholderText("Alt composer placeholder...");
    fireEvent.change(input, { target: { value: "Alt question?" } });
    fireEvent.click(screen.getByText("ASK"));
    expect(screen.getByText("Alt generic summary: the alt copilot would answer with alt sources.")).toBeTruthy();
  });

  it("leaks nothing from the real fixtures", () => {
    render(<Harness {...baseProps({ project: "alpha", view: "live", dashboard: 0, workspaceOpen: true })} />);
    const text = document.body.textContent;
    for (const leaked of [
      "Invest City Strategy",
      "Chengdu",
      "City Strategy",
      "Opportunity scan playbook",
      "I would answer this using the active report",
    ]) {
      expect(text).not.toContain(leaked);
    }
  });

  it("two demo instances keep independent state", () => {
    const propsB = baseProps({
      projects: {
        gamma: {
          ...ALT_PROJECTS.alpha,
          title: "Gamma Portfolio",
          reports: ALT_PROJECTS.alpha.reports,
        },
      },
    });
    render(
      <div>
        <div data-testid="a">
          <Harness {...baseProps()} />
        </div>
        <div data-testid="b">
          <Harness {...propsB} />
        </div>
      </div>,
    );
    const a = within(screen.getByTestId("a"));
    const b = within(screen.getByTestId("b"));
    fireEvent.change(a.getByPlaceholderText("Search dashboards"), { target: { value: "zzz-no-match" } });
    expect(a.queryByText("Alpha Portfolio")).toBeNull();
    expect(b.getByText("Gamma Portfolio")).toBeTruthy();
    fireEvent.change(b.getByPlaceholderText("Search dashboards"), { target: { value: "gamma" } });
    expect(b.getByText("Gamma Portfolio")).toBeTruthy();
    expect(a.queryByText("Alpha Portfolio")).toBeNull();
  });
});
