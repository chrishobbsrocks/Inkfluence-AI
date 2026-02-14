import { eq, and, desc } from "drizzle-orm";
import { db } from "@/server/db";
import { qaAnalyses } from "@/server/db/schema/qa-analyses";
import { books } from "@/server/db/schema/books";

/** Get the most recent QA analysis for a book, verifying ownership */
export async function getLatestQAAnalysis(bookId: string, userId: string) {
  const result = await db
    .select({ qaAnalysis: qaAnalyses })
    .from(qaAnalyses)
    .innerJoin(books, eq(qaAnalyses.bookId, books.id))
    .where(and(eq(qaAnalyses.bookId, bookId), eq(books.userId, userId)))
    .orderBy(desc(qaAnalyses.createdAt))
    .limit(1);

  return result[0]?.qaAnalysis ?? null;
}
