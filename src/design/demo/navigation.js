/** Original static-demo URL adapter. Components deal in route ids and params;
 * only demo fixtures and this adapter know the HTML path convention. */
const demoPaths = {
  home: "/index.html",
  cockpit: "/assets/pages/reports.html",
  "self-service": "/assets/pages/flexible.html",
  "data-upload": "/assets/pages/data-upload.html",
  "media-tracking-detail": "/assets/pages/media-tracking-detail.html",
  campaign: "/assets/pages/campaign.html",
  interpreter: "/assets/pages/knowledge.html",
  "knowledge-create": "/assets/pages/knowledge-create.html",
  "knowledge-view": "/assets/pages/knowledge-view.html",
  "metric-dictionary": "/assets/pages/metric-dictionary.html",
  "data-model": "/assets/pages/data-model.html",
  "review-center": "/assets/pages/review-center.html",
  "feedback-quality": "/assets/pages/feedback-quality.html",
  "personal-memory": "/assets/pages/personal-memory.html",
  "scenario-library": "/assets/pages/scenario-library.html",
  "scenario-detail": "/assets/pages/scenario-detail.html",
  "scenario-edit": "/assets/pages/scenario-edit.html",
};

const aliases = {
  knowledge: "interpreter",
  knowledgeCreate: "knowledge-create",
  knowledgeView: "knowledge-view",
  metricDictionary: "metric-dictionary",
  dataModel: "data-model",
  selfService: "self-service",
  "cockpit-all": "cockpit",
  "cockpit-project": "cockpit",
  "cockpit-live": "cockpit",
};

/** Resolve the small set of semantic subroutes onto their page and query. */
export function normalizeRouteTarget(id, params = {}) {
  const route = aliases[id] || id;
  const values = { ...params };
  if (id === "cockpit-project" || id === "cockpit-live") {
    values.project = values.project ?? values.id;
    delete values.id;
  }
  if (id === "cockpit-live") values.view = values.view ?? "live";
  if (id === "interpreter-type") {
    values.type = values.type ?? values.typeId;
    delete values.typeId;
    return { id: "interpreter", params: values };
  }
  return { id: route, params: values };
}

export function demoHrefFor(id, params = {}) {
  const target = normalizeRouteTarget(id, params);
  const path = demoPaths[target.id];
  if (!path) throw new Error(`Unknown demo route: ${id}`);
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(target.params)) {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  }
  return `${path}${query.size ? `?${query}` : ""}`;
}

/** Interpret fixture links and still-unmigrated original links at the host edge. */
export function demoTargetForHref(href) {
  if (!href || /^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("#")) return null;
  const url = new URL(href, "http://demo.local/assets/pages/");
  const id = Object.keys(demoPaths).find((key) => demoPaths[key] === url.pathname);
  if (id) return { id, params: Object.fromEntries(url.searchParams) };
  if (url.pathname.endsWith(".html")) return { id: "coverage", params: { path: url.pathname, ...Object.fromEntries(url.searchParams) } };
  return null;
}
