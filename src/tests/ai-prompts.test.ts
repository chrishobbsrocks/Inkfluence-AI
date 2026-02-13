import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "@/lib/ai/prompts/system-prompt";
import { buildOutlinePrompt } from "@/lib/ai/prompts/outline-generation";
import type { WizardState } from "@/types/wizard";

function makeState(overrides: Partial<WizardState> = {}): WizardState {
  return {
    phase: "topic_exploration",
    questionCount: 0,
    totalQuestions: 12,
    topic: "growth strategies for SaaS startups",
    audience: "early-stage founders",
    expertiseLevel: "expert",
    detectedGaps: [],
    isReadyForOutline: false,
    ...overrides,
  };
}

describe("buildSystemPrompt", () => {
  it("includes topic in the prompt", () => {
    const prompt = buildSystemPrompt(makeState());
    expect(prompt).toContain("growth strategies for SaaS startups");
  });

  it("includes audience when provided", () => {
    const prompt = buildSystemPrompt(makeState({ audience: "early-stage founders" }));
    expect(prompt).toContain("early-stage founders");
  });

  it("handles null audience gracefully", () => {
    const prompt = buildSystemPrompt(makeState({ audience: null }));
    expect(prompt).toContain("Not yet defined");
  });

  it("includes question count progress", () => {
    const prompt = buildSystemPrompt(makeState({ questionCount: 5 }));
    expect(prompt).toContain("Question 5 of ~12");
  });

  it("includes topic_exploration phase instructions for early questions", () => {
    const prompt = buildSystemPrompt(
      makeState({ phase: "topic_exploration", questionCount: 1 })
    );
    expect(prompt).toContain("Topic Exploration");
    expect(prompt).toContain("core thesis");
  });

  it("includes audience_definition phase instructions", () => {
    const prompt = buildSystemPrompt(
      makeState({ phase: "audience_definition", questionCount: 3 })
    );
    expect(prompt).toContain("Audience Definition");
    expect(prompt).toContain("target reader");
  });

  it("includes expertise_extraction phase instructions", () => {
    const prompt = buildSystemPrompt(
      makeState({ phase: "expertise_extraction", questionCount: 6 })
    );
    expect(prompt).toContain("Expertise Extraction");
    expect(prompt).toContain("methodologies");
  });

  it("includes gap_analysis phase instructions with XML tag examples", () => {
    const prompt = buildSystemPrompt(
      makeState({ phase: "gap_analysis", questionCount: 10 })
    );
    expect(prompt).toContain("Gap Analysis");
    expect(prompt).toContain("<gap_suggestion>");
  });

  it("includes outline_generation phase instructions with signal tag", () => {
    const prompt = buildSystemPrompt(
      makeState({ phase: "outline_generation", questionCount: 12, isReadyForOutline: true })
    );
    expect(prompt).toContain("Ready for Outline");
    expect(prompt).toContain("<phase_signal>");
  });

  it("always includes the one-question rule", () => {
    const prompt = buildSystemPrompt(makeState());
    expect(prompt).toContain("ONE question per response");
  });
});

describe("buildOutlinePrompt", () => {
  it("includes topic and audience in the prompt", () => {
    const prompt = buildOutlinePrompt([], "AI writing", "authors");
    expect(prompt).toContain("AI writing");
    expect(prompt).toContain("authors");
  });

  it("includes conversation history", () => {
    const history = [
      { role: "user" as const, content: "I know about retention" },
      { role: "assistant" as const, content: "Tell me more about retention" },
    ];
    const prompt = buildOutlinePrompt(history, "SaaS growth", null);
    expect(prompt).toContain("I know about retention");
    expect(prompt).toContain("Tell me more about retention");
  });

  it("handles null audience", () => {
    const prompt = buildOutlinePrompt([], "Topic", null);
    expect(prompt).toContain("General readers");
  });
});
