import "../../tokens.css";
import React from "react";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
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

/**
 * AI Interpreter knowledge workspace: sidebar type navigation, type overview
 * grid, and per-type views dispatched through the registry.
 * @param {object} props
 * @param {string} [props.current="interpreter"]
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {object} [props.hero={}] Hero props; `stats` is an array of MetricStat props
 * @param {{ id: string, label: string, icon?: string }} [props.overviewItem]
 * @param {string} [props.sidebarTitle]
 * @param {Array<object>} [props.types=[]] knowledge type entries (id, title, icon, summary, action, manageable, createLabel, stats, view)
 * @param {object} [props.view] props for the active registered type
 * @param {React.ReactNode} [props.overlay] independent overlay slot supplied by the demo hook or host
 * @param {string} [props.activeType="overview"] "overview", a type id, or an unknown id (renders an explicit empty state)
 * @param {{typeTitle: string, typeDescription: Function, viewTitle: string}} props.unknownCopy empty-state copy supplied by the host
 * @param {(target: object & { typeId: string }) => void} [props.onNavigate]
 * @param {(event: { id: string, label: string, typeId: string }) => void} [props.onSelectType]
 */
export function AiInterpreterPage({
  current = "interpreter",
  logo,
  navigation = [],
  hero = { stats: [] },
  overviewItem = { id: "overview", label: "Overview" },
  sidebarTitle,
  types = [],
  view = {},
  overlay = null,
  activeType = "overview",
  unknownCopy = {},
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
  const unit = type?.stats?.units?.[1] || "knowledge assets";
  const captionUnit = (value) => (value === 1 && unit.endsWith("s") ? unit.slice(0, -1) : unit);
  const heroStats = type
    ? [
        { label: "Published Knowledge", value: type.stats.total.toLocaleString(), caption: `${captionUnit(type.stats.total)} governed for AI use` },
        { label: "New This Month", value: type.stats.monthly.toLocaleString(), caption: `${captionUnit(type.stats.monthly)} added recently` },
      ]
    : hero.stats || [];
  const heroProps = type ? { ...hero, title: type.title, description: type.summary } : hero;

  const View = type ? typeViews[type.view] : undefined;

  return (
    /* Type pages rearrange the shell like the original's
       body:has(.business-type-page) rules: the sidebar becomes a fixed rail
       from under the header to the viewport bottom and the hero compresses
       into the content column (170px, right of the rail). */
    <Shell tone="interpreter" className={type ? "mh-page--interpreter-type" : undefined}>
      <Header logo={logo} items={navigation} current={current} highlightCurrent={false} position="fixed" onNavigate={(event) => onNavigate?.({ ...event, typeId: activeType })} />
      <div className="mh-page__offset" aria-hidden="true" />
      <Hero {...heroProps} height={type ? 170 : 260} variant="knowledge" scrim="knowledge" asideLabel={`${type ? type.title : "All types"} knowledge statistics`}>
        {heroStats.map((stat) => (
          <MetricStat key={stat.label} {...stat} variant="glass" compact />
        ))}
        {/* types.js renderManagementRulesHint: the "!" rules hint only exists
            for manageable types (Business Term / Analytical Model / Scenario). */}
        {type?.manageable ? (
          <div className="mh-rules-hint">
            <button className="mh-rules-hint__trigger" type="button" aria-label="Management rules" aria-describedby={rulesHintId}>!</button>
            <section className="mh-rules-hint__tooltip" id={rulesHintId} role="tooltip">
              <h3>Operation Reminder</h3>
              <ol>
                <li>Only knowledge created by you can be managed.</li>
                <li>Disable knowledge before editing or deleting it.</li>
                <li>Deletion is permanent and cannot be undone.</li>
                <li>Disabled knowledge is unavailable for AI use and can be enabled again.</li>
              </ol>
            </section>
          </div>
        ) : null}
      </Hero>
      <div className="mh-interpreter" ref={rootRef}>
        <KnowledgeSidebar
          overview={overviewItem}
          title={sidebarTitle}
          types={types}
          activeId={activeType}
          onSelect={(event) => onSelectType?.({ ...event, typeId: activeType })}
        />
        <div
          className={cx("mh-interpreter__main", !overview && known && "mh-interpreter__main--type")}
          data-active-type={type ? activeType : "Overview"}
        >
          {overview ? (
            <TypeGrid items={types} activeId={activeType} onSelect={(event) => onSelectType?.({ ...event, typeId: activeType })} />
          ) : !known ? (
            <div className="mh-empty mh-empty--unknown" role="status">
              <strong>{unknownCopy.typeTitle}</strong>
              <p>{unknownCopy.typeDescription?.({ typeId: activeType, count: types.length })}</p>
            </div>
          ) : View ? (
            <View searchRef={searchRef} {...view} />
          ) : (
            <div className="mh-empty mh-empty--unknown" role="status">{unknownCopy.viewTitle}</div>
          )}
        </div>
      </div>
      {overlay}
      <AssistantLauncher onOpen={() => onNavigate?.({ id: "assistant", label: "AI Interpreter", typeId: activeType })} />
    </Shell>
  );
}
