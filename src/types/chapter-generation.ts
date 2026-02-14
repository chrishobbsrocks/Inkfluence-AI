/** Tone options for content generation */
export type GenerationTone = "professional" | "conversational" | "academic";

/** Expertise level for content generation depth */
export type GenerationExpertise = "beginner" | "intermediate" | "expert";

/** Request shape for chapter content generation */
export interface ChapterGenerationRequest {
  chapterId: string;
  bookId: string;
  tone: GenerationTone;
  expertise: GenerationExpertise;
}

/** Context assembled server-side for prompt construction */
export interface ChapterGenerationContext {
  chapterTitle: string;
  keyPoints: string[];
  bookTopic: string;
  audience: string | null;
  expertise: GenerationExpertise;
  tone: GenerationTone;
  previousChapterSummaries: Array<{
    title: string;
    summary: string;
  }>;
  conversationContext: string | null;
}

/** SSE event types for generation stream */
export type GenerationSSEEvent =
  | { type: "text"; content: string }
  | { type: "metadata"; content: string }
  | { type: "save_status"; content: string }
  | { type: "done"; content: string }
  | { type: "error"; content: string };

/** Save status payload sent after stream completes */
export interface SaveStatusPayload {
  success: boolean;
  chapterId?: string;
  error?: string;
}

/** Metadata sent at end of generation stream */
export interface GenerationMetadata {
  wordCount: number;
  completedAt: string;
}

/** State of the generation process in the client hook */
export type GenerationStatus =
  | "idle"
  | "loading"
  | "streaming"
  | "complete"
  | "error";
