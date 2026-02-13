import { eq, and, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { books, type Book } from "@/server/db/schema";
import type { CreateBookInput, UpdateBookInput } from "@/lib/validations/books";
import { isValidTransition } from "@/lib/book-status-machine";

export type MutationResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      code: "NOT_FOUND" | "INVALID_STATUS_TRANSITION" | "VALIDATION_ERROR";
    };

export async function createBook(
  userId: string,
  input: CreateBookInput
): Promise<MutationResult<Book>> {
  const result = await db
    .insert(books)
    .values({
      userId,
      title: input.title,
      description: input.description ?? null,
      status: "draft",
    })
    .returning();

  return { success: true, data: result[0]! };
}

export async function updateBook(
  bookId: string,
  userId: string,
  input: UpdateBookInput
): Promise<MutationResult<Book>> {
  const existing = await db
    .select()
    .from(books)
    .where(
      and(eq(books.id, bookId), eq(books.userId, userId), isNull(books.deletedAt))
    )
    .limit(1);

  if (!existing[0]) {
    return { success: false, error: "Book not found", code: "NOT_FOUND" };
  }

  if (input.status && !isValidTransition(existing[0].status, input.status)) {
    return {
      success: false,
      error: `Cannot transition from "${existing[0].status}" to "${input.status}"`,
      code: "INVALID_STATUS_TRANSITION",
    };
  }

  const result = await db
    .update(books)
    .set({
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.status !== undefined && { status: input.status }),
    })
    .where(eq(books.id, bookId))
    .returning();

  return { success: true, data: result[0]! };
}

export async function softDeleteBook(
  bookId: string,
  userId: string
): Promise<MutationResult<{ id: string }>> {
  const result = await db
    .update(books)
    .set({ deletedAt: new Date() })
    .where(
      and(eq(books.id, bookId), eq(books.userId, userId), isNull(books.deletedAt))
    )
    .returning({ id: books.id });

  if (!result[0]) {
    return { success: false, error: "Book not found", code: "NOT_FOUND" };
  }

  return { success: true, data: { id: result[0].id } };
}
