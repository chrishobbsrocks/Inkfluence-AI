"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "@/server/queries/users";
import { getOutlineById } from "@/server/queries/outlines";
import { saveOutlineSections } from "@/server/mutations/outlines";
import { saveOutlineSectionsSchema } from "@/lib/validations/outlines";
import type { OutlineSection } from "@/server/db/schema";

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

export async function saveOutlineEditorAction(
  input: unknown
): Promise<ActionResult<OutlineSection[]>> {
  const userResult = await requireUser();
  if (!userResult.success) return userResult;

  const parsed = saveOutlineSectionsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { outlineId, sections } = parsed.data;

  // Verify ownership
  const outline = await getOutlineById(outlineId, userResult.data.id);
  if (!outline) {
    return { success: false, error: "Outline not found" };
  }

  const result = await saveOutlineSections(outlineId, sections);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/books`);

  return { success: true, data: result.data };
}
