"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "@/server/queries/users";
import {
  createBook,
  updateBook,
  softDeleteBook,
} from "@/server/mutations/books";
import {
  createBookSchema,
  updateBookSchema,
  bookIdSchema,
} from "@/lib/validations/books";
import type { Book } from "@/server/db/schema";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireUser(): Promise<ActionResult<{ id: string }>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: "Unauthorized" };
  }
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return { success: false, error: "User not found" };
  }
  return { success: true, data: { id: user.id } };
}

export async function createBookAction(
  input: unknown
): Promise<ActionResult<Book>> {
  const userResult = await requireUser();
  if (!userResult.success) return userResult;

  const parseResult = createBookSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const result = await createBook(userResult.data.id, parseResult.data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard");
  return { success: true, data: result.data };
}

export async function updateBookAction(
  bookId: unknown,
  input: unknown
): Promise<ActionResult<Book>> {
  const userResult = await requireUser();
  if (!userResult.success) return userResult;

  const idParse = bookIdSchema.safeParse(bookId);
  if (!idParse.success) {
    return { success: false, error: "Invalid book ID" };
  }

  const parseResult = updateBookSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const result = await updateBook(
    idParse.data,
    userResult.data.id,
    parseResult.data
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/books/${idParse.data}`);
  return { success: true, data: result.data };
}

export async function deleteBookAction(
  bookId: unknown
): Promise<ActionResult<{ id: string }>> {
  const userResult = await requireUser();
  if (!userResult.success) return userResult;

  const idParse = bookIdSchema.safeParse(bookId);
  if (!idParse.success) {
    return { success: false, error: "Invalid book ID" };
  }

  const result = await softDeleteBook(idParse.data, userResult.data.id);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard");
  return { success: true, data: result.data };
}
