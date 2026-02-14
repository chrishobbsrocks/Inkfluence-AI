"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getChapterById, getChaptersByBookId } from "@/server/queries/chapters";
import { getOutlineByBookId, getOutlineWithSections } from "@/server/queries/outlines";
import {
  updateChapterContent,
  createChaptersFromSections,
} from "@/server/mutations/chapters";
import { updateBook } from "@/server/mutations/books";
import {
  chapterIdSchema,
  updateChapterContentSchema,
} from "@/lib/validations/chapters";
import type { Chapter } from "@/server/db/schema";

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

export async function updateChapterContentAction(
  chapterId: unknown,
  input: unknown
): Promise<ActionResult<Chapter>> {
  const userResult = await requireUser();
  if (!userResult.success) return userResult;

  const idParsed = chapterIdSchema.safeParse(chapterId);
  if (!idParsed.success) {
    return {
      success: false,
      error: idParsed.error.issues[0]?.message ?? "Invalid chapter ID",
    };
  }

  const inputParsed = updateChapterContentSchema.safeParse(input);
  if (!inputParsed.success) {
    return {
      success: false,
      error: inputParsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  // Verify ownership
  const chapter = await getChapterById(idParsed.data, userResult.data.id);
  if (!chapter) {
    return { success: false, error: "Chapter not found" };
  }

  const result = await updateChapterContent(idParsed.data, inputParsed.data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/books/${chapter.bookId}/editor`);

  return { success: true, data: result.data };
}

/** Convert outline sections → chapters and transition book to "writing" */
export async function convertOutlineToChaptersAction(
  bookId: string
): Promise<ActionResult<Chapter[]>> {
  const userResult = await requireUser();
  if (!userResult.success) return userResult;

  const userId = userResult.data.id;

  // Verify book ownership
  const book = await getBookById(bookId, userId);
  if (!book) {
    return { success: false, error: "Book not found" };
  }

  // Idempotency: skip if chapters already exist
  const existingChapters = await getChaptersByBookId(bookId, userId);
  if (existingChapters.length > 0) {
    return { success: true, data: existingChapters };
  }

  // Get outline sections
  const outline = await getOutlineByBookId(bookId, userId);
  if (!outline) {
    return { success: false, error: "No outline found for this book" };
  }

  const outlineData = await getOutlineWithSections(outline.id, userId);
  const sections = outlineData?.sections ?? [];

  // Validation: at least 1 section required
  if (sections.length === 0) {
    return { success: false, error: "Outline has no sections. Add at least one chapter to your outline." };
  }

  // Create chapters from sections
  const chaptersResult = await createChaptersFromSections(
    bookId,
    sections.map((s) => ({
      chapterTitle: s.chapterTitle,
      orderIndex: s.orderIndex,
    }))
  );
  if (!chaptersResult.success) {
    return { success: false, error: chaptersResult.error };
  }

  // Update book status: draft → writing
  await updateBook(bookId, userId, { status: "writing" });

  revalidatePath(`/books/${bookId}/editor`);
  revalidatePath(`/books/${bookId}/outline`);

  return { success: true, data: chaptersResult.data };
}
