import { describe, it, expect } from "vitest";
import {
  analyzeOutlineRequestSchema,
  outlineAnalysisSchema,
} from "../outline-analysis";

describe("analyzeOutlineRequestSchema", () => {
  it("accepts a valid UUID outlineId", () => {
    const result = analyzeOutlineRequestSchema.safeParse({
      outlineId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID outlineId", () => {
    const result = analyzeOutlineRequestSchema.safeParse({
      outlineId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing outlineId", () => {
    const result = analyzeOutlineRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("outlineAnalysisSchema", () => {
  const validAnalysis = {
    suggestions: [
      {
        chapterTitle: "Error Handling",
        keyPoints: ["Try/catch", "Custom errors"],
        rationale: "Important for production code",
        insertAfterIndex: 2,
        priority: "high" as const,
      },
    ],
    coverage: [
      { area: "Fundamentals", status: "well-covered" as const },
      { area: "Testing", status: "gap" as const },
    ],
    overallScore: 72,
    summary: "Good outline with some gaps in testing coverage.",
  };

  it("accepts valid analysis data", () => {
    const result = outlineAnalysisSchema.safeParse(validAnalysis);
    expect(result.success).toBe(true);
  });

  it("accepts empty suggestions array", () => {
    const result = outlineAnalysisSchema.safeParse({
      ...validAnalysis,
      suggestions: [],
    });
    expect(result.success).toBe(true);
  });

  it("accepts insertAfterIndex of -1 (insert at beginning)", () => {
    const result = outlineAnalysisSchema.safeParse({
      ...validAnalysis,
      suggestions: [
        {
          ...validAnalysis.suggestions[0],
          insertAfterIndex: -1,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects insertAfterIndex less than -1", () => {
    const result = outlineAnalysisSchema.safeParse({
      ...validAnalysis,
      suggestions: [
        {
          ...validAnalysis.suggestions[0],
          insertAfterIndex: -2,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects overallScore above 100", () => {
    const result = outlineAnalysisSchema.safeParse({
      ...validAnalysis,
      overallScore: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects overallScore below 0", () => {
    const result = outlineAnalysisSchema.safeParse({
      ...validAnalysis,
      overallScore: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid priority value", () => {
    const result = outlineAnalysisSchema.safeParse({
      ...validAnalysis,
      suggestions: [
        {
          ...validAnalysis.suggestions[0],
          priority: "critical",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid coverage status", () => {
    const result = outlineAnalysisSchema.safeParse({
      ...validAnalysis,
      coverage: [{ area: "Fundamentals", status: "unknown" }],
    });
    expect(result.success).toBe(false);
  });

  it("limits suggestions to max 10", () => {
    const tooMany = Array.from({ length: 11 }, (_, i) => ({
      chapterTitle: `Chapter ${i}`,
      keyPoints: [],
      rationale: "test",
      insertAfterIndex: 0,
      priority: "low" as const,
    }));
    const result = outlineAnalysisSchema.safeParse({
      ...validAnalysis,
      suggestions: tooMany,
    });
    expect(result.success).toBe(false);
  });

  it("accepts all three coverage statuses", () => {
    const result = outlineAnalysisSchema.safeParse({
      ...validAnalysis,
      coverage: [
        { area: "A", status: "well-covered" },
        { area: "B", status: "partial" },
        { area: "C", status: "gap" },
      ],
    });
    expect(result.success).toBe(true);
  });
});
