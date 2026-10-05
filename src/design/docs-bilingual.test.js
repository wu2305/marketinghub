/**
 * Storybook docs are bilingual (English + 中文). Every documentation string a
 * story writes — the component description, each argTypes description and any
 * per-story docs description — must contain Chinese text, which is what
 * `bi(en, zh)` from lib/story-helpers.js produces. Rendered UI copy and story
 * args stay English: this guards the docs only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { bi } from "./lib/story-helpers.js";

const storyModules = {
  ...import.meta.glob("./**/*.stories.jsx", { eager: true }),
  ...import.meta.glob("../../examples/consumer/*.stories.tsx", { eager: true }),
};
const hasChinese = (text) => /[一-鿿]/.test(text);
const pagesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "pages");

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

/** Same split as `.storybook/PageInterface.jsx`: English then ` // ` then 中文. */
function pageParamRows(source, name) {
  const comment = [...source.matchAll(/\/\*\*([\s\S]*?)\*\//g)].find((match) =>
    new RegExp(`^\\s*export function\\s+${name}\\b`).test(source.slice(match.index + match[0].length)));
  if (!comment) return [];
  const text = comment[1].split("\n").map((line) => line.replace(/^\s*\* ?/, "")).join("\n");
  const rows = [];
  for (const entry of text.split(/(?=^@param\b)/m).filter((part) => part.startsWith("@param"))) {
    let rest = entry.slice(6).trim();
    let depth = 0;
    let end = -1;
    for (let i = 0; i < rest.length; i += 1) {
      if (rest[i] === "{") depth += 1;
      if (rest[i] === "}" && --depth === 0) { end = i; break; }
    }
    if (rest[0] !== "{" || end < 0) continue;
    rest = rest.slice(end + 1).trim();
    const optional = rest.startsWith("[");
    end = rest.search(/\s/);
    if (optional) {
      depth = 0;
      for (let i = 0; i < rest.length; i += 1) {
        if (rest[i] === "[") depth += 1;
        if (rest[i] === "]" && --depth === 0) { end = i + 1; break; }
      }
    }
    if (end < 0) end = rest.length;
    const declaration = rest.slice(0, end).replace(/^\[|\]$/g, "");
    const separator = declaration.indexOf("=");
    const parameter = separator < 0 ? declaration : declaration.slice(0, separator);
    if (parameter === "props" || !parameter.startsWith("props.")) continue;
    rows.push({
      name: parameter.slice(6),
      description: rest.slice(end).split(/\n@/)[0].trim().replace(/\s+/g, " "),
    });
  }
  return rows;
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

  it("every page JSDoc @param props.* row has English // 中文", () => {
    let checked = 0;
    const missing = [];
    for (const dir of fs.readdirSync(pagesDir)) {
      const file = path.join(pagesDir, dir, "index.jsx");
      if (!fs.existsSync(file)) continue;
      const source = fs.readFileSync(file, "utf8");
      const exportName = source.match(/export function (\w+)/)?.[1];
      if (!exportName) continue;
      for (const row of pageParamRows(source, exportName)) {
        checked += 1;
        const parts = row.description.split(" // ");
        if (parts.length < 2 || !hasChinese(parts.slice(1).join(" // "))) {
          missing.push(`${exportName} @param props.${row.name}`);
        }
      }
    }
    expect(checked).toBeGreaterThan(50);
    expect(missing, `add English // 中文 to these @param rows:\n${missing.join("\n")}`).toEqual([]);
  });
});
