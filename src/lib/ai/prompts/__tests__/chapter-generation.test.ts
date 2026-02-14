import { describe, it, expect } from "vitest";
import {
  buildChapterGenerationSystemPrompt,
  buildChapterGenerationUserPrompt,
} from "../chapter-generation";
import type { ChapterGenerationContext } from "@/types/chapter-generation";

function makeContext(
  overrides: Partial<ChapterGenerationContext> = {}
): ChapterGenerationContext {
  return {
    chapterTitle: "Introduction to TypeScript",
    keyPoints: ["Type safety", "Tooling support", "Migration from JavaScript"],
    bookTopic: "TypeScript for Backend Developers",
    audience: "Senior engineers transitioning from JavaScript",
    expertise: "intermediate",
    tone: "professional",
    previousChapterSummaries: [],
    conversationContext: null,
    ...overrides,
  };
}

describe("buildChapterGenerationSystemPrompt", () => {
  it("includes the book topic", () => {
    const result = buildChapterGenerationSystemPrompt(makeContext());
    expect(result).toContain("TypeScript for Backend Developers");
  });

  it("includes the audience when provided", () => {
    const result = buildChapterGenerationSystemPrompt(makeContext());
    expect(result).toContain("Senior engineers transitioning from JavaScript");
  });

  it("uses default audience when null", () => {
    const result = buildChapterGenerationSystemPrompt(
      makeContext({ audience: null })
    );
    expect(result).toContain("General readers interested in the topic");
  });

  it("includes professional tone instructions", () => {
    const result = buildChapterGenerationSystemPrompt(
      makeContext({ tone: "professional" })
    );
    expect(result).toContain("clear, authoritative, professional tone");
  });

  it("includes conversational tone instructions", () => {
    const result = buildChapterGenerationSystemPrompt(
      makeContext({ tone: "conversational" })
    );
    expect(result).toContain("warm, engaging, conversational tone");
  });

  it("includes academic tone instructions", () => {
    const result = buildChapterGenerationSystemPrompt(
      makeContext({ tone: "academic" })
    );
    expect(result).toContain("formal, scholarly, academic tone");
  });

  it("includes beginner expertise instructions", () => {
    const result = buildChapterGenerationSystemPrompt(
      makeContext({ expertise: "beginner" })
    );
    expect(result).toContain("first principles");
  });

  it("includes intermediate expertise instructions", () => {
    const result = buildChapterGenerationSystemPrompt(
      makeContext({ expertise: "intermediate" })
    );
    expect(result).toContain("familiarity with basics");
  });

  it("includes expert expertise instructions", () => {
    const result = buildChapterGenerationSystemPrompt(
      makeContext({ expertise: "expert" })
    );
    expect(result).toContain("deep domain knowledge");
  });

  it("includes previous chapter summaries when provided", () => {
    const result = buildChapterGenerationSystemPrompt(
      makeContext({
        previousChapterSummaries: [
          { title: "Preface", summary: "An introduction to the book." },
          { title: "Setup", summary: "How to install TypeScript." },
        ],
      })
    );
    expect(result).toContain("Previous Chapters");
    expect(result).toContain("**Preface**");
    expect(result).toContain("An introduction to the book.");
    expect(result).toContain("**Setup**");
  });

  it("omits previous chapters section when empty", () => {
    const result = buildChapterGenerationSystemPrompt(makeContext());
    expect(result).not.toContain("Previous Chapters");
  });

  it("includes conversation context when provided", () => {
    const result = buildChapterGenerationSystemPrompt(
      makeContext({
        conversationContext: "The author is an expert in Node.js and has 10 years experience.",
      })
    );
    expect(result).toContain("Author's Voice and Expertise");
    expect(result).toContain("expert in Node.js");
  });

  it("omits conversation context when null", () => {
    const result = buildChapterGenerationSystemPrompt(makeContext());
    expect(result).not.toContain("Author's Voice and Expertise");
  });

  it("includes HTML format instructions", () => {
    const result = buildChapterGenerationSystemPrompt(makeContext());
    expect(result).toContain("<h2>");
    expect(result).toContain("<p>");
    expect(result).toContain("2000-3000 words");
  });
});

describe("buildChapterGenerationUserPrompt", () => {
  it("includes the chapter title", () => {
    const result = buildChapterGenerationUserPrompt(makeContext());
    expect(result).toContain("Introduction to TypeScript");
  });

  it("includes numbered key points", () => {
    const result = buildChapterGenerationUserPrompt(makeContext());
    expect(result).toContain("1. Type safety");
    expect(result).toContain("2. Tooling support");
    expect(result).toContain("3. Migration from JavaScript");
  });

  it("handles empty key points gracefully", () => {
    const result = buildChapterGenerationUserPrompt(
      makeContext({ keyPoints: [] })
    );
    expect(result).toContain("No specific key points provided");
  });

  it("mentions target word count", () => {
    const result = buildChapterGenerationUserPrompt(makeContext());
    expect(result).toContain("2000-3000 words");
  });
});
