import React from "react";
import { describe, expect, it } from "vitest";
import { exerciseStory } from "./exercises.jsx";
import { mountStory } from "./harness.jsx";
import { booleanVariants, disabledItemVariants, enumVariants, longTextVariant, manyItemsVariant } from "./variants.js";
import { Tabs } from "../components/Tabs/index.jsx";

/* The sweeps only mean something if they fail on a broken story. Each case
   below is a small component with one specific fault, run through the same
   code the real stories go through. */

let n = 0;
const story = (Component, { args = {}, argTypes = {}, isPage = false } = {}) => {
  const Story = Object.assign((props) => <Component {...args} {...props} />, { args, argTypes });
  n += 1;
  return { Story, file: `fake${n}.stories.jsx`, title: "Fake", name: Component.name, key: `fake${n}`, isPage };
};

const problems = (fake) => exerciseStory(fake).join("\n");

describe("exerciseStory reports", () => {
  it("a story that throws on render", () => {
    const Broken = () => {
      throw new Error("boom");
    };
    expect(problems(story(Broken))).toMatch(/render threw: boom/);
  });

  it("a React warning logged while a control is used", () => {
    const Warns = () => <button type="button" onClick={() => console.error("Warning: bad prop")}>Go</button>;
    expect(problems(story(Warns))).toMatch(/repeat: after <button "Go">: \[runtime\] console.error: Warning: bad prop/);
  });

  it("an error thrown by an event handler", () => {
    const Throws = () => <button type="button" onClick={() => { throw new Error("handler failed"); }}>Go</button>;
    expect(problems(story(Throws))).toMatch(/\[runtime\] uncaught: handler failed/);
  });

  it("a DOM event handed to a callback", () => {
    const Leaks = ({ onSave }) => <button type="button" onClick={onSave}>Save</button>;
    const fake = story(Leaks, { argTypes: { onSave: { action: "onSave" } } });
    expect(problems(fake)).toMatch(/\[callback-payload\] onSave onSave was called with a DOM event or node/);
  });

  it("a callback payload that is plain data is fine", () => {
    const Clean = ({ onSave }) => <button type="button" onClick={() => onSave({ reason: "button" })}>Save</button>;
    expect(problems(story(Clean, { argTypes: { onSave: { action: "onSave" } } }))).toBe("");
  });

  it("a control left in a bad state after it is used", () => {
    const Bad = () => {
      const [on, setOn] = React.useState(false);
      return (
        <div>
          <button type="button" onClick={() => setOn(true)}>Show</button>
          {on && <button type="button" />}
        </div>
      );
    };
    expect(problems(story(Bad))).toMatch(/after <button "Show">: \[accessible-name\]/);
  });

  describe("overlays", () => {
    function Host({ escape = true, closeButton = true, restoreFocus = true, hostRemovesOpener = false }) {
      const [open, setOpen] = React.useState(false);
      const openerRef = React.useRef(null);
      React.useEffect(() => {
        if (!open) return undefined;
        const onKey = (event) => event.key === "Escape" && escape && setOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
      }, [open, escape]);
      const close = () => {
        setOpen(false);
        if (restoreFocus) queueMicrotask(() => openerRef.current?.focus());
      };
      return (
        <div>
          {!(hostRemovesOpener && open) && (
            <button type="button" ref={openerRef} onClick={() => setOpen(true)}>Open settings</button>
          )}
          {open && (
            <div role="dialog" aria-modal="true" aria-label="Settings">
              {closeButton && <button type="button" onClick={close}>Close</button>}
            </div>
          )}
        </div>
      );
    }

    it("a dialog that opens, closes on Escape and opens again passes", () => {
      expect(problems(story(Host))).toBe("");
    });

    it("a dialog that neither Escape nor a Close control dismisses", () => {
      expect(problems(story(Host, { args: { escape: false, closeButton: false } }))).toMatch(/opened a dialog that neither Escape nor its dismiss control closes or reports/);
    });

    it("a dialog whose opener vanishes", () => {
      function Vanishes() {
        const [phase, setPhase] = React.useState("closed");
        return (
          <div>
            {phase === "closed" && <button type="button" onClick={() => setPhase("open")}>Open</button>}
            {phase === "open" && (
              <div role="dialog" aria-modal="true" aria-label="Once">
                <button type="button" onClick={() => setPhase("gone")}>Close</button>
              </div>
            )}
          </div>
        );
      }
      expect(problems(story(Vanishes))).toMatch(/the control that opened the dialog is gone after it closed/);
    });

    it("a dialog that closes with focus left on the page body", () => {
      function Drops() {
        const [open, setOpen] = React.useState(false);
        return (
          <div>
            <button type="button" onClick={() => setOpen(true)}>Open</button>
            {open && (
              <div role="dialog" aria-modal="true" aria-label="Drops">
                <button type="button" autoFocus onClick={() => { document.activeElement.blur(); setOpen(false); }}>Close</button>
              </div>
            )}
          </div>
        );
      }
      expect(problems(story(Drops))).toMatch(/closing the dialog left focus on the page body/);
    });

    it("a controlled dialog that only reports the close request is accepted", () => {
      const Controlled = ({ onClose }) => (
        <div role="dialog" aria-modal="true" aria-label="Pinned">
          <button type="button" onClick={() => onClose({ reason: "button" })}>Close</button>
        </div>
      );
      expect(problems(story(Controlled, { argTypes: { onClose: { action: "onClose" } } }))).toBe("");
    });
  });

  it("a Back control that does not bring the original control back", () => {
    function OneWay() {
      const [detail, setDetail] = React.useState(false);
      return detail ? <button type="button" onClick={() => setDetail(false)}>Back</button> : <button type="button" onClick={() => setDetail(true)}>Open report</button>;
    }
    function Broken() {
      const [view, setView] = React.useState("list");
      if (view === "list") return <button type="button" onClick={() => setView("detail")}>Open report</button>;
      if (view === "detail") return <button type="button" onClick={() => setView("lost")}>Back</button>;
      return <p>No way back</p>;
    }
    expect(problems(story(OneWay))).toBe("");
    expect(problems(story(Broken))).toMatch(/after its Back\/Close control the opening control is gone/);
  });
});

describe("Controls variants", () => {
  const Probe = () => <p>probe</p>;
  const make = (args, argTypes) => story(Probe, { args, argTypes });

  it("enumerates each other option of an enum arg, once per file", () => {
    const fake = make({ variant: "a" }, { variant: { control: "select", options: ["a", "b", "c"] } });
    expect(enumVariants([fake, fake]).map((v) => v.label)).toEqual(['variant="b"', 'variant="c"']);
    expect(enumVariants([make({ variant: "a" }, { variant: { options: ["a", "b"], control: false } })])).toEqual([]);
  });

  it("flips booleans", () => {
    expect(booleanVariants([make({ open: false })]).map((v) => v.overrides)).toEqual([{ open: true }]);
  });

  it("lengthens shown text but not ids, hrefs or enum values", () => {
    const fake = make(
      { title: "Short", value: "analysis", items: [{ id: "x", label: "Tab", href: "/a" }], onClick: () => {} },
      { value: { control: "select", options: ["analysis"] } },
    );
    const { overrides } = longTextVariant(fake);
    expect(overrides.title.length).toBeGreaterThan(300);
    expect(overrides.value).toBeUndefined();
    expect(overrides.items[0].label.length).toBeGreaterThan(300);
    expect(overrides.items[0].id).toBe("x");
    expect(overrides.items[0].href).toBe("/a");
    expect(overrides.onClick).toBeUndefined();
    expect(longTextVariant(make({ open: true }))).toBeNull();
  });

  it("stretches arrays of objects to 30 and leaves other arrays alone", () => {
    const { overrides } = manyItemsVariant(make({ rows: [{ id: "a", title: "A" }], names: ["x"] }));
    expect(overrides.rows).toHaveLength(30);
    expect(overrides.names).toBeUndefined();
    expect(manyItemsVariant(make({ names: ["x"] }))).toBeNull();
  });

  it("disables one item at a time", () => {
    const variants = disabledItemVariants(make({ items: [{ id: "a" }, { id: "b" }, { id: "c", disabled: true }] }));
    expect(variants.map((v) => v.label)).toEqual(["items[0] disabled", "items[1] disabled"]);
    expect(variants[1].overrides.items.map((i) => !!i.disabled)).toEqual([false, true, true]);
  });
});

describe("finding: a disabled selected tab leaves the strip unreachable by keyboard", () => {
  const items = [{ id: "a", label: "A" }, { id: "b", label: "B" }, { id: "c", label: "C" }];
  const tabs = story(Tabs, { args: { label: "View", items, value: "a" }, argTypes: { value: { control: "select", options: ["a", "b", "c"] } } });

  it("is caught on the real Tabs by disabling each item in turn", () => {
    const variants = disabledItemVariants(tabs);
    expect(variants).toHaveLength(3);
    for (const { overrides } of variants) {
      const run = mountStory(tabs, overrides);
      try {
        expect(document.querySelectorAll('[role="tab"][tabindex="0"]:not(:disabled)').length).toBe(1);
      } finally {
        run.stop();
      }
    }
  });

  it("a Tabs that gives the only Tab stop to the selected item leaves a variant with no reachable tab", () => {
    function OldTabs({ items: list, value }) {
      const selected = list.findIndex((item) => item.id === value);
      return (
        <div role="tablist" aria-label="View">
          {list.map((item, index) => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === value} disabled={item.disabled} tabIndex={index === selected ? 0 : -1}>{item.label}</button>
          ))}
        </div>
      );
    }
    const old = story(OldTabs, { args: { items, value: "a" } });
    const hits = disabledItemVariants(old).flatMap(({ overrides }) => {
      const mounted = mountStory(old, overrides);
      try {
        return [...document.querySelectorAll("[role=tablist]")].map((list) => [...list.querySelectorAll('[role="tab"]:not(:disabled)')].some((tab) => tab.tabIndex >= 0));
      } finally {
        mounted.stop();
      }
    });
    expect(hits).toContain(false);
  });
});
