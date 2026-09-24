import "../../tokens.css";
import "./ViewHeading.css";


/**
 * In-page view heading; `children` render as trailing actions (e.g. Tabs).
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {React.ReactNode} [props.children]
 */
export function ViewHeading({ eyebrow, title, description, children }) {
  return (
    <header className="mh-view-heading">
      <div>
        {eyebrow ? <p className="mh-view-heading__kicker">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </header>
  );
}
