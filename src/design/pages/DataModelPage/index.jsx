import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { DataModelView } from "../../features/interpreter/DataModelView/index.jsx";
import { Shell } from "../Shell/index.jsx";
import "./DataModelPage.css";

/** Standalone P11 Data Model page. The caller injects every label, record and URL.
 * @param {object} props
 * @param {{src:string,alt:string}} props.logo
 * @param {Array<{id:string,label:string}>} props.navigation
 * @param {object} props.model Prepared `DataModelView` props
 * @param {(id:string,params?:object)=>string} props.hrefFor
 * @param {(target:{id:string,params:object,href:string})=>void} [props.onNavigate]
 */
export function DataModelPage({ logo, navigation, model, hrefFor, onNavigate }) {
  const links = navigation.map((item) => ({ ...item, href: hrefFor(item.id, {}) }));
  return <Shell className="mh-data-model-page">
    <Header logo={{ ...logo, href: hrefFor("home", {}) }} items={links} current="interpreter" highlightCurrent={false} onNavigate={(target) => onNavigate?.({ id: target.id, params: {}, href: target.href })} />
    <main className="mh-data-model-page__main"><DataModelView {...model} /></main>
  </Shell>;
}
