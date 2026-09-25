import { INTERPRETER } from "../../../content.js";
import { useFieldLibraryDemo } from "../../../demo/field-library-demo.js";
import { callbackProp, prop } from "../../../lib/story-helpers.js";
import { FieldLibraryDrawer } from "./index.jsx";

const bundle = INTERPRETER.fieldLibrary;

export default {
  title: "Features/Interpreter/Field library drawer",
  component: FieldLibraryDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The fm detail drawer + dialogs as a standalone layer: field-library.js listens for the page-level `reportcontext:view` event (fired by the Data Model related-report buttons and the generic asset list) and opens the Report Context drawer over the *current* type page without switching to it. The page composes this component from the `peek` payload `useFieldLibraryDemo` returns; the Record Detail / Description edit dialogs work the same as inside the full view.",
      },
    },
  },
  args: {
    ...bundle,
    records: INTERPRETER.records,
    peek: "city-report-context",
  },
  argTypes: {
    records: prop("Array<AssetRecord>", {
      description: "All page records — the peeked record normalizes via `normalizeFieldRecord` like any fm record.",
      control: false,
    }),
    peek: prop("string | null", {
      defaultValue: "city-report-context",
      description: "Record id to peek — resolves across all fm types regardless of the active page type.",
    }),
    strings: prop("object", { description: "Same copy bundle as FieldLibraryView.", control: false }),
    scenarioHref: prop("(id: string) => string", { description: "Linked-scenario chip href builder.", control: false }),
    dashboardHref: prop("string", { description: "\"Open Dashboard\" link target." }),
    onAction: callbackProp("onAction", "(event: { action, id }) => void", { action: "edit-description", id: "city-report-context" }, "The drawer's edit-description pencil."),
    onCloseDetail: callbackProp("onCloseDetail", "(event: { reason }) => void", { reason: "scrim" }, "Drawer dismissed — the host clears the peek."),
    onDescriptionChange: callbackProp("onDescriptionChange", "(event: { value }) => void", { value: "Edited" }),
    onDescriptionConfirm: callbackProp("onDescriptionConfirm", "(event: { id }) => void", { id: "city-report-context" }),
    onDescriptionCancel: callbackProp("onDescriptionCancel", "(event: { reason }) => void", { reason: "escape" }),
  },
  render: function FieldLibraryDrawerStory(args) {
    const viewProps = useFieldLibraryDemo(args);
    const peek = viewProps.peek;
    return peek ? <FieldLibraryDrawer {...viewProps} type={peek.type} detail={peek.detail} /> : null;
  },
};

/** The RC drawer peeked from a non-fm page (e.g. the Data Model related-report
    buttons) — same thumbnail/overview/linked-scenario/scope layout. */
export const ReportContextPeek = {};
