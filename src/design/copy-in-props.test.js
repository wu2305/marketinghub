/**
 * Visible text and accessible names are copy, and copy comes in through props.
 * A component may keep an English default, but it must be a default of a prop
 * (`label = "Close"`) or a field of a `DEFAULT_COPY`-style constant, never a
 * literal in the JSX tree. A host that wants another language then replaces the
 * prop without forking the component (see Examples/Localized business term).
 *
 * Parses every component, feature, page and lib module and fails on a
 * human-readable string that is rendered directly:
 * - JSX text (`<span>Helpful</span>`);
 * - a string or template literal in a JSX child expression (`{ok ? "Copied!" : "Copy"}`);
 * - a literal value for an attribute that is read out or shown (`aria-label`,
 *   `title`, `placeholder`, `alt`, `label`, `ariaLabel`).
 * `copy.x || "English"` is a prop with a default and passes; so do calls
 * (`cx(...)`), arrays and object values, where class names and data keys live.
 *
 * Fix a hit by moving the text into a prop default or a copy object. Do not
 * add exemptions; the list below holds only strings that are not copy.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const acorn = require("acorn");
const jsx = require("acorn-jsx");
const Parser = acorn.Parser.extend(jsx());

const ROOT = path.resolve(__dirname);
const LAYERS = ["components", "features", "pages", "lib"];
const SKIP = /(\.stories\.jsx|\.test\.jsx?)$/;
const COPY_ATTRIBUTES = new Set(["aria-label", "aria-description", "aria-roledescription", "title", "placeholder", "alt", "label", "ariaLabel"]);
const LETTERS = /[A-Za-z]{2,}/;

/** Strings that read as words but are not copy. Keep empty; explain any entry. */
const NOT_COPY = new Set([]);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.jsx$/.test(entry.name) && !SKIP.test(entry.name)) yield full;
  }
}

/** `copy.title`, `drawer.states?.open`, `label`: a read the caller can supply. */
function isPropRead(node) {
  if (node.type === "ChainExpression") return isPropRead(node.expression);
  if (node.type === "LogicalExpression" && node.operator !== "&&") return isPropRead(node.left) && isPropRead(node.right);
  return node.type === "Identifier" || (node.type === "MemberExpression" && isPropRead(node.object));
}

/** Strings a child or attribute expression can render, following only the shapes that pass text through. */
function stringsOf(node, found = []) {
  if (!node) return found;
  switch (node.type) {
    case "Literal":
      if (typeof node.value === "string") found.push(node.value);
      break;
    case "TemplateLiteral":
      node.quasis.forEach((quasi) => found.push(quasi.value.cooked));
      node.expressions.forEach((expression) => stringsOf(expression, found));
      break;
    case "ConditionalExpression":
      stringsOf(node.consequent, found);
      stringsOf(node.alternate, found);
      break;
    case "LogicalExpression":
      /* `strings.close || "Close"` is a prop with a default; only a literal on its own is hard-coded. */
      if (!(node.operator !== "&&" && isPropRead(node.left))) stringsOf(node.right, found);
      if (node.operator !== "&&") stringsOf(node.left, found);
      break;
    case "BinaryExpression":
      if (node.operator === "+") {
        stringsOf(node.left, found);
        stringsOf(node.right, found);
      }
      break;
    default:
  }
  return found;
}

function visit(node, onNode, parent = null) {
  if (!node || typeof node.type !== "string") return;
  onNode(node, parent);
  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "start" || key === "end") continue;
    const value = node[key];
    if (Array.isArray(value)) value.forEach((child) => visit(child, onNode, node));
    else if (value && typeof value.type === "string") visit(value, onNode, node);
  }
}

export function findHardCodedCopy(source) {
  const tree = Parser.parse(source, { ecmaVersion: "latest", sourceType: "module", locations: true });
  const hits = [];
  const add = (kind, text, node) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (LETTERS.test(clean) && !NOT_COPY.has(clean)) hits.push(`${kind} "${clean}" (line ${node.loc.start.line})`);
  };
  visit(tree, (node, parent) => {
    if (node.type === "JSXText") add("text", node.value, node);
    else if (node.type === "JSXExpressionContainer" && (parent?.type === "JSXElement" || parent?.type === "JSXFragment")) stringsOf(node.expression).forEach((text) => add("child", text, node));
    else if (node.type === "JSXAttribute" && COPY_ATTRIBUTES.has(node.name?.name)) {
      const value = node.value?.type === "JSXExpressionContainer" ? node.value.expression : node.value;
      stringsOf(value).forEach((text) => add(node.name.name, text, node));
    }
  });
  return hits;
}

describe("component copy comes in through props", () => {
  it("finds JSX text, rendered literals and literal accessible names", () => {
    const hits = findHardCodedCopy([
      "export const A = ({ ok }) => <div title=\"Tip\" aria-label={`Row ${1}`}>",
      "  <span>Helpful</span>{ok ? \"Copied!\" : \"Copy\"}<b className=\"mh-x\" data-kind=\"copy\">{\"×\"}</b>",
      "</div>;",
    ].join("\n"));
    expect(hits).toEqual([
      "title \"Tip\" (line 1)",
      "aria-label \"Row\" (line 1)",
      "text \"Helpful\" (line 2)",
      "child \"Copied!\" (line 2)",
      "child \"Copy\" (line 2)",
    ]);
  });

  it("ignores class names, symbols and prop defaults", () => {
    expect(findHardCodedCopy("export const A = ({ label = \"Close\" }) => <button className=\"mh-btn\" aria-label={label}>×</button>;")).toEqual([]);
  });

  it("has no hard-coded text in components, features, pages or lib", () => {
    const found = [];
    for (const layer of LAYERS) {
      for (const file of walk(path.join(ROOT, layer))) {
        const hits = findHardCodedCopy(fs.readFileSync(file, "utf8"));
        if (hits.length) found.push(`${path.relative(ROOT, file)}: ${hits.join("; ")}`);
      }
    }
    expect(found).toEqual([]);
  });
});
