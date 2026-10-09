import React from "react";
import { Modal } from "../../../components/Modal/index.jsx";
import { Switch } from "../Switch/index.jsx";
import { useOverlayLayer } from "../../../lib/overlay.js";
import { Icon } from "../../../icons.jsx";
import "./DerivedMetricPanel.css";

/** @type {readonly ["+", "-", "*", "/", "(", ")", "const", "clear", "backspace"]} */
export const formulaOperators = ["+", "-", "*", "/", "(", ")", "const", "clear", "backspace"];
const symbol = { "*": "×", "/": "÷", const: "123", clear: <Icon name="trash" />, backspace: <Icon name="backspace" /> };

/**
 * P10's derived metric drawer and formula builder.
 * @param {object} props
 * @param {boolean} props.open
 * @param {object} props.copy all visible drawer copy
 * @param {Array<object>} props.references referenceable basic metric records
 * @param {object} props.draft form values
 * @param {Array<{type:string,value:string|number,label:string}>} props.tokens
 * @param {boolean} props.constantOpen
 * @param {string} props.notice
 * @param {(event:{reason:string})=>void} props.onCancel
 * @param {(event:{field:string,value:string|boolean})=>void} props.onChange
 * @param {(event:{operator:string})=>void} props.onOperator
 * @param {(event:{metric:object})=>void} props.onReference
 * @param {(event:{index:number})=>void} props.onRemoveToken
 * @param {(event:{value:string})=>void} props.onConstantAdd
 * @param {()=>void} props.onConstantCancel
 * @param {()=>void} props.onTest
 * @param {()=>void} props.onSave
 */
export function DerivedMetricPanel({
  open = false, copy, references = [], draft = {}, tokens = [], constantOpen = false, notice = "",
  onCancel, onChange, onOperator, onReference, onRemoveToken, onConstantAdd, onConstantCancel, onTest, onSave,
}) {
  const panelRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const titleId = React.useId();
  const constantId = React.useId();
  const [constantValue, setConstantValue] = React.useState("");
  React.useEffect(() => { if (!constantOpen) setConstantValue(""); }, [constantOpen]);
  useOverlayLayer({ open, onClose: onCancel, layerRef: panelRef, initialFocusRef: closeRef });
  if (!open) return null;
  const change = (field, value) => onChange?.({ field, value });
  return (
    <>
      <div data-mh-overlay-surface className="mh-derived-overlay">
        <div className="mh-derived-overlay__scrim" onClick={() => onCancel?.({ reason: "scrim" })} />
        <aside className="mh-derived-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
          <header className="mh-derived-panel__head">
            <div><h2 id={titleId}>{copy.title}</h2><p>{copy.description}</p></div>
            <button ref={closeRef} type="button" className="mh-derived-panel__close" aria-label={copy.close} onClick={() => onCancel?.({ reason: "button" })}>×</button>
          </header>
          <div className="mh-derived-panel__body">
            <form className="mh-derived-panel__form" onSubmit={(event) => { event.preventDefault(); onSave?.(); }}>
              <label>{copy.domain}
                <select value={draft.domain || ""} onChange={(event) => change("domain", event.target.value)}>
                  <option value="">{copy.domainPlaceholder}</option>
                  {copy.domains.map((domain) => <option key={domain}>{domain}</option>)}
                </select>
              </label>
              <div className="mh-derived-panel__field-row">
                <label>{copy.name}<input value={draft.name || ""} placeholder={copy.namePlaceholder} onChange={(event) => change("name", event.target.value)} /></label>
                <label>{copy.unit}<input value={draft.unit || ""} placeholder={copy.unitPlaceholder} onChange={(event) => change("unit", event.target.value)} /></label>
              </div>
              <div className="mh-derived-panel__builder">
                <span className="mh-derived-panel__label">{copy.formula}</span>
                <div className="mh-derived-panel__tokens" aria-label={copy.formula}>
                  {tokens.length ? tokens.map((token, index) => (
                    <span key={index} className={`mh-derived-panel__token mh-derived-panel__token--${token.type}`} title={String(token.value)}>
                      {token.type === "operator" && symbol[token.value] ? symbol[token.value] : token.label}
                      {(token.type === "metric" || token.type === "constant") ? <button type="button" aria-label={`Remove ${token.label}`} onClick={() => onRemoveToken?.({ index })}>×</button> : null}
                    </span>
                  )) : <span className="mh-derived-panel__placeholder">{copy.formulaPlaceholder}</span>}
                </div>
                <div className="mh-derived-panel__operators">
                  {formulaOperators.map((operator) => <button key={operator} type="button" title={operator} aria-label={operator === "const" ? copy.constantTitle : operator} onClick={() => onOperator?.({ operator })}>{symbol[operator] || operator}</button>)}
                </div>
                <p className="mh-derived-panel__hint">{copy.formulaHint}</p>
              </div>
              <label>{copy.descriptionLabel}<textarea value={draft.description || ""} placeholder={copy.descriptionPlaceholder} onChange={(event) => change("description", event.target.value)} /></label>
              <label>{copy.synonyms}<input value={draft.synonyms || ""} placeholder={copy.synonymsPlaceholder} onChange={(event) => change("synonyms", event.target.value)} /></label>
              <div className="mh-derived-panel__toggle"><span><strong>{copy.enable}</strong><small>{copy.enableHint}</small></span><Switch label={copy.enable} checked={draft.enabled !== false} onChange={({ checked }) => change("enabled", checked)} /></div>
              <div className="mh-derived-panel__test"><span><strong>{copy.testTitle}</strong><small>{copy.testHint}</small></span><button type="button" onClick={onTest}>{copy.test}</button></div>
              {notice ? <p className="mh-derived-panel__notice" role="status">{notice}</p> : null}
            </form>
            <aside className="mh-derived-panel__references">
              <h3>{copy.referenceTitle}</h3>
              {references.map((metric) => <button type="button" key={metric.id} className="mh-derived-panel__reference" onClick={() => onReference?.({ metric })}><strong>{metric.name}</strong><small>{metric.source}</small></button>)}
            </aside>
          </div>
          <footer className="mh-derived-panel__foot"><button type="button" onClick={() => onCancel?.({ reason: "button" })}>{copy.cancel}</button><button type="button" className="mh-derived-panel__save" onClick={onSave}>{copy.save}</button></footer>
        </aside>
      </div>
      <Modal open={constantOpen} title={copy.constantTitle} titleId={constantId} onClose={onConstantCancel}>
        <form className="mh-derived-panel__constant" onSubmit={(event) => { event.preventDefault(); onConstantAdd?.({ value: constantValue }); setConstantValue(""); }}>
          <label htmlFor={`${constantId}-value`}>{copy.constantPrompt}</label>
          <input id={`${constantId}-value`} autoFocus inputMode="decimal" value={constantValue} onChange={(event) => setConstantValue(event.target.value)} />
          <div><button type="button" onClick={onConstantCancel}>{copy.cancel}</button><button type="submit">{copy.constantAdd}</button></div>
        </form>
      </Modal>
    </>
  );
}
