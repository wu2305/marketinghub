import "../../tokens.css";
import { Header } from "../../components/Header/index.jsx";
import { Button } from "../../components/Button/index.jsx";
import { ConfirmDialog } from "../../components/ConfirmDialog/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
import { BusinessTermForm } from "../../features/interpreter/BusinessTermForm/index.jsx";
import { KnowledgeCreateFields } from "../../features/knowledge-create/KnowledgeCreateFields/index.jsx";
import "./KnowledgeCreatePage.css";

/**
 * Controlled P08 page. `content` supplies visible copy, type options, and fixture data.
 * `type` selects a reachable form; `mode` is create, edit, or copy. `values`,
 * `invalid`, `result`, `dialog`, and `menu` are controlled state. Change callbacks
 * receive `{name,value}`; navigation receives `{id,params,href}`.
 * @param {object} props
 * @param {object} props.content All visible labels and form fixtures.
 * @param {object} props.logo Header logo model.
 * @param {object[]} [props.navigation=[]] Header links.
 * @param {string} props.type One of knowledgeCreateTypes.
 * @param {string} [props.mode="create"] One of knowledgeCreateModes.
 * @param {object} [props.values={}] Controlled field values.
 * @param {string[]} [props.invalid=[]] Required field names to mark invalid.
 * @param {object|null} props.result Save/submit confirmation state.
 * @param {string|null} props.dialog Active guidance, history, test, or confirm dialog.
 * @param {string|null} props.menu Open picker name.
 * @param {boolean} [props.unavailable=false] Analytical Model edit has no editable record or creator access.
 * @param {boolean} [props.reportEditAvailable=false] A Report Context edit ID resolves to its dedicated record.
 * @param {(id:string, params?: Record<string,string>) => string} props.hrefFor Route adapter.
 * @param {(event:{id:string,params: Record<string,string>,href:string}) => void} [props.onNavigate]
 * @param {(event:{value:string}) => void} [props.onTypeChange]
 * @param {(event:{name:string,value:unknown}) => void} [props.onChange]
 * @param {(event:{type:string,mode:string,values:Record<string,unknown>}) => void} [props.onSave] Save draft; `values` is the controlled `values` prop, for every type.
 * @param {(event:{type:string,mode:string,values:Record<string,unknown>}) => void} [props.onSubmit]
 * @param {(event:{type:string,mode:string,values:Record<string,unknown>}) => void} [props.onCancel]
 * @param {(event:{reason:string}) => void} [props.onResultClose]
 * @param {(event:{kind:string}) => void} [props.onDialog]
 * @param {(event?:{reason:string}) => void} [props.onDialogClose]
 * @param {(event:{name:string}) => void} [props.onMenu]
 */
export function KnowledgeCreatePage({
  content, logo, navigation = [], type, mode = "create", values = {}, invalid = [], result, dialog, menu, unavailable = false, reportEditAvailable = false,
  hrefFor, onNavigate, onTypeChange, onChange, onSave, onSubmit, onCancel, onResultClose, onDialog, onDialogClose, onMenu,
}) {
  const labels = content.labels;
  const isTerm = type === "Business Term";
  const isAnalysis = type === "Analytical Model";
  const isScenario = type === "Scenario Reporting";
  const isReportEdit = type === "Report Context" && mode === "edit" && reportEditAvailable;
  const title = isTerm ? mode === "edit" ? `${labels.editTerm} ${values.title || ""}`.trim() : content.businessTerm.title
    : isAnalysis ? mode === "edit" ? labels.editAnalysis : content.analysis.title
      : isScenario ? mode === "edit" ? labels.editScenario : content.scenario.title
        : isReportEdit ? `${labels.editReport} ${values.title || type}` : mode === "edit" ? values.title || labels.edit : mode === "copy" ? labels.copy : labels.create;
  const subtitle = isTerm ? "" : isAnalysis ? content.analysis.description : isScenario ? content.scenario.description : labels.genericDescription;
  const typeParam = { type };
  const payload = { type, mode, values };
  const save = () => onSave?.(payload);
  const submit = () => onSubmit?.(payload);
  const cancel = () => onCancel?.(payload);
  const route = (targetId, params = {}) => { const href = hrefFor(targetId, params); onNavigate?.({ id: targetId, params, href }); };
  const followLink = (event, targetId, params = {}) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.target || event.currentTarget.hasAttribute("download")) return;
    route(targetId, params);
  };
  const resultTitle = result?.action === "save" ? labels.savedTitle : labels.submittedTitle;
  const resultText = result?.action === "save" ? labels.savedText : labels.submittedText;
  const submitDisabled = isReportEdit && String(values.description || "").trim() === String(values.originalDescription || "").trim();
  return <div data-kc-type={type} data-kc-mode={mode} className={`mh-kcreate mh-kcreate--${isTerm ? "term" : isAnalysis ? "analysis" : isScenario ? "scenario" : isReportEdit ? "report-edit" : "generic"}`}>
    <Header logo={logo} items={navigation} current="interpreter" highlightCurrent={false} position="sticky" onNavigate={({ id: targetId }) => route(targetId)} />
    <main className="mh-kcreate__main">
      <div className="mh-kcreate__breadcrumb" aria-label={labels.breadcrumb}>
        {(isTerm || isAnalysis || isScenario) && <><a href={hrefFor("home")} onClick={(event) => followLink(event, "home")}>{labels.home}</a><span>/</span></>}
        <a href={hrefFor("interpreter")} onClick={(event) => followLink(event, "interpreter")}>{labels.interpreter}</a><span>/</span>
        <a href={hrefFor("interpreter")} onClick={(event) => followLink(event, "interpreter")}>{labels.management}</a><span>/</span>
        {(isTerm || isAnalysis || isScenario) && <><a href={hrefFor("interpreter", typeParam)} onClick={(event) => followLink(event, "interpreter", typeParam)}>{type}</a><span>/</span></>}
        <b>{isAnalysis && mode === "edit" ? values.analysis_name || title : title}</b>
      </div>
      <header className="mh-kcreate__head"><div><p>{labels.eyebrow}</p><h1>{title}</h1>{subtitle && <span>{subtitle}</span>}</div>{!isTerm && !isAnalysis && !isScenario && <strong>{labels.draft}</strong>}</header>
      <section className="mh-kcreate__card">
        {unavailable ? <p className="mh-kcreate__unavailable">{content.analysis.unavailable}</p> : isTerm ? <BusinessTermForm title={values.title || ""} kind={values.kind || "Business Term"} description={values.description || ""} synonyms={Array.isArray(values.synonyms) ? values.synonyms : []} scope={values.scope || []} scopeOptions={content.shared.scope} guidanceTitle={content.businessTerm.guidanceTitle} guidance={content.businessTerm.guidance} reminder={content.businessTerm.reminder} labels={content.businessTerm.labels} placeholders={content.businessTerm.placeholders} invalid={invalid} onChange={onChange} onCancel={cancel} onSave={save} onSubmit={submit} />
          : <>
            {!isAnalysis && !isScenario && !isReportEdit && <label className="mh-kcreate__type">{labels.type}<select value={type} onChange={(e) => onTypeChange?.({ value: e.target.value })}>{content.types.map((item) => <option key={item}>{item}</option>)}</select></label>}
            <form noValidate onSubmit={(event) => { event.preventDefault(); isReportEdit ? onDialog?.({ kind: "confirm" }) : submit(); }}>
              <KnowledgeCreateFields type={type} mode={isReportEdit ? "edit" : "create"} content={content} values={values} invalid={invalid} menu={menu} onChange={onChange} onMenu={onMenu} onDialog={onDialog} />
              <footer className="mh-kcreate__footer"><div><Button variant="secondary" onClick={cancel}>{labels.cancel}</Button>{!isReportEdit && <Button variant="secondary" onClick={save}>{labels.save}</Button>}<Button variant={isAnalysis || isScenario ? "gold" : "primary"} type="submit" disabled={submitDisabled}>{labels.submit}</Button></div>{isAnalysis && <p>ⓘ {content.analysis.reminder}</p>}{isScenario && <p>ⓘ {content.scenario.reminder}</p>}</footer>
            </form>
          </>}
      </section>
    </main>
    <ConfirmDialog open={Boolean(result)} purpose="info" title={resultTitle} message={resultText} closeLabel={labels.back} onCancel={onResultClose} />
    <ConfirmDialog open={dialog === "confirm"} purpose="confirm" title={labels.confirmTitle} message={labels.confirmText} cancelLabel={labels.cancel} confirmLabel={labels.submit} onCancel={onDialogClose} onConfirm={() => { onDialogClose?.(); submit(); }} />
    <ConfirmDialog open={["test", "smart", "preview"].includes(dialog)} purpose="info" title={dialog === "test" ? values.metricFormula ? labels.testSuccessTitle : labels.testEmptyTitle : dialog === "smart" ? labels.smartTitle : labels.previewTitle} message={dialog === "test" ? values.metricFormula ? labels.testSuccess : labels.testEmpty : dialog === "smart" ? labels.smartText : labels.previewText} closeLabel={labels.back} onCancel={onDialogClose} />
    <Modal open={dialog === "history"} title={labels.historyTitle} className="mh-kcreate__history" closeLabel={labels.close} onClose={onDialogClose}><p><b>{labels.currentVersion}</b> · {content.reportHistory.author} · {values.updatedAt}</p><p>{values.originalDescription}</p><p><b>{labels.previousVersion}</b> · {content.reportHistory.priorAuthor} · {content.reportHistory.priorDate}</p><p>{content.reportHistory.priorDescription}</p></Modal>
  </div>;
}
