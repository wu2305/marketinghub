import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ScenarioDetailWorkspace } from "../features/scenario-detail/ScenarioDetailWorkspace/index.jsx";
import { SCENARIO_DETAIL } from "./content/scenario-detail.js";
import { SKILL_RECORDS } from "./content/skill-records.js";
import { resolveScenarioDetail } from "./scenario-detail-demo.js";

const city = SKILL_RECORDS.find((record) => record.id === "city-comparison");
const campaign = SKILL_RECORDS.find((record) => record.id === "scenario-campaign-review");

describe("Scenario Detail demo", () => {
  it("distinguishes the no-id default from unknown-id fallback on replaceable records", () => {
    expect(resolveScenarioDetail(SKILL_RECORDS).id).toBe("city-comparison");
    expect(resolveScenarioDetail(SKILL_RECORDS, "not-found").id).toBe("scenario-channel-performance");
    expect(resolveScenarioDetail([campaign, city]).id).toBe("city-comparison");
    expect(resolveScenarioDetail([campaign, city], "not-found").id).toBe("scenario-campaign-review");
  });

  it("keeps tab and preview actions named while replacement record content and Edit identity update", () => {
    const onTabChange = vi.fn();
    const onTogglePreview = vi.fn();
    const props = { record: city, labels: SCENARIO_DETAIL.labels, tab: "content", previewOpen: false, onTabChange, onTogglePreview, hrefFor: (id, params) => `/mh-host/${id}?id=${params.id}` };
    const view = render(<ScenarioDetailWorkspace {...props} />);
    expect(screen.getByRole("heading", { name: "City Comparison Analysis" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Show Preview" }));
    expect(onTogglePreview).toHaveBeenCalledExactlyOnceWith({ open: true });
    fireEvent.click(screen.getByRole("button", { name: "Related Objects" }));
    expect(onTabChange).toHaveBeenCalledExactlyOnceWith({ value: "related" });
    view.rerender(<ScenarioDetailWorkspace {...props} record={campaign} previewOpen />);
    expect(screen.getByRole("heading", { name: "Campaign Review Reporting" })).toBeTruthy();
    expect(screen.getByText(campaign.previewQuestion)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Edit Scenario" }).getAttribute("href")).toBe("/mh-host/scenario-edit?id=scenario-campaign-review");
  });
});
