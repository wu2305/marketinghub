/* TypeScript consumer of the built package, compiled by scripts/build-library.mjs
 * against dist/types. It proves the published declarations accept real usage
 * and still reject wrong usage (each @ts-expect-error must stay an error).
 * Not bundled or run; type-checked only. */
import React from "react";
import { AssistantDock, AssistantLauncher, AssistantPanel, Button, TextArea, type assistantVariants } from "marketing-hub";
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
    </>
  );
}
