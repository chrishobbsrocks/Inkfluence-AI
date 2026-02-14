import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { chapters, type Chapter } from "@/server/db/schema";

export type MutationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: "NOT_FOUND" | "VALIDATION_ERROR" };

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
