"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getOutlineById } from "@/server/queries/outlines";
import {
  createOutline,
  updateConversationHistory,
  saveOutlineSections,
} from "@/server/mutations/outlines";
import {
  startWizardSchema,
  generateOutlineSchema,
} from "@/lib/validations/wizard";
import {
  sendInitialMessage,
  generateOutline,
} from "@/lib/ai/chat-engine";
import type { Outline, OutlineSection } from "@/server/db/schema";

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

/** Start a new wizard conversation — creates outline and gets first AI question */
export async function startWizardAction(
  input: unknown
): Promise<ActionResult<Outline>> {
  const userResult = await requireUser();
  if (!userResult.success) return userResult;

  const parseResult = startWizardSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const { bookId, topic, audience, expertiseLevel } = parseResult.data;

  // Verify book belongs to user
  const book = await getBookById(bookId, userResult.data.id);
  if (!book) {
    return { success: false, error: "Book not found" };
  }

  // Create outline record
  const outlineResult = await createOutline(bookId, {
    topic,
    audience,
    expertiseLevel,
  });
  if (!outlineResult.success) {
    return { success: false, error: outlineResult.error };
  }

  // Get initial AI response
  const aiResponse = await sendInitialMessage(
    topic,
    audience ?? null,
    expertiseLevel ?? null
  );

  // Save initial conversation
  const history = [
    {
      role: "user" as const,
      content: `I want to write a book about: ${topic}${audience ? `. My target audience is: ${audience}` : ""}${expertiseLevel ? `. My expertise level: ${expertiseLevel}` : ""}`,
    },
    { role: "assistant" as const, content: aiResponse },
  ];

  const updateResult = await updateConversationHistory(
    outlineResult.data.id,
    history
  );
  if (!updateResult.success) {
    return { success: false, error: updateResult.error };
  }

  return { success: true, data: updateResult.data };
}

/** Generate outline from conversation — calls Claude with tool-use */
export async function generateOutlineAction(
  input: unknown
): Promise<ActionResult<{ outline: Outline; sections: OutlineSection[] }>> {
  const userResult = await requireUser();
  if (!userResult.success) return userResult;

  const parseResult = generateOutlineSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const { outlineId } = parseResult.data;

  // Verify outline exists and belongs to user
  const outline = await getOutlineById(outlineId, userResult.data.id);
  if (!outline) {
    return { success: false, error: "Outline not found" };
  }

  const conversationHistory =
    (outline.conversationHistory as Array<{
      role: "user" | "assistant";
      content: string;
    }>) ?? [];

  if (conversationHistory.length < 4) {
    return {
      success: false,
      error: "Not enough conversation history to generate an outline",
    };
  }

  // Generate outline via Claude
  const generatedOutline = await generateOutline(
    conversationHistory,
    outline.topic,
    outline.audience
  );

  // Save sections to database
  const sectionsResult = await saveOutlineSections(
    outlineId,
    generatedOutline.chapters
  );
  if (!sectionsResult.success) {
    return { success: false, error: sectionsResult.error };
  }

  // Re-fetch outline to get latest state
  const updatedOutline = await getOutlineById(outlineId, userResult.data.id);

  return {
    success: true,
    data: {
      outline: updatedOutline!,
      sections: sectionsResult.data,
    },
  };
}
