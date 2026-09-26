import "../../tokens.css";
import React from "react";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { AssistantPanel } from "../../components/AssistantPanel/index.jsx";
import { FilterPills } from "../../components/FilterPills/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { ModelFlowDialog } from "../../components/ModelFlowDialog/index.jsx";
import { Tabs } from "../../components/Tabs/index.jsx";
import { ActionCard } from "../../features/self-service/ActionCard/index.jsx";
import { UploadHistory } from "../../features/self-service/UploadHistory/index.jsx";
import { Shell } from "../../pages/Shell/index.jsx";
import "./SelfServicePage.css";


/**
 * Self-Service Center: analysis/upload tabs, category pills, entry cards.
 * @param {object} props
 * @param {string} [props.current] nav id for aria-current; the original self-service page marks no item
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {object} [props.hero={}] Hero props
 * @param {Array<{ id: string, label: string }>} [props.tabs=[]]
 * @param {{ tabAria: string, analysisFilterAria: string, uploadFilterAria: string }} props.labels Accessible names for the page tabs and each filter group.
 * @param {{ analysis?: Array<object>, upload?: Array<object> }} [props.filters={}] pills per tab id
 * @param {Array<object>} [props.reports=[]] ActionCard props for the analysis tab
 * @param {Array<object>} [props.uploads=[]] ActionCard props for the upload tab; items may carry `history` rows for the upload-history dialog
 * @param {{ open?: boolean, title?: string, rows?: Array<object>, emptyMessage?: string }} [props.uploadHistory={}] upload-history dialog state
 * @param {object} [props.assistant={}] AssistantPanel data, state and named callbacks; `onOpen` opens from the launcher
 * @param {object} [props.skillFlow] ModelFlowDialog props for the assistant skill actions
 * @param {"analysis"|"upload"} [props.tab="analysis"]
 * @param {string} [props.category="all"]
 * @param {(target: object) => void} [props.onNavigate]
 * @param {(event: { id: string, label: string }) => void} [props.onTabChange]
 * @param {(event: { id: string, label: string }) => void} [props.onCategoryChange]
 * @param {(target: { title: string, href?: string }) => void} [props.onOpen]
 * @param {(target: { item: object }) => void} [props.onOpenHistory]
 * @param {(event: { reason: "scrim"|"escape"|"button" }) => void} [props.onCloseHistory]
 * @param {(row: object) => void} [props.onPreviewFile]
 * @param {(row: object) => void} [props.onDownloadFile]
 */
export function SelfServicePage({
  current,
  logo,
  navigation = [],
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
  const assistantLauncherRef = React.useRef(null);
  const source = tab === "upload" ? uploads : reports;
  const items = source.filter((item) => category === "all" || item.category === category);
  return (
    <Shell>
      <Header logo={logo} items={navigation} current={current} density="comfortable" onNavigate={onNavigate} />
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
              onOpen={onOpen}
              onShowHistory={item.history ? () => onOpenHistory?.({ item }) : undefined}
            />
          ))}
        </div>
      </main>
      <AssistantLauncher ref={assistantLauncherRef} hidden={assistant.open} onOpen={assistant.onOpen} />
      <AssistantPanel
        {...assistant}
        returnFocusRef={assistantLauncherRef}
        placement="drawer"
        variant="campaign"
      />
      {skillFlow?.step ? <ModelFlowDialog {...skillFlow} /> : null}
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
