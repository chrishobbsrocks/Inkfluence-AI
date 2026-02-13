import { eq, and, isNull, desc, asc, count, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { books } from "@/server/db/schema";
import type { ListBooksParams } from "@/lib/validations/books";

export async function getBooks(userId: string, params: ListBooksParams) {
  const { status, sortBy, sortOrder, page, limit } = params;

  const conditions = [eq(books.userId, userId), isNull(books.deletedAt)];
  if (status) {
    conditions.push(eq(books.status, status));
  }
  const whereClause = and(...conditions);

  const sortColumn = {
    createdAt: books.createdAt,
    updatedAt: books.updatedAt,
    title: books.title,
  }[sortBy];
  const orderFn = sortOrder === "asc" ? asc : desc;

  const [bookRows, countResult] = await Promise.all([
    db
      .select()
      .from(books)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(books).where(whereClause),
  ]);

  const total = countResult[0]?.total ?? 0;

  return {
    books: bookRows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBookById(bookId: string, userId: string) {
  const result = await db
    .select()
    .from(books)
    .where(
      and(eq(books.id, bookId), eq(books.userId, userId), isNull(books.deletedAt))
    )
    .limit(1);

  return result[0] ?? null;
}

export async function getBookStats(userId: string) {
  const whereClause = and(eq(books.userId, userId), isNull(books.deletedAt));

  const result = await db
    .select({
      totalBooks: count(),
      draftCount: count(
        sql`CASE WHEN ${books.status} = 'draft' THEN 1 END`
      ),
      writingCount: count(
        sql`CASE WHEN ${books.status} = 'writing' THEN 1 END`
      ),
      reviewCount: count(
        sql`CASE WHEN ${books.status} = 'review' THEN 1 END`
      ),
      publishedCount: count(
        sql`CASE WHEN ${books.status} = 'published' THEN 1 END`
      ),
      totalWordCount:
        sql<number>`COALESCE(SUM(${books.wordCount}), 0)`.mapWith(Number),
    })
    .from(books)
    .where(whereClause);

  const row = result[0];

  return {
    totalBooks: row?.totalBooks ?? 0,
    draftCount: row?.draftCount ?? 0,
    writingCount: row?.writingCount ?? 0,
    reviewCount: row?.reviewCount ?? 0,
    publishedCount: row?.publishedCount ?? 0,
    totalWordCount: row?.totalWordCount ?? 0,
  };
}
