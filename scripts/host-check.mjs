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
 *   coverage    — an unrebuilt route shows the coverage notice under the base
 *   campaign    — the real Campaign route shares Storybook's task/assistant flow
 *   home-flow   — Home assistant via useHomeDemo: history pick fills the
 *                 prompt with ASK disabled, typing re-enables, submit shows
 *                 an answer, close→reopen keeps it, new session clears, and
 *                 the skill menu opens the model-flow dialog
 *   sentinel    — host-owned elements retain computed styles outside the
 *                 library and inside compose, Hero children and Modal children
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

const HOST = path.join(ROOT, "examples", "host");
const DIST = path.join(HOST, "dist");
const HOST_PATHS = ["src/design", "examples/host", "package.json", "package-lock.json"];
const PORT = Number(process.env.MH_HOST_PORT || 4618);
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

// Each check below runs in its own try block: a timeout in one records a
// "crashed:" failure and the remaining checks still run and report.
async function newPage() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  const errors = watchPage(page);
  return { page, errors };
}

/* ---- home: clean load, fonts, images ---- */
try {
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
} catch (error) {
  record("crashed: home", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- nav loop: catalog → directory → live → back → back → popstate ---- */
try {
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

  /* report-core.js:1504–1509 uses a button: Knowledge opens the drawer
     without navigating to the Interpreter route. */
  await page.getByRole("button", { name: "Open knowledge for Invest City Strategy Analysis" }).click();
  await page.locator(".mh-details[role='dialog']").waitFor({ state: "visible", timeout: 5000 });
  if (!page.url().includes("project=city")) notes.push("Knowledge action changed the route instead of opening report details");
  await page.getByRole("button", { name: "Close report details" }).click();
  await page.locator(".mh-details[role='dialog']").waitFor({ state: "detached", timeout: 5000 });

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
} catch (error) {
  record("crashed: nav loop", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- coverage: unrebuilt route shows the notice, stays under the base ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".mh-header__link", { timeout: 10000 });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  await page.evaluate(() => {
    window.history.pushState(null, "", "/mh-host/coverage/assets/pages/unrebuilt.html");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
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
} catch (error) {
  record("crashed: coverage", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- campaign-flow: all sections, retained task draft, assistant answer ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  await page.click('.mh-header__link:has-text("RedNote Campaign Tool")');
  await page.waitForSelector(".mh-campaign", { timeout: 5000 });
  for (const [label, heading] of [
    ["Execution", "RedNote Campaign Tool"],
    ["Assets", "Creative Asset"],
    ["Analytics", "Analytics"],
    ["Accounts", "Account Binding"],
  ]) {
    await page.locator(".mh-rail__item", { hasText: label }).click();
    if (!(await page.locator(".mh-campaign main").innerText()).includes(heading)) notes.push(`${label} section missing ${heading}`);
  }
  await page.locator(".mh-rail__item", { hasText: "Execution" }).click();
  await page.locator(".mh-heading--view .mh-button--primary").click();
  await page.locator(".mh-task-dialog input[name='object']").fill("12 plans");
  await page.locator(".mh-task-dialog select[name='platform']").selectOption("Douyin");
  await page.locator(".mh-task-dialog__footer .mh-button--secondary").click();
  await page.locator(".mh-heading--view .mh-button--primary").click();
  if (await page.locator(".mh-task-dialog input[name='object']").inputValue() !== "12 plans") notes.push("task draft object reset after reopen");
  if (await page.locator(".mh-task-dialog select[name='platform']").inputValue() !== "Douyin") notes.push("task draft platform reset after reopen");
  await page.locator(".mh-task-dialog__footer .mh-button--primary").click();
  if (!(await page.locator(".mh-toast").innerText()).includes("Campaign task added")) notes.push("submit toast missing");
  await page.locator(".mh-launcher").click();
  await page.locator(".mh-assistant__suggestions button").first().click();
  if (!(await page.locator(".mh-assistant__answer--workspace").innerText()).includes("AI Response")) notes.push("assistant answer missing");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("Campaign navigation reloaded host");
  notes.push(...errors);
  record("campaign-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: campaign-flow", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- R6 semantic routes: Home capability params and Interpreter overview ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  const dg = page.getByRole("link", { name: "DG Data Insight" });
  const dgHref = await dg.getAttribute("href");
  if (dgHref !== `${BASE}cockpit?project=rednote`) notes.push(`DG capability lost project parameter: ${dgHref}`);
  // The new-tab modifier is Cmd on macOS but Ctrl on Linux/Windows (CI).
  await dg.click({ modifiers: ["ControlOrMeta"] });
  if (new URL(page.url()).pathname !== BASE) notes.push("modified capability click changed the current tab");
  await dg.click();
  await page.waitForSelector(".mh-project-directory", { timeout: 5000 });
  if (new URL(page.url()).searchParams.get("project") !== "rednote") notes.push("DG capability opened wrong project");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("DG capability reloaded host");
  await page.goto(`${origin}${BASE}interpreter?type=Business%20Term`, { waitUntil: "networkidle" });
  const interpreterBoot = await page.evaluate(() => window.__mhHostBoot);
  const overview = page.locator(".mh-sidebar-item[href]");
  if ((await overview.getAttribute("href")) !== `${BASE}interpreter`) notes.push("Overview has no semantic host href");
  await overview.click();
  await page.waitForSelector(".mh-type-grid", { timeout: 5000 });
  const url = new URL(page.url());
  if (url.pathname !== `${BASE}interpreter` || url.searchParams.has("type")) notes.push(`Overview route wrong: ${url.pathname}${url.search}`);
  if ((await page.evaluate(() => window.__mhHostBoot)) !== interpreterBoot) notes.push("Overview reloaded host");
  notes.push(...errors);
  record("semantic-navigation", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: R6 semantic routes", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- home-flow: assistant history fill → enabled ASK → submit → session ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".mh-launcher", { timeout: 10000 });
  const expectedPrompt = "What's the ROI trend across my active campaigns this quarter?";
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
  if (await ask.isDisabled()) notes.push("ASK disabled after history pick");
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
} catch (error) {
  record("crashed: home-flow", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- Self-Service: query route, shared demo hook, answer and model flow ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}self-service?tab=upload`, { waitUntil: "networkidle" });
  if (!page.url().includes("/mh-host/self-service?tab=upload")) notes.push("query route left host base");
  if (!(await page.locator(".mh-page__cards--upload").count())) notes.push("upload tab did not render");
  await page.locator(".mh-launcher").click();
  await page.waitForSelector(".mh-assistant--drawer", { timeout: 5000 });
  await page.locator(".mh-assistant__suggestions button").first().click();
  await page.waitForSelector(".mh-assistant__answer--workspace", { timeout: 5000 });
  if (!(await page.locator(".mh-assistant__answer-banner").innerText()).includes("Context: Reports")) notes.push("report answer context missing");
  await page.screenshot({ path: path.join(OUT, "self-service-answer.png") });
  await page.locator(".mh-assistant__skill").click();
  await page.locator(".mh-skill__category", { hasText: "Analytical Model" }).click();
  await page.locator(".mh-skill__action", { hasText: "Create Analytical Model Manually" }).click();
  await page.waitForSelector(".mh-flow__card--form", { timeout: 5000 });
  if (!(await page.locator(".mh-flow__card--form").innerText()).includes("Create Analytical Model Manually")) notes.push("manual model flow missing");
  await page.locator(".mh-flow button[aria-label='Close']").click();
  notes.push(...errors);
  record("self-service-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: Self-Service", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P04: the same import/submit hook in the standalone routed host ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}self-service?tab=upload`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  await page.locator(".mh-page__cards--upload a.mh-button").first().click();
  await page.locator(".mh-upload__form").waitFor({ timeout: 5000 });
  if (new URL(page.url()).pathname !== `${BASE}data-upload`) notes.push("upload card did not reach Data Upload inside host");
  if ((await page.locator(".mh-upload__grid input").count()) !== 14) notes.push("14 source fields missing");
  await page.locator(".mh-upload__form .mh-button--gold").click();
  if (!(await page.locator(".mh-upload__form .mh-button--gold").innerText()).includes("Submitted")) notes.push("submit feedback missing");
  await page.waitForFunction(() => {
    const button = document.querySelector(".mh-upload__form .mh-button--gold");
    return button && !button.disabled && button.textContent.trim() === "Submit";
  }, null, { timeout: 5000 });
  await page.locator(".mh-upload__toolbar .mh-button--secondary").click();
  await page.locator(".mh-modal .mh-dropzone").waitFor({ timeout: 5000 });
  const picker = page.waitForEvent("filechooser");
  await page.locator(".mh-dropzone").click();
  await (await picker).setFiles({ name: "city-sales.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buffer: Buffer.from("demo") });
  if (!(await page.locator(".mh-dropzone__hint").innerText()).includes("Selected: city-sales.xlsx")) notes.push("selected file did not update host dialog");
  await page.screenshot({ path: path.join(OUT, "p04-data-upload-selected.png") });
  await page.keyboard.press("Escape");
  if (await page.locator(".mh-modal").count()) notes.push("Escape did not close Template Import");
  await page.locator(".mh-upload__toolbar .mh-button--secondary").click();
  if (!(await page.locator(".mh-dropzone__hint").innerText()).includes("Selected: city-sales.xlsx")) notes.push("reopening import lost selected file");
  await page.keyboard.press("Escape");
  await page.locator(".mh-upload__back").click();
  if (!page.url().endsWith("/mh-host/self-service?tab=upload")) notes.push("Back did not preserve upload tab");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("P04 navigation reloaded host");
  notes.push(...errors);
  record("p04-data-upload-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P04", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- Interpreter: existing routed type view plus knowledge assistant ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}interpreter?type=Business%20Term`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  if (!(await page.locator('.mh-interpreter__main[data-active-type="Business Term"]').count())) notes.push("typed Interpreter view missing");
  await page.locator(".mh-launcher").click();
  await page.waitForSelector(".mh-assistant--drawer", { timeout: 5000 });
  await page.locator(".mh-assistant__suggestions button").first().click();
  await page.waitForSelector(".mh-assistant__answer--workspace", { timeout: 5000 });
  if (!(await page.locator(".mh-assistant__answer-banner").innerText()).includes("Context: Knowledge Base")) notes.push("knowledge answer context missing");
  await page.locator(".mh-assistant__skill").click();
  await page.locator(".mh-skill__category", { hasText: "Analytical Model" }).click();
  if ((await page.locator(".mh-skill__option").count()) !== 1) notes.push("knowledge data-backed skill count is not one");
  await page.locator(".mh-skill__action", { hasText: "Add from Chat History" }).click();
  await page.waitForSelector(".mh-flow__card--history", { timeout: 5000 });
  await page.keyboard.press("Escape");
  if (await page.locator(".mh-flow").count()) notes.push("top model flow survived Escape");
  if (!(await page.locator(".mh-assistant").count())) notes.push("assistant closed before top flow");
  await page.keyboard.press("Escape");
  if (await page.locator(".mh-assistant").count()) notes.push("assistant survived second Escape");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("Interpreter assistant reloaded host");
  if (!page.url().includes("interpreter?type=Business%20Term")) notes.push("Interpreter type route changed during assistant flow");
  await page.screenshot({ path: path.join(OUT, "interpreter-assistant.png") });
  notes.push(...errors);
  record("interpreter-assistant-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: Interpreter", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- Personal Memory: category, edit, create, delete and lite assistant ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}personal-memory`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  if ((await page.locator(".mh-library-item").count()) !== 18) notes.push("Personal Memory source records missing");
  await page.getByRole("tab", { name: /Others 3/ }).click();
  if ((await page.locator(".mh-library-item").count()) !== 3) notes.push("Others category should have three records");
  await page.locator('.mh-library-item:has-text("Campaign naming convention") .mh-library-item__title button').click();
  if (!(await page.locator(".mh-memory-workspace__detail h3").count())) notes.push("memory detail did not open");
  await page.locator(".mh-memory-workspace__actions button:has-text('Edit')").click();
  await page.locator(".mh-memory-workspace__field input").fill("Edited reference memory");
  await page.getByRole("button", { name: "Save Changes" }).click();
  if (!(await page.locator(".mh-memory-workspace__detail h3").innerText()).includes("Edited reference memory")) notes.push("memory edit did not save");
  await page.getByRole("button", { name: /New Memory/ }).click();
  await page.getByRole("button", { name: "Save Memory" }).click();
  if ((await page.locator('.mh-memory-page__form [aria-invalid="true"]').count()) !== 2) notes.push("create required validation missing");
  await page.getByRole("button", { name: "AI Auto-fill" }).click();
  if (!(await page.locator(".mh-memory-page__form textarea").inputValue()) || (await page.locator('.mh-memory-page__form [aria-invalid="true"]').count()) !== 1) notes.push("AI Auto-fill did not fill the description and clear its error");
  await page.locator('.mh-memory-page__form input').fill("Host analysis memory");
  await page.locator('.mh-memory-page__form textarea').fill("Created while the Others filter remains selected.");
  await page.getByRole("button", { name: "Save Memory" }).click();
  if ((await page.locator(".mh-library-item").count()) !== 3) notes.push("cross-category create changed visible filter");
  if (!(await page.locator(".mh-memory-workspace__detail h3").innerText()).includes("Host analysis memory")) notes.push("cross-category create did not select new detail");
  await page.getByRole("button", { name: "Delete Memory" }).click();
  await page.locator(".mh-confirm__btn--primary").click();
  if (await page.locator(".mh-memory-workspace__detail h3").count()) notes.push("deleting selected memory retained detail");
  if (!(await page.locator(".mh-toast", { hasText: "Deleted successfully" }).count())) notes.push("memory delete showed no toast");
  await page.getByRole("button", { name: "Open AI assistant" }).click();
  await page.locator(".mh-assistant__suggestions button").first().click();
  if (await page.locator(".mh-assistant__answer").count()) notes.push("lite suggestion submitted before Ask");
  await page.locator(".mh-assistant__box textarea").press("Enter");
  if (await page.locator(".mh-assistant__answer").count()) notes.push("lite assistant Enter submitted against source behavior");
  await page.locator(".mh-assistant__send button").click();
  if (!(await page.locator(".mh-assistant__answer").count())) notes.push("memory assistant Ask did not submit");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("Personal Memory host reloaded");
  notes.push(...errors);
  await page.screenshot({ path: path.join(OUT, "personal-memory.png") });
  record("personal-memory-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: Personal Memory", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P15 Skill Library: same private flow as Storybook, routed under host ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}scenario-library`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  if ((await page.locator(".mh-skill-page tbody tr").count()) !== 9) notes.push("Skill Library should show nine source records");
  await page.locator(".mh-library-toolbar__search input").fill("Emily Wang");
  if ((await page.locator(".mh-skill-page tbody tr").count()) !== 2) notes.push("Skill owner search missed two Emily Wang rows");
  await page.locator(".mh-library-toolbar__search input").fill("");
  await page.locator(".mh-skill-page tbody tr").first().click();
  if (!(await page.locator(".mh-skill-detail .mh-scenario-structure__item").count() === 5)) notes.push("Skill detail missed five structure blocks");
  await page.getByRole("button", { name: "Show Preview" }).click();
  if (!(await page.locator(".mh-skill-detail .mh-scenario-preview__body").count())) notes.push("Skill preview did not open");
  await page.keyboard.press("Escape");
  if (await page.locator(".mh-skill-detail").count()) notes.push("Skill detail survived Escape");
  await page.locator(".mh-skill-page tbody tr").first().click();
  await page.locator(".mh-skill-detail__actions .mh-button--danger").click();
  await page.locator(".mh-confirm__btn--primary").click();
  if ((await page.locator(".mh-skill-page tbody tr").count()) !== 8) notes.push("Confirmed delete did not remove the skill");
  if (!((await page.locator(".mh-toast").textContent()) || "").includes("Deleted successfully")) notes.push("Delete did not show its toast");
  if (await page.locator(".mh-skill-detail").count()) notes.push("Delete left the detail drawer open");
  await page.locator(".mh-library-toolbar__facet select").selectOption("Under Review");
  await page.locator(".mh-library-toolbar__search input").fill("no match");
  await page.getByRole("button", { name: "Clear filters" }).click();
  if ((await page.locator(".mh-skill-page tbody tr").count()) !== 8) notes.push("Clear filters did not restore the list");
  await page.locator(".mh-library-toolbar__create button").click();
  if (!(await page.locator(".mh-skill-form__structure-item").count() === 5)) notes.push("Inline create missed five structure fields");
  await page.locator(".mh-skill-form__field input").first().fill("Host skill");
  await page.locator(".mh-skill-form__footer button").first().click();
  await page.locator(".mh-library-toolbar__create button").click();
  if ((await page.locator(".mh-skill-form__field input").first().inputValue()) !== "") notes.push("Fresh create retained old draft values");
  await page.locator(".mh-skill-form__footer button").first().click();
  await page.locator('.mh-governance-nav a[href$="/review-center"]').click();
  if (!page.url().includes("/mh-host/review-center")) notes.push("Skill governance sidebar missed Review Center route");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("Skill route navigation reloaded host");
  notes.push(...errors);
  await page.screenshot({ path: path.join(OUT, "scenario-library.png") });
  record("scenario-library-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P15 Skill Library", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- Review Center queue, decisions, assistant and navigation ---- */
/* ---- Skill Edit: seeded scope, report link, preview, validation, submit ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}scenario-edit?id=scenario-campaign-review`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  if ((await page.locator('.mh-scenario-edit-form__field input').first().inputValue()) !== "Campaign Review Reporting") notes.push("known scenario did not prefill name");
  if ((await page.locator('.mh-scenario-edit-form__field select').first().inputValue()) !== "DC Media Performance") notes.push("unsupported source scope was lost on edit");
  await page.locator('.mh-scenario-edit-form__card-body select').selectOption("Source Integrity Monitor");
  const reportHref = await page.locator('.mh-scenario-edit-form__card-body a').getAttribute("href");
  if (!reportHref?.includes("cockpit?project=ottolv&dashboard=1")) notes.push(`selected report link did not update: ${reportHref}`);
  await page.getByRole("button", { name: "Run Preview" }).click();
  if (!(await page.locator('.mh-scenario-edit-form__preview-body pre').innerText()).includes("Summarize delivery")) notes.push("preview did not use seeded logic");
  await page.locator('.mh-scenario-edit-form__field textarea').fill("");
  await page.getByRole("button", { name: "Submit for Review" }).click();
  if ((await page.locator('.mh-scenario-edit-form__field [aria-invalid="true"]').count()) !== 1) notes.push("purpose validation did not appear");
  if (!(await page.locator('.mh-scenario-edit-form__field textarea').evaluate((field) => field === document.activeElement))) notes.push("first invalid field did not receive focus");
  await page.locator('.mh-scenario-edit-form__field textarea').fill("Reviewed campaign results.");
  let alertMessage = null;
  page.once("dialog", (dialog) => { alertMessage = dialog.message(); void dialog.accept(); });
  await page.getByRole("button", { name: "Submit for Review" }).click();
  if (alertMessage !== "Scenario submitted for review successfully!") notes.push("source success alert was not shown");
  if (!page.url().includes("scenario-library")) notes.push("valid submit did not navigate to Skill Library");
  await page.goBack({ waitUntil: "domcontentloaded" });
  await page.locator('.mh-scenario-edit-form__actions a').click();
  if (!page.url().includes("scenario-library")) notes.push("Cancel did not navigate to Skill Library");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("Skill Edit reloaded host");
  notes.push(...errors);
  await page.screenshot({ path: path.join(OUT, "scenario-edit.png") });
  record("scenario-edit-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: Skill Edit", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- Review Center queue, decisions, assistant and navigation ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}review-center`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  const reviewRows = page.locator(".mh-review-page tbody tr:not(.mh-table__empty-row)");
  if ((await reviewRows.count()) !== 6) notes.push("Review Center pending queue should have six records");
  await page.locator('.mh-library-toolbar__facet:has-text("Type") select').selectOption("Data Model");
  if ((await reviewRows.count()) !== 2) notes.push("Review Center type filter missed Data Model rows");
  await page.locator('.mh-library-toolbar__facet:has-text("Type") select').selectOption("");
  await page.locator('.mh-library-toolbar__facet:has-text("Submitted") select').selectOption("today");
  if ((await reviewRows.count()) !== 3) notes.push("Submitted Today should keep the three records submitted today (D01)");
  await page.locator('.mh-library-toolbar__facet:has-text("Submitted") select').selectOption("");
  await page.locator('.mh-review-page tbody tr:has-text("Campaign investment decision principles") .mh-table__open').click();
  if (!(await page.getByRole("dialog", { name: "Campaign investment decision principles" }).count())) notes.push("Review Center detail did not open");
  await page.keyboard.press("Escape");
  if (await page.getByRole("dialog", { name: "Campaign investment decision principles" }).count()) notes.push("Review Center detail survived Escape");
  await page.getByRole("button", { name: "Reject Campaign investment decision principles" }).click();
  await page.getByRole("button", { name: "Confirm Reject" }).click();
  if ((await reviewRows.count()) !== 5) notes.push("empty-reason Reject did not remove pending record");
  if ((await page.locator(".mh-review-page__stats article").nth(2).locator("strong").innerText()) !== "1") notes.push("Rejected summary should count the rejected record");
  if (!(await page.locator(".mh-toast").innerText()).includes("Rejected")) notes.push("Reject did not confirm with a toast");
  await page.getByRole("tab", { name: "Rejected 1" }).click();
  if ((await reviewRows.count()) !== 1) notes.push("Rejected tab did not list the rejected record");
  await page.locator(".mh-launcher").click();
  await page.locator(".mh-assistant__suggestions button").first().click();
  if (await page.locator(".mh-assistant__answer").count()) notes.push("lite suggestion submitted unexpectedly");
  await page.getByRole("button", { name: "Ask" }).click();
  if (!(await page.locator(".mh-assistant__answer--simple").count())) notes.push("lite answer missing after Ask");
  await page.keyboard.press("Escape");
  await page.locator('.mh-governance-nav a[href$="/interpreter"]').click();
  if (!page.url().includes("/mh-host/interpreter")) notes.push("governance sidebar anchor missed Interpreter route");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("Review Center navigation reloaded host");
  notes.push(...errors);
  await page.screenshot({ path: path.join(OUT, "review-center.png") });
  record("review-center-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: Review Center queue, decisions, assistant and navigation", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- Feedback & Quality: source filters/detail plus restored assistant ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}feedback-quality`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  if ((await page.locator(".mh-feedback-page tbody tr").count()) !== 15) notes.push("Feedback list should show fifteen source records");
  await page.getByLabel("Feedback Type").selectOption("thumbs-down");
  if ((await page.locator(".mh-feedback-page tbody tr").count()) !== 5) notes.push("Thumbs Down filter missed five records");
  await page.getByRole("tab", { name: /All Feedback/ }).click();
  if ((await page.locator(".mh-feedback-page tbody tr").count()) !== 15) notes.push("All Feedback did not reset Type");
  await page.locator(".mh-feedback-page tbody tr").nth(2).click();
  if (!(await page.locator(".mh-feedback-page__detail-reason").count())) notes.push("negative detail did not show full reason");
  await page.keyboard.press("Escape");
  if (await page.locator(".mh-feedback-page__detail-reason").count()) notes.push("feedback detail survived Escape");
  await page.getByRole("button", { name: "Open AI assistant" }).click();
  await page.locator(".mh-assistant__suggestions button").first().click();
  if (await page.locator(".mh-assistant__answer").count()) notes.push("P13 suggestion submitted before Ask");
  await page.locator(".mh-assistant__box textarea").press("Enter");
  if (!(await page.locator(".mh-assistant__answer").count())) notes.push("P13 Enter did not submit grounded answer");
  await page.keyboard.press("Escape");
  await page.locator('.mh-governance-nav a[href$="/review-center"]').click();
  if (!page.url().includes("/mh-host/review-center")) notes.push("Feedback sidebar missed Review Center route");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("Feedback navigation reloaded host");
  notes.push(...errors);
  await page.screenshot({ path: path.join(OUT, "feedback-quality.png") });
  record("feedback-quality-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: Feedback & Quality", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- sentinel: host elements identical with and without the design system ---- */
try {
  const props = ["fontFamily", "boxSizing", "padding", "border", "backgroundColor", "color", "textDecorationLine"];
  const snapshot = (sel) => `(() => { const el = document.querySelector("${sel}"); if (!el) return null; const cs = getComputedStyle(el); return ${JSON.stringify(props)}.map((k) => cs[k]).join("|"); })()`;
  const notes = [];
  const { page: bare } = await newPage();
  await bare.goto(`${origin}${BASE}sentinel`, { waitUntil: "networkidle" });
  await bare.waitForSelector(".host-btn", { timeout: 10000 });
  const bareStyles = {};
  const selectors = [".host-btn", ".host-link", ".host-input", "[data-testid=host-native-button]", "[data-testid=host-native-link]", "[data-testid=host-native-input]"];
  for (const sel of selectors) bareStyles[sel] = await bare.evaluate(snapshot(sel));
  await bare.screenshot({ path: path.join(OUT, "sentinel.png") });
  await bare.close();

  const { page: compose } = await newPage();
  await compose.goto(`${origin}${BASE}compose`, { waitUntil: "networkidle" });
  await compose.waitForSelector(".host-btn", { timeout: 10000 });
  for (const sel of selectors) {
    const onCompose = await compose.evaluate(snapshot(sel));
    if (onCompose !== bareStyles[sel]) notes.push(`${sel}: sentinel=${bareStyles[sel]} vs compose=${onCompose}`);
  }
  await compose.close();

  const { page: slots } = await newPage();
  await slots.goto(`${origin}${BASE}slot-sentinel`, { waitUntil: "networkidle" });
  await slots.waitForSelector(".host-slot-modal .host-input", { timeout: 10000 });
  for (const slot of [
    ".host-slot-hero", ".host-slot-modal", ".host-slot-nested",
    ".host-slot-drawer .mh-modal__titleline", ".host-slot-drawer .mh-modal__body", ".host-slot-drawer .mh-modal__foot",
  ]) {
    for (const sel of selectors) {
      const inside = await slots.evaluate(snapshot(`${slot} ${sel}`));
      if (inside !== bareStyles[sel]) notes.push(`${slot} ${sel}: sentinel=${bareStyles[sel]} vs slot=${inside}`);
    }
  }
  const dialogBoxes = await slots.locator(".mh-modal__dialog").evaluateAll((dialogs) => dialogs.map((dialog) => ({
    boxSizing: getComputedStyle(dialog).boxSizing,
    cssWidth: parseFloat(getComputedStyle(dialog).width),
    outerWidth: dialog.getBoundingClientRect().width,
  })));
  for (const box of dialogBoxes) {
    if (box.boxSizing !== "border-box" || Math.abs(box.outerWidth - box.cssWidth) > 1) {
      notes.push("Modal dialog frame expanded beyond CSS width: " + JSON.stringify(box));
    }
  }
  await slots.close();
  record("sentinel", notes.length === 0, notes);
} catch (error) {
  record("crashed: sentinel", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- dual instances ---- */
try {
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

  // Both copilots own overlay focus while open. Release them before clicking
  // the libraries below: focus redirection can scroll between pointerdown/up.
  await page.screenshot({ path: path.join(OUT, "compose-copilots.png"), fullPage: true });
  await copA.locator('button[aria-label="Close AI workspace"]').click();
  if (await copA.getAttribute("aria-hidden") !== "true") notes.push("copilot A did not close through the shared demo state");
  if (await copB.getAttribute("aria-hidden") !== "false") notes.push("copilot B closed when A closed");
  await copB.locator('button[aria-label="Close AI workspace"]').click();
  if (await copB.getAttribute("aria-hidden") !== "true") notes.push("copilot B did not close before library interaction");

  /* BusinessTermView ×2 via useBusinessTermDemo: disable a term in A, B's
     cards/pills stay put; search in B doesn't touch A; B renders only ALT
     content. */
  const termsA = page.locator('section[aria-label="Business term libraries"] .host-cell[data-instance="a"] .mh-btview');
  const termsB = page.locator('section[aria-label="Business term libraries"] .host-cell[data-instance="b"] .mh-btview');
  await termsA.waitFor({ timeout: 8000 });
  if ((await termsA.locator(".mh-library-item").count()) !== 6) notes.push("terms A: expected 6 seed cards");
  if ((await termsB.locator(".mh-library-item").count()) !== 3) notes.push("terms B: expected 2 records + 1 draft");
  const bText = await termsB.innerText();
  if (!bText.includes("Alt Alpha Metric") || !bText.includes("Alt Draft Term")) notes.push("terms B missing ALT content");
  if (bText.includes("GMV (Gross Merchandise Value)") || bText.includes("Add Business Term")) notes.push("terms B shows default demo strings");

  await termsA.locator('[aria-label="Disable GMV (Gross Merchandise Value)"]').click();
  await page.locator(".mh-confirm--warning").waitFor({ timeout: 8000 });
  await page.locator(".mh-confirm--warning button:has-text('Confirm Offline')").click();
  const aGmvPill = await termsA.locator('.mh-library-item:has-text("GMV") .mh-library-item__head > .mh-badge').innerText();
  if (!aGmvPill.includes("Disabled")) notes.push(`terms A: GMV pill still ${aGmvPill}`);
  if (await page.locator(".mh-confirm").count()) notes.push("confirm dialog did not close");
  if (await termsB.locator(".mh-confirm, .mh-modal").count()) notes.push("terms B opened a dialog from A's action");
  if ((await termsB.locator(".mh-library-item").count()) !== 3) notes.push("terms B cards changed by A's disable");

  await termsB.locator(".mh-library-toolbar__search input").fill("beta");
  await page.waitForTimeout(300);
  if ((await termsB.locator(".mh-library-item").count()) !== 1) notes.push("terms B search did not narrow to 1 card");
  if ((await termsA.locator(".mh-library-item").count()) !== 6) notes.push("terms A cards changed by B's search");

  await page.screenshot({ path: path.join(OUT, "compose.png"), fullPage: true });
  notes.push(...errors);
  record("dual", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: dual instances", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P08 route: controlled form, validation, editing, navigation ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}knowledge-create`, { waitUntil: "networkidle" });
  await page.locator('.mh-kcreate[data-kc-type="Business Term"]').waitFor();
  const boot = await page.evaluate(() => window.__mhHostBoot);
  await page.locator('.mh-btform button:has-text("Submit")').click();
  if ((await page.locator('.mh-btform__fields>label.is-invalid').count()) !== 2) notes.push("Business Term required errors missing");
  await page.locator('input[name="title"]').fill("New governed term");
  await page.locator('textarea[name="description"]').fill("A deterministic local description.");
  await page.locator('.mh-btform__scope>button').click();
  await page.locator('.mh-btform__scope-menu label:has-text("Marketing")').first().click();
  if (!(await page.locator('.mh-btform__scope>button').innerText()).includes("Marketing")) notes.push("Data Model link selection not reflected");
  await page.locator('.mh-btform__scope>button').click();
  await page.screenshot({ path: path.join(OUT, "knowledge-create.png"), fullPage: true });
  await page.locator('.mh-btform button:has-text("Save")').click();
  await page.locator('.mh-interpreter__main[data-active-type="Business Term"]').waitFor();
  if (!page.url().includes("interpreter?type=Business+Term&notice=saved")) notes.push("BT Save did not navigate to the scoped library with saved notice");
  if (!(await page.locator('.mh-btview').count())) notes.push("BT Save destination did not render its type view");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("P08 form reloaded host");
  notes.push(...errors);
  record("knowledge-create", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P08 route", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* The original Data Model Enter handler double-saves on blur and throws. React
   keeps a single new chip; Escape cancels without a second tag or page error. */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}knowledge-create?type=Data%20Model`, { waitUntil: "networkidle" });
  const row = page.locator(".mh-kcf__table-scroll tbody tr:first-child");
  await row.locator('button[aria-label="Add synonym to channel_id"]').click();
  await row.locator('input[aria-label="New synonym"]').fill("Customer Channel");
  await row.locator('input[aria-label="New synonym"]').press("Enter");
  if ((await row.locator(".mh-kcf__chip").count()) !== 2) notes.push("Enter did not add exactly one synonym chip");
  if (!(await row.innerText()).includes("Customer Channel")) notes.push("entered synonym missing");
  await row.locator('button[aria-label="Add synonym to channel_id"]').click();
  await row.locator('input[aria-label="New synonym"]').fill("Discard me");
  await row.locator('input[aria-label="New synonym"]').press("Escape");
  if ((await row.locator(".mh-kcf__chip").count()) !== 2) notes.push("Escape changed synonym chips");
  if ((await row.locator('input[aria-label="New synonym"]').count()) !== 0) notes.push("Escape left synonym editor open");
  notes.push(...errors);
  record("knowledge-create-synonym-keys", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: block 18", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* P09 copy link has no type parameter; the host must resolve the record. */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}knowledge-create?copy=investment-principles`, { waitUntil: "networkidle" });
  if ((await page.locator('.mh-kcreate[data-kc-type="Principles"][data-kc-mode="copy"]').count()) !== 1) notes.push("copy record did not resolve Principles form");
  if (!(await page.locator('.mh-kcreate h1').innerText()).includes("Copy Knowledge")) notes.push("copy heading missing");
  notes.push(...errors);
  record("knowledge-create-copy", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P09 copy link has no type parameter; the host must resolve t", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* The host router retains one App instance. Query-only P09 edit/copy links
   must remount the form seed so a previous record never leaks into the next. */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}knowledge-create?copy=investment-principles`, { waitUntil: "networkidle" });
  await page.evaluate((next) => { history.pushState(null, "", next); dispatchEvent(new PopStateEvent("popstate")); }, `${BASE}knowledge-create?mode=edit&id=business-term-gmv`);
  await page.locator('.mh-kcreate[data-kc-type="Business Term"][data-kc-mode="edit"]').waitFor();
  if (!(await page.locator('input[name="title"]').inputValue()).includes("GMV")) notes.push("query-only edit retained the previous Principles copy");
  await page.evaluate((next) => { history.pushState(null, "", next); dispatchEvent(new PopStateEvent("popstate")); }, `${BASE}knowledge-create?copy=investment-principles`);
  await page.locator('.mh-kcreate[data-kc-type="Principles"][data-kc-mode="copy"]').waitFor();
  if (!(await page.locator('input[name="title"]').inputValue()).includes("Campaign investment")) notes.push("query-only copy retained the previous Business Term edit");
  notes.push(...errors);
  record("knowledge-create-query-seed", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: block 20", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* Scenario attachment state must come from an actual file input action,
   rather than only a prefilled story value. */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}knowledge-create?type=Scenario%20Reporting`, { waitUntil: "networkidle" });
  await page.locator('.mh-kcf__upload input[type="file"]').setInputFiles({ name: "brief.pdf", mimeType: "application/pdf", buffer: Buffer.from("local demo") });
  if (!(await page.locator(".mh-kcf__upload").innerText()).includes("brief.pdf")) notes.push("Scenario upload did not render an attachment chip");
  await page.locator('button[aria-label="Remove brief.pdf"]').click();
  if ((await page.locator(".mh-kcf__upload").innerText()).includes("brief.pdf")) notes.push("Scenario attachment removal did not update the form");
  notes.push(...errors);
  record("knowledge-create-attachment", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: block 21", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- raw demo href still resolves to the rebuilt P07 route under the base ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}compose`, { waitUntil: "networkidle" });
  await page.waitForSelector(".host-copilot .mh-copilot", { timeout: 10000 });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  /* Copilot source links carry report/asset identity into the Interpreter
     while remaining native links under the host base. */
  const copA = page.locator('.host-copilot[data-instance="a"] .mh-copilot');
  await copA.locator("textarea").fill("what drove this?");
  await copA.locator(".mh-copilot__send").click();
  await copA.locator(".mh-copilot__entry").first().waitFor({ timeout: 8000 });
  const link = copA.locator('a:has-text("Open report context")').first();
  const href = await link.getAttribute("href");
  const target = new URL(href, origin);
  if (target.pathname !== `${BASE}interpreter` || target.searchParams.get("report") !== "city" || target.searchParams.get("asset") !== "city-report-context") notes.push(`copilot context lost report/asset parameters: ${href}`);
  await link.click();
  await page.waitForSelector(".mh-interpreter__main", { timeout: 5000 });
  const loc = new URL(page.url());
  if (loc.pathname !== `${BASE}interpreter`) notes.push(`copilot context missed InterpreterRoute: ${loc.pathname}`);
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("copilot context reloaded the page");
  notes.push(...errors);
  record("copilot-context-link", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: raw demo href still resolves to the rebuilt P07 route under ", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P11: standalone Data Model, normalized URL and live browser ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}data-model?foo=kept&type=Other`, { waitUntil: "networkidle" });
  await page.waitForSelector(".mh-dmview__domains .mh-library-item", { timeout: 10000 });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  const current = new URL(page.url());
  if (current.searchParams.get("type") !== "Data Model" || current.searchParams.get("foo") !== "kept") notes.push(`type normalization lost parameters: ${current.search}`);
  if ((await page.locator(".mh-dmview__domains .mh-library-item").count()) !== 3) notes.push("expected three visible domains");
  await page.locator(".mh-dmview__domains .mh-library-item").nth(1).click();
  if (!(await page.locator(".mh-dmview__basic-name strong").innerText()).includes("DC Media Performance")) notes.push("selected domain not reflected in Basic card");
  await page.locator(".mh-dmview__search input").fill("NO_SUCH_MODEL_123");
  if (!(await page.locator(".mh-dmview__domains .mh-library-empty").innerText()).includes("No matching")) notes.push("empty search not rendered");
  await page.locator(".mh-dmview__search input").fill("");
  await page.locator(".mh-dmview__report").first().click();
  if (await page.locator(".mh-dmview__dialog").count()) notes.push("standalone related report invented a drawer");
  await page.locator(".mh-dmview__tab:has-text('Relationship graph')").click();
  await page.locator(".mh-dmview__node.is-fact").first().click();
  if (!(await page.locator(".mh-dmview__dialog").innerText()).includes("Finance Margin Fact")) notes.push("fact table dialog missing");
  await page.locator(".mh-dmview__dialog-tab:has-text('Data Preview')").click();
  if ((await page.locator(".mh-dmview__dialog tbody tr").count()) !== 10) notes.push("preview row count mismatch");
  await page.keyboard.press("Escape");
  if (await page.locator(".mh-dmview__dialog").count()) notes.push("Escape did not close table detail");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("Data Model route reloaded host");
  await page.screenshot({ path: path.join(OUT, "p11-data-model.png"), fullPage: true });
  notes.push(...errors);
  record("p11-data-model", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P11", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P10 standalone route: hook, form process and host URLs ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}metric-dictionary`, { waitUntil: "networkidle" });
  await page.waitForSelector(".mh-metric-page__list button", { timeout: 8000 });
  if ((await page.locator(".mh-metric-page__list button").count()) !== 7) notes.push("P10 did not render seven Basic metrics");
  await page.locator(".mh-metric-page__action--primary").click();
  await page.locator(".mh-derived-panel").waitFor({ timeout: 5000 });
  await page.locator('input[placeholder="Enter metric name..."]').fill("Host metric");
  await page.locator(".mh-derived-panel__save").click();
  if (!(await page.locator(".mh-metric-page h1").innerText()).includes("Host metric")) notes.push("P10 Save did not select new metric");
  if ((await page.locator(".mh-metric-page__list button").count()) !== 3) notes.push("P10 Save did not grow Derived list");
  const href = await page.locator('.mh-metric-page__breadcrumb a').first().getAttribute("href");
  if (!href?.startsWith(BASE)) notes.push(`P10 hrefFor escaped host base: ${href}`);
  await page.screenshot({ path: path.join(OUT, "metric-dictionary.png") });
  notes.push(...errors);
  record("metric-dictionary", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P10 standalone route", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P09: direct detail URL, source actions, and in-host record switch ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}knowledge-view?id=business-term-gmv`, { waitUntil: "networkidle" });
  await page.waitForSelector(".mh-kdetail--business", { timeout: 10000 });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  if (!(await page.locator(".mh-kdetail__head h1").innerText()).includes("GMV")) notes.push("GMV title missing");
  const edit = await page.locator(".mh-kdetail__actions a").getAttribute("href");
  if (!edit?.includes("mode=edit&id=business-term-gmv")) notes.push(`edit href missing source params: ${edit}`);
  await page.locator(".mh-kdetail__head button").click();
  await page.locator(".mh-kdetail__versions[role='dialog']").waitFor({ timeout: 5000 });
  await page.locator(".mh-kdetail__versions .mh-modal__close").click();
  if (await page.locator(".mh-kdetail__versions[role='dialog']").count()) notes.push("versions did not close");
  await page.evaluate((next) => {
    window.history.pushState(null, "", next);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, `${BASE}knowledge-view?id=channel-data-model`);
  await page.waitForSelector(".mh-kdetail--model", { timeout: 10000 });
  await page.locator(".mh-kdetail__model-tabs button:has-text('Basic Info')").click();
  if (!(await page.locator(".mh-kdetail__model-tabs button.is-active").innerText()).includes("Basic Info")) notes.push("Basic Info tab did not become active");
  if ((await page.locator(".mh-kdetail__model-table tbody tr").count()) !== 5) notes.push("highlight-only tab lost field rows");
  await page.locator(".mh-kdetail__model-export").click();
  if (!(await page.locator(".mh-modal__dialog").innerText()).includes("The model configuration is ready to export.")) notes.push("Export notice missing");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("detail route reloaded host");
  await page.screenshot({ path: path.join(OUT, "p09-detail.png"), fullPage: true });
  notes.push(...errors);
  record("p09-knowledge-view", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P09", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P09: notice dismissal stays local; its body Back link reaches Interpreter ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  for (const [id, trigger] of [["scenario-channel-performance", ".mh-kdetail__scenario-actions button"], ["channel-data-model", ".mh-kdetail__model-export"]]) {
    await page.goto(`${origin}${BASE}knowledge-view?id=${id}`, { waitUntil: "networkidle" });
    const boot = await page.evaluate(() => window.__mhHostBoot);
    await page.locator(trigger).click();
    await page.locator(".mh-modal__dialog[role='dialog']").waitFor({ timeout: 10000 });
    if ((await page.locator(".mh-modal__close").getAttribute("aria-label")) !== "Close dialog") notes.push(`${id}: close control announces navigation`);
    await page.locator(".mh-modal__close").click();
    if (await page.locator(".mh-modal__dialog[role='dialog']").count()) notes.push(`${id}: close control did not dismiss notice`);
    if (new URL(page.url()).pathname !== `${BASE}knowledge-view`) notes.push(`${id}: close control navigated away`);
    if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push(`${id}: closing notice reloaded host`);
    await page.locator(trigger).click();
    await page.locator(".mh-modal__dialog a:has-text('Back to Knowledge Management')").click();
    await page.locator(".mh-interpreter").waitFor({ timeout: 10000 });
    if (new URL(page.url()).pathname !== `${BASE}interpreter`) notes.push(`${id}: body Back link did not reach Interpreter`);
    if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push(`${id}: body Back link reloaded host`);
  }
  notes.push(...errors);
  record("p09-notice-back", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P09", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P09: four source redirects resolve to P07's actual detail drawer ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  const destinations = [
    ["city-report-context", "Report Context", "Invest City Strategy Analysis"],
    ["metric-dictionary-member-conversion", "Metric Dictionary", "Member conversion"],
    ["playbook-opportunity-scan", "Analytical Model", "Opportunity scan playbook"],
    ["email-report-weekly-performance", "Email Reports", "Weekly Marketing Performance | Executive Summary"],
  ];
  for (const [id, type, title] of destinations) {
    await page.goto(`${origin}${BASE}knowledge-view?id=${id}`, { waitUntil: "networkidle" });
    await page.locator(".mh-modal__dialog[role='dialog']").waitFor({ timeout: 10000 });
    const final = new URL(page.url());
    if (final.pathname !== `${BASE}interpreter` || final.searchParams.get("type") !== type || final.searchParams.get("detail") !== id) notes.push(`${id}: final route mismatch ${final.pathname}${final.search}`);
    if ((await page.locator(`.mh-flview[data-fl-type='${type}']`).count()) !== 1) notes.push(`${id}: wrong P07 type view`);
    if ((await page.locator(".mh-modal__dialog[role='dialog']").count()) !== 1) notes.push(`${id}: P07 detail drawer missing`);
    if (!(await page.locator(".mh-modal__title").innerText()).includes(title)) notes.push(`${id}: wrong detail title`);
    if (await page.locator(".mh-kdetail").count()) notes.push(`${id}: transient P09 detail remained mounted`);
  }
  await page.goto(`${origin}${BASE}knowledge-view?id=email-report-unknown`, { waitUntil: "networkidle" });
  await page.locator(".mh-flview[data-fl-type='Email Reports']").waitFor({ timeout: 10000 });
  const fallback = new URL(page.url());
  if (fallback.pathname !== `${BASE}interpreter` || fallback.searchParams.get("type") !== "Email Reports" || fallback.searchParams.get("detail") !== "email-report-unknown") notes.push(`email prefix fallback route mismatch ${fallback.pathname}${fallback.search}`);
  if (await page.locator(".mh-modal__dialog[role='dialog']").count()) notes.push("unknown email prefix invented a detail record");
  await page.goto(`${origin}${BASE}knowledge-view?id=business-term-gmv`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  await page.evaluate((next) => {
    window.history.pushState(null, "", next);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, `${BASE}knowledge-view?id=city-report-context`);
  await page.locator(".mh-modal__dialog[role='dialog']").waitFor({ timeout: 10000 });
  if (new URL(page.url()).searchParams.get("detail") !== "city-report-context") notes.push("in-host redirect lost detail ID");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("in-host detail redirect reloaded the host");
  await page.evaluate((next) => {
    window.history.pushState(null, "", next);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, `${BASE}interpreter?type=Metric%20Dictionary&detail=metric-dictionary-member-conversion`);
  await page.locator(".mh-flview[data-fl-type='Metric Dictionary']").waitFor({ timeout: 10000 });
  await page.locator(".mh-modal__dialog[role='dialog']").waitFor({ timeout: 10000 });
  if (!(await page.locator(".mh-modal__title").innerText()).includes("Member conversion")) notes.push("same-instance type switch lost Metric detail drawer");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("same-instance type switch reloaded the host");
  notes.push(...errors);
  record("p09-detail-redirects", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P09", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P09: source edit anchors navigate to the actual P08 form route ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  for (const [id, type] of [["business-term-gmv", "Business Term"], ["scenario-channel-performance", "Scenario Reporting"]]) {
    await page.goto(`${origin}${BASE}knowledge-view?id=${id}`, { waitUntil: "networkidle" });
    const boot = await page.evaluate(() => window.__mhHostBoot);
    await page.locator(".mh-kdetail a:has-text('Edit')").last().click();
    await page.locator(".mh-kcreate").waitFor({ timeout: 10000 });
    const final = new URL(page.url());
    if (final.pathname !== `${BASE}knowledge-create` || final.searchParams.get("mode") !== "edit" || final.searchParams.get("id") !== id) notes.push(`${id}: edit route mismatch ${final.pathname}${final.search}`);
    if (type === "Scenario Reporting" && final.searchParams.get("type") !== type) notes.push(`${id}: scenario type missing from edit URL`);
    if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push(`${id}: edit navigation reloaded host`);
  }
  notes.push(...errors);
  record("p09-edit-to-p08", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P09", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P16: skill identity, all six panels, preview and edit query survive the host ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}scenario-detail`, { waitUntil: "networkidle" });
  if (await page.locator('.mh-scenario-detail-page[data-scenario-id="city-comparison"]').count() !== 1) notes.push("no-id default did not select City Comparison");
  if ((await page.locator(".mh-scenario-detail__info-head h2").innerText()) !== "City Comparison Analysis") notes.push("default record content mismatch");
  for (const [tab, label] of [["related", "Related Objects"], ["ai-check", "AI Review"], ["usage", "Usage & Feedback"], ["version", "Version History"], ["activity", "Scenario updated to v1.3"]]) {
    await page.locator(`.mh-scenario-detail__tabs button:has-text("${tab === "ai-check" ? "AI Check" : tab === "usage" ? "Usage & Feedback" : tab === "version" ? "Version History" : tab === "activity" ? "Activity Log" : "Related Objects"}")`).click();
    if (await page.locator(`.mh-scenario-detail[data-scenario-tab="${tab}"]`).count() !== 1 || !(await page.locator(".mh-scenario-detail__panel").innerText()).includes(label)) notes.push(`${tab}: panel mismatch`);
  }
  await page.locator('.mh-scenario-detail__tabs button:has-text("Knowledge Content")').click();
  await page.locator('.mh-scenario-detail__preview button').click();
  if (await page.locator(".mh-scenario-detail__preview .mh-scenario-preview__output pre").count() !== 1) notes.push("preview did not open");
  await page.goto(`${origin}${BASE}scenario-detail?id=scenario-campaign-review`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  if ((await page.locator(".mh-scenario-detail__info-head h2").innerText()) !== "Campaign Review Reporting") notes.push("known id did not select campaign record");
  await page.locator(".mh-scenario-detail__edit").click();
  const editUrl = new URL(page.url());
  if (editUrl.pathname !== `${BASE}scenario-edit` || editUrl.searchParams.get("id") !== "scenario-campaign-review") notes.push(`edit lost selected id: ${editUrl.pathname}${editUrl.search}`);
  if ((await page.locator('.mh-scenario-edit-form__field input').first().inputValue()) !== "Campaign Review Reporting") notes.push("edit target did not load selected record");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("edit navigation reloaded host");
  await page.goto(`${origin}${BASE}scenario-detail?id=does-not-exist`, { waitUntil: "networkidle" });
  if ((await page.locator(".mh-scenario-detail__info-head h2").innerText()) !== "Channel Performance Analysis") notes.push("unknown id did not fall back to first skill");
  notes.push(...errors);
  await page.screenshot({ path: path.join(OUT, "scenario-detail.png") });
  record("scenario-detail-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P16", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

/* ---- P05: the private Media Tracking hook drives the host as well as stories ---- */
try {
  const { page, errors } = await newPage();
  const notes = [];
  await page.goto(`${origin}${BASE}media-tracking-detail`, { waitUntil: "networkidle" });
  const boot = await page.evaluate(() => window.__mhHostBoot);
  await page.locator(".mh-tracking__head h1").waitFor();
  if (!(await page.locator(".mh-header__link[aria-current='page']").innerText()).includes("Self-Service Center")) notes.push("source active navigation missing");
  await page.locator(".mh-tracking .mh-tabs__tab:first-child").click();
  if (!(await page.locator(".mh-tracking .mh-tabs__tab.is-active").innerText()).includes("Daily")) notes.push("period callback did not select Daily");
  await page.locator(".mh-launcher").click();
  await page.locator(".mh-assistant__box textarea").fill("Summarize the latest media tracking performance.");
  await page.locator(".mh-assistant__send .mh-button").click();
  if (!(await page.locator(".mh-assistant__answer--simple").innerText()).includes("I will use the AI Interpreter knowledge context")) notes.push("lite answer missing");
  await page.locator(".mh-assistant__skill").click();
  await page.locator(".mh-skill__category").nth(1).click();
  await page.locator(".mh-skill__action").first().click();
  await page.locator(".mh-flow__card--history").waitFor();
  await page.locator(".mh-flow__foot .mh-flow__btn--primary").click();
  await page.locator(".mh-flow__card--form").waitFor();
  await page.locator(".mh-flow__back").click();
  await page.locator(".mh-flow__card--history").waitFor();
  await page.locator(".mh-flow__foot .mh-flow__btn--secondary").click();
  await page.locator(".mh-assistant__close").click();
  await page.locator(".mh-assistant").waitFor({ state: "hidden" });
  await page.locator(".mh-tracking__back").click();
  await page.locator(".mh-page__shell--self").waitFor();
  if (new URL(page.url()).pathname !== `${BASE}self-service`) notes.push("Media Tracking back link did not stay in host");
  if ((await page.evaluate(() => window.__mhHostBoot)) !== boot) notes.push("Media Tracking flow reloaded the host");
  notes.push(...errors);
  record("p05-media-tracking-flow", notes.length === 0, notes);
  await page.close();
} catch (error) {
  record("crashed: P05", false, [String(error?.message || error).split("\n")[0].slice(0, 200)]);
}

await browser.close();
server.close();

writeFileSync(
  path.join(OUT, "results.json"),
  JSON.stringify({ stamp, checks: results, failed: failures }, null, 2) + "\n",
);
console.log(`\n${results.length - failures}/${results.length} host checks pass — output: ${OUT}`);
process.exit(failures ? 1 : 0);
