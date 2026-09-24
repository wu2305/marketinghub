#!/usr/bin/env node
/**
 * Standalone-host verification — examples/host/dist served under /mh-host/.
 *
 * Requires `npm run build:host` first: the dist stamp must match the current
 * source fingerprint (same contract as visual-check's storybook stamp).
 *
 * Checks:
 *   home        — page loads clean; fonts loaded; every <img> and CSS
 *                 background image resolves
 *   nav-loop    — catalog card → report row → live back → directory back,
 *                 all inside React (no reload, URL stays under /mh-host/),
 *                 then browser back (popstate) returns to the directory
 *   coverage    — a link to an unrebuilt original page shows the coverage
 *                 notice instead of navigating to /assets/pages/…
 *   home-flow   — Home assistant via useHomeDemo: history pick fills the
 *                 prompt with ASK disabled, typing re-enables, submit shows
 *                 an answer, close→reopen keeps it, new session clears, and
 *                 the skill menu opens the model-flow dialog
 *   sentinel    — host-owned elements get identical computed styles on the
 *                 bare sentinel page and the compose page (scoped resets do
 *                 not leak)
 *   dual        — two CityInvestDashboard / ReportCopilot instances stay
 *                 independent (filter A ≠ B, both streams complete, ask in A
 *                 leaves B untouched, ALT labels only in B)
 *
 * Output: --out dir (default /tmp/mh-host) gets results.json + screenshots.
 * Exit code is non-zero when any check fails.
 */
import http from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sirv from "sirv";
import { ROOT, sourceFingerprint } from "./fingerprint.mjs";
import { ASSISTANT } from "../src/design/content.js";

const HOST = path.join(ROOT, "examples", "host");
const DIST = path.join(HOST, "dist");
const HOST_PATHS = ["src/design", "examples/host", "package.json", "package-lock.json"];
const PORT = 4618;
const BASE = "/mh-host/";

const outIdx = process.argv.indexOf("--out");
const OUT = outIdx > -1 ? process.argv[outIdx + 1] : "/tmp/mh-host";
mkdirSync(OUT, { recursive: true });

/* ---- stamp gate ---- */
const stampPath = path.join(DIST, "mh-host-stamp.json");
if (!existsSync(stampPath)) {
  console.error("examples/host/dist has no build stamp — run npm run build:host first");
  process.exit(2);
}
const stamp = JSON.parse(readFileSync(stampPath, "utf8"));
const { hash } = sourceFingerprint(HOST_PATHS);
if (stamp.sourceHash !== hash) {
  console.error(`examples/host/dist is stale for current sources (stamp ${stamp.sourceHash.slice(0, 12)} vs ${hash.slice(0, 12)}) — run npm run build:host`);
  process.exit(2);
}

/* ---- serve dist under /mh-host/ ---- */
const handler = sirv(DIST, { dev: true, etag: true, single: true });
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (url.pathname === "/" ) {
    res.writeHead(302, { location: BASE });
    res.end();
    return;
  }
  if (url.pathname.startsWith(BASE)) {
    req.url = url.pathname.slice(BASE.length - 1) + url.search; /* strip /mh-host → keep leading / */
    handler(req, res, () => {
      res.statusCode = 404;
      res.end("not found");
    });
    return;
  }
  res.statusCode = 404;
  res.end("not found");
});
await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(PORT, "127.0.0.1", () => {
    console.log(`serving examples/host/dist on http://127.0.0.1:${PORT}${BASE}`);
    resolve();
  });
});

const origin = `http://127.0.0.1:${PORT}`;
const results = [];
let failures = 0;

function record(id, ok, notes = []) {
  results.push({ id, ok, notes });
  console.log(`${ok ? "PASS" : "FAIL"} ${id}${notes.length ? ` — ${notes.join(" | ")}` : ""}`);
  if (!ok) failures += 1;
}

function watchPage(page) {
  const errors = [];
  page.on("pageerror", (err) => errors.push(`pageerror: ${String(err).slice(0, 160)}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text().slice(0, 160)}`);
  });
  page.on("response", (res) => {
    if (res.status() >= 400) errors.push(`HTTP ${res.status()}: ${res.url().slice(-80)}`);
  });
  page.on("requestfailed", (req) => errors.push(`requestfailed: ${req.url().slice(-80)}`));
  return errors;
}

const browser = await chromium.launch();

async function newPage() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  const errors = watchPage(page);
  return { page, errors };
}

/* ---- home: clean load, fonts, images ---- */
{
  const { page, errors } = await newPage();
  await page.goto(`${origin}${BASE}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".mh-page--home, .mh-header", { timeout: 10000 });
  const info = await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.images].map((img) => ({ src: img.src.slice(-60), ok: img.naturalWidth > 0 }));
    const bgs = [...document.querySelectorAll("*")]
      .map((el) => getComputedStyle(el).backgroundImage)
      .filter((v) => v && v.includes("url("))
      .map((v) => v.match(/url\(["']?(.*?)["']?\)/)?.[1])
      .filter(Boolean);
    const bgResults = await Promise.all(bgs.map(async (u) => ({ url: u.slice(-60), ok: (await fetch(u)).status === 200 })));
    return {
      boot: window.__mhHostBoot || null,
      din: document.fonts.check('16px "DIN 2014"'),
      dinBold: document.fonts.check('700 16px "DIN 2014"'),
      benton: document.fonts.check('italic 600 16px "BentonModDisplay"'),
      imgs,
      bgResults,
    };
  });
  const notes = [];
  if (!info.boot) notes.push("window.__mhHostBoot missing");
  if (!info.din || !info.dinBold) notes.push('font "DIN 2014" not loaded');
  if (!info.benton) notes.push('font "BentonModDisplay" not loaded');
  for (const img of info.imgs) if (!img.ok) notes.push(`img failed: ${img.src}`);
  for (const bg of info.bgResults) if (!bg.ok) notes.push(`background failed: ${bg.url}`);
  await page.screenshot({ path: path.join(OUT, "home.png") });
  notes.push(...errors);
  record("home", notes.length === 0, notes);
  await page.close();
}

/* ---- nav loop: catalog → directory → live → back → back → popstate ---- */
{
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}cockpit`, { waitUntil: "networkidle" });
  await page.waitForSelector(".mh-project-card", { timeout: 10000 });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  const assertLoc = (expect, label) => {
    const loc = new URL(page.url());
    if (!loc.pathname.startsWith(BASE)) notes.push(`${label}: left base (${loc.pathname})`);
    if (loc.pathname.startsWith("/assets/pages/")) notes.push(`${label}: navigated to original route (${loc.pathname})`);
    if (!loc.pathname.endsWith(expect.split("?")[0].replace(BASE, "")) && expect !== loc.pathname + loc.search) {
      /* soft path check below */
    }
    return loc.pathname + loc.search;
  };
  const assertBoot = async (label) => {
    const now = await page.evaluate(() => window.__mhHostBoot);
    if (now !== boot) notes.push(`${label}: full reload (__mhHostBoot changed)`);
  };

  await page.click('.mh-project-card:has-text("City Strategy") .mh-project-card__cta');
  await page.waitForSelector(".mh-project-directory", { timeout: 5000 });
  let loc = assertLoc("directory", "after project click");
  if (!loc.includes("project=city")) notes.push(`after project click: unexpected URL ${loc}`);
  await assertBoot("after project click");

  await page.click(".mh-report-row__open >> nth=0");
  await page.waitForSelector(".mh-live", { timeout: 5000 });
  loc = assertLoc("live", "after open click");
  if (!loc.includes("dashboard=0")) notes.push(`after open click: unexpected URL ${loc}`);
  if (!(await page.locator(".mh-sixcity").count())) notes.push("live view: city-invest embed missing");
  await assertBoot("after open click");

  await page.click(".mh-live-back");
  await page.waitForSelector(".mh-project-directory", { timeout: 5000 });
  loc = assertLoc("directory", "after live back");
  if (!loc.includes("project=city")) notes.push(`after live back: unexpected URL ${loc}`);
  await assertBoot("after live back");

  await page.click(".mh-project-directory__back");
  await page.waitForSelector(".mh-project-card", { timeout: 5000 });
  loc = assertLoc("catalog", "after directory back");
  if (loc.includes("project=")) notes.push(`after directory back: unexpected URL ${loc}`);
  await assertBoot("after directory back");

  await page.goBack();
  await page.waitForSelector(".mh-project-directory", { timeout: 5000 });
  loc = assertLoc("directory", "after popstate");
  if (!loc.includes("project=city")) notes.push(`after popstate: unexpected URL ${loc}`);
  await assertBoot("after popstate");

  await page.screenshot({ path: path.join(OUT, "cockpit-directory.png") });
  notes.push(...errors);
  record("nav-loop", notes.length === 0, notes);
  await page.close();
}

/* ---- coverage: unrebuilt route shows the notice, stays under the base ---- */
{
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".mh-header__link", { timeout: 10000 });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  await page.click('.mh-header__link:has-text("AI Interpreter")');
  await page.waitForSelector(".host-coverage", { timeout: 5000 });
  const loc = page.url();
  if (!new URL(loc).pathname.startsWith(BASE)) notes.push(`coverage left base: ${loc}`);
  if (new URL(loc).pathname.startsWith("/assets/pages/")) notes.push(`coverage hit original route: ${loc}`);
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("coverage reloaded the page");
  const text = await page.locator(".host-coverage").innerText();
  if (!/not yet rebuilt/i.test(text)) notes.push(`coverage notice text missing: ${text.slice(0, 80)}`);
  notes.push(...errors);
  record("coverage", notes.length === 0, notes);
  await page.close();
}

/* ---- home-flow: assistant history fill → disabled ASK → submit → session ---- */
{
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".mh-launcher", { timeout: 10000 });
  const expectedPrompt = ASSISTANT.history[0].prompt;
  const panel = page.locator(".mh-assistant");
  const box = panel.locator("textarea");
  const ask = panel.locator(".mh-assistant__send button");

  await page.click(".mh-launcher");
  await page.waitForSelector(".mh-assistant", { timeout: 5000 });
  await panel.locator('button[aria-label="History"]').click();
  await page.waitForSelector(".mh-assistant__history-item", { timeout: 5000 });
  await page.locator(".mh-assistant__history-item").first().click();
  const filled = await box.inputValue();
  if (filled !== expectedPrompt) {
    notes.push(`history pick filled "${filled.slice(0, 60)}" — expected "${expectedPrompt.slice(0, 60)}"`);
  }
  if (!(await ask.isDisabled())) notes.push("ASK not disabled after history pick");
  await box.fill("typed follow-up");
  if (await ask.isDisabled()) notes.push("ASK still disabled after typing");
  await ask.click();
  await page.waitForSelector(".mh-assistant__answer", { timeout: 5000 });
  if ((await box.inputValue()) !== "") notes.push("prompt not cleared after submit");
  await page.screenshot({ path: path.join(OUT, "home-flow-answer.png") });

  /* close → reopen keeps the answer; new session clears it */
  await panel.locator('button[aria-label="Close assistant"]').last().click();
  await page.waitForSelector(".mh-assistant", { state: "detached", timeout: 5000 });
  await page.click(".mh-launcher");
  await page.waitForSelector(".mh-assistant", { timeout: 5000 });
  if (!(await panel.locator(".mh-assistant__answer").count())) notes.push("answer lost across close → reopen");
  await panel.locator('button[aria-label="New session"]').click();
  if (await panel.locator(".mh-assistant__answer").count()) notes.push("answers survived new session");
  if ((await box.inputValue()) !== "") notes.push("prompt not cleared by new session");

  /* skill menu → "Add from Chat History" opens the model-flow dialog */
  await panel.locator('button[aria-label="Choose AI skill"]').click();
  await page.waitForSelector(".mh-skill", { timeout: 5000 });
  await panel.locator(".mh-skill__category", { hasText: "Analytical Model" }).click();
  await page.waitForSelector(".mh-skill__detail", { timeout: 5000 });
  await panel.locator(".mh-skill__action", { hasText: "Add from Chat History" }).click();
  await page.waitForSelector(".mh-flow", { timeout: 5000 });
  if (!(await page.locator(".mh-flow").innerText()).includes("Generate Analytical Model")) {
    notes.push("model flow dialog missing the history step title");
  }
  await page.screenshot({ path: path.join(OUT, "home-flow-skill.png") });
  await page.locator(".mh-flow button[aria-label='Close']").click();
  if (await page.locator(".mh-flow").count()) notes.push("model flow dialog did not close");

  notes.push(...errors);
  record("home-flow", notes.length === 0, notes);
  await page.close();
}

/* ---- sentinel: host elements identical with and without the design system ---- */
{
  const props = ["fontFamily", "boxSizing", "padding", "border", "backgroundColor", "color", "textDecorationLine"];
  const snapshot = (sel) => `(() => { const el = document.querySelector("${sel}"); if (!el) return null; const cs = getComputedStyle(el); return ${JSON.stringify(props)}.map((k) => cs[k]).join("|"); })()`;
  const notes = [];
  const { page: bare } = await newPage();
  await bare.goto(`${origin}${BASE}sentinel`, { waitUntil: "networkidle" });
  await bare.waitForSelector(".host-btn", { timeout: 10000 });
  const bareStyles = {};
  for (const sel of [".host-btn", ".host-link", ".host-input"]) bareStyles[sel] = await bare.evaluate(snapshot(sel));
  await bare.screenshot({ path: path.join(OUT, "sentinel.png") });
  await bare.close();

  const { page: compose } = await newPage();
  await compose.goto(`${origin}${BASE}compose`, { waitUntil: "networkidle" });
  await compose.waitForSelector(".host-btn", { timeout: 10000 });
  for (const sel of [".host-btn", ".host-link", ".host-input"]) {
    const onCompose = await compose.evaluate(snapshot(sel));
    if (onCompose !== bareStyles[sel]) notes.push(`${sel}: sentinel=${bareStyles[sel]} vs compose=${onCompose}`);
  }
  await compose.close();
  record("sentinel", notes.length === 0, notes);
}

/* ---- dual instances ---- */
{
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}compose`, { waitUntil: "networkidle" });
  await page.waitForSelector(".host-cell .mh-sixcity", { timeout: 10000 });

  const cellA = page.locator('.host-cell[data-instance="a"]').first();
  const cellB = page.locator('.host-cell[data-instance="b"]').first();

  /* dashboards: change the End filter in A, B's stays "Q8" */
  const bEnd = cellB.locator(".mh-sc-fval__txt").first();
  const bEndBefore = (await bEnd.innerText()).trim();
  await cellA.locator(".mh-sc-fval").first().click();
  await cellA.locator(".mh-sc-panel .mh-sc-prow").nth(1).click();
  const aEndAfter = (await cellA.locator(".mh-sc-fval__txt").first().innerText()).trim();
  const bEndAfter = (await bEnd.innerText()).trim();
  if (bEndBefore !== bEndAfter) notes.push(`dashboard B end filter changed ${bEndBefore} → ${bEndAfter}`);
  const aDash = await cellA.locator(".mh-sixcity").innerText();
  const bDash = await cellB.locator(".mh-sixcity").innerText();
  if (!bDash.includes("Alt Visitors")) notes.push("dashboard B missing ALT KPI labels");
  if (aDash.includes("Alt Visitors")) notes.push("dashboard A shows ALT labels");
  if (aEndAfter === bEndAfter) notes.push(`dashboard A end filter did not change (still ${aEndAfter})`);

  /* copilots: click first recommendation in both, both answers complete */
  const copA = page.locator('.host-copilot[data-instance="a"] .mh-copilot');
  const copB = page.locator('.host-copilot[data-instance="b"] .mh-copilot');
  await copA.locator(".mh-copilot__rec").first().click();
  await copB.locator(".mh-copilot__rec").first().click();
  await page.waitForFunction(() => document.querySelector('.host-copilot[data-instance="a"] .mh-copilot')?.innerText.includes("Investment Holistic Analysis"), null, { timeout: 15000 });
  await page.waitForFunction(() => document.querySelector('.host-copilot[data-instance="b"] .mh-copilot')?.innerText.includes("Alt Holistic Report"), null, { timeout: 15000 });
  const aHolistic = await copA.innerText();
  const bHolistic = await copB.innerText();
  if (!aHolistic.includes("COACH Pilot City")) notes.push("copilot A holistic incomplete");
  if (!bHolistic.includes("Metro Pilot")) notes.push("copilot B holistic incomplete");
  if (aHolistic.includes("Alt Holistic")) notes.push("copilot A leaked ALT content");
  if (bHolistic.includes("COACH")) notes.push("copilot B leaked real content");

  /* ask in A — B's thread stays empty */
  const aBox = copA.locator("textarea");
  await aBox.fill("what drove this?");
  await copA.locator(".mh-copilot__send").click();
  await copA.locator(".mh-copilot__entry").first().waitFor({ timeout: 8000 });
  const aEntries = await copA.locator(".mh-copilot__entry").count();
  const bEntries = await copB.locator(".mh-copilot__entry").count();
  const bThread = await copB.innerText();
  if (!aEntries) notes.push("copilot A: no chat entry after ask");
  if (bEntries) notes.push(`copilot B gained ${bEntries} chat entries from A's ask`);
  if (bThread.includes("what drove this?")) notes.push("copilot B received A's question");

  /* BusinessTermView ×2 via useBusinessTermDemo: disable a term in A, B's
     cards/pills stay put; search in B doesn't touch A; B renders only ALT
     content. */
  const termsA = page.locator('section[aria-label="Business term libraries"] .host-cell[data-instance="a"] .mh-btview');
  const termsB = page.locator('section[aria-label="Business term libraries"] .host-cell[data-instance="b"] .mh-btview');
  await termsA.waitFor({ timeout: 8000 });
  if ((await termsA.locator(".mh-btview__card").count()) !== 6) notes.push("terms A: expected 6 seed cards");
  if ((await termsB.locator(".mh-btview__card").count()) !== 3) notes.push("terms B: expected 2 records + 1 draft");
  const bText = await termsB.innerText();
  if (!bText.includes("Alt Alpha Metric") || !bText.includes("Alt Draft Term")) notes.push("terms B missing ALT content");
  if (bText.includes("GMV (Gross Merchandise Value)") || bText.includes("Add Business Term")) notes.push("terms B shows default demo strings");

  await termsA.locator('[aria-label="Disable GMV (Gross Merchandise Value)"]').click();
  await page.locator(".mh-confirm--confirm").waitFor({ timeout: 8000 });
  await page.locator(".mh-confirm--confirm button:has-text('Confirm Offline')").click();
  const aGmvPill = await termsA.locator('.mh-btview__card:has-text("GMV") .mh-btview__state').innerText();
  if (!aGmvPill.includes("Disabled")) notes.push(`terms A: GMV pill still ${aGmvPill}`);
  if (await page.locator(".mh-confirm").count()) notes.push("confirm dialog did not close");
  if (await termsB.locator(".mh-confirm, .mh-modal").count()) notes.push("terms B opened a dialog from A's action");
  if ((await termsB.locator(".mh-btview__card").count()) !== 3) notes.push("terms B cards changed by A's disable");

  await termsB.locator(".mh-btview__search input").fill("beta");
  await page.waitForTimeout(300);
  if ((await termsB.locator(".mh-btview__card").count()) !== 1) notes.push("terms B search did not narrow to 1 card");
  if ((await termsA.locator(".mh-btview__card").count()) !== 6) notes.push("terms A cards changed by B's search");

  await page.screenshot({ path: path.join(OUT, "compose.png"), fullPage: true });
  notes.push(...errors);
  record("dual", notes.length === 0, notes);
  await page.close();
}

/* ---- unmapped demo link: raw /assets/pages href → coverage under the base ---- */
{
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}compose`, { waitUntil: "networkidle" });
  await page.waitForSelector(".host-copilot .mh-copilot", { timeout: 10000 });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  /* The generic chat entry renders "Open report context" with the original
     knowledge.html href — a raw demo route that never passes through the
     page-level href builders. */
  const copA = page.locator('.host-copilot[data-instance="a"] .mh-copilot');
  await copA.locator("textarea").fill("what drove this?");
  await copA.locator(".mh-copilot__send").click();
  await copA.locator(".mh-copilot__entry").first().waitFor({ timeout: 8000 });
  const link = copA.locator('a:has-text("Open report context")').first();
  const href = await link.getAttribute("href");
  if (!href || !href.includes("/assets/pages/")) notes.push(`expected a raw demo href, got ${href}`);
  await link.click();
  await page.waitForSelector(".host-coverage", { timeout: 5000 });
  const loc = new URL(page.url());
  if (!loc.pathname.startsWith(`${BASE}coverage/`)) notes.push(`unmapped link landed off-base: ${loc.pathname}`);
  if (loc.pathname.startsWith("/assets/pages/")) notes.push(`unmapped link hit the original route: ${loc.pathname}`);
  if (!(await page.locator(".host-coverage").innerText()).match(/not yet rebuilt/i)) notes.push("coverage notice missing");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("unmapped link reloaded the page");
  notes.push(...errors);
  record("coverage-unmapped", notes.length === 0, notes);
  await page.close();
}

await browser.close();
server.close();

writeFileSync(
  path.join(OUT, "results.json"),
  JSON.stringify({ stamp, checks: results, failed: failures }, null, 2) + "\n",
);
console.log(`\n${results.length - failures}/${results.length} host checks pass — output: ${OUT}`);
process.exit(failures ? 1 : 0);
