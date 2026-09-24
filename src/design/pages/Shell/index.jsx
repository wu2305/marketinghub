import "../../tokens.css";
import { cx } from "../../cx.js";
import "./Shell.css";


export function Shell({ tone = "workspace", className, children }) {
  return <div className={cx("mh-page", `mh-page--${tone}`, className)}>{children}</div>;
}
