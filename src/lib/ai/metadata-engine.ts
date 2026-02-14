import type { BookMetadataGenerationResult } from "@/types/book-metadata";
import { getAnthropicClient } from "./client";
import {
  buildMetadataGenerationPrompt,
  metadataGenerationTool,
} from "./prompts/metadata-generation";
import { metadataGenerationResponseSchema } from "@/lib/validations/book-metadata";
import {
  AI_MODEL,
  METADATA_MAX_TOKENS,
  METADATA_TEMPERATURE,
} from "./prompts/constants";
import { getBookById } from "@/server/queries/books";
import { getChaptersByBookId } from "@/server/queries/chapters";
import { getOutlineByBookId } from "@/server/queries/outlines";

/** Generate book metadata using Claude */
export async function generateBookMetadata(
  bookId: string,
  userId: string
): Promise<BookMetadataGenerationResult> {
  const book = await getBookById(bookId, userId);
  if (!book) {
    throw new Error("Book not found");
  }

  const chapters = await getChaptersByBookId(bookId, userId);
  const outline = await getOutlineByBookId(bookId, userId);

  const bookTopic = outline?.topic ?? book.title;
  const audience = outline?.audience ?? null;
  const chapterTitles = chapters.map((ch) => ch.title);
  const totalWordCount = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);

  const client = getAnthropicClient();
  const prompt = buildMetadataGenerationPrompt(
    book.title,
    bookTopic,
    audience,
    chapterTitles,
    totalWordCount
  );

  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: METADATA_MAX_TOKENS,
    temperature: METADATA_TEMPERATURE,
    messages: [{ role: "user", content: prompt }],
    tools: [metadataGenerationTool],
    tool_choice: { type: "tool", name: "generate_book_metadata" },
  });

  const toolBlock = response.content.find((block) => block.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error(
      "Claude did not return a tool_use block for metadata generation"
    );
  }

  const parsed = metadataGenerationResponseSchema.safeParse(toolBlock.input);
  if (!parsed.success) {
    throw new Error(
      `Invalid metadata from Claude: ${parsed.error.issues[0]?.message}`
    );
  }

  return parsed.data;
}
