#!/usr/bin/env node
/**
 * Paired visual comparison between the original static demo and Storybook stories.
 *
 * Serves the repo root (original pages) and storybook-static/ (stories) with sirv,
 * loads each pair in isolated Playwright Chromium contexts, runs interactions and
 * assertions, screenshots, and writes a report to --out (default
 * /tmp/mh-visual): index.html side-by-side, results.json machine record,
 * reviews.json human verdicts (preserved across runs into the same --out).
 * Scenarios run --jobs at a time (default: up to 4, or MH_VC_JOBS), each side
 * in its own browser context; results and log lines keep scenario order.
 *
 * Evidence discipline:
 * - Requires a build stamp (storybook-static/mh-build-stamp.json, written by
 *   `npm run build-storybook`) whose sourceHash matches the current
 *   src/design/.storybook/package* fingerprint; stale or missing -> exit 2.
 * - Machine checks cover load (navigation, pageerrors, failed/>=400 requests,
 *   Storybook error display) and behavior (actions, expects, console errors,
 *   layout boxes). A machine pass only means the asserted surface matched —
 *   visual sign-off is a separate human verdict recorded via --review, never
 *   defaulted by the machine.
 * - Every side of every scenario needs at least one discriminating expect
 *   (text, count or attr); otherwise the scenario fails as "weak assertions".
 *
 * Usage:
 *   npm run build-storybook   # first, so storybook-static exists and is stamped
 *   node scripts/visual-check.mjs [--out DIR] [--only SUBSTR] [--affected [REF]] [--jobs N] [--verbose]
 *   node scripts/visual-check.mjs --negative [--out DIR] [--affected [REF]] [--jobs N]
 * --affected keeps only scenarios whose story a change since REF (default the
 * GitHub main) can reach through imports, plus every scenario of a page whose
 * scenario file changed; a global change (config, dependencies, these scripts)
 * runs everything (scripts/affected.mjs).
 * The original demo (index.html, assets/**) is frozen, so a passing original
 * side is cached under node_modules/.cache/mh-visual-original, keyed by the
 * original files, the scenario's original steps, viewport, this runner and the
 * browser version. Failures are never cached. --fresh-original ignores the cache.
 *   node scripts/visual-check.mjs --review <out> <scenarioId> pass|fail "note"
 */
import http from "node:http";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";
import { chromium } from "playwright";
import scenarios, { BASELINE, CONSOLE_ALLOW } from "./visual-check.config.mjs";
import negatives from "./visual-check.negative.mjs";
import { ROOT, gitInfo, sourceFingerprint } from "./fingerprint.mjs";
import { affectedStoryIds, changedFiles, changedScenarioPages, defaultBase, unreachedSources } from "./affected.mjs";

const STATIC = path.join(ROOT, "storybook-static");
const STAMP = path.join(STATIC, "mh-build-stamp.json");
const INDEX = path.join(STATIC, "index.json");
const CONFIG_FILES = [
  path.join(ROOT, "scripts", "visual-check.config.mjs"),
  path.join(ROOT, "scripts", "visual-check.negative.mjs"),
  path.join(ROOT, "scripts", "visual-check", "common.mjs"),
  ...readdirSync(path.join(ROOT, "scripts", "visual-check", "scenarios"))
    .filter((f) => f.endsWith(".mjs"))
    .sort()
    .map((f) => path.join(ROOT, "scripts", "visual-check", "scenarios", f)),
];
const ORIG_PORT = Number(process.env.MH_ORIG_PORT || 4173);
const STORY_PORT = Number(process.env.MH_STORY_PORT || 6007);

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const OUT = flag("out") || "/tmp/mh-visual";
const ONLY = flag("only");
const NEGATIVE = args.includes("--negative");
const AFFECTED_AT = args.indexOf("--affected");
const AFFECTED_BASE = AFFECTED_AT < 0 ? null : (args[AFFECTED_AT + 1] && !args[AFFECTED_AT + 1].startsWith("--") ? args[AFFECTED_AT + 1] : defaultBase());
const VERBOSE = args.includes("--verbose");
const JOBS = Math.max(1, Number(flag("jobs") || process.env.MH_VC_JOBS || Math.min(4, availableParallelism())));
const REVIEW_AT = args.indexOf("--review");
const FRESH_ORIGINAL = args.includes("--fresh-original");
const ORIGINAL_CACHE = path.join(ROOT, "node_modules", ".cache", "mh-visual-original");

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const pageOf = (id) => id.split("-")[0];

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function loadReviews(out) {
  const file = path.join(out, "reviews.json");
  return existsSync(file) ? readJson(file) : {};
}

/**
 * --review <out> <scenarioId> pass|fail "note": copy the shot hashes recorded in
 * <out>/results.json into <out>/reviews.json so a later run can detect a stale
 * review when a screenshot changes. No browsers involved.
 */
if (REVIEW_AT >= 0) {
  const [outDir, sid, verdict, ...noteParts] = args.slice(REVIEW_AT + 1);
  const note = noteParts.join(" ");
  if (!outDir || !sid || !["pass", "fail"].includes(verdict || "")) {
    console.error('usage: --review <out> <scenarioId> pass|fail "note"');
    process.exit(2);
  }
  const resultsFile = path.join(outDir, "results.json");
  if (!existsSync(resultsFile)) {
    console.error(`${resultsFile} not found — run visual-check into that directory first`);
    process.exit(2);
  }
  const entry = readJson(resultsFile).scenarios.find((s) => s.id === sid);
  if (!entry) {
    console.error(`scenario ${sid} not in ${resultsFile}`);
    process.exit(2);
  }
  if (!entry.original.shotHash || !entry.story.shotHash) {
    console.error(`scenario ${sid} has no screenshot hashes to review`);
    process.exit(2);
  }
  const reviewsFile = path.join(outDir, "reviews.json");
  const reviews = existsSync(reviewsFile) ? readJson(reviewsFile) : {};
  reviews[sid] = {
    verdict,
    note,
    reviewedAt: new Date().toISOString(),
    originalShotHash: entry.original.shotHash,
    storyShotHash: entry.story.shotHash,
  };
  writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2) + "\n");
  console.log(`review recorded: ${sid} -> ${verdict}${note ? ` (${note})` : ""} in ${reviewsFile}`);
  // Re-render the HTML report so the new manual verdict shows immediately.
  const data = readJson(resultsFile);
  for (const e of data.scenarios) Object.assign(e, manualStatus(e, reviews));
  renderReport(data.run, data.scenarios, outDir);
  process.exit(0);
}

// --- build-stamp gate: refuse to produce evidence against stale output -------
if (!existsSync(INDEX)) {
  console.error("storybook-static/index.json not found — run `npm run build-storybook` first.");
  process.exit(2);
}
const fingerprint = sourceFingerprint();
const stamp = existsSync(STAMP) ? readJson(STAMP) : null;
if (!stamp || stamp.sourceHash !== fingerprint.hash) {
  console.error("storybook-static is stale for current sources — run npm run build-storybook");
  process.exit(2);
}

const index = readJson(INDEX);
const indexIds = new Set();
const indexCounts = { stories: 0, docs: 0 };
for (const e of Object.values(index.entries)) {
  indexIds.add(e.id);
  if (e.type === "story") indexCounts.stories += 1;
  else if (e.type === "docs") indexCounts.docs += 1;
}
// Hash every scenario module so the run record proves which assertion set ran.
const configHash = createHash("sha256")
  .update(CONFIG_FILES.map((f) => path.relative(ROOT, f) + "\0" + readFileSync(f, "utf8")).join("\0"))
  .digest("hex");

// Everything an original-side result depends on except the scenario itself.
const originalBase = createHash("sha256")
  .update(sourceFingerprint(["index.html", "assets"]).hash)
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .update(readFileSync(path.join(ROOT, "scripts", "visual-check", "common.mjs")))
  .update(readJson(path.join(ROOT, "node_modules", "playwright-core", "package.json")).version)
  .digest("hex");

function originalKey(scenario, viewport, layoutSels) {
  return createHash("sha256")
    .update(originalBase)
    .update(JSON.stringify({ original: scenario.original, viewport, layoutSels, console: (CONSOLE_ALLOW || []).filter((a) => a.side === "original" && (!a.scenario || a.scenario === scenario.id)) }))
    .digest("hex");
}

function cachedOriginal(key, name) {
  if (FRESH_ORIGINAL) return null;
  const meta = path.join(ORIGINAL_CACHE, `${key}.json`);
  const shot = path.join(ORIGINAL_CACHE, `${key}.png`);
  if (!existsSync(meta) || !existsSync(shot)) return null;
  copyFileSync(shot, path.join(OUT, `${name}.png`));
  return { ...readJson(meta), shot: `${name}.png`, cached: true };
}

function storeOriginal(key, name, res) {
  if (res.errors.length) return;
  mkdirSync(ORIGINAL_CACHE, { recursive: true });
  copyFileSync(path.join(OUT, `${name}.png`), path.join(ORIGINAL_CACHE, `${key}.png`));
  writeFileSync(path.join(ORIGINAL_CACHE, `${key}.json`), JSON.stringify(res));
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

/**
 * Flatten a scenario `args` object into Storybook 8.6 `args=` key:value pairs.
 * Verified against @storybook/core preview-api parseArgsParam: scalars are
 * plain (numbers auto-coerce), booleans/null/undefined are `!`-prefixed,
 * objects flatten to `obj.key:value`, arrays to `arr[0]:value`. Plain-string
 * args must match /^[a-zA-Z0-9 _-]*$/ or Storybook silently drops them —
 * so this throws instead of producing a scenario that passes on defaults.
 */
function argPairs(key, value) {
  if (value === undefined) return [[key, "!undefined"]];
  if (value === null) return [[key, "!null"]];
  if (typeof value === "boolean") return [[key, `!${value}`]];
  if (typeof value === "number") return [[key, String(value)]];
  if (typeof value === "string") {
    if (!/^[a-zA-Z0-9 _-]*$/.test(value)) {
      throw new Error(`arg "${key}" contains characters Storybook URL args reject: ${JSON.stringify(value)}`);
    }
    return [[key, encodeURIComponent(value)]];
  }
  if (Array.isArray(value)) return value.flatMap((v, i) => argPairs(`${key}[${i}]`, v));
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => {
      if (!/^[a-zA-Z0-9 _-]*$/.test(k)) throw new Error(`arg "${key}.${k}" has an unsafe key`);
      return argPairs(`${key}.${k}`, v);
    });
  }
  throw new Error(`unsupported arg type for "${key}": ${typeof value}`);
}

function storyUrl(spec) {
  const argString = spec.args
    ? `&args=${Object.entries(spec.args).flatMap(([k, v]) => argPairs(k, v)).map(([k, v]) => `${k}:${v}`).join(";")}`
    : "";
  return `http://127.0.0.1:${STORY_PORT}/iframe.html?viewMode=story&id=${spec.id}${argString}`;
}

function consoleAllowance(side, scenarioId, text) {
  return (CONSOLE_ALLOW || []).find(
    (a) => a.side === side && (!a.scenario || a.scenario === scenarioId) && new RegExp(a.pattern).test(text),
  );
}

function describeStep(step) {
  const [kind, v] = Object.entries(step)[0];
  return `${kind}(${Array.isArray(v) ? v.map((x) => (typeof x === "object" ? JSON.stringify(x) : x)).join(", ") : v})`;
}

async function storyMounted(page) {
  return page.evaluate(() => {
    const badClass = ["sb-show-errordisplay", "sb-show-nopreview"].find((c) => document.body.classList.contains(c));
    return { badClass, rootChildren: document.querySelector("#storybook-root")?.childElementCount ?? 0 };
  });
}

async function checkStoryHealth(page, res, phase) {
  if (phase === "load") {
    // The preview mounts asynchronously after the load event; give it time.
    try {
      await page.waitForFunction(() => document.querySelector("#storybook-root")?.childElementCount > 0, null, {
        timeout: 15000,
      });
    } catch {
      res.errors.push("[load] #storybook-root is empty (story did not render)");
    }
  }
  const { badClass, rootChildren } = await storyMounted(page);
  if (badClass) res.errors.push(`[${phase}] storybook body class ${badClass}`);
  if (rootChildren === 0) res.errors.push(`[${phase}] #storybook-root is empty`);
}

/**
 * Wait for finite CSS animations and transitions (drawers sliding in, fades)
 * to finish, so eval geometry checks and expects never see a mid-motion
 * frame. Infinite animations (spinners, pulses) are ignored.
 */
async function animationsDone(page) {
  await page
    .waitForFunction(
      () =>
        document.getAnimations().every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity),
      null,
      { timeout: 5000 },
    )
    .catch(() => {});
}

/**
 * Wait until the page is ready to photograph: an explicit `settleMs` is kept
 * as a fixed wait (scenarios that need time-based UI); otherwise wait for
 * fonts and in-document images, two animation frames, and a short grace
 * period so late console errors still land in this side's record.
 */
async function settle(page, settleMs) {
  if (settleMs !== undefined) {
    await page.waitForTimeout(settleMs);
    return;
  }
  await page
    .waitForFunction(
      () =>
        document.fonts.status === "loaded" &&
        [...document.images].every((img) => img.complete),
      null,
      { timeout: 5000 },
    )
    .catch(() => {});
  await animationsDone(page);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.waitForTimeout(150);
}

/**
 * Run one side of a scenario. Errors are tagged with the phase in which they
 * occurred: [load] covers navigation, pageerrors, request failures and console
 * errors up to the first action (plus the post-load Storybook health check);
 * [behavior] covers everything after — actions, expects, layout capture and the
 * post-actions Storybook health check.
 */
async function runSide(browser, name, spec, url, viewport, side, scenarioId, layoutSels) {
  const res = { url, errors: [], warnings: [], shot: null, shotHash: null, boxes: {} };
  let phase = "load";
  const err = (msg) => res.errors.push(`[${phase}] ${msg}`);
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  if (spec.storage) {
    const seed = spec.storage;
    await context.addInitScript((entries) => {
      for (const [k, v] of Object.entries(entries)) window.localStorage.setItem(k, v);
    }, seed);
  }
  const page = await context.newPage();
  page.on("pageerror", (e) => err(`pageerror: ${e.message}`));
  // A request aborted because its document navigated away (the original
  // pages normalise their URL with location.replace while <head> still loads)
  // is only an error if the resource never loads afterwards; whether it was
  // still in flight at the redirect is timing, so it is judged after the run.
  const aborted = [];
  const finished = new Set();
  page.on("requestfinished", (r) => finished.add(r.url()));
  page.on("requestfailed", (r) => {
    const text = r.failure()?.errorText || "";
    if (text === "net::ERR_ABORTED") aborted.push({ url: r.url(), phase });
    else err(`requestfailed: ${r.url()} ${text}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400) err(`HTTP ${r.status()} ${r.url()}`);
  });
  page.on("console", (m) => {
    const text = `console.${m.type()}: ${m.text()}`;
    if (m.type() === "error") {
      const allowed = consoleAllowance(side, scenarioId, m.text());
      if (allowed) res.warnings.push(`allowed ${text} — ${allowed.reason}`);
      else err(text);
    } else if (m.type() === "warning") {
      res.warnings.push(text);
    }
  });
  try {
    const response = await page.goto(url, { waitUntil: "load", timeout: 30000 });
    if (!response || !response.ok()) err(`navigation failed: HTTP ${response?.status()}`);
    if (side === "story") await checkStoryHealth(page, res, "load");
    // The original pages finish initialising on timers after load (types.js
    // re-renders the active view 60 ms later and discards typed input), so
    // actions wait for the network and those timers before the first step.
    if (side === "original" && spec.actions?.length) {
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(250);
    }

    phase = "behavior";
    for (const step of spec.actions || []) {
      try {
        if (step.click) await page.click(step.click);
        else if (step.fill) await page.fill(step.fill[0], step.fill[1]);
        else if (step.select) await page.selectOption(step.select[0], step.select[1]);
        else if (step.check) await page.check(step.check);
        else if (step.hover) await page.hover(step.hover);
        else if (step.press) await page.press(step.press[0], step.press[1]);
        else if (step.drag) {
          const [selector, dx, dy] = step.drag;
          const rect = await page.locator(selector).boundingBox();
          if (!rect) throw new Error(`drag target missing: ${selector}`);
          const x = rect.x + rect.width * 0.2;
          const y = rect.y + rect.height * 0.8;
          await page.mouse.move(x, y);
          await page.mouse.down();
          await page.mouse.move(x + dx, y + dy, { steps: 5 });
          await page.mouse.up();
        }
        else if (step.upload)
          await page.setInputFiles(step.upload[0], {
            name: step.upload[1].name,
            mimeType: step.upload[1].mimeType || "application/octet-stream",
            buffer: Buffer.from(step.upload[1].content || "", "utf8"),
          });
        else if (step.wait) await page.waitForSelector(step.wait, { state: "visible", timeout: 8000 });
        else if (step.waitMs) await page.waitForTimeout(step.waitMs);
        else if (step.eval) {
          await animationsDone(page);
          await page.evaluate(step.eval);
        }
      } catch (e) {
        err(`action ${describeStep(step)} failed: ${e.message.split("\n")[0]}`);
        break;
      }
    }
    if (side === "story") await checkStoryHealth(page, res, "behavior");

    await animationsDone(page);
    for (const exp of spec.expect || []) {
      const state = exp.state || "visible";
      const countOnly = exp.count !== undefined && (state === "hidden" || state === "detached");
      try {
        if (!countOnly) await page.waitForSelector(exp.sel, { state, timeout: 8000 });
        if (exp.text) {
          // Poll: a story may still be applying its state after first paint.
          let t = "";
          for (const deadline = Date.now() + 8000; ; await page.waitForTimeout(100)) {
            t = await page.locator(exp.sel).first().innerText();
            if (t.includes(exp.text) || Date.now() > deadline) break;
          }
          if (!t.includes(exp.text)) err(`expect text "${exp.text}" not found in ${exp.sel}`);
        }
        if (exp.count !== undefined) {
          // Poll like text: a filter or search may still be re-rendering the list.
          let n = 0;
          for (const deadline = Date.now() + 8000; ; await page.waitForTimeout(100)) {
            n = await page.locator(exp.sel).count();
            if (n === exp.count || Date.now() > deadline) break;
          }
          if (n !== exp.count) err(`expect count ${exp.count} got ${n} for ${exp.sel}`);
        }
        if (exp.attr) {
          const v = await page.locator(exp.sel).first().getAttribute(exp.attr.name);
          if (v !== exp.attr.value) err(`expect ${exp.sel}[${exp.attr.name}]="${exp.attr.value}" got ${JSON.stringify(v)}`);
        }
      } catch {
        err(`expect selector not ${state}: ${exp.sel}`);
      }
    }
    await settle(page, spec.settleMs);
    const shotPath = path.join(OUT, `${name}.png`);
    // Finite CSS animations/transitions jump to their end state, so the shot
    // and the layout boxes below never catch a drawer or toast mid-motion.
    await page.screenshot({ path: shotPath, fullPage: Boolean(spec.fullPage), animations: "disabled" });
    res.shot = `${name}.png`;
    res.shotHash = sha256(readFileSync(shotPath));
    for (const sel of layoutSels || []) {
      res.boxes[sel] = await page.locator(sel).first().boundingBox().catch(() => null);
    }
  } catch (e) {
    err(`exception: ${e.message.split("\n")[0]}`);
  } finally {
    await context.close();
  }
  for (const a of aborted) {
    if (!finished.has(a.url)) res.errors.push(`[${a.phase}] requestfailed: ${a.url} net::ERR_ABORTED`);
  }
  res.load = res.errors.every((e) => !e.startsWith("[load]")) ? "pass" : "fail";
  res.behavior = res.errors.every((e) => !e.startsWith("[behavior]")) ? "pass" : "fail";
  return res;
}

const hasStrongExpect = (spec) =>
  (spec?.expect || []).some((e) => e.text !== undefined || e.count !== undefined || e.attr !== undefined);

function deepMerge(base, over) {
  const out = { ...base };
  for (const [k, v] of Object.entries(over || {})) {
    if (v === undefined) continue;
    out[k] = v && typeof v === "object" && !Array.isArray(v) && typeof base?.[k] === "object" && base?.[k] !== null && !Array.isArray(base[k])
      ? deepMerge(base[k], v)
      : v;
  }
  return out;
}

function manualStatus(entry, reviews) {
  const r = reviews[entry.id];
  if (!r) return { manual: "pending", manualNote: "" };
  if (r.originalShotHash === entry.original.shotHash && r.storyShotHash === entry.story.shotHash) {
    return { manual: r.verdict, manualNote: r.note || "" };
  }
  return { manual: "pending", manualNote: `stale review (${r.verdict} ${r.reviewedAt}${r.note ? `, ${r.note}` : ""}) — screenshots changed` };
}

function compareLayout(scenario, orig, story, errors) {
  const rows = [];
  for (const l of scenario.layout || []) {
    const a = orig.boxes[l.orig];
    const b = story.boxes[l.story];
    const row = { orig: l.orig, story: l.story, props: l.props, tol: l.tol, origBox: a, storyBox: b, ok: true };
    if (!a || !b) {
      row.ok = false;
      errors.push(`layout: missing box ${!a ? `original ${l.orig}` : `story ${l.story}`}`);
    } else {
      for (const p of l.props) {
        const d = Math.abs(a[p] - b[p]);
        if (d > l.tol) {
          row.ok = false;
          errors.push(`layout: ${p} differs by ${d.toFixed(1)}px (tol ${l.tol}) — ${l.orig}=${a[p].toFixed(1)} vs ${l.story}=${b[p].toFixed(1)}`);
        }
      }
    }
    rows.push(row);
  }
  return rows;
}

function renderReport(run, entries, outDir) {
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const badge = (v, staleNote) => {
    const cls = v === "pass" ? "ok" : v === "fail" ? "bad" : "pend";
    return `<span class="${cls}">${esc(v)}</span>${staleNote ? ` <span class="pend">${esc(staleNote)}</span>` : ""}`;
  };
  const rows = entries
    .map((e) => {
      const stale = e.manualNote?.startsWith("stale review") ? e.manualNote : "";
      return `
  <section class="${e.machine === "pass" ? "ok" : "bad"}">
    <h2>${esc(e.id)} — machine ${esc(e.machine)}</h2>
    <table class="status"><tr><th>load</th><th>behavior</th><th>manual</th></tr>
      <tr><td>o:${badge(e.original.load)} s:${badge(e.story.load)}</td>
          <td>o:${badge(e.original.behavior)} s:${badge(e.story.behavior)}</td>
          <td>${badge(e.manual)}${stale ? "" : esc(e.manualNote || "")}</td></tr></table>
    ${stale ? `<p class="pend">${esc(stale)}</p>` : ""}
    ${e.layout?.length ? `<pre>${esc(e.layout.map((l) => `${l.ok ? "ok" : "MISMATCH"} ${l.orig} vs ${l.story}: ${JSON.stringify(l.origBox)} / ${JSON.stringify(l.storyBox)} tol ${l.tol}`).join("\n"))}</pre>` : ""}
    <div class="pair">
      <figure><figcaption>original: ${esc(e.original.url)}</figcaption>
        ${e.original.shot ? `<a href="${esc(e.original.shot)}"><img src="${esc(e.original.shot)}"></a>` : "<p>no screenshot</p>"}</figure>
      <figure><figcaption>story: ${esc(e.story.id)}${e.story.args ? " " + esc(JSON.stringify(e.story.args)) : ""}</figcaption>
        ${e.story.shot ? `<a href="${esc(e.story.shot)}"><img src="${esc(e.story.shot)}"></a>` : "<p>no screenshot</p>"}</figure>
    </div>
    ${[...e.original.errors.map((x) => `orig: ${x}`), ...e.story.errors.map((x) => `story: ${x}`)].length
      ? `<pre>${esc([...e.original.errors.map((x) => `orig: ${x}`), ...e.story.errors.map((x) => `story: ${x}`)].join("\n"))}</pre>`
      : ""}
  </section>`;
    })
    .join("\n");
  const prov = `head ${run.head.slice(0, 7)} | sourceHash ${run.sourceHash.slice(0, 12)} | configHash ${run.configHash.slice(0, 12)} | built ${run.build?.builtAt} | stories ${run.index.stories} docs ${run.index.docs} | argv: ${esc(run.argv.join(" "))} | ${run.startedAt}`;
  writeFileSync(
    path.join(outDir, "index.html"),
    `<!doctype html><meta charset="utf-8"><title>visual-check</title>
<style>body{font:14px/1.5 system-ui;margin:24px}h2{font-size:16px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}figcaption{color:#555;font-size:12px;margin-bottom:4px}img{width:100%;border:1px solid #ccc}pre{background:#fdecea;padding:8px;white-space:pre-wrap}.status{border-collapse:collapse}.status th,.status td{border:1px solid #ccc;padding:2px 10px;font-size:12px}.ok{color:#0a7a3d}.bad{color:#b00020}.pend{color:#8a6d00}.prov{color:#555;font-size:12px}</style>
<h1>visual-check report</h1><p class="prov">${prov}</p>${rows}`,
  );
}

// --- scenario selection ------------------------------------------------------
let list;
if (NEGATIVE) {
  list = negatives.map((n) => {
    const base = scenarios.find((s) => s.id === n.base);
    if (!base) throw new Error(`negative ${n.id}: base scenario ${n.base} not found`);
    const copy = deepMerge(structuredClone(base), { story: n.story, original: n.original });
    copy.id = n.id;
    copy.reason = n.reason;
    return copy;
  });
} else {
  list = ONLY ? scenarios.filter((s) => s.id.includes(ONLY)) : scenarios;
}
if (AFFECTED_BASE) {
  const changed = changedFiles(AFFECTED_BASE);
  const ids = affectedStoryIds(readJson(INDEX), changed);
  const unreached = ids ? unreachedSources(readJson(INDEX), changed) : [];
  if (unreached.length) {
    console.error(`--affected: these changed sources reach no story, so no scenario can check them: ${unreached.join(", ")}`);
    process.exit(2);
  }
  const pages = changedScenarioPages(changed);
  const allNegatives = NEGATIVE && changed.includes("scripts/visual-check.negative.mjs");
  const before = list.length;
  if (ids && !allNegatives) {
    const baseOf = (s) => (NEGATIVE ? negatives.find((n) => n.id === s.id).base : s.id);
    list = list.filter((s) => ids.has(s.story?.id) || pages.has(pageOf(baseOf(s))) || (NEGATIVE && ids.has(scenarios.find((b) => b.id === baseOf(s))?.story?.id)));
  }
  console.log(`--affected ${AFFECTED_BASE}: ${changed.length} changed files → ${ids ? `${ids.size} stories, ` : "global change, "}${list.length}/${before} scenarios`);
  if (list.length === 0) {
    // A green CI job that checked nothing must say so.
    if (process.env.GITHUB_ACTIONS) console.log("::warning::--affected selected 0 scenarios, so nothing was visually checked");
    console.log(changed.length ? "no affected scenarios (changes are outside Storybook: docs, tests or the host, which npm test and host-check cover)" : "no changes");
    process.exit(0);
  }
}
if (list.length === 0) {
  console.error(`no scenario matches ${NEGATIVE ? "--negative" : `--only ${ONLY}`}`);
  process.exit(2);
}

const browser = await chromium.launch();
const origServer = await serve(ROOT, ORIG_PORT, "original demo");
const storyServer = await serve(STATIC, STORY_PORT, "storybook-static");
mkdirSync(OUT, { recursive: true });

const startedAt = new Date().toISOString();
const { head, dirtyPaths } = gitInfo();
const entries = [];
const allowancesUsed = [];

async function runScenario(scenario) {
  const lines = [];
  const viewport = scenario.viewport || BASELINE;
  const entry = {
    id: scenario.id,
    page: pageOf(scenario.id),
    viewport,
    original: { url: `http://127.0.0.1:${ORIG_PORT}${scenario.original.url}`, storage: scenario.original.storage },
    story: { id: scenario.story.id, args: scenario.story.args, url: storyUrl(scenario.story) },
    machine: "fail",
    layout: [],
  };
  const topErrors = [];
  const weakSides = [!hasStrongExpect(scenario.original) && "original", !hasStrongExpect(scenario.story) && "story"].filter(Boolean);
  if (weakSides.length) {
    topErrors.push(`weak assertions: ${weakSides.join(" + ")} side has no text/count/attr expect`);
  }
  if (!indexIds.has(scenario.story.id)) {
    topErrors.push(`story id ${scenario.story.id} not in storybook-static/index.json`);
  }
  if (topErrors.length) {
    entry.original.load = entry.original.behavior = "skipped";
    entry.story.load = entry.story.behavior = "skipped";
    entry.original.errors = topErrors;
    entry.story.errors = [];
    lines.push(`FAIL ${scenario.id}`, ...topErrors.map((e) => `  ${e}`));
    return { entry, lines };
  }

  const origLayoutSels = (scenario.layout || []).map((l) => l.orig);
  const storyLayoutSels = (scenario.layout || []).map((l) => l.story);
  const origName = `${scenario.id}-original`;
  const origKey = originalKey(scenario, viewport, origLayoutSels);
  const runOriginal = async () => {
    const hit = cachedOriginal(origKey, origName);
    if (hit) return hit;
    const res = await runSide(browser, origName, scenario.original, entry.original.url, viewport, "original", scenario.id, origLayoutSels);
    storeOriginal(origKey, origName, res);
    return res;
  };
  const [orig, story] = await Promise.all([
    runOriginal(),
    runSide(browser, `${scenario.id}-story`, scenario.story, entry.story.url, viewport, "story", scenario.id, storyLayoutSels),
  ]);
  entry.original = { ...entry.original, ...orig, storage: scenario.original.storage };
  entry.story = { ...entry.story, ...story };
  delete entry.original.boxes;
  delete entry.story.boxes;
  const layoutErrors = [];
  entry.layout = compareLayout(scenario, orig, story, layoutErrors);
  entry.story.errors.push(...layoutErrors);
  entry.machine = orig.errors.length === 0 && story.errors.length === 0 && layoutErrors.length === 0 ? "pass" : "fail";
  lines.push(`${entry.machine === "pass" ? "PASS" : "FAIL"} ${scenario.id}${NEGATIVE ? ` (negative: expected fail)` : ""}`);
  lines.push(...orig.errors.map((x) => `  orig: ${x}`), ...story.errors.map((x) => `  story: ${x}`), ...layoutErrors.map((x) => `  ${x}`));
  if (VERBOSE) lines.push(...[...orig.warnings, ...story.warnings].map((w) => `  warn: ${w}`));
  return { entry, lines };
}

// Worker pool: JOBS scenarios in flight; entries and log lines are flushed in
// scenario order so reports and logs read the same as a serial run.
const done = new Array(list.length);
let next = 0;
let flushed = 0;
async function worker() {
  while (next < list.length) {
    const i = next++;
    done[i] = await runScenario(list[i]);
    while (flushed < list.length && done[flushed]) {
      entries.push(done[flushed].entry);
      for (const line of done[flushed].lines) console.log(line);
      flushed += 1;
    }
  }
}
await Promise.all(Array.from({ length: Math.min(JOBS, list.length) }, worker));


// collect which console allowances actually fired
for (const e of entries) {
  for (const side of ["original", "story"]) {
    for (const w of e[side]?.warnings || []) {
      const m = w.match(/^allowed console\.error: (.*) — (.*)$/);
      if (m) allowancesUsed.push({ scenario: e.id, side, text: m[1].slice(0, 160), reason: m[2] });
    }
  }
}

// manual verdicts (reviews.json preserved across runs into the same --out)
const reviews = loadReviews(OUT);
for (const e of entries) Object.assign(e, manualStatus(e, reviews));

const summary = {
  total: entries.length,
  machinePass: entries.filter((e) => e.machine === "pass").length,
  manual: {
    pass: entries.filter((e) => e.manual === "pass").length,
    fail: entries.filter((e) => e.manual === "fail").length,
    pending: entries.filter((e) => e.manual === "pending").length,
  },
  perPage: Object.fromEntries(
    [...new Set(entries.map((e) => e.page))].map((p) => [p, entries.filter((e) => e.page === p).length]),
  ),
  index: indexCounts,
  allowancesUsed,
};

const run = {
  startedAt,
  argv: process.argv.slice(2),
  head,
  dirtyPaths,
  sourceHash: fingerprint.hash,
  configHash,
  build: stamp,
  index: indexCounts,
};
writeFileSync(path.join(OUT, "results.json"), JSON.stringify({ run, scenarios: entries, summary }, null, 2) + "\n");
renderReport(run, entries, OUT);

await browser.close();
origServer.close();
storyServer.close();

const perPage = Object.entries(summary.perPage).map(([k, v]) => `${k}=${v}`).join(" ");
if (NEGATIVE) {
  // A mutation is caught only when the story side fails while the original side
  // passes; an original-side failure proves nothing about the mutation.
  const unexpected = entries.filter((e) => e.story.errors.length === 0);
  const inconclusive = entries.filter((e) => e.story.errors.length > 0 && e.original.errors.length > 0);
  const caught = entries.length - unexpected.length - inconclusive.length;
  console.log(`\nnegative checks: ${caught}/${entries.length} caught on the story side with a passing original`);
  for (const e of unexpected) console.log(`NEGATIVE CHECK PASSED UNEXPECTEDLY: ${e.id}`);
  for (const e of inconclusive) console.log(`NEGATIVE CHECK INCONCLUSIVE (original side failed): ${e.id}`);
  process.exit(unexpected.length || inconclusive.length ? 1 : 0);
}
console.log(`\nstories: ${indexCounts.stories} docs: ${indexCounts.docs} | scenarios per page: ${perPage}`);
console.log(
  `machine: ${summary.machinePass}/${summary.total} pass | manual: pass ${summary.manual.pass}, fail ${summary.manual.fail}, pending ${summary.manual.pending} — machine pass does NOT mean visual pass`,
);
if (allowancesUsed.length) {
  console.log(`console allowances used: ${allowancesUsed.length}`);
  for (const a of allowancesUsed) console.log(`  ${a.scenario} ${a.side}: ${a.text} — ${a.reason}`);
}
console.log(`report: ${path.join(OUT, "index.html")}`);
process.exit(summary.machinePass === summary.total ? 0 : 1);
