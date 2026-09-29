/* Standalone React host for the design system.
 *
 * Goals: prove the components run outside Storybook under a non-root base
 * (`/mh-host/`), that routed navigation stays inside React (no full reloads,
 * no jumps to the original HTML demo), and that tokens.css does not leak
 * styles into host elements (the compose page carries a host-owned sentinel).
 *
 * Imports components only via src/design/index.js; demo fixtures/containers
 * come from the separate src/design/demo/index.js entry.
 * Never imports .storybook/*, *.stories.jsx, or original assets/js.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import "./host.css";
import {
  AiInterpreterPage,
  BusinessTermView,
  CampaignPage,
  CityInvestDashboard,
  DataModelPage,
  DataUploadPage,
  FeedbackQualityPage,
  Hero,
  HomePage,
  KnowledgeCreatePage,
  KnowledgeViewPage,
  MarketingCockpitPage,
  MediaTrackingDetailPage,
  MetricDictionaryPage,
  Modal,
  PersonalMemoryPage,
  ReportCopilot,
  ReviewCenterPage,
  ScenarioDetailPage,
  ScenarioEditPage,
  ScenarioLibraryPage,
  SelfServicePage,
} from "../../src/design/index.js";
import {
  ASSISTANT,
  ASSISTANT_SKILL_MENU,
  CAMPAIGN,
  CITY_INVEST,
  COCKPIT,
  COCKPIT_SKILL_MENU,
  COPILOT,
  DATA_MODEL_PAGE,
  DATA_UPLOAD,
  FEEDBACK_QUALITY,
  HOME,
  INTERPRETER,
  KNOWLEDGE_ASSETS,
  KNOWLEDGE_CREATE,
  KNOWLEDGE_VIEW,
  LITE_ASSISTANT,
  LOGO,
  MEDIA_TRACKING,
  METRIC_ASSISTANT,
  METRIC_DICTIONARY,
  MODEL_FLOW,
  NAV,
  PERSONAL_MEMORY,
  PERSONAL_MEMORY_SHELL,
  REPORT_PROJECTS,
  REVIEW_CENTER,
  REVIEW_SHELL,
  SCENARIO_DETAIL,
  SCENARIO_DETAIL_SHELL,
  SCENARIO_EDIT,
  SCENARIO_EDIT_SHELL,
  SELF_SERVICE,
  SKILL_LIBRARY,
  SKILL_LIBRARY_SHELL,
  SKILL_RECORDS,
  buildHomeAssistantAnswer,
  buildInterpreterAnswer,
  buildLiteAssistantAnswer,
  buildModelDraft,
  buildReportAssistantAnswer,
  cityInvestScenarioSource,
  demoTargetForHref,
  knowledgeViewRedirectFor,
  makeFeedbackRecords,
  normalizeRouteTarget,
  normalizedDataModelSearch,
  useBusinessTermDemo,
  useCampaignDemo,
  useCockpitDemo,
  useDataModelPageDemo,
  useDataUploadDemo,
  useFeedbackQualityDemo,
  useHomeDemo,
  useInterpreterDemo,
  useKnowledgeCreateDemo,
  useKnowledgeViewDemo,
  useMediaTrackingDemo,
  useMetricDictionaryDemo,
  usePersonalMemoryDemo,
  useReviewCenterDemo,
  useScenarioDetailDemo,
  useScenarioEditDemo,
  useSelfServiceDemo,
  useSkillLibraryDemo,
} from "../../src/design/demo/index.js";
import {
  ALT_CITY_INVEST,
  ALT_COPILOT,
  ALT_KNOWLEDGE,
  ALT_PROJECTS,
} from "../../src/design/demo/__fixtures__/alt-cockpit.js";
import { ALT_BUSINESS_TERMS } from "../../src/design/demo/__fixtures__/alt-business-terms.js";
/* Set once per boot; host-check asserts it survives every in-app navigation
   (i.e. clicks never trigger a full page load). */
window.__mhHostBoot = window.__mhHostBoot || Math.random().toString(36).slice(2);

const BASE = "/mh-host/";
const hostHref = (path) => `${BASE}${String(path).replace(/^\/+/, "")}`;

/* One semantic route table. Original HTML paths are understood only by the
   private demo adapter above; the host itself builds routes from ids. */
const HOST_PATHS = {
  home: "", cockpit: "cockpit", "self-service": "self-service",
  "data-upload": "data-upload", "media-tracking-detail": "media-tracking-detail", campaign: "campaign",
  interpreter: "interpreter", "knowledge-create": "knowledge-create", "knowledge-view": "knowledge-view",
  "metric-dictionary": "metric-dictionary", "data-model": "data-model", "review-center": "review-center",
  "feedback-quality": "feedback-quality", "personal-memory": "personal-memory", "scenario-library": "scenario-library",
  "scenario-detail": "scenario-detail", "scenario-edit": "scenario-edit",
};
const PATH_IDS = Object.fromEntries(Object.entries(HOST_PATHS).map(([id, path]) => [path, id]));

function hostHrefFor(id, params = {}) {
  const target = normalizeRouteTarget(id, params);
  const path = HOST_PATHS[target.id];
  if (path === undefined) throw new Error(`Unknown host route: ${id}`);
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(target.params)) {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  }
  return `${hostHref(path)}${query.size ? `?${query}` : ""}`;
}

function mapDemoHref(href) {
  if (!href) return href;
  if (href.startsWith(BASE)) return href;
  const target = demoTargetForHref(href);
  if (!target) return href;
  if (target.id === "coverage") {
    const { path, ...params } = target.params;
    const query = new URLSearchParams(params).toString();
    return `${hostHref(`coverage/${path.replace(/^\/+/, "")}`)}${query ? `?${query}` : ""}`;
  }
  return hostHrefFor(target.id, target.params);
}

function targetForHref(href) {
  if (href?.startsWith(BASE)) {
    const url = new URL(href, "http://host.local");
    const path = url.pathname.slice(BASE.length).replace(/\/+$/, "");
    const id = PATH_IDS[path];
    return id ? { id, params: Object.fromEntries(url.searchParams) } : null;
  }
  return demoTargetForHref(href);
}

function navigateHost(href) {
  if (!href) return;
  const next = href.startsWith(BASE) ? href : mapDemoHref(href);
  if (next === window.location.pathname + window.location.search) return;
  window.history.pushState(null, "", next);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function navigateTarget({ id, params, href }) {
  navigateHost(id && Object.hasOwn(HOST_PATHS, id) ? hostHrefFor(id, params) : href);
}

const hostNav = () =>
  NAV.map((item) => ({ ...item, href: hostHrefFor(item.id) }));

const hostLogo = { ...LOGO, href: hostHrefFor("home") };

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
  if (Object.hasOwn(PATH_IDS, rest)) return { name: PATH_IDS[rest], params };
  if (rest === "compose") return { name: "compose", params };
  if (rest === "sentinel") return { name: "sentinel", params };
  if (rest === "slot-sentinel") return { name: "slot-sentinel", params };
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
  const props = useHomeDemo({
    logo: hostLogo,
    navigation: hostNav(),
    hero: HOME.hero,
    heading: HOME.heading,
    cards: HOME.cards,
    hrefFor: hostHrefFor,
    onNavigate: navigateTarget,
    assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU },
    assistantOpen: false,
    prompt: "",
    scope: ASSISTANT.scopes[0],
    demo: {
      answerFor: (...args) => {
        const answer = buildHomeAssistantAnswer(...args);
        return { ...answer, actions: answer.actions.map((action) => action.href ? { ...action, href: mapDemoHref(action.href) } : action) };
      },
      modelFlow: MODEL_FLOW,
      modelDraftFor: buildModelDraft,
    },
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
    copy: COCKPIT.copy,
    groups: COCKPIT.groups,
    projects: REPORT_PROJECTS,
    knowledge: KNOWLEDGE_ASSETS,
    cityInvest: { ...CITY_INVEST_VIEW, getScenario: cityInvestScenarioSource(CITY_INVEST) },
    demo: { copilot: COPILOT, modelFlow: MODEL_FLOW, reportAnswerFor: buildReportAssistantAnswer },
    detailsSections: COCKPIT.detailsSections.map((section) => ({
      ...section,
      pills: section.pills.map((pill) => ({ ...pill, href: mapDemoHref(pill.href) })),
    })),
    assistant: { ...COCKPIT.assistant, skillMenu: COCKPIT_SKILL_MENU },
    hrefFor: hostHrefFor,
    onNavigate: navigateTarget,
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
    hrefFor: hostHrefFor,
    targetForHref,
    notice: params.get("notice"),
    notices: INTERPRETER.notices,
    assistant: { ...INTERPRETER.assistant, open: false, prompt: "" },
    demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, answerFor: buildInterpreterAnswer },
    onNavigate: navigateTarget,
  });
  return <AiInterpreterPage
    logo={hostLogo} navigation={hostNav()} hero={INTERPRETER.hero} overviewItem={INTERPRETER.overview}
    sidebarTitle={INTERPRETER.sidebarTitle} copy={INTERPRETER.copy} types={INTERPRETER.types}
    activeType={activeType} {...demo} hrefFor={hostHrefFor}
    onNavigate={navigateTarget}
  />;
}

function KnowledgeCreateRoute({ params }) {
  const props = useKnowledgeCreateDemo({
    content: KNOWLEDGE_CREATE,
    type: params.get("type") || "Business Term",
    mode: params.get("copy") ? "copy" : params.get("mode") || "create",
    id: params.get("copy") || params.get("id") || undefined,
    onNavigate: navigateTarget,
    hrefFor: hostHrefFor,
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
    hrefFor: hostHrefFor,
    onNavigate: navigateTarget,
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
    submitLabel: DATA_UPLOAD.submitLabel,
    submittingLabel: DATA_UPLOAD.submittingLabel,
  });
  return <DataUploadPage {...page} />;
}

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

function CampaignRoute() {
  const props = useCampaignDemo({
    ...CAMPAIGN,
    logo: hostLogo,
    navigation: hostNav(),
    section: "overview",
    channel: "rednote",
    assistantOpen: false,
    prompt: "",
    demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, toasts: CAMPAIGN.toasts },
    onNavigate: ({ href }) => navigateHost(href),
  });
  return <CampaignPage {...props} />;
}

/* ------------------------------------------------------------------ */
/* P11 Data Model — standalone browser and source query normalization    */
/* ------------------------------------------------------------------ */

function DataModelRoute({ params }) {
  const normalizedSearch = normalizedDataModelSearch(params.toString());
  React.useEffect(() => {
    if (normalizedSearch) window.history.replaceState(null, "", `${hostHref("data-model")}${normalizedSearch}`);
  }, [normalizedSearch]);
  const page = useDataModelPageDemo({ content: DATA_MODEL_PAGE, hrefFor: hostHrefFor, onNavigate: navigateTarget });
  return <DataModelPage {...page} />;
}

/* ------------------------------------------------------------------ */
/* Metric Dictionary                                                   */
/* ------------------------------------------------------------------ */

function MetricDictionaryRoute() {
  const props = useMetricDictionaryDemo({
    content: METRIC_DICTIONARY,
    hrefFor: hostHrefFor,
    onNavigate: navigateTarget,
    modelFlow: MODEL_FLOW,
    modelDraftFor: buildModelDraft,
    assistantAnswerFor: buildLiteAssistantAnswer,
  });
  return <MetricDictionaryPage {...props} logo={hostLogo} navigation={hostNav()} content={METRIC_DICTIONARY} assistant={{ ...METRIC_ASSISTANT, ...props.assistant }} />;
}

/* ------------------------------------------------------------------ */
/* P09 Knowledge View — direct ID route and injected URL resolver       */
/* ------------------------------------------------------------------ */

function KnowledgeViewRoute({ params }) {
  const recordId = params.get("id") || undefined;
  const redirect = knowledgeViewRedirectFor(recordId, INTERPRETER.records);
  const redirectHref = redirect ? hostHrefFor(redirect.id, redirect.params) : null;
  React.useEffect(() => {
    if (!redirectHref) return;
    window.history.replaceState(null, "", redirectHref);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, [redirectHref]);
  const demo = useKnowledgeViewDemo({
    content: KNOWLEDGE_VIEW,
    recordId,
    hrefFor: hostHrefFor,
    onNavigate: navigateTarget,
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
    hrefFor: hostHrefFor,
    onNavigate: navigateTarget,
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
    onNavigate: navigateTarget,
  });
  return <FeedbackQualityPage {...props} logo={hostLogo} navigation={hostNav()} hrefFor={hostHrefFor} />;
}

function PersonalMemoryRoute() {
  const props = usePersonalMemoryDemo({ content: PERSONAL_MEMORY, records: PERSONAL_MEMORY.records, ...PERSONAL_MEMORY_SHELL, onNavigate: navigateTarget });
  return <PersonalMemoryPage {...props} logo={hostLogo} navigation={hostNav()} hrefFor={hostHrefFor} />;
}

function ScenarioLibraryRoute({ params }) {
  const page = useSkillLibraryDemo({ content: SKILL_LIBRARY, records: SKILL_LIBRARY.records, shell: SKILL_LIBRARY_SHELL, notice: params.get("notice"), hrefFor: hostHrefFor, onNavigate: navigateTarget });
  return <ScenarioLibraryPage {...page} logo={hostLogo} navigation={hostNav()} />;
}

function ScenarioDetailRoute({ params }) {
  const page = useScenarioDetailDemo({
    content: SCENARIO_DETAIL,
    records: SKILL_RECORDS,
    shell: SCENARIO_DETAIL_SHELL,
    initial: React.useMemo(() => ({ id: params.get("id") }), [params.toString()]),
    hrefFor: hostHrefFor,
  });
  return <ScenarioDetailPage {...page} logo={hostLogo} navigation={hostNav()} />;
}

function ScenarioEditRoute({ params }) {
  const props = useScenarioEditDemo({ content: SCENARIO_EDIT, records: SKILL_RECORDS, scenarioId: params.get("id") || "", ...SCENARIO_EDIT_SHELL, hrefFor: hostHrefFor, onNavigate: navigateTarget });
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
    <button type="button" data-testid="host-native-button">Native button</button>
    <a data-testid="host-native-link" href={hostHref("sentinel")}>Native link</a>
    <input data-testid="host-native-input" defaultValue="native input" aria-label="native input" />
  </div>
);

function SlotSentinelRoute() {
  return (
    <main>
      <div className="host-slot-hero">
        <Hero title="Host slot isolation" height={240} scrim="none"><Sentinel /></Hero>
      </div>
      <div className="host-slot-modal">
        <Modal open title="Host slot isolation"><Sentinel /></Modal>
      </div>
      <div className="host-slot-nested">
        <Hero title="Nested host slot isolation" height={240} scrim="none">
          <Modal open title="Nested host slot isolation"><Sentinel /></Modal>
        </Hero>
      </div>
      <div className="host-slot-drawer">
        <Hero title="Drawer host slot isolation" height={240} scrim="none">
          <Modal open variant="drawer" title="Drawer host slot isolation" titleExtra={<Sentinel />} footer={<Sentinel />}>
            <Sentinel />
          </Modal>
        </Hero>
      </div>
    </main>
  );
}

function ComposeRoute() {
  const demoA = useCockpitDemo({ projects: REPORT_PROJECTS, knowledge: KNOWLEDGE_ASSETS, project: "city", dashboard: 0, workspaceOpen: true, hrefFor: hostHrefFor, demo: { copilot: COPILOT } });
  const demoB = useCockpitDemo({ projects: ALT_PROJECTS, knowledge: ALT_KNOWLEDGE, project: "alpha", dashboard: 0, workspaceOpen: true, hrefFor: hostHrefFor, demo: { copilot: ALT_COPILOT } });
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
  if (route.name === "slot-sentinel") return <SlotSentinelRoute />;
  if (route.name === "cockpit") return <CockpitRoute params={route.params} />;
  if (route.name === "data-model") return <DataModelRoute params={route.params} />;
  if (route.name === "interpreter") return <InterpreterRoute params={route.params} />;
  if (route.name === "knowledge-create") return <KnowledgeCreateRoute key={route.params.toString()} params={route.params} />;
  if (route.name === "self-service") return <SelfServiceRoute params={route.params} />;
  if (route.name === "data-upload") return <DataUploadRoute />;
  if (route.name === "media-tracking-detail") return <MediaTrackingRoute />;
  if (route.name === "campaign") return <CampaignRoute />;
  if (route.name === "metric-dictionary") return <MetricDictionaryRoute />;
  if (route.name === "knowledge-view") return <KnowledgeViewRoute params={route.params} />;
  if (route.name === "review-center") return <ReviewCenterRoute />;
  if (route.name === "feedback-quality") return <FeedbackQualityRoute />;
  if (route.name === "personal-memory") return <PersonalMemoryRoute />;
  if (route.name === "scenario-library") return <ScenarioLibraryRoute params={route.params} />;
  if (route.name === "scenario-detail") return <ScenarioDetailRoute params={route.params} />;
  if (route.name === "scenario-edit") return <ScenarioEditRoute key={route.params.toString()} params={route.params} />;
  /* P04–P06 routes are supplied by their separate closeout packages before
     this navigation package is frozen against latest main. */
  if (["data-upload", "media-tracking-detail", "campaign"].includes(route.name)) return <CoverageRoute target={route.name} />;
  if (route.name === "compose") return <ComposeRoute />;
  if (route.name === "coverage") return <CoverageRoute target={route.target} />;
  return <HomeRoute />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
