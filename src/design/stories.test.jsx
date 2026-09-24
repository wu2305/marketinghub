import React from "react";
import { composeStories } from "@storybook/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as iconsModule from "./icons.jsx";

import * as buttonStories from "./components/Button/Button.stories.jsx";
import * as textInputStories from "./components/TextInput/TextInput.stories.jsx";
import * as textAreaStories from "./components/TextArea/TextArea.stories.jsx";
import * as selectStories from "./components/Select/Select.stories.jsx";
import * as searchFieldStories from "./components/SearchField/SearchField.stories.jsx";
import * as tabsStories from "./components/Tabs/Tabs.stories.jsx";
import * as filterPillsStories from "./components/FilterPills/FilterPills.stories.jsx";
import * as checkboxFilterStories from "./components/CheckboxFilter/CheckboxFilter.stories.jsx";
import * as reportRowStories from "./features/cockpit/ReportRow/ReportRow.stories.jsx";

const storyModules = import.meta.glob(
  ["./components/**/*.stories.jsx", "./features/**/*.stories.jsx", "./icons.stories.jsx"],
  { eager: true },
);
const metas = Object.values(storyModules)
  .map((module) => module.default)
  .filter(Boolean);

const isComponentExport = (name, value) =>
  /^[A-Z]/.test(name) && (typeof value === "function" || (value !== null && typeof value === "object"));

const componentModules = import.meta.glob(
  ["./components/*/index.jsx", "./features/*/*/index.jsx"],
  { eager: true },
);
const componentEntries = Object.values(componentModules).flatMap((module) =>
  Object.entries(module),
);

const components = [
  ...componentEntries,
  ...Object.entries(iconsModule),
]
  .filter(([name, value]) => isComponentExport(name, value))
  .map(([name, value]) => ({ name, component: value }));

// The former atoms/molecules layers (now the shared components/ set built from
// them) plus Icon and ReportRow carry full per-prop documentation.
const ATOM_MODULES = ["Button", "TextInput", "TextArea", "Select", "StatusBadge"];
const MOLECULE_MODULES = [
  "SearchField", "CheckboxFilter", "Pagination", "MetricStat", "SectionHeading",
  "FilterPills", "Tabs", "FormField",
  "ProgressList", "ColumnChart", "DataTable",
  "FileDropzone", "Toast",
];
const documentedComponents = new Set([
  ...Object.entries(componentModules)
    .filter(([path]) =>
      [...ATOM_MODULES, ...MOLECULE_MODULES].some((n) => path === `./components/${n}/index.jsx`),
    )
    .flatMap(([, module]) => Object.entries(module))
    .filter(([name, value]) => isComponentExport(name, value))
    .map(([, value]) => value),
  iconsModule.Icon,
  componentModules["./features/cockpit/ReportRow/index.jsx"].ReportRow,
]);

describe("story coverage", () => {
  it("every meta declares a component and autodocs", () => {
    expect(metas.length).toBeGreaterThan(0);
    for (const meta of metas) {
      expect(meta.component, `${meta.title} meta.component`).toBeTruthy();
      expect(meta.tags, `${meta.title} meta.tags`).toContain("autodocs");
      expect(
        meta.parameters?.docs?.description?.component,
        `${meta.title} docs.description.component`,
      ).toBeTruthy();
    }
  });

  it("every atoms/molecules/organisms/Icon export is the component of some meta", () => {
    for (const { name, component } of components) {
      const meta = metas.find((candidate) => candidate.component === component);
      expect(meta, `no story meta for ${name}`).toBeTruthy();
    }
  });
});

describe("docs completeness", () => {
  const documentedMetas = metas.filter((meta) => documentedComponents.has(meta.component));

  it("covers every atoms/molecules component plus Icon and ReportRow", () => {
    expect(documentedMetas.length).toBe(documentedComponents.size);
  });

  it("every documented argType has a type summary and description", () => {
    for (const meta of documentedMetas) {
      const entries = Object.entries(meta.argTypes || {});
      expect(entries.length, `${meta.title} has no argTypes`).toBeGreaterThan(0);
      for (const [arg, argType] of entries) {
        expect(argType.table?.type?.summary, `${meta.title} argTypes.${arg} type summary`).toBeTruthy();
        expect(argType.description, `${meta.title} argTypes.${arg} description`).toBeTruthy();
        if (arg.startsWith("on")) {
          expect(argType.action, `${meta.title} argTypes.${arg} action`).toBeTruthy();
          expect(argType.table?.type?.detail, `${meta.title} argTypes.${arg} payload example`).toBeTruthy();
        }
      }
    }
  });
});

describe("controlled stories write back", () => {
  const { Default: TextInputStory } = composeStories(textInputStories);
  const { Default: TextAreaStory } = composeStories(textAreaStories);
  const { Default: SelectStory } = composeStories(selectStories);
  const { Default: SearchFieldStory } = composeStories(searchFieldStories);
  const { Default: TabsStory } = composeStories(tabsStories);
  const { Default: FilterPillsStory } = composeStories(filterPillsStories);
  const { Default: CheckboxFilterStory } = composeStories(checkboxFilterStories);
  const { Default: ButtonStory } = composeStories(buttonStories);
  const { Default: ReportRowStory } = composeStories(reportRowStories);

  it("TextInput keeps typed text and emits { name, value }", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<TextInputStory name="query" onChange={onChange} />);
    const input = screen.getByLabelText("Search dashboards");
    fireEvent.change(input, { target: { value: "AUDIT" } });
    expect(input.value).toBe("AUDIT");
    expect(onChange).toHaveBeenLastCalledWith({ name: "query", value: "AUDIT" });
    rerender(<TextInputStory name="query" value="X" onChange={onChange} />);
    expect(await screen.findByDisplayValue("X")).toBeTruthy();
  });

  it("SearchField keeps typed text", () => {
    const onChange = vi.fn();
    render(<SearchFieldStory name="q" onChange={onChange} />);
    const input = screen.getByLabelText("Search dashboards");
    fireEvent.change(input, { target: { value: "AUDIT" } });
    expect(input.value).toBe("AUDIT");
    expect(onChange).toHaveBeenLastCalledWith({ name: "q", value: "AUDIT" });
  });

  it("TextArea keeps typed text", () => {
    const onChange = vi.fn();
    render(<TextAreaStory name="description" onChange={onChange} />);
    const input = screen.getByLabelText("Description");
    fireEvent.change(input, { target: { value: "AUDIT" } });
    expect(input.value).toBe("AUDIT");
    expect(onChange).toHaveBeenLastCalledWith({ name: "description", value: "AUDIT" });
  });

  it("Select keeps the chosen option", () => {
    const onChange = vi.fn();
    render(<SelectStory onChange={onChange} />);
    const select = screen.getByLabelText("Term type");
    fireEvent.change(select, { target: { value: "Global Synonym" } });
    expect(select.value).toBe("Global Synonym");
    expect(onChange).toHaveBeenLastCalledWith({ name: "", value: "Global Synonym" });
  });

  it("Tabs updates aria-selected on click", () => {
    render(<TabsStory />);
    const tab = screen.getByRole("tab", { name: "Data Upload" });
    fireEvent.click(tab);
    expect(tab.getAttribute("aria-selected")).toBe("true");
  });

  it("FilterPills updates aria-pressed on click", () => {
    render(<FilterPillsStory />);
    const pill = screen.getByRole("button", { name: "DG" });
    fireEvent.click(pill);
    expect(pill.getAttribute("aria-pressed")).toBe("true");
  });

  it("CheckboxFilter checks an option", () => {
    render(<CheckboxFilterStory />);
    const checkbox = screen.getByRole("checkbox", { name: "Role" });
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("Button emits { label } instead of the DOM event", () => {
    const onClick = vi.fn();
    render(<ButtonStory onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Create Campaign Task" }));
    expect(onClick).toHaveBeenLastCalledWith({ label: "Create Campaign Task" });
  });

  it("ReportRow renders the padded index and emits named payloads", () => {
    const onOpen = vi.fn();
    const onDetails = vi.fn();
    render(<ReportRowStory index={2} onOpen={onOpen} onDetails={onDetails} />);
    expect(screen.getByText("REPORT")).toBeTruthy();
    expect(screen.getByText("03")).toBeTruthy();
    const title = "Invest City Strategy Analysis";
    fireEvent.click(screen.getByRole("link", { name: title }));
    expect(onOpen).toHaveBeenLastCalledWith({
      title,
      href: "/assets/pages/reports.html?project=city&dashboard=0&view=live",
    });
    fireEvent.click(screen.getByRole("link", { name: `Open knowledge for ${title}` }));
    expect(onDetails).toHaveBeenLastCalledWith({
      title,
      href: "/assets/pages/knowledge.html?type=Report%20Context",
    });
  });
});
