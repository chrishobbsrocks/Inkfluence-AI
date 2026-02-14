import { describe, it, expect } from "vitest";
import { createEpubCss } from "@/lib/export/template-to-epub-css";
import { BOOK_TEMPLATES } from "@/lib/templates";

describe("createEpubCss", () => {
  it("includes font-family for body", () => {
    const css = createEpubCss(BOOK_TEMPLATES[0]!);
    expect(css).toContain("font-family:");
  });

  it("includes correct font-size", () => {
    const css = createEpubCss(BOOK_TEMPLATES[0]!);
    expect(css).toContain("font-size: 11pt");
  });

  it("includes body color", () => {
    const css = createEpubCss(BOOK_TEMPLATES[0]!);
    expect(css).toContain("color: #57534e");
  });

  it("includes heading color", () => {
    const css = createEpubCss(BOOK_TEMPLATES[0]!);
    expect(css).toContain("color: #1c1917");
  });

  it("includes paragraph margin-bottom", () => {
    const css = createEpubCss(BOOK_TEMPLATES[0]!);
    expect(css).toContain("margin-bottom: 16px");
  });

  it("generates CSS for all templates without error", () => {
    for (const template of BOOK_TEMPLATES) {
      const css = createEpubCss(template);
      expect(css.length).toBeGreaterThan(0);
      expect(css).toContain("body {");
    }
  });

  it("includes blockquote styling with accent color", () => {
    const css = createEpubCss(BOOK_TEMPLATES[0]!);
    expect(css).toContain("blockquote");
    expect(css).toContain("#a8a29e"); // accent color
  });
});
