import { describe, it, expect } from "vitest";
import { deriveQualityLevel, aggregateScores } from "../qa-engine";

describe("deriveQualityLevel", () => {
  it("returns exceptional for score >= 90", () => {
    expect(deriveQualityLevel(90)).toBe("exceptional");
    expect(deriveQualityLevel(95)).toBe("exceptional");
    expect(deriveQualityLevel(100)).toBe("exceptional");
  });

  it("returns professional for score 80-89", () => {
    expect(deriveQualityLevel(80)).toBe("professional");
    expect(deriveQualityLevel(85)).toBe("professional");
    expect(deriveQualityLevel(89)).toBe("professional");
  });

  it("returns good for score 70-79", () => {
    expect(deriveQualityLevel(70)).toBe("good");
    expect(deriveQualityLevel(75)).toBe("good");
    expect(deriveQualityLevel(79)).toBe("good");
  });

  it("returns needs-improvement for score 60-69", () => {
    expect(deriveQualityLevel(60)).toBe("needs-improvement");
    expect(deriveQualityLevel(65)).toBe("needs-improvement");
    expect(deriveQualityLevel(69)).toBe("needs-improvement");
  });

  it("returns needs-significant-work for score < 60", () => {
    expect(deriveQualityLevel(0)).toBe("needs-significant-work");
    expect(deriveQualityLevel(50)).toBe("needs-significant-work");
    expect(deriveQualityLevel(59)).toBe("needs-significant-work");
  });
});

describe("aggregateScores", () => {
  it("returns zeroes for empty chapters array", () => {
    const result = aggregateScores([]);
    expect(result).toEqual({
      readability: 0,
      consistency: 0,
      structure: 0,
      accuracy: 0,
    });
  });

  it("returns zeroes when total word count is 0", () => {
    const result = aggregateScores([
      {
        wordCount: 0,
        readability: 80,
        consistency: 70,
        structure: 85,
        accuracy: 90,
      },
    ]);
    expect(result).toEqual({
      readability: 0,
      consistency: 0,
      structure: 0,
      accuracy: 0,
    });
  });

  it("returns exact scores for a single chapter", () => {
    const result = aggregateScores([
      {
        wordCount: 1000,
        readability: 80,
        consistency: 70,
        structure: 85,
        accuracy: 90,
      },
    ]);
    expect(result).toEqual({
      readability: 80,
      consistency: 70,
      structure: 85,
      accuracy: 90,
    });
  });

  it("computes equal-weight average when word counts are equal", () => {
    const result = aggregateScores([
      {
        wordCount: 1000,
        readability: 80,
        consistency: 60,
        structure: 90,
        accuracy: 70,
      },
      {
        wordCount: 1000,
        readability: 90,
        consistency: 80,
        structure: 70,
        accuracy: 90,
      },
    ]);
    expect(result).toEqual({
      readability: 85,
      consistency: 70,
      structure: 80,
      accuracy: 80,
    });
  });

  it("weights by word count when chapters differ in length", () => {
    // Chapter 1: 3000 words, all scores 90
    // Chapter 2: 1000 words, all scores 50
    // Weighted: (3000*90 + 1000*50) / 4000 = 320000/4000 = 80
    const result = aggregateScores([
      {
        wordCount: 3000,
        readability: 90,
        consistency: 90,
        structure: 90,
        accuracy: 90,
      },
      {
        wordCount: 1000,
        readability: 50,
        consistency: 50,
        structure: 50,
        accuracy: 50,
      },
    ]);
    expect(result).toEqual({
      readability: 80,
      consistency: 80,
      structure: 80,
      accuracy: 80,
    });
  });

  it("rounds to nearest integer", () => {
    // 2000*85 + 1000*70 = 240000/3000 = 80
    // 2000*77 + 1000*63 = 217000/3000 = 72.333... → 72
    const result = aggregateScores([
      {
        wordCount: 2000,
        readability: 85,
        consistency: 77,
        structure: 90,
        accuracy: 60,
      },
      {
        wordCount: 1000,
        readability: 70,
        consistency: 63,
        structure: 80,
        accuracy: 90,
      },
    ]);
    expect(result.readability).toBe(80);
    expect(result.consistency).toBe(72);
    expect(result.structure).toBe(87);
    expect(result.accuracy).toBe(70);
  });

  it("handles three chapters with different word counts", () => {
    const result = aggregateScores([
      {
        wordCount: 1000,
        readability: 100,
        consistency: 100,
        structure: 100,
        accuracy: 100,
      },
      {
        wordCount: 1000,
        readability: 80,
        consistency: 80,
        structure: 80,
        accuracy: 80,
      },
      {
        wordCount: 1000,
        readability: 60,
        consistency: 60,
        structure: 60,
        accuracy: 60,
      },
    ]);
    // Equal weight → simple average: (100+80+60)/3 = 80
    expect(result).toEqual({
      readability: 80,
      consistency: 80,
      structure: 80,
      accuracy: 80,
    });
  });
});
