import { fireEvent } from "@testing-library/react";
import { controls, describe as nameElement, dismissers, isDisabled, nameOf, overlays, reachable, roleOf } from "./dom.js";
import { mountStory } from "./harness.jsx";
import { check } from "./invariants.js";

/* Every story, used the way a person uses it: each control activated twice in
   a row, then every surface it opens dismissed and opened again. Nothing may
   throw, warn, leak a DOM event into a callback, or leave the page failing an
   invariant; an overlay must go away on Escape or its dismiss control, give
   focus back, and open again from the same control. */

/* A page holds hundreds of controls that its parts already cover as stories of
   their own; each story is exercised through its first controls and the ones
   they reveal. */
const maxControls = (story) => (story.isPage ? 12 : 24);
const MAX_PASSES = 2;

const TEXT_TYPES = /^(checkbox|radio|file|button|submit|reset|image|range|color|hidden)$/;

/** Do the one thing a person does with this control. */
function operate(element) {
  const tag = element.localName;
  if (tag === "select") {
    const options = [...element.options];
    if (options.length) fireEvent.change(element, { target: { value: options.at(-1).value } });
  } else if (tag === "textarea" || (tag === "input" && !TEXT_TYPES.test(element.type))) {
    fireEvent.change(element, { target: { value: "acceptance text" } });
    fireEvent.keyDown(element, { key: "Enter" });
  } else if (!(tag === "input" && element.type === "file")) {
    fireEvent.click(element);
  }
}

const body = () => document.body;

const signature = (element) => `${roleOf(element)}\u0000${nameOf(element)}`;

/**
 * The controls a page file's first story already offers (header, navigation,
 * launcher). The file's other stories are about what they add, so they are
 * exercised without these.
 */
export function shellOf(first) {
  const run = mountStory(first);
  try {
    return new Set(controls(document.body).map(signature));
  } finally {
    run.stop();
  }
}
const scope = () => reachable(document);
const unique = (list) => [...new Set(list)];
const text = (v) => `[${v.rule}] ${v.target} ${v.detail}`;

/** Controls with the role, name and position among same-named twins needed to find them again after a re-render. */
function indexControls(limit, shell) {
  const seen = new Map();
  return controls(scope()).filter((element) => !shell.has(signature(element))).slice(0, limit).map((element) => {
    const role = roleOf(element);
    const name = nameOf(element);
    const key = `${role}\u0000${name}`;
    const index = seen.get(key) ?? 0;
    seen.set(key, index + 1);
    return {
      element,
      label: nameElement(element),
      find: () => controls(scope()).filter((other) => roleOf(other) === role && nameOf(other) === name)[index] ?? null,
    };
  });
}

function repeatedActions(run, story, shell, afterUse) {
  const found = [];
  const used = new WeakSet();
  let seen = run.errors.length;
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    const batch = controls(scope()).filter((element) => !used.has(element) && !shell.has(signature(element))).slice(0, maxControls(story));
    if (!batch.length) break;
    for (const element of batch) {
      if (!element.isConnected) continue;
      used.add(element);
      const label = nameElement(element);
      for (let round = 0; round < 2 && element.isConnected && !isDisabled(element); round += 1) operate(element);
      const fresh = run.errors.slice(seen);
      seen = run.errors.length;
      found.push(...fresh.map((detail) => `after ${label}: [runtime] ${detail}`));
      found.push(...afterUse(label));
    }
  }
  found.push(...run.problems().filter((v) => v.rule !== "runtime").map(text));
  return found;
}

const pressEscape = () => fireEvent.keyDown(document.activeElement ?? body(), { key: "Escape", code: "Escape" });
const closeCallback = /close|cancel|dismiss|back/i;

function openAndClose(run, story, shell, afterUse) {
  const found = [];
  try {
    const openers = indexControls(maxControls(story), shell);
    for (const { element, find, label } of openers) {
      if (!element.isConnected || !scope().contains(element)) continue;
      const host = element.closest("[role=dialog], [role=alertdialog], [aria-modal=true], dialog");
      const before = overlays(document);
      const known = new Set(controls(body()).map(signature));
      const callsBefore = run.calls.length;
      element.focus();
      operate(element);
      const opened = overlays(document).filter((overlay) => !before.includes(overlay));
      if (opened.length) {
        pressEscape();
        let closed = opened.every((overlay) => !overlay.isConnected);
        if (!closed) {
          const dismiss = dismissers(opened[0])[0];
          if (dismiss) operate(dismiss);
          closed = opened.every((overlay) => !overlay.isConnected);
        }
        const asked = run.calls.slice(callsBefore).some((call) => closeCallback.test(call.name));
        if (!closed && !asked) found.push(`${label}: opened a dialog that neither Escape nor its dismiss control closes or reports`);
        // Escape closes the surface that holds a popup's opener along with the popup; then there is nothing to reopen.
        if (closed && !(host && (!host.isConnected || !controls(body()).some((control) => host.contains(control))))) {
          if (document.activeElement === body() && element.isConnected) found.push(`${label}: closing the dialog left focus on the page body`);
          if (document.body.classList.contains("dialog-open") && !overlays(document).length) found.push(`${label}: scroll lock stayed on after the last dialog closed`);
          const again = find();
          if (!again) found.push(`${label}: the control that opened the dialog is gone after it closed`);
          else {
            operate(again);
            if (!overlays(document).some((overlay) => !before.includes(overlay))) found.push(`${label}: the dialog did not open a second time`);
            else pressEscape();
          }
        }
      } else {
        // A view switch: if it brought a Back/Close/Cancel control, using it must restore the original control.
        const back = dismissers(body()).find((control) => !known.has(signature(control)));
        if (back) {
          operate(back);
          const again = find();
          if (!again) found.push(`${label}: after its Back/Close control the opening control is gone`);
          else {
            operate(again);
            if (!dismissers(body()).some((control) => !known.has(signature(control)))) found.push(`${label}: the second time, no Back/Close control appeared`);
          }
        }
      }
      found.push(...run.errors.map((detail) => `after ${label}: [runtime] ${detail}`));
      run.errors.length = 0;
      found.push(...afterUse(label));
    }
  } finally {
    run.errors.length = 0;
  }
  return found;
}

/**
 * One mount per story: close and reopen every surface it offers, then use every
 * control twice. Returns the problems found, each prefixed with the phase.
 */
export function exerciseStory(story, shell = new Set()) {
  const run = mountStory(story);
  /* Invariants are re-checked only after a control changed the page. */
  const changes = new MutationObserver(() => {});
  changes.observe(body(), { subtree: true, childList: true, attributes: true, characterData: true });
  const afterUse = (label) => (changes.takeRecords().length ? check(body()).map((v) => `after ${label}: ${text(v)}`) : []);
  try {
    return unique([
      ...run.problems().map((v) => `mount: ${text(v)}`),
      ...openAndClose(run, story, shell, afterUse).map((line) => `close/reopen: ${line}`),
      ...repeatedActions(run, story, shell, afterUse).map((line) => `repeat: ${line}`),
    ]);
  } finally {
    changes.disconnect();
    run.stop();
  }
}

