import "../../tokens.css";
import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { GovernanceNav } from "../../components/GovernanceNav/index.jsx";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { Toast } from "../../components/Toast/index.jsx";
import { ScenarioEditForm } from "../../features/scenario-edit/ScenarioEditForm/index.jsx";
import "./ScenarioEditPage.css";

/**
 * Controlled Skill Edit page; stories and host supply all source-backed content and flow state.
 * @param {object} props
 * @param {object} props.content Header image area, sidebar, form labels and options, and default values. // 头图区、侧栏、表单标签和选项，以及默认值。
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {object[]} [props.navigation=[]] Header links. // 页头链接。
 * @param {object} [props.form={}] Form values, validation, preview, and named callbacks. // 表单的值、校验、预览和具名回调。
 * @param {string} [props.toast=""] Message after Save Draft. Hidden when empty. // Save Draft 之后的消息。为空时隐藏。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState} [props.assistant={}] Lite assistant copy, state, and callbacks. // 轻量助手的文案、状态和回调。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model dialog copy, state, and callbacks. // 建模对话框的文案、状态和回调。
 * @param {(id:string,params?: Record<string,string>)=>string} [props.hrefFor] Turns a route id into an href. // 把路由 id 转成 href。
 * @param {(event:{id:string,params: Record<string,string>,href:string,label:string})=>void} [props.onNavigate] The function runs when a link opens another page. The result has `id`, `params`, `href`, and `label`. // 链接要打开另一页时，会调用这个函数。结果里有 `id`、`params`、`href` 和 `label`。
 */
export function ScenarioEditPage({ content, logo, navigation = [], form = {}, toast = "", assistant = {}, skillFlow, hrefFor, onNavigate }) {
  const { hero, sidebar, labels } = content;
  return <div className="mh-scenario-edit-page">
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
    <Hero image={hero.image} eyebrow={hero.eyebrow} title={hero.title} description={hero.description} asideLabel={hero.asideLabel} height={360} variant="home" scrim="home"><div className="mh-scenario-edit-page__stats">{hero.stats.map((stat) => <MetricStat key={stat.key} label={stat.label} value={stat.value} caption={stat.caption} variant="glass" />)}</div></Hero>
    <div className="mh-scenario-edit-page__body">
      <GovernanceNav items={sidebar} current="scenario-library" navigationAria={labels.navigationAria} categoriesAria={labels.categoriesAria} hrefFor={hrefFor} onNavigate={onNavigate} />
      <main className="mh-scenario-edit-page__main"><ScenarioEditForm content={content} {...form} hrefFor={hrefFor} onNavigate={onNavigate} /></main>
    </div>
    <AssistantDock assistant={assistant} skillFlow={skillFlow} variant="lite" />
    <Toast open={Boolean(toast)} message={toast} />
  </div>;
}
