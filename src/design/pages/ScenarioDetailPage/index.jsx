import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { GovernanceNav } from "../../components/GovernanceNav/index.jsx";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { ScenarioDetailWorkspace, scenarioDetailTabs } from "../../features/scenario-detail/ScenarioDetailWorkspace/index.jsx";
import "./ScenarioDetailPage.css";

export { scenarioDetailTabs };

/**
 * Scenario Detail page. Page copy and the selected skill record come from the caller.
 * @param {object} props
 * @param {object} props.content Hero, navigation and six-panel visible copy. // Hero、导航与六个面板上可见的文案。
 * @param {{src:string,alt:string,href:string}} props.logo
 * @param {object[]} [props.navigation=[]] Header destinations. // 页头目的地。
 * @param {{record:object,tab:typeof scenarioDetailTabs[number],previewOpen:boolean,onTabChange?:(event:{value:string})=>void,onTogglePreview?:(event:{open:boolean})=>void}} [props.detail={}] Detail view state. // 详情视图状态。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState} [props.assistant={}] Lite assistant state and named callbacks. // 轻量助手状态与具名回调。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model flow state and callbacks. // 建模流程状态与回调。
 * @param {(id:string,params?: Record<string,string>)=>string} [props.hrefFor]
 * @param {(event:{id:string,params: Record<string,string>,href:string,label:string})=>void} [props.onNavigate]
 */
export function ScenarioDetailPage({ content, logo, navigation = [], detail = {}, assistant = {}, skillFlow, hrefFor, onNavigate }) {
  const { hero, sidebar, labels } = content;
  const { record, tab = "content", previewOpen = false, onTabChange, onTogglePreview } = detail;
  return <div className="mh-scenario-detail-page" data-scenario-id={record?.id} data-scenario-tab={tab}>
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={hero.image} eyebrow={hero.eyebrow} title={hero.title} description={hero.description} height={360} variant="home" scrim="home" asideLabel={hero.summaryAria}>
      <div className="mh-scenario-detail-page__stats">{hero.stats.map((stat) => <MetricStat key={stat.key} variant="glass" label={stat.label} value={stat.key === "likeRate" ? `${record?.likeRate ?? 0}%` : record?.[stat.key]} caption={stat.caption} />)}</div>
    </Hero>
    <div className="mh-scenario-detail-page__body"><GovernanceNav items={sidebar} current="scenario-library" navigationAria={labels.navigationAria} categoriesAria={labels.categoriesAria} hrefFor={hrefFor} onNavigate={onNavigate} /><main className="mh-scenario-detail-page__main"><ScenarioDetailWorkspace record={record} labels={labels} tab={tab} previewOpen={previewOpen} onTabChange={onTabChange} onTogglePreview={onTogglePreview} hrefFor={hrefFor} onNavigate={onNavigate} /></main></div>
    <AssistantDock assistant={assistant} skillFlow={skillFlow} variant="lite" />
  </div>;
}
