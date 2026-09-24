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
  MarketingCockpitPage,
  CityInvestDashboard,
  ReportCopilot,
  useCockpitDemo,
  buildCopilotChatEntry,
  copilotSkillItems,
  resolveCopilotAnswer,
} from "../../src/design/index.js";
import {
  ASSISTANT,
  ASSISTANT_SKILL_MENU,
  COCKPIT,
  COCKPIT_SKILL_MENU,
  HOME,
  LOGO,
  MODEL_FLOW,
  NAV,
  buildAssistantAnswer,
  buildReportAssistantAnswer,
} from "../../src/design/content.js";
import { CITY_INVEST, COPILOT, KNOWLEDGE_ASSETS, REPORT_PROJECTS } from "../../src/design/demo/report-fixtures.js";
import { cityInvestScenarioSource } from "../../src/design/demo/report-demo.js";
import {
  ALT_CITY_INVEST,
  ALT_COPILOT,
  ALT_KNOWLEDGE,
  ALT_PROJECTS,
} from "../../src/design/demo/__fixtures__/alt-cockpit.js";

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
};

function mapDemoHref(href) {
  if (!href) return href;
  const url = new URL(href, `http://host.local${BASE}`);
  if (!url.pathname.endsWith(".html") && url.pathname !== "/") return href;
  const mapped = ROUTE_MAP[url.pathname];
  if (mapped === undefined) return hostHref(`coverage/${url.pathname.replace(/^\/+/, "")}`);
  const project = url.searchParams.get("project");
  if (mapped === "cockpit" && project) return `${hostHref("cockpit")}?project=${project}`;
  return hostHref(mapped);
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
      const next = url.pathname.startsWith(BASE)
        ? url.pathname + url.search
        : mapDemoHref(url.pathname + url.search);
      if (next === window.location.pathname + window.location.search) return;
      window.history.pushState(null, "", next);
      setLoc(next);
    };
    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick);
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
  const [open, setOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [scope, setScope] = React.useState("All");
  const [answers, setAnswers] = React.useState([]);
  const scopeContexts = { All: "personalized", Campaigns: "campaign", Dashboards: "report", Knowledge: "knowledge" };
  const cards = HOME.cards.map((card) => ({
    ...card,
    href: mapDemoHref(card.href),
    links: (card.links || []).map((link) => ({ ...link, href: mapDemoHref(link.href) })),
  }));
  return (
    <HomePage
      logo={hostLogo}
      navigation={hostNav()}
      hero={HOME.hero}
      heading={HOME.heading}
      cards={cards}
      assistant={{
        ...ASSISTANT,
        skillMenu: ASSISTANT_SKILL_MENU,
        answers,
      }}
      assistantOpen={open}
      prompt={prompt}
      scope={scope}
      onOpenAssistant={() => setOpen(true)}
      onCloseAssistant={() => setOpen(false)}
      onPromptChange={({ value }) => setPrompt(value)}
      onScopeChange={({ scope: next }) => setScope(next)}
      onSuggestion={(event) => setPrompt(event.prompt)}
      onSubmit={(event) => {
        const text = String(event.prompt || "").trim();
        if (!text) return;
        setAnswers([buildAssistantAnswer(text, scopeContexts[scope] || "personalized")]);
        setPrompt("");
      }}
      onNewSession={() => setAnswers([])}
    />
  );
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
    assistant: { ...COCKPIT.assistant, showScopes: false, showPicks: false, hideStageOnAnswers: true, enterToSubmit: false, skillMenu: COCKPIT_SKILL_MENU },
    ...cockpitRoutes,
  });
  return <MarketingCockpitPage {...props} />;
}

/* ------------------------------------------------------------------ */
/* Compose — dual instances + host sentinel                              */
/* ------------------------------------------------------------------ */

/** Minimal per-instance copilot wiring: recommendation → answer view,
 *  question → chat entry. Mirrors useCockpitDemo's workspace logic. */
function useCopilotInstance({ copilot, projects, knowledge, projectKey, rawIndex }) {
  const [answer, setAnswer] = React.useState(null);
  const [chat, setChat] = React.useState([]);
  const [prompt, setPrompt] = React.useState("");
  const report = projects[projectKey]?.reports?.[rawIndex];
  return {
    open: true,
    title: report?.assistant?.panelTitle || copilot.defaultProfile?.panelTitle,
    eyebrow: copilot.eyebrow,
    summary: copilot.summary,
    recommendations: (report?.recommendations || []).map((rec) => ({ title: rec.title })),
    periodHint: report?.assistant?.periodHint || copilot.defaultProfile?.periodHint,
    answer,
    chat,
    prompt,
    history: copilot.history,
    commandHint: copilot.commandHint,
    inputPlaceholder: copilot.inputPlaceholder,
    answerLabel: copilot.answerLabel,
    skillMenu: copilot.skillMenu ? { ...copilot.skillMenu, items: copilotSkillItems(knowledge, copilot.skillFallback) } : undefined,
    onRecommendation: ({ index }) => setAnswer(resolveCopilotAnswer(projects, copilot, projectKey, rawIndex, index)),
    onAsk: ({ question }) => {
      setChat((current) => [...current, buildCopilotChatEntry(projects, knowledge, copilot, projectKey, rawIndex, question)]);
    },
    onPromptChange: ({ value }) => setPrompt(value),
    onBack: () => {
      setAnswer(null);
      setChat([]);
    },
    onNewSession: () => {
      setAnswer(null);
      setChat([]);
      setPrompt("");
    },
  };
}

const Sentinel = () => (
  <div className="host-sentinel" data-testid="host-sentinel">
    <button type="button" className="host-btn">Host button</button>
    <a className="host-link" href={hostHref("sentinel")}>Host link</a>
    <input className="host-input" defaultValue="host input" aria-label="host input" />
  </div>
);

function ComposeRoute() {
  const copilotA = useCopilotInstance({ copilot: COPILOT, projects: REPORT_PROJECTS, knowledge: KNOWLEDGE_ASSETS, projectKey: "city", rawIndex: 0 });
  const copilotB = useCopilotInstance({ copilot: ALT_COPILOT, projects: ALT_PROJECTS, knowledge: ALT_KNOWLEDGE, projectKey: "alpha", rawIndex: 0 });
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
        <div className="host-cell host-copilot" data-instance="a"><ReportCopilot {...copilotA} /></div>
        <div className="host-cell host-copilot" data-instance="b"><ReportCopilot {...copilotB} /></div>
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
  if (route.name === "compose") return <ComposeRoute />;
  if (route.name === "coverage") return <CoverageRoute target={route.target} />;
  return <HomeRoute />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
