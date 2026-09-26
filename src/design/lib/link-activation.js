/** Notify SPA hosts only for a plain primary activation; native link behavior
 * owns modified clicks, middle clicks, downloads and new-window targets. */
export function isPlainPrimaryLink(event) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.currentTarget.target && !event.currentTarget.hasAttribute("download");
}
