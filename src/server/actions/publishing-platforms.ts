"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import {
  connectPlatform,
  disconnectPlatform,
  updatePlatformStatus,
  markPlatformSubmitted,
} from "@/server/mutations/publishing-platforms";
import {
  connectPlatformSchema,
  updatePlatformStatusSchema,
} from "@/lib/validations/publishing-platforms";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireUserAndBook(
  bookId: string
): Promise<ActionResult<{ userId: string }>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: false, error: "Unauthorized" };

  const user = await getUserByClerkId(clerkId);
  if (!user) return { success: false, error: "User not found" };

  const book = await getBookById(bookId, user.id);
  if (!book) return { success: false, error: "Book not found" };

  return { success: true, data: { userId: user.id } };
}

export async function connectPlatformAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parseResult = connectPlatformSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const { bookId, platformCode } = parseResult.data;
  const authResult = await requireUserAndBook(bookId);
  if (!authResult.success) return authResult;

  const result = await connectPlatform(bookId, platformCode);
  revalidatePath(`/books/${bookId}/publish`);

  return { success: true, data: { id: result.id } };
}

export async function disconnectPlatformAction(
  bookId: string,
  platformCode: string
): Promise<ActionResult<{ success: boolean }>> {
  const authResult = await requireUserAndBook(bookId);
  if (!authResult.success) return authResult;

  await disconnectPlatform(bookId, platformCode);
  revalidatePath(`/books/${bookId}/publish`);

  return { success: true, data: { success: true } };
}

export async function markPlatformSubmittedAction(
  bookId: string,
  platformCode: string
): Promise<ActionResult<{ id: string }>> {
  const authResult = await requireUserAndBook(bookId);
  if (!authResult.success) return authResult;

  const result = await markPlatformSubmitted(bookId, platformCode);
  if (!result) return { success: false, error: "Platform not found" };

  revalidatePath(`/books/${bookId}/publish`);
  return { success: true, data: { id: result.id } };
}

export async function updatePlatformStatusAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parseResult = updatePlatformStatusSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const { bookId, platformCode, status, notes } = parseResult.data;
  const authResult = await requireUserAndBook(bookId);
  if (!authResult.success) return authResult;

  const result = await updatePlatformStatus(
    bookId,
    platformCode,
    status,
    notes
  );
  if (!result) return { success: false, error: "Platform not found" };

  revalidatePath(`/books/${bookId}/publish`);
  return { success: true, data: { id: result.id } };
}
