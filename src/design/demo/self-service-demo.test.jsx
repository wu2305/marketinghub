import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ASSISTANT_SKILL_MENU, MODEL_FLOW, SELF_SERVICE } from "../content.js";
import { SelfServicePage } from "../pages/SelfServicePage/index.jsx";
import { useSelfServiceDemo } from "./self-service-demo.js";

Element.prototype.scrollTo ??= () => {};

function Harness(props) {
  return <SelfServicePage {...useSelfServiceDemo(props)} />;
}

function renderPage(overrides = {}) {
  return render(<Harness {...SELF_SERVICE} assistant={{ ...SELF_SERVICE.assistant, skillMenu: ASSISTANT_SKILL_MENU }} demo={{ modelFlow: MODEL_FLOW }} {...overrides} />);
}

const open = () => fireEvent.click(screen.getByRole("button", { name: "Open AI assistant" }));
const prompt = () => screen.getByRole("textbox", { name: "Ask AI Interpreter AI" });
const ask = () => screen.getByRole("button", { name: "Ask" });

describe("Self-Service assistant demo", () => {
  it("opens from the launcher, auto-submits a report suggestion, and replaces the answer on submit", () => {
    const answerFor = vi.fn((query) => ({ query, variant: "workspace", banner: "ALT Response", context: "ALT Reports", body: "ALT analysis", findings: [], sources: ["ALT source"] }));
    const onSuggestion = vi.fn();
    renderPage({ assistant: { ...SELF_SERVICE.assistant, skillMenu: ASSISTANT_SKILL_MENU, onSuggestion }, demo: { answerFor } });
    open();
    expect(screen.getByRole("dialog", { name: "Ask AI Interpreter" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: SELF_SERVICE.assistant.suggestions[0].label }));
    expect(onSuggestion).toHaveBeenCalledWith({ prompt: SELF_SERVICE.assistant.suggestions[0].prompt });
    expect(answerFor).toHaveBeenCalledWith(SELF_SERVICE.assistant.suggestions[0].prompt);
    expect(screen.getByText("ALT analysis")).toBeTruthy();
    expect(prompt().value).toBe("");
    fireEvent.change(prompt(), { target: { value: "Second question" } });
    fireEvent.keyDown(prompt(), { key: "Enter" });
    expect(answerFor).toHaveBeenCalledTimes(1);
    fireEvent.click(ask());
    expect(answerFor).toHaveBeenLastCalledWith("Second question");
    expect(document.querySelectorAll(".mh-assistant__answer")).toHaveLength(1);
    expect(screen.getByText("Second question")).toBeTruthy();
  });

  it("history only fills the composer; close/reopen preserves answer; new session clears it", () => {
    renderPage();
    open();
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    fireEvent.click(document.querySelector(".mh-assistant__history-item"));
    expect(prompt().value).toBe(SELF_SERVICE.assistant.history[0].prompt);
    expect(document.querySelector(".mh-assistant__answer")).toBeNull();
    fireEvent.click(ask());
    expect(screen.getByText("Media Monitoring")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Close assistant" }).at(-1));
    open();
    expect(screen.getByText("Media Monitoring")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "New session" }));
    expect(document.querySelector(".mh-assistant__answer")).toBeNull();
    expect(prompt().value).toBe("");
  });

  it("skill menu opens manual model flow and file attachment reports names", () => {
    const onAttach = vi.fn();
    renderPage({ assistant: { ...SELF_SERVICE.assistant, skillMenu: ASSISTANT_SKILL_MENU, onAttach }, demo: { modelFlow: MODEL_FLOW } });
    open();
    fireEvent.click(screen.getByRole("button", { name: "Choose AI skill" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Analytical Model/ }));
    fireEvent.click(screen.getByRole("button", { name: /Create Analytical Model Manually/ }));
    expect(document.querySelector(".mh-flow")).toBeTruthy();
    expect(within(document.querySelector(".mh-flow")).getByText("Create Analytical Model Manually")).toBeTruthy();
    fireEvent.click(within(document.querySelector(".mh-flow")).getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: "Choose AI skill" }));
    const fileInput = document.querySelector('.mh-ai-skill-menu input[type="file"]') || document.querySelector('.mh-assistant input[type="file"]');
    expect(fileInput).toBeTruthy();
    fireEvent.change(fileInput, { target: { files: [new File(["x"], "report.csv", { type: "text/csv" })] } });
    expect(onAttach).toHaveBeenCalledWith({ names: ["report.csv"] });
  });

  it("keeps two host instances with different content independent", () => {
    const { container } = render(
      <>
        <div data-instance="a"><Harness {...SELF_SERVICE} assistant={{ ...SELF_SERVICE.assistant, title: "Report helper A" }} demo={{ answerFor: (query) => ({ query, variant: "compact", body: "Only A answer", sources: [] }) }} /></div>
        <div data-instance="b"><Harness {...SELF_SERVICE} assistant={{ ...SELF_SERVICE.assistant, title: "Report helper B" }} demo={{ answerFor: (query) => ({ query, variant: "compact", body: "Only B answer", sources: [] }) }} /></div>
      </>,
    );
    const a = within(container.querySelector('[data-instance="a"]'));
    const b = within(container.querySelector('[data-instance="b"]'));
    fireEvent.click(a.getByRole("button", { name: "Open AI assistant" }));
    fireEvent.change(a.getByRole("textbox", { name: "Ask AI Interpreter AI" }), { target: { value: "A question" } });
    fireEvent.click(a.getByRole("button", { name: "Ask" }));
    expect(a.getByText("Only A answer")).toBeTruthy();
    fireEvent.click(b.getByRole("button", { name: "Open AI assistant" }));
    expect(b.queryByText("Only A answer")).toBeNull();
    fireEvent.change(b.getByRole("textbox", { name: "Ask AI Interpreter AI" }), { target: { value: "B question" } });
    fireEvent.click(b.getByRole("button", { name: "Ask" }));
    expect(b.getByText("Only B answer")).toBeTruthy();
    expect(a.queryByText("Only B answer")).toBeNull();
  });

  it("uses replacement content and answer callback after a host rerender", () => {
    const firstAnswer = vi.fn((query) => ({ query, variant: "compact", body: "First injected answer", sources: [] }));
    const replacementAnswer = vi.fn((query) => ({ query, variant: "compact", body: "Replacement answer", sources: [] }));
    const base = { ...SELF_SERVICE, assistant: { ...SELF_SERVICE.assistant, title: "First helper", skillMenu: ASSISTANT_SKILL_MENU }, demo: { answerFor: firstAnswer } };
    const view = render(<Harness {...base} />);
    open();
    fireEvent.change(prompt(), { target: { value: "First query" } });
    fireEvent.click(ask());
    expect(screen.getByText("First injected answer")).toBeTruthy();

    view.rerender(<Harness {...base} assistant={{ ...base.assistant, title: "Replacement helper", suggestions: [{ label: "Replacement suggestion", prompt: "Replacement question" }] }} demo={{ answerFor: replacementAnswer }} />);
    expect(screen.getByText("Replacement helper")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Replacement suggestion" })).toBeTruthy();
    fireEvent.change(prompt(), { target: { value: "Second query" } });
    fireEvent.click(ask());
    expect(replacementAnswer).toHaveBeenCalledWith("Second query");
    expect(firstAnswer).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Replacement answer")).toBeTruthy();
    expect(screen.queryByText("First injected answer")).toBeNull();
  });
});
