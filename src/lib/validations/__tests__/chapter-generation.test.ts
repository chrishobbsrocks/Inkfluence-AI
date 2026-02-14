import { describe, it, expect } from "vitest";
import { chapterGenerationRequestSchema } from "../chapter-generation";

describe("chapterGenerationRequestSchema", () => {
  const validInput = {
    chapterId: "550e8400-e29b-41d4-a716-446655440000",
    bookId: "660e8400-e29b-41d4-a716-446655440001",
    tone: "professional",
    expertise: "intermediate",
  };

  it("accepts valid input", () => {
    const result = chapterGenerationRequestSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID for chapterId", () => {
    const result = chapterGenerationRequestSchema.safeParse({
      ...validInput,
      chapterId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID for bookId", () => {
    const result = chapterGenerationRequestSchema.safeParse({
      ...validInput,
      bookId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("defaults tone to professional when not provided", () => {
    const { tone: _, ...withoutTone } = validInput;
    const result = chapterGenerationRequestSchema.safeParse(withoutTone);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tone).toBe("professional");
    }
  });

  it("defaults expertise to intermediate when not provided", () => {
    const { expertise: _, ...withoutExpertise } = validInput;
    const result = chapterGenerationRequestSchema.safeParse(withoutExpertise);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.expertise).toBe("intermediate");
    }
  });

  it("rejects invalid tone value", () => {
    const result = chapterGenerationRequestSchema.safeParse({
      ...validInput,
      tone: "casual",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid expertise value", () => {
    const result = chapterGenerationRequestSchema.safeParse({
      ...validInput,
      expertise: "novice",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid tone values", () => {
    for (const tone of ["professional", "conversational", "academic"]) {
      const result = chapterGenerationRequestSchema.safeParse({
        ...validInput,
        tone,
      });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid expertise values", () => {
    for (const expertise of ["beginner", "intermediate", "expert"]) {
      const result = chapterGenerationRequestSchema.safeParse({
        ...validInput,
        expertise,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects missing chapterId", () => {
    const { chapterId: _, ...noChapterId } = validInput;
    const result = chapterGenerationRequestSchema.safeParse(noChapterId);
    expect(result.success).toBe(false);
  });

  it("rejects missing bookId", () => {
    const { bookId: _, ...noBookId } = validInput;
    const result = chapterGenerationRequestSchema.safeParse(noBookId);
    expect(result.success).toBe(false);
  });
});
