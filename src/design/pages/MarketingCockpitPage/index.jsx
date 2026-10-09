import "../../tokens.css";
import React from "react";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
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
import { pluralize, projectSearchText, reportSearchText, resolveReportAssets } from "../../features/cockpit/lib/report-logic.js";
import "./MarketingCockpitPage.css";


/**
 * @typedef {object} CockpitRecommendation A suggested question of the live report's Copilot; also listed in the details drawer.
 * @property {string} title
 * @property {string} [meta]
 * @property {string} [answerTitle]
 * @property {string} [summary]
 * @property {Array<string[]>} [findings] `[label, text]` pairs
 */

/**
 * @typedef {object} CockpitReport One dashboard of a project.
 * @property {string} title
 * @property {string} type
 * @property {string} description
 * @property {string} owner
 * @property {string} cadence
 * @property {string} updated
 * @property {string} [embed] `"city-invest"`: the live view is the CityInvestDashboard (needs `cityInvest`)
 * @property {string[]} [knowledgeIds] ids into `knowledge`
 * @property {Array<Array<string|number>>} [metrics] LiveOverview KPI rows: label, value, delta
 * @property {Array<Array<string|number>>} [chart] LiveOverview bars: label, value, comparison
 * @property {CockpitRecommendation[]} [recommendations]
 * @property {{ panelTitle?: string, periodHint?: string }} [assistant]
 */

/**
 * @typedef {object} CockpitProject One card of the catalog and its directory of reports.
 * @property {string} title
 * @property {string} kicker
 * @property {string} description
 * @property {string} group id of a `groups` entry
 * @property {string} category
 * @property {string} image
 * @property {string} accent
 * @property {string[]} sourceStrip first entry is the "updated" line
 * @property {CockpitReport[]} reports
 */

/**
 * @typedef {object} CockpitKnowledgeAsset A knowledge item linked to reports (counts, search text, context links).
 * @property {string} id
 * @property {string} title
 * @property {string} type
 * @property {string[]} [projects] project ids the asset is scoped to
 * @property {Array<{ name: string, kind: string }>} [connections]
 */

/** @typedef {Omit<Parameters<typeof ReportCopilot>[0], "open" | "returnFocusRef">} CockpitWorkspace Report Copilot content, state and callbacks. */

/** @type {readonly ["catalog", "live"]} */
export const cockpitViews = ["catalog", "live"];

/**
 * Marketing Cockpit catalog: "all" mode lists category groups of project cards;
 * a `project` id switches to the project directory with report rows. Search
 * covers project fields plus linked knowledge titles, mirroring the original.
 * @param {object} props
 * @param {string} [props.current="cockpit"] Active nav id. // 当前导航 id。
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {Array<object>} [props.navigation=[]] Header links. // 页头链接。
 * @param {object} [props.hero={}] Header image area. // 头图区。
 * @param {{ liveReportLabel: string, searchLabel: string, imageAltSuffix: string, dashboardUnit: string, assetUnit: string, updatedFallback: string, catalogBackLabel: string, emptyTitle: string, emptyDescription: string, meta: { owner: string, cadence: string, updated: string, knowledge: string } }} props.copy Page copy used in catalog, directory, live header and details. // 用于目录、项目列表、实时页头和详情的页面文案。
 * @param {string} [props.query=""] Catalog search text. // 目录搜索文字。
 * @param {Array<{ id: string, label: string }>} [props.groups=[]] Category groups. // 分类分组。
 * @param {Record<string, CockpitProject>} [props.projects={}] Project records keyed by id. // 按 id 索引的项目记录。
 * @param {string} [props.project="all"] Active catalog project id, or `"all"`. // 当前目录项目的 id，或 `"all"`。
 * @param {"catalog"|"live"} [props.view="catalog"] Not read by the page. The live report opens whenever `dashboard` is set, as in the original `?dashboard=` URL; a host may still pass the URL's `view` value through. // 页面不读取这个值。只要设置了 `dashboard` 就会打开实时报表，和原页面的 `?dashboard=` 一致；宿主仍可透传 URL 里的 `view`。
 * @param {number|string|null} [props.dashboard=null] Live report index. When this value is set, the live view opens. // 实时报表索引。设置了这个值就会打开实时视图。
 * @param {{ project: string, index: number }|null} [props.details=null] Open report details drawer. // 打开的报表详情抽屉。
 * @param {Array<{ label: string, pills: Array<{ label: string, href: string }> }>} [props.detailsSections=[]] Static drawer asset sections. // 抽屉里的静态资产分区。
 * @param {CockpitKnowledgeAsset[]} [props.knowledge=[]] Knowledge assets used for report counts, search text, and context links. // 用于报表计数、搜索文字和上下文链接的知识资产。
 * @param {object} [props.cityInvest] City Invest dashboard data. Required for reports with `embed: "city-invest"`. // City Invest 仪表盘数据。带 `embed: "city-invest"` 的报表需要它。
 * @param {(id: string, params?: Record<string,string>) => string} props.hrefFor Turns a route id into an href. The story and the host each supply this function. // 把路由 id 转成 href。故事和宿主各自提供这个函数。
 * @param {(target: { id: string, params: Record<string,string>, href: string, label?: string }) => void} [props.onNavigate] The function runs when a link opens another page. The result has `id`, `params`, and `href`. // 链接要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange] The function runs at each change in catalog search. The result has `name` and `value`. // 目录搜索每次变化都会调用这个函数。结果里有 `name` 和 `value`。
 * @param {(target: { id: string, href: string }) => void} [props.onOpenProject] The function runs when the user opens a project directory. The result has `id` and `href`. // 用户打开项目目录时，会调用这个函数。结果里有 `id` 和 `href`。
 * @param {(target: { project: string, index: number, href: string }) => void} [props.onOpenReport] The function runs when the user opens a live report. The result has `project`, `index`, and `href`. // 用户打开实时报表时，会调用这个函数。结果里有 `project`、`index` 和 `href`。
 * @param {(target: { project: string, index: number }) => void} [props.onOpenDetails] The function runs when the user opens the report details drawer. The result has `project` and `index`. It has no `href`. // 用户打开报表详情抽屉时，会调用这个函数。结果里有 `project` 和 `index`，没有 `href`。
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onCloseDetails] The function runs when the user closes the details drawer. The result has `reason`. // 用户关闭详情抽屉时，会调用这个函数。结果里有 `reason`。
 * @param {(target: { href?: string }) => void} [props.onOpenLive] The function runs when the details drawer opens the live report. // 详情抽屉要打开实时报表时，会调用这个函数。
 * @param {(target: { project: string, href: string }) => void} [props.onBack] The function runs when the live view returns to the catalog. The result has `project` and `href`. // 实时视图返回目录时，会调用这个函数。结果里有 `project` 和 `href`。
 * @param {CockpitWorkspace} [props.workspace] Report Copilot copy, state, and callbacks. // Report Copilot 的文案、状态和回调。
 * @param {boolean} [props.workspaceOpen=false] Set true to open Report Copilot. // 设为 true 时打开 Report Copilot。
 * @param {(event: { reason: "open" }) => void} [props.onOpenWorkspace] The function runs when the user opens Report Copilot. The result has `reason: "open"`. // 用户打开 Report Copilot 时，会调用这个函数。结果里的 `reason` 是 `"open"`。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState} [props.assistant={}] Corner assistant copy, state, and callbacks. // 角落助手的文案、状态和回调。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model dialog props. The dialog shows when `skillFlow.step` is set. // 建模对话框的 props。设置了 `skillFlow.step` 时显示对话框。
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
  hrefFor,
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
  skillFlow,
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
  const projectTarget = (id) => ({ id: "cockpit", params: id === "all" ? {} : { project: id } });
  const liveTarget = (id, index) => ({ id: "cockpit", params: { project: id, dashboard: String(index), view: "live" } });
  const emitNavigation = (target, label) => onNavigate?.({ ...target, href: hrefFor(target.id, target.params), label });
  const navItems = navigation.map((item) => ({ ...item, href: hrefFor(item.id, {}) }));
  return (
    <Shell tone="cockpit">
      <Header logo={{ ...logo, href: hrefFor("home", {}) }} items={navItems} current={current} density="comfortable" onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
      <div className="mh-page__offset" aria-hidden="true" />
      <Hero {...hero} height={260} variant="banner" scrim="banner" />
      <main className="mh-page__shell">
        {isLive ? (
          <LiveReportView
            kicker={`${liveProject.title.toUpperCase()} / ${copy.liveReportLabel}`}
            title={liveReport.title}
            backHref={hrefFor("cockpit", projectTarget(liveKey).params)}
            onBack={(target) => {
              onBack?.({ project: liveKey, href: target.href });
              emitNavigation(projectTarget(liveKey), liveProject.title);
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
              backHref={hrefFor("cockpit", {})}
              image={active.image}
              imageAlt={`${active.title} ${copy.imageAltSuffix}`}
              kicker={active.kicker}
              title={active.title}
              description={active.description}
              countText={pluralize(active.reports.length, copy.dashboardUnit)}
              updated={active.sourceStrip[0] || copy.updatedFallback}
              listCountText={pluralize(active.reports.filter((report) => !search || reportSearchText(knowledge, project, active, report).includes(search)).length, copy.dashboardUnit)}
              onBack={() => emitNavigation(projectTarget("all"), copy.catalogBackLabel)}
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
                    href={hrefFor("cockpit", liveTarget(project, item.index).params)}
                    onOpen={() => {
                      onOpenReport?.({ project, index: item.index, href: hrefFor("cockpit", liveTarget(project, item.index).params) });
                      emitNavigation(liveTarget(project, item.index), item.report.title);
                    }}
                    onDetails={() => onOpenDetails?.({ project, index: item.index })}
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
                      href: hrefFor("cockpit", projectTarget(key).params),
                    })),
                }))
                .filter((group) => group.projects.length)}
              onOpen={(target) => {
                onOpenProject?.({ id: target.id, href: hrefFor("cockpit", projectTarget(target.id).params) });
                emitNavigation(projectTarget(target.id), target.title);
              }}
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
        liveHref={details ? hrefFor("cockpit", liveTarget(details.project, details.index).params) : undefined}
        resetKey={details ? `${details.project}:${details.index}` : undefined}
        onClose={onCloseDetails}
        onOpenLive={(target) => {
          onOpenLive?.(target);
          if (details) emitNavigation(liveTarget(details.project, details.index), detailsTarget?.report.title);
        }}
      />
      {/* body:has(#aiWorkspace.open) hides the launcher in the original too */}
      <AssistantDock ref={assistantLauncherRef} assistant={assistant} skillFlow={skillFlow} variant="cockpit" launcherHidden={workspaceOpen} onLauncherOpen={isLive ? (event) => onOpenWorkspace?.(event) : undefined} />
      <ReportCopilot open={workspaceOpen} {...workspace} returnFocusRef={assistantLauncherRef} />
    </Shell>
  );
}
