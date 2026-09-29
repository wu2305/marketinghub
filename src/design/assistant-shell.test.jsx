import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { composeStories } from "@storybook/react";
import * as dockStories from "./components/AssistantDock/AssistantDock.stories.jsx";
import { AssistantDock, AssistantPanel, ReportCopilot, assistantAnswerVariants, assistantVariants } from "./index.js";

window.HTMLElement.prototype.scrollTo ??= () => {};

describe("assistant variants and shared shell", () => {
  it("exposes only the four real page presets and four answer shapes", () => {
    expect(assistantVariants).toEqual(["home", "cockpit", "campaign", "lite"]);
    expect(assistantAnswerVariants).toEqual(["default", "compact", "workspace", "simple"]);
  });

  it.each([
    ["home", true, true, false],
    ["cockpit", false, false, true],
    ["campaign", false, false, false],
    ["lite", false, true, false],
  ])("%s maps submit, maximize copy, and answer-stage behavior", (variant, enterSubmits, shortMaximize, stageHidden) => {
    const onSubmit = vi.fn();
    const { container } = render(
      <AssistantPanel open variant={variant} title="Panel" prompt="Question" answers={[{ query: "Q", title: "A", body: "Body" }]} onSubmit={onSubmit} />,
    );
    const input = container.querySelector("textarea");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledTimes(enterSubmits ? 1 : 0);
    expect(container.querySelector(".mh-assistant__stage") === null).toBe(stageHidden);
    expect(within(container).getByLabelText(shortMaximize ? "Maximize" : "Maximize AI Interpreter panel")).toBeTruthy();
  });

  it("renders simple answers without feedback and uses shared history actions to return focus", () => {
    const onHistorySelect = vi.fn();
    const { container } = render(
      <AssistantPanel open variant="lite" prompt="" answers={[{ query: "Q", variant: "simple", lead: "Answer:" }]} history={[{ id: "q", label: "Previous question", prompt: "Previous question" }]} onHistorySelect={onHistorySelect} />,
    );
    expect(container.querySelector(".mh-assistant__answer--simple")).toBeTruthy();
    expect(container.querySelector(".mh-assistant__feedback")).toBeNull();
    fireEvent.click(screen.getByLabelText("History"));
    fireEvent.click(container.querySelector(".mh-assistant__history-item"));
    expect(onHistorySelect).toHaveBeenCalledWith({ label: "Previous question", prompt: "Previous question" });
    expect(document.activeElement).toBe(container.querySelector("textarea"));
  });

  it("keeps two copilot histories and maximize states independent without a global body class", () => {
    const common = { open: true, stream: false, summary: { title: "Summary", paragraphs: [] }, recommendations: [], history: [{ title: "Saved", prompt: "Why?" }] };
    const { container } = render(<><ReportCopilot {...common} title="First" /><ReportCopilot {...common} title="Second" /></>);
    const [first, second] = container.querySelectorAll(".mh-copilot");
    fireEvent.click(within(first).getByLabelText("History"));
    expect(first.querySelector(".mh-copilot__history")).toBeTruthy();
    expect(second.querySelector(".mh-copilot__history")).toBeNull();
    fireEvent.click(within(first).getByLabelText("Maximize"));
    expect(first.classList.contains("mh-copilot--expanded")).toBe(true);
    expect(second.classList.contains("mh-copilot--expanded")).toBe(false);
    expect(document.body.classList.contains("ai-workspace-expanded")).toBe(false);
  });

  it("closes history when either assistant closes and is reopened from its launcher", () => {
    function Host() {
      const [panelOpen, setPanelOpen] = React.useState(false);
      const [reportOpen, setReportOpen] = React.useState(true);
      return <>
        <button type="button" onClick={() => setReportOpen(true)}>Open report</button>
        <button type="button" onClick={() => setPanelOpen(true)}>Open panel</button>
        <ReportCopilot open={reportOpen} title="Report" summary={{ title: "Summary", paragraphs: [] }} recommendations={[]} history={[{ title: "Saved", prompt: "Why?" }]} onClose={() => setReportOpen(false)} />
        <AssistantPanel open={panelOpen} title="Panel" history={[{ label: "Saved panel", prompt: "Why?" }]} onClose={() => setPanelOpen(false)} />
      </>;
    }
    render(<Host />);
    fireEvent.click(within(document.querySelector(".mh-copilot")).getByLabelText("History"));
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByText("Open report"));
    expect(document.querySelector(".mh-copilot__history")).toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByText("Open panel"));
    fireEvent.click(within(document.querySelector(".mh-assistant")).getByLabelText("History"));
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByText("Open panel"));
    expect(document.querySelector(".mh-assistant__history-pop")).toBeNull();
  });
});

describe("AssistantDock", () => {
  it("shows only the launcher until opened, then the panel with the chosen variant", () => {
    const onOpen = vi.fn();
    const { rerender, container } = render(<AssistantDock assistant={{ launcherLabel: "Ask me", onOpen }} variant="lite" />);
    const launcher = screen.getByLabelText("Open AI assistant");
    expect(launcher.textContent).toContain("Ask me");
    expect(container.querySelector(".mh-assistant")).toBeNull();
    fireEvent.click(launcher);
    expect(onOpen).toHaveBeenCalledWith({ reason: "open" });
    rerender(<AssistantDock assistant={{ open: true, launcherLabel: "Ask me", onOpen }} variant="lite" />);
    expect(screen.getByLabelText("Open AI assistant").hidden).toBe(true);
    expect(container.querySelector(".mh-assistant--drawer")).toBeTruthy();
    expect(within(container).getByLabelText("Maximize")).toBeTruthy();
  });

  it("lets a page reroute the launcher, hide it for another overlay, and read its ref", () => {
    const onOpen = vi.fn();
    const onLauncherOpen = vi.fn();
    const ref = React.createRef();
    const { rerender } = render(<AssistantDock ref={ref} assistant={{ onOpen }} onLauncherOpen={onLauncherOpen} />);
    expect(ref.current).toBe(screen.getByLabelText("Open AI assistant"));
    fireEvent.click(ref.current);
    expect(onLauncherOpen).toHaveBeenCalledWith({ reason: "open" });
    expect(onOpen).not.toHaveBeenCalled();
    rerender(<AssistantDock ref={ref} assistant={{ onOpen }} launcherHidden />);
    expect(ref.current.hidden).toBe(true);
  });

  it("renders the model-flow dialog only while its step is set", () => {
    const flow = { step: "manual", threads: [], sections: [], draft: {} };
    const { rerender } = render(<AssistantDock assistant={{ open: true }} skillFlow={flow} />);
    expect(screen.getAllByRole("dialog").length).toBe(2);
    rerender(<AssistantDock assistant={{ open: true }} skillFlow={{ ...flow, step: undefined }} />);
    expect(screen.getAllByRole("dialog").length).toBe(1);
  });
});

describe("AssistantDock stories", () => {
  const { Closed, CustomLauncherLabel } = composeStories(dockStories);

  it.each([["Closed", Closed], ["CustomLauncherLabel", CustomLauncherLabel]])(
    "%s opens the panel from the launcher even when the Actions panel supplies onLauncherOpen",
    (_name, Story) => {
      const onLauncherOpen = vi.fn();
      const { container } = render(<Story onLauncherOpen={onLauncherOpen} />);
      expect(container.querySelector(".mh-assistant")).toBeNull();
      fireEvent.click(screen.getByLabelText("Open AI assistant"));
      expect(onLauncherOpen).toHaveBeenCalledWith({ reason: "open" });
      expect(container.querySelector(".mh-assistant--drawer")).toBeTruthy();
    },
  );
});
