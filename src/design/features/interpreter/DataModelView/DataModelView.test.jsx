import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DATA_MODEL_DOMAINS } from "../../../demo/data-model-domains.js";
import { DataModelView } from "./index.jsx";

describe("DataModelView without a strings bundle", () => {
  it("renders with default copy when no props are given", () => {
    render(<DataModelView />);
    expect(screen.getByRole("tab", { name: /Basic information/ })).toBeTruthy();
    expect(screen.getByText("No matching data models.")).toBeTruthy();
  });

  it("labels related-report buttons from the default copy", () => {
    const domain = DATA_MODEL_DOMAINS.find((item) => !item.hidden && item.reports?.length);
    render(<DataModelView domains={[domain]} domain={domain} />);
    expect(screen.getByRole("button", { name: `Open ${domain.reports[0]} Report Context` })).toBeTruthy();
  });

  it("lets a caller override single keys", () => {
    render(<DataModelView strings={{ basicTab: "Host facts" }} />);
    expect(screen.getByRole("tab", { name: /Host facts/ })).toBeTruthy();
    expect(screen.getByRole("tab", { name: /Relationship graph/ })).toBeTruthy();
  });
});
