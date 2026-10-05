import React from "react";
import { Header } from "../../components/Header/index.jsx";
import { DataModelView } from "../../features/interpreter/DataModelView/index.jsx";
import { Shell } from "../Shell/index.jsx";
import "./DataModelPage.css";

/** Standalone Data Model page. The caller injects every label, record and URL.
 * @param {object} props
 * @param {{src:string,alt:string}} props.logo Header logo. // 页头 Logo。
 * @param {Array<{id:string,label:string}>} props.navigation Header links. // 页头链接。
 * @param {object} props.model Prepared Data Model view. Includes domains, search, graph, and table dialog state. // 已准备好的 Data Model 视图。包含域、搜索、关系图和表对话框状态。
 * @param {(id:string,params?: Record<string,string>)=>string} props.hrefFor Turns a route id into an href. // 把路由 id 转成 href。
 * @param {(target:{id:string,params: Record<string,string>,href:string})=>void} [props.onNavigate] The function runs when a nav link opens another page. The result has `id`, `params`, and `href`. // 导航要打开另一页时，会调用这个函数。结果里有 `id`、`params` 和 `href`。
 */
export function DataModelPage({ logo, navigation, model, hrefFor, onNavigate }) {
  const links = navigation.map((item) => ({ ...item, href: hrefFor(item.id, {}) }));
  return <Shell className="mh-data-model-page">
    <Header logo={{ ...logo, href: hrefFor("home", {}) }} items={links} position="sticky" onNavigate={(target) => onNavigate?.({ id: target.id, params: {}, href: target.href })} />
    <main className="mh-data-model-page__main"><DataModelView {...model} /></main>
  </Shell>;
}
