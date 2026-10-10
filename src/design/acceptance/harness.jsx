import React from "react";
import { composeStories } from "@storybook/react";
import { cleanup, render } from "@testing-library/react";

// Layout APIs jsdom lacks; stories call them after render.
for (const name of ["scrollTo", "scrollIntoView", "scrollBy"]) {
  if (!Element.prototype[name]) Element.prototype[name] = () => {};
}
import { retiredPages } from "../../../.storybook/retired-pages.js";

const modules = import.meta.glob(
  [
    "../*.stories.jsx",
    "../components/**/*.stories.jsx",
    "../features/**/*.stories.jsx",
    "../pages/**/*.stories.jsx",
    "../../../examples/consumer/*.stories.tsx",
  ],
  { eager: true },
);

const isRetired = (file) => retiredPages.some((page) => file.includes(`/pages/${page}/`));

/**
 * Every story Storybook shows (retired pages are skipped, as in
 * `.storybook/main.js`), composed so it renders outside the Storybook UI.
 * @returns {Array<{ file: string, title: string, name: string, key: string, Story: any, isPage: boolean }>}
 */
export function loadStories() {
  return Object.entries(modules)
    .filter(([file]) => !isRetired(file))
    .flatMap(([file, module]) =>
      Object.entries(composeStories(module)).map(([exportName, Story]) => ({
        file: file.replace(/^\.\.\//, ""),
        title: module.default.title,
        name: Story.storyName ?? exportName,
        key: `${file.replace(/^\.\.\//, "")}#${exportName}`,
        Story,
        isPage: module.default.title === "Pages",
      })),
    );
}

/* ---------------- running a story ---------------- */

const format = ([first, ...rest]) => {
  if (typeof first !== "string") return [first, ...rest].map(String).join(" ");
  let index = 0;
  return first.replace(/%s/g, () => String(rest[index++]));
};

const isDomObject = (value) =>
  typeof Node !== "undefined" && (value instanceof Node || value instanceof Event || Boolean(value?.nativeEvent));

/* Callbacks documented as passing the native event through: TextArea hands its
   keydown to the host so Enter can submit and Shift+Enter can add a line. */
const NATIVE_EVENT_CALLBACKS = new Set(["onKeyDown"]);

/** Callback payloads are plain data (AGENTS 3.1), never a DOM event or node. */
function payloadLeaks(calls) {
  return calls.filter(({ name }) => !NATIVE_EVENT_CALLBACKS.has(name)).flatMap(({ name, args }) =>
    args.filter(isDomObject).map(() => ({ rule: "callback-payload", target: name, detail: `${name} was called with a DOM event or node` })),
  );
}

/**
 * Mount a story the way a host would: its own args, optional overrides, every
 * callback recorded, links swallowed (a host routes them), and anything React
 * or the page reports as an error collected instead of thrown away.
 * Call `run.stop()` when done; it unmounts and restores the environment.
 */
export function mountStory(story, overrides = {}) {
  const { Story } = story;
  const errors = [];
  const calls = [];
  const onWindowError = (event) => {
    errors.push(`uncaught: ${event.error?.message ?? event.message}`);
    event.preventDefault();
  };
  const originalError = console.error;
  console.error = (...args) => {
    const message = format(args).split("\n")[0].slice(0, 200);
    // Timers inside demo hooks (a flash then close) fire after the test's own act scope.
    if (!/not wrapped in act/.test(message)) errors.push(`console.error: ${message}`);
  };
  const swallowLinks = (event) => event.target.closest?.("a[href]") && event.preventDefault();
  window.addEventListener("error", onWindowError);
  document.addEventListener("click", swallowLinks);

  const base = { ...Story.args, ...overrides };
  const argTypes = Story.argTypes || {};
  const callbackNames = new Set([
    ...Object.keys(argTypes).filter((name) => argTypes[name].action || /^on[A-Z]/.test(name)),
    ...Object.keys(base).filter((name) => /^on[A-Z]/.test(name) && typeof base[name] === "function"),
  ]);
  const callbacks = Object.fromEntries(
    [...callbackNames].map((name) => [
      name,
      (...args) => {
        calls.push({ name, args });
        return typeof base[name] === "function" ? base[name](...args) : undefined;
      },
    ]),
  );

  let result;
  try {
    result = render(<Story {...callbacks} {...overrides} />);
  } catch (error) {
    errors.push(`render threw: ${error.message}`);
  }

  return {
    story,
    get container() { return result?.container ?? document.body; },
    rerender: (next) => result.rerender(<Story {...callbacks} {...overrides} {...next} />),
    calls,
    errors,
    /** Problems the page itself reported plus callback payload leaks. */
    problems: () => [...errors.map((detail) => ({ rule: "runtime", target: "page", detail })), ...payloadLeaks(calls)],
    stop() {
      cleanup();
      console.error = originalError;
      window.removeEventListener("error", onWindowError);
      document.removeEventListener("click", swallowLinks);
    },
  };
}
