/* The whole product as one demo site: all 17 pages, wired the way the
 * standalone host wires them (examples/host/main.jsx). Use it to see every page
 * working together, or copy it as the starting point of a customer demo that
 * needs most of the pages; remove the routes the story does not visit.
 * Which pages exist: handover/customer-demos/page-recipes.md. */
import React from "react";
import {
  AiInterpreterPage,
  CampaignPage,
  DataModelPage,
  DataUploadPage,
  FeedbackQualityPage,
  HomePage,
  KnowledgeCreatePage,
  KnowledgeViewPage,
  MarketingCockpitPage,
  MediaTrackingDetailPage,
  MetricDictionaryPage,
  PersonalMemoryPage,
  ReviewCenterPage,
  ScenarioDetailPage,
  ScenarioEditPage,
  ScenarioLibraryPage,
  SelfServicePage,
} from "marketing-hub";
import {
  ASSISTANT,
  ASSISTANT_SKILL_MENU,
  CAMPAIGN,
  CITY_INVEST,
  COCKPIT_SKILL_MENU,
  COPILOT,
  DATA_MODEL_PAGE,
  DATA_UPLOAD,
  FEEDBACK_QUALITY,
  INTERPRETER,
  KNOWLEDGE_ASSETS,
  KNOWLEDGE_CREATE,
  KNOWLEDGE_VIEW,
  LITE_ASSISTANT,
  MEDIA_TRACKING,
  METRIC_ASSISTANT,
  METRIC_DICTIONARY,
  MODEL_FLOW,
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

function SelfServiceRoute({ params }) {
  const router = useRouter();
  const props = useSelfServiceDemo({
    ...SELF_SERVICE,
    tab: params.tab === "upload" ? "upload" : "analysis",
    category: "all",
    logo: router.logo,
    navigation: router.navigation,
    hrefFor: router.hrefFor,
    onNavigate: router.navigate,
    assistant: { ...SELF_SERVICE.assistant, skillMenu: ASSISTANT_SKILL_MENU, open: false, prompt: "" },
    demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft },
  });
  return <SelfServicePage {...props} />;
}

function DataUploadRoute() {
  const router = useRouter();
  const page = useDataUploadDemo({
    logo: router.logo,
    navigation: router.navigation,
    hero: SELF_SERVICE.hero,
    toolbar: { ...DATA_UPLOAD.toolbar, backHref: router.hrefFor("self-service", { tab: "upload" }) },
    fields: DATA_UPLOAD.fields,
    bulkImport: DATA_UPLOAD.bulkImport,
    submitLabel: DATA_UPLOAD.submitLabel,
    submittingLabel: DATA_UPLOAD.submittingLabel,
  });
  return <DataUploadPage {...page} />;
}

function MediaTrackingRoute() {
  const router = useRouter();
  const props = useMediaTrackingDemo({
    ...MEDIA_TRACKING,
    toolbar: { ...MEDIA_TRACKING.toolbar, backHref: router.hrefFor("self-service") },
    logo: router.logo,
    navigation: router.navigation,
    current: "self-service",
    assistant: LITE_ASSISTANT,
    period: "monthly",
    onNavigate: router.navigate,
  });
  return <MediaTrackingDetailPage {...props} />;
}

function CampaignRoute() {
  const router = useRouter();
  const props = useCampaignDemo({
    ...CAMPAIGN,
    logo: router.logo,
    navigation: router.navigation,
    section: "overview",
    channel: "rednote",
    assistantOpen: false,
    prompt: "",
    demo: { modelFlow: MODEL_FLOW, modelDraftFor: buildModelDraft, toasts: CAMPAIGN.toasts },
    onNavigate: router.navigate,
  });
  return <CampaignPage {...props} />;
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

function KnowledgeCreateRoute({ params }) {
  const router = useRouter();
  const props = useKnowledgeCreateDemo({
    content: KNOWLEDGE_CREATE,
    type: params.type || "Business Term",
    mode: params.copy ? "copy" : params.mode || "create",
    id: params.copy || params.id || undefined,
    onNavigate: router.navigate,
    hrefFor: router.hrefFor,
  });
  return <KnowledgeCreatePage {...props} logo={router.logo} />;
}

function KnowledgeViewRoute({ params }) {
  const router = useRouter();
  const recordId = params.id || undefined;
  const redirect = knowledgeViewRedirectFor(recordId, INTERPRETER.records);
  const redirectHref = redirect ? router.hrefFor(redirect.id, redirect.params) : null;
  React.useEffect(() => {
    if (redirectHref) window.location.replace(redirectHref);
  }, [redirectHref]);
  const demo = useKnowledgeViewDemo({ content: KNOWLEDGE_VIEW, recordId, hrefFor: router.hrefFor, onNavigate: router.navigate });
  if (redirectHref) return null;
  return <KnowledgeViewPage {...demo} logo={router.logo} navigation={router.navigation.filter((item) => ["home", "cockpit", "interpreter"].includes(item.id))} />;
}

function MetricDictionaryRoute() {
  const router = useRouter();
  const props = useMetricDictionaryDemo({
    content: METRIC_DICTIONARY,
    hrefFor: router.hrefFor,
    onNavigate: router.navigate,
    modelFlow: MODEL_FLOW,
    modelDraftFor: buildModelDraft,
    assistantAnswerFor: buildLiteAssistantAnswer,
  });
  return <MetricDictionaryPage {...props} logo={router.logo} navigation={router.navigation} content={METRIC_DICTIONARY} assistant={{ ...METRIC_ASSISTANT, ...props.assistant }} />;
}

function DataModelRoute() {
  const router = useRouter();
  const page = useDataModelPageDemo({ content: DATA_MODEL_PAGE, hrefFor: router.hrefFor, onNavigate: router.navigate });
  return <DataModelPage {...page} />;
}

function ReviewCenterRoute() {
  const router = useRouter();
  const props = useReviewCenterDemo({
    content: REVIEW_CENTER,
    records: REVIEW_CENTER.records,
    suggestions: REVIEW_CENTER.suggestions,
    fallbackSuggestions: REVIEW_CENTER.fallbackSuggestions,
    ...REVIEW_SHELL,
    logo: router.logo,
    navigation: router.navigation,
    hrefFor: router.hrefFor,
    onNavigate: router.navigate,
  });
  return <ReviewCenterPage {...props} />;
}

const FEEDBACK_NOW = Date.UTC(2026, 8, 26, 12);
const FEEDBACK_RECORDS = makeFeedbackRecords(FEEDBACK_NOW - 1000);

function FeedbackQualityRoute() {
  const router = useRouter();
  const props = useFeedbackQualityDemo({ content: FEEDBACK_QUALITY, records: FEEDBACK_RECORDS, now: FEEDBACK_NOW, onNavigate: router.navigate });
  return <FeedbackQualityPage {...props} logo={router.logo} navigation={router.navigation} hrefFor={router.hrefFor} />;
}

function PersonalMemoryRoute() {
  const router = useRouter();
  const props = usePersonalMemoryDemo({ content: PERSONAL_MEMORY, records: PERSONAL_MEMORY.records, ...PERSONAL_MEMORY_SHELL, onNavigate: router.navigate });
  return <PersonalMemoryPage {...props} logo={router.logo} navigation={router.navigation} hrefFor={router.hrefFor} />;
}

function ScenarioLibraryRoute({ params }) {
  const router = useRouter();
  const page = useSkillLibraryDemo({ content: SKILL_LIBRARY, records: SKILL_LIBRARY.records, shell: SKILL_LIBRARY_SHELL, notice: params.notice, hrefFor: router.hrefFor, onNavigate: router.navigate });
  return <ScenarioLibraryPage {...page} logo={router.logo} navigation={router.navigation} />;
}

function ScenarioDetailRoute({ params }) {
  const router = useRouter();
  const page = useScenarioDetailDemo({
    content: SCENARIO_DETAIL,
    records: SKILL_RECORDS,
    shell: SCENARIO_DETAIL_SHELL,
    initial: React.useMemo(() => ({ id: params.id }), [params.id]),
    hrefFor: router.hrefFor,
  });
  return <ScenarioDetailPage {...page} logo={router.logo} navigation={router.navigation} />;
}

function ScenarioEditRoute({ params }) {
  const router = useRouter();
  const props = useScenarioEditDemo({ content: SCENARIO_EDIT, records: SKILL_RECORDS, scenarioId: params.id || "", ...SCENARIO_EDIT_SHELL, hrefFor: router.hrefFor, onNavigate: router.navigate });
  return <ScenarioEditPage {...props} logo={router.logo} navigation={router.navigation} />;
}

export function App() {
  return (
    <DemoSite
      brand={brand}
      routes={{
        home: HomeRoute,
        cockpit: CockpitRoute,
        "self-service": SelfServiceRoute,
        "data-upload": DataUploadRoute,
        "media-tracking-detail": MediaTrackingRoute,
        campaign: CampaignRoute,
        interpreter: InterpreterRoute,
        "knowledge-create": KnowledgeCreateRoute,
        "knowledge-view": KnowledgeViewRoute,
        "metric-dictionary": MetricDictionaryRoute,
        "data-model": DataModelRoute,
        "review-center": ReviewCenterRoute,
        "feedback-quality": FeedbackQualityRoute,
        "personal-memory": PersonalMemoryRoute,
        "scenario-library": ScenarioLibraryRoute,
        "scenario-detail": ScenarioDetailRoute,
        "scenario-edit": ScenarioEditRoute,
      }}
    />
  );
}
