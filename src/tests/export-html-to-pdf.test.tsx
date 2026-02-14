import { describe, it, expect } from "vitest";
import { htmlToPdfElements } from "@/lib/export/html-to-pdf-elements";
import { createPdfStyles } from "@/lib/export/template-to-pdf-styles";
import { BOOK_TEMPLATES } from "@/lib/templates";

const styles = createPdfStyles(BOOK_TEMPLATES[0]!);

describe("htmlToPdfElements", () => {
  it("returns empty array for empty string", () => {
    expect(htmlToPdfElements("", styles)).toEqual([]);
  });

  it("returns empty array for null-ish input", () => {
    expect(htmlToPdfElements("   ", styles)).toEqual([]);
  });

  it("converts a paragraph", () => {
    const elements = htmlToPdfElements("<p>Hello world</p>", styles);
    expect(elements).toHaveLength(1);
  });

  it("converts multiple paragraphs", () => {
    const elements = htmlToPdfElements(
      "<p>First</p><p>Second</p><p>Third</p>",
      styles
    );
    expect(elements).toHaveLength(3);
  });

  it("converts headings", () => {
    const elements = htmlToPdfElements(
      "<h2>Section Title</h2><p>Content</p>",
      styles
    );
    expect(elements).toHaveLength(2);
  });

  it("handles nested inline elements", () => {
    const elements = htmlToPdfElements(
      "<p>Hello <strong>bold</strong> world</p>",
      styles
    );
    expect(elements).toHaveLength(1);
  });

  it("handles unordered lists", () => {
    const elements = htmlToPdfElements(
      "<ul><li>Item 1</li><li>Item 2</li></ul>",
      styles
    );
    expect(elements).toHaveLength(1);
  });

  it("handles ordered lists", () => {
    const elements = htmlToPdfElements(
      "<ol><li>First</li><li>Second</li></ol>",
      styles
    );
    expect(elements).toHaveLength(1);
  });

  it("handles blockquotes", () => {
    const elements = htmlToPdfElements(
      "<blockquote><p>A quote</p></blockquote>",
      styles
    );
    expect(elements).toHaveLength(1);
  });
});
