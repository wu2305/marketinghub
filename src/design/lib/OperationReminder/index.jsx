import "../../tokens.css";
import React from "react";
import "./OperationReminder.css";

/**
 * Footer note beside a form's actions: a bordered "i" mark and the Save vs
 * Submit consequence. Private to the form footers that use it.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function OperationReminder({ children }) {
  return <p className="mh-reminder"><span aria-hidden="true">i</span><span>{children}</span></p>;
}
