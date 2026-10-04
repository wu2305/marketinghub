import "../../tokens.css";
import React from "react";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { FilterPills } from "../../components/FilterPills/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { Tabs } from "../../components/Tabs/index.jsx";
import { ActionCard } from "../../features/self-service/ActionCard/index.jsx";
import { UploadHistory } from "../../features/self-service/UploadHistory/index.jsx";
import { Shell } from "../../pages/Shell/index.jsx";
import "./SelfServicePage.css";


/**
 * Self-Service Center: analysis/upload tabs, category pills, entry cards.
 * @param {object} props
 * @param {string} [props.current] Nav id for aria-current. This page marks no item. // 用于 aria-current 的导航 id。本页不标记任何项。
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {Array<object>} [props.navigation=[]] Header links. // 页头链接。
 * @param {(id:string,params?: Record<string,string>)=>string} props.hrefFor Turns a route id into an href. The story and the host each supply this function. // 把路由 id 转成 href。故事和宿主各自提供这个函数。
 * @param {object} [props.hero={}] Header image area. // 头图区。
 * @param {Array<{ id: string, label: string }>} [props.tabs=[]] Analysis and Data Upload tabs. // Analysis 和 Data Upload 标签。
 * @param {{ tabAria: string, analysisFilterAria: string, uploadFilterAria: string }} props.labels Accessible names for the page tabs and each filter group. // 页面标签及各筛选组的无障碍名称。
 * @param {{ analysis?: Array<object>, upload?: Array<object> }} [props.filters={}] Filter pills for each tab id. // 每个标签 id 对应的筛选胶囊。
 * @param {Array<object>} [props.reports=[]] Action cards on the Analysis tab. // Analysis 标签上的入口卡片。
 * @param {Array<object>} [props.uploads=[]] Action cards on the Data Upload tab. An item may carry `history` rows for the upload-history dialog. // Data Upload 标签上的入口卡片。条目可携带 `history` 行，用于上传历史对话框。
 * @param {{ open?: boolean, title?: string, rows?: Array<object>, emptyMessage?: string }} [props.uploadHistory={}] Upload-history dialog state. // 上传历史对话框的状态。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState} [props.assistant={}] Assistant copy, state, and callbacks. `onOpen` opens from the launcher. // 助手的文案、状态和回调。`onOpen` 从启动器打开。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model dialog props for the assistant skill actions. // 助手技能操作用的建模对话框 props。
 * @param {"analysis"|"upload"} [props.tab="analysis"] Active section. // 当前分区。
 * @param {string} [props.category="all"] Active filter pill. // 当前筛选胶囊。
 * @param {(target: { id:string, params: Record<string,string>, href:string, label?:string }) => void} [props.onNavigate] The function runs when a link opens another page. The result has `id`, `params`, and `href`. // 链接要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。
 * @param {(event: { id: string, label: string }) => void} [props.onTabChange] The function runs when the user selects Analysis or Data Upload. The result has `id` and `label`. // 用户选择 Analysis 或 Data Upload 时，会调用这个函数。结果里有 `id` 和 `label`。
 * @param {(event: { id: string, label: string }) => void} [props.onCategoryChange] The function runs when the user selects a filter pill. The result has `id` and `label`. // 用户选择筛选胶囊时，会调用这个函数。结果里有 `id` 和 `label`。
 * @param {(target: { title: string, href?: string }) => void} [props.onOpen] The function runs when a card opens a destination. The result has `title` and may have `href`. // 卡片要打开目的地时，会调用这个函数。结果里有 `title`，也可能有 `href`。
 * @param {(target: { item: object }) => void} [props.onOpenHistory] The function runs when the user opens upload history. The result has `item`. // 用户打开上传历史时，会调用这个函数。结果里有 `item`。
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onCloseHistory] The function runs when the user closes upload history. The result has `reason`. // 用户关闭上传历史时，会调用这个函数。结果里有 `reason`。
 * @param {(row: object) => void} [props.onPreviewFile] The function runs when the user previews a history file. The result is the row. // 用户预览历史上的文件时，会调用这个函数。结果就是该行。
 * @param {(row: object) => void} [props.onDownloadFile] The function runs when the user downloads a history file. The result is the row. // 用户下载历史上的文件时，会调用这个函数。结果就是该行。
 */
export function SelfServicePage({
  current,
  logo,
  navigation = [],
  hrefFor,
  hero = {},
  tabs = [],
  labels,
  filters = {},
  reports = [],
  uploads = [],
  uploadHistory = {},
  assistant = {},
  skillFlow,
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
      <Header logo={{ ...logo, href: hrefFor("home", {}) }} items={navigation.map((item) => ({ ...item, href: hrefFor(item.id, {}) }))} current={current} density="comfortable" onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
      <div className="mh-page__offset" aria-hidden="true" />
      <Hero {...hero} height={260} variant="banner" scrim="none" />
      <main className="mh-page__shell mh-page__shell--self">
        <div className="mh-self-tools">
          <Tabs label={labels.tabAria} items={tabs} value={tab} onChange={onTabChange} />
          <FilterPills label={tab === "upload" ? labels.uploadFilterAria : labels.analysisFilterAria} items={filters[tab] || []} value={category} onChange={onCategoryChange} />
        </div>
        <div className={tab === "upload" ? "mh-page__cards mh-page__cards--upload" : "mh-page__cards mh-page__cards--two"}>
          {items.map((item) => (
            <ActionCard
              key={item.title}
              {...item}
              href={item.target ? hrefFor(item.target.id, item.target.params || {}) : item.href}
              onOpen={(event) => {
                onOpen?.(event);
                if (item.target) onNavigate?.({ ...item.target, params: item.target.params || {}, href: hrefFor(item.target.id, item.target.params || {}), label: item.title });
              }}
              onShowHistory={item.history ? () => onOpenHistory?.({ item }) : undefined}
            />
          ))}
        </div>
      </main>
      <AssistantDock assistant={assistant} skillFlow={skillFlow} />
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
