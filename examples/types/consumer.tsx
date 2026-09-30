/* TypeScript consumer of the built package, compiled by scripts/build-library.mjs
 * against dist/types. It proves the published declarations accept real usage
 * and still reject wrong usage (each @ts-expect-error must stay an error).
 * Not bundled or run; type-checked only. */
import React from "react";
import { AiInterpreterPage, AssistantDock, AssistantLauncher, AssistantPanel, Button, KnowledgeCreatePage, MarketingCockpitPage, TextArea, type assistantVariants } from "marketing-hub";
import { useWorkspaceAssistantDemo } from "marketing-hub/demo";

export function DockHost({ variant }: { variant: (typeof assistantVariants)[number] }) {
  const launcher = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  return (
    <AssistantDock
      ref={launcher}
      variant={variant}
      placement="drawer"
      assistant={{
        open,
        prompt,
        title: "Ask AI Interpreter",
        launcherLabel: "AI Interpreter",
        onOpen: ({ reason }) => setOpen(reason === "open"),
        onClose: () => setOpen(false),
        onPromptChange: ({ value }) => setPrompt(value),
      }}
    />
  );
}

export function DemoDock() {
  const { assistant, skillFlow } = useWorkspaceAssistantDemo({ variant: "campaign" });
  return <AssistantDock assistant={assistant} skillFlow={skillFlow} launcherHidden={false} />;
}

export function Parts() {
  const field = React.useRef<HTMLTextAreaElement>(null);
  return (
    <>
      <AssistantLauncher label="Ask" onOpen={({ reason }) => reason} />
      <AssistantPanel open prompt="" onClose={({ reason }) => reason} />
      <TextArea ref={field} name="notes" value="" rows={3} onChange={({ name, value }) => `${name}${value}`} />
      <Button variant="gold" onClick={({ label }) => label}>Go</Button>
    </>
  );
}

export function Rejected() {
  return (
    <>
      {/* @ts-expect-error unknown variant */}
      <AssistantDock variant="nope" />
      {/* @ts-expect-error unknown prop */}
      <AssistantLauncher colour="red" />
      {/* @ts-expect-error rows is a number */}
      <TextArea rows="3" />
      {/* @ts-expect-error assistant.open is a boolean */}
      <AssistantDock assistant={{ open: "yes" }} />
      {/* @ts-expect-error unknown variant */}
      <Button variant="nope">Bad</Button>
      {/* @ts-expect-error an answer is { query, ... } and its variant is an enum */}
      <AssistantDock assistant={{ answers: [{ query: "q", variant: "nope" }] }} />
    </>
  );
}

/* Pages: route params and the active view are typed, not `object`. Checked as
 * property types so a missing required prop cannot satisfy the expect-error. */
type Href = NonNullable<React.ComponentProps<typeof KnowledgeCreatePage>["hrefFor"]>;
type Save = NonNullable<React.ComponentProps<typeof KnowledgeCreatePage>["onSave"]>;
type InterpreterView = NonNullable<React.ComponentProps<typeof AiInterpreterPage>["view"]>;

export const hrefFor: Href = (id, params = {}) => `#${id}?type=${params.type ?? ""}`;
export const onSave: Save = ({ type, mode, values }) => `${type}${mode}${Object.keys(values)}`;
export const view: InterpreterView = { records: [], query: "" };
/* Every member of the union is a closed shape, so a key no view declares is an error. */
// @ts-expect-error no registered view has a `bogus` prop
export const bogusView: InterpreterView = { bogus: 1 };
export const dataModelView: InterpreterView = { domains: [], activeTab: "graph", onSelectDomain: ({ length }: string) => length };

// @ts-expect-error route params are strings
export const badHref: Href = (id: string, params?: { type: number }) => `${id}${params?.type}`;

/* The Cockpit page: the Copilot workspace and the project records are typed. */
type Workspace = NonNullable<React.ComponentProps<typeof MarketingCockpitPage>["workspace"]>;
type Projects = NonNullable<React.ComponentProps<typeof MarketingCockpitPage>["projects"]>;

export const ask: Workspace["onAsk"] = ({ question }) => question.length;
export const projects: Projects = {
  alpha: { title: "Alpha", kicker: "Alt / Alpha", description: "", group: "alt", category: "Alt", image: "", accent: "#000", sourceStrip: [], reports: [{ title: "R", type: "T", description: "", owner: "", cadence: "", updated: "" }] },
};

// @ts-expect-error the Copilot asks with { question }
export const badAsk: Workspace["onAsk"] = ({ query }: { query: string }) => query;
// @ts-expect-error a project needs its reports
export const badProjects: Projects = { alpha: { title: "Alpha" } };
