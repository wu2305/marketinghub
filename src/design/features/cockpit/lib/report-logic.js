/**
 * Pure report/knowledge logic — no fixture imports; every input is an explicit
 * parameter so the same functions work with any project/knowledge/city-invest
 * data a host supplies.
 */

export function pluralize(count, singular, plural) {
  return count + " " + (count === 1 ? singular : plural || singular + "s");
}

/** Knowledge assets linked to a report: resolvable ids scoped to the project. */
export function resolveReportAssets(knowledge, projectKey, report) {
  return (report?.knowledgeIds || [])
    .map((id) => knowledge.find((asset) => asset.id === id))
    .filter(Boolean)
    .filter((asset) => !asset.projects || asset.projects.includes(projectKey));
}

/** All-mode catalog search text for a project (title/kicker/category/description + reports + asset titles). */
export function projectSearchText(knowledge, projectKey, project) {
  const assetTitles = project.reports.reduce(
    (titles, report) => titles.concat(resolveReportAssets(knowledge, projectKey, report).map((asset) => asset.title)),
    [],
  );
  return [project.title, project.kicker, project.category, project.description]
    .concat(project.reports.map((report) => [report.title, report.type, report.description, report.owner].join(" ")))
    .concat(assetTitles)
    .join(" ")
    .toLowerCase();
}

/** Project-mode search text for one report row. */
export function reportSearchText(knowledge, projectKey, project, report) {
  const knowledgeText = resolveReportAssets(knowledge, projectKey, report)
    .map((asset) => asset.title)
    .join(" ");
  return [report.title, report.type, report.description, report.owner, knowledgeText].join(" ").toLowerCase();
}

/** Mirrors the original `data-details-project` click resolution in report-core.js. */
export function resolveReportContext(knowledge, projectKey, report) {
  const contexts = knowledge.filter((asset) => asset.type === "Report Context");
  return (
    contexts.find((asset) =>
      (asset.connections || []).some((connection) => connection.name === report.title)
    ) ||
    contexts.find((asset) => (report.knowledgeIds || []).includes(asset.id)) ||
    contexts.find((asset) => (asset.projects || []).includes(projectKey)) ||
    null
  );
}

/* ---------------------------------------------------------------------------
 * City-invest label helpers — the `copy` argument is the fixture's copy block
 * (labels like "All Stores" / "(None)" / "Total" / "Cities" come from it).
 * ------------------------------------------------------------------------- */

/** X-axis tick indices for a label count — original scPickTicks spacing. */
export function pickTicks(len) {
  if (len <= 3) return Array.from({ length: len }, function (_, i) { return i; });
  const step = Math.max(2, Math.round((len - 1) / 6));
  const out = [];
  for (let i = 0; i < len; i += step) out.push(i);
  if (out[out.length - 1] !== len - 1) out.push(len - 1);
  if (out.length >= 3 && out[out.length - 1] - out[out.length - 2] === 1) out.splice(out.length - 2, 1);
  return out;
}

/** After-value formatter per KPI meta (scFmtAfter). */
export function fmtAfter(meta, v) {
  if (meta.fmt === "K") return v.toFixed(meta.dec) + "K";
  if (meta.fmt === "%") return v.toFixed(meta.dec) + "%";
  if (meta.fmt === "%2") return Math.round(v) + "%";
  if (meta.fmt === "int") return Math.round(v).toLocaleString("en-US");
  return v.toFixed(meta.dec);
}

/** Store options for the selected cities; empty selection falls back to every known store. */
export function storeOptionsFor(cityStores, cities) {
  if (cities.length === 0) return [...new Set(Object.values(cityStores).flat())];
  return [
    ...new Set(
      cities.filter(function (c) { return cityStores[c]; }).flatMap(function (c) { return cityStores[c]; })
    ),
  ];
}

/** Store-filter suffix: "· City" / "· A + B" / "· N Cities". */
export function storeScopeSuffix(cities, copy) {
  if (cities.length === 0) return "";
  if (cities.length === 1) return "· " + cities[0];
  if (cities.length === 2) return "· " + cities.join(" + ");
  return "· " + cities.length + " " + copy.cities;
}

/** Total-scope label: "Total" when all cities are selected, else the selected scope. */
export function totalLabel(cities, allCities, copy) {
  if (cities.length === 0) return copy.none;
  const full = cities.length === allCities.length && allCities.every(function (x) { return cities.includes(x); });
  if (full) return copy.total;
  if (cities.length <= 2) return cities.join(" + ");
  return cities.length + " " + copy.cities;
}

/** Multi-select display label with a scope-specific all-selected label. */
export function selectionLabel(selected, optionCount, copy, allLabel = copy.allStores) {
  if (selected.length === 0) return copy.none;
  if (selected.length === optionCount) return allLabel;
  return selected.length > 2
    ? selected.slice(0, 2).join(", ") + " +" + (selected.length - 2)
    : selected.join(", ");
}

/**
 * Only the canonical "last month" phrasing gets the fixed rich card — the
 * explore follow-ups also contain "pilot city sales performance", so the
 * period wording is required (same rule as the original).
 */
export function isPilotCitySalesQuestion(question) {
  const normalized = String(question || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return false;
  return (
    normalized.indexOf("pilot city") !== -1 &&
    normalized.indexOf("sales") !== -1 &&
    normalized.indexOf("last month") !== -1
  );
}

/* ---------- Report-variant generated-model text builders ---------- */

/** Keyword map shared by the two report generation helpers below. */
function reportRuleDimensions(rule) {
  const text = String(rule || "").trim().toLowerCase();
  const has = (words) => words.some((word) => text.includes(word));
  const dimensions = [];
  if (has(["channel", "media", "platform", "site"])) dimensions.push("channels");
  if (has(["city", "cities", "market", "region", "store"])) dimensions.push("cities");
  if (has(["segment", "customer", "member", "audience"])) dimensions.push("customer segments");
  if (has(["time", "week", "month", "trend", "period", "quarter"])) dimensions.push("time periods");
  return { text, has, dimensions };
}

/** Report variant of the generated Description (buildReportDescription). */
export function buildReportModelDescription(messages, rule) {
  const questions = messages.filter((message) => message.role === "user").map((message) => message.text);
  const scope = (questions.length ? questions : messages.map((message) => message.text)).join(" ").toLowerCase();
  const topics = [];
  if (/\bcit(y|ies)\b|invest/.test(scope)) topics.push("city performance");
  if (/conversion|\bcr\b/.test(scope)) topics.push("conversion");
  if (/data quality|lineage|freshness/.test(scope)) topics.push("data quality");
  if (!topics.length) topics.push("report performance");
  const topicPhrase = topics.length > 1 ? topics.slice(0, -1).join(", ") + " and " + topics[topics.length - 1] : topics[0];
  const { has, dimensions } = reportRuleDimensions(rule);
  const dimensionPhrase = dimensions.join(" and ");
  const ranked = has(["rank", "priorit", "top", "most impactful", "biggest"]);
  const goal =
    "Clarify what drove the movement in " + topicPhrase + ", so the team can decide the next optimization step.";
  const method = dimensionPhrase
    ? ranked
      ? "Ranks " + dimensionPhrase + " by business impact and returns one conclusion."
      : "Compares " + dimensionPhrase + " to isolate the strongest performance signal and support one next action."
    : "Expected insight is the strongest performance signal and the primary risk driver.";
  const conversations = new Set(messages.map((message) => message.threadIndex)).size;
  return (
    goal +
    " " +
    method +
    "\n\nSource: " +
    conversations +
    " conversation" +
    (conversations === 1 ? "" : "s") +
    " · " +
    messages.length +
    " message" +
    (messages.length === 1 ? "" : "s") +
    "."
  );
}

/** Report variant of the generated Structure & Guidance (buildReportAnalysisLogic). */
export function buildReportModelLogic(rule) {
  const { has, dimensions } = reportRuleDimensions(rule);
  const scope = dimensions.length
    ? "across " + dimensions.join(" and ")
    : "across cities, channels, and key report dimensions";
  const driver = has(["rank", "priorit", "top", "most impactful", "biggest"])
    ? "Rank the candidate drivers by business impact and keep only the strongest one."
    : has(["driver", "root cause", "reason", "why", "cause", "factor"])
      ? "Isolate the driver with the strongest supporting evidence."
      : "Identify the strongest performance signal and the primary risk driver.";
  const output = has(["concise", "brief", "short", "one conclusion", "one result"])
    ? "Return one conclusion and a recommended next action."
    : "Return the key findings and a recommended next action.";
  return [
    "1. Define the report question, the comparison window, and the business scope.",
    "2. Compare metric movement " + scope + ".",
    "3. " + driver,
    "4. " + output,
  ].join("\n");
}

/** Draft field values for the report variant's generated model form. */
export function buildReportModelDraft(messages, rule, generatedDefaults) {
  return {
    ...generatedDefaults,
    description: buildReportModelDescription(messages, rule),
    structure: buildReportModelLogic(rule),
  };
}
