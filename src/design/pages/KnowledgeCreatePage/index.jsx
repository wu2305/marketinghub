import "../../tokens.css";
import React from "react";
import { useFocusFirstInvalid } from "../../lib/focus-first-invalid.js";
import { Header } from "../../components/Header/index.jsx";
import { Button } from "../../components/Button/index.jsx";
import { ConfirmDialog } from "../../components/ConfirmDialog/index.jsx";
import { OperationReminder } from "../../lib/OperationReminder/index.jsx";
import { Modal } from "../../components/Modal/index.jsx";
import { BusinessTermForm } from "../../features/interpreter/BusinessTermForm/index.jsx";
import { KnowledgeCreateFields } from "../../features/knowledge-create/KnowledgeCreateFields/index.jsx";
import "./KnowledgeCreatePage.css";

const NO_INVALID = [];

/**
 * Knowledge create page. It creates or edits one knowledge record.
 * `content` supplies visible copy. `type` selects the form. `mode` is create, edit, or copy.
 * Cancel does not save. The page sends `{type, mode, values}` on Save and Submit. The demo hook sets status and stage.
 * @param {object} props
 * @param {object} props.content All visible labels and form fixtures. // 全部可见标签与表单夹具。
 * @param {object} props.logo Header logo model. // 页头 Logo 模型。
 * @param {object[]} [props.navigation=[]] Header links. // 页头链接。
 * @param {string} props.type One of knowledgeCreateTypes. // knowledgeCreateTypes 之一。
 * @param {string} [props.mode="create"] One of knowledgeCreateModes. // knowledgeCreateModes 之一。
 * @param {object} [props.values={}] Controlled field values. // 受控的字段值。
 * @param {string[]} [props.invalid=[]] Required field names to mark invalid. // 需要标记为无效的必填字段名。
 * @param {object|null} props.result Save or Submit confirmation state. // Save 或 Submit 后的确认状态。
 * @param {string|null} props.dialog Active guidance, history, test, confirm, or discard dialog. // 当前打开的引导、历史、测试、确认或放弃对话框。
 * @param {string|null} props.menu Open picker name. // 已打开的选择器名称。
 * @param {boolean} [props.unavailable=false] Analytical Model edit has no editable record or creator access. // 该 Analytical Model 编辑没有可编辑的记录或创建者权限。
 * @param {boolean} [props.reportEditAvailable=false] A Report Context edit ID resolves to its dedicated record. // Report Context 的编辑 ID 会解析到其专属记录。
 * @param {(id:string, params?: Record<string,string>) => string} props.hrefFor Function that turns a route id into an href. // 把路由 id 转成 href 的函数。
 * @param {(event:{id:string,params: Record<string,string>,href:string}) => void} [props.onNavigate] The function runs when a link opens another page. // 链接要打开另一页时会调用这个函数。
 * @param {(event:{value:string}) => void} [props.onTypeChange] The function runs when the knowledge type changes. // 知识类型变化时会调用这个函数。
 * @param {(event:{name:string,value:unknown}) => void} [props.onChange] The function runs at each field change. // 每次字段变化都会调用这个函数。
 * @param {(event:{type:string,mode:string,values:Record<string,unknown>}) => void} [props.onSave] The function runs on Save. The page sends `{type, mode, values}`. // 点击 Save 时会调用这个函数。页面发出 `{type, mode, values}`。
 * @param {(event:{type:string,mode:string,values:Record<string,unknown>}) => void} [props.onSubmit] The function runs on Submit. The page sends `{type, mode, values}`. // 点击 Submit 时会调用这个函数。页面发出 `{type, mode, values}`。
 * @param {(event:{type:string,mode:string,values:Record<string,unknown>}) => void} [props.onCancel] The function runs on Cancel. Cancel does not save. // 点击 Cancel 时会调用这个函数。Cancel 不保存。
 * @param {(event:{reason:string}) => void} [props.onResultClose] The function runs when the result dialog closes. // 结果对话框关闭时会调用这个函数。
 * @param {(event:{kind:string}) => void} [props.onDialog] The function runs when a dialog opens. // 对话框打开时会调用这个函数。
 * @param {(event?:{reason:string}) => void} [props.onDialogClose] The function runs when a dialog closes. // 对话框关闭时会调用这个函数。
 * @param {(event:{type:string,mode:string,values:Record<string,unknown>}) => void} [props.onDiscard] The function runs after Discard on Analytical Model. // Analytical Model 确认 Discard 后会调用这个函数。
 * @param {(event:{name:string}) => void} [props.onMenu] The function runs when a picker opens or closes. // 选择器打开或关闭时会调用这个函数。
 */
export function KnowledgeCreatePage({
  content, logo, navigation = [], type, mode = "create", values = {}, invalid = [], result, dialog, menu, unavailable = false, reportEditAvailable = false,
  hrefFor, onNavigate, onTypeChange, onChange, onSave, onSubmit, onCancel, onDiscard, onResultClose, onDialog, onDialogClose, onMenu,
}) {
  const labels = content.labels;
  const cardRef = React.useRef(null);
  /* Business Term's own form moves focus itself (a host can compose it alone), so the page leaves it that one. */
  useFocusFirstInvalid(cardRef, type === "Business Term" ? NO_INVALID : invalid);
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
  const resultCopy = isAnalysis ? content.analysis.results[result?.action === "save" ? "save" : "submit"]
    : result?.action === "save" ? { title: labels.savedTitle, text: labels.savedText } : { title: labels.submittedTitle, text: labels.submittedText };
  const analysis = content.analysis;
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
      <section className="mh-kcreate__card" ref={cardRef}>
        {unavailable ? <p className="mh-kcreate__unavailable">{content.analysis.unavailable}</p> : isTerm ? <BusinessTermForm title={values.title || ""} kind={values.kind || "Business Term"} description={values.description || ""} synonyms={Array.isArray(values.synonyms) ? values.synonyms : []} scope={values.scope || []} scopeOptions={content.shared.scope} guidanceTitle={content.businessTerm.guidanceTitle} guidance={content.businessTerm.guidance} reminder={content.businessTerm.reminder} labels={content.businessTerm.labels} placeholders={content.businessTerm.placeholders} invalid={invalid} onChange={onChange} onCancel={cancel} onSave={save} onSubmit={submit} />
          : <>
            {!isAnalysis && !isScenario && !isReportEdit && <label className="mh-kcreate__type">{labels.type}<select value={type} onChange={(e) => onTypeChange?.({ value: e.target.value })}>{content.types.map((item) => <option key={item}>{item}</option>)}</select></label>}
            <form noValidate onSubmit={(event) => { event.preventDefault(); isReportEdit ? onDialog?.({ kind: "confirm" }) : submit(); }}>
              <KnowledgeCreateFields type={type} mode={isReportEdit ? "edit" : "create"} content={content} values={values} invalid={invalid} menu={menu} onChange={onChange} onMenu={onMenu} onDialog={onDialog} />
              <footer className="mh-kcreate__footer"><div><Button variant="secondary" onClick={cancel}>{labels.cancel}</Button>{!isReportEdit && <Button variant="secondary" onClick={save}>{isAnalysis ? analysis.saveLabel : isScenario ? content.scenario.saveLabel : labels.save}</Button>}<Button variant={isAnalysis || isScenario ? "gold" : "primary"} type="submit" disabled={submitDisabled}>{isAnalysis ? analysis.submitLabel : isScenario ? content.scenario.submitLabel : labels.submit}</Button></div>{isAnalysis && <OperationReminder>{analysis.reminder}</OperationReminder>}{isScenario && <OperationReminder>{content.scenario.reminder}</OperationReminder>}</footer>
            </form>
          </>}
      </section>
    </main>
    <ConfirmDialog open={Boolean(result)} purpose="info" title={resultCopy.title} message={resultCopy.text} closeLabel={labels.back} onCancel={onResultClose} />
    <ConfirmDialog open={dialog === "discard"} purpose="confirm" title={analysis.discard.title} message={analysis.discard.text} cancelLabel={analysis.discard.keep} confirmLabel={analysis.discard.confirm} onCancel={onDialogClose} onConfirm={() => { onDialogClose?.(); onDiscard?.(payload); }} />
    <ConfirmDialog open={dialog === "confirm"} purpose="confirm" title={labels.confirmTitle} message={labels.confirmText} cancelLabel={labels.cancel} confirmLabel={labels.submit} onCancel={onDialogClose} onConfirm={() => { onDialogClose?.(); submit(); }} />
    <ConfirmDialog open={["test", "smart", "preview"].includes(dialog)} purpose="info" title={dialog === "test" ? values.metricFormula ? labels.testSuccessTitle : labels.testEmptyTitle : dialog === "smart" ? labels.smartTitle : labels.previewTitle} message={dialog === "test" ? values.metricFormula ? labels.testSuccess : labels.testEmpty : dialog === "smart" ? labels.smartText : labels.previewText} closeLabel={labels.back} onCancel={onDialogClose} />
    <Modal open={dialog === "history"} title={labels.historyTitle} className="mh-kcreate__history" closeLabel={labels.close} onClose={onDialogClose}><p><b>{labels.currentVersion}</b> · {content.reportHistory.author} · {values.updatedAt}</p><p>{values.originalDescription}</p><p><b>{labels.previousVersion}</b> · {content.reportHistory.priorAuthor} · {content.reportHistory.priorDate}</p><p>{content.reportHistory.priorDescription}</p></Modal>
  </div>;
}
