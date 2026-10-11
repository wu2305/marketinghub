/* The language switch swaps content objects and nothing else (language demo).
 * Rendered Chinese text must not fall back to English except for names that are data. */
import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { LocalizedBusinessTermApp } from "./LocalizedBusinessTermApp.tsx";

window.HTMLElement.prototype.scrollTo ??= () => {};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const toasts = () => [...document.querySelectorAll(".mh-toast:not([hidden])")].map((node) => node.textContent).join(" | ");
const pill = (name: string) => screen.getByRole("button", { name });

/** Visible words in Latin letters, ignoring names that are data or brand: Data Model names, people, product marks. */
const DATA_NAMES = ["Tapestry", "D2C Insight", "Revenue Dashboard", "Sales Performance", "Customer 360", "Conversion Overview", "Member Performance", "Emily Wang", "Sophie Taylor", "Sophie Chen", "Marco Li", "Current User", "AI", "GMV", "ROI", "CSV", "Excel", "English"];
function englishLeft(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const found: string[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node.parentElement;
    /* The scope picker lists Data Model and report names: data, not UI text. */
    if (!el || el.closest("[hidden], [aria-hidden='true'], script, style, .mh-btform__scope-menu")) continue;
    let text = node.textContent || "";
    for (const name of DATA_NAMES) text = text.split(name).join(" ");
    if (/[A-Za-z]{2,}/.test(text)) found.push(`${text.trim()}  <${el.tagName.toLowerCase()} class="${el.className}">`);
  }
  return found;
}
function attributesLeft(root: HTMLElement) {
  const found: string[] = [];
  root.querySelectorAll("[aria-label],[title],[placeholder],[alt]").forEach((el) => {
    for (const attr of ["aria-label", "title", "placeholder", "alt"]) {
      let text = el.getAttribute(attr) || "";
      for (const name of DATA_NAMES) text = text.split(name).join(" ");
      if (/[A-Za-z]{2,}/.test(text)) found.push(`${attr}="${el.getAttribute(attr)}"`);
    }
  });
  return found;
}

describe("language switch on the Business Term workspace", () => {
  it("leaves no English in the confirm dialogs, toasts, filters and the form", () => {
    render(<LocalizedBusinessTermApp initialLocale="zh" />);
    const body = document.body;
    const gmv = () => [...document.querySelectorAll<HTMLElement>(".mh-btview .mh-library-item")].find((item) => item.textContent?.includes("GMV"))!;
    // disable (confirm), toast, then delete (own, now disabled)
    fireEvent.click(within(gmv()).getByRole("button", { name: /停用/ }));
    expect(screen.getByRole("dialog").textContent).toContain("确认操作");
    expect(englishLeft(screen.getByRole("dialog"))).toEqual([]);
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "确认下线" }));
    expect(toasts()).toContain("已成功停用");
    expect(englishLeft(body)).toEqual([]);
    fireEvent.click(within(gmv()).getByRole("button", { name: /删除/ }));
    expect(screen.getByRole("dialog").textContent).toContain("确认删除");
    expect(englishLeft(screen.getByRole("dialog"))).toEqual([]);
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "取消" }));
    // form: scope picker, global synonym, save draft, publish
    fireEvent.click(screen.getByRole("link", { name: /新增业务术语/ }));
    fireEvent.click(screen.getByRole("button", { name: /可多选/ }));
    expect(englishLeft(body)).toEqual([]);
    fireEvent.change(document.querySelector('[name="kind"]') as HTMLSelectElement, { target: { value: "Global Synonym" } });
    fireEvent.change(document.querySelector('[name="title"]') as HTMLInputElement, { target: { value: "客户价值" } });
    fireEvent.change(document.querySelector('[name="description"]') as HTMLTextAreaElement, { target: { value: "示例描述" } });
    fireEvent.click(screen.getByRole("button", { name: "发布并启用" }));
    expect(toasts()).toContain("已发布并启用");
    expect(englishLeft(body)).toEqual([]);
    expect(attributesLeft(body)).toEqual([]);
  });

  it("starts in English and switches the page copy without remounting", () => {
    render(<LocalizedBusinessTermApp />);
    expect(screen.getByRole("link", { name: /Add Business Term/ })).toBeTruthy();
    fireEvent.click(pill("中文"));
    expect(screen.getByRole("link", { name: /新增业务术语/ })).toBeTruthy();
    expect(document.querySelector(".mh-btview")?.textContent).toContain("显示 6 / 6 条术语");
    expect(document.documentElement.querySelector("[lang='zh-CN']")).toBeTruthy();
    expect(pill("中文").getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(pill("English"));
    expect(screen.getByRole("link", { name: /Add Business Term/ })).toBeTruthy();
  });

  it("keeps what the user typed and the records already in the list when the language changes", () => {
    render(<LocalizedBusinessTermApp />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Paid" } });
    fireEvent.click(pill("中文"));
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("Paid");
    const titles = [...document.querySelectorAll(".mh-btview .mh-library-item__title button")].map((node) => node.textContent);
    expect(titles).toEqual(["Paid Customer"]);
  });

  it("starts with Chinese records when asked", () => {
    render(<LocalizedBusinessTermApp initialLocale="zh" />);
    const titles = [...document.querySelectorAll(".mh-btview .mh-library-item__title button")].map((node) => node.textContent);
    expect(titles).toContain("付费客户");
    expect(pill("中文").getAttribute("aria-pressed")).toBe("true");
  });

  it("leaves no English UI text on the library, drawer, dialogs, assistant and form", () => {
    render(<LocalizedBusinessTermApp initialLocale="zh" />);
    const body = document.body;
    expect(englishLeft(body)).toEqual([]);
    expect(attributesLeft(body)).toEqual([]);

    // detail drawer
    fireEvent.click(within(document.querySelector(".mh-btview") as HTMLElement).getByRole("button", { name: "付费客户" }));
    expect(englishLeft(body)).toEqual([]);
    expect(attributesLeft(body)).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: "关闭详情" }));

    // blocked action dialog (a term created by someone else)
    const card = [...document.querySelectorAll<HTMLElement>(".mh-btview .mh-library-item")].find((item) => item.textContent?.includes("付费客户"))!;
    fireEvent.click(within(card).getByRole("button", { name: /编辑/ }));
    expect(screen.getByRole("dialog").textContent).toContain("没有权限");
    expect(englishLeft(screen.getByRole("dialog"))).toEqual([]);
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "关闭" }));

    // assistant
    fireEvent.click(screen.getByRole("button", { name: "打开 AI 助手" }));
    expect(englishLeft(body)).toEqual([]);
    expect(attributesLeft(body)).toEqual([]);
    fireEvent.click(document.querySelector(".mh-assistant__close") as HTMLElement);

    // form
    fireEvent.click(screen.getByRole("link", { name: /新增业务术语/ }));
    expect(screen.getByRole("heading", { name: "创建业务术语" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "发布并启用" }));
    expect(englishLeft(body)).toEqual([]);
    expect(attributesLeft(body)).toEqual([]);
  });
});
