import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getChapterById } from "@/server/queries/chapters";
import { updateChapterContent } from "@/server/mutations/chapters";
import { qaFixRequestSchema } from "@/lib/validations/qa-fix";
import { countWords } from "@/lib/word-count";

/** Replace text in HTML content, matching across tag boundaries */
function replaceTextInHtml(
  html: string,
  searchText: string,
  replacement: string
): string | null {
  // Try direct replacement first (text within a single text node)
  if (html.includes(searchText)) {
    return html.replace(searchText, replacement);
  }

  // Try matching with HTML tags stripped for position finding
  const stripped = html.replace(/<[^>]*>/g, "");
  if (!stripped.includes(searchText)) {
    return null; // Text not found even after stripping tags
  }

  // Build a regex that allows HTML tags between characters of searchText
  const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const flexiblePattern = escaped.split("").join("(?:<[^>]*>)*");
  const regex = new RegExp(flexiblePattern);
  const match = html.match(regex);

  if (!match) {
    return null;
  }

  return html.replace(match[0], replacement);
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

  const parseResult = qaFixRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const { bookId, chapterId, suggestionId, originalText, suggestedFix } =
    parseResult.data;

  // Verify book ownership
  const book = await getBookById(bookId, user.id);
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  // Fetch chapter
  const chapter = await getChapterById(chapterId, user.id);
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  if (!chapter.content) {
    return NextResponse.json(
      { error: "Chapter has no content to fix" },
      { status: 400 }
    );
  }

  // Apply fix
  const updatedContent = replaceTextInHtml(
    chapter.content,
    originalText,
    suggestedFix
  );

  if (updatedContent === null) {
    return NextResponse.json(
      {
        error:
          "Could not find the original text in chapter content. The content may have changed since the analysis was run.",
      },
      { status: 409 }
    );
  }

  const updatedWordCount = countWords(updatedContent);

  const result = await updateChapterContent(chapterId, {
    title: chapter.title,
    content: updatedContent,
    wordCount: updatedWordCount,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    chapterId,
    suggestionId,
    updatedWordCount,
  });
}
