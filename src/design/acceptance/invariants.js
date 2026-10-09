import { controls, describe, isHidden, isDisabled, nameOf, roleOf } from "./dom.js";

/* Rules every story must satisfy in every state the acceptance suite reaches.
   Each rule reads a document tree and returns violations; none needs layout.
   `invariants.test.js` proves each one fails on a minimal bad fixture. */

/** ARIA state/property -> roles that support it (WAI-ARIA 1.2, trimmed to what our controls use). */
export const ARIA_SUPPORT = {
  "aria-required": ["checkbox", "combobox", "gridcell", "listbox", "radiogroup", "searchbox", "spinbutton", "textbox", "tree", "treegrid"],
  "aria-invalid": ["checkbox", "combobox", "gridcell", "listbox", "radiogroup", "searchbox", "slider", "spinbutton", "switch", "textbox", "tree", "treegrid"],
  "aria-checked": ["checkbox", "menuitemcheckbox", "menuitemradio", "option", "radio", "switch", "treeitem"],
  "aria-selected": ["columnheader", "gridcell", "option", "row", "rowheader", "tab", "treeitem"],
  "aria-pressed": ["button"],
  "aria-multiselectable": ["grid", "listbox", "tablist", "tree", "treegrid"],
  "aria-modal": ["dialog", "alertdialog"],
  "aria-expanded": ["application", "button", "checkbox", "columnheader", "combobox", "gridcell", "link", "listbox", "menuitem", "menuitemcheckbox", "menuitemradio", "row", "rowheader", "switch", "tab", "treeitem"],
};

const violation = (rule, element, detail) => ({ rule, target: describe(element), detail });

function ariaSupport(root) {
  const found = [];
  for (const element of root.querySelectorAll("*")) {
    for (const [attribute, roles] of Object.entries(ARIA_SUPPORT)) {
      if (!element.hasAttribute(attribute)) continue;
      const role = roleOf(element);
      if (!roles.includes(role)) found.push(violation("aria-support", element, `${attribute} is not supported on role ${role ?? "(none)"}`));
    }
  }
  return found;
}

function idReferences(root) {
  const found = [];
  const doc = root.ownerDocument || root;
  const seen = new Map();
  for (const element of doc.querySelectorAll("[id]")) {
    if (!element.id) continue;
    if (seen.has(element.id)) found.push(violation("duplicate-id", element, `id "${element.id}" is used more than once`));
    seen.set(element.id, element);
  }
  for (const attribute of ["aria-labelledby", "aria-describedby"]) {
    for (const element of root.querySelectorAll(`[${attribute}]`)) {
      for (const id of element.getAttribute(attribute).split(/\s+/).filter(Boolean)) {
        if (!doc.getElementById(id)) found.push(violation("dangling-idref", element, `${attribute}="${id}" points at nothing`));
      }
    }
  }
  for (const label of root.querySelectorAll("label[for]")) {
    if (!doc.getElementById(label.getAttribute("for"))) {
      found.push(violation("dangling-idref", label, `for="${label.getAttribute("for")}" points at nothing`));
    }
  }
  return found;
}

function accessibleNames(root) {
  const found = [];
  for (const element of controls(root)) {
    if (element.localName === "input" && element.type === "file") continue;
    if (!nameOf(element)) found.push(violation("accessible-name", element, "control has no accessible name"));
  }
  for (const element of root.querySelectorAll("[role=dialog], [role=alertdialog], dialog")) {
    if (!isHidden(element) && !nameOf(element)) found.push(violation("accessible-name", element, "dialog has no accessible name"));
  }
  for (const image of root.querySelectorAll("img")) {
    if (!isHidden(image) && !image.hasAttribute("alt")) found.push(violation("accessible-name", image, "img has no alt attribute"));
  }
  return found;
}

/** dt/dd only directly under dl, or under a div that is a direct child of dl. */
function listMarkup(root) {
  const found = [];
  for (const term of root.querySelectorAll("dt, dd")) {
    const parent = term.parentElement;
    const ok = parent?.localName === "dl" || (parent?.localName === "div" && parent.parentElement?.localName === "dl");
    if (!ok) found.push(violation("markup", term, `${term.localName} must sit directly in a dl (or in a div that is a direct child of it)`));
  }
  for (const list of root.querySelectorAll("dl")) {
    for (const child of list.children) {
      if (!["dt", "dd", "div", "script", "template"].includes(child.localName)) {
        found.push(violation("markup", child, `${child.localName} is not allowed directly in a dl`));
      } else if (child.localName === "div" && [...child.children].some((grand) => !["dt", "dd"].includes(grand.localName))) {
        found.push(violation("markup", child, "a div in a dl may hold only dt and dd"));
      }
    }
  }
  for (const item of root.querySelectorAll("li")) {
    if (!["ul", "ol", "menu"].includes(item.parentElement?.localName)) found.push(violation("markup", item, "li must sit directly in ul, ol or menu"));
  }
  return found;
}

const ITEM_ROLES = { tablist: ["tab"], radiogroup: ["radio"], menu: ["menuitem", "menuitemcheckbox", "menuitemradio"], toolbar: [] };

/** A composite widget with at least one enabled item must offer a Tab stop. */
function widgetTabStops(root) {
  const found = [];
  for (const group of root.querySelectorAll("[role=tablist], [role=radiogroup], [role=menu]")) {
    if (isHidden(group)) continue;
    const role = group.getAttribute("role");
    const items = [...group.querySelectorAll(ITEM_ROLES[role].map((item) => `[role=${item}]`).join(",") || "[role=none]")];
    const enabled = items.filter((item) => !isDisabled(item));
    if (!enabled.length) continue;
    const stops = enabled.filter((item) => item.tabIndex >= 0);
    if (!stops.length) found.push(violation("tab-stop", group, `${role} has ${enabled.length} enabled item(s) but none can be reached with Tab`));
  }
  return found;
}

function tabOrder(root) {
  const found = [];
  for (const element of root.querySelectorAll("[tabindex]")) {
    if (element.tabIndex > 0) found.push(violation("tab-order", element, `tabindex=${element.tabIndex} overrides the natural Tab order`));
  }
  return found;
}

export const RULES = {
  "aria-support": ariaSupport,
  "id-references": idReferences,
  "accessible-name": accessibleNames,
  markup: listMarkup,
  "tab-stop": widgetTabStops,
  "tab-order": tabOrder,
};

/** Run every rule over `root` (an element or a document). */
export function check(root = document.body) {
  return Object.values(RULES).flatMap((rule) => rule(root));
}
