import type {
  ConversationMessage,
  WizardState,
  GeneratedOutline,
  StreamMetadata,
} from "@/types/wizard";
import { getAnthropicClient } from "./client";
import { buildSystemPrompt } from "./prompts/system-prompt";
import {
  buildOutlinePrompt,
  outlineGenerationTool,
} from "./prompts/outline-generation";
import {
  parseGapSuggestions,
  parsePhaseSignal,
  stripStructuredTags,
} from "./response-parser";
import {
  AI_MODEL,
  STREAM_MAX_TOKENS,
  MAX_TOKENS,
  CHAT_TEMPERATURE,
  OUTLINE_TEMPERATURE,
  TARGET_QUESTION_COUNT,
} from "./prompts/constants";
import { generatedOutlineSchema } from "@/lib/validations/wizard";

// Re-export pure functions from wizard-state (client-safe module)
export { determinePhase, deriveWizardState } from "./wizard-state";

/** Send a message to Claude and return a streaming SSE response */
export async function sendMessageStreaming(
  conversationHistory: ConversationMessage[],
  userMessage: string,
  wizardState: WizardState
): Promise<{ stream: ReadableStream<Uint8Array>; responsePromise: Promise<string> }> {
  // Import deriveWizardState locally to avoid circular dependency issues
  const { deriveWizardState } = await import("./wizard-state");

  const client = getAnthropicClient();
  const systemPrompt = buildSystemPrompt(wizardState);

  const messages = [
    ...conversationHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const anthropicStream = client.messages.stream({
    model: AI_MODEL,
    max_tokens: STREAM_MAX_TOKENS,
    temperature: CHAT_TEMPERATURE,
    system: systemPrompt,
    messages,
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
          // Parse structured data from full response
          const gaps = parseGapSuggestions(fullText);
          const phaseSignal = parsePhaseSignal(fullText);

          const newState = deriveWizardState(
            [
              ...conversationHistory,
              { role: "user", content: userMessage },
              { role: "assistant", content: fullText },
            ],
            wizardState.topic,
            wizardState.audience,
            wizardState.expertiseLevel
          );

          const metadata: StreamMetadata = {
            wizardState: newState,
            gaps,
            phaseTransition:
              phaseSignal === "ready_for_outline"
                ? "outline_generation"
                : null,
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

/** Generate a structured outline from conversation history */
export async function generateOutline(
  conversationHistory: ConversationMessage[],
  topic: string,
  audience: string | null
): Promise<GeneratedOutline> {
  const client = getAnthropicClient();
  const prompt = buildOutlinePrompt(conversationHistory, topic, audience);

  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: MAX_TOKENS,
    temperature: OUTLINE_TEMPERATURE,
    messages: [{ role: "user", content: prompt }],
    tools: [outlineGenerationTool],
    tool_choice: { type: "tool", name: "generate_outline" },
  });

  // Extract tool use result
  const toolBlock = response.content.find((block) => block.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use block for outline generation");
  }

  const parsed = generatedOutlineSchema.safeParse(toolBlock.input);
  if (!parsed.success) {
    throw new Error(
      `Invalid outline structure from Claude: ${parsed.error.issues[0]?.message}`
    );
  }

  return parsed.data;
}

/** Send a single non-streaming message (used for starting the wizard) */
export async function sendInitialMessage(
  topic: string,
  audience: string | null,
  expertiseLevel: string | null
): Promise<string> {
  const client = getAnthropicClient();

  const wizardState: WizardState = {
    phase: "topic_exploration",
    questionCount: 0,
    totalQuestions: TARGET_QUESTION_COUNT,
    topic,
    audience,
    expertiseLevel,
    detectedGaps: [],
    isReadyForOutline: false,
  };

  const systemPrompt = buildSystemPrompt(wizardState);

  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: STREAM_MAX_TOKENS,
    temperature: CHAT_TEMPERATURE,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `I want to write a book about: ${topic}${audience ? `. My target audience is: ${audience}` : ""}${expertiseLevel ? `. My expertise level: ${expertiseLevel}` : ""}`,
      },
    ],
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "";
  return stripStructuredTags(text);
}
