import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { publishingPlatforms } from "@/server/db/schema/publishing-platforms";
import { books } from "@/server/db/schema/books";

/** Get all platforms for a book, verifying ownership */
export async function getBookPlatforms(bookId: string, userId: string) {
  const result = await db
    .select({ platform: publishingPlatforms })
    .from(publishingPlatforms)
    .innerJoin(books, eq(publishingPlatforms.bookId, books.id))
    .where(
      and(eq(publishingPlatforms.bookId, bookId), eq(books.userId, userId))
    );

  return result.map((r) => r.platform);
}
