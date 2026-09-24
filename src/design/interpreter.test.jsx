import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiInterpreterPage } from "./pages/AiInterpreterPage/index.jsx";
import { useBusinessTermDemo } from "./demo/business-term-demo.js";
import { INTERPRETER } from "./content.js";

const baseProps = {
  hero: INTERPRETER.hero,
  overviewItem: INTERPRETER.overview,
  sidebarTitle: INTERPRETER.sidebarTitle,
  types: INTERPRETER.types,
  records: INTERPRETER.records,
  principles: {
    items: INTERPRETER.principles,
    strings: INTERPRETER.principlesLibrary,
  },
};

/* The dedicated Business Term view needs its page-level container (same
   wiring as the pages--interpreter story). */
function Page(props) {
  const businessTerms = useBusinessTermDemo({ ...INTERPRETER.businessTermLibrary });
  return <AiInterpreterPage {...baseProps} businessTerms={businessTerms} {...props} />;
}

function renderPage(props = {}) {
  return render(<Page {...props} />);
}

// Mirrors the story wiring: controlled props driven by state, so clicks in the
// UI exercise the real filtering path.
function Harness({ onSelectType, ...rest }) {
  const [activeType, setActiveType] = React.useState(rest.activeType ?? "overview");
  const [query, setQuery] = React.useState(rest.query ?? "");
  const [filterValues, setFilterValues] = React.useState(rest.filterValues ?? {});
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [expanded, setExpanded] = React.useState([]);
  const businessTerms = useBusinessTermDemo({ ...INTERPRETER.businessTermLibrary });
  return (
    <AiInterpreterPage
      {...baseProps}
      {...rest}
      businessTerms={businessTerms}
      activeType={activeType}
      query={query}
      filterValues={filterValues}
      principles={{
        ...baseProps.principles,
        ...rest.principles,
        selectedCategories,
        expanded,
        onToggleCategory: (event) =>
          setSelectedCategories(
            event.checked
              ? [...selectedCategories, event.id]
              : selectedCategories.filter((id) => id !== event.id),
          ),
        onToggleExpand: (event) =>
          setExpanded(
            event.expanded ? [...expanded, event.id] : expanded.filter((id) => id !== event.id),
          ),
      }}
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
    /* The dedicated view's Add control is a real link to the M5 create page
       (business-term-library.js renders <a target="_blank">). */
    expect(screen.getByRole("link", { name: "Add Business Term" })).toBeTruthy();
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
      // types.js: ?type=Principles swaps the asset table for the card grid.
      if (type.view === "principles") {
        const cards = document.querySelectorAll(".mh-principle");
        expect(cards.length).toBe(INTERPRETER.principles.length);
        expect(document.querySelector(".mh-asset")).toBeNull();
        continue;
      }
      // business-term-library.js swaps in #businessTermOverview's term cards.
      if (type.view === "business-term") {
        const cards = document.querySelectorAll(".mh-btview__card");
        expect(cards.length).toBe(INTERPRETER.businessTermLibrary.records.length);
        expect(document.querySelector(".mh-asset")).toBeNull();
        continue;
      }
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

  it("renders the dedicated Business Term view", () => {
    render(<Harness activeType="Business Term" />);
    expect(document.querySelectorAll(".mh-btview__card").length).toBe(
      INTERPRETER.businessTermLibrary.records.length,
    );
    expect(document.querySelector(".mh-asset")).toBeNull();
    expect(screen.getByLabelText("Search knowledge")).toBeTruthy();
    /* the "AI Interpreter" launcher stays visible on the dedicated page. */
    expect(document.querySelector(".mh-launcher")).toBeTruthy();
  });

  it("query narrows principle cards and produces the dedicated empty state", () => {
    render(<Harness activeType="Principles" />);
    fireEvent.change(screen.getByLabelText("Search knowledge"), { target: { value: "requested scope" } });
    expect(document.querySelectorAll(".mh-principle").length).toBe(1);
    expect(document.querySelector(".mh-principle").textContent).toContain("Match the Requested Scope");

    fireEvent.change(screen.getByLabelText("Search knowledge"), { target: { value: "zzzzz" } });
    expect(document.querySelectorAll(".mh-principle").length).toBe(0);
    expect(screen.getByText("No matching principles. Change the category or search.")).toBeTruthy();
  });

  it("filters principle cards by the category checkbox set", () => {
    render(<Harness activeType="Principles" />);
    fireEvent.click(screen.getByLabelText("System"));
    expect(document.querySelectorAll(".mh-principle").length).toBe(1);
    expect(document.querySelector(".mh-principle").textContent).toContain("Handle Runtime Context Carefully");
    expect(screen.getByText("1 selected")).toBeTruthy();
  });
});
