import "../../tokens.css";
import React from "react";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { Toast } from "../../components/Toast/index.jsx";
import { cx } from "../../cx.js";
import { BusinessTermView } from "../../features/interpreter/BusinessTermView/index.jsx";
import { DataModelView } from "../../features/interpreter/DataModelView/index.jsx";
import { FieldLibraryView } from "../../features/interpreter/FieldLibraryView/index.jsx";
import { KnowledgeSidebar } from "../../features/interpreter/KnowledgeSidebar/index.jsx";
import { PrinciplesView } from "../../features/interpreter/PrinciplesView/index.jsx";
import { ScenarioReportsView } from "../../features/interpreter/ScenarioReportsView/index.jsx";
import { TypeGrid } from "../../features/interpreter/TypeGrid/index.jsx";
import { useSearchShortcut } from "../../lib/search-shortcut.js";
import { Shell } from "../../pages/Shell/index.jsx";
import "./AiInterpreterPage.css";

/* Dedicated views register by type.view. The demo hook supplies only the active view. */
const typeViews = {
  principles: PrinciplesView,
  "business-term": BusinessTermView,
  "data-model": DataModelView,
  "field-library": FieldLibraryView,
  "scenario-reports": ScenarioReportsView,
};

/** @typedef {Partial<Parameters<typeof PrinciplesView>[0]> | Partial<Parameters<typeof BusinessTermView>[0]> | Partial<Parameters<typeof DataModelView>[0]> | Partial<Parameters<typeof FieldLibraryView>[0]> | Partial<Parameters<typeof ScenarioReportsView>[0]>} AiInterpreterView Props of whichever registered view is active. */

/**
 * AI Interpreter knowledge workspace. A composing engineer sets the header,
 * the header image area, the metric blocks, the type list, and the assistant.
 * @param {object} props
 * @param {string} [props.current="interpreter"] Active nav id. AI Interpreter does not underline the current item. // 当前导航 id。AI Interpreter 不为当前项加下划线。
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {Array<object>} [props.navigation=[]] Header links. // 页头链接。
 * @param {(id:string,params?: Record<string,string>)=>string} props.hrefFor Function that turns a route id into an href. The story or host supplies it. // 把路由 id 转成 href 的函数。由故事或宿主提供。
 * @param {object} [props.hero={}] Header image area props. `stats` is an array of MetricStat props. // 头图区的 props。`stats` 是 MetricStat props 的数组。
 * @param {{ id: string, label: string, icon?: string }} props.overviewItem Overview item in the left sidebar. // 左侧侧栏里的概览项。
 * @param {string} [props.sidebarTitle] Title above the knowledge types in the sidebar. // 侧栏知识类型列表上方的标题。
 * @param {Array<object>} [props.types=[]] Knowledge type entries (id, title, icon, summary, action, manageable, createLabel, stats, view). // 知识类型条目（id、title、icon、summary、action、manageable、createLabel、stats、view）。
 * @param {AiInterpreterView} [props.view] Props for the active registered type (`view` in its `types` entry). Other views ignore them. // 当前激活的已注册类型的 props（其 `types` 条目中的 `view`）。其他视图会忽略它们。
 * @param {React.ReactNode} [props.overlay] Overlay slot from the demo hook or host. // 由 demo hook 或宿主提供的覆盖层插槽。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState} [props.assistant={}] Assistant content, state, and callbacks for this workspace. // 这个工作台的助手内容、状态和回调。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model dialog state and callbacks for skill menu actions. // 技能菜单操作所用的建模对话框状态和回调。
 * @param {string} [props.toast=""] Short success message. Empty hides it. // 简短成功消息。为空则隐藏。
 * @param {string} [props.activeType="overview"] "overview", a type id, or an unknown id. An unknown id shows an empty state. // "overview"、某个类型 id，或未知 id。未知 id 会显示空状态。
 * @param {{unknown: {typeTitle: string, typeDescription: Function, viewTitle: string}, stats: {fallbackUnit: string, publishedLabel: string, monthlyLabel: string, governedCaption: Function, addedCaption: Function}, heroAsideLabel: Function, management: {triggerLabel: string, title: string, rules: string[]}, assistantLabel: string}} props.copy Shell copy from the host. // 由宿主提供的页壳文案。
 * @param {(target: { id:string, params: Record<string,string>, href:string, typeId:string }) => void} [props.onNavigate] The function runs when a link opens another page. // 链接要打开另一页时会调用这个函数。
 * @param {(event: { id: string, label: string, typeId: string }) => void} [props.onSelectType] The function runs when a knowledge type is selected. // 选中一种知识类型时会调用这个函数。
 */
export function AiInterpreterPage({
  current = "interpreter",
  logo,
  navigation = [],
  hrefFor,
  hero = { stats: [] },
  overviewItem,
  sidebarTitle,
  types = [],
  view = {},
  overlay = null,
  assistant = {},
  skillFlow,
  toast = "",
  activeType = "overview",
  copy,
  onNavigate,
  onSelectType,
}) {
  const overview = activeType === "overview" || !activeType;
  const type = types.find((item) => item.id === activeType);
  const known = overview || Boolean(type);
  const searchRef = React.useRef(null);
  const rootRef = React.useRef(null);
  const rulesHintId = React.useId();

  // types.js: "/" and Cmd/Ctrl+K focus the visible search field on type pages;
  // instance-scoped so two mounted pages never both steal the keypress.
  useSearchShortcut({ enabled: !overview && known, searchRef, rootRef });

  // renderHeroStats: labels stay static; values/captions follow the active type,
  // singularizing the unit when its own value is 1 ("1 model governed…").
  const unit = type?.stats?.units?.[1] || copy.stats.fallbackUnit;
  const captionUnit = (value) => (value === 1 && unit.endsWith("s") ? unit.slice(0, -1) : unit);
  const heroStats = type
    ? [
        { label: copy.stats.publishedLabel, value: type.stats.total.toLocaleString(), caption: copy.stats.governedCaption({ unit: captionUnit(type.stats.total) }) },
        { label: copy.stats.monthlyLabel, value: type.stats.monthly.toLocaleString(), caption: copy.stats.addedCaption({ unit: captionUnit(type.stats.monthly) }) },
      ]
    : hero.stats || [];
  const heroProps = type ? { ...hero, title: type.title, description: type.summary } : hero;

  const View = type ? typeViews[type.view] : undefined;
  const selectType = (event) => {
    onSelectType?.({ ...event, typeId: activeType });
    const params = event.id === "overview" ? {} : { type: event.id };
    onNavigate?.({ id: "interpreter", params, href: hrefFor("interpreter", params), typeId: activeType, label: event.label || event.title });
  };

  return (
    /* Type pages rearrange the shell like the original's
       body:has(.business-type-page) rules: the sidebar becomes a fixed rail
       from under the header to the viewport bottom and the hero compresses
       into the content column (170px, right of the rail). */
    <Shell tone="interpreter" className={type ? "mh-page--interpreter-type" : undefined}>
      <Header logo={{ ...logo, href: hrefFor("home", {}) }} items={navigation.map((item) => ({ ...item, href: hrefFor(item.id, {}) }))} current={current} highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {}, typeId: activeType })} />
      <div className="mh-page__offset" aria-hidden="true" />
      <Hero {...heroProps} height={type ? 170 : 260} variant="knowledge" scrim="knowledge" asideLabel={copy.heroAsideLabel({ typeTitle: type?.title })}>
        {heroStats.map((stat) => (
          <MetricStat key={stat.label} {...stat} variant="glass" compact />
        ))}
        {/* types.js renderManagementRulesHint: the "!" rules hint only exists
            for manageable types (Business Term / Analytical Model / Scenario). */}
        {type?.manageable ? (
          <div className="mh-rules-hint">
            <button className="mh-rules-hint__trigger" type="button" aria-label={copy.management.triggerLabel} aria-describedby={rulesHintId}>!</button>
            <section className="mh-rules-hint__tooltip" id={rulesHintId} role="tooltip">
              <h3>{copy.management.title}</h3>
              <ol>
                {copy.management.rules.map((rule, index) => <li key={index}>{rule}</li>)}
              </ol>
            </section>
          </div>
        ) : null}
      </Hero>
      <div className="mh-interpreter" ref={rootRef}>
        <KnowledgeSidebar
          overview={overviewItem}
          overviewHref={hrefFor("interpreter", {})}
          title={sidebarTitle}
          types={types}
          activeId={activeType}
          onSelect={selectType}
        />
        <div
          className={cx("mh-interpreter__main", !overview && known && "mh-interpreter__main--type")}
          data-active-type={type ? activeType : "Overview"}
        >
          {overview ? (
            <TypeGrid items={types} activeId={activeType} onSelect={selectType} />
          ) : !known ? (
            <div className="mh-empty mh-empty--unknown" role="status">
              <strong>{copy.unknown.typeTitle}</strong>
              <p>{copy.unknown.typeDescription({ typeId: activeType, count: types.length })}</p>
            </div>
          ) : View ? (
            <View searchRef={searchRef} {...view} />
          ) : (
            <div className="mh-empty mh-empty--unknown" role="status">{copy.unknown.viewTitle}</div>
          )}
        </div>
      </div>
      {overlay}
      <AssistantDock assistant={assistant} skillFlow={skillFlow} launcherLabel={copy.assistantLabel} />
      <Toast open={Boolean(toast)} message={toast} />
    </Shell>
  );
}
