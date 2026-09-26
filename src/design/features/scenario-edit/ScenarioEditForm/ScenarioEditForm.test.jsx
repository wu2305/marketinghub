import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { SCENARIO_EDIT } from "../../../demo/content/scenario-edit.js";
import { ScenarioEditForm } from "./index.jsx";

it("emits current question and form values through the controlled actions", () => {
  const onRunPreview = vi.fn();
  const onSubmit = vi.fn();
  const hrefFor = (id, params = {}) => {
    const path = id === "cockpit" ? "/assets/pages/reports.html" : "/assets/pages/scenario-library.html";
    const query = new URLSearchParams(params).toString();
    return query ? `${path}?${query}` : path;
  };
  function Harness() {
    const [values, setValues] = React.useState(SCENARIO_EDIT.defaults);
    return <ScenarioEditForm content={SCENARIO_EDIT} values={values} hrefFor={hrefFor} onChange={({ field, value }) => setValues((current) => ({ ...current, [field]: value }))} onRunPreview={onRunPreview} onSubmit={onSubmit} />;
  }
  render(<Harness />);
  expect(screen.getByRole("link", { name: "Open Invest City Strategy Analysis" }).getAttribute("href")).toBe("/assets/pages/reports.html?project=city&dashboard=0");
  fireEvent.change(screen.getByPlaceholderText("Enter scenario name..."), { target: { value: "Updated scenario" } });
  fireEvent.click(screen.getByRole("button", { name: "Run Preview" }));
  expect(onRunPreview).toHaveBeenCalledExactlyOnceWith({ question: SCENARIO_EDIT.defaults.question });
  fireEvent.click(screen.getByRole("button", { name: "Submit for Review" }));
  expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ values: { ...SCENARIO_EDIT.defaults, name: "Updated scenario" } });
});
