import type { ConversationMessage } from "@/types/wizard";
import { HUMAN_VOICE_RULES } from "./constants";

export function buildOutlinePrompt(
  conversationHistory: ConversationMessage[],
  topic: string,
  audience: string | null
): string {
  const conversationText = conversationHistory
    .map((msg) => `${msg.role === "user" ? "User" : "Interviewer"}: ${msg.content}`)
    .join("\n\n");

  return `You are a book outline generator for Inkfluence AI.

Based on the following interview conversation, create a structured book outline.

## Topic
${topic}

## Target Audience
${audience ?? "General readers interested in the topic"}

## Interview Transcript
${conversationText}

## Instructions
Analyze the conversation and create a comprehensive book outline that:
1. Captures all key themes and frameworks discussed
2. Organizes them into a logical chapter flow (introduction → core content → conclusion)
3. Includes 5-15 chapters with descriptive titles
4. Lists 3-7 key points per chapter
5. Marks any AI-suggested chapters that fill gaps not explicitly discussed

${HUMAN_VOICE_RULES}

Generate a JSON object with this exact structure:
{
  "title": "Book title based on the topic and angle discussed",
  "summary": "One-paragraph summary of what the book covers",
  "chapters": [
    {
      "chapterTitle": "Chapter title",
      "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
      "orderIndex": 0
    }
  ]
}

Return ONLY the JSON object, no additional text.`;
}

export const outlineGenerationTool = {
  name: "generate_outline" as const,
  description:
    "Generate a structured book outline from the interview conversation",
  input_schema: {
    type: "object" as const,
    properties: {
      title: {
        type: "string" as const,
        description: "Book title based on the topic and angle discussed",
      },
      summary: {
        type: "string" as const,
        description: "One-paragraph summary of what the book covers",
      },
      chapters: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            chapterTitle: {
              type: "string" as const,
              description: "Descriptive chapter title",
            },
            keyPoints: {
              type: "array" as const,
              items: { type: "string" as const },
              description: "Key points covered in this chapter",
            },
            orderIndex: {
              type: "number" as const,
              description: "Zero-based chapter order",
            },
          },
          required: ["chapterTitle", "keyPoints", "orderIndex"],
        },
        description: "Array of chapters in reading order",
      },
    },
    required: ["title", "summary", "chapters"],
  },
};
