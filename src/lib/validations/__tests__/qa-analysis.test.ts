import { describe, it, expect } from "vitest";
import {
  qaAnalyzeRequestSchema,
  qaChapterResponseSchema,
  qaConsistencyResponseSchema,
} from "../qa-analysis";

describe("qaAnalyzeRequestSchema", () => {
  it("accepts valid UUID bookId", () => {
    const result = qaAnalyzeRequestSchema.safeParse({
      bookId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID bookId", () => {
    const result = qaAnalyzeRequestSchema.safeParse({ bookId: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("rejects missing bookId", () => {
    const result = qaAnalyzeRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects empty string", () => {
    const result = qaAnalyzeRequestSchema.safeParse({ bookId: "" });
    expect(result.success).toBe(false);
  });
});

describe("qaChapterResponseSchema", () => {
  const validResponse = {
    readability: 85,
    structure: 78,
    accuracy: 90,
    consistency: 82,
    dimensionSummaries: {
      readability: "Clear and well-organized prose.",
      structure: "Good logical flow with minor issues.",
      accuracy: "Factually sound throughout.",
      consistency: "Consistent terminology and tone.",
    },
    suggestions: [
      {
        dimension: "readability" as const,
        severity: "minor" as const,
        issueText: "Passive voice in opening paragraph.",
        explanation: "The first paragraph uses passive voice excessively.",
        location: "opening paragraph",
        autoFixable: true,
        suggestedFix: "Rewrite using active voice.",
      },
    ],
  };

  it("accepts valid response", () => {
    const result = qaChapterResponseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it("accepts response with zero suggestions", () => {
    const result = qaChapterResponseSchema.safeParse({
      ...validResponse,
      suggestions: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects scores below 0", () => {
    const result = qaChapterResponseSchema.safeParse({
      ...validResponse,
      readability: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects scores above 100", () => {
    const result = qaChapterResponseSchema.safeParse({
      ...validResponse,
      accuracy: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid dimension in suggestion", () => {
    const result = qaChapterResponseSchema.safeParse({
      ...validResponse,
      suggestions: [
        {
          ...validResponse.suggestions[0],
          dimension: "grammar",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid severity", () => {
    const result = qaChapterResponseSchema.safeParse({
      ...validResponse,
      suggestions: [
        {
          ...validResponse.suggestions[0],
          severity: "low",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 10 suggestions", () => {
    const suggestions = Array.from({ length: 11 }, (_, i) => ({
      ...validResponse.suggestions[0],
      issueText: `Issue ${i + 1}`,
    }));
    const result = qaChapterResponseSchema.safeParse({
      ...validResponse,
      suggestions,
    });
    expect(result.success).toBe(false);
  });

  it("accepts suggestion with null location", () => {
    const result = qaChapterResponseSchema.safeParse({
      ...validResponse,
      suggestions: [
        {
          ...validResponse.suggestions[0],
          location: null,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts suggestion without suggestedFix", () => {
    const { suggestedFix: _, ...suggestionNoFix } =
      validResponse.suggestions[0]!;
    const result = qaChapterResponseSchema.safeParse({
      ...validResponse,
      suggestions: [suggestionNoFix],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing dimensionSummaries", () => {
    const { dimensionSummaries: _, ...noSummaries } = validResponse;
    const result = qaChapterResponseSchema.safeParse(noSummaries);
    expect(result.success).toBe(false);
  });

  it("requires all four dimension summaries", () => {
    const result = qaChapterResponseSchema.safeParse({
      ...validResponse,
      dimensionSummaries: {
        readability: "Good.",
        structure: "Fine.",
        accuracy: "Correct.",
        // missing consistency
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("qaConsistencyResponseSchema", () => {
  const validResponse = {
    consistencyAdjustment: -5,
    suggestions: [
      {
        severity: "major" as const,
        issueText: "Terminology differs between chapters 1 and 3.",
        explanation: "Chapter 1 uses 'TypeScript' while Chapter 3 uses 'TS'.",
        autoFixable: true,
        suggestedFix: "Standardize to 'TypeScript' throughout.",
      },
    ],
  };

  it("accepts valid response", () => {
    const result = qaConsistencyResponseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it("accepts zero adjustment (no issues)", () => {
    const result = qaConsistencyResponseSchema.safeParse({
      consistencyAdjustment: 0,
      suggestions: [],
    });
    expect(result.success).toBe(true);
  });

  it("accepts -20 adjustment (severe issues)", () => {
    const result = qaConsistencyResponseSchema.safeParse({
      ...validResponse,
      consistencyAdjustment: -20,
    });
    expect(result.success).toBe(true);
  });

  it("rejects adjustment below -20", () => {
    const result = qaConsistencyResponseSchema.safeParse({
      ...validResponse,
      consistencyAdjustment: -25,
    });
    expect(result.success).toBe(false);
  });

  it("rejects positive adjustment", () => {
    const result = qaConsistencyResponseSchema.safeParse({
      ...validResponse,
      consistencyAdjustment: 5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 10 suggestions", () => {
    const suggestions = Array.from({ length: 11 }, (_, i) => ({
      ...validResponse.suggestions[0],
      issueText: `Issue ${i + 1}`,
    }));
    const result = qaConsistencyResponseSchema.safeParse({
      ...validResponse,
      suggestions,
    });
    expect(result.success).toBe(false);
  });

  it("accepts suggestion without suggestedFix", () => {
    const { suggestedFix: _, ...noFix } = validResponse.suggestions[0]!;
    const result = qaConsistencyResponseSchema.safeParse({
      ...validResponse,
      suggestions: [noFix],
    });
    expect(result.success).toBe(true);
  });
});
