import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiInterpreterPage } from "./pages.jsx";
import { INTERPRETER } from "./content.js";

const baseProps = {
  hero: INTERPRETER.hero,
  overviewItem: INTERPRETER.overview,
  sidebarTitle: INTERPRETER.sidebarTitle,
  types: INTERPRETER.types,
  records: INTERPRETER.records,
};

function renderPage(props = {}) {
  return render(<AiInterpreterPage {...baseProps} {...props} />);
}

// Mirrors the story wiring: controlled props driven by state, so clicks in the
// UI exercise the real filtering path.
function Harness({ onSelectType, ...rest }) {
  const [activeType, setActiveType] = React.useState(rest.activeType ?? "overview");
  const [query, setQuery] = React.useState(rest.query ?? "");
  const [filterValues, setFilterValues] = React.useState(rest.filterValues ?? {});
  return (
    <AiInterpreterPage
      {...baseProps}
      {...rest}
      activeType={activeType}
      query={query}
      filterValues={filterValues}
      onSelectType={(event) => {
        setActiveType(event.id);
        setFilterValues({});
        onSelectType?.(event);
      }}
      onQueryChange={(event) => setQuery(event.value)}
      onFilterChange={(event) => setFilterValues((values) => ({ ...values, [event.id]: event.value }))}
    />
  );
}

const rowTitles = () => screen.getAllByRole("button", { name: /.+/ }).filter((el) => el.classList.contains("mh-asset")).map((el) => el.textContent);

describe("AI Interpreter type contract", () => {
  it("filters records by stable typeId even when the visible title changes", () => {
    const renamed = INTERPRETER.types.map((type) =>
      type.id === "Scenario Reporting" ? { ...type, title: "Renamed Scenarios" } : type,
    );
    renderPage({ types: renamed, activeType: "Scenario Reporting" });
    const titles = rowTitles();
    expect(titles.some((text) => text.includes("Channel Performance Analysis"))).toBe(true);
    expect(titles.every((text) => !text.includes("GMV (Gross Merchandise Value)"))).toBe(true);
    expect(screen.getAllByText("Renamed Scenarios").length).toBeGreaterThan(0);
  });

  it("shows an explicit empty state for an unknown type instead of all records", () => {
    renderPage({ activeType: "not-a-real-type" });
    expect(screen.getByText("Unknown knowledge type")).toBeTruthy();
    expect(document.querySelectorAll(".mh-asset").length).toBe(0);
    expect(screen.queryByText("Trusted analysis guardrails")).toBeNull();
  });

  it("hides create controls on read-only types and shows them on manageable types", () => {
    const { unmount } = renderPage({ activeType: "Principles" });
    expect(screen.queryByRole("button", { name: /Add|Create/i })).toBeNull();

    unmount();
    renderPage({ activeType: "Business Term" });
    expect(screen.getByRole("button", { name: "Add Business Term" })).toBeTruthy();
  });

  it("does not expose a create action on read-only types even when onCreate is provided", () => {
    const onCreate = vi.fn();
    renderPage({ activeType: "Email Reports", onCreate });
    expect(screen.queryByRole("button", { name: /Add|Create/i })).toBeNull();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("switches across all eight knowledge types", () => {
    render(<Harness onSelectType={() => {}} />);
    for (const type of INTERPRETER.types) {
      fireEvent.click(screen.getAllByRole("button", { name: new RegExp(type.title) })[0]);
      const expected = INTERPRETER.records.filter((record) => record.typeId === type.id);
      const titles = rowTitles();
      expect(titles.length).toBe(expected.length);
      for (const record of expected) {
        expect(titles.some((text) => text.includes(record.title))).toBe(true);
      }
    }
  });

  it("fires onSelectType with the stable type id", () => {
    const onSelectType = vi.fn();
    renderPage({ onSelectType });
    fireEvent.click(screen.getAllByRole("button", { name: /Metric Dictionary/ })[0]);
    expect(onSelectType).toHaveBeenCalledWith({ id: "Metric Dictionary", label: "Metric Dictionary" });
  });

  it("filters scenario records by process stage and AI availability independently", () => {
    render(<Harness activeType="Scenario Reporting" />);
    const process = screen.getByLabelText("Process");
    fireEvent.change(process, { target: { value: "queued" } });
    let titles = rowTitles();
    expect(titles.length).toBe(1);
    expect(titles[0]).toContain("Channel Exception Watch");

    fireEvent.change(process, { target: { value: "" } });
    const status = screen.getByLabelText("Status");
    fireEvent.change(status, { target: { value: "disabled" } });
    titles = rowTitles();
    expect(titles.length).toBe(2);
    expect(titles.some((text) => text.includes("Channel Performance Analysis"))).toBe(true);
    expect(titles.some((text) => text.includes("Channel Exception Watch"))).toBe(true);
  });

  it("business term Draft option matches stage, not availability", () => {
    const draftTerm = {
      id: "test-draft-term",
      typeId: "Business Term",
      title: "Draft Term Fixture",
      summary: "Injected fixture exercising the Draft stage filter.",
      owner: "Current User",
      stage: "draft",
      availability: "enabled",
      kind: "Business Term",
    };
    render(<Harness activeType="Business Term" records={[...INTERPRETER.records, draftTerm]} />);
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "draft" } });
    const titles = rowTitles();
    expect(titles.length).toBe(1);
    expect(titles[0]).toContain("Draft Term Fixture");
  });

  it("query narrows rows and produces a distinguishable empty state", () => {
    render(<Harness activeType="Principles" />);
    fireEvent.change(screen.getByLabelText("Search knowledge"), { target: { value: "Trusted analysis" } });
    expect(rowTitles().length).toBe(1);

    fireEvent.change(screen.getByLabelText("Search knowledge"), { target: { value: "zzzzz" } });
    expect(rowTitles().length).toBe(0);
    expect(screen.getByText("No records match the current filters.")).toBeTruthy();
  });
});
