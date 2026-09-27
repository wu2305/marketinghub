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
          "Scenario Reporting knowledge type (scenario-reports.js `#scenarioReportOverview`): unified toolbar with Status and Process filters, the gold search pill, the result count and the right-aligned create link, a three-column card grid carrying the Enabled/Disabled pill, both workflow axes and the governed icon actions, and the shared `#knowledgeDetail` slide-in drawer with the availability/workflow title pills and the icon-action footer. The seeded records are all owned by other users, so the action buttons are blocked but remain operable for the permission explanation; with an owned record the disable-first/delete/disable confirm flows become reachable. Driven by `useScenarioDemo` so canvas interactions are live.",
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
    dialog: prop('{ kind: "disable-first" | "delete-confirm" | "disable-confirm", record: { id } } | null', { defaultValue: null, description: "Seeds an open confirm dialog (stories only — reachable for owned records).", control: false }),
    onQueryChange: callbackProp("onQueryChange", "(event: { name, value }) => void", { name: "search", value: "city" }, "Search input change; resets to page 1."),
    onFilterChange: callbackProp("onFilterChange", "(event: { id, value }) => void", { id: "process", value: "Published" }, "Select filter change; resets to page 1."),
    onPage: callbackProp("onPage", "(event: { page }) => void", { page: 2 }, "Previous/Next page."),
    onPageSize: callbackProp("onPageSize", "(event: { pageSize }) => void", { pageSize: 20 }, "Rows-per-page change; resets to page 1."),
    onOpen: callbackProp("onOpen", "(event: { id }) => void", { id: "scenario-channel-performance" }, "Card title activation opens the detail drawer."),
    onCloseDetail: callbackProp("onCloseDetail", "(event: { reason }) => void", { reason: "button" }, "Drawer dismissed (×, scrim, Escape)."),
    onAction: callbackProp("onAction", "(event: { action, id, blocked, reason }) => void", { action: "disable", id: "scenario-channel-performance", blocked: true, reason: "permission" }, "Edit/delete/disable action reports its governance result."),
    onDialogConfirm: callbackProp("onDialogConfirm", "(event: { confirmed: true }) => void", { confirmed: true }, "Confirm dialog's primary action — runs the pending operation."),
    onDialogCancel: callbackProp("onDialogCancel", "(event: { reason }) => void", { reason: "cancel" }, "Confirm dialog dismissed."),
    onCreate: callbackProp("onCreate", "(event: { href }) => void", { href: "knowledge-create.html?type=Scenario%20Reporting" }, "Add Scenario reporting link activated."),
    onNavigate: callbackProp("onNavigate", "(event: { href, id }) => void", { href: "knowledge-create.html?type=Scenario%20Reporting&mode=edit&id=...", id: "scenario-channel-performance" }, "Edit action navigates to the create page in edit mode."),
  },
  render: function ScenarioReportsStory(args) {
    const viewProps = useScenarioDemo(args);
    return <ScenarioReportsView {...viewProps} />;
  },
};

export const Default = {};

/* Card title activation opens the shared knowledge-detail drawer: SCENARIO REPORTING
   label + title + Enabled/Disabled + workflow pills, Related Report link,
   Description, Structure & Guidance, Supporting Files, the AI-enable note
   (shown only when disabled and not yet Published) and the meta footer. */
export const DetailOpen = {
  args: { detail: "scenario-channel-performance" },
};

/** An owned + enabled scenario exposes Disable while Edit/Delete explain that
    the record must go offline first — the "Confirm Operation" dialog shown here. */
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

/** An owned + disabled scenario exposes Delete and its destructive confirmation. */
export const OwnRecordDeleteConfirm = {
  args: {
    records: [
      {
        id: "scenario-own-disabled",
        title: "Owned Disabled Scenario",
        description: "Owned scenario ready for deletion.",
        report: "Invest City Strategy Analysis",
        creator: "Current User",
        owner: "Current User",
        workflow_status: "Draft",
        ai_interpreter_enabled: false,
      },
    ],
    dialog: { kind: "delete-confirm", record: { id: "scenario-own-disabled" } },
  },
};

export const FilteredEmpty = {
  args: { query: "no such scenario" },
};
