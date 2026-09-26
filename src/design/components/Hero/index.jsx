import "../../tokens.css";
import React from "react";
import { cx } from "../../cx.js";
import "./Hero.css";

/** @type {readonly ["banner", "home", "knowledge"]} */
export const heroVariants = ["banner", "home", "knowledge"];
/** @type {readonly ["banner", "home", "knowledge", "none"]} */
export const heroScrims = ["banner", "home", "knowledge", "none"];

/**
 * Image hero with title, description and optional aside content (stats, ask bar).
 * @param {object} props
 * @param {string} [props.image] background image URL
 * @param {string} [props.eyebrow]
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {number} [props.height=260]
 * @param {typeof heroVariants[number]} [props.variant="banner"]
 * @param {typeof heroScrims[number]} [props.scrim="banner"]
 * @param {string} [props.titleId] defaults to a generated useId
 * @param {string} [props.asideLabel] aria-label on the aside group (original `.knowledge-hero-stats`)
 * @param {React.ReactNode} [props.children] renders in the hero aside
 */
export function Hero({
  image,
  eyebrow,
  title,
  description,
  height = 260,
  variant = "banner",
  scrim = "banner",
  titleId,
  asideLabel,
  children,
}) {
  const generatedTitleId = React.useId();
  const headingId = titleId || generatedTitleId;
  return (
    <section className={cx("mh-hero", `mh-hero--${variant}`)} style={{ height, minHeight: height }} aria-labelledby={headingId}>
      <div className="mh-hero__media" aria-hidden="true">
        {image ? <img src={image} alt="" /> : null}
        {scrim !== "none" ? <div className={cx("mh-hero__scrim", `mh-hero__scrim--${scrim}`)} /> : null}
      </div>
      <div className="mh-hero__layout">
        <div className="mh-hero__copy">
          {eyebrow ? <p className="mh-hero__eyebrow">{eyebrow}</p> : null}
          <h1 id={headingId}>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {children ? <div className="mh-hero__aside" role={asideLabel ? "group" : undefined} aria-label={asideLabel}>{children}</div> : null}
      </div>
    </section>
  );
}
