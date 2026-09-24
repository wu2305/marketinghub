import "../../tokens.css";
import "./CategoryHeading.css";


/**
 * Mid-page category heading (h2).
 * @param {object} props
 * @param {React.ReactNode} props.title
 * @param {string} [props.id] heading id for aria-labelledby
 */
export function CategoryHeading({ title, id }) {
  return (
    <header className="mh-category">
      <h2 id={id}>{title}</h2>
    </header>
  );
}
