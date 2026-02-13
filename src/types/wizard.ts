/** Matches the JSONB shape stored in outlines.conversationHistory */
export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

/** The 5 phases of the Knowledge Extraction Wizard */
export type WizardPhase =
  | "topic_exploration"
  | "audience_definition"
  | "expertise_extraction"
  | "gap_analysis"
  | "outline_generation";

/** Metadata about the current wizard state, derived from conversation history */
export interface WizardState {
  phase: WizardPhase;
  questionCount: number;
  totalQuestions: number;
  topic: string;
  audience: string | null;
  expertiseLevel: string | null;
  detectedGaps: GapSuggestion[];
  isReadyForOutline: boolean;
}

/** A knowledge gap identified by Claude during the conversation */
export interface GapSuggestion {
  area: string;
  description: string;
  importance: "high" | "medium" | "low";
}

/** A single chapter in the generated outline */
export interface GeneratedChapter {
  chapterTitle: string;
  keyPoints: string[];
  orderIndex: number;
}

/** The complete generated outline from Claude */
export interface GeneratedOutline {
  title: string;
  chapters: GeneratedChapter[];
  summary: string;
}

/** What the chat API returns as metadata after streaming completes */
export interface StreamMetadata {
  wizardState: WizardState;
  gaps: GapSuggestion[];
  phaseTransition: WizardPhase | null;
}
