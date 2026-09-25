import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { Shell } from "../Shell/index.jsx";
import { KnowledgeDetail } from "../../features/knowledge-view/KnowledgeDetail/index.jsx";
import "./KnowledgeViewPage.css";

/** P09 page shell. All content, records and route URLs are injected by the caller.
 * @param {object} props
 * @param {object} props.logo
 * @param {Array<{id:string,label:string,href:string}>} props.navigation
 * @param {object} props.copy
 * @param {object} props.record
 * @param {(id:string,params?:object)=>string} props.hrefFor
 * @param {(target:{id:string,params:object,href:string})=>void} [props.onNavigate]
 */
export function KnowledgeViewPage({ logo, navigation, hrefFor, onNavigate, ...detail }) {
  const nav = navigation.map((item) => ({ ...item, href: hrefFor(item.id, {}) }));
  return <Shell className="mh-kview">
    <Header logo={{ ...logo, href: hrefFor("home", {}) }} items={nav} current="interpreter" highlightCurrent={false} position="fixed" onNavigate={(target) => onNavigate?.({ id: target.id, params: {}, href: target.href })} />
    <main className="mh-kview__main"><KnowledgeDetail {...detail} hrefFor={hrefFor} onNavigate={onNavigate} /></main>
  </Shell>;
}
