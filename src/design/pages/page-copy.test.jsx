import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CAMPAIGN, COCKPIT, DATA_UPLOAD, MEDIA_TRACKING, SELF_SERVICE } from "../content.js";
import { CampaignPage } from "./CampaignPage/index.jsx";
import { DataUploadPage } from "./DataUploadPage/index.jsx";
import { MarketingCockpitPage } from "./MarketingCockpitPage/index.jsx";
import { MediaTrackingDetailPage } from "./MediaTrackingDetailPage/index.jsx";
import { SelfServicePage } from "./SelfServicePage/index.jsx";

const hrefFor = (id) => `#${id}`;

describe("page copy comes from page props", () => {
  it("uses replacement Cockpit search and report metadata labels", () => {
    render(<MarketingCockpitPage copy={{ ...COCKPIT.copy, searchLabel: "Find a dashboard", meta: { ...COCKPIT.copy.meta, owner: "Steward" } }} groups={COCKPIT.groups} projects={COCKPIT.projects} project="city" hrefFor={hrefFor} />);
    expect(screen.getByPlaceholderText("Find a dashboard")).toBeTruthy();
    expect(screen.getAllByText("Steward").length).toBeGreaterThan(0);
    expect(screen.queryByText("Owner")).toBeNull();
  });

  it("uses replacement Self-Service tab and filter names", () => {
    render(<SelfServicePage labels={{ ...SELF_SERVICE.labels, tabAria: "Analysis mode", analysisFilterAria: "Report categories" }} tabs={SELF_SERVICE.tabs} filters={SELF_SERVICE.filters} hrefFor={hrefFor} />);
    expect(screen.getByRole("tablist", { name: "Analysis mode" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Report categories" })).toBeTruthy();
    expect(screen.queryByRole("group", { name: "Filter reports" })).toBeNull();
  });

  it("uses replacement Data Upload field and action copy", () => {
    render(<DataUploadPage toolbar={{ ...DATA_UPLOAD.toolbar, importLabel: "Import workbook" }} fields={[{ name: "year", label: "Fiscal year", placeholder: "Type a year" }]} submitLabel="Send record" bulkImport={DATA_UPLOAD.bulkImport} />);
    expect(screen.getByPlaceholderText("Type a year")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Import workbook" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Send record" })).toBeTruthy();
    expect(screen.queryByText("Template Import")).toBeNull();
  });

  it("uses replacement Media Tracking region names", () => {
    render(<MediaTrackingDetailPage labels={{ ...MEDIA_TRACKING.labels, periodAria: "Reporting cadence", filtersAria: "Data selectors", tableAria: "Results grid" }} periods={MEDIA_TRACKING.periods} />);
    expect(screen.getByRole("tablist", { name: "Reporting cadence" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Data selectors" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Results grid" })).toBeTruthy();
  });

  it("uses replacement Campaign controls, account caption and task labels", () => {
    render(<CampaignPage labels={{ ...CAMPAIGN.labels, accountSearch: "Find media account", filterLabel: "Apply", resetLabel: "Clear", accountCaption: (count) => `${count} matched` }} headings={CAMPAIGN.headings} panels={CAMPAIGN.panels} accountRows={CAMPAIGN.accountRows} taskDialog={{ ...CAMPAIGN.taskDialog, cancelLabel: "Dismiss" }} taskDialogOpen />);
    expect(screen.getByPlaceholderText("Find media account")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Clear" })).toBeTruthy();
    expect(screen.getByText("3 matched")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeTruthy();
    expect(screen.queryByText("Search sub-account")).toBeNull();
  });
});
