import { describe, it, expect } from "vitest";
import { deriveWizardState, determinePhase } from "@/lib/ai/wizard-state";
import type { ConversationMessage } from "@/types/wizard";

function makeHistory(questionCount: number): ConversationMessage[] {
  const messages: ConversationMessage[] = [];
  for (let i = 0; i < questionCount; i++) {
    messages.push({ role: "user", content: `Answer ${i + 1}` });
    messages.push({ role: "assistant", content: `Question ${i + 1}` });
  }
  return messages;
}

describe("determinePhase (wizard-state)", () => {
  it("returns topic_exploration for 0-2 questions", () => {
    expect(determinePhase(0, false)).toBe("topic_exploration");
    expect(determinePhase(2, false)).toBe("topic_exploration");
  });

  it("returns audience_definition for 3-4 questions", () => {
    expect(determinePhase(3, false)).toBe("audience_definition");
    expect(determinePhase(4, false)).toBe("audience_definition");
  });

  it("returns expertise_extraction for 5-8 questions", () => {
    expect(determinePhase(5, false)).toBe("expertise_extraction");
    expect(determinePhase(8, false)).toBe("expertise_extraction");
  });

  it("returns gap_analysis for 9-11 questions", () => {
    expect(determinePhase(9, false)).toBe("gap_analysis");
    expect(determinePhase(11, false)).toBe("gap_analysis");
  });

  it("returns outline_generation at target count", () => {
    expect(determinePhase(12, false)).toBe("outline_generation");
  });

  it("returns outline_generation when ready signal present", () => {
    expect(determinePhase(5, true)).toBe("outline_generation");
  });
});

describe("deriveWizardState (wizard-state)", () => {
  it("returns topic_exploration for empty conversation", () => {
    const state = deriveWizardState([], "SaaS Growth", "founders", "expert");
    expect(state.phase).toBe("topic_exploration");
    expect(state.questionCount).toBe(0);
    expect(state.isReadyForOutline).toBe(false);
  });

  it("counts assistant messages as questions", () => {
    const history = makeHistory(5);
    const state = deriveWizardState(history, "Topic", null, null);
    expect(state.questionCount).toBe(5);
    expect(state.phase).toBe("expertise_extraction");
  });

  it("detects ready_for_outline signal", () => {
    const history: ConversationMessage[] = [
      { role: "user", content: "My answer" },
      {
        role: "assistant",
        content:
          "Great! <phase_signal>ready_for_outline</phase_signal> Shall we generate?",
      },
    ];
    const state = deriveWizardState(history, "Topic", null, null);
    expect(state.isReadyForOutline).toBe(true);
    expect(state.phase).toBe("outline_generation");
  });

  it("collects gap suggestions", () => {
    const history: ConversationMessage[] = [
      { role: "user", content: "Answer" },
      {
        role: "assistant",
        content: `Question <gap_suggestion>
<area>Pricing</area>
<description>Missing pricing coverage</description>
<importance>high</importance>
</gap_suggestion>`,
      },
    ];
    const state = deriveWizardState(history, "Topic", null, null);
    expect(state.detectedGaps).toHaveLength(1);
    expect(state.detectedGaps[0]!.area).toBe("Pricing");
  });
});
