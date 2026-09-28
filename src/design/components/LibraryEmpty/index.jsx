import "../../tokens.css";
import { Button } from "../Button/index.jsx";
import "./LibraryEmpty.css";

/** @type {readonly ["no-results", "empty"]} */
export const libraryEmptyKinds = ["no-results", "empty"];

/**
 * Empty state of a governed library (patterns/library.md §2). `no-results`
 * means filters hid everything and offers to clear them; `empty` means the
 * collection has nothing yet.
 * @param {object} props
 * @param {typeof libraryEmptyKinds[number]} [props.kind="no-results"]
 * @param {string} props.title
 * @param {string} [props.message]
 * @param {string} [props.clearLabel="Clear filters"] no-results only
 * @param {(event: { kind: string }) => void} [props.onClear] no-results only; omit to hide the button
 */
export function LibraryEmpty({ kind = "no-results", title, message, clearLabel = "Clear filters", onClear }) {
  return (
    <div className="mh-library-empty" data-kind={kind} role="status">
      <p className="mh-library-empty__title">{title}</p>
      {message ? <p className="mh-library-empty__message">{message}</p> : null}
      {kind === "no-results" && onClear ? (
        <Button variant="secondary" size="sm" onClick={() => onClear({ kind })}>{clearLabel}</Button>
      ) : null}
    </div>
  );
}
