import React from "react";
import "./pages.css";
import { Button, StatusBadge } from "./atoms.jsx";
import { ColumnChart, DataTable, FileDropzone, FilterPills, FormField, MetricStat, ProgressList, SearchField, SectionHeading, Tabs, Toast, ViewHeading } from "./molecules.jsx";
import {
  ActionCard,
  AssistantLauncher,
  AssistantPanel,
  CampaignRail,
  CityInvestDashboard,
  Header,
  Hero,
  KnowledgeLibrary,
  KnowledgeSidebar,
  LiveOverview,
  LiveReportView,
  Modal,
  ModelFlowDialog,
  Panel,
  PrinciplesView,
  ProjectCatalog,
  ProjectDirectory,
  ReportCopilot,
  ReportDetailsDrawer,
  ReportRow,
  SummaryStrip,
  TaskList,
  TypeGrid,
  UploadHistory,
  WorkspaceGrid,
} from "./organisms.jsx";
import { Icon } from "./icons.jsx";
import { cx, normalizeOptions, recordMatchesFilter, uniqueFilterOptions } from "./cx.js";
import {
  pluralize,
  projectSearchText,
  reportSearchText,
  resolveReportAssets,
  resolveReportContext,
} from "./report-logic.js";
import {
  REPORT_CATALOG_HREF,
  liveReportHref,
  projectCatalogHref,
  reportContextHref,
} from "./report-routes.js";

function Shell({ tone = "workspace", children }) {
  return <div className={`mh-page mh-page--${tone}`}>{children}</div>;
}

/**
 * Home page: header, hero with stats, workspace grid, assistant drawer.
 * @param {object} props
 * @param {string} [props.current="home"] active nav id
 * @param {{ src: string, alt?: string, href?: string }} props.logo
 * @param {Array<{ id: string, label: string, href: string }>} [props.navigation=[]]
 * @param {{ image?: string, eyebrow?: string, title: React.ReactNode, description?: React.ReactNode, stats?: Array<object> }} [props.hero]
 * @param {{ eyebrow?: string, title: React.ReactNode, description?: React.ReactNode }} props.heading section heading over the workspace grid
 * @param {Array<object>} [props.cards=[]] WorkspaceCard props
 * @param {object} [props.assistant={}] AssistantPanel props
 * @param {boolean} [props.assistantOpen=false]
 * @param {string} [props.prompt=""]
 * @param {string} [props.scope="All"]
 * @param {(target: { id: string, href?: string, label: string }) => void} [props.onNavigate]
 * @param {(target: { title: string }) => void} [props.onOpen] workspace card open
 * @param {() => void} [props.onOpenAssistant]
 * @param {() => void} [props.onCloseAssistant]
 * @param {(event: { name: string, value: string }) => void} [props.onPromptChange]
 * @param {(event: object) => void} [props.onSubmit]
 * @param {(event: { prompt: string }) => void} [props.onSuggestion]
 * @param {(event: { scope: string }) => void} [props.onScopeChange]
 * @param {() => void} [props.onNewSession]
 * @param {(event: { expanded: boolean }) => void} [props.onMaximize]
 * @param {(event: { open: boolean }) => void} [props.onHistory]
 * @param {(event: { label: string, prompt: string }) => void} [props.onHistorySelect]
 * @param {(event: { query: string, feedback: string|null }) => void} [props.onFeedback]
 * @param {object} [props.skillFlow] ModelFlowDialog props; `skillFlow.step` truthy renders the model-generation dialog
 */
export function HomePage({
  current = "home",
  logo,
  navigation = [],
  hero = { stats: [] },
  heading,
  cards = [],
  assistant = {},
  assistantOpen = false,
  skillFlow,
  prompt = "",
  scope = "All",
  onNavigate,
  onOpen,
  onOpenAssistant,
  onCloseAssistant,
  onPromptChange,
  onSubmit,
  onSuggestion,
  onScopeChange,
  onNewSession,
  onMaximize,
  onHistory,
  onHistorySelect,
  onFeedback,
}) {
  return (
    <Shell tone="home">
      <Header logo={logo} items={navigation} current={current} position="fixed" tone="overlay" onNavigate={onNavigate} />
      <Hero image={hero.image} title={hero.title} description={hero.description} height={300} variant="home" scrim="home">
        {hero.stats.map((stat) => (
          <MetricStat key={stat.label} {...stat} variant="glass" />
        ))}
      </Hero>
      <div className="mh-page__inset">
        <SectionHeading {...heading} />
        <WorkspaceGrid cards={cards} onOpen={onOpen} onNavigate={onNavigate} />
      </div>
      <AssistantLauncher hidden={assistantOpen} onOpen={onOpenAssistant} />
      <AssistantPanel
        open={assistantOpen}
        placement="drawer"
        tone="home"
        {...assistant}
        suggestions={assistant.homeSuggestions || assistant.suggestions}
        scope={scope}
        showScopes={false}
        showPicks={false}
        prompt={prompt}
        onClose={onCloseAssistant}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        onSuggestion={onSuggestion}
        onScopeChange={onScopeChange}
        onNewSession={onNewSession}
        onMaximize={onMaximize}
        onHistory={onHistory}
        onHistorySelect={onHistorySelect}
        onFeedback={onFeedback}
      />
      {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    </Shell>
  );
}

export const cockpitViews = ["catalog", "live"];

/**
 * Marketing Cockpit catalog: "all" mode lists category groups of project cards;
 * a `project` id switches to the project directory with report rows. Search
 * covers project fields plus linked knowledge titles, mirroring the original.
 * @param {object} props
 * @param {string} [props.current="cockpit"]
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {object} [props.hero={}] Hero props
 * @param {string} [props.query=""] catalog search text
 * @param {Array<{ id: string, label: string }>} [props.groups=[]] category groups
 * @param {Object<string, object>} [props.projects={}] project records keyed by id
 * @param {string} [props.project="all"] active catalog project id or "all"
 * @param {"catalog"|"live"} [props.view="catalog"] catalog or live dashboard view; advisory only — the original opens live whenever `dashboard` is present and rewrites `view=live` into the URL
 * @param {number|string|null} [props.dashboard=null] live report index (raw param value); present ⇒ live view
 * @param {{ project: string, index: number }|null} [props.details=null] open report details drawer target
 * @param {Array<{ label: string, pills: Array<{ label: string, href: string }> }>} [props.detailsSections=[]] static drawer asset sections
 * @param {Array<object>} [props.knowledge=[]] knowledge assets (id/title/type/category/projects/connections) used for report knowledge counts, search text and context links
 * @param {object} [props.cityInvest] CityInvestDashboard props (copy/periods/options/kpis/…/getScenario); required for reports with `embed: "city-invest"`
 * @param {(id: string) => string} [props.projectHref=projectCatalogHref]
 * @param {(id: string, index: number) => string} [props.liveHref=liveReportHref]
 * @param {(id: string, report: object) => string} [props.contextHref] defaults to the resolved report context's knowledge link
 * @param {string} [props.backHref=REPORT_CATALOG_HREF]
 * @param {(target: object) => void} [props.onNavigate]
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(target: { id: string, href: string }) => void} [props.onOpenProject]
 * @param {(target: { project: string, index: number, href: string }) => void} [props.onOpenReport]
 * @param {(target: { project: string, index: number }) => void} [props.onOpenDetails]
 * @param {(target: object) => void} [props.onCloseDetails]
 * @param {(target: { href?: string }) => void} [props.onOpenLive]
 * @param {(target: { project: string, href: string }) => void} [props.onBack] live view back-to-library
 * @param {object} [props.workspace={}] ReportCopilot props (report-scoped aiWorkspace)
 * @param {boolean} [props.workspaceOpen=false]
 * @param {(target: object) => void} [props.onOpenWorkspace] live view AI launcher (Report Copilot)
 * @param {object} [props.assistant={}] AssistantPanel props
 * @param {boolean} [props.assistantOpen=false]
 * @param {string} [props.prompt=""]
 * @param {object} [props.skillFlow] ModelFlowDialog props; `{ step }` required to render
 * @param {(target: object) => void} [props.onOpenAssistant]
 * @param {(target: object) => void} [props.onCloseAssistant]
 * @param {(event: { name: string, value: string }) => void} [props.onPromptChange]
 * @param {(event: { value: string }) => void} [props.onSubmit]
 */
export function MarketingCockpitPage({
  current = "cockpit",
  logo,
  navigation = [],
  hero = {},
  query = "",
  groups = [],
  projects = {},
  project = "all",
  view = "catalog",
  dashboard = null,
  details = null,
  detailsSections = [],
  knowledge = [],
  cityInvest,
  projectHref = projectCatalogHref,
  liveHref = liveReportHref,
  contextHref = (projectId, report) => reportContextHref(resolveReportContext(knowledge, projectId, report)),
  backHref = REPORT_CATALOG_HREF,
  onNavigate,
  onQueryChange,
  onOpenProject,
  onOpenReport,
  onOpenDetails,
  onCloseDetails,
  onOpenLive,
  onBack,
  workspace = {},
  workspaceOpen = false,
  onOpenWorkspace,
  assistant = {},
  assistantOpen = false,
  prompt = "",
  skillFlow,
  onOpenAssistant,
  onCloseAssistant,
  onPromptChange,
  onSubmit,
}) {
  const search = query.trim().toLowerCase();
  const active = project !== "all" && projects[project] ? projects[project] : null;
  const projectKeys = Object.keys(projects);
  const liveKey = projects[project] ? project : projectKeys[0];
  const liveProject = projects[liveKey];
  /* Original report-core.js: `dashboard` param present ⇒ live view regardless
     of `view` (the param even rewrites `view=live` into the URL), so the gate
     is `dashboard != null` alone. Two indices matter: content resolves via
     `reports[i] ? i : 0` (out-of-range → report 0) while the six-city embed
     gate reads the raw finite index — `?project=city&dashboard=2` shows
     report 0's generic overview, not the embed. */
  const liveIndexNum = Number(dashboard);
  const rawIndex = Number.isFinite(liveIndexNum) ? liveIndexNum : 0;
  const liveIndex = liveProject && liveProject.reports[liveIndexNum] ? liveIndexNum : 0;
  const liveReport = liveProject ? liveProject.reports[liveIndex] : null;
  const isLive = dashboard !== null && dashboard !== undefined && Boolean(liveProject && liveReport);
  let detailsTarget = null;
  if (details && projects[details.project]) {
    const detailProject = projects[details.project];
    const detailReport = detailProject.reports[details.index];
    if (detailReport) detailsTarget = { project: detailProject, report: detailReport };
  }
  return (
    <Shell tone="cockpit">
      <Header logo={logo} items={navigation} current={current} position="fixed" onNavigate={onNavigate} />
      <div className="mh-page__offset" aria-hidden="true" />
      <Hero {...hero} height={260} variant="banner" scrim="banner" />
      <main className="mh-page__shell">
        {isLive ? (
          <LiveReportView
            kicker={`${liveProject.title.toUpperCase()} / LIVE REPORT`}
            title={liveReport.title}
            backHref={projectHref(liveKey)}
            onBack={(target) => {
              onBack?.({ project: liveKey, href: target.href });
              onNavigate?.({ id: "cockpit-project", href: target.href, label: liveProject.title });
            }}
          >
            {liveProject.reports[rawIndex]?.embed === "city-invest" && cityInvest ? (
              <CityInvestDashboard {...cityInvest} />
            ) : (
              <LiveOverview metrics={liveReport.metrics || []} chart={liveReport.chart || []} accent={liveProject.accent} />
            )}
          </LiveReportView>
        ) : (
          <React.Fragment>
        <header className="mh-page__search">
          <SearchField label="Search dashboards" value={query} placeholder="Search dashboards" size="lg" icon="end" onChange={onQueryChange} />
        </header>
        {active ? (
          <React.Fragment>
            <ProjectDirectory
              backHref={backHref}
              image={active.image}
              imageAlt={`${active.title} report preview`}
              kicker={active.kicker}
              title={active.title}
              description={active.description}
              countText={pluralize(active.reports.length, "dashboard")}
              updated={active.sourceStrip[0] || "Update schedule available in project"}
              listCountText={pluralize(active.reports.filter((report) => !search || reportSearchText(knowledge, project, active, report).includes(search)).length, "dashboard")}
              onBack={(target) => onNavigate?.({ id: "cockpit-all", href: target.href, label: "All report projects" })}
            >
              {active.reports
                .map((report, index) => ({ report, index }))
                .filter((item) => !search || reportSearchText(knowledge, project, active, item.report).includes(search))
                .map((item) => (
                  <ReportRow
                    key={item.report.title}
                    index={item.index}
                    path={`${active.category} / ${active.title} / ${item.report.type}`}
                    title={item.report.title}
                    description={item.report.description}
                    meta={[
                      { label: "Owner", value: item.report.owner },
                      { label: "Cadence", value: item.report.cadence },
                      { label: "Updated", value: item.report.updated },
                      { label: "Knowledge", value: pluralize(resolveReportAssets(knowledge, project, item.report).length, "asset") },
                    ]}
                    href={liveHref(project, item.index)}
                    detailsHref={contextHref(project, item.report)}
                    onOpen={() => onOpenReport?.({ project, index: item.index, href: liveHref(project, item.index) })}
                    onDetails={() => onOpenDetails?.({ project, index: item.index, href: contextHref(project, item.report) })}
                  />
                ))}
            </ProjectDirectory>
            {active.reports.filter((report) => !search || reportSearchText(knowledge, project, active, report).includes(search)).length === 0 ? (
              <div className="mh-empty-state">
                <strong>No matching reports.</strong>
                <span>Try another report or project name.</span>
              </div>
            ) : null}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <ProjectCatalog
              groups={groups
                .filter((group) => group.id !== "all")
                .map((group) => ({
                  id: group.id,
                  title: group.label || group.title,
                  projects: Object.keys(projects)
                    .filter((key) => projects[key].group === group.id)
                    .filter((key) => !search || projectSearchText(knowledge, key, projects[key]).includes(search))
                    .map((key) => ({
                      id: key,
                      title: projects[key].title,
                      kicker: projects[key].kicker,
                      description: projects[key].description,
                      image: projects[key].image,
                      updated: projects[key].sourceStrip[0] || "Update schedule available in project",
                      href: projectHref(key),
                    })),
                }))
                .filter((group) => group.projects.length)}
              onOpen={(target) => onOpenProject?.({ id: target.id, href: projectHref(target.id) })}
            />
            {groups
              .filter((group) => group.id !== "all")
              .every((group) => !Object.keys(projects).some((key) => projects[key].group === group.id && (!search || projectSearchText(knowledge, key, projects[key]).includes(search)))) ? (
              <div className="mh-empty-state">
                <strong>No matching reports.</strong>
                <span>Try another report or project name.</span>
              </div>
            ) : null}
          </React.Fragment>
        )}
          </React.Fragment>
        )}
      </main>
      <ReportDetailsDrawer
        open={Boolean(detailsTarget)}
        projectLabel={detailsTarget ? detailsTarget.project.title : undefined}
        image={detailsTarget ? detailsTarget.project.image : undefined}
        imageAlt={detailsTarget ? `${detailsTarget.project.title} report preview` : undefined}
        hierarchy={detailsTarget ? `${detailsTarget.project.category} / ${detailsTarget.project.title} / ${detailsTarget.report.type}` : undefined}
        title={detailsTarget ? detailsTarget.report.title : ""}
        explanation={detailsTarget ? detailsTarget.report.description : undefined}
        meta={
          detailsTarget
            ? [
                { label: "Owner", value: detailsTarget.report.owner },
                { label: "Cadence", value: detailsTarget.report.cadence },
                { label: "Updated", value: detailsTarget.report.updated },
              ]
            : []
        }
        sections={detailsSections}
        scenarios={detailsTarget ? (detailsTarget.report.recommendations || []).map((item) => ({ title: item.title, meta: item.meta })) : []}
        liveHref={details ? liveHref(details.project, details.index) : undefined}
        resetKey={details ? `${details.project}:${details.index}` : undefined}
        onClose={onCloseDetails}
        onOpenLive={onOpenLive}
      />
      {/* body:has(#aiWorkspace.open) hides the launcher in the original too */}
      <AssistantLauncher hidden={assistantOpen || workspaceOpen} onOpen={isLive ? onOpenWorkspace : onOpenAssistant} />
      <ReportCopilot open={workspaceOpen} {...workspace} />
      <AssistantPanel
        open={assistantOpen}
        placement="drawer"
        {...assistant}
        prompt={prompt}
        onClose={onCloseAssistant}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
      />
      {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    </Shell>
  );
}

/**
 * Self-Service Center: analysis/upload tabs, category pills, entry cards.
 * @param {object} props
 * @param {string} [props.current="self-service"]
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {object} [props.hero={}] Hero props
 * @param {Array<{ id: string, label: string }>} [props.tabs=[]]
 * @param {{ analysis?: Array<object>, upload?: Array<object> }} [props.filters={}] pills per tab id
 * @param {Array<object>} [props.reports=[]] ActionCard props for the analysis tab
 * @param {Array<object>} [props.uploads=[]] ActionCard props for the upload tab; items may carry `history` rows for the upload-history dialog
 * @param {{ open?: boolean, title?: string, rows?: Array<object>, emptyMessage?: string }} [props.uploadHistory={}] upload-history dialog state
 * @param {"analysis"|"upload"} [props.tab="analysis"]
 * @param {string} [props.category="all"]
 * @param {(target: object) => void} [props.onNavigate]
 * @param {(event: { id: string, label: string }) => void} [props.onTabChange]
 * @param {(event: { id: string, label: string }) => void} [props.onCategoryChange]
 * @param {(target: { title: string, href?: string }) => void} [props.onOpen]
 * @param {(target: { item: object }) => void} [props.onOpenHistory]
 * @param {() => void} [props.onCloseHistory]
 * @param {(row: object) => void} [props.onPreviewFile]
 * @param {(row: object) => void} [props.onDownloadFile]
 */
export function SelfServicePage({
  current = "self-service",
  logo,
  navigation = [],
  hero = {},
  tabs = [],
  filters = {},
  reports = [],
  uploads = [],
  uploadHistory = {},
  tab = "analysis",
  category = "all",
  onNavigate,
  onTabChange,
  onCategoryChange,
  onOpen,
  onOpenHistory,
  onCloseHistory,
  onPreviewFile,
  onDownloadFile,
}) {
  const source = tab === "upload" ? uploads : reports;
  const items = source.filter((item) => category === "all" || item.category === category);
  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} position="fixed" onNavigate={onNavigate} />
      <div className="mh-page__offset" aria-hidden="true" />
      <Hero {...hero} height={260} variant="banner" scrim="none" />
      <main className="mh-page__shell mh-page__shell--self">
        <div className="mh-self-tools">
          <Tabs label="Data view mode" items={tabs} value={tab} onChange={onTabChange} />
          <FilterPills label={tab === "upload" ? "Filter uploads" : "Filter reports"} items={filters[tab] || []} value={category} onChange={onCategoryChange} />
        </div>
        <div className={tab === "upload" ? "mh-page__cards mh-page__cards--upload" : "mh-page__cards mh-page__cards--two"}>
          {items.map((item) => (
            <ActionCard
              key={item.title}
              {...item}
              onOpen={onOpen}
              onShowHistory={item.history ? () => onOpenHistory?.({ item }) : undefined}
            />
          ))}
        </div>
      </main>
      <AssistantLauncher onOpen={() => onNavigate?.({ id: "assistant", label: "AI Interpreter" })} />
      <UploadHistory
        open={uploadHistory.open}
        title={uploadHistory.title}
        rows={uploadHistory.rows || []}
        emptyMessage={uploadHistory.emptyMessage}
        onClose={onCloseHistory}
        onPreview={onPreviewFile}
        onDownload={onDownloadFile}
      />
    </Shell>
  );
}



/**
 * AI Interpreter knowledge workspace: sidebar type navigation, type overview
 * grid, and the generic per-type library list (transition implementation —
 * original per-type views are card/table grids, see handover §2.3 P07).
 * @param {object} props
 * @param {string} [props.current="interpreter"]
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {object} [props.hero={}] Hero props; `stats` is an array of MetricStat props
 * @param {{ id: string, label: string, icon?: string }} [props.overviewItem]
 * @param {string} [props.sidebarTitle]
 * @param {Array<object>} [props.types=[]] knowledge type entries (id, title, icon, summary, action, manageable, createLabel, stats, statusFilters)
 * @param {Array<object>} [props.records=[]] sampled records; each row links to a type via `typeId`
 * @param {object} [props.principles={}] PrinciplesView props for `?type=Principles` (items, selectedCategories, page, pageSize, expanded, strings, callbacks)
 * @param {string} [props.activeType="overview"] "overview", a type id, or an unknown id (renders an explicit empty state)
 * @param {string} [props.query=""]
 * @param {Object<string, string>} [props.filterValues={}]
 * @param {(target: object) => void} [props.onNavigate]
 * @param {(event: { id: string, label: string }) => void} [props.onSelectType]
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(event: { id: string, value: string }) => void} [props.onFilterChange]
 * @param {(event: { typeId: string, title: string }) => void} [props.onCreate]
 * @param {(row: object) => void} [props.onSelectAsset]
 */
export function AiInterpreterPage({
  current = "interpreter",
  logo,
  navigation = [],
  hero = { stats: [] },
  overviewItem = { id: "overview", label: "Overview" },
  sidebarTitle,
  types = [],
  records = [],
  principles = {},
  activeType = "overview",
  query = "",
  filterValues = {},
  onNavigate,
  onSelectType,
  onQueryChange,
  onFilterChange,
  onCreate,
  onSelectAsset,
}) {
  const overview = activeType === "overview" || !activeType;
  const type = types.find((item) => item.id === activeType);
  const known = overview || Boolean(type);
  const searchRef = React.useRef(null);

  // types.js: "/" and Cmd/Ctrl+K focus the visible search field on type pages.
  React.useEffect(() => {
    if (overview || !known) return undefined;
    const onKeydown = (event) => {
      const active = document.activeElement;
      const editing =
        active &&
        (active.matches("input, textarea, select") || active.getAttribute("contenteditable") === "true");
      const isSearchShortcut =
        event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k");
      if (isSearchShortcut && !editing && searchRef.current) {
        event.preventDefault();
        searchRef.current.focus();
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [overview, known]);

  const typeRecords = type ? records.filter((record) => record.typeId === type.id) : [];
  const filters = (type?.statusFilters || []).map((filter) => ({
    ...filter,
    options: filter.options || uniqueFilterOptions(typeRecords, filter.id),
  }));
  const rows = typeRecords.filter((record) => {
    const queryMatch = !query || `${record.title} ${record.summary}`.toLowerCase().includes(query.toLowerCase());
    const filterMatch = filters.every((filter) => !filterValues[filter.id] || recordMatchesFilter(record, filter, filterValues[filter.id]));
    return queryMatch && filterMatch;
  });

  // renderHeroStats: labels stay static; values/captions follow the active type,
  // singularizing the unit when its own value is 1 ("1 model governed…").
  const unit = type?.stats?.units?.[1] || "knowledge assets";
  const captionUnit = (value) => (value === 1 && unit.endsWith("s") ? unit.slice(0, -1) : unit);
  const heroStats = type
    ? [
        { label: "Published Knowledge", value: type.stats.total.toLocaleString(), caption: `${captionUnit(type.stats.total)} governed for AI use` },
        { label: "New This Month", value: type.stats.monthly.toLocaleString(), caption: `${captionUnit(type.stats.monthly)} added recently` },
      ]
    : hero.stats || [];
  const heroProps = type ? { ...hero, title: type.title, description: type.summary } : hero;

  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} position="fixed" onNavigate={onNavigate} />
      <div className="mh-page__offset" aria-hidden="true" />
      <Hero {...heroProps} height={260} variant="knowledge" scrim="knowledge" asideLabel={`${type ? type.title : "All types"} knowledge statistics`}>
        {heroStats.map((stat) => (
          <MetricStat key={stat.label} {...stat} variant="glass" compact />
        ))}
      </Hero>
      <div className="mh-interpreter">
        <KnowledgeSidebar
          overview={overviewItem}
          title={sidebarTitle}
          types={types}
          activeId={activeType}
          onSelect={onSelectType}
        />
        <div
          className={cx("mh-interpreter__main", !overview && known && "mh-interpreter__main--type")}
          data-active-type={type ? activeType : "Overview"}
        >
          {overview ? (
            <TypeGrid items={types} activeId={activeType} onSelect={onSelectType} />
          ) : !known ? (
            <div className="mh-empty mh-empty--unknown" role="status">
              <strong>Unknown knowledge type</strong>
              <p>{`"${activeType}" is not one of the ${types.length} knowledge types. Pick a type from the navigation.`}</p>
            </div>
          ) : type.view === "principles" ? (
            <PrinciplesView
              query={query}
              onQueryChange={onQueryChange}
              searchRef={searchRef}
              {...principles}
            />
          ) : (
            <KnowledgeLibrary
              type={{ ...type, statusFilters: filters }}
              query={query}
              filterValues={filterValues}
              rows={rows}
              onQueryChange={onQueryChange}
              onFilterChange={onFilterChange}
              onCreate={onCreate}
              onSelect={onSelectAsset}
            />
          )}
        </div>
      </div>
      <AssistantLauncher onOpen={() => onNavigate?.({ id: "assistant", label: "AI Interpreter" })} />
    </Shell>
  );
}

/**
 * RedNote Campaign Tool: rail-navigated sections (overview, execution, assets,
 * analytics, accounts) plus the assistant drawer. All section data arrives via
 * props; the original switches sections via location.hash.
 * @param {object} props
 * @param {string} [props.current="campaign"]
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {object} [props.assistant={}] AssistantPanel props
 * @param {object} [props.rail={ items: [] }] CampaignRail props
 * @param {Array<{ id: string, label: string }>} [props.channels=[]] overview channel tabs
 * @param {Array<object>} [props.metrics=[]] overview MetricStat props
 * @param {Array<object>} [props.distribution=[]] ProgressList items
 * @param {Array<object>} [props.objectives=[]] ProgressList items
 * @param {Array<object>} [props.accountColumns=[]] DataTable columns
 * @param {Array<object>} [props.accountRows=[]] DataTable rows
 * @param {Object<string, { eyebrow?: string, title?: string, description?: string }>} [props.headings={}] per-section headings
 * @param {Object<string, object>} [props.panels={}] per-section panel copy
 * @param {Array<object>} [props.executionSummary=[]] SummaryStrip items
 * @param {Array<object>} [props.taskQueue=[]] TaskList items
 * @param {{ columns: Array<object>, rows: Array<object> }} [props.actionLog]
 * @param {Array<object>} [props.creativeColumns=[]]
 * @param {Array<object>} [props.creatives=[]]
 * @param {Array<object>} [props.efficiency=[]] ProgressList items
 * @param {Array<object>} [props.recommendations=[]] recommendation card contents
 * @param {Array<object>} [props.bindingColumns=[]]
 * @param {Array<object>} [props.accounts=[]]
 * @param {object} [props.taskDialog={}] Create Campaign Task dialog copy: eyebrow, title, description, fields {actions, platforms, accounts}, object {label, value}, preview {eyebrow, state, note}, cancelLabel, submitLabel
 * @param {boolean} [props.taskDialogOpen=false]
 * @param {{ open?: boolean, message?: string }} [props.toast={}] action toast state
 * @param {object} [props.skillFlow] ModelFlowDialog props; `skillFlow.step` truthy renders the model-generation dialog
 * @param {"overview"|"execution"|"assets"|"analytics"|"accounts"} [props.section="overview"]
 * @param {"rednote"|"douyin"} [props.channel="rednote"]
 * @param {string} [props.query=""] account search text
 * @param {(target: object) => void} [props.onNavigate]
 * @param {(event: { id: string, label: string }) => void} [props.onSectionChange]
 * @param {(event: { id: string, label: string }) => void} [props.onChannelChange]
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {() => void} [props.onFilter]
 * @param {() => void} [props.onReset]
 * @param {() => void} [props.onCreateTask]
 * @param {() => void} [props.onBindAccount]
 * @param {() => void} [props.onCloseTask]
 * @param {(event: { action: string, platform: string, account: string, object: string }) => void} [props.onSubmitTask]
 * @param {boolean} [props.assistantOpen=false]
 * @param {string} [props.prompt=""]
 * @param {() => void} [props.onOpenAssistant]
 * @param {() => void} [props.onCloseAssistant]
 * @param {(event: { name: string, value: string }) => void} [props.onPromptChange]
 * @param {(event: object) => void} [props.onSubmit]
 * @param {(event: { prompt: string }) => void} [props.onSuggestion]
 */
export function CampaignPage({
  current = "campaign",
  logo,
  navigation = [],
  assistant = {},
  rail = { items: [] },
  channels = [],
  metrics = [],
  distribution = [],
  objectives = [],
  accountColumns = [],
  accountRows = [],
  headings = {},
  panels = {},
  executionSummary = [],
  taskQueue = [],
  actionLog = { columns: [], rows: [] },
  creativeColumns = [],
  creatives = [],
  efficiency = [],
  recommendations = [],
  bindingColumns = [],
  accounts = [],
  taskDialog = {},
  taskDialogOpen = false,
  toast = {},
  skillFlow,
  section = "overview",
  channel = "rednote",
  query = "",
  onNavigate,
  onSectionChange,
  onChannelChange,
  onQueryChange,
  onFilter,
  onReset,
  onCreateTask,
  onBindAccount,
  onCloseTask,
  onSubmitTask,
  assistantOpen = false,
  prompt = "",
  onOpenAssistant,
  onCloseAssistant,
  onPromptChange,
  onSubmit,
  onSuggestion,
}) {
  const visibleAccounts = accountRows.filter((row) => !query || row.name.toLowerCase().includes(query.toLowerCase()));
  const executionHeading = headings.execution || {};
  const assetsHeading = headings.assets || {};
  const analyticsHeading = headings.analytics || {};
  const accountsHeading = headings.accounts || {};
  const overviewHeading = headings.overview || {};
  const queuePanel = panels.queue || {};
  const logPanel = panels.log || {};
  const creativePanel = panels.creatives || {};
  const efficiencyPanel = panels.efficiency || {};
  const recommendationPanel = panels.recommendations || {};
  const bindingPanel = panels.accounts || {};
  const distributionPanel = panels.distribution || {};
  const objectivePanel = panels.objectives || {};
  const operationsPanel = panels.accountOperations || {};
  const actionRows = (actionLog.rows || []).map((row) => ({
    ...row,
    status: <StatusBadge status={row.status}>{row.statusLabel || row.status}</StatusBadge>,
  }));
  const creativeRows = creatives.map((row) => ({
    ...row,
    group: (
      <span>
        <strong>{row.group}</strong>
        {row.subtitle ? <small>{row.subtitle}</small> : null}
      </span>
    ),
    ready: <span className="mh-count mh-count--good">{row.ready}</span>,
    replace: <span className="mh-count mh-count--alert">{row.replace}</span>,
  }));
  const bindingRows = accounts.map((row) => ({
    ...row,
    auth: <StatusBadge status={row.authStatus}>{row.authLabel}</StatusBadge>,
    permission: row.permissionStatus ? <StatusBadge status={row.permissionStatus}>{row.permission}</StatusBadge> : row.permission,
  }));
  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} position="fixed" onNavigate={onNavigate} />
      <div className="mh-campaign">
        <CampaignRail {...rail} current={section} onSelect={onSectionChange} />
        <main>
          {section === "overview" ? (
            <>
              <ViewHeading eyebrow={overviewHeading.eyebrow} title={overviewHeading.title} description={overviewHeading.description}>
                <Tabs label="Channel view" variant="segmented" items={channels} value={channel} onChange={onChannelChange} />
              </ViewHeading>
              <div className="mh-campaign__metrics">
                {metrics.map((metric) => (
                  <MetricStat key={metric.label} {...metric} variant="card" />
                ))}
              </div>
              <div className="mh-campaign__split">
                <Panel eyebrow={distributionPanel.eyebrow} title={distributionPanel.title} meta={distributionPanel.meta}>
                  <ProgressList items={distribution} />
                </Panel>
                <Panel eyebrow={objectivePanel.eyebrow} title={objectivePanel.title} meta={objectivePanel.meta}>
                  <ColumnChart label="Marketing objective distribution chart" items={objectives} />
                </Panel>
              </div>
              <div className="mh-campaign__table">
                <Panel
                  eyebrow={operationsPanel.eyebrow}
                  title={operationsPanel.title}
                  actions={
                    <form
                      className="mh-campaign__tools"
                      onSubmit={(event) => {
                        event.preventDefault();
                        onFilter?.({ query });
                      }}
                    >
                      <SearchField label="Search sub-account" value={query} placeholder="Search sub-account" size="sm" icon="none" onChange={onQueryChange} />
                      <Button variant="primary" size="sm" type="submit">
                        Filter
                      </Button>
                      <Button variant="secondary" size="sm" onClick={onReset}>
                        Reset
                      </Button>
                    </form>
                  }
                >
                  <DataTable columns={accountColumns} rows={visibleAccounts} caption={`${visibleAccounts.length} ${visibleAccounts.length === 1 ? "account" : "accounts"} shown`} />
                </Panel>
              </div>
            </>
          ) : null}
          {section === "execution" ? (
            <div className="mh-stack">
              <ViewHeading eyebrow={executionHeading.eyebrow} title={executionHeading.title} description={executionHeading.description}>
                <Button variant="primary" onClick={onCreateTask}>
                  {executionHeading.action}
                </Button>
              </ViewHeading>
              <SummaryStrip items={executionSummary} />
              <div className="mh-campaign__split">
                <Panel eyebrow={queuePanel.eyebrow} title={queuePanel.title} meta={queuePanel.meta}>
                  <TaskList items={taskQueue} />
                </Panel>
                <Panel eyebrow={logPanel.eyebrow} title={logPanel.title} meta={logPanel.meta}>
                  <DataTable columns={actionLog.columns} rows={actionRows} />
                </Panel>
              </div>
            </div>
          ) : null}
          {section === "assets" ? (
            <div className="mh-stack">
              <ViewHeading eyebrow={assetsHeading.eyebrow} title={assetsHeading.title} description={assetsHeading.description}>
                <span className="mh-health">{assetsHeading.badge}</span>
              </ViewHeading>
              <Panel eyebrow={creativePanel.eyebrow} title={creativePanel.title} meta={creativePanel.meta}>
                <DataTable columns={creativeColumns} rows={creativeRows} />
              </Panel>
            </div>
          ) : null}
          {section === "analytics" ? (
            <div className="mh-stack">
              <ViewHeading eyebrow={analyticsHeading.eyebrow} title={analyticsHeading.title} description={analyticsHeading.description}>
                <span className="mh-health">
                  <i /> {analyticsHeading.status}
                </span>
              </ViewHeading>
              <div className="mh-campaign__split">
                <Panel eyebrow={efficiencyPanel.eyebrow} title={efficiencyPanel.title} meta={efficiencyPanel.meta}>
                  <div className="mh-efficiency">
                    {efficiency.map((item) => (
                      <div key={item.label}>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel eyebrow={recommendationPanel.eyebrow} title={recommendationPanel.title} meta={recommendationPanel.meta}>
                  <div className="mh-recommendations">
                    {recommendations.map((item) => (
                      <article key={item.index}>
                        <span>{item.index}</span>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.detail}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </Panel>
              </div>
            </div>
          ) : null}
          {section === "accounts" ? (
            <div className="mh-stack">
              <ViewHeading eyebrow={accountsHeading.eyebrow} title={accountsHeading.title} description={accountsHeading.description}>
                <Button variant="primary" onClick={onBindAccount}>
                  {accountsHeading.action}
                </Button>
              </ViewHeading>
              <Panel eyebrow={bindingPanel.eyebrow} title={bindingPanel.title} meta={bindingPanel.meta}>
                <DataTable columns={bindingColumns} rows={bindingRows} />
              </Panel>
            </div>
          ) : null}
        </main>
      </div>
      <AssistantLauncher hidden={assistantOpen} onOpen={onOpenAssistant} />
      <AssistantPanel
        open={assistantOpen}
        placement="drawer"
        enterToSubmit={false}
        showPicks={false}
        {...assistant}
        prompt={prompt}
        onClose={onCloseAssistant}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        onSuggestion={onSuggestion}
      />
      {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
      <Modal
        open={taskDialogOpen}
        eyebrow={taskDialog.eyebrow}
        title={taskDialog.title}
        className="mh-task-dialog"
        onClose={onCloseTask}
      >
        <form
          className="mh-task-dialog__form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            onSubmitTask?.({
              action: data.get("action") || "",
              platform: data.get("platform") || "",
              account: data.get("account") || "",
              object: data.get("object") || "",
            });
          }}
        >
          <p className="mh-task-dialog__intro">{taskDialog.description}</p>
          <div className="mh-task-dialog__grid">
            <FormField label={taskDialog.fields?.actionLabel || "Action"} name="action" control="select" options={taskDialog.fields?.actions || []} defaultValue={taskDialog.fields?.actions?.[0]} />
            <FormField label={taskDialog.fields?.platformLabel || "Platform"} name="platform" control="select" options={taskDialog.fields?.platforms || []} defaultValue={taskDialog.fields?.platforms?.[0]} />
            <FormField label={taskDialog.fields?.accountLabel || "Account"} name="account" control="select" options={taskDialog.fields?.accounts || []} defaultValue={taskDialog.fields?.accounts?.[0]} />
            <FormField label={taskDialog.object?.label || "Object"} name="object" defaultValue={taskDialog.object?.value || ""} />
          </div>
          <div className="mh-task-dialog__preview">
            <span>{taskDialog.preview?.eyebrow}</span>
            <strong>{taskDialog.preview?.state}</strong>
            <small>{taskDialog.preview?.note}</small>
          </div>
          <footer className="mh-task-dialog__footer">
            <Button variant="secondary" onClick={onCloseTask}>
              {taskDialog.cancelLabel || "Cancel"}
            </Button>
            <Button variant="primary" type="submit">
              {taskDialog.submitLabel || "Add to Review Queue"}
            </Button>
          </footer>
        </form>
      </Modal>
      <Toast open={toast.open} message={toast.message} />
    </Shell>
  );
}

/**
 * Data Upload entry page (data-upload.html): Self-Service hero shell, a
 * back/template-import toolbar, a carded multi-field form, and the Template
 * Import modal with a file dropzone and tips. Submit disables the button and
 * flashes `submittingLabel` — the host owns the timer (original restores
 * after 1500ms).
 * @param {object} props
 * @param {string} [props.current="self-service"]
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {object} [props.hero={}] Hero props
 * @param {{ backHref?: string, backLabel?: string, importLabel?: string }} [props.toolbar={}]
 * @param {Array<{ name: string, label: string, placeholder?: string }>} [props.fields=[]]
 * @param {string} [props.submitLabel="Submit"]
 * @param {string} [props.submittingLabel="Submitted"]
 * @param {boolean} [props.submitting=false]
 * @param {object} [props.bulkImport={}] modal copy/state: title, dropzoneTitle, dropzoneHint, selectedPrefix, accept, templateLabel, templateHref, tipsTitle, tips[]
 * @param {boolean} [props.bulkImportOpen=false]
 * @param {string} [props.selectedFile] file name shown in the dropzone hint
 * @param {(target: object) => void} [props.onNavigate]
 * @param {() => void} [props.onOpenImport]
 * @param {() => void} [props.onCloseImport]
 * @param {(file: { name: string }) => void} [props.onSelectFile]
 * @param {(target: { href: string }) => void} [props.onDownloadTemplate]
 * @param {(values: Object<string, string>) => void} [props.onSubmitForm]
 */
export function DataUploadPage({
  current = "self-service",
  logo,
  navigation = [],
  hero = {},
  toolbar = {},
  fields = [],
  submitLabel = "Submit",
  submittingLabel = "Submitted",
  submitting = false,
  bulkImport = {},
  bulkImportOpen = false,
  selectedFile,
  onNavigate,
  onOpenImport,
  onCloseImport,
  onSelectFile,
  onDownloadTemplate,
  onSubmitForm,
}) {
  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} position="fixed" onNavigate={onNavigate} />
      <div className="mh-page__offset" aria-hidden="true" />
      <Hero {...hero} height={260} variant="banner" scrim="none" />
      <main className="mh-upload">
        <div className="mh-upload__toolbar">
          <a className="mh-upload__back" href={toolbar.backHref || "#"} onClick={() => onNavigate?.({ href: toolbar.backHref || "#" })}>
            <Icon name="arrow-left" />
            <span>{toolbar.backLabel || "Back"}</span>
          </a>
          <Button variant="secondary" icon="upload" onClick={onOpenImport}>
            {toolbar.importLabel || "Template Import"}
          </Button>
        </div>
        <form
          className="mh-upload__form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const values = {};
            for (const [name, value] of data.entries()) values[name] = String(value).trim();
            onSubmitForm?.(values);
          }}
        >
          <div className="mh-upload__card">
            <div className="mh-upload__grid">
              {fields.map((field) => (
                <FormField key={field.name} label={field.label} name={field.name} placeholder={field.placeholder || "Enter"} autoComplete="off" />
              ))}
            </div>
          </div>
          <Button variant="gold" size="lg" type="submit" disabled={submitting}>
            {submitting ? submittingLabel : submitLabel}
          </Button>
        </form>
      </main>
      <Modal open={bulkImportOpen} title={bulkImport.title} className="mh-bulk-import" variant="sheet" onClose={onCloseImport}>
        <div className="mh-bulk-import__body">
          <FileDropzone
            title={bulkImport.dropzoneTitle}
            hint={bulkImport.dropzoneHint}
            selectedPrefix={bulkImport.selectedPrefix}
            fileName={selectedFile}
            accept={bulkImport.accept}
            onSelect={onSelectFile}
          />
          <a className="mh-bulk-import__template" href={bulkImport.templateHref || "#"} download onClick={() => onDownloadTemplate?.({ href: bulkImport.templateHref || "#" })}>
            <Icon name="download" />
            <span>{bulkImport.templateLabel || "Download template"}</span>
          </a>
          <div className="mh-bulk-import__tips">
            <h4>{bulkImport.tipsTitle || "Tips"}</h4>
            <ul>
              {(bulkImport.tips || []).map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </Shell>
  );
}

/**
 * Media Tracking Detail report page (media-tracking-detail.html): back link,
 * page head, Daily/Weekly/Monthly/Spot Info Mapping period tabs, a 15-field
 * filter grid, the dimension-notes paragraph, and a wide scrollable data
 * table. The assistant is the lite drawer variant (scope row, skill "+"
 * trigger, simple answer cards, "Recent Chats" popover).
 * @param {object} props
 * @param {string} [props.current="self-service"]
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {{ backHref?: string, backLabel?: string }} [props.toolbar={}]
 * @param {{ eyebrow?: string, title?: string }} [props.head={}]
 * @param {Array<{ id: string, label: string }>} [props.periods=[]]
 * @param {string} [props.period="monthly"]
 * @param {Array<{ name: string, label: string, required?: boolean, options?: Array<string|object>, placeholder?: string, defaultValue?: string }>} [props.filters=[]]
 * @param {Array<{ term: string, text: string }>} [props.notes=[]]
 * @param {{ title?: string, count?: string, columns?: Array<{ key: string, header: string }>, rows?: Array<object> }} [props.table={}]
 * @param {object} [props.assistant={}] AssistantPanel props (lite variant); `skillMenu`/`selectedSkill` pass through
 * @param {boolean} [props.assistantOpen=false]
 * @param {string} [props.prompt=""]
 * @param {object} [props.skillFlow] ModelFlowDialog props; `skillFlow.step` truthy renders the flow dialog
 * @param {(target: object) => void} [props.onNavigate]
 * @param {(event: { id: string, label: string }) => void} [props.onPeriodChange]
 * @param {(event: { name: string, value: string }) => void} [props.onFilterChange]
 * @param {() => void} [props.onOpenAssistant]
 * @param {() => void} [props.onCloseAssistant]
 * @param {(event: object) => void} [props.onPromptChange]
 * @param {(event: object) => void} [props.onSubmit]
 * @param {(event: object) => void} [props.onSuggestion]
 * @param {() => void} [props.onNewSession]
 * @param {(event: object) => void} [props.onMaximize]
 * @param {(event: object) => void} [props.onHistory]
 * @param {(event: object) => void} [props.onHistorySelect]
 * @param {(event: { names: string[] }) => void} [props.onAttach]
 * @param {(event: { id?: string, type: string, title: string }) => void} [props.onSelectSkill]
 * @param {() => void} [props.onClearSkill]
 * @param {(event: { action: "history"|"manual" }) => void} [props.onSkillAction]
 */
export function MediaTrackingDetailPage({
  current = "self-service",
  logo,
  navigation = [],
  toolbar = {},
  head = {},
  periods = [],
  period = "monthly",
  filters = [],
  notes = [],
  table = {},
  assistant = {},
  assistantOpen = false,
  prompt = "",
  skillFlow,
  onNavigate,
  onPeriodChange,
  onFilterChange,
  onOpenAssistant,
  onCloseAssistant,
  onPromptChange,
  onSubmit,
  onSuggestion,
  onNewSession,
  onMaximize,
  onHistory,
  onHistorySelect,
  onAttach,
  onSelectSkill,
  onClearSkill,
  onSkillAction,
}) {
  return (
    <Shell tone="tracking">
      <Header logo={logo} items={navigation} current={current} position="fixed" onNavigate={onNavigate} />
      <main className="mh-tracking">
        <div className="mh-tracking__topbar">
          <a className="mh-tracking__back" href={toolbar.backHref || "#"} onClick={() => onNavigate?.({ href: toolbar.backHref })}>
            <Icon name="arrow-left" />
            <span>{toolbar.backLabel || "Back"}</span>
          </a>
        </div>
        <header className="mh-tracking__head">
          <span className="mh-tracking__eyebrow">{head.eyebrow}</span>
          <h1>{head.title}</h1>
        </header>
        <Tabs label="Period" items={periods} value={period} onChange={onPeriodChange} />
        <section className="mh-tracking__filters" aria-label="Filters">
          {filters.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              name={field.name}
              required={field.required}
              control="select"
              options={field.options || []}
              placeholder={field.placeholder}
              defaultValue={field.defaultValue ?? normalizeOptions(field.options)[0]?.value}
              onChange={onFilterChange}
            />
          ))}
        </section>
        <p className="mh-tracking__description">
          {notes.map((note, index) => (
            <React.Fragment key={note.term}>
              {index > 0 ? " " : null}
              <strong>{note.term}</strong>: {note.text}
            </React.Fragment>
          ))}
        </p>
        <section className="mh-tracking__table-wrap" aria-label="Data table">
          <header className="mh-tracking__table-head">
            <h2>{table.title}</h2>
            <span className="mh-tracking__count">
              {table.count}
              <Icon name="chevron-down" />
            </span>
          </header>
          <div className="mh-tracking__scroll">
            <table className="mh-tracking__table">
              <thead>
                <tr>
                  {(table.columns || []).map((column) => (
                    <th key={column.key}>{column.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(table.rows || []).map((row, index) => (
                  <tr key={index}>
                    {(table.columns || []).map((column) => (
                      <td key={column.key}>{row[column.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <AssistantLauncher hidden={assistantOpen} onOpen={onOpenAssistant} />
      <AssistantPanel
        open={assistantOpen}
        placement="drawer"
        enterToSubmit={false}
        lite
        {...assistant}
        prompt={prompt}
        onClose={onCloseAssistant}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        onSuggestion={onSuggestion}
        onNewSession={onNewSession}
        onMaximize={onMaximize}
        onHistory={onHistory}
        onHistorySelect={onHistorySelect}
        onAttach={onAttach}
        onSelectSkill={onSelectSkill}
        onClearSkill={onClearSkill}
        onSkillAction={onSkillAction}
      />
      {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    </Shell>
  );
}
