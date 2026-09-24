import "../../tokens.css";
import { cx } from "../../cx.js";
import "./SectionHeading.css";

export const headingLevels = ["h1", "h2", "h3"];
export const sectionHeadingVariants = ["home", "view"];

/**
 * Section heading: eyebrow + title + optional description and trailing
 * content. `variant="home"` right-aligns the description (or stacks it
 * when used alone); `variant="view"` renders the description under the
 * title, a bottom border, and `children` as trailing actions (e.g. Tabs).
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {typeof headingLevels[number]} [props.as="h2"] heading level element
 * @param {typeof sectionHeadingVariants[number]} [props.variant="home"]
 * @param {React.ReactNode} [props.children] trailing action slot
 */
export function SectionHeading({ eyebrow, title, description, as = "h2", variant = "home", children }) {
  const Title = as;
  if (variant === "view") {
    return (
      <header className="mh-heading mh-heading--view">
        <div>
          {eyebrow ? <p className="mh-heading__kicker">{eyebrow}</p> : null}
          <Title>{title}</Title>
          {description ? <p className="mh-heading__desc">{description}</p> : null}
        </div>
        {children}
      </header>
    );
  }
  return (
    <header className={cx("mh-heading", !description && !children && "mh-heading--stack")}>
      <div>
        {eyebrow ? <p className="mh-heading__kicker">{eyebrow}</p> : null}
        <Title>{title}</Title>
      </div>
      {description ? <p className="mh-heading__text">{description}</p> : null}
      {children}
    </header>
  );
}
