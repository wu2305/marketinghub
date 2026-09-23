import React from "react";
import "./pages.css";
import { Button, StatusBadge } from "./atoms.jsx";
import { ColumnChart, DataTable, FilterPills, MetricStat, ProgressList, SearchField, SectionHeading, Tabs, ViewHeading } from "./molecules.jsx";
import {
  ActionCard,
  AssistantLauncher,
  AssistantPanel,
  CampaignRail,
  Header,
  Hero,
  KnowledgeLibrary,
  KnowledgeSidebar,
  Panel,
  ProjectCatalog,
  SummaryStrip,
  TaskList,
  TypeGrid,
  WorkspaceGrid,
} from "./organisms.jsx";

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
}) {
  return (
    <Shell tone="home">
      <Header logo={logo} items={navigation} current={current} position="fixed" onNavigate={onNavigate} />
      <Hero image={hero.image} title={hero.title} description={hero.description} height={300} variant="home" scrim="home">
        {hero.stats.map((stat) => (
          <MetricStat key={stat.label} {...stat} variant="glass" />
        ))}
      </Hero>
      <div className="mh-page__inset">
        <SectionHeading {...heading} />
        <WorkspaceGrid cards={cards} onOpen={onOpen} onNavigate={onNavigate} />
      </div>
      {assistantOpen ? null : <AssistantLauncher onOpen={onOpenAssistant} />}
      <AssistantPanel
        open={assistantOpen}
        placement="drawer"
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
      />
    </Shell>
  );
}

/**
 * Marketing Cockpit catalog page: search + project groups.
 * @param {object} props
 * @param {string} [props.current="cockpit"]
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {object} [props.hero={}] Hero props
 * @param {string} [props.query=""] catalog search text
 * @param {Array<{ id: string, title: string, projects: Array<object> }>} [props.groups=[]]
 * @param {(target: object) => void} [props.onNavigate]
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(target: { title: string, id?: string }) => void} [props.onOpen]
 */
export function MarketingCockpitPage({ current = "cockpit", logo, navigation = [], hero = {}, query = "", groups = [], onNavigate, onQueryChange, onOpen }) {
  const visible = groups
    .map((group) => ({
      ...group,
      projects: group.projects.filter((project) => {
        const haystack = `${project.title} ${project.kicker} ${project.description}`.toLowerCase();
        return !query || haystack.includes(query.toLowerCase());
      }),
    }))
    .filter((group) => group.projects.length);
  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} position="fixed" onNavigate={onNavigate} />
      <div style={{ height: 56 }} />
      <Hero {...hero} height={260} variant="banner" scrim="banner" />
      <main className="mh-page__shell">
        <div className="mh-page__search">
          <SearchField label="Search dashboards" value={query} placeholder="Search dashboards" size="lg" icon="end" onChange={onQueryChange} />
        </div>
        <ProjectCatalog groups={visible} onOpen={onOpen} />
      </main>
      <AssistantLauncher onOpen={() => onNavigate?.({ id: "assistant", label: "AI Interpreter" })} />
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
 * @param {Array<object>} [props.uploads=[]] ActionCard props for the upload tab
 * @param {"analysis"|"upload"} [props.tab="analysis"]
 * @param {string} [props.category="all"]
 * @param {(target: object) => void} [props.onNavigate]
 * @param {(event: { id: string, label: string }) => void} [props.onTabChange]
 * @param {(event: { id: string, label: string }) => void} [props.onCategoryChange]
 * @param {(target: { title: string }) => void} [props.onOpen]
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
  tab = "analysis",
  category = "all",
  onNavigate,
  onTabChange,
  onCategoryChange,
  onOpen,
}) {
  const source = tab === "upload" ? uploads : reports;
  const items = source.filter((item) => category === "all" || item.category === category);
  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} position="fixed" onNavigate={onNavigate} />
      <div style={{ height: 56 }} />
      <Hero {...hero} height={260} variant="banner" scrim="none" />
      <main className="mh-page__shell mh-page__shell--self">
        <div className="mh-self-tools">
          <Tabs label="Data view mode" items={tabs} value={tab} onChange={onTabChange} />
          <FilterPills label={tab === "upload" ? "Filter uploads" : "Filter reports"} items={filters[tab] || []} value={category} onChange={onCategoryChange} />
        </div>
        <div className={tab === "upload" ? "mh-page__cards" : "mh-page__cards mh-page__cards--two"}>
          {items.map((item) => (
            <ActionCard key={item.title} {...item} onOpen={onOpen} />
          ))}
        </div>
      </main>
      <AssistantLauncher onOpen={() => onNavigate?.({ id: "assistant", label: "AI Interpreter" })} />
    </Shell>
  );
}

function recordFieldValues(record, field) {
  const value = record[field];
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function uniqueFilterOptions(records, field) {
  const seen = new Set();
  for (const record of records) {
    for (const value of recordFieldValues(record, field)) seen.add(value);
  }
  return [...seen].sort().map((value) => ({ id: value, label: value }));
}

function recordMatchesFilter(record, filter, value) {
  const option = (filter.options || []).find((item) => item.id === value);
  const field = option?.field || filter.id;
  const expected = option?.id ?? value;
  return recordFieldValues(record, field).includes(expected);
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

  const heroStats = type
    ? [
        { label: type.title, value: String(type.stats.total), caption: `${type.stats.units[1]} governed for AI use` },
        { label: "New this month", value: String(type.stats.monthly), caption: "knowledge assets added recently" },
      ]
    : hero.stats || [];
  const heroProps = type ? { ...hero, title: type.title, description: type.summary } : hero;

  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} position="fixed" onNavigate={onNavigate} />
      <div style={{ height: 56 }} />
      <Hero {...heroProps} height={260} variant="knowledge" scrim="knowledge">
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
        <div className="mh-interpreter__main">
          {overview ? (
            <TypeGrid items={types} activeId={activeType} onSelect={onSelectType} />
          ) : !known ? (
            <div className="mh-empty mh-empty--unknown" role="status">
              <strong>Unknown knowledge type</strong>
              <p>{`"${activeType}" is not one of the ${types.length} knowledge types. Pick a type from the navigation.`}</p>
            </div>
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
 * @param {boolean} [props.assistantOpen=false]
 * @param {string} [props.prompt=""]
 * @param {() => void} [props.onOpenAssistant]
 * @param {() => void} [props.onCloseAssistant]
 * @param {(event: { name: string, value: string }) => void} [props.onPromptChange]
 * @param {(event: object) => void} [props.onSubmit]
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
  assistantOpen = false,
  prompt = "",
  onOpenAssistant,
  onCloseAssistant,
  onPromptChange,
  onSubmit,
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
                  <DataTable columns={accountColumns} rows={visibleAccounts} caption={`${visibleAccounts.length} accounts shown`} />
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
      {assistantOpen ? null : <AssistantLauncher onOpen={onOpenAssistant} />}
      <AssistantPanel open={assistantOpen} {...assistant} prompt={prompt} onClose={onCloseAssistant} onPromptChange={onPromptChange} onSubmit={onSubmit} />
    </Shell>
  );
}
