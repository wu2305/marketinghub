// Lists Storybook stories whose text nodes fall back to a non-design-system
// font (usually the browser default serif). Serve a built Storybook first:
//   (cd storybook-static && python3 -m http.server 6007)
//   node scripts/font-probe.mjs [http://127.0.0.1:6007] [--affected [REF]]
// --affected probes only the stories a change since REF (default the GitHub
// main) can reach through imports (scripts/affected.mjs).
// Prints one line per affected story; no output means every text node uses a
// design-system (or declared CJK/system fallback) font.
import { chromium } from "playwright";
import { affectedStoryIds, changedFiles, defaultBase } from "./affected.mjs";

const args = process.argv.slice(2);
const at = args.indexOf("--affected");
const affectedBase = at < 0 ? null : (args[at + 1] && !args[at + 1].startsWith("--") ? args[at + 1] : defaultBase());
const base = args.find((arg, i) => arg.startsWith("http") && i !== at + 1) || "http://127.0.0.1:6007";
const allowed = /DIN 2014|BentonMod|PingFang|YaHei|-apple-system|Arial/i;
const index = await (await fetch(`${base}/index.json`)).json();
const ids = affectedBase ? affectedStoryIds(index, changedFiles(affectedBase)) : null;
if (affectedBase) console.error(`--affected ${affectedBase}: ${ids ? `${ids.size} stories` : "global change, all stories"}`);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const entry of Object.values(index.entries)) {
  if (entry.type !== "story" || (ids && !ids.has(entry.id))) continue;
  await page.goto(`${base}/iframe.html?viewMode=story&id=${entry.id}`);
  await page.waitForTimeout(700);
  const offenders = await page.evaluate((source) => {
    const allow = new RegExp(source, "i");
    const counts = new Map();
    for (const el of document.querySelectorAll("#storybook-root *")) {
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasText) continue;
      const family = getComputedStyle(el).fontFamily;
      if (allow.test(family)) continue;
      const cls = typeof el.className === "string" && el.className ? el.className.split(" ")[0] : el.tagName.toLowerCase();
      const key = `${cls} [${family.slice(0, 30)}]`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [...counts].map(([k, v]) => `${k}×${v}`).join("; ");
  }, allowed.source);
  if (offenders) console.log(`${entry.title} / ${entry.name}: ${offenders}`);
}
await browser.close();
