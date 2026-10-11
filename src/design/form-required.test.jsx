import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { KNOWLEDGE_CREATE } from "./demo/content/knowledge-create.js";
import { METRIC_DICTIONARY } from "./demo/content/metric-dictionary.js";
import { SCENARIO_EDIT } from "./demo/content/scenario-edit.js";
import { requiredKnowledgeCreateFields } from "./demo/knowledge-create-demo.js";
import { SkillForm } from "./components/SkillForm/index.jsx";
import { BusinessTermForm } from "./features/interpreter/BusinessTermForm/index.jsx";
import { DerivedMetricPanel } from "./features/metric-dictionary/DerivedMetricPanel/index.jsx";
import { KnowledgeCreateFields } from "./features/knowledge-create/KnowledgeCreateFields/index.jsx";
import { MemoryWorkspace } from "./features/personal-memory/MemoryWorkspace/index.jsx";
import { ScenarioEditForm } from "./features/scenario-edit/ScenarioEditForm/index.jsx";

afterEach(cleanup);

/**
 * Which fields a form requires is the host's call: every form takes a `required` list and marks, announces and
 * natively requires exactly those fields, so a rule change is a host setting and never a component edit.
 */
const requiredNames = (root) => [...root.querySelectorAll("[required], [aria-required='true']")].map((el) => el.getAttribute("aria-label") || el.name || el.id);
const stars = (root) => root.querySelectorAll("[aria-hidden='true']").length;

describe("required is a host setting", () => {
  const { labels, scopes, defaults } = SCENARIO_EDIT;

  it("SkillForm marks and requires exactly the listed basics", () => {
    const { container, rerender } = render(<SkillForm labels={labels} values={defaults} scopes={scopes} />);
    expect(container.querySelectorAll("[required]")).toHaveLength(4);
    rerender(<SkillForm labels={labels} values={defaults} scopes={scopes} required={["name"]} />);
    expect(container.querySelectorAll("[required]")).toHaveLength(1);
    expect(container.querySelectorAll(".mh-skill-form__field label > span[aria-hidden]")).toHaveLength(1);
    rerender(<SkillForm labels={labels} values={defaults} scopes={scopes} required={[]} />);
    expect(container.querySelectorAll("[required]")).toHaveLength(0);
    expect(container.querySelectorAll(".mh-skill-form__field label > span[aria-hidden]")).toHaveLength(0);
  });

  it("ScenarioEditForm requires the report only when the host lists it", () => {
    const props = { content: SCENARIO_EDIT, values: SCENARIO_EDIT.defaults };
    const { container, rerender } = render(<ScenarioEditForm {...props} />);
    expect(container.querySelectorAll("[required]")).toHaveLength(5);
    rerender(<ScenarioEditForm {...props} required={["name", "purpose", "scope", "owner"]} />);
    expect(container.querySelectorAll("[required]")).toHaveLength(4);
  });

  it("BusinessTermForm follows the list it is given", () => {
    const { container, rerender } = render(<BusinessTermForm />);
    expect(container.querySelectorAll("[required]")).toHaveLength(3);
    rerender(<BusinessTermForm required={["title", "synonyms"]} />);
    expect(requiredNames(container).sort()).toEqual(["Synonyms", "Title"]);
  });

  it("KnowledgeCreateFields requires nothing until the host says which fields", () => {
    const props = { type: "Principles", content: KNOWLEDGE_CREATE, values: {}, invalid: [] };
    const { container, rerender } = render(<KnowledgeCreateFields {...props} />);
    expect(container.querySelectorAll("[required]")).toHaveLength(0);
    expect(stars(container.querySelector(".mh-kcf__generic"))).toBe(0);
    rerender(<KnowledgeCreateFields {...props} required={requiredKnowledgeCreateFields("Principles")} />);
    expect(requiredNames(container).sort()).toEqual(["description", "title"]);
    rerender(<KnowledgeCreateFields {...props} required={["title"]} />);
    expect(requiredNames(container)).toEqual(["title"]);
  });

  it("the Analytical Model picker and the metric formula follow the list too", () => {
    const analysis = { type: "Analytical Model", content: KNOWLEDGE_CREATE, values: {}, invalid: [] };
    const { container, rerender } = render(<KnowledgeCreateFields {...analysis} required={requiredKnowledgeCreateFields("Analytical Model")} />);
    expect(screen.getAllByRole("button", { name: /required/i })).toHaveLength(1);
    rerender(<KnowledgeCreateFields {...analysis} required={[]} />);
    expect(screen.queryAllByRole("button", { name: /required/i })).toHaveLength(0);
    const metric = { type: "Metric Dictionary", content: KNOWLEDGE_CREATE, values: {}, invalid: [] };
    rerender(<KnowledgeCreateFields {...metric} required={["metricName", "metricFormula"]} />);
    expect(container.querySelector("[role=textbox][aria-required='true']")).not.toBeNull();
    rerender(<KnowledgeCreateFields {...metric} required={["metricName"]} />);
    expect(container.querySelector("[role=textbox]").hasAttribute("aria-required")).toBe(false);
  });

  it("MemoryWorkspace asks only for the listed fields", () => {
    const labels = { title: "Title", description: "Description", cannotBeEmpty: "Cannot be empty", edit: "Edit", delete: "Delete", share: "Share", save: "Save Changes", cancel: "Cancel" };
    const props = { selected: { id: "m1", title: "t", description: "d", tags: [], relatedTags: [] }, editing: true, draft: { title: "t", description: "d" }, labels };
    const { container, rerender } = render(<MemoryWorkspace {...props} />);
    expect(container.querySelectorAll("[required]")).toHaveLength(2);
    rerender(<MemoryWorkspace {...props} required={["title"]} />);
    expect(container.querySelectorAll("[required]")).toHaveLength(1);
  });

  it("DerivedMetricPanel names its required field and leaves a constant's validity to the host", () => {
    const props = { open: true, copy: METRIC_DICTIONARY.derivedPanel, constantOpen: true };
    const refuse = vi.fn(() => false);
    const { rerender } = render(<DerivedMetricPanel {...props} onConstantAdd={refuse} />);
    expect(screen.getByLabelText(props.copy.name).hasAttribute("required")).toBe(true);
    const input = screen.getByRole("dialog", { name: props.copy.constantTitle }).querySelector("input");
    fireEvent.change(input, { target: { value: "not a number" } });
    fireEvent.submit(input.closest("form"));
    expect(refuse).toHaveBeenCalledWith({ value: "not a number" });
    expect(screen.getByText(props.copy.constantError)).toBeTruthy();
    expect(document.activeElement).toBe(input);
    rerender(<DerivedMetricPanel {...props} required={[]} onConstantAdd={refuse} />);
    expect(screen.getByLabelText(props.copy.name).hasAttribute("required")).toBe(false);
  });

  it("a constant the host accepts closes the way it always did (no message)", () => {
    const accept = vi.fn();
    render(<DerivedMetricPanel open copy={METRIC_DICTIONARY.derivedPanel} constantOpen onConstantAdd={accept} />);
    const input = screen.getByRole("dialog", { name: METRIC_DICTIONARY.derivedPanel.constantTitle }).querySelector("input");
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.submit(input.closest("form"));
    expect(accept).toHaveBeenCalledWith({ value: "100" });
    expect(screen.queryByText(METRIC_DICTIONARY.derivedPanel.constantError)).toBeNull();
  });
});
