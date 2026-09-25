import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LOGO, NAV } from "../content.js";
import { METRIC_DICTIONARY } from "./content/metric-dictionary.js";
import { useMetricDictionaryDemo } from "./metric-dictionary-demo.js";
import { MetricDictionaryPage } from "../pages/MetricDictionaryPage/index.jsx";

function Harness({ content = METRIC_DICTIONARY, initial }) {
  const state = useMetricDictionaryDemo({ content, initial });
  return <MetricDictionaryPage logo={LOGO} navigation={NAV} content={content} {...state} />;
}

describe("P10 metric dictionary process", () => {
  it("uses the seven loaded Measure fields and retains the detail on category switch", () => {
    render(<Harness />);
    expect(document.querySelectorAll(".mh-metric-page__list button")).toHaveLength(7);
    expect(screen.getByRole("heading", { name: "Exposure Count" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Derived · 2" }));
    expect(document.querySelectorAll(".mh-metric-page__list button")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Exposure Count" })).toBeTruthy();
  });

  it("switches detail tabs and uses the selected derived formula", () => {
    render(<Harness initial={{ category: "Derived", metricId: "effective-traffic" }} />);
    fireEvent.click(screen.getByRole("button", { name: "Formula · 1" }));
    expect(screen.getByText(/SUM\(visit_count\) WHERE engagement_score/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Dimensions · 3" }));
    expect(screen.getByText("dim_channel.channel_name")).toBeTruthy();
  });

  it("requires only a name to save a derived metric with empty formula", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /Add Derived Metric/ }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("status").textContent).toContain("Please enter a metric name.");
    fireEvent.change(screen.getByPlaceholderText("Enter metric name..."), { target: { value: "New metric" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("heading", { name: "New metric" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Derived · 3" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Formula · 1" }));
    expect(screen.getByText("No formula defined")).toBeTruthy();
  });

  it("builds, removes and tests formula tokens", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /Add Derived Metric/ }));
    fireEvent.click(screen.getByRole("button", { name: "Test" }));
    expect(screen.getByRole("status").textContent).toContain("Please build a formula first.");
    fireEvent.click(document.querySelector(".mh-derived-panel__reference"));
    expect(screen.getByRole("button", { name: "Remove Exposure Count" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Test" }));
    expect(screen.getByRole("status").textContent).toContain("42.86");
    fireEvent.click(screen.getByRole("button", { name: "Remove Exposure Count" }));
    expect(screen.getByText("Click a metric or operator to build your formula...")).toBeTruthy();
  });
});
