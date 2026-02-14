import { describe, it, expect } from "vitest";
import { createPdfStyles } from "@/lib/export/template-to-pdf-styles";
import { BOOK_TEMPLATES } from "@/lib/templates";

describe("createPdfStyles", () => {
  it("maps Modern template margins correctly", () => {
    const styles = createPdfStyles(BOOK_TEMPLATES[0]!);
    expect(styles.page.paddingTop).toBe(48);
    expect(styles.page.paddingRight).toBe(32);
    expect(styles.page.paddingBottom).toBe(48);
    expect(styles.page.paddingLeft).toBe(32);
  });

  it("maps Classic template font size", () => {
    const styles = createPdfStyles(BOOK_TEMPLATES[1]!);
    expect(styles.page.fontSize).toBe(12);
  });

  it("maps body color from template", () => {
    const styles = createPdfStyles(BOOK_TEMPLATES[0]!);
    expect(styles.page.color).toBe("#57534e"); // stone-600
  });

  it("maps heading color from template", () => {
    const styles = createPdfStyles(BOOK_TEMPLATES[0]!);
    expect(styles.chapterTitle.color).toBe("#1c1917"); // stone-900
  });

  it("generates styles for all 4 templates without error", () => {
    for (const template of BOOK_TEMPLATES) {
      const styles = createPdfStyles(template);
      expect(styles.page).toBeDefined();
      expect(styles.chapterTitle).toBeDefined();
      expect(styles.paragraph).toBeDefined();
    }
  });

  it("chapter title font size is base + 6", () => {
    const template = BOOK_TEMPLATES[0]!;
    const styles = createPdfStyles(template);
    expect(styles.chapterTitle.fontSize).toBe(template.fontSize + 6);
  });
});
