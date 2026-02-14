import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getChapterById, getPreviousChapterSummaries } from "@/server/queries/chapters";
import { getOutlineByBookId, getOutlineWithSections } from "@/server/queries/outlines";
import { chapterGenerationRequestSchema } from "@/lib/validations/chapter-generation";
import { generateChapterContentStreaming } from "@/lib/ai/content-engine";
import { updateChapterContent } from "@/server/mutations/chapters";
import { countWords } from "@/lib/word-count";
import type { ChapterGenerationContext } from "@/types/chapter-generation";
import type { ConversationMessage } from "@/types/wizard";

/** Extract first ~200 chars of content as a summary, stripping HTML */
function extractSummary(content: string | null): string {
  if (!content) return "No content yet.";
  const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= 200) return text;
  return text.slice(0, 200) + "...";
}

/** Extract last few conversation exchanges as context (max ~500 chars) */
function extractConversationContext(
  history: ConversationMessage[] | null
): string | null {
  if (!history || history.length === 0) return null;
  const lastExchanges = history.slice(-6);
  const text = lastExchanges
    .map((m) => `${m.role === "user" ? "Author" : "Interviewer"}: ${m.content}`)
    .join("\n\n");
  if (text.length <= 500) return text;
  return text.slice(-500);
}

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

  const parseResult = chapterGenerationRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const { chapterId, bookId, tone, expertise } = parseResult.data;

  // Verify chapter ownership
  const chapter = await getChapterById(chapterId, user.id);
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  if (chapter.bookId !== bookId) {
    return NextResponse.json(
      { error: "Chapter does not belong to this book" },
      { status: 400 }
    );
  }

  // Get outline data for context
  const outline = await getOutlineByBookId(bookId, user.id);
  let keyPoints: string[] = [];
  let bookTopic = chapter.title;
  let audience: string | null = null;
  let conversationContext: string | null = null;

  if (outline) {
    bookTopic = outline.topic;
    audience = outline.audience;
    conversationContext = extractConversationContext(
      outline.conversationHistory as ConversationMessage[] | null
    );

    const outlineData = await getOutlineWithSections(outline.id, user.id);
    if (outlineData) {
      const matchingSection = outlineData.sections.find(
        (s) => s.orderIndex === chapter.orderIndex
      );
      if (matchingSection) {
        keyPoints = (matchingSection.keyPoints as string[]) ?? [];
      }
    }
  }

  // Get previous chapter summaries for continuity
  const prevChapters = await getPreviousChapterSummaries(
    bookId,
    chapter.orderIndex,
    user.id
  );
  const previousChapterSummaries = prevChapters.map((ch) => ({
    title: ch.title,
    summary: extractSummary(ch.content),
  }));

  const context: ChapterGenerationContext = {
    chapterTitle: chapter.title,
    keyPoints,
    bookTopic,
    audience,
    expertise,
    tone,
    previousChapterSummaries,
    conversationContext,
  };

  try {
    const { stream, responsePromise } =
      await generateChapterContentStreaming(context);

    // Save generated content after stream completes (non-blocking)
    responsePromise
      .then(async (fullContent) => {
        await updateChapterContent(chapterId, {
          title: chapter.title,
          content: fullContent,
          wordCount: countWords(fullContent),
        });
      })
      .catch((err) => {
        console.error("Failed to save generated chapter content:", err);
      });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chapter generation failed:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Generation failed unexpectedly",
      },
      { status: 500 }
    );
  }
}
