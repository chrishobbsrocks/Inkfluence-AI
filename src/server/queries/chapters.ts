import { eq, and, asc, desc, gt, lt } from "drizzle-orm";
import { db } from "@/server/db";
import { chapters, books } from "@/server/db/schema";

/** Get a single chapter by ID, verifying ownership through the book relation */
export async function getChapterById(chapterId: string, userId: string) {
  const result = await db
    .select({ chapter: chapters })
    .from(chapters)
    .innerJoin(books, eq(chapters.bookId, books.id))
    .where(and(eq(chapters.id, chapterId), eq(books.userId, userId)))
    .limit(1);

  return result[0]?.chapter ?? null;
}

/** Get previous chapters with content for context summaries */
export async function getPreviousChapterSummaries(
  bookId: string,
  currentOrderIndex: number,
  userId: string
): Promise<Array<{ title: string; content: string | null }>> {
  const result = await db
    .select({
      title: chapters.title,
      content: chapters.content,
    })
    .from(chapters)
    .innerJoin(books, eq(chapters.bookId, books.id))
    .where(
      and(
        eq(chapters.bookId, bookId),
        eq(books.userId, userId),
        lt(chapters.orderIndex, currentOrderIndex)
      )
    )
    .orderBy(asc(chapters.orderIndex));

  return result;
}

/** Get all chapters for a book, ordered by orderIndex */
export async function getChaptersByBookId(bookId: string, userId: string) {
  const result = await db
    .select({ chapter: chapters })
    .from(chapters)
    .innerJoin(books, eq(chapters.bookId, books.id))
    .where(and(eq(chapters.bookId, bookId), eq(books.userId, userId)))
    .orderBy(asc(chapters.orderIndex));

  return result.map((r) => r.chapter);
}

/** Get the previous chapter before the given orderIndex */
export async function getPreviousChapter(
  bookId: string,
  currentOrderIndex: number,
  userId: string
) {
  const result = await db
    .select({ chapter: chapters })
    .from(chapters)
    .innerJoin(books, eq(chapters.bookId, books.id))
    .where(
      and(
        eq(chapters.bookId, bookId),
        eq(books.userId, userId),
        lt(chapters.orderIndex, currentOrderIndex)
      )
    )
    .orderBy(desc(chapters.orderIndex))
    .limit(1);

  return result[0]?.chapter ?? null;
}

/** Get the next chapter after the given orderIndex */
export async function getNextChapter(
  bookId: string,
  currentOrderIndex: number,
  userId: string
) {
  const result = await db
    .select({ chapter: chapters })
    .from(chapters)
    .innerJoin(books, eq(chapters.bookId, books.id))
    .where(
      and(
        eq(chapters.bookId, bookId),
        eq(books.userId, userId),
        gt(chapters.orderIndex, currentOrderIndex)
      )
    )
    .orderBy(asc(chapters.orderIndex))
    .limit(1);

  return result[0]?.chapter ?? null;
}
