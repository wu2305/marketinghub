/* A demo site: the route table is the list of pages the customer can visit.
 * To add a page, copy its `XxxRoute` function from examples/host/main.jsx
 * (see handover/customer-demos/page-recipes.md), then add one line to `routes`. */
import React from "react";
import {
  AiInterpreterPage,
  HomePage,
  MarketingCockpitPage,
} from "marketing-hub";
import {
  ASSISTANT,
  ASSISTANT_SKILL_MENU,
  CITY_INVEST,
  COCKPIT_SKILL_MENU,
  COPILOT,
  INTERPRETER,
  KNOWLEDGE_ASSETS,
  MODEL_FLOW,
  REPORT_PROJECTS,
  buildHomeAssistantAnswer,
  buildInterpreterAnswer,
  buildModelDraft,
  buildReportAssistantAnswer,
  cityInvestScenarioSource,
  demoTargetForHref,
  useCockpitDemo,
  useHomeDemo,
  useInterpreterDemo,
} from "marketing-hub/demo";
import { DemoSite, useRouter } from "../_kit/router.jsx";
import { brand, cockpit, home } from "./content.js";

function HomeRoute() {
  const router = useRouter();
  const props = useHomeDemo({
    logo: router.logo,
    navigation: router.navigation,
    hero: home.hero,
    heading: home.heading,
    /* Cards for pages this demo does not include would lead nowhere. */
    cards: home.cards.filter((card) => router.has(card.target.id)),
    hrefFor: router.hrefFor,
    onNavigate: router.navigate,
    assistant: { ...ASSISTANT, skillMenu: ASSISTANT_SKILL_MENU },
    assistantOpen: false,
    prompt: "",
    scope: ASSISTANT.scopes[0],
    demo: { answerFor: buildHomeAssistantAnswer, modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft },
  });
  return <HomePage {...props} />;
}

const { baseline: _baseline, ...CITY_INVEST_VIEW } = CITY_INVEST;

function CockpitRoute({ params }) {
  const router = useRouter();
  const props = useCockpitDemo({
    project: params.project || "all",
    view: params.view || "catalog",
    dashboard: params.dashboard ?? null,
    logo: router.logo,
    navigation: router.navigation,
    hero: cockpit.hero,
    copy: cockpit.copy,
    groups: cockpit.groups,
    projects: REPORT_PROJECTS,
    knowledge: KNOWLEDGE_ASSETS,
    cityInvest: { ...CITY_INVEST_VIEW, getScenario: cityInvestScenarioSource(CITY_INVEST) },
    demo: { copilot: COPILOT, modelFlow: MODEL_FLOW, reportAnswerFor: buildReportAssistantAnswer },
    detailsSections: cockpit.detailsSections,
    assistant: { ...cockpit.assistant, skillMenu: COCKPIT_SKILL_MENU },
    hrefFor: router.hrefFor,
    onNavigate: router.navigate,
  });
  return <MarketingCockpitPage {...props} />;
}

function InterpreterRoute({ params }) {
  const router = useRouter();
  const activeType = params.type || "overview";
  const principles = { items: INTERPRETER.principles, strings: INTERPRETER.principlesLibrary, selectedCategories: [], page: 1, pageSize: 10, expanded: [] };
  const demo = useInterpreterDemo({
    types: INTERPRETER.types,
    records: INTERPRETER.records,
    activeType,
    query: "",
    principles,
    businessTermLibrary: INTERPRETER.businessTermLibrary,
    fieldLibrary: { ...INTERPRETER.fieldLibrary, detail: params.detail || null },
    scenarioReports: INTERPRETER.scenarioReports,
    hrefFor: router.hrefFor,
    targetForHref: demoTargetForHref,
    notice: params.notice,
    notices: INTERPRETER.notices,
    assistant: { ...INTERPRETER.assistant, open: false, prompt: "" },
    demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, answerFor: buildInterpreterAnswer },
    onNavigate: router.navigate,
  });
  return (
    <AiInterpreterPage
      logo={router.logo}
      navigation={router.navigation}
      hero={INTERPRETER.hero}
      overviewItem={INTERPRETER.overview}
      sidebarTitle={INTERPRETER.sidebarTitle}
      copy={INTERPRETER.copy}
      types={INTERPRETER.types}
      activeType={activeType}
      {...demo}
      hrefFor={router.hrefFor}
      onNavigate={router.navigate}
    />
  );
}

export function App() {
  return <DemoSite brand={brand} routes={{ home: HomeRoute, cockpit: CockpitRoute, interpreter: InterpreterRoute }} />;
}
