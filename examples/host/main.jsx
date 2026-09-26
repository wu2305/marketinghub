/* Standalone React host for the design system.
 *
 * Goals: prove the components run outside Storybook under a non-root base
 * (`/mh-host/`), that routed navigation stays inside React (no full reloads,
 * no jumps to the original HTML demo), and that tokens.css does not leak
 * styles into host elements (the compose page carries a host-owned sentinel).
 *
 * Imports components only via src/design/index.js; demo fixtures/containers
 * come from src/design/demo/* and content.js as the integration contract allows.
 * Never imports .storybook/*, *.stories.jsx, or original assets/js.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import "../../src/design/tokens.css";
import "./host.css";
import {
  HomePage,
  AiInterpreterPage,
  MarketingCockpitPage,
  CityInvestDashboard,
  ReportCopilot,
  SelfServicePage,
  DataUploadPage,
  KnowledgeViewPage,
  useCockpitDemo,
  useHomeDemo,
  useBusinessTermDemo,
  BusinessTermView,
  DataModelPage,
  KnowledgeCreatePage,
  ReviewCenterPage,
  FeedbackQualityPage,
  PersonalMemoryPage,
  ScenarioLibraryPage,
  ScenarioDetailPage,
  ScenarioEditPage,
  MediaTrackingDetailPage,
  MetricDictionaryPage,
} from "../../src/design/index.js";
import { useSelfServiceDemo } from "../../src/design/demo/self-service-demo.js";
import { useDataUploadDemo } from "../../src/design/demo/data-upload-demo.js";
import {
  ASSISTANT,
  ASSISTANT_SKILL_MENU,
  COCKPIT,
  COCKPIT_SKILL_MENU,
  HOME,
  INTERPRETER,
  LOGO,
  MODEL_FLOW,
  NAV,
  SELF_SERVICE,
  DATA_UPLOAD,
  LITE_ASSISTANT,
  MEDIA_TRACKING,
  buildLiteAssistantAnswer,
  buildHomeAssistantAnswer,
  buildModelDraft,
  buildReportAssistantAnswer,
} from "../../src/design/content.js";
import { METRIC_ASSISTANT, METRIC_DICTIONARY } from "../../src/design/demo/content/metric-dictionary.js";
import { metricDictionaryHrefFor, useMetricDictionaryDemo } from "../../src/design/demo/metric-dictionary-demo.js";
import { CITY_INVEST, COPILOT, KNOWLEDGE_ASSETS, REPORT_PROJECTS } from "../../src/design/demo/report-fixtures.js";
import { cityInvestScenarioSource } from "../../src/design/demo/report-demo.js";
import { useKnowledgeViewDemo, knowledgeViewHrefFor, knowledgeViewRedirectFor } from "../../src/design/demo/knowledge-view-demo.js";
import { KNOWLEDGE_VIEW } from "../../src/design/demo/content/knowledge-view.js";
import {
  ALT_CITY_INVEST,
  ALT_COPILOT,
  ALT_KNOWLEDGE,
  ALT_PROJECTS,
} from "../../src/design/demo/__fixtures__/alt-cockpit.js";
import { ALT_BUSINESS_TERMS } from "../../src/design/demo/__fixtures__/alt-business-terms.js";
import { useDataModelPageDemo, dataModelPageHrefFor, normalizedDataModelSearch } from "../../src/design/demo/data-model-page-demo.js";
import { DATA_MODEL_PAGE } from "../../src/design/demo/content/data-model-page.js";
import { KNOWLEDGE_CREATE } from "../../src/design/demo/content/knowledge-create.js";
import { useKnowledgeCreateDemo } from "../../src/design/demo/knowledge-create-demo.js";
import { buildInterpreterAnswer, useInterpreterDemo } from "../../src/design/demo/interpreter-demo.js";
import { REVIEW_CENTER, REVIEW_SHELL } from "../../src/design/demo/content/review-center.js";
import { useReviewCenterDemo } from "../../src/design/demo/review-center-demo.js";
import { FEEDBACK_QUALITY, makeFeedbackRecords } from "../../src/design/demo/content/feedback-quality.js";
import { useFeedbackQualityDemo } from "../../src/design/demo/feedback-quality-demo.js";
import { PERSONAL_MEMORY, PERSONAL_MEMORY_SHELL } from "../../src/design/demo/content/personal-memory.js";
import { usePersonalMemoryDemo } from "../../src/design/demo/personal-memory-demo.js";
import { SKILL_LIBRARY, SKILL_LIBRARY_SHELL } from "../../src/design/demo/content/skill-library.js";
import { useSkillLibraryDemo } from "../../src/design/demo/skill-library-demo.js";
import { SCENARIO_DETAIL, SCENARIO_DETAIL_SHELL } from "../../src/design/demo/content/scenario-detail.js";
import { SKILL_RECORDS } from "../../src/design/demo/content/skill-records.js";
import { useScenarioDetailDemo } from "../../src/design/demo/scenario-detail-demo.js";
import { SCENARIO_EDIT, SCENARIO_EDIT_SHELL } from "../../src/design/demo/content/scenario-edit.js";
import { useScenarioEditDemo } from "../../src/design/demo/scenario-edit-demo.js";
import { useMediaTrackingDemo } from "../../src/design/demo/media-tracking-demo.js";

/* Set once per boot; host-check asserts it survives every in-app navigation
   (i.e. clicks never trigger a full page load). */
window.__mhHostBoot = window.__mhHostBoot || Math.random().toString(36).slice(2);

const BASE = "/mh-host/";
const hostHref = (path) => `${BASE}${String(path).replace(/^\/+/, "")}`;

/** Original-demo URLs → host routes. Known targets get real routes; the rest
 *  are honest coverage gaps. */
const ROUTE_MAP = {
  "/index.html": "",
  "/assets/pages/reports.html": "cockpit",
  "/assets/pages/data-model.html": "data-model",
  "/assets/pages/knowledge.html": "interpreter",
  "/assets/pages/knowledge-create.html": "knowledge-create",
  "/assets/pages/flexible.html": "self-service",
  "/assets/pages/data-upload.html": "data-upload",
  "/assets/pages/metric-dictionary.html": "metric-dictionary",
  "/assets/pages/knowledge-view.html": "knowledge-view",
  "/assets/pages/review-center.html": "review-center",
  "/assets/pages/feedback-quality.html": "feedback-quality",
  "/assets/pages/personal-memory.html": "personal-memory",
  "/assets/pages/scenario-library.html": "scenario-library",
  "/assets/pages/scenario-detail.html": "scenario-detail",
  "/assets/pages/scenario-edit.html": "scenario-edit",
  "/assets/pages/media-tracking-detail.html": "media-tracking-detail",
};

function mapDemoHref(href) {
  if (!href) return href;
  const url = new URL(href, "http://host.local/assets/pages/");
  if (!url.pathname.endsWith(".html") && url.pathname !== "/") return href;
  const originalPath = url.pathname.startsWith(BASE) ? `/assets/pages/${url.pathname.slice(BASE.length)}` : url.pathname;
  const mapped = ROUTE_MAP[originalPath];
  if (mapped === undefined) return hostHref(`coverage/${url.pathname.replace(/^\/+/, "")}`);
  return `${hostHref(mapped)}${url.search}`;
}

function navigateHost(href) {
  if (!href) return;
  const next = href.startsWith(BASE) ? href : mapDemoHref(href);
  if (next === window.location.pathname + window.location.search) return;
  window.history.pushState(null, "", next);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

const hostNav = () =>
  NAV.map((item) => ({ ...item, href: mapDemoHref(item.href) }));

const hostLogo = { ...LOGO, href: hostHref("") };

const cockpitRoutes = {
  projectHref: (id) => (id === "all" ? hostHref("cockpit") : `${hostHref("cockpit")}?project=${id}`),
  liveHref: (id, index) => `${hostHref("cockpit")}?project=${id}&dashboard=${index}`,
  backHref: hostHref("cockpit"),
  contextHref: () => hostHref("coverage/assets/pages/knowledge.html"),
};

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

function routeOf(loc) {
  const [path, search = ""] = loc.split("?");
  const params = new URLSearchParams(search);
  if (!path.startsWith(BASE)) {
    /* original-demo or stray absolute path → coverage gap */
    return { name: "coverage", params, target: path };
  }
  const rest = path.slice(BASE.length).replace(/\/+$/, "");
  if (rest === "") return { name: "home", params };
  if (rest === "cockpit") return { name: "cockpit", params };
  if (rest === "data-model") return { name: "data-model", params };
  if (rest === "interpreter") return { name: "interpreter", params };
  if (rest === "knowledge-create") return { name: "knowledge-create", params };
  if (rest === "self-service") return { name: "self-service", params };
  if (rest === "data-upload") return { name: "data-upload", params };
  if (rest === "metric-dictionary") return { name: "metric-dictionary", params };
  if (rest === "knowledge-view") return { name: "knowledge-view", params };
  if (rest === "review-center") return { name: "review-center", params };
  if (rest === "feedback-quality") return { name: "feedback-quality", params };
  if (rest === "personal-memory") return { name: "personal-memory", params };
  if (rest === "scenario-library") return { name: "scenario-library", params };
  if (rest === "scenario-detail") return { name: "scenario-detail", params };
  if (rest === "scenario-edit") return { name: "scenario-edit", params };
  if (rest === "media-tracking-detail") return { name: "media-tracking-detail", params };
  if (rest === "compose") return { name: "compose", params };
  if (rest === "sentinel") return { name: "sentinel", params };
  const coverage = rest.match(/^coverage\/(.+)$/);
  return { name: "coverage", params, target: coverage ? coverage[1] : path };
}

function useRoute() {
  const [loc, setLoc] = React.useState(() => window.location.pathname + window.location.search);
  React.useEffect(() => {
    const onPop = () => setLoc(window.location.pathname + window.location.search);
    /* Delegated adapter: plain left clicks on same-origin anchors inside the
       host root that point under the base — or at an original-demo route —
       become history entries. Everything else (modifiers, middle click,
       target, download, external) stays native. */
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const internal = url.pathname.startsWith(BASE) || url.pathname === "/index.html" || url.pathname.startsWith("/assets/pages/");
      if (!internal) return;
      event.preventDefault();
      /* Demo-route hrefs become coverage URLs — the address bar must never
         leave /mh-host/ (a reload of an unmapped /assets/pages/ URL 404s). */
      const next = url.pathname.startsWith(BASE) && !url.pathname.endsWith(".html")
        ? url.pathname + url.search
        : mapDemoHref(url.pathname + url.search);
      if (next === window.location.pathname + window.location.search) return;
      window.history.pushState(null, "", next);
      setLoc(next);
    };
    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick);
    onPop();
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return routeOf(loc);
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

function HomeRoute() {
  const cards = HOME.cards.map((card) => ({
    ...card,
    href: mapDemoHref(card.href),
    links: (card.links || []).map((link) => ({ ...link, href: mapDemoHref(link.href) })),
  }));
  const props = useHomeDemo({
    logo: hostLogo,
    navigation: hostNav(),
    hero: HOME.hero,
    heading: HOME.heading,
    cards,
    assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU },
    assistantOpen: false,
    prompt: "",
    scope: "All",
    demo: { answerFor: buildHomeAssistantAnswer, modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft },
  });
  return <HomePage {...props} />;
}

/* ------------------------------------------------------------------ */
/* Cockpit                                                             */
/* ------------------------------------------------------------------ */

const { baseline: _baseline, ...CITY_INVEST_VIEW } = CITY_INVEST;

function CockpitRoute({ params }) {
  const props = useCockpitDemo({
    project: params.get("project") || "all",
    view: params.get("view") || "catalog",
    dashboard: params.has("dashboard") ? params.get("dashboard") : null,
    logo: hostLogo,
    navigation: hostNav(),
    hero: COCKPIT.hero,
    groups: COCKPIT.groups,
    projects: REPORT_PROJECTS,
    knowledge: KNOWLEDGE_ASSETS,
    cityInvest: { ...CITY_INVEST_VIEW, getScenario: cityInvestScenarioSource(CITY_INVEST) },
    demo: { copilot: COPILOT, modelFlow: MODEL_FLOW, reportAnswerFor: buildReportAssistantAnswer },
    detailsSections: COCKPIT.detailsSections,
    assistant: { ...COCKPIT.assistant, skillMenu: COCKPIT_SKILL_MENU },
    ...cockpitRoutes,
  });
  return <MarketingCockpitPage {...props} />;
}

function InterpreterRoute({ params }) {
  const activeType = params.get("type") || "overview";
  const principles = { items: INTERPRETER.principles, strings: INTERPRETER.principlesLibrary, selectedCategories: [], page: 1, pageSize: 10, expanded: [] };
  const demo = useInterpreterDemo({
    types: INTERPRETER.types, records: INTERPRETER.records, activeType, query: "", principles,
    businessTermLibrary: INTERPRETER.businessTermLibrary,
    fieldLibrary: { ...INTERPRETER.fieldLibrary, detail: params.get("detail") || null },
    scenarioReports: INTERPRETER.scenarioReports,
    assistant: { ...INTERPRETER.assistant, open: false, prompt: "" },
    demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, answerFor: buildInterpreterAnswer },
    onNavigate: ({ href }) => navigateHost(href),
  });
  return <AiInterpreterPage
    logo={hostLogo} navigation={hostNav()} hero={INTERPRETER.hero} overviewItem={INTERPRETER.overview}
    sidebarTitle={INTERPRETER.sidebarTitle} copy={INTERPRETER.copy} types={INTERPRETER.types}
    activeType={activeType} {...demo}
    onNavigate={({ href }) => navigateHost(href)}
    onSelectType={({ id }) => navigateHost(`${hostHref("interpreter")}?type=${encodeURIComponent(id)}`)}
  />;
}

function KnowledgeCreateRoute({ params }) {
  const props = useKnowledgeCreateDemo({
    content: KNOWLEDGE_CREATE,
    type: params.get("type") || "Business Term",
    mode: params.get("copy") ? "copy" : params.get("mode") || "create",
    id: params.get("copy") || params.get("id") || undefined,
    onNavigate: ({ href }) => navigateHost(href),
    hrefFor: (id, values = {}) => {
      if (id === "knowledgeCreate") return `${hostHref("knowledge-create")}?${new URLSearchParams(values)}`;
      if (id === "interpreter") return `${hostHref("interpreter")}${Object.keys(values).length ? `?${new URLSearchParams(values)}` : ""}`;
      return mapDemoHref(({ home: "/index.html", cockpit: "/assets/pages/reports.html", selfService: "/assets/pages/flexible.html", campaign: "/assets/pages/campaign.html" })[id] || "/assets/pages/knowledge.html");
    },
  });
  return <KnowledgeCreatePage {...props} logo={hostLogo} />;
}

function SelfServiceRoute({ params }) {
  const props = useSelfServiceDemo({
    ...SELF_SERVICE,
    tab: params.get("tab") === "upload" ? "upload" : "analysis",
    category: "all",
    logo: hostLogo,
    navigation: hostNav(),
    assistant: { ...SELF_SERVICE.assistant, skillMenu: ASSISTANT_SKILL_MENU, open: false, prompt: "" },
    demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft },
  });
  return <SelfServicePage {...props} />;
}

function DataUploadRoute() {
  const page = useDataUploadDemo({
    logo: hostLogo,
    navigation: hostNav(),
    hero: SELF_SERVICE.hero,
    toolbar: { ...DATA_UPLOAD.toolbar, backHref: hostHref("self-service?tab=upload") },
    fields: DATA_UPLOAD.fields,
    bulkImport: DATA_UPLOAD.bulkImport,
    submitLabel: "Submit",
    submittingLabel: "Submitted",
  });
  return <DataUploadPage {...page} />;
function MediaTrackingRoute() {
  const props = useMediaTrackingDemo({
    ...MEDIA_TRACKING,
    toolbar: { ...MEDIA_TRACKING.toolbar, backHref: hostHref("self-service") },
    logo: hostLogo,
    navigation: hostNav(),
    current: "self-service",
    assistant: LITE_ASSISTANT,
    period: "monthly",
    onNavigate: ({ href }) => navigateHost(href),
  });
  return <MediaTrackingDetailPage {...props} />;
}

/* ------------------------------------------------------------------ */
/* P11 Data Model — standalone browser and source query normalization    */
/* ------------------------------------------------------------------ */

function dataModelHostHrefFor(id, params = {}) {
  const raw = dataModelPageHrefFor(id, params);
  const mapped = mapDemoHref(raw);
  const query = new URL(raw, "http://host.local").search;
  return mapped.includes("?") ? mapped : `${mapped}${query}`;
}

function DataModelRoute({ params }) {
  const normalizedSearch = normalizedDataModelSearch(params.toString());
  React.useEffect(() => {
    if (normalizedSearch) window.history.replaceState(null, "", `${hostHref("data-model")}${normalizedSearch}`);
  }, [normalizedSearch]);
  const page = useDataModelPageDemo({ content: DATA_MODEL_PAGE, hrefFor: dataModelHostHrefFor });
  return <DataModelPage {...page} />;
}

/* ------------------------------------------------------------------ */
/* Metric Dictionary                                                   */
/* ------------------------------------------------------------------ */

function MetricDictionaryRoute() {
  const hrefFor = (id, params) => mapDemoHref(metricDictionaryHrefFor(id, params));
  const props = useMetricDictionaryDemo({
    content: METRIC_DICTIONARY,
    hrefFor,
    modelFlow: MODEL_FLOW,
    modelDraftFor: buildModelDraft,
    assistantAnswerFor: buildLiteAssistantAnswer,
  });
  return <MetricDictionaryPage {...props} logo={hostLogo} navigation={hostNav()} content={METRIC_DICTIONARY} assistant={{ copy: METRIC_ASSISTANT, ...props.assistantState }} />;
}

/* ------------------------------------------------------------------ */
/* P09 Knowledge View — direct ID route and injected URL resolver       */
/* ------------------------------------------------------------------ */

function knowledgeViewHostHrefFor(id, params = {}) {
  if (id === "knowledgeView") {
    const query = new URLSearchParams(params).toString();
    return `${hostHref("knowledge-view")}${query ? `?${query}` : ""}`;
  }
  const raw = knowledgeViewHrefFor(id, params);
  const mapped = mapDemoHref(raw);
  const query = new URL(raw, "http://host.local").search;
  return mapped.includes("?") ? mapped : `${mapped}${query}`;
}

function KnowledgeViewRoute({ params }) {
  const recordId = params.get("id") || undefined;
  const redirect = knowledgeViewRedirectFor(recordId, INTERPRETER.records);
  const redirectHref = redirect ? knowledgeViewHostHrefFor(redirect.id, redirect.params) : null;
  React.useEffect(() => {
    if (!redirectHref) return;
    window.history.replaceState(null, "", redirectHref);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, [redirectHref]);
  const demo = useKnowledgeViewDemo({
    content: KNOWLEDGE_VIEW,
    recordId,
    hrefFor: knowledgeViewHostHrefFor,
  });
  if (redirectHref) return null;
  return <KnowledgeViewPage {...demo} logo={hostLogo} navigation={hostNav().filter((item) => ["home", "cockpit", "interpreter"].includes(item.id))} />;
}

function ReviewCenterRoute() {
  const props = useReviewCenterDemo({
    content: REVIEW_CENTER,
    records: REVIEW_CENTER.records,
    suggestions: REVIEW_CENTER.suggestions,
    fallbackSuggestions: REVIEW_CENTER.fallbackSuggestions,
    ...REVIEW_SHELL,
    logo: hostLogo,
    navigation: hostNav(),
    hrefFor: (id, params = {}) => {
      const path = ({ interpreter: hostHref("interpreter"), "review-center": hostHref("review-center"), "scenario-library": mapDemoHref("scenario-library.html"), "feedback-quality": hostHref("feedback-quality") })[id];
      const query = new URLSearchParams(params).toString();
      return path && query ? `${path}?${query}` : path;
    },
    onNavigate: ({ href }) => navigateHost(href),
  });
  return <ReviewCenterPage {...props} />;
}

const FEEDBACK_NOW = Date.UTC(2026, 8, 26, 12);
const FEEDBACK_RECORDS = makeFeedbackRecords(FEEDBACK_NOW - 1000);

function FeedbackQualityRoute() {
  const props = useFeedbackQualityDemo({
    content: FEEDBACK_QUALITY,
    records: FEEDBACK_RECORDS,
    now: FEEDBACK_NOW,
    onNavigate: ({ href }) => navigateHost(href),
  });
  const hrefFor = (id, params = {}) => {
    const path = ({ interpreter: hostHref("interpreter"), "review-center": hostHref("review-center"), "scenario-library": mapDemoHref("scenario-library.html"), "feedback-quality": hostHref("feedback-quality") })[id];
    const query = new URLSearchParams(params).toString();
    return path && query ? `${path}?${query}` : path;
  };
  return <FeedbackQualityPage {...props} logo={hostLogo} navigation={hostNav()} hrefFor={hrefFor} />;
}

function PersonalMemoryRoute() {
  const props = usePersonalMemoryDemo({ content: PERSONAL_MEMORY, records: PERSONAL_MEMORY.records, ...PERSONAL_MEMORY_SHELL, onNavigate: ({ href }) => navigateHost(href) });
  const hrefFor = (id, params = {}) => {
    const path = ({ interpreter: hostHref("interpreter"), "review-center": hostHref("review-center"), "scenario-library": mapDemoHref("scenario-library.html"), "feedback-quality": hostHref("feedback-quality") })[id];
    const query = new URLSearchParams(params).toString();
    return path && query ? `${path}?${query}` : path;
  };
  return <PersonalMemoryPage {...props} logo={hostLogo} navigation={hostNav()} hrefFor={hrefFor} />;
}

function ScenarioLibraryRoute() {
  const hrefFor = (id, params = {}) => {
    const path = ({ interpreter: hostHref("interpreter"), "review-center": hostHref("review-center"), "scenario-library": hostHref("scenario-library"), "feedback-quality": hostHref("feedback-quality") })[id];
    const query = new URLSearchParams(params).toString();
    return path && query ? `${path}?${query}` : path;
  };
  const page = useSkillLibraryDemo({ content: SKILL_LIBRARY, records: SKILL_LIBRARY.records, shell: SKILL_LIBRARY_SHELL, hrefFor, onNavigate: ({ href }) => navigateHost(href) });
  return <ScenarioLibraryPage {...page} logo={hostLogo} navigation={hostNav()} />;
}

function ScenarioDetailRoute({ params }) {
  const hrefFor = (id, query = {}) => {
    const path = ({ home: hostHref(""), cockpit: hostHref("cockpit"), interpreter: hostHref("interpreter"), "review-center": hostHref("review-center"), "scenario-library": mapDemoHref("scenario-library.html"), "feedback-quality": hostHref("feedback-quality"), "scenario-edit": hostHref("scenario-edit") })[id];
    const search = new URLSearchParams(query).toString();
    return path && search ? `${path}?${search}` : path;
  };
  const page = useScenarioDetailDemo({
    content: SCENARIO_DETAIL,
    records: SKILL_RECORDS,
    shell: SCENARIO_DETAIL_SHELL,
    initial: React.useMemo(() => ({ id: params.get("id") }), [params.toString()]),
    hrefFor,
  });
  return <ScenarioDetailPage {...page} logo={hostLogo} navigation={hostNav()} />;
}

function ScenarioEditRoute({ params }) {
  const hrefFor = (id, query = {}) => {
    const path = ({ interpreter: hostHref("interpreter"), "review-center": hostHref("review-center"), "scenario-library": mapDemoHref("scenario-library.html"), "feedback-quality": hostHref("feedback-quality"), cockpit: hostHref("cockpit") })[id];
    const search = new URLSearchParams(query).toString();
    return path && search ? `${path}?${search}` : path;
  };
  const props = useScenarioEditDemo({ content: SCENARIO_EDIT, records: SKILL_RECORDS, scenarioId: params.get("id") || "", ...SCENARIO_EDIT_SHELL, hrefFor, onNavigate: ({ href }) => navigateHost(href) });
  return <ScenarioEditPage {...props} logo={hostLogo} navigation={hostNav()} />;
}

/* ------------------------------------------------------------------ */
/* Compose — dual instances + host sentinel                              */
/* ------------------------------------------------------------------ */

const Sentinel = () => (
  <div className="host-sentinel" data-testid="host-sentinel">
    <button type="button" className="host-btn">Host button</button>
    <a className="host-link" href={hostHref("sentinel")}>Host link</a>
    <input className="host-input" defaultValue="host input" aria-label="host input" />
  </div>
);

function ComposeRoute() {
  const demoA = useCockpitDemo({ projects: REPORT_PROJECTS, knowledge: KNOWLEDGE_ASSETS, project: "city", dashboard: 0, workspaceOpen: true, demo: { copilot: COPILOT } });
  const demoB = useCockpitDemo({ projects: ALT_PROJECTS, knowledge: ALT_KNOWLEDGE, project: "alpha", dashboard: 0, workspaceOpen: true, demo: { copilot: ALT_COPILOT } });
  const termsA = useBusinessTermDemo({ ...INTERPRETER.businessTermLibrary });
  const termsB = useBusinessTermDemo({ ...ALT_BUSINESS_TERMS });
  return (
    <main className="host-compose">
      <header className="host-compose__head">
        <h1>Compose — reuse check</h1>
        <p>Two instances per organism, driven by different fixture bundles; the sentinel block proves the design system does not style host elements.</p>
      </header>
      <section className="host-grid" aria-label="City invest dashboards">
        <div className="host-cell" data-instance="a"><CityInvestDashboard {...CITY_INVEST_VIEW} getScenario={cityInvestScenarioSource(CITY_INVEST)} /></div>
        <div className="host-cell" data-instance="b"><CityInvestDashboard {...ALT_CITY_INVEST} baseline={undefined} getScenario={cityInvestScenarioSource(ALT_CITY_INVEST)} /></div>
      </section>
      <section className="host-grid" aria-label="Report copilots">
        <div className="host-cell host-copilot" data-instance="a"><ReportCopilot {...demoA.workspace} open={demoA.workspaceOpen} /></div>
        <div className="host-cell host-copilot" data-instance="b"><ReportCopilot {...demoB.workspace} open={demoB.workspaceOpen} /></div>
      </section>
      <section className="host-grid" aria-label="Business term libraries">
        <div className="host-cell" data-instance="a"><BusinessTermView {...termsA} /></div>
        <div className="host-cell" data-instance="b"><BusinessTermView {...termsB} /></div>
      </section>
      <section aria-label="Host sentinel"><Sentinel /></section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Coverage + app shell                                                */
/* ------------------------------------------------------------------ */

function CoverageRoute({ target }) {
  return (
    <main className="host-coverage">
      <h1>Coverage gap</h1>
      <p><code>{target || "this route"}</code> is not yet rebuilt in React.</p>
      <p><a className="host-link" href={hostHref("")}>Back to Home</a></p>
    </main>
  );
}

function App() {
  const route = useRoute();
  if (route.name === "sentinel") {
    return (
      <main className="host-sentinel-page">
        <Sentinel />
      </main>
    );
  }
  if (route.name === "cockpit") return <CockpitRoute params={route.params} />;
  if (route.name === "data-model") return <DataModelRoute params={route.params} />;
  if (route.name === "interpreter") return <InterpreterRoute params={route.params} />;
  if (route.name === "knowledge-create") return <KnowledgeCreateRoute key={route.params.toString()} params={route.params} />;
  if (route.name === "self-service") return <SelfServiceRoute params={route.params} />;
  if (route.name === "data-upload") return <DataUploadRoute />;
  if (route.name === "media-tracking-detail") return <MediaTrackingRoute />;
  if (route.name === "metric-dictionary") return <MetricDictionaryRoute />;
  if (route.name === "knowledge-view") return <KnowledgeViewRoute params={route.params} />;
  if (route.name === "review-center") return <ReviewCenterRoute />;
  if (route.name === "feedback-quality") return <FeedbackQualityRoute />;
  if (route.name === "personal-memory") return <PersonalMemoryRoute />;
  if (route.name === "scenario-library") return <ScenarioLibraryRoute />;
  if (route.name === "scenario-detail") return <ScenarioDetailRoute params={route.params} />;
  if (route.name === "scenario-edit") return <ScenarioEditRoute key={route.params.toString()} params={route.params} />;
  if (route.name === "compose") return <ComposeRoute />;
  if (route.name === "coverage") return <CoverageRoute target={route.target} />;
  return <HomeRoute />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
