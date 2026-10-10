import { afterEach, describe, expect, it } from "vitest";
import { check, RULES } from "./invariants.js";

/* Each rule must fail on a minimal bad page and pass on the matching good one;
   otherwise the story sweeps could pass while checking nothing. */

const page = (html) => {
  document.body.innerHTML = html;
  return document.body;
};
afterEach(() => {
  document.body.innerHTML = "";
});

const rulesHit = (html) => [...new Set(check(page(html)).map((v) => v.rule))];

describe("aria-support", () => {
  it("rejects aria-required, aria-invalid and aria-selected on a plain button", () => {
    expect(rulesHit('<button aria-required="true">Domain</button>')).toEqual(["aria-support"]);
    expect(rulesHit('<button aria-invalid="true">Domain</button>')).toEqual(["aria-support"]);
    expect(rulesHit('<button aria-selected="true">Fields</button>')).toEqual(["aria-support"]);
  });
  it("accepts them where the role supports them", () => {
    expect(rulesHit('<label>Name <input aria-required="true" aria-invalid="true"></label>')).toEqual([]);
    expect(rulesHit('<div role="tablist" aria-label="t"><button role="tab" aria-selected="true">A</button></div>')).toEqual([]);
    expect(rulesHit('<button aria-pressed="true">Bold</button>')).toEqual([]);
  });
});

describe("id-references", () => {
  it("rejects duplicate ids and references to missing ids", () => {
    expect(rulesHit('<p id="a">x</p><p id="a">y</p>')).toEqual(["duplicate-id"]);
    expect(rulesHit('<input aria-label="n" aria-describedby="gone">')).toEqual(["dangling-idref"]);
    expect(rulesHit('<label for="gone">Name</label>')).toEqual(["dangling-idref"]);
  });
  it("accepts resolved references", () => {
    expect(rulesHit('<p id="hint">h</p><input aria-label="n" aria-describedby="hint">')).toEqual([]);
  });
});

describe("accessible-name", () => {
  it("rejects nameless controls, dialogs and images", () => {
    expect(rulesHit("<button></button>")).toEqual(["accessible-name"]);
    expect(rulesHit("<textarea></textarea>")).toEqual(["accessible-name"]);
    expect(rulesHit('<div role="dialog">x</div>')).toEqual(["accessible-name"]);
    expect(rulesHit('<img src="a.png">')).toEqual(["accessible-name"]);
  });
  it("accepts every way of naming", () => {
    expect(rulesHit("<button>Save</button>")).toEqual([]);
    expect(rulesHit('<button aria-label="Close"><svg></svg></button>')).toEqual([]);
    expect(rulesHit('<span id="l">Rule</span><textarea aria-labelledby="l"></textarea>')).toEqual([]);
    expect(rulesHit("<label>Rule <textarea></textarea></label>")).toEqual([]);
    expect(rulesHit('<div role="dialog" aria-label="Edit">x</div><img src="a.png" alt="">')).toEqual([]);
  });
  it("ignores hidden controls and file inputs", () => {
    expect(rulesHit('<div aria-hidden="true"><button></button></div><input type="file">')).toEqual([]);
  });
});

describe("markup", () => {
  it("rejects dt/dd nested too deep and non-description children of dl", () => {
    expect(rulesHit("<dl><div><div><dt>A</dt><dd>1</dd></div></div></dl>")).toEqual(["markup"]);
    expect(rulesHit("<dl><div><dt>A</dt><dd>1</dd><button>Edit</button></div></dl>")).toEqual(["markup"]);
    expect(rulesHit("<dl><dt>A</dt><dd>1</dd><p>note</p></dl>")).toEqual(["markup"]);
    expect(rulesHit("<div><dt>A</dt></div>")).toEqual(["markup"]);
    expect(rulesHit("<div><li>x</li></div>")).toEqual(["markup"]);
  });
  it("accepts dl > div > dt/dd and flat dl", () => {
    expect(rulesHit("<dl><div><dt>A</dt><dd>1</dd></div><dt>B</dt><dd>2</dd></dl><ul><li>x</li></ul>")).toEqual([]);
  });
});

describe("tab-stop", () => {
  const tab = (attrs) => `<button role="tab" type="button" ${attrs}>t</button>`;
  it("rejects a tablist whose enabled tabs all have tabindex -1", () => {
    expect(rulesHit(`<div role="tablist" aria-label="v">${tab('tabindex="-1" disabled')}${tab('tabindex="-1"')}</div>`)).toEqual(["tab-stop"]);
    expect(rulesHit('<div role="radiogroup" aria-label="r"><span role="radio" aria-checked="true" tabindex="-1">a</span></div>')).toEqual(["tab-stop"]);
  });
  it("accepts one reachable enabled tab, and a tablist with nothing enabled", () => {
    expect(rulesHit(`<div role="tablist" aria-label="v">${tab('tabindex="-1" disabled')}${tab('tabindex="0"')}</div>`)).toEqual([]);
    expect(rulesHit(`<div role="tablist" aria-label="v">${tab('tabindex="-1" disabled')}${tab("disabled")}</div>`)).toEqual([]);
  });
});

describe("tab-order", () => {
  it("rejects a positive tabindex", () => {
    expect(rulesHit('<button tabindex="3">Go</button>')).toEqual(["tab-order"]);
  });
});

it("check() runs every rule", () => {
  expect(Object.keys(RULES)).toEqual(["aria-support", "id-references", "accessible-name", "markup", "tab-stop", "tab-order"]);
});
