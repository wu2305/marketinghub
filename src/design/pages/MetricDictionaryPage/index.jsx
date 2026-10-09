import React from "react";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { SearchField } from "../../components/SearchField/index.jsx";
import { Switch } from "../../components/Switch/index.jsx";
import { StatusBadge } from "../../components/StatusBadge/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { DerivedMetricPanel } from "../../features/metric-dictionary/DerivedMetricPanel/index.jsx";
import { Shell } from "../Shell/index.jsx";
import "./MetricDictionaryPage.css";

/** @type {readonly ["Basic", "Derived"]} */
export const metricCategories = ["Basic", "Derived"];
/** @type {readonly ["definition", "formula", "dimensions"]} */
export const metricDetailTabs = ["definition", "formula", "dimensions"];

/**
 * Standalone Metric Dictionary page. All copy, records and state arrive from props.
 * @param {object} props
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {Array<{id:string,label:string,href:string}>} [props.navigation=[]] Header links. // 页头链接。
 * @param {object} props.content Header, sidebar, detail, and Add derived copy. // 页头、侧栏、详情和 Add derived 文案。
 * @param {Array<object>} [props.metrics=[]] Metric records. // 指标记录。
 * @param {typeof metricCategories[number]} [props.category="Basic"] Metric list. Values are Basic and Derived. // 指标列表。取值是 Basic 和 Derived。
 * @param {string} props.metricId Selected metric id. // 当前指标的 id。
 * @param {typeof metricDetailTabs[number]} [props.tab="definition"] Detail tab. Values are definition, formula, and dimensions. // 详情标签。取值是 definition、formula 和 dimensions。
 * @param {object} [props.derivedEditor={}] Add derived drawer. Includes `open`, `draft`, `tokens`, `constantOpen`, `notice`, and editor callbacks. // Add derived 抽屉。包含 `open`、`draft`、`tokens`、`constantOpen`、`notice` 以及编辑器回调。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState} [props.assistant={}] Lite assistant copy, state, and callbacks. // 轻量助手的文案、状态和回调。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model dialog props for the assistant skill actions. // 助手技能操作用的建模对话框 props。
 * @param {(id:string,params?: Record<string,string>)=>string} props.hrefFor Turns a route id into an href. // 把路由 id 转成 href。
 * @param {(target:{id:string,params: Record<string,string>,href:string})=>void} props.onNavigate The function runs when a crumb or a nav link opens another page. The result has `id`, `params`, and `href`. // 面包屑或导航要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。
 * @param {(event:{category:string})=>void} props.onCategoryChange The function runs when the user selects Basic or Derived. The result has `category`. // 用户选择 Basic 或 Derived 时，会调用这个函数。结果里有 `category`。
 * @param {(event:{id:string})=>void} props.onSelect The function runs when the user selects a metric. The result has `id`. // 用户选择一项指标时，会调用这个函数。结果里有 `id`。
 * @param {(event:{tab:string})=>void} props.onTabChange The function runs when the user selects a detail tab. The result has `tab`. // 用户选择详情标签时，会调用这个函数。结果里有 `tab`。
 */
export function MetricDictionaryPage({
  logo, navigation = [], content, metrics = [], category = "Basic", metricId, tab = "definition",
  derivedEditor = {}, assistant = {}, skillFlow, hrefFor, onNavigate, onCategoryChange, onSelect, onTabChange,
}) {
  const {
    open: panelOpen = false, draft = {}, tokens = [], constantOpen = false, notice = "",
    onOpen, onCancel, onDraftChange, onOperator, onReference, onRemoveToken,
    onConstantAdd, onConstantCancel, onTest, onSave,
  } = derivedEditor;
  const { header, sidebar, detail, derivedPanel } = content;
  const metric = metrics.find((entry) => entry.id === metricId) || metrics[0];
  const visible = metrics.filter((entry) => entry.category === category);
  const basic = metrics.filter((entry) => entry.category === "Basic");
  const counts = { Basic: basic.length, Derived: metrics.length - basic.length };
  const unitOptions = metric?.unit && !detail.units.includes(metric.unit) ? [...detail.units, metric.unit] : detail.units;
  const navigate = (id, params = {}) => ({ id, params, href: hrefFor(id, params) });
  const headerItems = navigation.map((item) => ({ ...item, href: hrefFor(item.id) }));
  const handleHeaderNavigate = ({ id }) => onNavigate?.(navigate(id));
  const handleBreadcrumb = (event, id, params = {}) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    onNavigate?.(navigate(id, params));
  };
  const field = (label, value, type = "text") => <label className="mh-metric-page__field"><span>{label}</span><input key={`${metric?.id}:${label}:${value}`} type={type} defaultValue={value} /></label>;
  return (
    <Shell>
      <Header logo={{ ...logo, href: hrefFor("home") }} items={headerItems} density="comfortable" position="sticky" onNavigate={handleHeaderNavigate} />
      <main className="mh-metric-page">
        <header className="mh-metric-page__header">
          <div>
            <nav className="mh-metric-page__breadcrumb" aria-label="Breadcrumb">
              <a href={hrefFor("interpreter")} onClick={(event) => handleBreadcrumb(event, "interpreter")}>{header.breadcrumb[0]}</a><span>/</span>
              <a href={hrefFor("interpreter", { type: "Metric Dictionary" })} onClick={(event) => handleBreadcrumb(event, "interpreter", { type: "Metric Dictionary" })}>{header.breadcrumb[1]}</a><span>/</span>
              <strong>{metric?.name}</strong>
            </nav>
            <h1>{metric?.name}</h1>
            <p>{metric?.desc}</p>
          </div>
          <div className="mh-metric-page__actions">
            {metric?.status ? <StatusBadge status={metric.status} size="lg" tone={metric.status === "Draft" ? "warning" : "auto"} /> : null}
            <button type="button" className="mh-metric-page__action">✎ {header.edit}</button>
            <button type="button" className="mh-metric-page__action mh-metric-page__action--primary" onClick={onOpen}>＋ {header.add}</button>
          </div>
        </header>
        <section className="mh-metric-page__banner">
          <div className="mh-metric-page__banner-icon" aria-hidden="true">◇</div>
          <div className="mh-metric-page__banner-copy"><div><strong>{header.bannerTitle}</strong><span>{header.beta}</span></div><p>{header.bannerDescription}</p></div>
          <button type="button">◇ {header.smartDefinition}</button>
        </section>
        <div className="mh-metric-page__layout">
          <aside className="mh-metric-page__sidebar">
            <div className="mh-metric-page__search"><SearchField label={sidebar.searchPlaceholder} placeholder={sidebar.searchPlaceholder} /></div>
            <div className="mh-metric-page__category-tabs">
              {metricCategories.map((item) => <button key={item} type="button" className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => onCategoryChange?.({ category: item })}>{sidebar[item.toLowerCase()]} · {counts[item]}</button>)}
            </div>
            <div className="mh-metric-page__list">
              {visible.length ? visible.map((entry) => <button type="button" key={entry.id} className={entry.id === metric?.id ? "is-active" : ""} onClick={() => onSelect?.({ id: entry.id })}><strong>{entry.name}</strong><small>{entry.owner} · {entry.unit}</small></button>) : <div className="mh-metric-page__empty">{sidebar.empty}</div>}
            </div>
            <footer className="mh-metric-page__sidebar-foot"><small>{sidebar.sourceLabel}</small><div><strong>{sidebar.sourceName}</strong><span>{sidebar.sourceStatus}</span></div><p>⟳ {sidebar.sync}</p></footer>
          </aside>
          <section className="mh-metric-page__detail" aria-label={metric?.name}>
            <header className="mh-metric-page__detail-head">
              <div className="mh-metric-page__detail-tabs">
                {metricDetailTabs.map((item) => <button key={item} type="button" className={tab === item ? "is-active" : ""} aria-pressed={tab === item} onClick={() => onTabChange?.({ tab: item })}>{detail.tabs[item]}{item === "formula" ? ` · ${detail.formulaCount}` : item === "dimensions" ? ` · ${detail.dimensions.length}` : ""}</button>)}
              </div>
              <button type="button" className="mh-metric-page__preview">◎ {detail.preview}</button>
            </header>
            <div className="mh-metric-page__content" hidden={tab !== "definition"}>
              <div className="mh-metric-page__definition-grid">
                <div className="mh-metric-page__card mh-metric-page__card--wide">
                  {field(detail.fields.name, metric?.name)}
                  <label className="mh-metric-page__field"><span>{detail.fields.definition}</span><textarea key={`${metric?.id}:definition:${metric?.desc}`} defaultValue={metric?.desc} rows="3" /></label>
                </div>
                <div className="mh-metric-page__card">
                  <label className="mh-metric-page__field"><span>{detail.fields.category}</span><select defaultValue={detail.categories[0]}>{detail.categories.map((item) => <option key={item}>{item}</option>)}</select></label>
                  {field(detail.fields.owner, metric?.owner)}
                </div>
                <div className="mh-metric-page__card">
                  <label className="mh-metric-page__field"><span>{detail.fields.unit}</span><select key={`${metric?.id}:unit:${metric?.unit}`} defaultValue={metric?.unit || detail.units[0]}>{unitOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className="mh-metric-page__field"><span>{detail.fields.precision}</span><select key={`${metric?.id}:precision:${metric?.precision}`} defaultValue={metric?.precision}>{detail.precisions.map((item) => <option key={item}>{item}</option>)}</select></label>
                </div>
                <div className="mh-metric-page__card mh-metric-page__card--wide">
                  <span className="mh-metric-page__label">{detail.fields.synonyms}</span>
                  <div className="mh-metric-page__synonyms">{(metric?.synonyms || []).map((name) => <span key={name}>{name} <b>×</b></span>)}<button type="button">+</button></div>
                  <p className="mh-metric-page__hint">{detail.synonymHint}</p>
                </div>
                <div className="mh-metric-page__card mh-metric-page__card--wide mh-metric-page__toggle"><div><strong>{detail.fields.qa}</strong><p className="mh-metric-page__hint">{detail.qaHint}</p></div><Switch label={detail.fields.qa} defaultChecked /></div>
              </div>
            </div>
            <div className="mh-metric-page__content mh-metric-page__formula-grid" hidden={tab !== "formula"}>
              <div className="mh-metric-page__card mh-metric-page__card--wide"><div className="mh-metric-page__card-head"><strong>{detail.formulaLabel}</strong><button type="button">{detail.formulaEdit}</button></div><code className="mh-metric-page__formula">{metric?.category === "Basic" ? metric.source : metric?.formula || detail.noFormula}</code><div className="mh-metric-page__formula-desc">{detail.formulaDescriptions.map((line) => <p key={line}>{line}</p>)}</div></div>
              <div className="mh-metric-page__card"><div className="mh-metric-page__card-head"><strong>{detail.sourceLabel}</strong></div>{detail.sources.map((source) => <div className="mh-metric-page__data-row" key={source.name}><strong>{source.name}</strong><code>{source.field}</code></div>)}</div>
              <div className="mh-metric-page__card"><div className="mh-metric-page__card-head"><strong>{detail.aggregationLabel}</strong></div>{detail.aggregations.map((entry) => <div className="mh-metric-page__data-row" key={entry.label}><strong>{entry.label}</strong><code>{entry.value}</code></div>)}</div>
            </div>
            <div className="mh-metric-page__content mh-metric-page__dimension-grid" hidden={tab !== "dimensions"}>
              <div className="mh-metric-page__card"><div className="mh-metric-page__card-head"><strong>{detail.dimensionLabel}</strong><small>{detail.dimensions.length} {detail.dimensionCount}</small></div>{detail.dimensions.map((entry) => <label className="mh-metric-page__data-row" key={entry.name}><span><strong>{entry.name}</strong><small>{entry.path}</small></span><input type="checkbox" defaultChecked /></label>)}</div>
              <div className="mh-metric-page__card"><div className="mh-metric-page__card-head"><strong>{detail.timeLabel}</strong></div>{detail.timeGranularities.map((entry) => <label className="mh-metric-page__data-row" key={entry}><strong>{entry}</strong><input type="checkbox" defaultChecked /></label>)}</div>
            </div>
          </section>
        </div>
      </main>
      <DerivedMetricPanel open={panelOpen} copy={derivedPanel} references={basic} draft={draft} tokens={tokens} constantOpen={constantOpen} notice={panelOpen ? notice : ""} onCancel={onCancel} onChange={onDraftChange} onOperator={onOperator} onReference={onReference} onRemoveToken={onRemoveToken} onConstantAdd={onConstantAdd} onConstantCancel={onConstantCancel} onTest={onTest} onSave={onSave} />
      {!panelOpen && notice ? <div className="mh-metric-page__toast" role="status">{notice}</div> : null}
      <AssistantDock assistant={assistant} skillFlow={skillFlow} variant="lite" />
    </Shell>
  );
}
