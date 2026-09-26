import "../../tokens.css";
import React from "react";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { AssistantPanel } from "../../components/AssistantPanel/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { ModelFlowDialog } from "../../components/ModelFlowDialog/index.jsx";
import { SearchField } from "../../components/SearchField/index.jsx";
import { CityInvestDashboard } from "../../features/cockpit/CityInvestDashboard/index.jsx";
import { LiveOverview } from "../../features/cockpit/LiveOverview/index.jsx";
import { LiveReportView } from "../../features/cockpit/LiveReportView/index.jsx";
import { ProjectCatalog } from "../../features/cockpit/ProjectCatalog/index.jsx";
import { ProjectDirectory } from "../../features/cockpit/ProjectDirectory/index.jsx";
import { ReportCopilot } from "../../features/cockpit/ReportCopilot/index.jsx";
import { ReportDetailsDrawer } from "../../features/cockpit/ReportDetailsDrawer/index.jsx";
import { ReportRow } from "../../features/cockpit/ReportRow/index.jsx";
import { Shell } from "../../pages/Shell/index.jsx";
import { pluralize, projectSearchText, reportSearchText, resolveReportAssets, resolveReportContext } from "../../report-logic.js";
import { REPORT_CATALOG_HREF, liveReportHref, projectCatalogHref, reportContextHref } from "../../report-routes.js";
import "./MarketingCockpitPage.css";


/** @type {readonly ["catalog", "live"]} */
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
 * @param {{ liveReportLabel: string, searchLabel: string, imageAltSuffix: string, dashboardUnit: string, assetUnit: string, updatedFallback: string, catalogBackLabel: string, emptyTitle: string, emptyDescription: string, meta: { owner: string, cadence: string, updated: string, knowledge: string } }} props.copy Page copy used in catalog, directory, live header and details.
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
 * @param {(target: { project: string, index: number, href: string }) => void} [props.onOpenDetails]
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onCloseDetails]
 * @param {(target: { href?: string }) => void} [props.onOpenLive]
 * @param {(target: { project: string, href: string }) => void} [props.onBack] live view back-to-library
 * @param {object} [props.workspace={}] ReportCopilot props (report-scoped aiWorkspace)
 * @param {boolean} [props.workspaceOpen=false]
 * @param {(event: { reason: "open" }) => void} [props.onOpenWorkspace] live view AI launcher (Report Copilot)
 * @param {object} [props.assistant={}] AssistantPanel props
 * @param {boolean} [props.assistantOpen=false]
 * @param {string} [props.prompt=""]
 * @param {object} [props.skillFlow] ModelFlowDialog props; `{ step }` required to render
 * @param {(event: { reason: "open" }) => void} [props.onOpenAssistant]
 * @param {(event: { reason: "backdrop"|"escape"|"button" }) => void} [props.onCloseAssistant]
 * @param {(event: { name: string, value: string }) => void} [props.onPromptChange]
 * @param {(event: { prompt: string }) => void} [props.onSubmit]
 */
export function MarketingCockpitPage({
  current = "cockpit",
  logo,
  navigation = [],
  hero = {},
  copy,
  query = "",
  groups = [],
  projects = {},
  project = "all",
  view: _view = "catalog",
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
  const assistantLauncherRef = React.useRef(null);
  return (
    <Shell tone="cockpit">
      <Header logo={logo} items={navigation} current={current} density="comfortable" onNavigate={onNavigate} />
      <div className="mh-page__offset" aria-hidden="true" />
      <Hero {...hero} height={260} variant="banner" scrim="banner" />
      <main className="mh-page__shell">
        {isLive ? (
          <LiveReportView
            kicker={`${liveProject.title.toUpperCase()} / ${copy.liveReportLabel}`}
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
          <SearchField label={copy.searchLabel} value={query} placeholder={copy.searchLabel} size="lg" icon="end" onChange={onQueryChange} />
        </header>
        {active ? (
          <React.Fragment>
            <ProjectDirectory
              backHref={backHref}
              image={active.image}
              imageAlt={`${active.title} ${copy.imageAltSuffix}`}
              kicker={active.kicker}
              title={active.title}
              description={active.description}
              countText={pluralize(active.reports.length, copy.dashboardUnit)}
              updated={active.sourceStrip[0] || copy.updatedFallback}
              listCountText={pluralize(active.reports.filter((report) => !search || reportSearchText(knowledge, project, active, report).includes(search)).length, copy.dashboardUnit)}
              onBack={(target) => onNavigate?.({ id: "cockpit-all", href: target.href, label: copy.catalogBackLabel })}
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
                      { label: copy.meta.owner, value: item.report.owner },
                      { label: copy.meta.cadence, value: item.report.cadence },
                      { label: copy.meta.updated, value: item.report.updated },
                      { label: copy.meta.knowledge, value: pluralize(resolveReportAssets(knowledge, project, item.report).length, copy.assetUnit) },
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
                <strong>{copy.emptyTitle}</strong>
                <span>{copy.emptyDescription}</span>
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
                      updated: projects[key].sourceStrip[0] || copy.updatedFallback,
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
                <strong>{copy.emptyTitle}</strong>
                <span>{copy.emptyDescription}</span>
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
        imageAlt={detailsTarget ? `${detailsTarget.project.title} ${copy.imageAltSuffix}` : undefined}
        hierarchy={detailsTarget ? `${detailsTarget.project.category} / ${detailsTarget.project.title} / ${detailsTarget.report.type}` : undefined}
        title={detailsTarget ? detailsTarget.report.title : ""}
        explanation={detailsTarget ? detailsTarget.report.description : undefined}
        meta={
          detailsTarget
            ? [
                { label: copy.meta.owner, value: detailsTarget.report.owner },
                { label: copy.meta.cadence, value: detailsTarget.report.cadence },
                { label: copy.meta.updated, value: detailsTarget.report.updated },
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
      <AssistantLauncher ref={assistantLauncherRef} hidden={assistantOpen || workspaceOpen} onOpen={isLive ? onOpenWorkspace : onOpenAssistant} />
      <ReportCopilot open={workspaceOpen} {...workspace} returnFocusRef={assistantLauncherRef} />
      <AssistantPanel
        open={assistantOpen}
        returnFocusRef={assistantLauncherRef}
        placement="drawer"
        {...assistant}
        variant="cockpit"
        prompt={prompt}
        onClose={onCloseAssistant}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
      />
      {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
    </Shell>
  );
}
