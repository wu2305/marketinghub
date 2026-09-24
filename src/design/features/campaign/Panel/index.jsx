import "../../../tokens.css";
import "./Panel.css";


/**
 * Bordered section panel with heading and optional actions slot.
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.meta] small trailing text in the header
 * @param {React.ReactNode} [props.actions] trailing header actions; overrides meta
 * @param {React.ReactNode} [props.children]
 */
export function Panel({ eyebrow, title, meta, actions, children }) {
  return (
    <section className="mh-panel">
      <header className="mh-panel__head">
        <div>
          {eyebrow ? <p className="mh-panel__kicker">{eyebrow}</p> : null}
          <h3>{title}</h3>
        </div>
        {actions || (meta ? <small>{meta}</small> : null)}
      </header>
      <div className="mh-panel__body">{children}</div>
    </section>
  );
}
