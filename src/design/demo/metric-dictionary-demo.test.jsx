import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LOGO, NAV, MODEL_FLOW, buildModelDraft, buildLiteAssistantAnswer } from "../content.js";
import { METRIC_ASSISTANT, METRIC_DICTIONARY } from "./content/metric-dictionary.js";
import { useMetricDictionaryDemo } from "./metric-dictionary-demo.js";
import { MetricDictionaryPage } from "../pages/MetricDictionaryPage/index.jsx";

function Harness({ content = METRIC_DICTIONARY, initial }) {
  const state = useMetricDictionaryDemo({ content, initial, modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, assistantAnswerFor: buildLiteAssistantAnswer });
  return <MetricDictionaryPage logo={LOGO} navigation={NAV} content={content} assistant={{ copy: METRIC_ASSISTANT, ...state.assistantState }} {...state} />;
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

  it("shows an arbitrary unit saved on a derived metric in its detail selector", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /Add Derived Metric/ }));
    fireEvent.change(screen.getByPlaceholderText("Enter metric name..."), { target: { value: "Custom Unit Metric" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. yuan, %, unit"), { target: { value: "yuan" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("heading", { name: "Custom Unit Metric" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Unit" }).value).toBe("yuan");
    expect(screen.getByRole("option", { name: "yuan" })).toBeTruthy();
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

  it("fills assistant history, replaces answers and opens the model flow", () => {
    Element.prototype.scrollTo ||= () => {};
    render(<Harness initial={{ assistantOpen: true }} />);
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    fireEvent.click(screen.getByRole("button", { name: /Media tracking summary/ }));
    expect(screen.getByRole("textbox", { name: "Ask AI Interpreter AI" }).value).toBe("Summarize the latest media tracking performance.");
    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    expect(screen.getByText(/I will use the AI Interpreter knowledge context to answer/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Choose AI skill" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Analytical Model" }));
    fireEvent.click(screen.getByRole("button", { name: /Add from Chat History/ }));
    expect(screen.getByText("Generate Analytical Model")).toBeTruthy();
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

  it("expires action notices after three seconds without an older timer clearing a newer one", () => {
    vi.useFakeTimers();
    try {
      const { unmount } = render(<Harness />);
      fireEvent.click(screen.getByRole("button", { name: /Add Derived Metric/ }));
      fireEvent.click(document.querySelector(".mh-derived-panel__reference"));
      expect(screen.getByRole("status").textContent).toContain("Added");
      act(() => vi.advanceTimersByTime(2000));
      fireEvent.click(screen.getByRole("button", { name: "Test" }));
      expect(screen.getByRole("status").textContent).toContain("42.86");
      act(() => vi.advanceTimersByTime(1000));
      expect(screen.getByRole("status").textContent).toContain("42.86");
      act(() => vi.advanceTimersByTime(2000));
      expect(screen.queryByRole("status")).toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Remove Exposure Count" }));
      fireEvent.click(screen.getByRole("button", { name: "Test" }));
      expect(screen.getByRole("status").textContent).toContain("Please build a formula first.");
      act(() => vi.advanceTimersByTime(3000));
      expect(screen.getByRole("status").textContent).toContain("Please build a formula first.");
      fireEvent.click(document.querySelector(".mh-derived-panel__reference"));
      expect(vi.getTimerCount()).toBe(1);
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("adds a numeric constant and clears the formula", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /Add Derived Metric/ }));
    fireEvent.click(screen.getByRole("button", { name: "Add Constant" }));
    fireEvent.change(screen.getByRole("textbox", { name: /Enter a constant value/ }), { target: { value: "100.5" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("button", { name: "Remove 100.5" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "clear" }));
    expect(screen.getByText("Click a metric or operator to build your formula...")).toBeTruthy();
  });

  it("retains native definition edits and checkboxes while switching tabs", () => {
    const { container } = render(<Harness />);
    const name = screen.getByRole("textbox", { name: "Metric Name" });
    fireEvent.change(name, { target: { value: "Edited in place" } });
    const qa = screen.getByRole("checkbox", { name: "Participate in Q&A" });
    fireEvent.click(qa);
    fireEvent.click(screen.getByRole("button", { name: "Dimensions · 3" }));
    const dimension = container.querySelector(".mh-metric-page__dimension-grid input");
    fireEvent.click(dimension);
    fireEvent.click(screen.getByRole("button", { name: "Definition" }));
    expect(name.value).toBe("Edited in place");
    expect(qa.checked).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Dimensions · 3" }));
    expect(dimension.checked).toBe(false);
  });

  it("replaces source records and selection together when the host swaps fixtures", () => {
    const alternate = {
      ...METRIC_DICTIONARY,
      metrics: [{ ...METRIC_DICTIONARY.metrics[0], id: "alternate.count", name: "Alternate Count" }],
    };
    const { rerender } = render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /Add Derived Metric/ }));
    fireEvent.change(screen.getByPlaceholderText("Enter metric name..."), { target: { value: "Local Derived" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("heading", { name: "Local Derived" })).toBeTruthy();
    rerender(<Harness content={alternate} />);
    expect(screen.getByRole("heading", { name: "Alternate Count" })).toBeTruthy();
    expect(document.querySelectorAll(".mh-metric-page__list button")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Derived · 0" }));
    expect(screen.queryByText("Local Derived")).toBeNull();
  });

  it("refreshes native detail defaults when replacement data reuses the same record id", () => {
    const { rerender } = render(<Harness />);
    const name = screen.getByRole("textbox", { name: "Metric Name" });
    fireEvent.change(name, { target: { value: "Local edit" } });
    const replacement = {
      ...METRIC_DICTIONARY,
      metrics: METRIC_DICTIONARY.metrics.map((metric, index) => index === 0
        ? { ...metric, name: "Replacement Count", desc: "Replacement definition", unit: "Currency" }
        : metric),
    };
    rerender(<Harness content={replacement} />);
    expect(screen.getByRole("heading", { name: "Replacement Count" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Metric Name" }).value).toBe("Replacement Count");
    expect(screen.getByRole("textbox", { name: "Business Definition" }).value).toBe("Replacement definition");
    expect(screen.getByRole("combobox", { name: "Unit" }).value).toBe("Currency");
  });

  it("isolates local derived records across two page instances", () => {
    const { container } = render(<><Harness /><Harness /></>);
    const pages = container.querySelectorAll(".mh-metric-page");
    fireEvent.click(pages[0].querySelector(".mh-metric-page__action--primary"));
    fireEvent.change(screen.getByPlaceholderText("Enter metric name..."), { target: { value: "Only First" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(pages[0].querySelector("h1").textContent).toBe("Only First");
    expect(pages[1].querySelector("h1").textContent).toBe("Exposure Count");
    expect(pages[0].querySelectorAll(".mh-metric-page__list button")).toHaveLength(3);
    expect(pages[1].querySelectorAll(".mh-metric-page__list button")).toHaveLength(7);
  });

  it.each([["Save", "Saved"], ["Submit", "Published"]])("validates model %s and keeps %s visible before closing", async (action, result) => {
    render(<Harness initial={{ assistantOpen: true, flow: { step: "manual", threads: MODEL_FLOW.threads, rule: "", draft: {} } }} />);
    fireEvent.click(screen.getByRole("button", { name: action }));
    expect(screen.getByText("Name is required.")).toBeTruthy();
    fireEvent.change(document.querySelector('.mh-flow input[name="name"]'), { target: { value: "My model" } });
    fireEvent.change(document.querySelector('.mh-flow textarea[name="trigger"]'), { target: { value: "When campaign data is present" } });
    fireEvent.change(document.querySelector('.mh-flow textarea[name="structure"]'), { target: { value: "Compare metrics by channel" } });
    fireEvent.click(screen.getByRole("button", { name: action }));
    expect(screen.getByRole("button", { name: result })).toBeTruthy();
    expect(document.querySelector(".mh-flow")).toBeTruthy();
    await waitFor(() => expect(document.querySelector(".mh-flow")).toBeNull(), { timeout: 1200 });
  });

});
