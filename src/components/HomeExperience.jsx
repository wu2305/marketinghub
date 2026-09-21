import React from "react";
import { AssistantPanel } from "./AssistantPanel.jsx";
import { SiteHeader } from "./SiteHeader.jsx";

const signals = [
  ["REPORT CENTER", "12", "governed reports ready to review"],
  ["KNOWLEDGE CENTER", "27", "assets across 8 knowledge types"],
  ["MEDIA DATA TRACKING CHANNELS", "21", "channels connected for tracking"],
  ["ACTIVE CAMPAIGNS", "24", "live campaigns in market"],
];

export function HomeExperience() {
  return (
    <>
      <SiteHeader current="Home" />
      <main id="home" className="experience-shell home-v4">
        <section className="home-command-center" aria-labelledby="homeTitle">
          <div className="home-command-hero" aria-hidden="true">
            <img src="/assets/images/hero-bg-coach.jpg" alt="" />
            <div className="home-command-hero-overlay" />
          </div>
          <div className="home-command-layout">
            <div className="home-command-copy">
              <h1 id="homeTitle">Marketing Portal</h1>
              <p>Your daily workspace for campaign planning, activation, optimization and knowledge — all in one place.</p>
            </div>
            <section className="home-metrics" aria-label="Marketing Portal system summary">
              <div className="home-signal-grid">
                {signals.map(([label, value, caption]) => (
                  <article className="home-signal" key={label}>
                    <div className="home-signal-body">
                      <span>{label}</span>
                      <strong>{value}</strong>
                      <small>{caption}</small>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
        <div className="home-v4-inner">
          <section className="core-workspaces" aria-labelledby="coreWorkspacesTitle">
            <header className="home-section-heading">
              <div>
                <span>WORKSPACES</span>
                <h2 id="coreWorkspacesTitle">Enter the work that matters</h2>
              </div>
              <p>Start from execution, reports, or the knowledge behind every answer.</p>
            </header>
            <div className="workspace-card-grid">
              <article className="workspace-card workspace-card-reports">
                <div className="workspace-card-image">
                  <img src="/assets/images/workspace-marketing-overview.png" alt="" />
                </div>
                <div className="workspace-card-body">
                  <header className="workspace-card-heading">
                    <div>
                      <h3>Marketing Cockpit</h3>
                    </div>
                  </header>
                  <p className="workspace-description">
                    Centralized view for tracking all marketing initiatives' performance and evolving business trends.
                  </p>
                  <div className="workspace-links" aria-label="Report Center capabilities">
                    <a href="/original/assets/pages/reports.html?project=rednote">
                      <span>DG Data Insight</span>
                      <b aria-hidden="true">→</b>
                    </a>
                    <a href="/original/assets/pages/reports.html?project=abo">
                      <span>DC Data Insight</span>
                      <b aria-hidden="true">→</b>
                    </a>
                    <a href="/original/assets/pages/reports.html?project=customer">
                      <span>D2C Insight</span>
                      <b aria-hidden="true">→</b>
                    </a>
                  </div>
                </div>
                <a className="workspace-card-link" href="/original/assets/pages/reports.html" aria-label="Open Marketing Cockpit" />
              </article>
              <article className="workspace-card workspace-card-analysis">
                <div className="workspace-card-image">
                  <img src="/assets/images/workspace-business-explorer.png" alt="" />
                </div>
                <div className="workspace-card-body">
                  <header className="workspace-card-heading">
                    <h3>Self-Service Center</h3>
                  </header>
                  <p className="workspace-description">
                    Explore business performance with flexible views, filters and comparisons, and upload datasets to the data lake.
                  </p>
                </div>
                <a className="workspace-card-link" href="/original/assets/pages/flexible.html" aria-label="Open Self-Service Center" />
              </article>
              <article className="workspace-card workspace-card-knowledge">
                <div className="workspace-card-image">
                  <img src="/assets/images/workspace-knowledge-center.png" alt="" />
                </div>
                <div className="workspace-card-body">
                  <header className="workspace-card-heading">
                    <h3>AI Interpreter</h3>
                  </header>
                  <p className="workspace-description">
                    Empower business teams to create, manage and evolve trusted knowledge for consistent AI experiences.
                  </p>
                  <div className="workspace-links" aria-label="Knowledge Base capabilities">
                    <a href="/original/assets/pages/knowledge.html">
                      <span>Knowledge Management</span>
                      <b aria-hidden="true">→</b>
                    </a>
                  </div>
                </div>
                <a className="workspace-card-link" href="/original/assets/pages/knowledge.html" aria-label="Open AI Interpreter" />
              </article>
              <article className="workspace-card workspace-card-campaign">
                <div className="workspace-card-image">
                  <img src="/assets/images/workspace-campaign-operations.png" alt="" />
                </div>
                <div className="workspace-card-body">
                  <header className="workspace-card-heading">
                    <h3>RedNote Campaign Tool</h3>
                  </header>
                  <p className="workspace-description">Plan, launch and manage every campaign from one connected workspace.</p>
                </div>
                <a className="workspace-card-link" href="/original/assets/pages/campaign.html" aria-label="Open RedNote Campaign Tool" />
              </article>
            </div>
          </section>
        </div>
      </main>
      <AssistantPanel />
    </>
  );
}
