import "../../tokens.css";
import React from "react";
import { AssistantLauncher } from "../../components/AssistantLauncher/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { cx, recordMatchesFilter, uniqueFilterOptions } from "../../cx.js";
import { BusinessTermView } from "../../features/interpreter/BusinessTermView/index.jsx";
import { KnowledgeLibrary } from "../../features/interpreter/KnowledgeLibrary/index.jsx";
import { KnowledgeSidebar } from "../../features/interpreter/KnowledgeSidebar/index.jsx";
import { PrinciplesView } from "../../features/interpreter/PrinciplesView/index.jsx";
import { TypeGrid } from "../../features/interpreter/TypeGrid/index.jsx";
import { Shell } from "../../pages/Shell/index.jsx";
import "./AiInterpreterPage.css";




/**
 * AI Interpreter knowledge workspace: sidebar type navigation, type overview
 * grid, and the generic per-type library list (transition implementation —
 * original per-type views are card/table grids, see handover §2.3 P07).
 * @param {object} props
 * @param {string} [props.current="interpreter"]
 * @param {object} props.logo
 * @param {Array<object>} [props.navigation=[]]
 * @param {object} [props.hero={}] Hero props; `stats` is an array of MetricStat props
 * @param {{ id: string, label: string, icon?: string }} [props.overviewItem]
 * @param {string} [props.sidebarTitle]
 * @param {Array<object>} [props.types=[]] knowledge type entries (id, title, icon, summary, action, manageable, createLabel, stats, statusFilters)
 * @param {Array<object>} [props.records=[]] sampled records; each row links to a type via `typeId`
 * @param {object} [props.principles={}] PrinciplesView props for `?type=Principles` (items, selectedCategories, page, pageSize, expanded, strings, callbacks)
 * @param {object} [props.businessTerms={}] BusinessTermView props for `?type=Business Term` — drive it with `useBusinessTermDemo` so the state lives at page level
 * @param {string} [props.activeType="overview"] "overview", a type id, or an unknown id (renders an explicit empty state)
 * @param {string} [props.query=""]
 * @param {Object<string, string>} [props.filterValues={}]
 * @param {(target: object) => void} [props.onNavigate]
 * @param {(event: { id: string, label: string }) => void} [props.onSelectType]
 * @param {(event: { name: string, value: string }) => void} [props.onQueryChange]
 * @param {(event: { id: string, value: string }) => void} [props.onFilterChange]
 * @param {(event: { typeId: string, title: string }) => void} [props.onCreate]
 * @param {(row: object) => void} [props.onSelectAsset]
 */
export function AiInterpreterPage({
  current = "interpreter",
  logo,
  navigation = [],
  hero = { stats: [] },
  overviewItem = { id: "overview", label: "Overview" },
  sidebarTitle,
  types = [],
  records = [],
  principles = {},
  businessTerms = {},
  activeType = "overview",
  query = "",
  filterValues = {},
  onNavigate,
  onSelectType,
  onQueryChange,
  onFilterChange,
  onCreate,
  onSelectAsset,
}) {
  const overview = activeType === "overview" || !activeType;
  const type = types.find((item) => item.id === activeType);
  const known = overview || Boolean(type);
  const searchRef = React.useRef(null);
  const rulesHintId = React.useId();

  // types.js: "/" and Cmd/Ctrl+K focus the visible search field on type pages.
  React.useEffect(() => {
    if (overview || !known) return undefined;
    const onKeydown = (event) => {
      const active = document.activeElement;
      const editing =
        active &&
        (active.matches("input, textarea, select") || active.getAttribute("contenteditable") === "true");
      const isSearchShortcut =
        event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k");
      if (isSearchShortcut && !editing && searchRef.current) {
        event.preventDefault();
        searchRef.current.focus();
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [overview, known]);

  const typeRecords = type ? records.filter((record) => record.typeId === type.id) : [];
  const filters = (type?.statusFilters || []).map((filter) => ({
    ...filter,
    options: filter.options || uniqueFilterOptions(typeRecords, filter.id),
  }));
  const rows = typeRecords.filter((record) => {
    const queryMatch = !query || `${record.title} ${record.summary}`.toLowerCase().includes(query.toLowerCase());
    const filterMatch = filters.every((filter) => !filterValues[filter.id] || recordMatchesFilter(record, filter, filterValues[filter.id]));
    return queryMatch && filterMatch;
  });

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

  return (
    /* Type pages rearrange the shell like the original's
       body:has(.business-type-page) rules: the sidebar becomes a fixed rail
       from under the header to the viewport bottom and the hero compresses
       into the content column (170px, right of the rail). */
    <Shell tone="interpreter" className={type ? "mh-page--interpreter-type" : undefined}>
      <Header logo={logo} items={navigation} current={current} highlightCurrent={false} position="fixed" onNavigate={onNavigate} />
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
      <div className="mh-interpreter">
        <KnowledgeSidebar
          overview={overviewItem}
          title={sidebarTitle}
          types={types}
          activeId={activeType}
          onSelect={onSelectType}
        />
        <div
          className={cx("mh-interpreter__main", !overview && known && "mh-interpreter__main--type")}
          data-active-type={type ? activeType : "Overview"}
        >
          {overview ? (
            <TypeGrid items={types} activeId={activeType} onSelect={onSelectType} />
          ) : !known ? (
            <div className="mh-empty mh-empty--unknown" role="status">
              <strong>Unknown knowledge type</strong>
              <p>{`"${activeType}" is not one of the ${types.length} knowledge types. Pick a type from the navigation.`}</p>
            </div>
          ) : type.view === "principles" ? (
            <PrinciplesView
              query={query}
              onQueryChange={onQueryChange}
              searchRef={searchRef}
              {...principles}
            />
          ) : type.view === "business-term" ? (
            /* business-term-library.js replaces the generic library chrome with
               #businessTermOverview; the "/" and Cmd/Ctrl+K shortcut keeps
               targeting the visible search input. */
            <BusinessTermView searchRef={searchRef} {...businessTerms} />
          ) : (
            <KnowledgeLibrary
              type={{ ...type, statusFilters: filters }}
              query={query}
              filterValues={filterValues}
              rows={rows}
              onQueryChange={onQueryChange}
              onFilterChange={onFilterChange}
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
