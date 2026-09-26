import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDataModelDemo, dataModelFieldFormat } from "./data-model-demo.js";
import { DataModelView } from "../features/interpreter/DataModelView/index.jsx";

function Harness(props) {
  const viewProps = useDataModelDemo(props);
  return <DataModelView {...viewProps} />;
}

const domainCards = () => [...document.querySelectorAll(".mh-dmview__domain")];

describe("useDataModelDemo + DataModelView", () => {
  it("lists the visible domains and hides the hidden one", () => {
    render(<Harness />);
    const names = domainCards().map((el) => el.querySelector("strong").textContent);
    expect(names).toEqual(["D2C Insight", "DC Media Performance", "DG Media Tracking"]);
    expect(screen.queryByText("Customer Growth")).toBeNull();
    expect(document.querySelector(".mh-dmview__basic-name .mh-badge--knowledge")?.textContent).toBeTruthy();
  });

  it("searches names, descriptions and synonyms", () => {
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Search data model"), { target: { value: "audience" } });
    expect(domainCards().length).toBe(1);
    expect(domainCards()[0].textContent).toContain("DC Media Performance");
    /* "growth" only matches the hidden Customer Growth domain — it never
       surfaces. */
    fireEvent.change(screen.getByLabelText("Search data model"), { target: { value: "growth" } });
    expect(domainCards().length).toBe(0);
    expect(screen.getByText("No matching data models.")).toBeTruthy();
  });

  it("moves to the first filtered domain and keeps it after clearing search", () => {
    render(<Harness selectedDomainId="business-data" />);
    const input = screen.getByLabelText("Search data model");
    fireEvent.change(input, { target: { value: "ABO" } });
    expect(domainCards()).toHaveLength(1);
    expect(domainCards()[0].getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector(".mh-dmview__basic-name strong")?.textContent).toBe("DC Media Performance");
    fireEvent.change(input, { target: { value: "NO_SUCH_MODEL_123" } });
    expect(domainCards()).toHaveLength(0);
    expect(document.querySelector(".mh-dmview__basic-name strong")?.textContent).toBe("DC Media Performance");
    fireEvent.change(input, { target: { value: "" } });
    expect(document.querySelector(".mh-dmview__basic-name strong")?.textContent).toBe("DC Media Performance");
  });

  it("keeps an initially filtered domain selected when search is cleared", () => {
    for (const selectedDomainId of [undefined, "business-data"]) {
      const { unmount } = render(<Harness query="ABO" selectedDomainId={selectedDomainId} />);
      expect(document.querySelector(".mh-dmview__basic-name strong")?.textContent).toBe("DC Media Performance");
      fireEvent.change(screen.getByLabelText("Search data model"), { target: { value: "NO_SUCH_MODEL_123" } });
      expect(domainCards()).toHaveLength(0);
      expect(document.querySelector(".mh-dmview__basic-name strong")?.textContent).toBe("DC Media Performance");
      fireEvent.change(screen.getByLabelText("Search data model"), { target: { value: "" } });
      expect(document.querySelector(".mh-dmview__basic-name strong")?.textContent).toBe("DC Media Performance");
      expect(domainCards()[1].getAttribute("aria-selected")).toBe("true");
      unmount();
    }
  });

  it("formats source measure types exactly in graph nodes", () => {
    expect(dataModelFieldFormat({ field: "sales_amount", fieldType: "Measure", unit: "CNY" })).toBe("decimal(12,2)");
    expect(dataModelFieldFormat({ field: "quantity", fieldType: "Measure", unit: "Count" })).toBe("bigint");
    expect(dataModelFieldFormat({ field: "conversion_rate", fieldType: "Measure", unit: "%" })).toBe("decimal(8,2)");
  });

  it("switches domains and resets to the basic tab", () => {
    const onSelectDomain = vi.fn();
    render(<Harness onSelectDomain={onSelectDomain} />);
    fireEvent.click(screen.getByRole("tab", { name: /Relationship graph/ }));
    fireEvent.click(domainCards()[1]);
    expect(onSelectDomain).toHaveBeenCalled();
    expect(domainCards()[1].getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "Basic information" }).getAttribute("aria-selected")).toBe("true");
  });

  it("renders the basic card with synonyms and related reports", () => {
    render(<Harness />);
    expect(screen.getByText("Synonyms")).toBeTruthy();
    expect(screen.getByText("Related reports")).toBeTruthy();
    const report = screen.getByRole("button", { name: "Open 4P Report Report Context" });
    expect(report).toBeTruthy();
  });

  it("dispatches the report-context peek for a related report", () => {
    const onOpenReportContext = vi.fn();
    render(<Harness onOpenReportContext={onOpenReportContext} />);
    fireEvent.click(screen.getByRole("button", { name: "Open 4P Report Report Context" }));
    expect(onOpenReportContext).toHaveBeenCalledWith("fourp-report-context");
  });

  it("renders the graph nodes and links on the graph tab", () => {
    render(<Harness activeTab="graph" />);
    expect(document.querySelectorAll(".mh-dmview__node").length).toBe(6);
    expect(document.querySelectorAll(".mh-dmview__link").length).toBe(5);
    expect(document.querySelectorAll(".mh-dmview__node.is-fact").length).toBe(1);
  });

  it("opens the table dialog from a graph node and switches to preview", () => {
    render(<Harness activeTab="graph" />);
    fireEvent.click(document.querySelector(".mh-dmview__node.is-fact"));
    expect(document.querySelector(".mh-dmview__dialog")).toBeTruthy();
    expect(document.querySelector(".mh-dmview__table-type.is-fact").textContent).toBe("Fact");
    fireEvent.click(screen.getByRole("button", { name: "Data Preview" }));
    const rows = document.querySelectorAll(".mh-dmview__dialog .mh-dmview__table tbody tr");
    expect(rows.length).toBe(10);
  });

  it("closes the dialog via the close button and Escape", () => {
    render(<Harness activeTab="graph" />);
    fireEvent.click(document.querySelector(".mh-dmview__node.is-fact"));
    fireEvent.click(screen.getByRole("button", { name: "Close table detail" }));
    expect(document.querySelector(".mh-dmview__dialog")).toBeNull();
    fireEvent.click(document.querySelector(".mh-dmview__node.is-fact"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".mh-dmview__dialog")).toBeNull();
  });
});
