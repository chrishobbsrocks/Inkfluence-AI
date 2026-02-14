import { describe, it, expect } from "vitest";
import {
  buildOutlineAnalysisPrompt,
  outlineAnalysisTool,
} from "../outline-analysis";

describe("buildOutlineAnalysisPrompt", () => {
  const chapters = [
    {
      chapterTitle: "Introduction to TypeScript",
      keyPoints: ["Type safety", "Tooling support"],
    },
    {
      chapterTitle: "Advanced Types",
      keyPoints: ["Generics", "Conditional types", "Template literals"],
    },
  ];

  it("includes the book topic", () => {
    const result = buildOutlineAnalysisPrompt(
      chapters,
      "TypeScript for Backend Developers",
      null
    );
    expect(result).toContain("TypeScript for Backend Developers");
  });

  it("includes the target audience when provided", () => {
    const result = buildOutlineAnalysisPrompt(
      chapters,
      "TypeScript",
      "Senior engineers"
    );
    expect(result).toContain("Senior engineers");
  });

  it("uses default audience when null", () => {
    const result = buildOutlineAnalysisPrompt(chapters, "TypeScript", null);
    expect(result).toContain("General readers interested in the topic");
  });

  it("lists chapters with numbers and key points", () => {
    const result = buildOutlineAnalysisPrompt(chapters, "TypeScript", null);
    expect(result).toContain("1. Introduction to TypeScript");
    expect(result).toContain("Type safety, Tooling support");
    expect(result).toContain("2. Advanced Types");
    expect(result).toContain("Generics, Conditional types, Template literals");
  });

  it("handles chapters with no key points", () => {
    const result = buildOutlineAnalysisPrompt(
      [{ chapterTitle: "Empty Chapter", keyPoints: [] }],
      "Test",
      null
    );
    expect(result).toContain("1. Empty Chapter");
    expect(result).toContain("Key points: None");
  });

  it("includes analysis instructions", () => {
    const result = buildOutlineAnalysisPrompt(chapters, "TypeScript", null);
    expect(result).toContain("Coverage gaps");
    expect(result).toContain("Suggested chapters");
    expect(result).toContain("Coverage assessment");
    expect(result).toContain("completeness score from 0-100");
  });
});

describe("outlineAnalysisTool", () => {
  it("has the correct tool name", () => {
    expect(outlineAnalysisTool.name).toBe("analyze_outline");
  });

  it("requires suggestions, coverage, overallScore, and summary", () => {
    expect(outlineAnalysisTool.input_schema.required).toEqual([
      "suggestions",
      "coverage",
      "overallScore",
      "summary",
    ]);
  });

  it("defines suggestions as an array with required fields", () => {
    const suggestions = outlineAnalysisTool.input_schema.properties.suggestions;
    expect(suggestions.type).toBe("array");
    expect(suggestions.items.required).toContain("chapterTitle");
    expect(suggestions.items.required).toContain("keyPoints");
    expect(suggestions.items.required).toContain("rationale");
    expect(suggestions.items.required).toContain("insertAfterIndex");
    expect(suggestions.items.required).toContain("priority");
  });

  it("defines coverage as an array with area and status", () => {
    const coverage = outlineAnalysisTool.input_schema.properties.coverage;
    expect(coverage.type).toBe("array");
    expect(coverage.items.required).toContain("area");
    expect(coverage.items.required).toContain("status");
  });

  it("defines priority as enum with high/medium/low", () => {
    const priority =
      outlineAnalysisTool.input_schema.properties.suggestions.items.properties
        .priority;
    expect(priority.enum).toEqual(["high", "medium", "low"]);
  });

  it("defines coverage status as enum", () => {
    const status =
      outlineAnalysisTool.input_schema.properties.coverage.items.properties
        .status;
    expect(status.enum).toEqual(["well-covered", "partial", "gap"]);
  });
});
