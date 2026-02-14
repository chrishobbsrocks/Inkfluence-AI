import { describe, it, expect } from "vitest";
import {
  buildChapterQAPrompt,
  buildConsistencyCheckPrompt,
  qaChapterAnalysisTool,
  qaConsistencyTool,
} from "../qa-analysis";

describe("buildChapterQAPrompt", () => {
  const baseChapter = {
    title: "Getting Started with TypeScript",
    content: "<p>TypeScript is a typed superset of JavaScript...</p>",
    orderIndex: 0,
    wordCount: 1500,
  };

  it("includes the book topic", () => {
    const result = buildChapterQAPrompt(baseChapter, "TypeScript Handbook", null);
    expect(result).toContain("TypeScript Handbook");
  });

  it("includes audience when provided", () => {
    const result = buildChapterQAPrompt(
      baseChapter,
      "TypeScript Handbook",
      "Senior JavaScript developers"
    );
    expect(result).toContain("Senior JavaScript developers");
  });

  it("uses default audience when null", () => {
    const result = buildChapterQAPrompt(baseChapter, "TypeScript Handbook", null);
    expect(result).toContain("General readers interested in the topic");
  });

  it("includes chapter title", () => {
    const result = buildChapterQAPrompt(baseChapter, "TypeScript Handbook", null);
    expect(result).toContain("Getting Started with TypeScript");
  });

  it("includes word count", () => {
    const result = buildChapterQAPrompt(baseChapter, "TypeScript Handbook", null);
    expect(result).toContain("1500");
  });

  it("includes chapter position (1-indexed)", () => {
    const result = buildChapterQAPrompt(baseChapter, "TypeScript Handbook", null);
    expect(result).toContain("Chapter 1");
  });

  it("includes chapter content", () => {
    const result = buildChapterQAPrompt(baseChapter, "TypeScript Handbook", null);
    expect(result).toContain("TypeScript is a typed superset of JavaScript");
  });

  it("includes four scoring dimensions", () => {
    const result = buildChapterQAPrompt(baseChapter, "TypeScript Handbook", null);
    expect(result).toContain("Readability");
    expect(result).toContain("Structure");
    expect(result).toContain("Accuracy");
    expect(result).toContain("Consistency");
  });

  it("includes severity levels", () => {
    const result = buildChapterQAPrompt(baseChapter, "TypeScript Handbook", null);
    expect(result).toContain("critical");
    expect(result).toContain("major");
    expect(result).toContain("minor");
  });

  it("limits suggestions to 10", () => {
    const result = buildChapterQAPrompt(baseChapter, "TypeScript Handbook", null);
    expect(result).toContain("10 most impactful");
  });

  it("handles later chapter positions", () => {
    const laterChapter = { ...baseChapter, orderIndex: 4 };
    const result = buildChapterQAPrompt(laterChapter, "TypeScript Handbook", null);
    expect(result).toContain("Chapter 5");
  });
});

describe("buildConsistencyCheckPrompt", () => {
  const baseSummaries = [
    {
      title: "Introduction",
      orderIndex: 0,
      readabilitySummary: "Clear and well-structured prose.",
      consistencySummary: "Consistent terminology throughout.",
      keyTerms: "TypeScript, type safety, compiler",
    },
    {
      title: "Advanced Types",
      orderIndex: 1,
      readabilitySummary: "Some dense paragraphs.",
      consistencySummary: "Uses TS instead of TypeScript in places.",
      keyTerms: "generics, union types, intersection",
    },
  ];

  it("includes all chapter titles", () => {
    const result = buildConsistencyCheckPrompt(baseSummaries);
    expect(result).toContain("Introduction");
    expect(result).toContain("Advanced Types");
  });

  it("includes chapter numbers (1-indexed)", () => {
    const result = buildConsistencyCheckPrompt(baseSummaries);
    expect(result).toContain("Chapter 1");
    expect(result).toContain("Chapter 2");
  });

  it("includes readability summaries", () => {
    const result = buildConsistencyCheckPrompt(baseSummaries);
    expect(result).toContain("Clear and well-structured prose.");
    expect(result).toContain("Some dense paragraphs.");
  });

  it("includes consistency summaries", () => {
    const result = buildConsistencyCheckPrompt(baseSummaries);
    expect(result).toContain("Consistent terminology throughout.");
    expect(result).toContain("Uses TS instead of TypeScript in places.");
  });

  it("includes key terms", () => {
    const result = buildConsistencyCheckPrompt(baseSummaries);
    expect(result).toContain("TypeScript, type safety, compiler");
    expect(result).toContain("generics, union types, intersection");
  });

  it("instructs about consistency adjustment range", () => {
    const result = buildConsistencyCheckPrompt(baseSummaries);
    expect(result).toContain("0 to -20");
  });

  it("limits to 10 suggestions", () => {
    const result = buildConsistencyCheckPrompt(baseSummaries);
    expect(result).toContain("10 most impactful");
  });
});

describe("qaChapterAnalysisTool", () => {
  it("has correct tool name", () => {
    expect(qaChapterAnalysisTool.name).toBe("analyze_chapter_quality");
  });

  it("requires four score dimensions", () => {
    const required = qaChapterAnalysisTool.input_schema.required;
    expect(required).toContain("readability");
    expect(required).toContain("structure");
    expect(required).toContain("accuracy");
    expect(required).toContain("consistency");
  });

  it("requires dimensionSummaries", () => {
    expect(qaChapterAnalysisTool.input_schema.required).toContain(
      "dimensionSummaries"
    );
  });

  it("requires suggestions", () => {
    expect(qaChapterAnalysisTool.input_schema.required).toContain("suggestions");
  });
});

describe("qaConsistencyTool", () => {
  it("has correct tool name", () => {
    expect(qaConsistencyTool.name).toBe("check_consistency");
  });

  it("requires consistencyAdjustment", () => {
    expect(qaConsistencyTool.input_schema.required).toContain(
      "consistencyAdjustment"
    );
  });

  it("requires suggestions", () => {
    expect(qaConsistencyTool.input_schema.required).toContain("suggestions");
  });
});
