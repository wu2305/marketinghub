#!/usr/bin/env node
/**
 * Customer demo sites built from the design system's public exports.
 *
 *   npm run demo list
 *   npm run demo new <name>      copy examples/demos/_template to examples/demos/<name>
 *   npm run demo dev <name>      live preview at http://127.0.0.1:5180
 *   npm run demo build <name>    demo-dist/<name>/index.html, one self-contained file
 *
 * Guide: handover/customer-demos/README.md
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DEMOS = path.join(ROOT, "examples", "demos");
const viteBin = path.join(ROOT, "node_modules", "vite", "bin", "vite.js");

const usage = () => {
  console.error("usage: npm run demo <list | new <name> | dev <name> | build <name>>");
  process.exit(2);
};
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

export const demoNames = () =>
  readdirSync(DEMOS, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort();

function requireDemo(name) {
  if (!name) usage();
  if (!existsSync(path.join(DEMOS, name, "index.html"))) {
    fail(`No demo called "${name}". Existing demos: ${demoNames().join(", ") || "(none)"}. Create one with: npm run demo new ${name}`);
  }
}

function runVite(args, name) {
  if (!existsSync(viteBin)) fail("vite is not installed; run `npm ci` first");
  const result = spawnSync(process.execPath, [viteBin, ...args, "--config", path.join("examples", "demos", "vite.config.mjs")], {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, MH_DEMO: name },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

/** Put the built script and stylesheet into index.html so the page needs no other file. */
export function inlineBuild(dir) {
  const htmlPath = path.join(dir, "index.html");
  let html = readFileSync(htmlPath, "utf8");
  const read = (href) => readFileSync(path.join(dir, href.replace(/^\.\//, "")), "utf8");
  html = html.replace(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>/g, (_tag, href) => `<style>${read(href)}</style>`);
  /* The script goes at the end of <body>: a module script is deferred, but inline ones are not. */
  let script = "";
  html = html.replace(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g, (_tag, src) => {
    script += read(src).replace(/<\/script/gi, "<\\/script");
    return "";
  });
  if (!script) fail("build produced no script to inline");
  html = html.replace("</body>", () => `<script type="module">${script}</script>\n</body>`);
  writeFileSync(htmlPath, html);
  return htmlPath;
}

const [command, name] = process.argv.slice(2);
if (process.argv[1] === import.meta.filename) {
  if (command === "list") {
    console.log(demoNames().join("\n") || "(no demos yet; create one with: npm run demo new <name>)");
  } else if (command === "new") {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(name || "")) fail("Name the demo with lowercase letters, digits and dashes, e.g. `npm run demo new acme-retail`");
    const dest = path.join(DEMOS, name);
    if (existsSync(dest)) fail(`examples/demos/${name} already exists`);
    cpSync(path.join(DEMOS, "_template"), dest, { recursive: true });
    const indexPath = path.join(dest, "index.html");
    const title = name.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
    writeFileSync(indexPath, readFileSync(indexPath, "utf8").replace("__TITLE__", `${title} demo`));
    console.log(`Created examples/demos/${name}. Preview it with: npm run demo dev ${name}`);
  } else if (command === "dev") {
    requireDemo(name);
    runVite(["--open"], name);
  } else if (command === "build") {
    requireDemo(name);
    runVite(["build"], name);
    const file = inlineBuild(path.join(ROOT, "demo-dist", name));
    console.log(`\nDemo ready: ${path.relative(ROOT, file)} (${(statSync(file).size / 1e6).toFixed(1)} MB, a single file)`);
  } else {
    usage();
  }
}
