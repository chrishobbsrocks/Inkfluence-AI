import { eq, and, asc } from "drizzle-orm";
import { db } from "@/server/db";
import { outlines, outlineSections, books } from "@/server/db/schema";

/** Get an outline by ID, verifying ownership through the book relation */
export async function getOutlineById(outlineId: string, userId: string) {
  const result = await db
    .select({
      outline: outlines,
    })
    .from(outlines)
    .innerJoin(books, eq(outlines.bookId, books.id))
    .where(and(eq(outlines.id, outlineId), eq(books.userId, userId)))
    .limit(1);

  return result[0]?.outline ?? null;
}

/** Get an outline with its sections, verifying ownership */
export async function getOutlineWithSections(
  outlineId: string,
  userId: string
) {
  const outline = await getOutlineById(outlineId, userId);
  if (!outline) return null;

  const sections = await db
    .select()
    .from(outlineSections)
    .where(eq(outlineSections.outlineId, outlineId))
    .orderBy(asc(outlineSections.orderIndex));

  return { outline, sections };
}

/** Get outline for a specific book, verifying ownership */
export async function getOutlineByBookId(bookId: string, userId: string) {
  const result = await db
    .select({
      outline: outlines,
    })
    .from(outlines)
    .innerJoin(books, eq(outlines.bookId, books.id))
    .where(and(eq(outlines.bookId, bookId), eq(books.userId, userId)))
    .limit(1);

  return result[0]?.outline ?? null;
}
