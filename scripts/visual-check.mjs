#!/usr/bin/env node
/**
 * Paired visual comparison between the original static demo and Storybook stories.
 *
 * Serves the repo root (original pages) and storybook-static/ (stories) with sirv,
 * loads each pair in isolated Playwright Chromium contexts, asserts the expected
 * elements are visible, runs optional interactions, then screenshots serially and
 * writes a side-by-side HTML report to --out (default /tmp/mh-visual).
 *
 * Fails loudly: navigation errors, page errors, missing expected controls, and
 * HTTP >= 400 responses on same-origin assets all count as failures.
 *
 * Usage:
 *   npm run build-storybook   # first, so storybook-static exists
 *   node scripts/visual-check.mjs [--out /tmp/mh-visual] [--only p01] [--verbose]
 */
import http from "node:http";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";
import { chromium } from "playwright";
import scenarios, { BASELINE } from "./visual-check.config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = path.join(ROOT, "storybook-static");
const ORIG_PORT = Number(process.env.MH_ORIG_PORT || 4173);
const STORY_PORT = Number(process.env.MH_STORY_PORT || 6007);

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const OUT = flag("out") || "/tmp/mh-visual";
const ONLY = flag("only");
const VERBOSE = args.includes("--verbose");

if (!existsSync(path.join(STATIC, "index.json"))) {
  console.error("storybook-static/index.json not found — run `npm run build-storybook` first.");
  process.exit(2);
}

function serve(dir, port, label) {
  const handler = sirv(dir, { dev: true, etag: true });
  const server = http.createServer((req, res) => handler(req, res, () => {
    res.statusCode = 404;
    res.end("not found");
  }));
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      console.log(`serving ${label} on http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

/** Encode Storybook `args=` URL param (custom notation: strings plain, others `!`-prefixed). */
function encArg(value) {
  if (typeof value === "string") return encodeURIComponent(value);
  if (typeof value === "number" || typeof value === "boolean" || value === null) return `!${value}`;
  if (Array.isArray(value)) return `![${value.map(encArg).join(",")}]`;
  if (typeof value === "object") return `!(${Object.entries(value).map(([k, v]) => `${k}:${encArg(v)}`).join(",")})`;
  return encodeURIComponent(String(value));
}

function storyUrl(spec) {
  const argString = spec.args
    ? `&args=${Object.entries(spec.args).map(([k, v]) => `${k}:${encArg(v)}`).join(";")}`
    : "";
  return `http://127.0.0.1:${STORY_PORT}/iframe.html?viewMode=story&id=${spec.id}${argString}`;
}

async function runSide(browser, name, spec, url, viewport) {
  const errors = [];
  const warnings = [];
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  if (spec.storage) {
    const seed = spec.storage;
    await context.addInitScript((entries) => {
      for (const [k, v] of Object.entries(entries)) window.localStorage.setItem(k, v);
    }, seed);
  }
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText || ""}`));
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`);
  });
  page.on("console", (m) => {
    if (m.type() === "error") warnings.push(`console.error: ${m.text()}`);
  });
  let shot = null;
  try {
    const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
    if (!response || !response.ok()) errors.push(`navigation failed: HTTP ${response?.status()}`);
    for (const step of spec.actions || []) {
      if (step.click) await page.click(step.click);
      else if (step.fill) await page.fill(step.fill[0], step.fill[1]);
      else if (step.select) await page.selectOption(step.select[0], step.select[1]);
      else if (step.check) await page.check(step.check);
      else if (step.hover) await page.hover(step.hover);
      else if (step.press) await page.press(step.press[0], step.press[1]);
      else if (step.wait) await page.waitForSelector(step.wait, { state: "visible", timeout: 8000 });
      else if (step.waitMs) await page.waitForTimeout(step.waitMs);
    }
    for (const exp of spec.expect || []) {
      try {
        await page.waitForSelector(exp.sel, { state: exp.state || "visible", timeout: 8000 });
        if (exp.text) {
          const ok = await page.locator(exp.sel).first().innerText().then((t) => t.includes(exp.text));
          if (!ok) errors.push(`expect text "${exp.text}" not found in ${exp.sel}`);
        }
      } catch {
        errors.push(`expect selector not ${exp.state || "visible"}: ${exp.sel}`);
      }
    }
    await page.waitForTimeout(spec.settleMs ?? 700);
    shot = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: shot, fullPage: Boolean(spec.fullPage) });
  } catch (e) {
    errors.push(`exception: ${e.message.split("\n")[0]}`);
  } finally {
    await context.close();
  }
  return { shot, errors, warnings };
}

const browser = await chromium.launch();
const origServer = await serve(ROOT, ORIG_PORT, "original demo");
const storyServer = await serve(STATIC, STORY_PORT, "storybook-static");
mkdirSync(OUT, { recursive: true });

const list = ONLY ? scenarios.filter((s) => s.id.includes(ONLY)) : scenarios;
if (list.length === 0) {
  console.error(`no scenario matches --only ${ONLY}`);
  process.exit(2);
}

const results = [];
for (const scenario of list) {
  const viewport = scenario.viewport || BASELINE;
  const origUrl = `http://127.0.0.1:${ORIG_PORT}${scenario.original.url}`;
  const sUrl = storyUrl(scenario.story);
  const [orig, story] = [
    await runSide(browser, `${scenario.id}-original`, scenario.original, origUrl, viewport),
    await runSide(browser, `${scenario.id}-story`, scenario.story, sUrl, viewport),
  ];
  const ok = orig.errors.length === 0 && story.errors.length === 0;
  results.push({ scenario, orig, story, ok });
  console.log(`${ok ? "PASS" : "FAIL"} ${scenario.id}`);
  for (const e of [...orig.errors.map((x) => `  orig: ${x}`), ...story.errors.map((x) => `  story: ${x}`)]) console.log(e);
  if (VERBOSE) for (const w of [...orig.warnings, ...story.warnings]) console.log(`  warn: ${w}`);
}

const rows = results.map(({ scenario, orig, story, ok }) => `
  <section class="${ok ? "ok" : "bad"}">
    <h2>${scenario.id} — ${ok ? "PASS" : "FAIL"}</h2>
    <div class="pair">
      <figure><figcaption>original: ${scenario.original.url}</figcaption>
        ${orig.shot ? `<a href="${path.basename(orig.shot)}"><img src="${path.basename(orig.shot)}"></a>` : "<p>no screenshot</p>"}</figure>
      <figure><figcaption>story: ${scenario.story.id}${scenario.story.args ? " " + JSON.stringify(scenario.story.args) : ""}</figcaption>
        ${story.shot ? `<a href="${path.basename(story.shot)}"><img src="${path.basename(story.shot)}"></a>` : "<p>no screenshot</p>"}</figure>
    </div>
    ${[...orig.errors, ...story.errors].length ? `<pre>${[...orig.errors, ...story.errors].join("\n")}</pre>` : ""}
  </section>`).join("\n");
writeFileSync(path.join(OUT, "index.html"), `<!doctype html><meta charset="utf-8"><title>visual-check</title>
<style>body{font:14px/1.5 system-ui;margin:24px}h2{font-size:16px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}figcaption{color:#555;font-size:12px;margin-bottom:4px}img{width:100%;border:1px solid #ccc}.bad h2{color:#b00020}.ok h2{color:#0a7a3d}pre{background:#fdecea;padding:8px;white-space:pre-wrap}</style>
<h1>visual-check report ${new Date().toISOString()}</h1>${rows}`);

await browser.close();
origServer.close();
storyServer.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} scenarios passed; report: ${path.join(OUT, "index.html")}`);
process.exit(failed.length ? 1 : 0);
