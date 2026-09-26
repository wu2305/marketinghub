import "../../tokens.css";
import React from "react";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { AssistantPanel } from "../../components/AssistantPanel/index.jsx";
import { Button } from "../../components/Button/index.jsx";
import { ColumnChart } from "../../components/ColumnChart/index.jsx";
import { DataTable } from "../../components/DataTable/index.jsx";
import { FormField } from "../../components/FormField/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
import { ModelFlowDialog } from "../../components/ModelFlowDialog/index.jsx";
import { ProgressList } from "../../components/ProgressList/index.jsx";
import { SearchField } from "../../components/SearchField/index.jsx";
import { StatusBadge } from "../../components/StatusBadge/index.jsx";
import { Tabs } from "../../components/Tabs/index.jsx";
import { Toast } from "../../components/Toast/index.jsx";
import { SectionHeading } from "../../components/SectionHeading/index.jsx";
import { CampaignRail } from "../../features/campaign/CampaignRail/index.jsx";
import { Panel } from "../../features/campaign/Panel/index.jsx";
import { SummaryStrip } from "../../features/campaign/SummaryStrip/index.jsx";
import { TaskList } from "../../features/campaign/TaskList/index.jsx";
import { Shell } from "../../pages/Shell/index.jsx";
import "./CampaignPage.css";


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
 * @param {{ action?: string, platform?: string, account?: string, object?: string }} [props.taskDraft] controlled draft values; omit to let the page keep its own draft
 * @param {(event: { name: string, value: string, draft: object }) => void} [props.onTaskDraftChange] field edits; `draft` is the next full draft
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
 * @param {(event: { reason: "button" }) => void} [props.onCreateTask]
 * @param {(event: { reason: "button" }) => void} [props.onBindAccount]
 * @param {(event: { reason: "scrim"|"escape"|"button"|"cancel" }) => void} [props.onCloseTask]
 * @param {(event: { action: string, platform: string, account: string, object: string }) => void} [props.onSubmitTask]
 * @param {boolean} [props.assistantOpen=false]
 * @param {string} [props.prompt=""]
 * @param {() => void} [props.onOpenAssistant]
 * @param {(event: { reason: string }) => void} [props.onCloseAssistant]
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
  taskDraft,
  onTaskDraftChange,
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
  /* The original task dialog is a native <dialog> whose form is never reset —
     cancel/×/backdrop/Escape and even a successful submit all keep the field
     values. The draft therefore lives on the page (surviving Modal unmounts),
     uncontrolled by default; `taskDraft` + `onTaskDraftChange` let a host take
     over. */
  const firstOption = (options) => {
    const first = options?.[0];
    return typeof first === "object" && first !== null ? first.value : first || "";
  };
  const taskDefaults = {
    action: firstOption(taskDialog.fields?.actions),
    platform: firstOption(taskDialog.fields?.platforms),
    account: firstOption(taskDialog.fields?.accounts),
    object: taskDialog.object?.value || "",
  };
  const [localTaskDraft, setLocalTaskDraft] = React.useState(taskDefaults);
  const draft = taskDraft !== undefined ? taskDraft : localTaskDraft;
  const updateTaskDraft = (name, value) => {
    const next = { ...draft, [name]: value };
    if (taskDraft === undefined) setLocalTaskDraft(next);
    onTaskDraftChange?.({ name, value, draft: next });
  };
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
  const assistantLauncherRef = React.useRef(null);
  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} density="comfortable" onNavigate={onNavigate} />
      <div className="mh-campaign">
        <CampaignRail {...rail} current={section} onSelect={onSectionChange} />
        <main>
          {section === "overview" ? (
            <>
              <SectionHeading variant="view" eyebrow={overviewHeading.eyebrow} title={overviewHeading.title} description={overviewHeading.description}>
                <Tabs label="Channel view" variant="segmented" items={channels} value={channel} onChange={onChannelChange} />
              </SectionHeading>
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
                      <Button variant="secondary" size="sm" onClick={() => onReset?.({ reason: "button" })}>
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
              <SectionHeading variant="view" eyebrow={executionHeading.eyebrow} title={executionHeading.title} description={executionHeading.description}>
                <Button variant="primary" onClick={() => onCreateTask?.({ reason: "button" })}>
                  {executionHeading.action}
                </Button>
              </SectionHeading>
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
              <SectionHeading variant="view" eyebrow={assetsHeading.eyebrow} title={assetsHeading.title} description={assetsHeading.description}>
                <span className="mh-health">{assetsHeading.badge}</span>
              </SectionHeading>
              <Panel eyebrow={creativePanel.eyebrow} title={creativePanel.title} meta={creativePanel.meta}>
                <DataTable columns={creativeColumns} rows={creativeRows} />
              </Panel>
            </div>
          ) : null}
          {section === "analytics" ? (
            <div className="mh-stack">
              <SectionHeading variant="view" eyebrow={analyticsHeading.eyebrow} title={analyticsHeading.title} description={analyticsHeading.description}>
                <span className="mh-health">
                  <i /> {analyticsHeading.status}
                </span>
              </SectionHeading>
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
              <SectionHeading variant="view" eyebrow={accountsHeading.eyebrow} title={accountsHeading.title} description={accountsHeading.description}>
                <Button variant="primary" onClick={() => onBindAccount?.({ reason: "button" })}>
                  {accountsHeading.action}
                </Button>
              </SectionHeading>
              <Panel eyebrow={bindingPanel.eyebrow} title={bindingPanel.title} meta={bindingPanel.meta}>
                <DataTable columns={bindingColumns} rows={bindingRows} />
              </Panel>
            </div>
          ) : null}
        </main>
      </div>
      <AssistantLauncher ref={assistantLauncherRef} hidden={assistantOpen} onOpen={onOpenAssistant} />
      <AssistantPanel
        open={assistantOpen}
        returnFocusRef={assistantLauncherRef}
        placement="drawer"
        {...assistant}
        variant="campaign"
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
            onSubmitTask?.({
              action: draft.action,
              platform: draft.platform,
              account: draft.account,
              object: draft.object,
            });
          }}
        >
          <p className="mh-task-dialog__intro">{taskDialog.description}</p>
          <div className="mh-task-dialog__grid">
            <FormField label={taskDialog.fields?.actionLabel || "Action"} name="action" control="select" options={taskDialog.fields?.actions || []} value={draft.action} onChange={(event) => updateTaskDraft("action", event.value)} />
            <FormField label={taskDialog.fields?.platformLabel || "Platform"} name="platform" control="select" options={taskDialog.fields?.platforms || []} value={draft.platform} onChange={(event) => updateTaskDraft("platform", event.value)} />
            <FormField label={taskDialog.fields?.accountLabel || "Account"} name="account" control="select" options={taskDialog.fields?.accounts || []} value={draft.account} onChange={(event) => updateTaskDraft("account", event.value)} />
            <FormField label={taskDialog.object?.label || "Object"} name="object" value={draft.object} onChange={(event) => updateTaskDraft("object", event.value)} />
          </div>
          <div className="mh-task-dialog__preview">
            <span>{taskDialog.preview?.eyebrow}</span>
            <strong>{taskDialog.preview?.state}</strong>
            <small>{taskDialog.preview?.note}</small>
          </div>
          <footer className="mh-task-dialog__footer">
            <Button variant="secondary" onClick={() => onCloseTask?.({ reason: "cancel" })}>
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
