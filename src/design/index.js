/**
 * Public entry point for the Marketing Hub design system.
 * Import components and option constants from here — internal module layout
 * (atoms/molecules/organisms/pages) is not part of the public API.
 *
 * `demoContent` holds the static copy and sample records used by the stories;
 * hosts should pass their own data via props.
 */
export { Button, Link, TextInput, TextArea, Select, StatusBadge, buttonVariants, controlSizes, buttonTypes } from "./atoms.jsx";
export {
  SearchField,
  CheckboxFilter,
  Pagination,
  MetricStat,
  SectionHeading,
  CategoryHeading,
  ViewHeading,
  FilterPills,
  Tabs,
  FormField,
  Suggestion,
  ScopeOption,
  ProgressList,
  ColumnChart,
  DataTable,
  SidebarItem,
  FilterActions,
  FileDropzone,
  Toast,
  searchIconPositions,
  searchVariants,
  metricStatVariants,
  metricStatAccents,
  tabsVariants,
  headingLevels,
  formFieldControls,
} from "./molecules.jsx";
export {
  Header,
  Hero,
  WorkspaceCard,
  WorkspaceGrid,
  ProjectCard,
  ProjectCatalog,
  ActionCard,
  KnowledgeSidebar,
  TypeCard,
  TypeGrid,
  LibraryToolbar,
  AssetRow,
  KnowledgeLibrary,
  PrinciplesView,
  AssistantLauncher,
  AssistantPanel,
  CampaignRail,
  ProjectDirectory,
  ReportRow,
  ReportCopilot,
  ReportDetailsDrawer,
  LiveReportView,
  LiveOverview,
  CityInvestDashboard,
  Panel,
  SummaryStrip,
  TaskList,
  BusinessTermForm,
  Modal,
  ModelFlowDialog,
  UploadHistory,
  assistantPlacements,
  modelFlowSteps,
  headerTones,
  headerPositions,
  heroVariants,
  heroScrims,
  modalVariants,
} from "./organisms.jsx";
export { HomePage, MarketingCockpitPage, SelfServicePage, AiInterpreterPage, CampaignPage, DataUploadPage, MediaTrackingDetailPage, cockpitViews } from "./pages.jsx";
export { Icon, iconNames } from "./icons.jsx";
export { assetUrl } from "./asset-url.js";
export { cx, normalizeOptions, recordFieldValues, uniqueFilterOptions, recordMatchesFilter } from "./cx.js";
export * as demoContent from "./content.js";
/* Pure report/knowledge logic — all inputs explicit. */
export {
  pluralize,
  resolveReportAssets,
  projectSearchText,
  reportSearchText,
  resolveReportContext,
  storeOptionsFor,
  storeScopeSuffix,
  totalLabel,
  selectionLabel,
  pickTicks,
  fmtAfter,
  isPilotCitySalesQuestion,
  buildReportModelDescription,
  buildReportModelLogic,
  buildReportModelDraft,
} from "./report-logic.js";
export {
  projectCatalogHref,
  liveReportHref,
  reportContextHref,
  copilotSourceHref,
  REPORT_CATALOG_HREF,
  KNOWLEDGE_HREF,
} from "./report-routes.js";
/* Deterministic demo state + simulators for hosts and tests. */
export { useCockpitDemo } from "./demo/cockpit-demo.js";
export {
  generateCityInvestScenario,
  cityInvestScenarioSource,
  copilotProfile,
  copilotSources,
  resolveCopilotAnswer,
  buildCopilotChatEntry,
  copilotSkillItems,
} from "./demo/report-demo.js";
