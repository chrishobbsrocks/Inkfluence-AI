import type {
  ConversationMessage,
  WizardState,
  WizardPhase,
  GapSuggestion,
} from "@/types/wizard";
import { parseGapSuggestions, parsePhaseSignal } from "./response-parser";
import { TARGET_QUESTION_COUNT } from "./prompts/constants";

/** Determine the wizard phase based on question count */
export function determinePhase(
  questionCount: number,
  hasReadySignal: boolean
): WizardPhase {
  if (hasReadySignal || questionCount >= TARGET_QUESTION_COUNT) {
    return "outline_generation";
  }
  if (questionCount >= 9) return "gap_analysis";
  if (questionCount >= 5) return "expertise_extraction";
  if (questionCount >= 3) return "audience_definition";
  return "topic_exploration";
}

/** Derive the wizard state from conversation history (pure function) */
export function deriveWizardState(
  conversationHistory: ConversationMessage[],
  topic: string,
  audience: string | null,
  expertiseLevel: string | null
): WizardState {
  // Count assistant messages as questions
  const questionCount = conversationHistory.filter(
    (m) => m.role === "assistant"
  ).length;

  // Check for ready signal in the last assistant message
  const lastAssistantMsg = [...conversationHistory]
    .reverse()
    .find((m) => m.role === "assistant");
  const hasReadySignal = lastAssistantMsg
    ? parsePhaseSignal(lastAssistantMsg.content) === "ready_for_outline"
    : false;

  // Collect all gap suggestions from the conversation
  const detectedGaps: GapSuggestion[] = conversationHistory
    .filter((m) => m.role === "assistant")
    .flatMap((m) => parseGapSuggestions(m.content));

  const phase = determinePhase(questionCount, hasReadySignal);

  return {
    phase,
    questionCount,
    totalQuestions: TARGET_QUESTION_COUNT,
    topic,
    audience,
    expertiseLevel,
    detectedGaps,
    isReadyForOutline: phase === "outline_generation",
  };
}
