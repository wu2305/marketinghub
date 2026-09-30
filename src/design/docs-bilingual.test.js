/**
 * Storybook docs are bilingual (English + 中文). Every documentation string a
 * story writes — the component description, each argTypes description and any
 * per-story docs description — must contain Chinese text, which is what
 * `bi(en, zh)` from lib/story-helpers.js produces. Rendered UI copy and story
 * args stay English: this guards the docs only.
 */
import { describe, expect, it } from "vitest";
import { bi } from "./lib/story-helpers.js";

const storyModules = import.meta.glob("./**/*.stories.jsx", { eager: true });
const hasChinese = (text) => /[一-鿿]/.test(text);

function docsStrings(module) {
  const out = [];
  const meta = module.default ?? {};
  const component = meta.parameters?.docs?.description?.component;
  if (component !== undefined) out.push([`${meta.title} docs.description.component`, component]);
  for (const [arg, argType] of Object.entries(meta.argTypes ?? {})) {
    if (typeof argType?.description === "string") out.push([`${meta.title} argTypes.${arg}`, argType.description]);
  }
  for (const [name, story] of Object.entries(module)) {
    if (name === "default" || !story || typeof story !== "object") continue;
    const text = story.parameters?.docs?.description?.story;
    if (text !== undefined) out.push([`${meta.title} ${name} docs.description.story`, text]);
    for (const [arg, argType] of Object.entries(story.argTypes ?? {})) {
      if (typeof argType?.description === "string") out.push([`${meta.title} ${name} argTypes.${arg}`, argType.description]);
    }
  }
  return out;
}

describe("bilingual Storybook docs", () => {
  it("bi() puts English first and Chinese in a second paragraph", () => {
    expect(bi("Hello.", "你好。")).toBe("Hello.\n\n你好。");
  });

  it("every story documentation string carries Chinese text", () => {
    let checked = 0;
    const missing = [];
    for (const module of Object.values(storyModules)) {
      for (const [where, text] of docsStrings(module)) {
        checked += 1;
        if (!hasChinese(text)) missing.push(where);
      }
    }
    expect(checked).toBeGreaterThan(400);
    expect(missing, `wrap these descriptions in bi(en, zh):\n${missing.join("\n")}`).toEqual([]);
  });
});
