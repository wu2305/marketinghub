import "../../tokens.css";
import React from "react";
import { AssistantDock } from "../../components/AssistantDock/index.jsx";
import { Header } from "../../components/Header/index.jsx";
import { Hero } from "../../components/Hero/index.jsx";
import { MetricStat } from "../../components/MetricStat/index.jsx";
import { SectionHeading } from "../../components/SectionHeading/index.jsx";
import { WorkspaceCard } from "../../features/home/WorkspaceCard/index.jsx";
import { Shell } from "../../pages/Shell/index.jsx";
import "./HomePage.css";


/**
 * Home page: header, hero with stats, workspace grid, assistant drawer.
 * @param {object} props
 * @param {string} [props.current="home"] active nav id
 * @param {{ src: string, alt?: string, href?: string }} props.logo
 * @param {Array<{ id: string, label: string, href: string }>} [props.navigation=[]]
 * @param {{ image?: string, eyebrow?: string, title: React.ReactNode, description?: React.ReactNode, stats?: Array<object> }} [props.hero]
 * @param {{ eyebrow?: string, title: React.ReactNode, description?: React.ReactNode }} props.heading section heading over the workspace grid
 * @param {Array<object>} [props.cards=[]] WorkspaceCard props
 * @param {(id:string,params?: Record<string,string>)=>string} props.hrefFor semantic link resolver supplied by story or host
 * @param {object} [props.assistant={}] AssistantPanel props
 * @param {(target: { id: string, params: Record<string,string>, href: string, label?: string }) => void} [props.onNavigate]
 * @param {(target: { title: string }) => void} [props.onOpen] workspace card open
 * @param {object} [props.skillFlow] ModelFlowDialog props; `skillFlow.step` truthy renders the model-generation dialog
 */
export function HomePage({
  current = "home",
  logo,
  navigation = [],
  hero = { stats: [] },
  heading,
  cards = [],
  hrefFor,
  assistant = {},
  skillFlow,
  onNavigate,
  onOpen,
}) {
  const navigationItems = navigation.map((item) => ({ ...item, href: hrefFor(item.id, {}) }));
  return (
    <Shell tone="home">
      <Header logo={{ ...logo, href: hrefFor("home", {}) }} items={navigationItems} current={current} highlightCurrent={false} onNavigate={(event) => onNavigate?.({ ...event, params: {} })} />
      <Hero image={hero.image} title={hero.title} description={hero.description} height={300} variant="home" scrim="home">
        {hero.stats.map((stat) => (
          <MetricStat key={stat.label} {...stat} variant="glass" />
        ))}
      </Hero>
      <div className="mh-page__inset">
        <SectionHeading {...heading} />
        <div className="mh-workspace-grid">
          {cards.map((card) => (
            <WorkspaceCard
              key={card.title}
              {...card}
              href={card.target ? hrefFor(card.target.id, card.target.params || {}) : card.href}
              links={(card.links || []).map((link) => ({ ...link, href: link.target ? hrefFor(link.target.id, link.target.params || {}) : link.href }))}
              onOpen={(event) => {
                onOpen?.(event);
                if (card.target) onNavigate?.({ ...card.target, params: card.target.params || {}, href: hrefFor(card.target.id, card.target.params || {}), label: card.title });
              }}
              onNavigate={(event) => {
                const link = card.links?.find((item) => item.id === event.id);
                if (link?.target) onNavigate?.({ ...link.target, params: link.target.params || {}, href: hrefFor(link.target.id, link.target.params || {}), label: link.label });
              }}
            />
          ))}
        </div>
      </div>
      <AssistantDock assistant={{ ...assistant, suggestions: assistant.homeSuggestions || assistant.suggestions }} skillFlow={skillFlow} variant="home" tone="home" />
    </Shell>
  );
}
