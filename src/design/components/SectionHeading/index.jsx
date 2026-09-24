import "../../tokens.css";
import { cx } from "../../cx.js";
import "./SectionHeading.css";

export const headingLevels = ["h1", "h2", "h3"];

/**
 * Section heading with optional eyebrow and trailing description.
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {typeof headingLevels[number]} [props.as="h2"] heading level element
 */
export function SectionHeading({ eyebrow, title, description, as = "h2" }) {
  const Title = as;
  return (
    <header className={cx("mh-heading", !description && "mh-heading--stack")}>
      <div>
        {eyebrow ? <p className="mh-heading__kicker">{eyebrow}</p> : null}
        <Title>{title}</Title>
      </div>
      {description ? <p className="mh-heading__text">{description}</p> : null}
    </header>
  );
}
