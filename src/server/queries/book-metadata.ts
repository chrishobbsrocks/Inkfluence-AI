import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { bookMetadata } from "@/server/db/schema/book-metadata";
import { books } from "@/server/db/schema/books";

/** Get book metadata, verifying ownership */
export async function getBookMetadata(bookId: string, userId: string) {
  const result = await db
    .select({ metadata: bookMetadata })
    .from(bookMetadata)
    .innerJoin(books, eq(bookMetadata.bookId, books.id))
    .where(and(eq(bookMetadata.bookId, bookId), eq(books.userId, userId)))
    .limit(1);

  return result[0]?.metadata ?? null;
}
