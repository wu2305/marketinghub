import * as React from 'react';
import { BusinessTermForm } from 'marketing-hub';

// The story module can't be imported here: its argTypes call
// enumProp(businessTermKinds, ...) at module scope, and businessTermKinds is
// not exported from src/design/index.js, so it resolves to undefined through
// the shim and the module throws on load. Mirror the story's args + render.
const args = {
  title: "", kind: "Business Term", description: "", synonyms: "", scope: [] as string[],
  scopeOptions: ["Marketing", "Customer", "Global"],
  guidanceTitle: "Build a common language",
  guidance: "Clearly define the meaning, usage, and boundaries of this business term to help teams talk about data consistently.",
  reminder: "Operation reminder: Save keeps this term in Draft. Submit publishes it for AI use.",
  invalid: [] as string[],
};

export function Default() {
  const [values, setValues] = React.useState(() => ({ title: args.title, kind: args.kind, description: args.description, synonyms: args.synonyms, scope: args.scope }));
  return (
    <BusinessTermForm
      {...args}
      {...values}
      onChange={(event: any) => setValues((prior) => ({ ...prior, [event.name]: event.value }))}
    />
  );
}
