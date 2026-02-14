import type {
  ChapterGenerationContext,
  GenerationMetadata,
  SaveStatusPayload,
} from "@/types/chapter-generation";
import { getAnthropicClient } from "./client";
import {
  buildChapterGenerationSystemPrompt,
  buildChapterGenerationUserPrompt,
} from "./prompts/chapter-generation";
import {
  AI_MODEL,
  GENERATION_MAX_TOKENS,
  GENERATION_TEMPERATURE,
} from "./prompts/constants";
import { countWords } from "@/lib/word-count";

/** Retry a function with exponential backoff */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt - 1)));
    }
  }
  throw new Error("Retry exhausted");
}

/** Save callback type for content engines */
export type SaveCallback = (fullContent: string) => Promise<void>;

/** Generate chapter content with streaming SSE output */
export async function generateChapterContentStreaming(
  context: ChapterGenerationContext,
  onSave?: SaveCallback
): Promise<{
  stream: ReadableStream<Uint8Array>;
}> {
  const client = getAnthropicClient();
  const systemPrompt = buildChapterGenerationSystemPrompt(context);
  const userPrompt = buildChapterGenerationUserPrompt(context);

  const anthropicStream = client.messages.stream({
    model: AI_MODEL,
    max_tokens: GENERATION_MAX_TOKENS,
    temperature: GENERATION_TEMPERATURE,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  let fullText = "";
  const encoder = new TextEncoder();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        anthropicStream.on("text", (text) => {
          fullText += text;
          const chunk = JSON.stringify({ type: "text", content: text });
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        });

        anthropicStream.on("end", async () => {
          // Send metadata
          const wordCount = countWords(fullText);
          const metadata: GenerationMetadata = {
            wordCount,
            completedAt: new Date().toISOString(),
          };

          const metaChunk = JSON.stringify({
            type: "metadata",
            content: JSON.stringify(metadata),
          });
          controller.enqueue(encoder.encode(`data: ${metaChunk}\n\n`));

          // Save with retry and send save status
          if (onSave) {
            let savePayload: SaveStatusPayload;
            try {
              await withRetry(() => onSave(fullText));
              savePayload = { success: true };
            } catch (err) {
              console.error("Failed to save generated content after retries:", err);
              savePayload = {
                success: false,
                error: err instanceof Error ? err.message : "Save failed",
              };
            }
            const saveChunk = JSON.stringify({
              type: "save_status",
              content: JSON.stringify(savePayload),
            });
            controller.enqueue(encoder.encode(`data: ${saveChunk}\n\n`));
          }

          const doneChunk = JSON.stringify({ type: "done", content: "" });
          controller.enqueue(encoder.encode(`data: ${doneChunk}\n\n`));
          controller.close();
        });

        anthropicStream.on("error", (err) => {
          const errorChunk = JSON.stringify({
            type: "error",
            content: err instanceof Error ? err.message : "Unknown error",
          });
          controller.enqueue(encoder.encode(`data: ${errorChunk}\n\n`));
          controller.close();
        });
      } catch (err) {
        const errorChunk = JSON.stringify({
          type: "error",
          content: err instanceof Error ? err.message : "Unknown error",
        });
        controller.enqueue(encoder.encode(`data: ${errorChunk}\n\n`));
        controller.close();
      }
    },
  });

  return { stream: readable };
}
