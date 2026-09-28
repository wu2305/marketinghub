// Selects the Storybook stories a change can affect, so the visual gate and the
// font probe run only those instead of every story.
//
//   changed files (git diff against a base ref, plus uncommitted and untracked)
//   → every file under src/design that imports them, transitively
//   → every story whose stories file (index.json importPath) is in that set.
//
// A change outside src/design that the whole gate depends on (Storybook config,
// dependencies, the check scripts) returns `null`, which callers treat as "run
// everything". A change to tokens.css selects everything by itself, because
// every component imports it.
//
// CLI (prints the selection):  node scripts/affected.mjs [baseRef]
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = "src/design";
const GLOBAL = [/^\.storybook\//, /^package(-lock)?\.json$/, /^vite[^/]*\.config\./, /^scripts\/(visual-check(\.config)?\.mjs|visual-check\/common\.mjs|fingerprint\.mjs|build-storybook\.mjs|font-probe\.mjs|affected\.mjs)$/];
const EXTENSIONS = ["", ".js", ".jsx", ".mjs", ".css", "/index.js", "/index.jsx"];
const IMPORT = /(?:\bfrom|\bimport)\s*["']([^"']+)["']/g;

const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);

/** Files changed since the merge base with `base`, including uncommitted and untracked work. */
export function changedFiles(base = defaultBase()) {
  const mergeBase = git("merge-base", base, "HEAD")[0];
  return [...new Set([
    ...git("diff", "--name-only", mergeBase),
    ...git("ls-files", "--others", "--exclude-standard"),
  ])];
}

export function defaultBase() {
  const remotes = git("remote");
  return remotes.includes("github") ? "github/main" : remotes.includes("origin") ? "origin/main" : "main";
}

function walk(dir, out = []) {
  for (const name of readdirSync(path.join(ROOT, dir))) {
    const rel = `${dir}/${name}`;
    if (statSync(path.join(ROOT, rel)).isDirectory()) walk(rel, out);
    else if (/\.(jsx?|mjs|css|mdx)$/.test(name)) out.push(rel);
  }
  return out;
}

function resolveImport(from, spec) {
  if (!spec.startsWith(".")) return null;
  const bare = path.posix.normalize(path.posix.join(path.posix.dirname(from), spec.replace(/\?.*$/, "")));
  for (const ext of EXTENSIONS) {
    const candidate = bare + ext;
    if (existsSync(path.join(ROOT, candidate)) && statSync(path.join(ROOT, candidate)).isFile()) return candidate;
  }
  return null;
}

/** Map of file → files under src/design that import it directly. */
function importers() {
  const map = new Map();
  for (const file of walk(SRC)) {
    for (const [, spec] of readFileSync(path.join(ROOT, file), "utf8").matchAll(IMPORT)) {
      const target = resolveImport(file, spec);
      if (!target) continue;
      if (!map.has(target)) map.set(target, new Set());
      map.get(target).add(file);
    }
  }
  return map;
}

/** Changed files plus everything that imports them, transitively. */
export function affectedFiles(changed) {
  const map = importers();
  const seen = new Set(changed);
  const queue = [...changed];
  while (queue.length) {
    for (const importer of map.get(queue.pop()) || []) {
      if (!seen.has(importer)) { seen.add(importer); queue.push(importer); }
    }
  }
  return seen;
}

/**
 * Story ids a change can affect, or null when the change is global (run all).
 * @param {{entries: Record<string, {id:string,type:string,importPath:string}>}} index storybook-static/index.json
 * @param {string[]} changed repo-relative paths
 */
export function affectedStoryIds(index, changed) {
  if (changed.some((file) => GLOBAL.some((pattern) => pattern.test(file)))) return null;
  const files = affectedFiles(changed);
  return new Set(Object.values(index.entries)
    .filter((entry) => entry.type === "story" && files.has(entry.importPath.replace(/^\.\//, "")))
    .map((entry) => entry.id));
}

/** Scenario files (scripts/visual-check/scenarios/pNN.mjs) changed directly: their pages run in full. */
export function changedScenarioPages(changed) {
  return new Set(changed.map((file) => file.match(/^scripts\/visual-check\/scenarios\/(p\d+)\.mjs$/)?.[1]).filter(Boolean));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const base = process.argv[2] || defaultBase();
  const changed = changedFiles(base);
  const index = JSON.parse(readFileSync(path.join(ROOT, "storybook-static/index.json"), "utf8"));
  const ids = affectedStoryIds(index, changed);
  console.log(`base ${base}: ${changed.length} changed files`);
  if (!ids) console.log("global change: run everything");
  else console.log(`${ids.size} affected stories\n${[...ids].sort().join("\n")}`);
}
