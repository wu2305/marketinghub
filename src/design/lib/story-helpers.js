import React from "react";
import { LOGO, NAV } from "../content.js";

/** Shared shell props for page-level stories: logo + primary navigation. */
export const pageShell = { logo: LOGO, navigation: NAV };

/**
 * Local state seeded from a story arg and re-synced whenever the arg changes.
 * Controlled-story pattern: canvas interaction writes back through state, so
 * typing/selecting keeps its result, while Controls edits still drive the
 * component. Internal only — not part of the public index.js API.
 */
export function useSynced(value) {
  const [state, setState] = React.useState(value);
  React.useEffect(() => setState(value), [value]);
  return [state, setState];
}

/**
 * ArgTypes row carrying the real interface contract. `summary` is the type
 * shown in the docs table; `detail` (optional) renders inside the type's
 * tooltip; `defaultValue` is the component's actual destructured default
 * (raw JS value — displayed JSON-encoded).
 */
export function prop(summary, { defaultValue, description, detail, ...rest } = {}) {
  return {
    description,
    table: {
      type: { summary, ...(detail ? { detail } : {}) },
      ...(defaultValue !== undefined ? { defaultValue: { summary: JSON.stringify(defaultValue) } } : {}),
    },
    ...rest,
  };
}

/**
 * Enum argTypes row built from the exported option constant — the constant
 * stays the single source for both the displayed union and the control
 * options. Pass `control: false` for documented-but-not-editable enums.
 */
export function enumProp(values, defaultValue, description, control = "select") {
  return prop(values.map((value) => JSON.stringify(value)).join(" | "), {
    defaultValue,
    description,
    control,
    options: values,
  });
}

/**
 * Callback argTypes row: wires the Actions panel under `name` and documents
 * the call signature plus a payload matching what the component emits.
 * Omit `examplePayload` for callbacks invoked with no arguments.
 */
export function callbackProp(name, signature, examplePayload, description) {
  return {
    description,
    action: name,
    table: {
      type: {
        summary: signature,
        detail:
          examplePayload === undefined
            ? "Called with no arguments."
            : `Example payload:\n${JSON.stringify(examplePayload, null, 2)}`,
      },
    },
  };
}
