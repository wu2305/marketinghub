import React from "react";
import fs from "node:fs";
import path from "node:path";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { KNOWLEDGE_CREATE } from "./demo/content/knowledge-create.js";
import { useKnowledgeCreateDemo } from "./demo/knowledge-create-demo.js";
import { KnowledgeCreatePage } from "./pages/KnowledgeCreatePage/index.jsx";
import { BusinessTermForm } from "./features/interpreter/BusinessTermForm/index.jsx";
import { ModelFlowDialog } from "./components/ModelFlowDialog/index.jsx";
import { MODEL_FLOW } from "./content.js";
import * as ScenarioEditStories from "./pages/ScenarioEditPage/ScenarioEditPage.stories.jsx";
import * as PersonalMemoryStories from "./pages/PersonalMemoryPage/PersonalMemoryPage.stories.jsx";
import * as MetricDictionaryStories from "./pages/MetricDictionaryPage/MetricDictionaryPage.stories.jsx";

/**
 * The form-validation matrix: every form that refuses a submit is driven the same way and held to the same
 * contract, so a form cannot quietly behave differently from the others.
 *
 * For each form:
 *  1. Nothing is invalid before the first attempt and the Submit control is not disabled (a disabled button
 *     would hide the reason; only a request in flight may disable it).
 *  2. A failed attempt marks exactly the missing required controls invalid (aria-invalid, or data-invalid for a
 *     button-style picker that cannot carry it), each with its own visible message wired to it through
 *     aria-describedby, and each announced as required.
 *  3. Focus moves to the first invalid control in document order, and moves back there on every further failed
 *     attempt, even when the invalid set did not change.
 *  4. Fixing one control clears only its own mark and message; focus stays where the user is typing.
 *  5. When every control is fixed the submit goes through once and nothing is marked invalid.
 */

const INVALID = '[aria-invalid="true"], [data-invalid="true"]';
const isControl = (element) => element.matches("input, textarea, select, button, [role='textbox']");
const invalidControls = (root) => [...root.querySelectorAll(INVALID)].filter(isControl);
const describe_ = (element) => element ? `${element.tagName.toLowerCase()}[${element.getAttribute("name") || element.getAttribute("aria-label") || element.id || element.className}]` : "none";

/** Accessible name of a control the way a screen reader composes it from aria-labelledby / aria-label / its label text. */
function accessibleName(element) {
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) return labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent || "").join(" ");
  if (element.getAttribute("aria-label")) return element.getAttribute("aria-label");
  return [...(element.labels || [])].map((label) => label.textContent).join(" ");
}

function announcesRequired(element) {
  return element.required === true || element.getAttribute("aria-required") === "true" || /required/i.test(accessibleName(element));
}

/** The text of the message a control is described by, or "" when nothing resolvable describes it. */
function descriptionOf(element) {
  const ids = (element.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
  return ids.map((id) => document.getElementById(id)?.textContent || "").join(" ").trim();
}

/** Give one control a valid value the way a person would. */
function fix(element, root) {
  if (element.matches(".mh-kcf__multi-trigger")) {
    fireEvent.click(element);
    fireEvent.click(root.querySelector(".mh-kcf__multi-options input[type=checkbox]"));
    fireEvent.click(element);
  } else if (element.matches(".mh-kcf__formula")) {
    fireEvent.click(root.querySelector(".mh-kcf__metric-list button"));
  } else if (element.matches("select")) {
    const option = [...element.options].find((item) => item.value !== "");
    fireEvent.change(element, { target: { value: option.value } });
  } else {
    fireEvent.change(element, { target: { value: element.inputMode === "decimal" ? "100" : "A valid value" } });
  }
}

const matches = (element, matcher) => [element.getAttribute("name"), element.getAttribute("aria-label"), accessibleName(element)]
  .filter(Boolean).some((value) => (matcher instanceof RegExp ? matcher.test(value) : value === matcher));

/**
 * Drive one form through the contract.
 * @param {object} form
 * @param {HTMLElement} form.root where the marks live
 * @param {() => HTMLElement} form.submit the control that attempts the submit
 * @param {Array<string|RegExp>} form.invalid what a failed first attempt marks, in document order: a control's
 *   name, aria-label or accessible name (a RegExp matches any of them)
 * @param {import("vitest").Mock} form.accepted called when the attempt goes through
 */
function runContract({ root, submit, invalid, accepted }) {
  expect(invalidControls(root), "nothing is invalid before the first attempt").toHaveLength(0);
  expect(submit().disabled, "submit is not disabled before the attempt").toBe(false);

  fireEvent.click(submit());
  let marked = invalidControls(root);
  expect(marked.map((element) => [element.getAttribute("name"), element.getAttribute("aria-label"), accessibleName(element)].filter(Boolean).join(" | ")).length, "failed attempt marks exactly the missing controls").toBe(invalid.length);
  invalid.forEach((matcher, index) => expect(matches(marked[index], matcher), `invalid control ${index + 1} is ${matcher} (was ${describe_(marked[index])})`).toBe(true));
  for (const element of marked) {
    expect(announcesRequired(element), `${describe_(element)} is announced as required`).toBe(true);
    const message = descriptionOf(element);
    expect(message, `${describe_(element)} has a visible message wired with aria-describedby`).not.toBe("");
    expect(message, `${describe_(element)} message names what is missing, without blaming the person`).not.toMatch(/\byou(r)?\b|wrong|mistake|fail|illegal|\bbad\b/i);
  }
  expect(document.activeElement, "focus moves to the first invalid control").toBe(marked[0]);

  /* A further failed attempt returns focus even though the invalid set is unchanged. */
  act(() => { document.activeElement?.blur(); });
  fireEvent.click(submit());
  marked = invalidControls(root);
  expect(marked).toHaveLength(invalid.length);
  expect(document.activeElement, "focus returns on every failed attempt").toBe(marked[0]);
  expect(accepted).not.toHaveBeenCalled();

  /* Fixing the controls one by one clears each own mark and leaves the others, without taking focus. */
  for (let index = 0; index < invalid.length; index += 1) {
    fix(invalidControls(root)[0], root);
    const rest = invalidControls(root);
    expect(rest, `fixing control ${index + 1} clears only its own mark`).toHaveLength(invalid.length - index - 1);
    if (rest.length) expect(document.activeElement, "typing in one control does not move focus to another").not.toBe(rest[0]);
  }
  fireEvent.click(submit());
  expect(accepted).toHaveBeenCalledTimes(1);
  expect(invalidControls(root)).toHaveLength(0);
}

afterEach(() => { document.body.innerHTML = ""; });

const submitButton = (root, pattern) => () => [...root.querySelectorAll("button")].find((button) => button.type === "submit" && pattern.test(button.textContent));
const named = (root, pattern) => () => within(root).getByRole("button", { name: pattern });

/* ---------------------------------------------------------------- Knowledge Create: every type and mode */

function KnowledgeCreateHost({ type, mode = "create", id, initial, onSubmit }) {
  const props = useKnowledgeCreateDemo({ content: KNOWLEDGE_CREATE, type, mode, id, initial, onSubmit });
  return <KnowledgeCreatePage {...props} />;
}

const knowledgeRows = [
  ["Principles", ["title", "description"]],
  ["Report Context", ["description"]],
  ["Data Model", ["modelName"]],
  ["Metric Dictionary", ["metricName", "Formula Builder"]],
  ["Business Term", ["title", "description"]],
  ["Analytical Model", ["analysis_name", /Business Domain/, "trigger_when", "output_requirements"]],
  ["Scenario Reporting", ["scenario_report_title", "scenario_report_linked", "scenario_report_description", "scenario_report_blueprint"]],
];

describe("Knowledge Create: Submit on every knowledge type", () => {
  for (const [type, invalid] of knowledgeRows) {
    it(`${type} follows the form contract`, () => {
      const accepted = vi.fn();
      const { container } = render(<KnowledgeCreateHost type={type} onSubmit={accepted} />);
      runContract({ root: container, accepted, invalid, submit: submitButton(container, /^(Submit|Publish)/) });
    });
  }

  it("Global Synonym (the other Business Term kind) asks for the same fields", () => {
    const accepted = vi.fn();
    const { container } = render(<KnowledgeCreateHost type="Business Term" initial={{ kind: "Global Synonym" }} onSubmit={accepted} />);
    runContract({ root: container, accepted, invalid: ["title", "description"], submit: submitButton(container, /^Publish/) });
  });

  it("editing a Business Term record: blanking its title is refused like creating one", () => {
    const accepted = vi.fn();
    const { container } = render(<KnowledgeCreateHost type="Business Term" mode="edit" id="business-term-gmv" initial={{ title: "" }} onSubmit={accepted} />);
    runContract({ root: container, accepted, invalid: ["title"], submit: submitButton(container, /^Publish/) });
  });

  it("copying a Principles record: blanking its description is refused like creating one", () => {
    const accepted = vi.fn();
    const { container } = render(<KnowledgeCreateHost type="Principles" mode="copy" id="investment-principles" initial={{ description: " " }} onSubmit={accepted} />);
    runContract({ root: container, accepted, invalid: ["description"], submit: submitButton(container, /^Submit/) });
  });

  it("Synonyms: each incomplete row marks its three required cells, with a message beside each", () => {
    const accepted = vi.fn();
    const { container } = render(<KnowledgeCreateHost type="Synonyms" onSubmit={accepted} />);
    fireEvent.click(screen.getByRole("button", { name: /Add Synonym/ }));
    runContract({ root: container, accepted, invalid: [/Standard Term/i, /Synonym/i, /Term Type/i], submit: submitButton(container, /^Submit/) });
  });

  it("Synonyms with no new row: the source has nothing to validate, so Submit goes through (open question, see handover)", () => {
    const accepted = vi.fn();
    const { container } = render(<KnowledgeCreateHost type="Synonyms" onSubmit={accepted} />);
    fireEvent.click(submitButton(container, /^Submit/)());
    expect(invalidControls(container)).toHaveLength(0);
    expect(accepted).toHaveBeenCalledTimes(1);
  });

  it("Save Draft keeps a draft partial on every type but the three whose source form checks on Save", () => {
    const checked = [];
    for (const [type] of knowledgeRows) {
      const { container, unmount } = render(<KnowledgeCreateHost type={type} />);
      fireEvent.click([...container.querySelectorAll("button")].find((button) => button.type === "button" && /^Save/.test(button.textContent.trim())));
      if (invalidControls(container).length) checked.push(type);
      unmount();
    }
    expect(checked).toEqual(["Metric Dictionary", "Business Term", "Analytical Model"]);
  });

  it("Report Context edit is the one Submit that starts disabled: with nothing changed there is nothing to submit", () => {
    const { container } = render(<KnowledgeCreateHost type="Report Context" mode="edit" id="city-report-context" />);
    expect(submitButton(container, /^Submit/)().disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: /Unlock report description/ }));
    fireEvent.change(screen.getByLabelText("Report description"), { target: { value: "A changed description" } });
    expect(submitButton(container, /^Submit/)().disabled).toBe(false);
  });
});

/* ---------------------------------------------------------------- Business Term form on its own (a host composing it) */

function BusinessTermHost({ onSubmit }) {
  const [values, setValues] = React.useState({ title: "", kind: "Business Term", description: "", synonyms: [], scope: [] });
  const [invalid, setInvalid] = React.useState([]);
  const labels = KNOWLEDGE_CREATE.businessTerm.labels;
  return <BusinessTermForm {...values} invalid={invalid} labels={labels} placeholders={KNOWLEDGE_CREATE.businessTerm.placeholders} reminder="r" guidance="g"
    onChange={({ name, value }) => { setValues((prior) => ({ ...prior, [name]: value })); setInvalid((prior) => (prior.includes(name) ? prior.filter((item) => item !== name) : prior)); }}
    onSubmit={({ values: submitted }) => {
      const missing = ["title", "description"].filter((name) => !String(submitted[name]).trim());
      if (missing.length) setInvalid(missing); else onSubmit(submitted);
    }} />;
}

describe("Business Term form composed by a host", () => {
  it("follows the form contract without the Knowledge Create page around it", () => {
    const accepted = vi.fn();
    const { container } = render(<BusinessTermHost onSubmit={accepted} />);
    runContract({ root: container, accepted, invalid: ["title", "description"], submit: submitButton(container, /^(Submit|Publish)/) });
  });
});

/* ---------------------------------------------------------------- Skill Edit */

/* A story composed with its file's default export, the way Storybook merges `render` and `args`. */
const story = (module, name) => ({ ...module.default, ...module[name], args: { ...module.default.args, ...module[name].args } });
const Story = ({ story: s, ...overrides }) => <s.render {...s.args} {...overrides} />;

describe("Skill Edit", () => {
  it("follows the form contract for name, purpose, scope, owner and report", () => {
    const accepted = vi.fn();
    const { container } = render(<Story story={story(ScenarioEditStories, "ScenarioEditRequired")} onSubmit={accepted} />);
    runContract({ root: container, accepted, invalid: [/Scenario Name|Name/, /Purpose/, /Scope/, /Owner/, /Report/], submit: submitButton(container, /Submit/) });
  });
});

/* ---------------------------------------------------------------- Personal Memory: create drawer and inline edit */

describe("Personal Memory", () => {
  it("the New Memory drawer follows the form contract for title and description", () => {
    const accepted = vi.fn();
    render(<Story story={story(PersonalMemoryStories, "PersonalMemory")} onSaveMemory={accepted} />);
    fireEvent.click(screen.getByRole("button", { name: /New Memory|Create|Add/i }));
    const drawer = document.querySelector(".mh-memory-page__create");
    runContract({ root: drawer, accepted, invalid: ["Title", "Description"], submit: named(drawer, /^Save Memory/) });
  });

  it("Save Changes on the inline editor refuses an emptied title or description the same way", () => {
    const accepted = vi.fn();
    const base = story(PersonalMemoryStories, "PersonalMemory");
    const { container } = render(<Story story={base} onSaveEdit={accepted} initial={{ selectedId: "mem-analysis-1", editing: true, editDraft: { title: "", description: "" } }} />);
    runContract({ root: container.querySelector(".mh-memory-workspace__detail"), accepted, invalid: ["Title", "Description"], submit: () => screen.getByRole("button", { name: /Save Changes/ }) });
  });
});

/* ---------------------------------------------------------------- Model flow dialog: manual form */

describe("Model flow dialog: the manual analytical model form", () => {
  for (const [action, pattern] of [["Submit", /^Submit/], ["Save", /^Save/]]) {
    it(`${action} follows the form contract for name, trigger and structure`, () => {
      const accepted = vi.fn();
      const { container } = render(<ModelFlowDialog step="manual" threads={MODEL_FLOW.threads} rule="" draft={{}} sections={MODEL_FLOW.sections} {...{ [`on${action}`]: accepted }} />);
      runContract({ root: container, accepted, invalid: ["name", "trigger", "structure"], submit: named(container, pattern) });
    });
  }
});

/* ---------------------------------------------------------------- Derived metric drawer: name and constant */

describe("Derived metric drawer", () => {
  it("Save follows the form contract for the metric name", () => {
    const accepted = vi.fn();
    const { container } = render(<Story story={story(MetricDictionaryStories, "MetricDictionaryAddDerived")} onSave={accepted} />);
    const drawer = document.querySelector(".mh-derived-panel");
    runContract({ root: drawer, accepted, invalid: ["Metric Name"], submit: named(drawer, /^Save/) });
    void container;
  });

  it("Add constant keeps a non-number in the dialog with a message instead of dropping it", () => {
    const accepted = vi.fn();
    render(<Story story={story(MetricDictionaryStories, "MetricDictionaryConstant")} onConstantAdd={accepted} />);
    const dialog = screen.getByRole("dialog", { name: /Add Constant/ });
    const input = within(dialog).getByRole("textbox");
    runContract({ root: dialog, accepted, invalid: [input.id ? /Enter a constant value/ : /constant/i], submit: named(dialog, /^Add$/) });
  });
});

/* ---------------------------------------------------------------- Every form is classified */

/**
 * Every `<form>` in the library, with how many it has and where it stands. A new form (or a second one in a file)
 * fails this test until it is added here, either under the contract above or with the reason it asks for nothing.
 */
const FORMS = {
  "components/SkillForm/index.jsx": [1, "covered: Skill Edit (Skill Library's inline form passes no errors by decision SF-10: its blank Submit is the source behaviour)"],
  "components/ModelFlowDialog/index.jsx": [1, "covered: manual model, Save and Submit"],
  "features/interpreter/BusinessTermForm/index.jsx": [1, "covered: on its own and inside Knowledge Create"],
  "features/metric-dictionary/DerivedMetricPanel/index.jsx": [2, "covered: metric name, constant"],
  "pages/KnowledgeCreatePage/index.jsx": [1, "covered: every knowledge type"],
  "pages/CampaignPage/index.jsx": [2, "nothing to refuse: the account filter is a search and the task dialog's four fields are selects with a value or free text, none required in the source"],
  "pages/DataUploadPage/index.jsx": [1, "nothing to refuse: no field is required in the source; Submit disables only while the request runs"],
  "components/AssistantPanel/index.jsx": [1, "chat composer: an empty message is not sent, there is no field to blame"],
  "features/cockpit/ReportCopilot/index.jsx": [1, "chat composer: an empty question is not sent, there is no field to blame"],
};

describe("Every form in the library is classified", () => {
  const root = path.resolve(import.meta.dirname);
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "acceptance" ? [] : walk(full);
    return /\.jsx$/.test(entry.name) && !/\.(stories|test)\.jsx$/.test(entry.name) ? [full] : [];
  });

  it("lists exactly the forms that exist", () => {
    const found = {};
    for (const file of walk(root)) {
      const count = (fs.readFileSync(file, "utf8").match(/<form[\s>]/g) || []).length;
      if (count) found[path.relative(root, file).split(path.sep).join("/")] = count;
    }
    expect(found).toEqual(Object.fromEntries(Object.entries(FORMS).map(([file, [count]]) => [file, count])));
  });
});
