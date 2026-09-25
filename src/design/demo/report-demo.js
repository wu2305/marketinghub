/**
 * Deterministic demo simulators for the report path — data arrives as explicit
 * parameters (fixtures live in demo/report-fixtures.js, but any host-supplied
 * data with the same shape works). No React, no Storybook.
 */
import { isPilotCitySalesQuestion, resolveReportAssets } from "../report-logic.js";
import { copilotSourceHref } from "../report-routes.js";

/* ---------------------------------------------------------------------------
 * Six-city scenario generator — the original seeded RNG and scGenScenario in
 * assets/js/reports/report-core.js, parameterized on the city-invest data
 * block. Default filters use the baseline; changed filters take the seeded
 * variation branch.
 * ------------------------------------------------------------------------- */

function scHashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function scMulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @param {object} cityInvest CITY_INVEST-shaped data (baseline/kpis/endIndex/charts/copy/defaultFilters)
 * @param {{ end: string, channel: string, pilot: string, city: string[], store: string[] }} filters
 */
export function generateCityInvestScenario(cityInvest, filters) {
  const f = filters;
  const defaults = cityInvest.defaultFilters || {};
  const isDefault =
    f.channel === defaults.channel &&
    f.pilot === defaults.pilot &&
    f.end === defaults.end &&
    f.city.length === (defaults.cities || []).length &&
    (defaults.cities || []).every((city) => f.city.includes(city)) &&
    f.store.length === (defaults.stores || []).length &&
    (defaults.stores || []).every((store) => f.store.includes(store));
  const seedStr = [f.channel, f.pilot, f.city.slice().sort().join(","), f.store.slice().sort().join(","), f.end].join("|");
  const rng = scMulberry32(scHashStr(seedStr));
  const endIdx = cityInvest.endIndex[f.end] ?? 14;
  const trends = {};
  cityInvest.charts.forEach(function (m) {
    if (isDefault) {
      trends[m] = { t: cityInvest.baseline[m].t.slice(), n: cityInvest.baseline[m].n.slice() };
    } else {
      const fT = 0.88 + rng() * 0.24;
      const fN = 0.88 + rng() * 0.24;
      trends[m] = {
        t: cityInvest.baseline[m].t.map(function (v) { return v * fT * (1 + (rng() - 0.5) * 0.06); }),
        n: cityInvest.baseline[m].n.map(function (v) { return v * fN * (1 + (rng() - 0.5) * 0.06); }),
      };
    }
  });
  const kpi = {};
  cityInvest.kpis.forEach(function (meta) {
    let uplift = meta.uplift;
    let vari = meta.var;
    let after = meta.baseAfter;
    if (meta.trend) after = trends[meta.trend].t[endIdx];
    if (!isDefault) {
      if (meta.key === "ADT" || meta.key === "ADS") {
        after = meta.baseAfter * (0.86 + rng() * 0.28);
      } else if (meta.key === "SC") {
        after = 13 + rng() * 14;
      } else if (meta.key === "TAM") {
        after = 3900 + rng() * 1900;
      }
      if (meta.uplift !== null) {
        uplift = Math.round(meta.uplift + (rng() - 0.5) * 10);
        vari = Math.round(meta.var + (rng() - 0.5) * 28);
      }
    }
    kpi[meta.key] = { uplift: uplift, vari: vari, after: after };
  });
  return { trends: trends, kpi: kpi, endIdx: endIdx, isDefault: isDefault };
}

/** Stable `getScenario(filters)` for CityInvestDashboard bound to one data block. */
export function cityInvestScenarioSource(cityInvest) {
  return (filters) => generateCityInvestScenario(cityInvest, filters);
}

/* ---------------------------------------------------------------------------
 * Report Copilot — deterministic answers/profile/sources built from the
 * projects + knowledge + copilot data the host passes in.
 * ------------------------------------------------------------------------- */

/* Mirrors the original `activeReport()`: content resolves via
   `reports[i] ? i : 0` while callers keep passing the raw `dashboard` index —
   the embed/holistic gates then test the raw value, matching report-core.js. */
function reportAt(projects, projectKey, reportIndex) {
  const reports = projects[projectKey]?.reports;
  return (reports && reports[reportIndex]) || (reports && reports[0]) || null;
}

/** Workspace chrome per live report: only title + period hint render (rest of the profile targets dead nodes). */
export function copilotProfile(projects, copilot, projectKey, reportIndex) {
  const assistant = reportAt(projects, projectKey, reportIndex)?.assistant || {};
  const defaults = copilot.defaultProfile || {};
  return {
    panelTitle: assistant.panelTitle || defaults.panelTitle,
    periodHint: assistant.periodHint || defaults.periodHint,
  };
}

/** Sources attached to copilot answers: the report's resolved knowledge, capped at 4. */
export function copilotSources(knowledge, projectKey, report) {
  return resolveReportAssets(knowledge, projectKey, report)
    .slice(0, 4)
    .map((asset) => ({ id: asset.id, title: asset.title, href: copilotSourceHref(projectKey, asset) }));
}

/**
 * Recommendation click → answer payload. A report whose raw-indexed entry
 * carries `embed: "city-invest"` streams the holistic report at recIndex 0;
 * every other recommendation resolves to a standard answer (falling back to
 * recommendation 0 like the original).
 */
export function resolveCopilotAnswer(projects, copilot, projectKey, reportIndex, recIndex) {
  const report = reportAt(projects, projectKey, reportIndex);
  if (!report || !(report.recommendations || []).length) return null;
  if (projects[projectKey]?.reports?.[reportIndex]?.embed === "city-invest" && recIndex === 0) {
    return { kind: "holistic", title: copilot.holistic.title, report: copilot.holistic };
  }
  const rec = report.recommendations[recIndex] || report.recommendations[0];
  return {
    kind: "answer",
    title: rec.answerTitle,
    summary: rec.summary,
    findings: (rec.findings || []).map((finding) => ({ label: finding[0], text: finding[1] })),
  };
}

/**
 * Command-form submit → chat entry. In the original a fresh question clears
 * the thread (chat mode) while a question asked over an open recommendation
 * answer appends below it — the caller decides append vs replace. Rich
 * entries carry the pilot-sales card as `card`.
 */
export function buildCopilotChatEntry(projects, knowledge, copilot, projectKey, reportIndex, question) {
  const report = reportAt(projects, projectKey, reportIndex);
  const sources = report ? copilotSources(knowledge, projectKey, report) : [];
  if (isPilotCitySalesQuestion(question)) {
    return { kind: "rich", question, card: copilot.pilotSales, sources };
  }
  return { kind: "standard", question, summary: copilot.genericSummary, sources };
}

/** Analytical Model records the workspace menu lists (dedup by id, max 12, fallback when empty). */
export function copilotSkillItems(knowledge, fallback) {
  const seen = new Set();
  const models = knowledge
    .filter((asset) => asset.type === "Analytical Model")
    .map((asset) => ({
      id: asset.id,
      title: asset.title,
      note: asset.summary || "Use this interpretation logic",
    }));
  const items = models.filter((item) => item.title && !seen.has(item.id) && seen.add(item.id)).slice(0, 12);
  return items.length ? items : fallback;
}
