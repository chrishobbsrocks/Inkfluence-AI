import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getOutlineById } from "@/server/queries/outlines";
import { updateConversationHistory } from "@/server/mutations/outlines";
import { sendMessageSchema } from "@/lib/validations/wizard";
import {
  sendMessageStreaming,
  deriveWizardState,
} from "@/lib/ai/chat-engine";
import { stripStructuredTags } from "@/lib/ai/response-parser";
import type { ConversationMessage } from "@/types/wizard";

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = sendMessageSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parseResult.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { outlineId, message } = parseResult.data;

  // Verify outline exists and belongs to user (through book ownership)
  const outline = await getOutlineById(outlineId, user.id);
  if (!outline) {
    return NextResponse.json({ error: "Outline not found" }, { status: 404 });
  }

  const conversationHistory =
    (outline.conversationHistory as ConversationMessage[]) ?? [];

  // Derive current wizard state
  const wizardState = deriveWizardState(
    conversationHistory,
    outline.topic,
    outline.audience,
    outline.expertiseLevel
  );

  // Get streaming response from Claude
  const { stream, responsePromise } = await sendMessageStreaming(
    conversationHistory,
    message,
    wizardState
  );

  // Save conversation history after stream completes (non-blocking)
  responsePromise
    .then(async (fullResponse) => {
      const cleanResponse = stripStructuredTags(fullResponse);
      const updatedHistory: ConversationMessage[] = [
        ...conversationHistory,
        { role: "user", content: message },
        { role: "assistant", content: cleanResponse },
      ];
      await updateConversationHistory(outlineId, updatedHistory);
    })
    .catch((err) => {
      console.error("Failed to save conversation history:", err);
    });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
