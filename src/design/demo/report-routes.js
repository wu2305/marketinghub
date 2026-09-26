/**
 * Original-demo href conventions — pure URL builders, no fixture imports.
 */

/** Catalog links — same targets as the original `reports.html?…` URLs under the demo host. */
export function projectCatalogHref(projectKey) {
  return "/assets/pages/reports.html?project=" + projectKey;
}

export function liveReportHref(projectKey, reportIndex) {
  return "/assets/pages/reports.html?project=" + projectKey + "&dashboard=" + reportIndex + "&view=live";
}

export const REPORT_CATALOG_HREF = "/assets/pages/reports.html";

export const KNOWLEDGE_HREF = "/assets/pages/knowledge.html";

/**
 * Knowledge-detail link for a resolved report context record
 * (resolveReportContext in report-logic.js); falls back to the library root.
 */
export function reportContextHref(context) {
  if (!context) return KNOWLEDGE_HREF;
  return KNOWLEDGE_HREF + "?type=Report%20Context&detail=" + encodeURIComponent(context.id);
}

/** Copilot source chip link — the original `knowledge.html?report=…&category=…&asset=…` shape. */
export function copilotSourceHref(projectKey, asset) {
  return KNOWLEDGE_HREF + "?report=" + projectKey + "&category=" + asset.category + "&asset=" + asset.id;
}
