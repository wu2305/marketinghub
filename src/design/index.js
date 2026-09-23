/**
 * Public entry point for the Marketing Hub design system.
 * Import components and option constants from here — internal module layout
 * (atoms/molecules/organisms/pages) is not part of the public API.
 *
 * `demoContent` holds the static copy and sample records used by the stories;
 * hosts should pass their own data via props.
 */
export { Button, Link, TextInput, TextArea, Select, StatusBadge, buttonVariants, controlSizes } from "./atoms.jsx";
export {
  SearchField,
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
  metricStatVariants,
  metricStatAccents,
  tabsVariants,
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
  AssistantLauncher,
  AssistantPanel,
  CampaignRail,
  ProjectDirectory,
  ReportRow,
  ReportDetailsDrawer,
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
export { HomePage, MarketingCockpitPage, SelfServicePage, AiInterpreterPage, CampaignPage, DataUploadPage, MediaTrackingDetailPage } from "./pages.jsx";
export { Icon } from "./icons.jsx";
export { cx, normalizeOptions, recordFieldValues, uniqueFilterOptions, recordMatchesFilter } from "./cx.js";
export * as demoContent from "./content.js";
