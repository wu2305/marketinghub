import React from "react";
import { TextInput } from "../../../components/TextInput/index.jsx";
import { TextArea } from "../../../components/TextArea/index.jsx";
import { Select } from "../../../components/Select/index.jsx";
import "../../../tokens.css";
import "./KnowledgeCreateFields.css";

function Field({ name, label, value = "", onChange, invalid, required, placeholder, textarea = false, select, children, wide = false, rows, errorText }) {
  return <label className={`mh-kcf__field${wide ? " mh-kcf__field--wide" : ""}${invalid ? " is-invalid" : ""}`}>
    <span>{label}{required && <b className="mh-kcf__required" aria-hidden="true"> *</b>}</span>
    {select ? <Select name={name} value={value} options={select} onChange={onChange} invalid={invalid} />
      : textarea ? <TextArea name={name} rows={rows || 3} value={value} placeholder={placeholder} onChange={onChange} invalid={invalid} />
      : <TextInput name={name} value={value} placeholder={placeholder} onChange={onChange} invalid={invalid} />}
    {children}{invalid && <small className="mh-kcf__error">{errorText}</small>}
  </label>;
}

function MultiPicker({ name, label, options, value = [], onChange, open, onMenu, required = false, placeholder }) {
  const selected = Array.isArray(value) ? value : [];
  return <div className="mh-kcf__field mh-kcf__multi"><span>{label}{required && <b className="mh-kcf__required"> *</b>}</span>
    <div className="mh-kcf__multi-button"><button type="button" className="mh-kcf__multi-trigger" aria-expanded={Boolean(open)} onClick={() => onMenu?.({ name })}>{selected.length ? selected.join(", ") : <em>{placeholder}</em>}</button>{selected.map((item) => <button type="button" className="mh-kcf__chip" key={item} aria-label={`Remove ${item}`} onClick={() => onChange?.({ name, value: selected.filter((x) => x !== item) })}>×</button>)}</div>
    {open && <div className="mh-kcf__multi-menu">{options.map((option) => <label key={option}><input type="checkbox" checked={selected.includes(option)} onChange={() => onChange?.({ name, value: selected.includes(option) ? selected.filter((x) => x !== option) : [...selected, option] })} />{option}</label>)}</div>}
  </div>;
}

function TagInput({ name, label, value = [], onChange, placeholder }) {
  const [entry, setEntry] = React.useState("");
  const add = () => { const next = entry.split(/[,，;]/).map((x) => x.trim()).filter(Boolean); onChange?.({ name, value: [...new Set([...(value || []), ...next])] }); setEntry(""); };
  return <div className="mh-kcf__field mh-kcf__field--wide"><span>{label}</span><div className="mh-kcf__tag-input">
    {(value || []).map((item) => <span className="mh-kcf__chip" key={item}>{item}<button type="button" aria-label={`Remove ${item}`} onClick={() => onChange?.({ name, value: value.filter((x) => x !== item) })}>×</button></span>)}
    <input aria-label={label} value={entry} placeholder={placeholder} onChange={(e) => setEntry(e.target.value)} onBlur={add} onKeyDown={(e) => { if (["Enter", ","].includes(e.key)) { e.preventDefault(); add(); } }} />
  </div></div>;
}

function Toggle({ name, label, checked, onChange }) { return <label className="mh-kcf__toggle"><input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange?.({ name, value: e.target.checked })} /><i aria-hidden="true" /><span>{label}</span></label>; }
function Section({ title, children }) { return <section className="mh-kcf__section"><h2>{title}</h2><div className="mh-kcf__grid">{children}</div></section>; }

function SharedFields({ type, content, values, onChange, menu, onMenu }) { const c = content.shared; const t = content.copy; return <div className="mh-kcf__grid mh-kcf__shared">
  <MultiPicker name="businessDomain" label={t.scopeDomain} options={c.businessDomains} value={values.businessDomain} onChange={onChange} open={menu === "businessDomain"} onMenu={onMenu} placeholder={t.selectMany} />
  <MultiPicker name="reports" label={t.scopeReports} options={c.reports} value={values.reports} onChange={onChange} open={menu === "reports"} onMenu={onMenu} placeholder={t.selectMany} />
  <MultiPicker name="datasets" label={t.relatedDatasets} options={c.datasets} value={values.datasets} onChange={onChange} open={menu === "datasets"} onMenu={onMenu} placeholder={t.selectMany} />
  {type === "Report Context" && <Toggle name="status" label={`${t.knowledgeEnabled} ${t.metricStatus} ${values.status ? t.metricStatusOn : t.metricStatusOff}`} checked={values.status} onChange={onChange} />}
</div>; }

function MetricFields({ content, values, invalid, onChange, onDialog }) {
  const t = content.copy;
  // The last source renderer locks its contentEditable formula surface. Metrics
  // are whole tokens, including names with spaces such as "Visit Count".
  const tokens = values.metricTokens ?? (values.metricFormula ? [{ kind: "operator", value: values.metricFormula }] : []);
  const setTokens = (next) => {
    onChange?.({ name: "metricTokens", value: next });
    onChange?.({ name: "metricFormula", value: next.map((item) => item.value).join(" ") });
  };
  const append = (value, kind) => setTokens([...tokens, { value, kind }]);
  return <div className="mh-kcf__metric"><div>
    <Field errorText={t.required} name="metricDomain" label={t.metricDomain} value={values.metricDomain || ""} onChange={onChange} select={[{ value: "", label: content.placeholders.metricDomain }, ...content.options.metricDomains]} />
    <div className="mh-kcf__grid"><Field errorText={t.required} name="metricName" label={t.metricName} value={values.metricName || ""} onChange={onChange} required invalid={invalid.includes("metricName")} placeholder={content.placeholders.metricName} /><Field errorText={t.required} name="unit" label={t.unit} value={values.unit || ""} onChange={onChange} placeholder={content.placeholders.unit} /></div>
    <div className="mh-kcf__field"><span>{t.formula} <b className="mh-kcf__required">*</b></span><div className="mh-kcf__formula" role="textbox" aria-label={t.formula} aria-readonly="true" tabIndex={-1}>{tokens.length ? tokens.map((token, index) => <span className={token.kind === "metric" ? "mh-kcf__formula-token" : "mh-kcf__formula-operator"} key={`${index}:${token.value}`}>{token.value}{token.kind === "metric" && <button type="button" aria-label={`${t.removeMetric} ${token.value}`} onClick={() => setTokens(tokens.filter((_, i) => i !== index))}>×</button>}</span>) : <em>{content.placeholders.formula}</em>}</div>{invalid.includes("metricFormula") && <small className="mh-kcf__error">{t.formulaRequired}</small>}</div>
    <div className="mh-kcf__formula-tools">{content.metricOperators.map((op) => <button type="button" key={op} onClick={() => append(op, "operator")}>{op}</button>)}<button type="button" aria-label="Clear formula" onClick={() => setTokens([])}>⌫</button><button type="button" aria-label="Delete last token" onClick={() => setTokens(tokens.slice(0, -1))}>←</button></div>
    <small>{t.formulaHint}</small>
    <div className="mh-kcf__test"><b>{t.testRun}</b><p>{t.testHint}</p><button type="button" onClick={() => onDialog?.({ kind: "test" })}>{t.test}</button></div>
    <Field errorText={t.required} name="description" label={t.description} value={values.description || ""} onChange={onChange} textarea placeholder={content.placeholders.metricDescription} />
    <Field errorText={t.required} name="synonyms" label={t.synonyms} value={values.synonyms || ""} onChange={onChange} placeholder={content.placeholders.metricSynonyms} />
    <Toggle name="status" label={`${t.metricStatus} ${values.status ? t.metricStatusOn : t.metricStatusOff}`} checked={values.status} onChange={onChange} />
  </div><aside className="mh-kcf__metric-list"><h3>{t.metricsHeading}</h3>{content.shared.basicMetrics.map(([label, source]) => <button type="button" key={label} onClick={() => append(label, "metric")}><b>{label}</b><small>{source}</small></button>)}</aside></div>;
}

function ModelSynonymCell({ tableId, fieldKey, source, values, onChange, placeholder }) {
  const [draft, setDraft] = React.useState("");
  const skipBlur = React.useRef(false);
  const name = `table:${tableId}:field:${fieldKey}:synonyms`;
  const oldName = `table:${tableId}:field:${fieldKey}:synonym`;
  const sourceTag = values[oldName] ?? source;
  const added = values[name] ?? [];
  const editing = values.synonymEditing === `${tableId}:${fieldKey}`;
  const close = () => { setDraft(""); onChange?.({ name: "synonymEditing", value: "" }); };
  const commit = () => {
    if (skipBlur.current) { skipBlur.current = false; return; }
    const next = draft.trim();
    if (next) onChange?.({ name, value: [...added, next] });
    close();
  };
  return <span className="mh-kcf__model-synonyms">{sourceTag && <span className="mh-kcf__chip">{sourceTag} ×</span>}{added.map((tag, index) => <span className="mh-kcf__chip" key={`${index}:${tag}`}>{tag}<button type="button" aria-label={`Remove synonym ${tag}`} onClick={() => onChange?.({ name, value: added.filter((_, i) => i !== index) })}>×</button></span>)}{editing && <input autoFocus aria-label="New synonym" placeholder={placeholder} value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={commit} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); commit(); } else if (event.key === "Escape") { event.preventDefault(); skipBlur.current = true; close(); } }} />}<button type="button" aria-label={`Add synonym to ${fieldKey}`} onClick={() => { skipBlur.current = false; onChange?.({ name: "synonymEditing", value: `${tableId}:${fieldKey}` }); }}>＋</button></span>;
}

function ModelFields({ content, values, invalid, onChange, onDialog }) {
  const tables = content.shared.modelTables[values.modelGroup || "entity"];
  const active = tables.find((item) => item.id === values.modelTable) || tables[0];
  // The source Demo supplies one field set per Entity/Event group, not a
  // distinct schema for every listed table. Keep those source-backed rows.
  const fields = active.fields || content.shared.modelTables[values.modelGroup || "entity"][0].fields;
  const model = content.model;
  const t = content.copy;
  const tableValue = (key, fallback) => values[`table:${active.id}:${key}`] ?? fallback;
  const changeTable = ({ name, value }) => onChange?.({ name: `table:${active.id}:${name}`, value });
  const filtered = tables.filter((table) => `${table.title} ${table.id}`.toLowerCase().includes((values.tableSearch || "").toLowerCase()));
  return <div className="mh-kcf__model">
    <div className="mh-kcf__model-intro"><Field errorText={t.required} name="modelName" label={t.modelName} required invalid={invalid.includes("modelName")} value={values.modelName || ""} onChange={onChange} placeholder={content.placeholders.modelName} /><Field errorText={t.required} name="modelDescription" label={t.modelDescription} value={values.modelDescription || ""} onChange={onChange} textarea placeholder={content.placeholders.modelDescription} /><Toggle name="enabled" label={t.modelEnabled} checked={values.enabled} onChange={onChange} /></div>
    <div className="mh-kcf__model-ai"><span>◇</span><div><b>{t.aiModeling} <small>{t.beta}</small></b><p>{t.aiModelingHint}</p></div><button type="button" onClick={() => onDialog?.({ kind: "smart" })}>◇ {t.smartModeling}</button></div>
    <div className="mh-kcf__model-work"><aside><input aria-label={t.tableSearch} placeholder={content.placeholders.modelSearch} value={values.tableSearch || ""} onChange={(e) => onChange?.({ name: "tableSearch", value: e.target.value })} /><div className="mh-kcf__model-switch">{Object.entries(model.groups).map(([key,label]) => <button type="button" className={(values.modelGroup || "entity") === key ? "is-active" : ""} key={key} onClick={() => { onChange?.({ name: "modelGroup", value: key }); onChange?.({ name: "modelTable", value: content.shared.modelTables[key][0].id }); }}>{label}</button>)}</div><div className="mh-kcf__model-list">{filtered.map((table) => <button type="button" className={active.id === table.id ? "is-active" : ""} key={table.id} onClick={() => onChange?.({ name: "modelTable", value: table.id })}><b>{table.title}</b><small>{table.id} · {table.meta}</small></button>)}</div><footer><b>{t.dataSourceHeading}</b><p>{model.dataSource} <span>{t.enabled}</span></p></footer></aside>
      <section><header><div>{[["basic",model.basicTabs.basic],["fields",`${model.basicTabs.fields} · ${fields.length}`]].map(([key,label]) => <button type="button" className={(values.modelTab || "fields") === key ? "is-active" : ""} key={key} onClick={() => onChange?.({ name: "modelTab", value: key })}>{label}</button>)}</div><button type="button" onClick={() => onDialog?.({ kind: "preview" })}>◉ {t.preview}</button></header>
        {(values.modelTab || "fields") === "basic" ? <div className="mh-kcf__model-basic"><Field errorText={t.required} name="tableName" label={t.tableName} value={tableValue("name", active.title)} onChange={({ value }) => changeTable({ name: "name", value })} /><Field errorText={t.required} name="physicalTable" label={t.physicalTable} value={tableValue("physical", active.id)} onChange={({ value }) => changeTable({ name: "physical", value })} /><Field errorText={t.required} name="tableDescription" label={t.tableDescription} value={tableValue("description", active.description || model.defaultDescription)} onChange={({ value }) => changeTable({ name: "description", value })} textarea /><Field errorText={t.required} name="tableType" label={t.tableType} value={tableValue("type", values.modelGroup === "event" ? "Event" : "Entity")} onChange={({ value }) => changeTable({ name: "type", value })} select={["Entity","Event"]} /><Field errorText={t.required} name="dataSource" label={t.dataSource} value={model.dataSource} onChange={onChange} select={[model.dataSource]} /><Toggle name={`table:${active.id}:enabled`} label={t.enableTable} checked={tableValue("enabled", true)} onChange={onChange} /></div>
          : <div className="mh-kcf__table-scroll"><table><thead><tr>{model.tableHeaders.map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{fields.map(([key,dataType,name,synonyms],index) => <tr key={key}><td><b>{key}</b><small>{dataType}</small></td><td><input aria-label={`${key} name`} value={values[`table:${active.id}:field:${key}:name`] ?? name} onChange={(e) => onChange?.({ name: `table:${active.id}:field:${key}:name`, value: e.target.value })} /></td><td><ModelSynonymCell tableId={active.id} fieldKey={key} source={synonyms} values={values} onChange={onChange} placeholder={content.placeholders.synonym} /></td><td><select aria-label={`${key} field type`} value={values[`table:${active.id}:field:${key}:type`] || model.fieldTypes[0]} onChange={(e) => onChange?.({ name: `table:${active.id}:field:${key}:type`, value: e.target.value })}>{model.fieldTypes.map((x) => <option key={x}>{x}</option>)}</select></td><td><select aria-label={`${key} semantic role`} value={values[`table:${active.id}:field:${key}:role`] || model.roles[0]} onChange={(e) => onChange?.({ name: `table:${active.id}:field:${key}:role`, value: e.target.value })}>{model.roles.map((x) => <option key={x}>{x}</option>)}</select></td><td><label className="mh-kcf__fuzzy"><input aria-label={`${key} fuzzy match`} type="checkbox" checked={values[`table:${active.id}:field:${key}:fuzzy`] ?? index > 1} onChange={(e) => onChange?.({ name: `table:${active.id}:field:${key}:fuzzy`, value: e.target.checked })} /><i aria-hidden="true" /></label></td><td>–</td></tr>)}</tbody></table></div>}
      </section></div>
  </div>;
}

function SynonymScope({ label, options, value = [], onChange, placeholder }) {
  const selected = Array.isArray(value) ? value : [];
  return <details className="mh-kcf__synonym-scope"><summary aria-label={label}>{selected.join(", ") || placeholder}</summary><div>{options.map((option) => <label key={option}><input type="checkbox" checked={selected.includes(option)} onChange={() => onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])} />{option}</label>)}</div></details>;
}

function SynonymFields({ content, values, invalid, onChange }) {
  const rows = values.synonymRows || [];
  const { existing, kinds, headers, choices } = content.synonyms;
  const t = content.copy;
  const changeRow = (index, key, value) => onChange?.({ name: "synonymRows", value: rows.map((row, i) => i === index ? { ...row, [key]: value } : row) });
  const addRow = () => onChange?.({ name: "synonymRows", value: [{ term: "", synonym: "", kind: "", domain: [], reports: [], dataset: [], status: content.options.synonymStatuses[0] }, ...rows] });
  return <section className="mh-kcf__synonyms">
    <header><div><h2>{t.synonymManagement}</h2><p>{t.synonymIntro}</p></div><button type="button" onClick={addRow}>+ {t.addSynonym}</button></header>
    <div className="mh-kcf__table-scroll"><table><thead><tr>{headers.map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>
      {rows.map((row, index) => <tr key={index} className={invalid.includes("synonymRows") ? "is-invalid" : ""}>
        <td><input aria-label={t.standardTerm} required placeholder={t.standardTerm} value={row.term} onChange={(e) => changeRow(index, "term", e.target.value)} /></td>
        <td><input aria-label={t.synonyms} required placeholder={t.synonyms} value={row.synonym} onChange={(e) => changeRow(index, "synonym", e.target.value)} /></td>
        <td><select aria-label={t.termType} required value={row.kind} onChange={(e) => changeRow(index, "kind", e.target.value)}><option value="">{t.select}</option>{kinds.map((kind) => <option key={kind}>{kind}</option>)}</select></td>
        <td><SynonymScope label={t.applicableDomain} options={choices.domain} value={row.domain} onChange={(value) => changeRow(index, "domain", value)} placeholder={t.selectMany} /></td>
        <td><SynonymScope label={t.scopeReports} options={choices.reports} value={row.reports} onChange={(value) => changeRow(index, "reports", value)} placeholder={t.selectMany} /></td>
        <td><SynonymScope label={t.relatedDatasets} options={choices.dataset} value={row.dataset} onChange={(value) => changeRow(index, "dataset", value)} placeholder={t.selectMany} /></td>
        <td><select aria-label={t.status} value={row.status} onChange={(e) => changeRow(index, "status", e.target.value)}>{content.options.synonymStatuses.map((status) => <option key={status}>{status}</option>)}</select></td>
        <td><button type="button" aria-label={t.removeRow} onClick={() => onChange?.({ name: "synonymRows", value: rows.filter((_, i) => i !== index) })}>×</button></td>
      </tr>)}
      {existing.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}<td>{t.readOnly}</td></tr>)}
    </tbody></table></div><small>{t.synonymHint}</small>
  </section>;
}

/**
 * P08 type-specific fields. State and all record/options data are injected.
 * @param {object} props
 * @param {string} props.type One of knowledgeCreateTypes.
 * @param {string} [props.mode="create"] One of knowledgeCreateModes.
 * @param {object} props.content Field copy, options, and deterministic rows.
 * @param {object} props.values Controlled field values.
 * @param {string[]} props.invalid Required field names in error state.
 * @param {string|null} props.menu Open picker name.
 * @param {(event:{name:string,value:unknown}) => void} [props.onChange]
 * @param {(event:{name:string}) => void} [props.onMenu]
 * @param {(event:{kind:string}) => void} [props.onDialog]
 */
export function KnowledgeCreateFields({ type, mode = "create", content, values = {}, invalid = [], menu, onChange, onMenu, onDialog }) {
  const change = onChange;
  const t = content.copy;
  if (type === "Data Model") return <ModelFields content={content} values={values} invalid={invalid} onChange={change} onDialog={onDialog} />;
  if (type === "Metric Dictionary") return <MetricFields content={content} values={values} invalid={invalid} onChange={change} onDialog={onDialog} />;
  if (type === "Synonyms") return <SynonymFields content={content} values={values} invalid={invalid} onChange={change} />;
  if (type === "Report Context" && mode === "edit") return <div className="mh-kcf__rc-edit"><div className="mh-kcf__rc-preview">{values.thumbnail ? <img src={values.thumbnail} alt={values.title} /> : t.reportPreview}</div><div className="mh-kcf__rc-head"><div><small>{t.reportDescription}</small><h2>{values.title || t.reportContext}</h2></div><div><button type="button" aria-label={values.unlocked ? "Lock report description" : "Unlock report description"} onClick={() => change?.({ name: "unlocked", value: !values.unlocked })}>{values.unlocked ? "🔓" : "🔒"}</button><button type="button" onClick={() => onDialog?.({ kind: "history" })}>{t.versionHistory}</button></div></div><textarea aria-label="Report description" disabled={!values.unlocked} value={values.description || ""} onChange={(e) => change?.({ name: "description", value: e.target.value })} /><p>{values.unlocked ? t.reportEditable : t.reportLocked}</p><dl><dt>{t.reportDataModel}</dt><dd>{(values.businessDomain || []).join(", ") || "—"}</dd><dt>{t.aiStatus}</dt><dd>{values.status ? t.enabled : t.disabled}</dd><dt>{t.aiSummary}</dt><dd>{t.enabled}</dd></dl><section><h3>{t.scenarioReports}</h3><p>{values.scenarioReports?.join(", ") || "—"}</p><h3>{t.reportScope}</h3><p>{values.reportScope || t.reportScopeEmpty}</p></section></div>;
  if (type === "Analytical Model") return <div className="mh-kcf__analysis"><Section title={t.basicInformation}><Field errorText={t.required} name="analysis_name" label={t.analysisName} value={values.analysis_name || ""} onChange={change} required invalid={invalid.includes("analysis_name")} wide placeholder={content.placeholders.analysisName} /><Field errorText={t.required} name="description" label={t.description} value={values.description || ""} onChange={change} textarea wide placeholder={content.placeholders.analysisDescription} /><Field errorText={t.required} name="trigger_when" label={t.triggerWhen} value={values.trigger_when || ""} onChange={change} textarea wide required invalid={invalid.includes("trigger_when")} placeholder={content.placeholders.triggerWhen} /></Section><Section title={t.metrics}><TagInput name="businessDomain" label={t.metricDomain} value={values.businessDomain || []} onChange={change} placeholder={content.placeholders.domainTags} /><MultiPicker name="metrics" label={t.referencedMetrics} options={content.analysis.metrics} value={values.metrics} onChange={change} open={menu === "metrics"} onMenu={onMenu} placeholder={t.selectMany} /></Section><Section title={`${t.structureGuidance} *`}><Field errorText={t.required} name="output_requirements" label={t.structureGuidance} value={values.output_requirements || ""} onChange={change} textarea wide rows={8} required invalid={invalid.includes("output_requirements")} placeholder={content.analysis.guidance}><span className="mh-kcf__help-wrap"><button type="button" className="mh-kcf__help" aria-label={t.showGuidance}>?</button><span role="tooltip" className="mh-kcf__help-tip">{content.analysis.guidance}</span></span></Field></Section><Section title={t.constraints}><Field errorText={t.required} name="analysis_constraints" label={t.prohibitedDirections} value={values.analysis_constraints || ""} onChange={change} textarea wide placeholder={content.placeholders.constraints} /></Section></div>;
  if (type === "Scenario Reporting") return <div className="mh-kcf__scenario"><div className="mh-kcf__grid"><Field errorText={t.required} name="scenario_report_title" label={t.scenarioName} value={values.scenario_report_title || ""} onChange={change} required invalid={invalid.includes("scenario_report_title")} placeholder={content.placeholders.scenarioName} /><Field errorText={t.required} name="scenario_report_linked" label={t.relatedReport} value={values.scenario_report_linked || ""} onChange={change} required invalid={invalid.includes("scenario_report_linked")} select={[{ value: "", label: content.placeholders.relatedReport }, ...content.shared.reportLinks]} /><Field errorText={t.required} name="scenario_report_description" label={t.description} value={values.scenario_report_description || ""} onChange={change} textarea wide required invalid={invalid.includes("scenario_report_description")} placeholder={content.placeholders.scenarioDescription} /><Field errorText={t.required} name="scenario_report_blueprint" label={t.structureGuidance} value={values.scenario_report_blueprint || ""} onChange={change} textarea wide rows={8} required invalid={invalid.includes("scenario_report_blueprint")} placeholder={content.scenario.guidance}><span className="mh-kcf__help-wrap"><button type="button" className="mh-kcf__help" aria-label={t.showGuidance}>?</button><span role="tooltip" className="mh-kcf__help-tip">{content.scenario.guidance}</span></span></Field><div className="mh-kcf__upload"><label>{t.upload}<input type="file" multiple accept=".doc,.docx,.pdf,.ppt,.pptx,.png,.jpg,.jpeg,.webp" onChange={(e) => change?.({ name: "attachments", value: [...(values.attachments || []), ...[...e.target.files].map((x) => x.name)] })} /></label><small>{t.uploadHint}</small><div>{(values.attachments || []).map((file) => <span className="mh-kcf__chip" key={file}>{file}<button type="button" aria-label={`Remove ${file}`} onClick={() => change?.({ name: "attachments", value: values.attachments.filter((x) => x !== file) })}>×</button></span>)}</div></div><div className="mh-kcf__status"><b>{t.aiStatus}</b><small>{t.statusHint}</small><strong>{t.disabled}</strong></div></div></div>;
  return <div className="mh-kcf__generic"><div className="mh-kcf__grid">
    {type === "Principles" && <><Field errorText={t.required} name="title" label={t.knowledgeTitle} value={values.title || ""} onChange={change} required invalid={invalid.includes("title")} wide placeholder={content.placeholders.principlesTitle} /><Field errorText={t.required} name="description" label={t.coreDescription} value={values.description || ""} onChange={change} textarea wide required invalid={invalid.includes("description")} placeholder={content.placeholders.principlesDescription} /></>}
    {type === "Report Context" && <><Field errorText={t.required} name="description" label={t.dashboardDescription} value={values.description || ""} onChange={change} textarea wide required invalid={invalid.includes("description")} /><Toggle name="aiOverview" label={values.aiOverview ? t.aiOverview : t.aiOverviewOff} checked={values.aiOverview} onChange={change} />{values.aiOverview && <><Field errorText={t.required} name="aiDescription" label={t.aiDescription} value={values.aiDescription || ""} onChange={change} textarea wide /><MultiPicker name="aiSources" label={t.aiSources} options={content.options.aiSources} value={values.aiSources} onChange={change} open={menu === "aiSources"} onMenu={onMenu} placeholder={t.selectMany} /></>}</>}
  </div><SharedFields type={type} content={content} values={values} onChange={change} menu={menu} onMenu={onMenu} placeholder={t.selectMany} /></div>;
}
