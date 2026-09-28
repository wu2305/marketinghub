import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DATA_MODEL_PAGE } from "./content/data-model-page.js";
import { dataModelPageHrefFor, normalizedDataModelSearch, useDataModelPageDemo } from "./data-model-page-demo.js";
import { DataModelPage } from "../pages/DataModelPage/index.jsx";

function Fixture(props) {
  const page = useDataModelPageDemo(props);
  return <DataModelPage {...page} />;
}

describe("P11 standalone Data Model page", () => {
  it("normalizes only the type query and resolves source anchors", () => {
    expect(normalizedDataModelSearch("")).toBe("?type=Data+Model");
    expect(normalizedDataModelSearch("?foo=kept&type=Other")).toBe("?foo=kept&type=Data+Model");
    expect(normalizedDataModelSearch("?foo=kept&type=Data+Model")).toBeNull();
    expect(dataModelPageHrefFor("interpreter", { type: "Data Model" })).toBe("/assets/pages/knowledge.html?type=Data+Model");
  });

  it("composes the existing browser with three visible domains and live controls", () => {
    const onSelect = vi.fn();
    const onChange = vi.fn();
    render(<Fixture onSelect={onSelect} onChange={onChange} />);
    expect(within(screen.getByRole("list", { name: "Data models" })).getAllByRole("listitem")).toHaveLength(3);
    expect(screen.queryByText("Customer Growth")).toBeNull();
    expect(screen.getByText("D2C Insight", { selector: ".mh-dmview__basic-name strong" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "DC Media Performance" }));
    expect(onSelect).toHaveBeenCalledWith({ kind: "domain", id: "finance-analysis" });
    fireEvent.change(screen.getByRole("searchbox", { name: "Search data model" }), { target: { value: "NO_SUCH_MODEL_123" } });
    expect(onChange).toHaveBeenCalledWith({ name: "query", value: "NO_SUCH_MODEL_123" });
    expect(screen.getByText("No matching data models.")).toBeTruthy();
    expect(screen.getByText("DC Media Performance", { selector: ".mh-dmview__basic-name strong" })).toBeTruthy();
  });

  it("reports the standalone related-report event without inventing a drawer", () => {
    const onOpen = vi.fn();
    render(<Fixture onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: "Open 4P Report Report Context" }));
    expect(onOpen).toHaveBeenCalledWith({ kind: "report-context", id: "fourp-report-context" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("supports graph, fact details, preview, and close through one page instance", () => {
    const onOpen = vi.fn();
    const onSelect = vi.fn();
    const onCancel = vi.fn();
    render(<Fixture onOpen={onOpen} onSelect={onSelect} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("tab", { name: /Relationship graph/ }));
    expect(onSelect).toHaveBeenCalledWith({ kind: "tab", id: "graph" });
    fireEvent.click(document.querySelector(".mh-dmview__node.is-fact"));
    expect(onOpen).toHaveBeenCalledWith({ kind: "table", id: "fact_sales_order" });
    expect(within(screen.getByRole("dialog")).getByText("Sales Order Detail")).toBeTruthy();
    expect(within(screen.getByRole("dialog")).getByText("Unit")).toBeTruthy();
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Data Preview" }));
    expect(onSelect).toHaveBeenCalledWith({ kind: "drawer-tab", id: "preview" });
    expect(screen.getByRole("dialog").querySelectorAll("tbody tr")).toHaveLength(10);
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Close table detail" }));
    expect(onCancel).toHaveBeenCalledWith({ kind: "table" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders replacement records, copy, navigation and two isolated instances", () => {
    const hostDomain = { ...DATA_MODEL_PAGE.domains[0], id: "host-domain", name: "Host Model", description: "A host model description", synonyms: ["Host Alias"] };
    const hostContent = {
      logo: { ...DATA_MODEL_PAGE.logo, alt: "Host Logo" },
      navigation: [{ id: "home", label: "Host Landing" }, { id: "interpreter", label: "Host Knowledge" }],
      domains: [hostDomain],
      strings: { ...DATA_MODEL_PAGE.strings, basicTab: "Host facts", graphTab: "Host links", searchLabel: "Find host model", emptyDomains: "No host models" },
    };
    const { container } = render(<><Fixture content={hostContent} /><Fixture content={hostContent} /></>);
    expect(screen.getAllByText("Host Model", { selector: ".mh-dmview__basic-name strong" })).toHaveLength(2);
    expect(screen.queryByText("D2C Insight")).toBeNull();
    expect(screen.getAllByRole("link", { name: "Host Landing" })).toHaveLength(2);
    const pages = container.querySelectorAll(".mh-data-model-page");
    fireEvent.click(within(pages[0]).getByRole("tab", { name: /Host links/ }));
    expect(within(pages[0]).getByRole("tab", { name: /Host links/ }).getAttribute("aria-selected")).toBe("true");
    expect(within(pages[1]).getByRole("tab", { name: /Host facts/ }).getAttribute("aria-selected")).toBe("true");
    fireEvent.change(within(pages[1]).getByRole("searchbox", { name: "Find host model" }), { target: { value: "absent" } });
    expect(within(pages[1]).getByText("No host models")).toBeTruthy();
    expect(within(pages[0]).queryByText("No host models")).toBeNull();
  });
});
