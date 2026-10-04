import "../../tokens.css";
import React from "react";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { Button } from "../../components/Button/index.jsx";
import { ColumnChart } from "../../components/ColumnChart/index.jsx";
import { DataTable } from "../../components/DataTable/index.jsx";
import { FormField } from "../../components/FormField/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
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

export const campaignSections = ["overview", "execution", "assets", "analytics", "accounts"];
export const campaignChannels = ["rednote", "douyin"];

/**
 * RedNote Campaign Tool: rail-navigated sections (overview, execution, assets,
 * analytics, accounts) plus the assistant drawer. All section data arrives via
 * props; the original switches sections via location.hash.
 * @param {object} props
 * @param {string} [props.current="campaign"] Active nav id. // 当前导航 id。
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {Array<object>} [props.navigation=[]] Header links. // 页头链接。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState} [props.assistant={}] Assistant copy, state, and callbacks. // 助手的文案、状态和回调。
 * @param {object} [props.rail={ items: [] }] Left rail items and labels. // 左侧栏的条目和文案。
 * @param {Array<{ id: string, label: string }>} [props.channels=[]] Channel tabs on overview. // 概览上的渠道标签。
 * @param {Array<object>} [props.metrics=[]] Metric blocks on overview. // 概览上的指标块。
 * @param {Array<object>} [props.distribution=[]] Distribution list items. // 分布列表的条目。
 * @param {Array<object>} [props.objectives=[]] Objective chart items. // 目标图表的条目。
 * @param {Array<object>} [props.accountColumns=[]] Account table columns. // 账户表的列。
 * @param {Array<object>} [props.accountRows=[]] Account table rows. // 账户表的行。
 * @param {{ channelViewAria: string, objectiveChartAria: string, accountSearch: string, filterLabel: string, resetLabel: string, accountCaption: (count: number) => string }} props.labels Page control copy and accessible names. // 页面控件文案和无障碍名称。
 * @param {Object<string, { eyebrow?: string, title?: string, description?: string, action?: string, badge?: string, status?: string }>} [props.headings={}] Per-section headings and action copy. // 各分区的标题和操作文案。
 * @param {Object<string, object>} [props.panels={}] Per-section panel copy. // 各分区面板的文案。
 * @param {Array<object>} [props.executionSummary=[]] Execution summary items. // 执行摘要的条目。
 * @param {Array<object>} [props.taskQueue=[]] Task queue items. // 任务队列的条目。
 * @param {{ columns: Array<object>, rows: Array<object> }} [props.actionLog] Action log table. // 操作日志表。
 * @param {Array<object>} [props.creativeColumns=[]] Creative table columns. // 素材表的列。
 * @param {Array<object>} [props.creatives=[]] Creative table rows. // 素材表的行。
 * @param {Array<object>} [props.efficiency=[]] Efficiency list items. // 效率列表的条目。
 * @param {Array<object>} [props.recommendations=[]] Recommendation cards. // 推荐卡片。
 * @param {Array<object>} [props.bindingColumns=[]] Account binding columns. // 账户绑定表的列。
 * @param {Array<object>} [props.accounts=[]] Account binding rows. // 账户绑定表的行。
 * @param {{ eyebrow?: string, title?: string, description?: string, fields?: { actionLabel?: string, actions?: Array<string|object>, platformLabel?: string, platforms?: Array<string|object>, accountLabel?: string, accounts?: Array<string|object> }, object?: { label?: string, value?: string }, preview?: { eyebrow?: string, state?: string, note?: string }, cancelLabel?: string, submitLabel?: string }} [props.taskDialog={}] Create Campaign Task dialog fields and action copy. // Create Campaign Task 对话框的字段和操作文案。
 * @param {boolean} [props.taskDialogOpen=false] Set true to open the Create Campaign Task dialog. // 设为 true 时打开 Create Campaign Task 对话框。
 * @param {{ action: string, platform: string, account: string, object: string }} props.taskDraft Controlled draft values. The demo hook keeps them after the dialog closes. // 受控的草稿值。demo hook 会在对话框关闭后保留它们。
 * @param {(event: { name: string, value: string, draft: object }) => void} [props.onTaskDraftChange] The function runs at each change in the task dialog. The result has `name`, `value`, and the next full `draft`. // 任务对话框每次变化都会调用这个函数。结果里有 `name`、`value`，以及下一版完整的 `draft`。
 * @param {{ open?: boolean, message?: string }} [props.toast={}] Toast after a submitted task. // 提交任务后的 Toast。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model dialog props. The dialog shows when `skillFlow.step` is set. // 建模对话框的 props。设置了 `skillFlow.step` 时显示对话框。
 * @param {"overview"|"execution"|"assets"|"analytics"|"accounts"} [props.section="overview"] Active campaign workspace. // 当前的 Campaign 工作区。
 * @param {"rednote"|"douyin"} [props.channel="rednote"] Source channel on overview. Douyin stays disabled. // 概览上的来源渠道。Douyin 保持禁用。
 * @param {string} [props.query=""] Account search text. // 账户搜索文字。
 * @param {(target: object) => void} [props.onNavigate] The function runs when a nav link opens another page. // 导航要打开另一页时，会调用这个函数。
 * @param {(event: { id: string, label: string }) => void} [props.onSectionChange] The function runs when the user selects a rail section. The result has `id` and `label`. // 用户选择侧栏分区时，会调用这个函数。结果里有 `id` 和 `label`。
 * @param {(event: { id: string, label: string }) => void} [props.onChannelChange] The function runs when the user selects a channel tab. The result has `id` and `label`. // 用户选择渠道标签时，会调用这个函数。结果里有 `id` 和 `label`。
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange] The function runs at each change in the account search. The result has `name` and `value`. // 账户搜索每次变化都会调用这个函数。结果里有 `name` 和 `value`。
 * @param {(target: { query: string }) => void} [props.onFilter] The function runs when the user submits the account search. The result has `query`. // 用户提交账户搜索时，会调用这个函数。结果里有 `query`。
 * @param {(event: { reason: "button" }) => void} [props.onReset] The function runs when the user resets the account search. // 用户重置账户搜索时，会调用这个函数。
 * @param {(event: { reason: "button" }) => void} [props.onCreateTask] The function runs when the user opens Create Campaign Task. // 用户打开 Create Campaign Task 时，会调用这个函数。
 * @param {(event: { reason: "button" }) => void} [props.onBindAccount] The function runs when the user starts Bind Account. // 用户启动 Bind Account 时，会调用这个函数。
 * @param {(event: { reason: "scrim"|"escape"|"button"|"cancel" }) => void} [props.onCloseTask] The function runs when the user closes the task dialog. The result has `reason`. // 用户关闭任务对话框时，会调用这个函数。结果里有 `reason`。
 * @param {(event: { action: string, platform: string, account: string, object: string }) => void} [props.onSubmitTask] The function runs when the user submits a task. The result has `action`, `platform`, `account`, and `object`. // 用户提交任务时，会调用这个函数。结果里有 `action`、`platform`、`account` 和 `object`。
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
  labels,
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
}) {
  const draft = taskDraft || { action: "", platform: "", account: "", object: "" };
  const updateTaskDraft = (name, value) => {
    const next = { ...draft, [name]: value };
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
  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} density="comfortable" onNavigate={onNavigate} />
      <div className="mh-campaign">
        <CampaignRail {...rail} current={section} onSelect={onSectionChange} />
        <main>
          {section === "overview" ? (
            <>
              <SectionHeading variant="view" eyebrow={overviewHeading.eyebrow} title={overviewHeading.title} description={overviewHeading.description}>
                <Tabs label={labels.channelViewAria} variant="segmented" items={channels} value={channel} onChange={onChannelChange} />
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
                  <ColumnChart label={labels.objectiveChartAria} items={objectives} />
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
                      <SearchField label={labels.accountSearch} value={query} placeholder={labels.accountSearch} size="sm" icon="none" onChange={onQueryChange} />
                      <Button variant="primary" size="sm" type="submit">
                        {labels.filterLabel}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => onReset?.({ reason: "button" })}>
                        {labels.resetLabel}
                      </Button>
                    </form>
                  }
                >
                  <DataTable columns={accountColumns} rows={visibleAccounts} caption={labels.accountCaption(visibleAccounts.length)} />
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
      <AssistantDock assistant={assistant} skillFlow={skillFlow} />
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
            <FormField label={taskDialog.fields?.actionLabel} name="action" control="select" options={taskDialog.fields?.actions || []} value={draft.action} onChange={(event) => updateTaskDraft("action", event.value)} />
            <FormField label={taskDialog.fields?.platformLabel} name="platform" control="select" options={taskDialog.fields?.platforms || []} value={draft.platform} onChange={(event) => updateTaskDraft("platform", event.value)} />
            <FormField label={taskDialog.fields?.accountLabel} name="account" control="select" options={taskDialog.fields?.accounts || []} value={draft.account} onChange={(event) => updateTaskDraft("account", event.value)} />
            <FormField label={taskDialog.object?.label} name="object" value={draft.object} onChange={(event) => updateTaskDraft("object", event.value)} />
          </div>
          <div className="mh-task-dialog__preview">
            <span>{taskDialog.preview?.eyebrow}</span>
            <strong>{taskDialog.preview?.state}</strong>
            <small>{taskDialog.preview?.note}</small>
          </div>
          <footer className="mh-task-dialog__footer">
            <Button variant="secondary" onClick={() => onCloseTask?.({ reason: "cancel" })}>
              {taskDialog.cancelLabel}
            </Button>
            <Button variant="primary" type="submit">
              {taskDialog.submitLabel}
            </Button>
          </footer>
        </form>
      </Modal>
      <Toast open={toast.open} message={toast.message} />
    </Shell>
  );
}
