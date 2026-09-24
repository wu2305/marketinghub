import { describe, expect, it } from "vitest";
import { assetUrl } from "./index.js";

describe("assetUrl", () => {
  it("joins the bundler base with an assets path", () => {
    /* vitest exposes BASE_URL "/" — absolute and relative inputs agree */
    expect(assetUrl("assets/images/x.png")).toBe("/assets/images/x.png");
    expect(assetUrl("/assets/images/x.png")).toBe("/assets/images/x.png");
    expect(assetUrl("assets/images/a b.png")).toBe("/assets/images/a b.png");
  });
});
