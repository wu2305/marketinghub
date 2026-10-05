import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Shell } from "../Shell/index.jsx";
import { KnowledgeDetail } from "../../features/knowledge-view/KnowledgeDetail/index.jsx";
import "./KnowledgeViewPage.css";

/** Knowledge View page shell. All content, records and route URLs are injected by the caller.
 * @param {object} props
 * @param {object} props.logo Header logo. // 页头 Logo。
 * @param {Array<{id:string,label:string,href:string}>} props.navigation Header links. // 页头链接。
 * @param {object} props.copy Visible labels for crumbs, actions, and type-specific panels. // 面包屑、操作和各类型面板上可见的文案。
 * @param {object} props.record Knowledge record. Types are Business Term, Scenario Reporting, Principles, and Data Model. // 知识记录。类型是 Business Term、Scenario Reporting、Principles 和 Data Model。
 * @param {(id:string,params?: Record<string,string>)=>string} props.hrefFor Turns a route id into an href. // 把路由 id 转成 href。
 * @param {(target:{id:string,params: Record<string,string>,href:string})=>void} [props.onNavigate] The function runs when a crumb or Edit opens another page. The result has `id`, `params`, and `href`. // 面包屑或 Edit 要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。
 */
export function KnowledgeViewPage({ logo, navigation, hrefFor, onNavigate, ...detail }) {
  const nav = navigation.map((item) => ({ ...item, href: hrefFor(item.id, {}) }));
  return <Shell className="mh-kview">
    <Header logo={{ ...logo, href: hrefFor("home", {}) }} items={nav} current="interpreter" highlightCurrent={false} onNavigate={(target) => onNavigate?.({ id: target.id, params: {}, href: target.href })} />
    <main className="mh-kview__main"><KnowledgeDetail {...detail} hrefFor={hrefFor} onNavigate={onNavigate} /></main>
  </Shell>;
}
