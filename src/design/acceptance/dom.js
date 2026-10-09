/* DOM helpers for the story acceptance suite: roles, accessible names, the
   interactive controls of a story, and the overlays it opens. They read the
   jsdom tree only (no layout, no stylesheet), so they judge what a keyboard or
   screen-reader user is offered, not how it is painted. */

const INTERACTIVE =
  "button, a[href], input:not([type=hidden]), select, textarea, summary, " +
  "[role=button], [role=tab], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], " +
  "[role=checkbox], [role=radio], [role=switch], [role=option], [role=link]";

const OVERLAY = "[role=dialog], [role=alertdialog], [aria-modal=true], dialog[open]";

const INPUT_ROLES = {
  checkbox: "checkbox",
  radio: "radio",
  range: "slider",
  number: "spinbutton",
  button: "button",
  submit: "button",
  reset: "button",
  image: "button",
  search: "searchbox",
  file: null,
};

export function roleOf(element) {
  const explicit = element.getAttribute("role")?.trim().split(/\s+/)[0];
  if (explicit) return explicit;
  switch (element.localName) {
    case "button": return "button";
    case "a": return element.hasAttribute("href") ? "link" : null;
    case "textarea": return "textbox";
    case "select": return element.multiple || element.size > 1 ? "listbox" : "combobox";
    case "input": {
      const type = (element.getAttribute("type") || "text").toLowerCase();
      return type in INPUT_ROLES ? INPUT_ROLES[type] : "textbox";
    }
    default: return null;
  }
}

export const isHidden = (element) => Boolean(element.closest("[hidden], [aria-hidden=true], [inert]"));

export const isDisabled = (element) =>
  element.matches(":disabled") || element.getAttribute("aria-disabled") === "true";

function textOf(node) {
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeType !== 1 || node.getAttribute("aria-hidden") === "true" || node.hidden) return "";
  const label = node.getAttribute("aria-label");
  if (label) return ` ${label} `;
  if (node.localName === "img") return node.getAttribute("alt") || "";
  if (node.localName === "svg") return node.querySelector("title")?.textContent || "";
  return [...node.childNodes].map(textOf).join("");
}

const clean = (text) => text.replace(/\s+/g, " ").trim();

function idrefText(element, attribute) {
  const doc = element.ownerDocument;
  return clean(
    (element.getAttribute(attribute) || "")
      .split(/\s+/)
      .map((id) => (id ? doc.getElementById(id) : null))
      .filter(Boolean)
      .map(textOf)
      .join(" "),
  );
}

/* Roles whose name must be given (aria-label, aria-labelledby, title), not read from what they contain. */
const NO_CONTENT_NAME = new Set(["dialog", "alertdialog", "textbox", "searchbox", "combobox", "listbox", "tablist", "radiogroup", "toolbar", "menu", "group"]);

/** Accessible name, close enough to the accname algorithm for our controls. */
export function nameOf(element) {
  const labelled = idrefText(element, "aria-labelledby");
  if (labelled) return labelled;
  const label = clean(element.getAttribute("aria-label") || "");
  if (label) return label;
  if (element.labels?.length) {
    const fromLabels = clean([...element.labels].map(textOf).join(" "));
    if (fromLabels) return fromLabels;
  }
  const tag = element.localName;
  if (tag === "input" && /^(button|submit|reset)$/i.test(element.type)) {
    if (element.value) return clean(element.value);
  }
  if (tag === "input" && element.type === "image") return clean(element.getAttribute("alt") || "");
  if (!["input", "select", "textarea"].includes(tag) && !NO_CONTENT_NAME.has(roleOf(element))) {
    const fromContent = clean([...element.childNodes].map(textOf).join(""));
    if (fromContent) return fromContent;
  }
  return clean(element.getAttribute("title") || "");
}

export function describe(element) {
  const role = roleOf(element);
  const name = nameOf(element).slice(0, 40);
  return `<${element.localName}${role && role !== element.localName ? ` role=${role}` : ""}${name ? ` "${name}"` : ""}>`;
}

/** Enabled, visible controls in document order. */
export function controls(root) {
  return [...root.querySelectorAll(INTERACTIVE)].filter((element) => !isDisabled(element) && !isHidden(element));
}

/** Every control, enabled or not, without the visibility test (cheap membership snapshot). */
export const allControls = (root) => new Set(root.querySelectorAll(INTERACTIVE));

export function overlays(doc) {
  return [...doc.querySelectorAll(OVERLAY)].filter((element) => !isHidden(element));
}

/**
 * The part of the page a person can reach: everything, or only the topmost
 * modal dialog while one is open (the rest of the page is behind its scrim).
 */
export function reachable(doc) {
  const modals = [...doc.querySelectorAll("[aria-modal=true]")].filter((element) => !isHidden(element));
  return modals.at(-1) ?? doc.body;
}

const DISMISS = /^(close|cancel|back|dismiss|done|[×✕x])\b|^(close|cancel|back)\b/i;

/** The buttons that dismiss a surface: Close, Cancel, Back, ×. */
export function dismissers(root) {
  return controls(root).filter((element) => DISMISS.test(nameOf(element)) || DISMISS.test(nameOf(element).replace(/^[←‹<]\s*/, "")));
}
