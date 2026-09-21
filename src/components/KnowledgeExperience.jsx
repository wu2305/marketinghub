import React, { useMemo, useState } from "react";
import {
  assets as seedAssets,
  captionUnit,
  heroTotals,
  knowledgeTypes,
  manageableTypes,
} from "../data/catalog.js";
import { AnalyticalModelForm } from "./AnalyticalModelForm.jsx";
import { BusinessTermForm } from "./BusinessTermForm.jsx";
import { SiteHeader } from "./SiteHeader.jsx";

const statuses = ["Draft", "Under Review", "Published"];

function TypeIcon({ icon }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d={icon} />
    </svg>
  );
}

export function KnowledgeExperience() {
  const [items, setItems] = useState(seedAssets);
  const [activeType, setActiveType] = useState("");
  const [query, setQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [screen, setScreen] = useState("library");
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const [navOpen, setNavOpen] = useState(true);

  const meta = knowledgeTypes.find((item) => item.key === activeType);
  const designed = heroTotals(activeType);
  const counted = activeType ? items.filter((asset) => asset.type === activeType) : items;
  const stats = {
    unit: designed.unit,
    total: counted.length,
    monthly: Math.min(designed.monthly, counted.length),
  };
  const unit = captionUnit(stats.unit, stats.total);
  const monthlyUnit = captionUnit(stats.unit, stats.monthly);
  const visible = useMemo(() => {
    return items.filter((asset) => {
      if (activeType && asset.type !== activeType) return false;
      if (selectedStatuses.length && !selectedStatuses.includes(asset.status)) return false;
      const haystack = `${asset.title} ${asset.summary}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  }, [items, activeType, selectedStatuses, query]);

  const finishForm = (record, published) => {
    if (record) {
      setItems((current) => [record, ...current.filter((item) => item.id !== record.id)]);
      setToast(published ? "Knowledge published for AI use." : "Knowledge saved as a disabled draft.");
    }
    setScreen("library");
    setEditing(null);
  };

  if (screen === "business-term") {
    return <BusinessTermForm initial={editing} onDone={(record) => finishForm(record, record?.stage === "Published")} />;
  }
  if (screen === "analysis") {
    return <AnalyticalModelForm initial={editing} onDone={(record) => finishForm(record, record?.stage === "Published")} />;
  }

  const canCreate = manageableTypes.includes(activeType);
  const showRules = canCreate;

  return (
    <>
      <SiteHeader current="AI Interpreter" />
      <main className="home-v4 knowledge-v4">
        <section className="home-command-center knowledge-command-center" aria-labelledby="knowledgeTitle">
          <div className="home-command-hero" aria-hidden="true">
            <img src="/assets/images/knowledge-hero.jpg" alt="" />
            <div className="home-command-hero-overlay" />
          </div>
          <div className="home-command-layout">
            <div className="home-command-copy">
              <p className="eyebrow">KNOWLEDGE MANAGEMENT</p>
              <h1 id="knowledgeTitle">{meta ? meta.label : "AI Interpreter"}</h1>
              <p>{meta ? meta.description : "Explore and govern the trusted knowledge that powers AI interpretation."}</p>
              <span className="knowledge-hero-accent" aria-hidden="true" />
            </div>
            <div className="knowledge-hero-stats" aria-label={`${meta ? meta.label : "All types"} knowledge statistics`}>
              <article className="knowledge-hero-stat">
                <span>Published Knowledge</span>
                <strong>{stats.total.toLocaleString()}</strong>
                <small>{unit} governed for AI use</small>
              </article>
              <article className="knowledge-hero-stat">
                <span>New This Month</span>
                <strong>{stats.monthly.toLocaleString()}</strong>
                <small>{monthlyUnit} added recently</small>
              </article>
              {showRules ? (
                <div className="knowledge-management-rules">
                  <button
                    className="knowledge-management-rules-trigger"
                    type="button"
                    aria-label="Management rules"
                    aria-describedby="knowledgeManagementRulesTooltip"
                  >
                    !
                  </button>
                  <section className="knowledge-management-rules-tooltip" id="knowledgeManagementRulesTooltip" role="tooltip">
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
            </div>
          </div>
        </section>
        <div className="home-v4-inner">
          <div className="knowledge-layout">
            <aside className="knowledge-sidebar" aria-label="Knowledge navigation">
              <nav className="sidebar-nav" aria-label="Knowledge categories">
                <div className="knowledge-sidebar-brand" aria-hidden="true">
                  AI INTERPRETER
                </div>
                <button
                  type="button"
                  className={`sidebar-item${activeType ? "" : " active"}`}
                  aria-pressed={!activeType}
                  onClick={() => setActiveType("")}
                >
                  <span className="sidebar-label">Overview</span>
                  <strong className="sidebar-count">{items.length}</strong>
                </button>
                <div className={`business-knowledge-nav${navOpen ? " is-open" : ""}`} aria-label="Knowledge Management types">
                  <button
                    type="button"
                    className="business-knowledge-nav-title"
                    aria-expanded={navOpen}
                    onClick={() => setNavOpen((open) => !open)}
                  >
                    Knowledge · 8 types
                  </button>
                  <div className="business-type-nav">
                    {knowledgeTypes.map((item) => {
                      const count = items.filter((asset) => asset.type === item.key).length;
                      const sidebarLabel = item.key === "Scenario Reporting" ? "Scenario Reports" : item.label;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          className={activeType === item.key ? "active" : ""}
                          title={`${sidebarLabel} · ${count}`}
                          onClick={() => setActiveType(item.key)}
                        >
                          <span className="sidebar-type-main">
                            <TypeIcon icon={item.icon} />
                            <span className="sidebar-type-label">{sidebarLabel}</span>
                          </span>
                          {manageableTypes.includes(item.key) ? <span className="sidebar-manage-badge">Manage</span> : null}
                          <span className="sidebar-type-count">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </aside>
            <div
              className={`knowledge-main${meta ? " business-type-page" : " business-overview-page"}`}
              data-active-type={meta ? activeType : "Overview"}
            >
              <header className="business-overview-head">
                <div>
                  <p>AI INTERPRETER FOUNDATION</p>
                  <h2>{meta ? meta.label : "Knowledge Overview"}</h2>
                  <span>{meta ? meta.description : "Explore the knowledge available to AI Interpreter."}</span>
                </div>
              </header>
              {!meta ? (
                <div className="knowledge-stats-row">
                  <div className="knowledge-type-stats" aria-label="Knowledge statistics by type">
                    {knowledgeTypes.map((item) => {
                      const count = items.filter((asset) => asset.type === item.key).length;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          className="type-stat-card"
                          onClick={() => setActiveType(item.key)}
                        >
                          <div className="type-stat-icon" style={{ background: `${item.color}15`, color: item.color }}>
                            <TypeIcon icon={item.icon} />
                          </div>
                          <div className="type-stat-body">
                            <strong>{count.toLocaleString()}</strong>
                            <span className="type-stat-label">{item.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <section className="knowledge-library" aria-labelledby="libraryTitle">
                <header className="library-toolbar">
                  <div className="library-search-actions">
                    <div className="library-actions">
                      <strong className="result-count">
                        {visible.length} {visible.length === 1 ? "asset" : "assets"}
                      </strong>
                      {activeType !== "Principles" ? (
                        <div className="business-filter-field">
                          <span>Status</span>
                          <details className="business-multi-filter">
                            <summary>
                              <b>{selectedStatuses.length ? selectedStatuses.join(", ") : "All statuses"}</b>
                            </summary>
                            <div>
                              {statuses.map((status) => (
                                <label key={status}>
                                  <input
                                    type="checkbox"
                                    checked={selectedStatuses.includes(status)}
                                    onChange={() =>
                                      setSelectedStatuses((current) =>
                                        current.includes(status)
                                          ? current.filter((item) => item !== status)
                                          : [...current, status],
                                      )
                                    }
                                  />
                                  {status}
                                </label>
                              ))}
                            </div>
                          </details>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <label className="search-field library-search library-search-top overview-global-search">
                    <span className="sr-only">Search knowledge</span>
                    <input
                      type="search"
                      placeholder="Search knowledge..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </label>
                  {activeType === "Business Term" || activeType === "Analytical Model" ? (
                    <button
                      className="knowledge-add-button"
                      type="button"
                      onClick={() => {
                        setEditing(null);
                        setScreen(activeType === "Analytical Model" ? "analysis" : "business-term");
                      }}
                    >
                      <span aria-hidden="true">＋</span>
                      {activeType === "Business Term" ? "Add Business Term" : "Add Analytical Model"}
                    </button>
                  ) : null}
                </header>
                <div className="asset-table-head" aria-hidden="true">
                  <span>Knowledge Title</span>
                  <span>Type</span>
                  <span>Effective Scope</span>
                  <span>Creator</span>
                  <span>Status</span>
                  <span>Usage</span>
                  <span>Created</span>
                  <span>Actions</span>
                </div>
                <div className="asset-list" role="listbox" aria-label="Knowledge assets">
                  {visible.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      className={`asset-row${selected?.id === asset.id ? " active" : ""}`}
                      aria-pressed={selected?.id === asset.id}
                      onClick={() => setSelected(asset)}
                    >
                      <span className="asset-main">
                        <span className="asset-mark">{asset.mark}</span>
                        <span className="asset-copy">
                          <strong>{asset.title}</strong>
                          <small>{asset.summary}</small>
                        </span>
                      </span>
                      <span className="asset-type-badge" data-type={asset.type}>
                        {asset.type}
                      </span>
                      <span className="asset-scope">{asset.scope}</span>
                      <span className="asset-owner">{asset.owner}</span>
                      <span className="asset-status" data-status={asset.status}>
                        {asset.status}
                      </span>
                      <span className="asset-usage">{asset.usage}</span>
                      <span className="asset-created">{asset.created}</span>
                      <span className="asset-actions">
                        <span className="v20-actions">
                          {asset.type === "Business Term" ? (
                            <span
                              className="v20-icon-action"
                              role="presentation"
                              aria-label="Edit"
                              onClick={(event) => {
                                event.stopPropagation();
                                setEditing(asset);
                                setScreen("business-term");
                              }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <path d="M12 20H5a1 1 0 01-1-1V5a1 1 0 011-1h9" />
                                <path d="M16.5 3.5a2.1 2.1 0 013 3L12 14l-4 1 1-4 7.5-7.5z" />
                              </svg>
                            </span>
                          ) : null}
                          <span className="v20-icon-action v20-view" aria-label="View">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                              <circle cx="12" cy="12" r="2.5" />
                            </svg>
                          </span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
                {visible.length === 0 ? (
                  <div className="empty-state">
                    <strong>No matching assets</strong>
                    <span>Change the category, status, or search.</span>
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </div>
      </main>
      <div className="detail-scrim" hidden={!selected} onClick={() => setSelected(null)} />
      <aside className={`knowledge-detail${selected ? " open" : ""}`} aria-hidden={!selected} aria-label="Selected knowledge asset">
        <header className="detail-drawer-head">
          <div>
            <span>KNOWLEDGE ASSET</span>
            <strong>Asset details</strong>
          </div>
          <button className="detail-close" type="button" aria-label="Close knowledge asset" onClick={() => setSelected(null)}>
            ×
          </button>
        </header>
        {selected ? (
          <div className="detail-content">
            <header className="detail-header">
              <div className="detail-type-line">
                <span>{selected.type}</span>
                <small>{selected.scope}</small>
              </div>
              <h2>{selected.title}</h2>
              <p className="detail-summary">{selected.summary}</p>
            </header>
          </div>
        ) : null}
      </aside>
      {toast ? (
        <div className="knowledge-operation-toast" role="status">
          <span>{toast}</span>
          <button type="button" aria-label="Dismiss" onClick={() => setToast("")}>
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
