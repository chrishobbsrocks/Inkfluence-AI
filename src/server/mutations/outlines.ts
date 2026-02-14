import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  outlines,
  outlineSections,
  type Outline,
  type OutlineSection,
} from "@/server/db/schema";
import type { ConversationMessage } from "@/types/wizard";

export type MutationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: "NOT_FOUND" | "VALIDATION_ERROR" };

/** Create a new outline for a book */
export async function createOutline(
  bookId: string,
  input: {
    topic: string;
    audience?: string;
    expertiseLevel?: string;
  }
): Promise<MutationResult<Outline>> {
  const result = await db
    .insert(outlines)
    .values({
      bookId,
      topic: input.topic,
      audience: input.audience ?? null,
      expertiseLevel: input.expertiseLevel ?? null,
      conversationHistory: [],
    })
    .returning();

  return { success: true, data: result[0]! };
}

/** Update the conversation history for an outline */
export async function updateConversationHistory(
  outlineId: string,
  conversationHistory: ConversationMessage[]
): Promise<MutationResult<Outline>> {
  const result = await db
    .update(outlines)
    .set({ conversationHistory })
    .where(eq(outlines.id, outlineId))
    .returning();

  if (!result[0]) {
    return { success: false, error: "Outline not found", code: "NOT_FOUND" };
  }

  return { success: true, data: result[0] };
}

/** Save outline sections (atomic replace: delete existing, insert new) */
export async function saveOutlineSections(
  outlineId: string,
  chapters: Array<{
    chapterTitle: string;
    keyPoints: string[];
    orderIndex: number;
    aiSuggested?: boolean;
  }>
): Promise<MutationResult<OutlineSection[]>> {
  // Delete existing sections for this outline
  await db
    .delete(outlineSections)
    .where(eq(outlineSections.outlineId, outlineId));

  // Insert new sections
  const values = chapters.map((chapter) => ({
    outlineId,
    chapterTitle: chapter.chapterTitle,
    keyPoints: chapter.keyPoints,
    orderIndex: chapter.orderIndex,
    aiSuggested: chapter.aiSuggested ?? false,
  }));

  const result = await db.insert(outlineSections).values(values).returning();

  return { success: true, data: result };
}

/** Update outline metadata (audience, expertise level) */
export async function updateOutlineMetadata(
  outlineId: string,
  data: { audience?: string; expertiseLevel?: string }
): Promise<MutationResult<Outline>> {
  const result = await db
    .update(outlines)
    .set({
      ...(data.audience !== undefined && { audience: data.audience }),
      ...(data.expertiseLevel !== undefined && {
        expertiseLevel: data.expertiseLevel,
      }),
    })
    .where(eq(outlines.id, outlineId))
    .returning();

  if (!result[0]) {
    return { success: false, error: "Outline not found", code: "NOT_FOUND" };
  }

  return { success: true, data: result[0] };
}
