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
 * @param {string} [props.current="home"] Active nav id. Home does not underline the current item. // 当前导航 id。Home 不为当前项加下划线。
 * @param {{ src: string, alt?: string, href?: string }} props.logo Header logo. // 页头 Logo。
 * @param {Array<{ id: string, label: string, href: string }>} [props.navigation=[]] Header links. // 页头链接。
 * @param {{ image?: string, eyebrow?: string, title: React.ReactNode, description?: React.ReactNode, stats?: Array<object> }} [props.hero] Header image area. `stats` are the metric blocks. // 头图区。`stats` 是指标块。
 * @param {{ eyebrow?: string, title: React.ReactNode, description?: React.ReactNode }} props.heading Section heading above the workspace cards. // 工作区卡片上方的区块标题。
 * @param {Array<object>} [props.cards=[]] Workspace cards. Each card can open a destination. // 工作区卡片。每张卡片都可以打开一个目的地。
 * @param {(id:string,params?: Record<string,string>)=>string} props.hrefFor Turns a route id into an href. The story and the host each supply this function. // 把路由 id 转成 href。故事和宿主各自提供这个函数。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantDockState & { homeSuggestions?: Array<string|{ label: string, prompt: string }> }} [props.assistant={}] Assistant copy, state, and callbacks. On Home, `homeSuggestions` replaces `suggestions`. // 助手的文案、状态和回调。在 Home 上，`homeSuggestions` 会替换 `suggestions`。
 * @param {(target: { id: string, params: Record<string,string>, href: string, label?: string }) => void} [props.onNavigate] The function runs when a card or a nav link opens another page. The result has `id`, `params`, and `href`. // 卡片或导航要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。
 * @param {(target: { title: string }) => void} [props.onOpen] The function runs when a workspace card starts an action. The result has `title`. // 工作区卡片要启动一次操作时，会调用这个函数。结果里有 `title`。
 * @param {import("../../components/AssistantDock/index.jsx").AssistantSkillFlow} [props.skillFlow] Model dialog props. The dialog shows when `skillFlow.step` is set. // 建模对话框的 props。设置了 `skillFlow.step` 时显示对话框。
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
