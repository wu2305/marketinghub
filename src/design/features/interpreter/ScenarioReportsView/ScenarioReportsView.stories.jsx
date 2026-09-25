import { INTERPRETER } from "../../../content.js";
import { useScenarioDemo } from "../../../demo/scenario-demo.js";
import { callbackProp, prop } from "../../../lib/story-helpers.js";
import { ScenarioReportsView } from "./index.jsx";

const bundle = INTERPRETER.scenarioReports;

export default {
  title: "Features/Interpreter/Scenario reports view",
  component: ScenarioReportsView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Scenario Reporting knowledge type (scenario-reports.js `#scenarioReportOverview`): unified toolbar with two boxed select filters (Status/Process) + the gold search pill + the right-aligned create link, a three-column card grid carrying the Enabled/Disabled pill and the owner/status-gated icon actions, and the shared `#knowledgeDetail` slide-in drawer with the availability/workflow title pills and the icon-action footer. The seeded records are all owned by other users, so the action buttons render disabled — with an owned record the disable-first/delete/disable confirm flows become reachable. Driven by `useScenarioDemo` so canvas interactions are live.",
      },
    },
  },
  args: {
    ...bundle,
    query: "",
    filterValues: {},
    page: 1,
    pageSize: 10,
    detail: null,
    dialog: null,
  },
  argTypes: {
    records: prop("Array<ScenarioRecord>", {
      description: "Seeded scenarios — normalized by the container (`normalizeScenarioRecord`).",
      control: false,
    }),
    currentUser: prop("string", { defaultValue: "Current User", description: "Identity constant — only own scenarios can be managed." }),
    strings: prop("object", { description: "All copy: filters, sections, dialog text, tooltips.", control: false }),
    createHref: prop("string", { description: "\"Add Scenario reporting\" link target (knowledge-create.html, M5 — not built)." }),
    query: prop("string", { defaultValue: "", description: "Initial search text." }),
    filterValues: prop("{ status?: string, process?: string }", { description: "Initial select values — single option per filter, like the original `<select>`." }),
    page: prop("number", { defaultValue: 1 }),
    pageSize: prop("number", { defaultValue: 10, control: "inline-radio", options: [5, 10, 20] }),
    detail: prop("string | null", { defaultValue: null, description: "Record id opened in the drawer (the `?detail=` deep link the RC scenario chips point at)." }),
    dialog: prop('{ kind: "delete-confirm" | "disable-confirm", record: { id } } | null', { defaultValue: null, description: "Seeds an open confirm dialog (stories only — reachable for owned records).", control: false }),
    onQueryChange: callbackProp("onQueryChange", "(value: string) => void", "Search input change; resets to page 1."),
    onFilterChange: callbackProp("onFilterChange", "(event: { id, value }) => void", { id: "process", value: "Published" }, "Select filter change; resets to page 1."),
    onPage: callbackProp("onPage", "(page: number) => void", 2, "Previous/Next page."),
    onPageSize: callbackProp("onPageSize", "(size: number) => void", 20, "Rows-per-page change; resets to page 1."),
    onOpen: callbackProp("onOpen", "(record) => void", { id: "scenario-channel-performance" }, "Card click opens the detail drawer."),
    onCloseDetail: callbackProp("onCloseDetail", "() => void", undefined, "Drawer dismissed (×, scrim, Escape)."),
    onAction: callbackProp("onAction", "(event: { action, record }) => void", { action: "disable", id: "scenario-channel-performance" }, "Edit/delete/disable icon button — only fires when the gate allows."),
    onDialogConfirm: callbackProp("onDialogConfirm", "(dialog) => void", undefined, "Confirm dialog's primary action — runs the pending operation."),
    onDialogCancel: callbackProp("onDialogCancel", "(dialog) => void", undefined, "Confirm dialog dismissed."),
    onCreate: callbackProp("onCreate", "() => void", undefined, "Add Scenario reporting link activated."),
    onNavigate: callbackProp("onNavigate", "(href: string) => void", "knowledge-create.html?type=Scenario%20Reporting&mode=edit&id=...", "Edit action navigates to the create page in edit mode."),
  },
  render: function ScenarioReportsStory(args) {
    const viewProps = useScenarioDemo(args);
    return <ScenarioReportsView {...viewProps} />;
  },
};

export const Default = {};

/* Card click opens the shared knowledge-detail drawer: SCENARIO REPORTING
   label + title + Enabled/Disabled + workflow pills, Related Report link,
   Description, Structure & Guidance, Supporting Files, the AI-enable note
   (shown only when disabled and not yet Published) and the meta footer. */
export const DetailOpen = {
  args: { detail: "scenario-channel-performance" },
};

/** An owned + enabled scenario unlocks only the Disable action (Edit/Delete
    stay gated until the record is disabled) — the "Confirm Operation" dialog
    shown here. */
export const OwnRecordDisableConfirm = {
  args: {
    records: [
      {
        id: "scenario-own-baseline",
        title: "Baseline Review Scenario",
        description: "Owned scenario used to demonstrate the enabled action gate.",
        report: "Invest City Strategy Analysis",
        creator: "Current User",
        owner: "Current User",
        workflow_status: "Published",
        ai_interpreter_enabled: true,
      },
    ],
    dialog: { kind: "disable-confirm", record: { id: "scenario-own-baseline" } },
  },
};

export const FilteredEmpty = {
  args: { query: "no such scenario" },
};
