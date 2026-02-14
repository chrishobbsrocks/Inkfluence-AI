import { describe, it, expect } from "vitest";
import { qaFixRequestSchema } from "../qa-fix";

describe("qaFixRequestSchema", () => {
  const validInput = {
    bookId: "550e8400-e29b-41d4-a716-446655440000",
    chapterId: "660e8400-e29b-41d4-a716-446655440001",
    suggestionId: "qa-abc12345-0-1707840000000",
    originalText: "churn rate",
    suggestedFix: "attrition rate",
  };

  it("accepts valid input", () => {
    const result = qaFixRequestSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects missing bookId", () => {
    const { bookId: _, ...input } = validInput;
    const result = qaFixRequestSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects invalid bookId UUID", () => {
    const result = qaFixRequestSchema.safeParse({
      ...validInput,
      bookId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid chapterId UUID", () => {
    const result = qaFixRequestSchema.safeParse({
      ...validInput,
      chapterId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty suggestionId", () => {
    const result = qaFixRequestSchema.safeParse({
      ...validInput,
      suggestionId: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty originalText", () => {
    const result = qaFixRequestSchema.safeParse({
      ...validInput,
      originalText: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty suggestedFix", () => {
    const result = qaFixRequestSchema.safeParse({
      ...validInput,
      suggestedFix: "",
    });
    expect(result.success).toBe(false);
  });
});
