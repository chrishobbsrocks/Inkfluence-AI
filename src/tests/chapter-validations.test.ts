import { describe, it, expect } from "vitest";
import {
  chapterIdSchema,
  updateChapterContentSchema,
} from "@/lib/validations/chapters";

describe("chapterIdSchema", () => {
  it("accepts a valid UUID v4", () => {
    const result = chapterIdSchema.safeParse(
      "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
    );
    expect(result.success).toBe(true);
  });

  it("rejects a non-UUID string", () => {
    const result = chapterIdSchema.safeParse("not-a-uuid");
    expect(result.success).toBe(false);
  });

  it("rejects an empty string", () => {
    const result = chapterIdSchema.safeParse("");
    expect(result.success).toBe(false);
  });
});

describe("updateChapterContentSchema", () => {
  it("accepts valid input", () => {
    const result = updateChapterContentSchema.safeParse({
      title: "Introduction",
      content: "<p>Hello world</p>",
      wordCount: 2,
    });
    expect(result.success).toBe(true);
  });

  it("accepts null content", () => {
    const result = updateChapterContentSchema.safeParse({
      title: "Title",
      content: null,
      wordCount: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = updateChapterContentSchema.safeParse({
      title: "",
      content: null,
      wordCount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects title exceeding 255 characters", () => {
    const result = updateChapterContentSchema.safeParse({
      title: "A".repeat(256),
      content: null,
      wordCount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects content exceeding 500,000 characters", () => {
    const result = updateChapterContentSchema.safeParse({
      title: "Title",
      content: "A".repeat(500_001),
      wordCount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative wordCount", () => {
    const result = updateChapterContentSchema.safeParse({
      title: "Title",
      content: null,
      wordCount: -1,
    });
    expect(result.success).toBe(false);
  });

  it("defaults wordCount to 0 if not provided", () => {
    const result = updateChapterContentSchema.safeParse({
      title: "Title",
      content: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.wordCount).toBe(0);
    }
  });
});
