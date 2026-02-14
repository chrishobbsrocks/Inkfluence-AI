"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "@/server/queries/users";
import { getChapterById } from "@/server/queries/chapters";
import { updateChapterContent } from "@/server/mutations/chapters";
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
