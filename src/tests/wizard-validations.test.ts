import { describe, it, expect } from "vitest";
import {
  startWizardSchema,
  sendMessageSchema,
  generateOutlineSchema,
  generatedOutlineSchema,
} from "@/lib/validations/wizard";

describe("startWizardSchema", () => {
  it("accepts valid input with all fields", () => {
    const result = startWizardSchema.safeParse({
      bookId: "550e8400-e29b-41d4-a716-446655440000",
      topic: "SaaS growth strategies",
      audience: "early-stage founders",
      expertiseLevel: "expert",
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimal input (bookId + topic only)", () => {
    const result = startWizardSchema.safeParse({
      bookId: "550e8400-e29b-41d4-a716-446655440000",
      topic: "AI writing",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing bookId", () => {
    const result = startWizardSchema.safeParse({
      topic: "Test topic",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID for bookId", () => {
    const result = startWizardSchema.safeParse({
      bookId: "not-a-uuid",
      topic: "Test",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty topic", () => {
    const result = startWizardSchema.safeParse({
      bookId: "550e8400-e29b-41d4-a716-446655440000",
      topic: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects topic over 500 chars", () => {
    const result = startWizardSchema.safeParse({
      bookId: "550e8400-e29b-41d4-a716-446655440000",
      topic: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid expertise level", () => {
    const result = startWizardSchema.safeParse({
      bookId: "550e8400-e29b-41d4-a716-446655440000",
      topic: "Test",
      expertiseLevel: "guru",
    });
    expect(result.success).toBe(false);
  });
});

describe("sendMessageSchema", () => {
  it("accepts valid input", () => {
    const result = sendMessageSchema.safeParse({
      outlineId: "550e8400-e29b-41d4-a716-446655440000",
      message: "My answer to the question",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty message", () => {
    const result = sendMessageSchema.safeParse({
      outlineId: "550e8400-e29b-41d4-a716-446655440000",
      message: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message over 10000 chars", () => {
    const result = sendMessageSchema.safeParse({
      outlineId: "550e8400-e29b-41d4-a716-446655440000",
      message: "x".repeat(10001),
    });
    expect(result.success).toBe(false);
  });
});

describe("generateOutlineSchema", () => {
  it("accepts valid outline ID", () => {
    const result = generateOutlineSchema.safeParse({
      outlineId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID", () => {
    const result = generateOutlineSchema.safeParse({
      outlineId: "invalid",
    });
    expect(result.success).toBe(false);
  });
});

describe("generatedOutlineSchema", () => {
  it("validates complete outline structure", () => {
    const result = generatedOutlineSchema.safeParse({
      title: "The Growth Playbook",
      summary: "A comprehensive guide to SaaS growth",
      chapters: [
        { chapterTitle: "Introduction", keyPoints: ["Point 1"], orderIndex: 0 },
        { chapterTitle: "Chapter 2", keyPoints: ["Point 1", "Point 2"], orderIndex: 1 },
        { chapterTitle: "Conclusion", keyPoints: ["Summary"], orderIndex: 2 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects fewer than 3 chapters", () => {
    const result = generatedOutlineSchema.safeParse({
      title: "Test",
      summary: "Test",
      chapters: [
        { chapterTitle: "Ch1", keyPoints: [], orderIndex: 0 },
        { chapterTitle: "Ch2", keyPoints: [], orderIndex: 1 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 20 chapters", () => {
    const chapters = Array.from({ length: 21 }, (_, i) => ({
      chapterTitle: `Chapter ${i}`,
      keyPoints: [],
      orderIndex: i,
    }));
    const result = generatedOutlineSchema.safeParse({
      title: "Test",
      summary: "Test",
      chapters,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing title", () => {
    const result = generatedOutlineSchema.safeParse({
      summary: "Test",
      chapters: [
        { chapterTitle: "Ch1", keyPoints: [], orderIndex: 0 },
        { chapterTitle: "Ch2", keyPoints: [], orderIndex: 1 },
        { chapterTitle: "Ch3", keyPoints: [], orderIndex: 2 },
      ],
    });
    expect(result.success).toBe(false);
  });
});
