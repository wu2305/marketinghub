import { useState } from "react";
import { assetUrl } from "../asset-url.js";
import { KNOWLEDGE_CREATE } from "./content/knowledge-create.js";
import { knowledgeCreateTypes } from "../knowledge-create-options.js";

const routes = {
  home: "/index.html", cockpit: "/assets/pages/reports.html", selfService: "/assets/pages/flexible.html",
  interpreter: "/assets/pages/knowledge.html", campaign: "/assets/pages/campaign.html",
  knowledgeCreate: "/assets/pages/knowledge-create.html",
};

/** Original Demo URL adapter. Hosts can replace this without changing components. */
export function knowledgeCreateHrefFor(id, params = {}) {
  const base = routes[id] || routes.interpreter;
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
  return `${base}${query.size ? `?${query}` : ""}`;
}

export { knowledgeCreateTypes };

export function requiredKnowledgeCreateFields(type) {
  if (type === "Business Term") return ["title", "kind", "description"];
  if (type === "Analytical Model") return ["analysis_name", "trigger_when", "output_requirements"];
  if (type === "Scenario Reporting") return ["scenario_report_title", "scenario_report_linked", "scenario_report_description", "scenario_report_blueprint"];
  if (type === "Metric Dictionary") return ["metricName", "metricFormula"];
  if (type === "Data Model") return ["modelName"];
  if (type === "Report Context") return ["description"];
  if (type === "Synonyms") return ["synonymRows"];
  return ["title", "description"];
}

export function validateKnowledgeCreate(type, values) {
  return requiredKnowledgeCreateFields(type).filter((name) => {
    if (name === "synonymRows") return (values.synonymRows || []).some((row) => !row.term?.trim() || !row.synonym?.trim() || !row.kind?.trim());
    return !String(values[name] ?? "").trim();
  });
}

const initialValues = {
  kind: "Business Term", scope: [], businessDomain: [], reports: [], datasets: [], aiOverview: true,
  enabled: true, status: true, metrics: [], attachments: [], modelGroup: "entity", modelTable: "dim_channel",
  modelTab: "fields", synonymRows: [],
};

/** Deterministic P08 flow: no assets/js, storage, server, or AI calls. */
export function useKnowledgeCreateDemo({
  content = KNOWLEDGE_CREATE, type: initialType = "Business Term", mode = "create", id,
  initial = {}, state = {}, hrefFor = knowledgeCreateHrefFor, onNavigate, onSave, onSubmit,
} = {}) {
  const record = content.records?.[id] || {};
  const [type, setType] = useState(record.type || initialType);
  const [values, setValues] = useState(() => ({ ...initialValues, ...record, ...initial }));
  const [invalid, setInvalid] = useState(state.invalid || []);
  const [result, setResult] = useState(state.result || null);
  const [dialog, setDialog] = useState(state.dialog || null);
  const [menu, setMenu] = useState(state.menu || null);
  const update = ({ name, value }) => {
    setValues((prior) => ({ ...prior, [name]: value, ...(name === "kind" && value === "Global Synonym" ? { scope: [] } : {}) }));
    setInvalid((prior) => prior.filter((item) => item !== name));
  };
  const selectType = ({ value }) => {
    setType(value); setValues({ ...initialValues }); setInvalid([]); setResult(null); setDialog(null);
  };
  const navigate = ({ id: targetId, params = {} }) => {
    const href = hrefFor(targetId, params);
    onNavigate?.({ id: targetId, params, href });
    return href;
  };
  const persist = (action) => {
    const shouldValidate = action === "submit" || ["Business Term", "Analytical Model", "Metric Dictionary"].includes(type);
    const missing = shouldValidate ? validateKnowledgeCreate(type, values) : [];
    if (missing.length) { setInvalid(missing); return false; }
    const payload = { type, mode, id, values: { ...values }, stage: action === "save" ? "Draft" : type === "Scenario Reporting" ? "Queued" : "Published" };
    (action === "save" ? onSave : onSubmit)?.(payload);
    if (["Business Term", "Analytical Model", "Scenario Reporting"].includes(type) || (type === "Report Context" && mode === "edit")) {
      navigate({ id: "interpreter", params: type === "Report Context" ? { type } : { type, notice: action === "save" ? "saved" : "published" } });
    } else {
      setResult({ action, ...payload });
    }
    return true;
  };
  return {
    content, logo: { src: assetUrl("assets/images/tapestry-logo.png"), alt: "Tapestry", href: hrefFor("home") },
    navigation: content.navigation.map((item) => ({ ...item, href: hrefFor(item.id) })),
    type, mode, id, values, invalid, result, dialog, menu, hrefFor,
    onNavigate: navigate, onTypeChange: selectType, onChange: update,
    onSave: () => persist("save"), onSubmit: () => persist("submit"),
    onCancel: () => navigate({ id: "interpreter", params: type === "Business Term" || type === "Analytical Model" || type === "Scenario Reporting" ? { type } : {} }),
    onResultClose: () => { setResult(null); navigate({ id: "interpreter", params: { type, notice: result?.action === "save" ? "saved" : "published" } }); },
    onDialog: ({ kind }) => setDialog(kind), onDialogClose: () => setDialog(null),
    onMenu: ({ name }) => setMenu((prior) => prior === name ? null : name),
  };
}
