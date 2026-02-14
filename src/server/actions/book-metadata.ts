"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { upsertBookMetadata } from "@/server/mutations/book-metadata";
import { updateBookMetadataSchema } from "@/lib/validations/book-metadata";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function saveBookMetadataAction(
  bookId: string,
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const book = await getBookById(bookId, user.id);
  if (!book) {
    return { success: false, error: "Book not found" };
  }

  const parseResult = updateBookMetadataSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const result = await upsertBookMetadata(bookId, parseResult.data);
  revalidatePath(`/books/${bookId}/publish`);

  return { success: true, data: { id: result.id } };
}
