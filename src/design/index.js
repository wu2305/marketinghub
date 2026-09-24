/**
 * Public entry point for the Marketing Hub design system.
 * Import components and option constants from here — internal module layout
 * (atoms/molecules/organisms/pages) is not part of the public API.
 *
 * `demoContent` holds the static copy and sample records used by the stories;
 * hosts should pass their own data via props.
 */
export {
  Button,
  buttonVariants,
  controlSizes,
  buttonTypes,
} from "./components/Button/index.jsx";
export {
  TextInput,
} from "./components/TextInput/index.jsx";
export {
  TextArea,
} from "./components/TextArea/index.jsx";
export {
  Select,
} from "./components/Select/index.jsx";
export {
  StatusBadge,
} from "./components/StatusBadge/index.jsx";
export {
  SearchField,
  searchIconPositions,
  searchVariants,
} from "./components/SearchField/index.jsx";
export {
  CheckboxFilter,
} from "./components/CheckboxFilter/index.jsx";
export {
  Pagination,
  paginationVariants,
} from "./components/Pagination/index.jsx";
export {
  MetricStat,
  metricStatVariants,
  metricStatAccents,
} from "./components/MetricStat/index.jsx";
export {
  SectionHeading,
  headingLevels,
} from "./components/SectionHeading/index.jsx";
export {
  ViewHeading,
} from "./components/ViewHeading/index.jsx";
export {
  FilterPills,
} from "./components/FilterPills/index.jsx";
export {
  Tabs,
  tabsVariants,
} from "./components/Tabs/index.jsx";
export {
  FormField,
  formFieldControls,
} from "./components/FormField/index.jsx";
export {
  ProgressList,
} from "./components/ProgressList/index.jsx";
export {
  ColumnChart,
} from "./components/ColumnChart/index.jsx";
export {
  DataTable,
} from "./components/DataTable/index.jsx";
export {
  FileDropzone,
} from "./components/FileDropzone/index.jsx";
export {
  Toast,
} from "./components/Toast/index.jsx";
export {
  Header,
  headerTones,
  headerPositions,
} from "./components/Header/index.jsx";
export {
  Hero,
  heroVariants,
  heroScrims,
} from "./components/Hero/index.jsx";
export {
  WorkspaceCard,
} from "./features/home/WorkspaceCard/index.jsx";
export {
  WorkspaceGrid,
} from "./features/home/WorkspaceGrid/index.jsx";
export {
  ProjectCard,
} from "./features/cockpit/ProjectCard/index.jsx";
export {
  ProjectCatalog,
} from "./features/cockpit/ProjectCatalog/index.jsx";
export {
  ActionCard,
} from "./features/self-service/ActionCard/index.jsx";
export {
  KnowledgeSidebar,
} from "./features/interpreter/KnowledgeSidebar/index.jsx";
export {
  TypeCard,
} from "./features/interpreter/TypeCard/index.jsx";
export {
  TypeGrid,
} from "./features/interpreter/TypeGrid/index.jsx";
export {
  LibraryToolbar,
} from "./features/interpreter/LibraryToolbar/index.jsx";
export {
  AssetRow,
} from "./features/interpreter/AssetRow/index.jsx";
export {
  KnowledgeLibrary,
} from "./features/interpreter/KnowledgeLibrary/index.jsx";
export {
  PrinciplesView,
} from "./features/interpreter/PrinciplesView/index.jsx";
export {
  AssistantLauncher,
} from "./components/AssistantLauncher/index.jsx";
export {
  AssistantPanel,
  assistantPlacements,
} from "./components/AssistantPanel/index.jsx";
export {
  CampaignRail,
} from "./features/campaign/CampaignRail/index.jsx";
export {
  ProjectDirectory,
} from "./features/cockpit/ProjectDirectory/index.jsx";
export {
  ReportRow,
} from "./features/cockpit/ReportRow/index.jsx";
export {
  ReportCopilot,
} from "./features/cockpit/ReportCopilot/index.jsx";
export {
  ReportDetailsDrawer,
} from "./features/cockpit/ReportDetailsDrawer/index.jsx";
export {
  LiveReportView,
} from "./features/cockpit/LiveReportView/index.jsx";
export {
  LiveOverview,
} from "./features/cockpit/LiveOverview/index.jsx";
export {
  CityInvestDashboard,
} from "./features/cockpit/CityInvestDashboard/index.jsx";
export {
  Panel,
} from "./features/campaign/Panel/index.jsx";
export {
  SummaryStrip,
} from "./features/campaign/SummaryStrip/index.jsx";
export {
  TaskList,
} from "./features/campaign/TaskList/index.jsx";
export {
  BusinessTermForm,
} from "./features/interpreter/BusinessTermForm/index.jsx";
export {
  Modal,
  modalVariants,
} from "./components/Modal/index.jsx";
export {
  ModelFlowDialog,
  modelFlowSteps,
} from "./components/ModelFlowDialog/index.jsx";
export {
  UploadHistory,
} from "./features/self-service/UploadHistory/index.jsx";
export {
  BusinessTermView,
} from "./features/interpreter/BusinessTermView/index.jsx";
export {
  ConfirmDialog,
  confirmDialogTones,
} from "./components/ConfirmDialog/index.jsx";
export {
  HomePage,
} from "./pages/HomePage/index.jsx";
export {
  MarketingCockpitPage,
  cockpitViews,
} from "./pages/MarketingCockpitPage/index.jsx";
export {
  SelfServicePage,
} from "./pages/SelfServicePage/index.jsx";
export {
  AiInterpreterPage,
} from "./pages/AiInterpreterPage/index.jsx";
export {
  CampaignPage,
} from "./pages/CampaignPage/index.jsx";
export {
  DataUploadPage,
} from "./pages/DataUploadPage/index.jsx";
export {
  MediaTrackingDetailPage,
} from "./pages/MediaTrackingDetailPage/index.jsx";
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
export { useHomeDemo } from "./demo/home-demo.js";
export { useBusinessTermDemo } from "./demo/business-term-demo.js";
export {
  generateCityInvestScenario,
  cityInvestScenarioSource,
  copilotProfile,
  copilotSources,
  resolveCopilotAnswer,
  buildCopilotChatEntry,
  copilotSkillItems,
} from "./demo/report-demo.js";
