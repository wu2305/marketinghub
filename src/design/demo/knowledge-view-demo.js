import React from "react";
import { KNOWLEDGE_VIEW } from "./content/knowledge-view.js";

const EMPTY_MODEL = { tables: [], fields: [] };

const PATHS = {
  home: "/index.html",
  knowledge: "/assets/pages/knowledge.html",
  interpreter: "/assets/pages/knowledge.html",
  cockpit: "/assets/pages/reports.html",
  "self-service": "/assets/pages/flexible.html",
  campaign: "/assets/pages/campaign.html",
  knowledgeCreate: "/assets/pages/knowledge-create.html",
  knowledgeView: "/assets/pages/knowledge-view.html",
};

/** Source-style URL resolver. A host can inject the same `(id, params)` interface. */
export function knowledgeViewHrefFor(id, params = {}) {
  const path = PATHS[id];
  if (!path) throw new Error(`Unknown knowledge route: ${id}`);
  const pairs = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");
  return `${path}${pairs.length ? `?${pairs.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&")}` : ""}`;
}

const REDIRECT_TYPES = new Set(["Report Context", "Metric Dictionary", "Analytical Model", "Email Reports"]);

/** `detail-routing.js`: final P07 destination for four redirected types. */
export function knowledgeViewRedirectFor(recordId, records = []) {
  if (!recordId) return null;
  const record = records.find((item) => item.id === recordId);
  const type = record?.typeId || record?.type || (recordId.startsWith("email-report-") ? "Email Reports" : null);
  return REDIRECT_TYPES.has(type) ? { id: "interpreter", params: { type, detail: recordId } } : null;
}

/** Deterministic P09 state; all record/copy sources can be replaced by a host.
 * @param {object} props
 * @param {object} [props.content=KNOWLEDGE_VIEW] records, copy, promptSections, model
 * @param {string} [props.recordId]
 * @param {(id:string, params?:object)=>string} [props.hrefFor]
 * @param {(target:{id:string,params:object,href:string})=>void} [props.onNavigate]
 */
export function useKnowledgeViewDemo(props = {}) {
  const content = props.content || KNOWLEDGE_VIEW;
  const model = content.model || EMPTY_MODEL;
  const fallbackRecordId = props.fallbackRecordId || Object.keys(content.records)[0];
  const [recordId, setRecordId] = React.useState(props.recordId || fallbackRecordId);
  const [overlay, setOverlay] = React.useState(props.overlay || null);
  const [collapsed, setCollapsed] = React.useState(Boolean(props.collapsed));
  const [query, setQuery] = React.useState(props.query || "");
  const [group, setGroup] = React.useState(props.group || "entity");
  const [tableId, setTableId] = React.useState(props.tableId || model.tables[0]?.id || null);
  const [tab, setTab] = React.useState(props.tab || "fields");
  const [fields, setFields] = React.useState(() => model.fields.map((field) => ({ ...field })));
  React.useEffect(() => { setRecordId(props.recordId || fallbackRecordId); setOverlay(props.overlay || null); setCollapsed(Boolean(props.collapsed)); setQuery(props.query || ""); setGroup(props.group || "entity"); setTableId(props.tableId || model.tables[0]?.id || null); setTab(props.tab || "fields"); }, [props.recordId, props.overlay, props.collapsed, props.query, props.group, props.tableId, props.tab, fallbackRecordId, model.tables]);
  React.useEffect(() => { setFields(model.fields.map((field) => ({ ...field }))); }, [model.fields]);
  const record = content.records[recordId] || content.records[fallbackRecordId];
  const onChange = ({ name, id, value }) => {
    if (name === "query") setQuery(value);
    else setFields((current) => current.map((field) => field.id === id ? { ...field, [name === "fieldName" ? "name" : name]: value } : field));
    props.onChange?.({ name, id, value });
  };
  const onSelect = ({ kind, id }) => {
    if (kind === "group") setGroup(id);
    if (kind === "table") setTableId(id);
    if (kind === "tab") setTab(id);
    props.onSelect?.({ kind, id });
  };
  const onAction = ({ id }) => { setOverlay(id); props.onAction?.({ id, recordId: record.id }); };
  const onOpen = ({ kind }) => { setOverlay(kind); props.onOpen?.({ kind, recordId: record.id }); };
  const onClose = ({ reason }) => { setOverlay(null); props.onCancel?.({ reason, recordId: record.id }); };
  const onToggle = ({ id, expanded }) => { setCollapsed(!expanded); props.onChange?.({ name: "expanded", id, value: expanded }); };
  return { record, copy: content.copy, promptSections: content.promptSections, model,
    hrefFor: props.hrefFor || knowledgeViewHrefFor, onNavigate: props.onNavigate,
    overlay, collapsed, query, group, tableId, tab, fields, onChange, onSelect, onAction, onOpen, onClose, onToggle,
    setRecordId };
}
