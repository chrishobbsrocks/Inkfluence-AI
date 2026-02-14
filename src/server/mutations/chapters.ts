import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { chapters, type Chapter } from "@/server/db/schema";

export type MutationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: "NOT_FOUND" | "VALIDATION_ERROR" };

/** Create chapters from outline sections */
export async function createChaptersFromSections(
  bookId: string,
  sections: Array<{ chapterTitle: string; orderIndex: number }>
): Promise<MutationResult<Chapter[]>> {
  if (sections.length === 0) {
    return {
      success: false,
      error: "At least one section is required",
      code: "VALIDATION_ERROR",
    };
  }

  const result = await db
    .insert(chapters)
    .values(
      sections.map((s) => ({
        bookId,
        title: s.chapterTitle,
        orderIndex: s.orderIndex,
        content: null,
        wordCount: 0,
        status: "outline" as const,
      }))
    )
    .returning();

  return { success: true, data: result };
}

/** Update chapter content (title + content + wordCount) */
export async function updateChapterContent(
  chapterId: string,
  input: { title: string; content: string | null; wordCount: number }
): Promise<MutationResult<Chapter>> {
  const result = await db
    .update(chapters)
    .set({
      title: input.title,
      content: input.content,
      wordCount: input.wordCount,
    })
    .where(eq(chapters.id, chapterId))
    .returning();

  if (!result[0]) {
    return { success: false, error: "Chapter not found", code: "NOT_FOUND" };
  }

  return { success: true, data: result[0] };
}
