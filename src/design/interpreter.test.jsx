import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AiInterpreterPage } from "./pages/AiInterpreterPage/index.jsx";
import { useInterpreterDemo } from "./demo/interpreter-demo.js";
import { INTERPRETER } from "./content.js";

const baseProps = {
  hero: INTERPRETER.hero,
  overviewItem: INTERPRETER.overview,
  sidebarTitle: INTERPRETER.sidebarTitle,
  types: INTERPRETER.types,
};

const demoInputs = {
  types: INTERPRETER.types,
  records: INTERPRETER.records,
  principles: {
    items: INTERPRETER.principles,
    strings: INTERPRETER.principlesLibrary,
  },
  businessTermLibrary: INTERPRETER.businessTermLibrary,
  scenarioReports: INTERPRETER.scenarioReports,
};

/* The dedicated views need the page-level container (same wiring as the
   pages--interpreter story): useInterpreterDemo holds the filter/search/page
   state and produces `views` + `library`. */
function Page(props) {
  const { activeType: initialType = "overview", ...rest } = props;
  const demo = useInterpreterDemo({ ...demoInputs, ...rest, activeType: initialType });
  return <AiInterpreterPage {...baseProps} {...demo} {...rest} activeType={initialType} />;
}

function renderPage(props = {}) {
  return render(<Page {...props} />);
}

// Mirrors the story wiring: controlled props driven by state, so clicks in the
// UI exercise the real filtering path.
function Harness({ onSelectType, ...rest }) {
  const [activeType, setActiveType] = React.useState(rest.activeType ?? "overview");
  const demo = useInterpreterDemo({
    ...demoInputs,
    activeType,
    query: rest.query,
    filterValues: rest.filterValues,
    principles: { ...demoInputs.principles, ...rest.principles },
  });
  return (
    <AiInterpreterPage
      {...baseProps}
      {...rest}
      {...demo}
      activeType={activeType}
      onSelectType={(event) => {
        setActiveType(event.id);
        onSelectType?.(event);
      }}
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
    /* scenario-reports.js swaps in its own card grid — assert on the cards. */
    const titles = [...document.querySelectorAll(".mh-srview__card h3")].map((el) => el.textContent);
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
      // field-library.js swaps in #fmLibrary's per-type card grid.
      if (type.view === "field-library") {
        const expected = INTERPRETER.records.filter((record) => record.typeId === type.id);
        const cards = document.querySelectorAll(".mh-flview__card");
        expect(cards.length).toBe(expected.length);
        expect(document.querySelector(".mh-asset")).toBeNull();
        continue;
      }
      // scenario-reports.js swaps in #scenarioReportOverview's two-column cards.
      if (type.view === "scenario-reports") {
        const cards = document.querySelectorAll(".mh-srview__card");
        expect(cards.length).toBe(INTERPRETER.scenarioReports.records.length);
        expect(document.querySelector(".mh-asset")).toBeNull();
        continue;
      }
      // data-model-browser.js swaps in #dataModelOverview's domain browser —
      // the hidden "Customer Growth" domain never renders.
      if (type.view === "data-model") {
        const cards = document.querySelectorAll(".mh-dmview__domain");
        expect(cards.length).toBe(3);
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

  it("peeks the Report Context drawer from the Data Model related reports", () => {
    /* data-model-browser.js related-report buttons dispatch reportcontext:view
       → field-library.js opens the fm drawer over the current type page. */
    render(<Harness activeType="Data Model" />);
    fireEvent.click(screen.getByRole("button", { name: "Open 4P Report Report Context" }));
    const drawer = document.querySelector(".mh-modal--drawer");
    expect(drawer).toBeTruthy();
    expect(drawer.querySelector(".mh-modal__eyebrow").textContent).toBe("Report Context");
    /* stays on the Data Model page — the type view is still the domain shell */
    expect(document.querySelector(".mh-dmview__shell")).toBeTruthy();
  });

  it("fires onSelectType with the stable type id", () => {
    const onSelectType = vi.fn();
    renderPage({ onSelectType });
    fireEvent.click(screen.getAllByRole("button", { name: /Metric Dictionary/ })[0]);
    expect(onSelectType).toHaveBeenCalledWith({ id: "Metric Dictionary", label: "Metric Dictionary" });
  });

  it("filters scenario records by process stage and AI availability independently", () => {
    render(<Harness activeType="Scenario Reporting" />);
    const cardTitles = () => [...document.querySelectorAll(".mh-srview__card h3")].map((el) => el.textContent);
    const process = screen.getByLabelText("Process");
    fireEvent.change(process, { target: { value: "Queued" } });
    let titles = cardTitles();
    expect(titles.length).toBe(1);
    expect(titles[0]).toContain("Channel Exception Watch");

    fireEvent.change(process, { target: { value: "" } });
    const status = screen.getByLabelText("Status");
    fireEvent.change(status, { target: { value: "Disabled" } });
    titles = cardTitles();
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

  it("scopes the '/' shortcut to one instance when two pages are mounted", () => {
    render(
      <>
        <Harness activeType="Principles" />
        <Harness activeType="Principles" />
      </>,
    );
    const searches = screen.getAllByLabelText("Search knowledge");
    expect(searches.length).toBe(2);
    /* Focus on body: only the most recently mounted instance answers. */
    fireEvent.keyDown(document, { key: "/" });
    expect(document.activeElement).toBe(searches[1]);

    /* Focus inside the first instance routes the keypress back to it. */
    const firstSidebarItem = document.querySelectorAll(".mh-interpreter")[0].querySelector("button");
    firstSidebarItem.focus();
    fireEvent.keyDown(document, { key: "/" });
    expect(document.activeElement).toBe(searches[0]);
  });
});
