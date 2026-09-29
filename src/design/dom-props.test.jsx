import { composeStories } from "@storybook/react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

// Every story renders without React reporting a prop that reached the DOM by
// mistake (an unknown prop spread onto an element, a ref or object stringified
// into an attribute). Production builds — storybook-static and the host — drop
// these warnings, so this dev-mode render is the only place they surface.
const DOM_PROP_WARNINGS = [
  /React does not recognize the `[^`]+` prop on a DOM element/,
  /Invalid value for prop `[^`]+` on <[^>]+> tag/,
  /Unknown event handler property `[^`]+`/,
  /Received `[^`]+` for a non-boolean attribute/,
  /Invalid attribute name/,
];

const format = (args) => {
  const [first, ...rest] = args;
  if (typeof first !== "string") return args.map(String).join(" ");
  let index = 0;
  return first.replace(/%s/g, () => String(rest[index++]));
};

const storyModules = import.meta.glob(
  ["./components/**/*.stories.jsx", "./features/**/*.stories.jsx", "./pages/**/*.stories.jsx"],
  { eager: true },
);

// Layout APIs jsdom does not implement; stories call them after render.
beforeAll(() => {
  for (const name of ["scrollTo", "scrollIntoView", "scrollBy"]) {
    if (!Element.prototype[name]) Element.prototype[name] = () => {};
  }
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("no props leak onto DOM elements", () => {
  for (const [file, module] of Object.entries(storyModules)) {
    const stories = Object.entries(composeStories(module));
    it(file.replace(/^\.\//, ""), () => {
      const leaks = [];
      vi.spyOn(console, "error").mockImplementation((...args) => {
        const message = format(args);
        if (DOM_PROP_WARNINGS.some((pattern) => pattern.test(message))) leaks.push(message.split("\n")[0]);
      });
      for (const [name, Story] of stories) {
        const before = leaks.length;
        render(<Story />);
        cleanup();
        for (let i = before; i < leaks.length; i += 1) leaks[i] = `${name}: ${leaks[i]}`;
      }
      expect(leaks).toEqual([]);
    });
  }
});
