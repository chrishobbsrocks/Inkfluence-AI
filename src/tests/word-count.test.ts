import { describe, it, expect } from "vitest";
import { countWords } from "@/lib/word-count";

describe("countWords", () => {
  it("counts words from plain text", () => {
    expect(countWords("hello world")).toBe(2);
  });

  it("strips HTML tags before counting", () => {
    expect(countWords("<p>hello <strong>world</strong></p>")).toBe(2);
  });

  it("returns 0 for empty string", () => {
    expect(countWords("")).toBe(0);
  });

  it("returns 0 for whitespace-only string", () => {
    expect(countWords("   ")).toBe(0);
  });

  it("returns 0 for null/undefined", () => {
    expect(countWords(null as unknown as string)).toBe(0);
    expect(countWords(undefined as unknown as string)).toBe(0);
  });

  it("handles multiple spaces between words", () => {
    expect(countWords("hello    world   foo")).toBe(3);
  });

  it("handles tags-only input", () => {
    expect(countWords("<br/><hr/>")).toBe(0);
  });
});
