/**
 * Original-demo href conventions — pure URL builders, no fixture imports.
 */

/** Catalog links — same targets as the original `reports.html?…` URLs under the demo host. */
export function projectCatalogHref(projectKey) {
  return "/assets/pages/reports.html?project=" + projectKey;
}

const KNOWLEDGE_HREF = "/assets/pages/knowledge.html";

/** Copilot source chip link — the original `knowledge.html?report=…&category=…&asset=…` shape. */
export function copilotSourceHref(projectKey, asset) {
  return KNOWLEDGE_HREF + "?report=" + projectKey + "&category=" + asset.category + "&asset=" + asset.id;
}
