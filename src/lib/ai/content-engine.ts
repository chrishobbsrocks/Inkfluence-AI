import type {
  ChapterGenerationContext,
  GenerationMetadata,
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

/** Generate chapter content with streaming SSE output */
export async function generateChapterContentStreaming(
  context: ChapterGenerationContext
): Promise<{
  stream: ReadableStream<Uint8Array>;
  responsePromise: Promise<string>;
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

  const responsePromise = new Promise<string>((resolve, reject) => {
    anthropicStream.finalMessage().then(
      (msg) => {
        const text =
          msg.content[0]?.type === "text" ? msg.content[0].text : "";
        resolve(text);
      },
      (err) => reject(err)
    );
  });

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        anthropicStream.on("text", (text) => {
          fullText += text;
          const chunk = JSON.stringify({ type: "text", content: text });
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        });

        anthropicStream.on("end", () => {
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

  return { stream: readable, responsePromise };
}
