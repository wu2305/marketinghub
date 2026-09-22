import React from "react";
import "./pages.css";
import { Button, StatusBadge } from "./atoms.jsx";
import { ASSISTANT, CAMPAIGN, COCKPIT, HOME, INTERPRETER, LOGO, NAV, SELF_SERVICE } from "./content.js";
import { SearchField, SectionHeading, Tabs, ViewHeading } from "./molecules.jsx";
import {
  ActionCard,
  AssistantLauncher,
  AssistantPanel,
  CampaignRail,
  ColumnChart,
  DataTable,
  Header,
  Hero,
  KnowledgeLibrary,
  KnowledgeSidebar,
  MetricStat,
  Panel,
  ProgressList,
  ProjectCatalog,
  SummaryStrip,
  TaskList,
  TypeGrid,
  WorkspaceGrid,
} from "./organisms.jsx";

function Shell({ tone = "workspace", children }) {
  return <div className={`mh-page mh-page--${tone}`}>{children}</div>;
}

export function HomePage({
  current = "home",
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
      <Header logo={LOGO} items={NAV} current={current} tone="overlay" position="fixed" onNavigate={onNavigate} />
      <Hero image={HOME.hero.image} title={HOME.hero.title} description={HOME.hero.description} height={300} variant="home" scrim="home">
        {HOME.hero.stats.map((stat) => (
          <MetricStat key={stat.label} {...stat} variant="glass" />
        ))}
      </Hero>
      <div className="mh-page__inset">
        <SectionHeading {...HOME.heading} />
        <WorkspaceGrid cards={HOME.cards} onOpen={onOpen} onNavigate={onNavigate} />
      </div>
      {assistantOpen ? null : <AssistantLauncher onOpen={onOpenAssistant} />}
      <AssistantPanel
        open={assistantOpen}
        placement="drawer"
        {...ASSISTANT}
        scope={scope}
        showScopes
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

export function MarketingCockpitPage({ current = "cockpit", query = "", groups = COCKPIT.groups, onNavigate, onQueryChange, onOpen }) {
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
      <Header logo={LOGO} items={NAV} current={current} position="fixed" onNavigate={onNavigate} />
      <div style={{ height: 56 }} />
      <Hero {...COCKPIT.hero} height={260} variant="banner" scrim="banner" />
      <main className="mh-page__shell">
        <div className="mh-page__search">
          <SearchField label="Search dashboards" value={query} placeholder="Search dashboards" size="lg" onChange={onQueryChange} />
        </div>
        <ProjectCatalog groups={visible} onOpen={onOpen} />
      </main>
      <AssistantLauncher onOpen={() => onNavigate?.({ id: "assistant", label: "AI Interpreter" })} />
    </Shell>
  );
}

export function SelfServicePage({ current = "self-service", tab = "analysis", onNavigate, onTabChange, onOpen }) {
  const items = tab === "upload" ? SELF_SERVICE.uploads : SELF_SERVICE.reports;
  return (
    <Shell>
      <Header logo={LOGO} items={NAV} current={current} position="fixed" onNavigate={onNavigate} />
      <div style={{ height: 56 }} />
      <Hero {...SELF_SERVICE.hero} height={260} variant="banner" scrim="none" />
      <main className="mh-page__shell">
        <Tabs label="Data view mode" items={SELF_SERVICE.tabs} value={tab} onChange={onTabChange} />
        <div className={tab === "upload" ? "mh-page__cards" : "mh-page__cards mh-page__cards--two"} style={{ marginTop: 16 }}>
          {items.map((item) => (
            <ActionCard key={item.title} {...item} onOpen={onOpen} />
          ))}
        </div>
      </main>
      <AssistantLauncher onOpen={() => onNavigate?.({ id: "assistant", label: "AI Interpreter" })} />
    </Shell>
  );
}

export function AiInterpreterPage({
  current = "interpreter",
  activeType = "overview",
  query = "",
  status = "All statuses",
  onNavigate,
  onSelectType,
  onQueryChange,
  onStatusChange,
  onCreate,
  onSelectAsset,
}) {
  const overview = activeType === "overview";
  const rows = INTERPRETER.assets.filter((asset) => {
    const type = INTERPRETER.types.find((item) => item.id === activeType);
    const typeMatch = overview || !type || asset.type === type.title || asset.type.startsWith(type.title.replace(/s$/, ""));
    const queryMatch = !query || `${asset.title} ${asset.summary}`.toLowerCase().includes(query.toLowerCase());
    const statusMatch = status === "All statuses" || asset.status === status;
    return typeMatch && queryMatch && statusMatch;
  });
  return (
    <Shell>
      <Header logo={LOGO} items={NAV} current={current} position="fixed" onNavigate={onNavigate} />
      <div style={{ height: 56 }} />
      <Hero {...INTERPRETER.hero} height={260} variant="knowledge" scrim="knowledge">
        {INTERPRETER.hero.stats.map((stat) => (
          <MetricStat key={stat.label} {...stat} variant="glass" />
        ))}
      </Hero>
      <div className="mh-interpreter">
        <KnowledgeSidebar
          overview={{ ...INTERPRETER.overview, active: overview }}
          groups={INTERPRETER.groups.map((group) => ({
            ...group,
            items: group.items.map((item) => ({ ...item, active: item.id === activeType })),
          }))}
          onSelect={onSelectType}
        />
        <div className="mh-interpreter__main">
          {overview ? (
            <>
              <SectionHeading {...INTERPRETER.heading} />
              <TypeGrid items={INTERPRETER.types} onSelect={onSelectType} />
            </>
          ) : (
            <KnowledgeLibrary
              query={query}
              status={status}
              rows={rows}
              onQueryChange={onQueryChange}
              onStatusChange={onStatusChange}
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

export function CampaignPage({
  current = "campaign",
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
  const accounts = CAMPAIGN.accounts.filter((row) => !query || row.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <Shell>
      <Header logo={LOGO} items={NAV} current={current} position="fixed" onNavigate={onNavigate} />
      <div className="mh-campaign">
        <CampaignRail {...CAMPAIGN.rail} current={section} onSelect={onSectionChange} />
        <main>
          {section === "overview" ? (
            <>
              <ViewHeading
                eyebrow="Campaign workspace / Overview"
                title="Overview Dashboard"
                description="Monitor automated media operations across accounts, plans, units, and creative assets."
              >
                <Tabs label="Channel view" variant="segmented" items={CAMPAIGN.channels} value={channel} onChange={onChannelChange} />
              </ViewHeading>
              <div className="mh-campaign__metrics">
                {CAMPAIGN.metrics.map((metric) => (
                  <MetricStat key={metric.label} {...metric} variant="card" />
                ))}
              </div>
              <div className="mh-campaign__split">
                <Panel eyebrow="Distribution" title="Promotion Type Distribution" meta="Plans">
                  <ProgressList items={CAMPAIGN.distribution} />
                </Panel>
                <Panel eyebrow="Objective mix" title="Marketing Objective Distribution" meta="Plans">
                  <ColumnChart label="Marketing objective distribution chart" items={CAMPAIGN.objectives} />
                </Panel>
              </div>
              <div className="mh-campaign__table">
                <Panel
                  eyebrow="Account operations"
                  title="Account Operation Details"
                  actions={
                    <form
                      className="mh-campaign__tools"
                      onSubmit={(event) => {
                        event.preventDefault();
                        onFilter?.({ query });
                      }}
                    >
                      <SearchField label="Search sub-account" value={query} placeholder="Search sub-account" size="sm" onChange={onQueryChange} />
                      <Button variant="primary" size="sm" type="submit">
                        Filter
                      </Button>
                      <Button variant="secondary" size="sm" onClick={onReset}>
                        Reset
                      </Button>
                    </form>
                  }
                >
                  <DataTable columns={CAMPAIGN.accountColumns} rows={accounts} caption={`${accounts.length} accounts shown`} />
                </Panel>
              </div>
            </>
          ) : null}
          {section === "execution" ? (
            <div className="mh-stack">
              <ViewHeading
                eyebrow="Campaign workspace / Execution"
                title="RedNote Campaign Tool"
                description="Centralize media account operations, bulk plan creation, budget pacing, and campaign action publishing."
              >
                <Button variant="primary" onClick={onCreateTask}>
                  Create Campaign Task
                </Button>
              </ViewHeading>
              <SummaryStrip
                items={[
                  { label: "Awaiting confirmation", value: "341", caption: "generated plans" },
                  { label: "Budget watch", value: "2", caption: "cities near threshold" },
                  { label: "Under review", value: "3", caption: "anomalous plans" },
                ]}
              />
              <div className="mh-campaign__split">
                <Panel eyebrow="Automation" title="Automation Task Queue" meta="3 active tasks">
                  <TaskList
                    items={[
                      { status: "Pending", title: "Rednote bulk plan creation", detail: "341 plans generated and awaiting final publishing confirmation" },
                      { status: "Watch", title: "Budget pacing calibration", detail: "Shanghai and Beijing budgets are near the upper threshold; reduce by 8%" },
                      { status: "Review", title: "Anomalous plan pause", detail: "3 plans have no conversions for two days and are under review" },
                    ]}
                  />
                </Panel>
                <Panel eyebrow="Action history" title="Campaign Action Log" meta="Recent actions">
                  <DataTable
                    columns={[
                      { key: "action", header: "Action" },
                      { key: "platform", header: "Platform" },
                      { key: "object", header: "Object" },
                      { key: "status", header: "Status" },
                    ]}
                    rows={[
                      { id: "a", action: "Bulk create plans", platform: "Rednote", object: "Coach_XHS_01", status: <StatusBadge status="Pending">Pending confirmation</StatusBadge> },
                      { id: "b", action: "Adjust daily budget", platform: "Rednote", object: "23 units", status: <StatusBadge status="Success">Success</StatusBadge> },
                      { id: "c", action: "Sync plan status", platform: "Douyin", object: "12 plans", status: <StatusBadge status="Syncing">Syncing</StatusBadge> },
                    ]}
                  />
                </Panel>
              </div>
            </div>
          ) : null}
          {section === "assets" ? (
            <div className="mh-stack">
              <ViewHeading eyebrow="Campaign workspace / Assets" title="Creative Assets" description="Manage creative review status, channel readiness, and creative performance.">
                <span className="mh-health">7,017 creatives</span>
              </ViewHeading>
              <Panel eyebrow="Creative library" title="Creative Status Dashboard" meta="Channel readiness">
                <DataTable
                  columns={[
                    { key: "group", header: "Creative Group" },
                    { key: "channel", header: "Channel" },
                    { key: "ready", header: "Ready" },
                    { key: "review", header: "In Review" },
                    { key: "replace", header: "Replace" },
                  ]}
                  rows={[
                    { id: "1", group: "Tabby 26SS seeding assets", channel: "Rednote", ready: <span className="mh-count mh-count--good">128</span>, review: "14", replace: <span className="mh-count mh-count--alert">6</span> },
                    { id: "2", group: "City limited campaign", channel: "Douyin", ready: <span className="mh-count mh-count--good">72</span>, review: "8", replace: <span className="mh-count mh-count--alert">3</span> },
                    { id: "3", group: "Member conversion assets", channel: "Rednote", ready: <span className="mh-count mh-count--good">43</span>, review: "2", replace: <span className="mh-count mh-count--alert">1</span> },
                  ]}
                />
              </Panel>
            </div>
          ) : null}
          {section === "analytics" ? (
            <div className="mh-stack">
              <ViewHeading eyebrow="Campaign workspace / Analytics" title="Analytics Center" description="Analyze execution efficiency, account performance, plan quality, and creative performance.">
                <span className="mh-health">
                  <i /> Insights ready
                </span>
              </ViewHeading>
              <div className="mh-campaign__split">
                <Panel eyebrow="Human efficiency" title="Efficiency Lift" meta="Current cycle">
                  <TaskList
                    items={[
                      { status: "Success", title: "Time saved", detail: "42h" },
                      { status: "Success", title: "Automated actions", detail: "83" },
                      { status: "Review", title: "Anomaly blocks", detail: "9" },
                    ]}
                  />
                </Panel>
                <Panel eyebrow="Next best actions" title="Optimization Recommendations" meta="2 recommendations">
                  <TaskList
                    items={[
                      { status: "Pending", title: "Budget reallocation", detail: "Move Chengdu search budget to Shanghai feed promotion" },
                      { status: "Pending", title: "Creative replacement", detail: "Replace 3 low-engagement creatives with high-save-rate versions" },
                    ]}
                  />
                </Panel>
              </div>
            </div>
          ) : null}
          {section === "accounts" ? (
            <div className="mh-stack">
              <ViewHeading eyebrow="Campaign workspace / Account binding" title="Account Binding" description="Manage media account authorization, token status, and publishing permissions.">
                <Button variant="primary" onClick={onBindAccount}>
                  Bind New Account
                </Button>
              </ViewHeading>
              <Panel eyebrow="OAuth / API" title="Media Account Status" meta="Authorization health">
                <DataTable
                  columns={[
                    { key: "account", header: "Account" },
                    { key: "platform", header: "Platform" },
                    { key: "auth", header: "Auth Status" },
                    { key: "sync", header: "Last Sync" },
                    { key: "permission", header: "Action Permission" },
                  ]}
                  rows={[
                    { id: "1", account: "Coach_XHS_01", platform: "Rednote", auth: <StatusBadge status="Success">Token valid</StatusBadge>, sync: "2026-05-29 10:00", permission: "Allowed" },
                    { id: "2", account: "Coach_XHS_02", platform: "Rednote", auth: <StatusBadge status="Success">Token valid</StatusBadge>, sync: "2026-05-29 10:00", permission: "Allowed" },
                    { id: "3", account: "Coach_DY_01", platform: "Douyin", auth: <StatusBadge status="Pending">Renewal required</StatusBadge>, sync: "2026-05-28 18:20", permission: <StatusBadge status="Paused">Paused</StatusBadge> },
                  ]}
                />
              </Panel>
            </div>
          ) : null}
        </main>
      </div>
      {assistantOpen ? null : <AssistantLauncher onOpen={onOpenAssistant} />}
      <AssistantPanel open={assistantOpen} {...ASSISTANT} prompt={prompt} onClose={onCloseAssistant} onPromptChange={onPromptChange} onSubmit={onSubmit} />
    </Shell>
  );
}
