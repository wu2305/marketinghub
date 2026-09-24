import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomePage } from "../pages/HomePage/index.jsx";
import { useHomeDemo } from "./home-demo.js";
import {
  ASSISTANT,
  ASSISTANT_SKILL_MENU,
  HOME,
  LOGO,
  MODEL_FLOW,
  NAV,
  buildHomeAssistantAnswer,
  buildModelDraft,
} from "../content.js";

/* jsdom has no scrollTo — AssistantPanel's answer-feed effect calls it. */
if (!Element.prototype.scrollTo) Element.prototype.scrollTo = () => {};

function Harness(props) {
  return <HomePage {...useHomeDemo(props)} />;
}

const DEMO = { answerFor: buildHomeAssistantAnswer, modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft };

const baseProps = {
  logo: LOGO,
  navigation: NAV,
  hero: HOME.hero,
  heading: HOME.heading,
  cards: HOME.cards,
  assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU },
  demo: DEMO,
};

function renderHome(props = {}) {
  return render(<Harness {...baseProps} {...props} />);
}

function openAssistant() {
  fireEvent.click(screen.getByRole("button", { name: "Open AI assistant" }));
}

const promptBox = () => screen.getByRole("textbox", { name: "Ask AI Interpreter AI" });
const askButton = () => screen.getByRole("button", { name: "Ask" });
const askForm = () => document.querySelector(".mh-assistant__ask");

function openHistoryAndPickFirst() {
  fireEvent.click(screen.getByRole("button", { name: "History" }));
  const items = document.querySelectorAll(".mh-assistant__history-item");
  fireEvent.click(items[0]);
}

describe("useHomeDemo", () => {
  it("history pick fills the prompt and keeps ASK disabled until typing", () => {
    const onHistorySelect = vi.fn();
    renderHome({ onHistorySelect });
    openAssistant();
    openHistoryAndPickFirst();
    const record = ASSISTANT.history[0];
    expect(promptBox().value).toBe(record.prompt);
    expect(onHistorySelect).toHaveBeenLastCalledWith({ label: record.label, prompt: record.prompt });
    expect(askButton().disabled).toBe(true);
    fireEvent.change(promptBox(), { target: { value: record.prompt + "?" } });
    expect(askButton().disabled).toBe(false);
  });

  it("submit adds the injected answerFor entry for the current scope and clears the prompt", () => {
    const answerFor = vi.fn((text, scope) => buildHomeAssistantAnswer(text, scope));
    const onSubmit = vi.fn();
    renderHome({ scope: "Campaigns", demo: { ...DEMO, answerFor }, onSubmit });
    openAssistant();
    fireEvent.change(promptBox(), { target: { value: "  Why did ROI move?  " } });
    fireEvent.click(askButton());
    expect(answerFor).toHaveBeenLastCalledWith("Why did ROI move?", "Campaigns");
    expect(onSubmit).toHaveBeenCalled();
    expect(promptBox().value).toBe("");
    expect(document.querySelector(".mh-assistant__answer")).toBeTruthy();
    // empty submit adds nothing
    fireEvent.submit(askForm());
    expect(document.querySelectorAll(".mh-assistant__answer").length).toBe(1);
  });

  it("new session clears answer and prompt; close/reopen keeps the answer", () => {
    renderHome();
    openAssistant();
    fireEvent.change(promptBox(), { target: { value: "Why did ROI move?" } });
    fireEvent.click(askButton());
    expect(document.querySelectorAll(".mh-assistant__answer").length).toBe(1);
    // close → reopen keeps the answer
    fireEvent.click(screen.getAllByRole("button", { name: "Close assistant" }).at(-1));
    expect(document.querySelector(".mh-assistant")).toBeNull();
    openAssistant();
    expect(document.querySelectorAll(".mh-assistant__answer").length).toBe(1);
    // new session clears
    fireEvent.click(screen.getByRole("button", { name: "New session" }));
    expect(document.querySelectorAll(".mh-assistant__answer").length).toBe(0);
    expect(promptBox().value).toBe("");
  });

  it("suggestion click fills the prompt", () => {
    renderHome();
    openAssistant();
    const suggestion = ASSISTANT.homeSuggestions[0];
    fireEvent.click(screen.getByRole("button", { name: suggestion.label }));
    expect(promptBox().value).toBe(suggestion.prompt);
    expect(askButton().disabled).toBe(false);
  });

  it("skill action opens the model flow; generate uses modelDraftFor; onFlowSave gets { values }", () => {
    const modelDraftFor = vi.fn(() => ({ name: "ALT MODEL DRAFT", trigger: "t", structure: "s" }));
    const onFlowSave = vi.fn();
    renderHome({ demo: { ...DEMO, modelDraftFor }, onFlowSave });
    openAssistant();
    fireEvent.click(screen.getByRole("button", { name: "Choose AI skill" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Analytical Model/ }));
    fireEvent.click(screen.getByRole("button", { name: /Add from Chat History/ }));
    // history step: thread checkboxes + rule textarea
    expect(document.querySelector(".mh-flow")).toBeTruthy();
    expect(screen.getByText("Generate Analytical Model")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Generate" }));
    expect(modelDraftFor).toHaveBeenCalled();
    expect(screen.getByText("New Analytical Model")).toBeTruthy();
    const nameInput = document.querySelector('.mh-flow input[name="name"]');
    expect(nameInput.value).toBe("ALT MODEL DRAFT");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onFlowSave).toHaveBeenLastCalledWith({ values: expect.objectContaining({ name: "ALT MODEL DRAFT" }) });
    // close removes the dialog
    fireEvent.click(within(document.querySelector(".mh-flow")).getByRole("button", { name: "Close" }));
    expect(document.querySelector(".mh-flow")).toBeNull();
  });

  it("replaced content bundle renders no default demo strings", () => {
    const altHistory = [{ id: "alt-1", title: "ALT history title", label: "ALT history pick", prompt: "ALT PROMPT MARKER" }];
    const answerFor = () => ({ query: "q", kicker: "ALT", title: "ALT ANSWER MARKER", body: "alt body" });
    render(
      <Harness
        {...baseProps}
        assistant={{ ...baseProps.assistant, history: altHistory, homeSuggestions: [{ label: "ALT suggestion", prompt: "ALT SUGGEST PROMPT" }] }}
        demo={{ answerFor, modelFlow: { threads: [{ title: "ALT thread", messages: [{ role: "user", text: "alt msg", checked: true }] }], sections: [{ title: "S", fields: [{ key: "name", label: "Name", required: true }] }] }, modelDraftFor: () => ({ name: "ALT MODEL" }) }}
      />,
    );
    openAssistant();
    // custom suggestion chip renders, default history record does not
    expect(screen.getByRole("button", { name: "ALT suggestion" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    expect(screen.getByText("ALT history pick")).toBeTruthy();
    expect(screen.queryByText(ASSISTANT.history[0].label)).toBeNull();
    fireEvent.click(document.querySelectorAll(".mh-assistant__history-item")[0]);
    expect(promptBox().value).toBe("ALT PROMPT MARKER");
    // submit renders the injected answer only
    fireEvent.change(promptBox(), { target: { value: "alt question" } });
    fireEvent.click(askButton());
    expect(screen.getByText("ALT ANSWER MARKER")).toBeTruthy();
    expect(document.body.textContent).not.toContain("I would connect campaign intent");
  });

  it("two instances keep independent state", () => {
    render(
      <>
        <div data-testid="a">
          <Harness {...baseProps} />
        </div>
        <div data-testid="b">
          <Harness {...baseProps} />
        </div>
      </>,
    );
    const a = within(screen.getByTestId("a"));
    const b = within(screen.getByTestId("b"));
    fireEvent.click(a.getByRole("button", { name: "Open AI assistant" }));
    const aPanel = a.getByRole("dialog");
    fireEvent.click(within(aPanel).getByRole("button", { name: "History" }));
    fireEvent.click(aPanel.querySelectorAll(".mh-assistant__history-item")[0]);
    expect(within(aPanel).getByRole("textbox", { name: "Ask AI Interpreter AI" }).value).toBe(ASSISTANT.history[0].prompt);
    // B never opened its panel
    expect(b.queryByRole("dialog")).toBeNull();
    // answer in A only
    fireEvent.change(within(aPanel).getByRole("textbox", { name: "Ask AI Interpreter AI" }), { target: { value: "typed question" } });
    fireEvent.click(within(aPanel).getByRole("button", { name: "Ask" }));
    expect(aPanel.querySelectorAll(".mh-assistant__answer").length).toBe(1);
    fireEvent.click(b.getByRole("button", { name: "Open AI assistant" }));
    const bPanel = b.getByRole("dialog");
    expect(within(bPanel).getByRole("textbox", { name: "Ask AI Interpreter AI" }).value).toBe("");
    expect(bPanel.querySelectorAll(".mh-assistant__answer").length).toBe(0);
  });
});
