/* Every demo under examples/demos renders, and every page in its navigation
 * opens. The template is included, so a change to the design system that breaks
 * the starting point fails here before a designer hits it. */
import React from "react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const dir = path.dirname(fileURLToPath(import.meta.url));
const apps = import.meta.glob("./*/App.jsx", { eager: true });

const go = async (hash) => {
  await act(async () => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
};

beforeEach(() => {
  window.scrollTo = () => {};
  window.location.hash = "";
});
afterEach(cleanup);

describe.each(Object.entries(apps))("%s", (_file, { App }) => {
  it("renders the start page with a navigation", () => {
    const { container } = render(<App />);
    expect(container.querySelector("h1")?.textContent).toBeTruthy();
    expect(container.querySelectorAll("nav a[href^='#/']").length).toBeGreaterThan(0);
  });

  it("opens every page of its navigation and starts fresh on each", async () => {
    const { container } = render(<App />);
    const hrefs = [...new Set([...container.querySelectorAll("nav a[href^='#/']")].map((a) => a.getAttribute("href")))];
    for (const href of hrefs) {
      await go(href);
      expect(container.querySelector("h1")?.textContent, href).toBeTruthy();
      expect(container.textContent, href).not.toContain("not part of this demo");
    }
  });

  it("says so, with a way back, for a page it does not include", async () => {
    const { container, getByText } = render(<App />);
    await go("#/no-such-page");
    expect(container.querySelector("h1")?.textContent).toMatch(/not part of this demo/);
    expect(getByText("Back to the start").getAttribute("href")).toBe("#/home");
  });

  it("maps a link to an original demo page onto a route of this demo", async () => {
    /* The product's sample content still carries such links (for example the Cockpit's report pills). */
    const { container } = render(<App />);
    const link = document.createElement("a");
    link.href = "/assets/pages/reports.html?project=city";
    container.append(link);
    await act(async () => link.click());
    expect(window.location.hash).toBe("#/cockpit?project=city");
  });
});

/* Demos build on the public entries only (AGENTS §2.2: no original markup or scripts). */
describe("demo import boundary", () => {
  const files = [];
  const walk = (folder) => {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const full = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(jsx?|tsx?|mjs)$/.test(entry.name) && !/\.test\./.test(entry.name) && entry.name !== "vite.config.mjs") files.push(full);
    }
  };
  walk(dir);

  it.each(files.map((file) => path.relative(dir, file)))("%s imports only public entries", (name) => {
    const text = fs.readFileSync(path.join(dir, name), "utf8");
    const specifiers = [...text.matchAll(/(?:\bfrom|\bimport)\s*["']([^"']+)["']/g)].map((match) => match[1]);
    const problems = specifiers.filter((spec) => {
      if (["react", "react-dom/client", "marketing-hub", "marketing-hub/demo"].includes(spec)) return false;
      if (!spec.startsWith(".")) return true;
      return path.relative(dir, path.resolve(path.dirname(path.join(dir, name)), spec)).startsWith("..");
    });
    expect(problems).toEqual([]);
    expect(text).not.toMatch(/dangerouslySetInnerHTML|<iframe|assets\/js\//);
  });
});
