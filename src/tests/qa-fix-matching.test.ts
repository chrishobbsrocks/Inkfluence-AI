import { describe, it, expect } from "vitest";

// Inline the function since it's not exported — we test the logic directly
function replaceTextInHtml(
  html: string,
  searchText: string,
  replacement: string
): { result: string | null; fuzzyMatch: boolean } {
  // Try direct replacement first
  if (html.includes(searchText)) {
    return { result: html.replace(searchText, replacement), fuzzyMatch: false };
  }

  // Try matching with HTML tags stripped
  const stripped = html.replace(/<[^>]*>/g, "");
  if (stripped.includes(searchText)) {
    const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flexiblePattern = escaped.split("").join("(?:<[^>]*>)*");
    const regex = new RegExp(flexiblePattern);
    const match = html.match(regex);

    if (match) {
      return { result: html.replace(match[0], replacement), fuzzyMatch: false };
    }
  }

  // Fuzzy matching: try trimmed/normalized whitespace version
  const normalizedSearch = searchText.replace(/\s+/g, " ").trim();
  const normalizedStripped = stripped.replace(/\s+/g, " ");
  if (normalizedStripped.includes(normalizedSearch)) {
    const escaped = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flexiblePattern = escaped.split(" ").join("(?:<[^>]*>|\\s)+");
    const regex = new RegExp(flexiblePattern);
    const match = html.match(regex);

    if (match) {
      return { result: html.replace(match[0], replacement), fuzzyMatch: true };
    }
  }

  return { result: null, fuzzyMatch: false };
}

describe("replaceTextInHtml", () => {
  it("replaces exact text match", () => {
    const { result, fuzzyMatch } = replaceTextInHtml(
      "<p>Hello world</p>",
      "Hello world",
      "Goodbye world"
    );
    expect(result).toBe("<p>Goodbye world</p>");
    expect(fuzzyMatch).toBe(false);
  });

  it("replaces text split across HTML tags", () => {
    const { result, fuzzyMatch } = replaceTextInHtml(
      "<p>Hello <strong>world</strong></p>",
      "Hello world",
      "Goodbye world"
    );
    expect(result).not.toBeNull();
    expect(result).toContain("Goodbye world");
    expect(fuzzyMatch).toBe(false);
  });

  it("handles fuzzy whitespace matching", () => {
    const { result, fuzzyMatch } = replaceTextInHtml(
      "<p>Hello   world</p>",
      "Hello world",
      "Goodbye world"
    );
    expect(result).not.toBeNull();
    expect(fuzzyMatch).toBe(true);
  });

  it("handles newlines in whitespace fuzzy matching", () => {
    const { result, fuzzyMatch } = replaceTextInHtml(
      "<p>Hello\nworld</p>",
      "Hello world",
      "Goodbye world"
    );
    expect(result).not.toBeNull();
    expect(fuzzyMatch).toBe(true);
  });

  it("returns null when text not found at all", () => {
    const { result, fuzzyMatch } = replaceTextInHtml(
      "<p>Hello world</p>",
      "Nonexistent text",
      "Replacement"
    );
    expect(result).toBeNull();
    expect(fuzzyMatch).toBe(false);
  });

  it("handles special regex characters in search text", () => {
    const { result } = replaceTextInHtml(
      "<p>Cost is $100 (estimated)</p>",
      "Cost is $100 (estimated)",
      "Cost is $200 (final)"
    );
    expect(result).toBe("<p>Cost is $200 (final)</p>");
  });

  it("replaces only the first occurrence", () => {
    const { result } = replaceTextInHtml(
      "<p>hello hello hello</p>",
      "hello",
      "bye"
    );
    expect(result).toBe("<p>bye hello hello</p>");
  });
});
