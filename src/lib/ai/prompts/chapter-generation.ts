import type { ChapterGenerationContext } from "@/types/chapter-generation";

const TONE_INSTRUCTIONS: Record<string, string> = {
  professional:
    "Write in a clear, authoritative, professional tone. Use precise language and well-structured arguments. Avoid casual expressions.",
  conversational:
    "Write in a warm, engaging, conversational tone. Use direct address ('you'), relatable analogies, and a friendly voice while maintaining credibility.",
  academic:
    "Write in a formal, scholarly, academic tone. Use precise terminology, cite concepts accurately, and maintain intellectual rigor throughout.",
};

const EXPERTISE_INSTRUCTIONS: Record<string, string> = {
  beginner:
    "Explain concepts from first principles. Avoid jargon or define it immediately. Use simple analogies and step-by-step explanations. Target reading level: accessible to newcomers.",
  intermediate:
    "Assume familiarity with basics. Introduce intermediate concepts with brief context. Balance depth with clarity. Target reading level: competent practitioner.",
  expert:
    "Assume deep domain knowledge. Include nuanced analysis, edge cases, advanced frameworks, and insider perspectives. Target reading level: domain expert.",
};

export function buildChapterGenerationSystemPrompt(
  context: ChapterGenerationContext
): string {
  const parts: string[] = [
    `You are an expert book author writing for Inkfluence AI.

## Your Role
Write a complete book chapter based on the provided outline points. The chapter should be well-structured, engaging, and comprehensive.

## Book Context
- **Topic**: ${context.bookTopic}
- **Target Audience**: ${context.audience ?? "General readers interested in the topic"}

## Writing Style
${TONE_INSTRUCTIONS[context.tone] ?? TONE_INSTRUCTIONS.professional}

## Depth and Complexity
${EXPERTISE_INSTRUCTIONS[context.expertise] ?? EXPERTISE_INSTRUCTIONS.intermediate}

## Output Format
Write the chapter content as **clean HTML** suitable for a rich text editor. Use these HTML elements:
- <h2> for section headings (NOT <h1>, which is reserved for the chapter title)
- <p> for paragraphs
- <strong> and <em> for emphasis
- <blockquote> for notable quotes or callouts
- <ul>/<li> for bullet lists when appropriate
- <ol>/<li> for numbered sequences

## Rules
1. Write 2000-3000 words total.
2. Start with a compelling opening paragraph that hooks the reader.
3. Cover ALL provided key points, expanding each into 200-400 words.
4. Use concrete examples, analogies, and actionable advice.
5. End with a summary or transition paragraph to the next chapter.
6. Do NOT include a chapter title heading — that is handled separately by the editor.
7. Do NOT include meta-commentary about the writing process.
8. Maintain voice consistency with previous chapters if context is provided.`,
  ];

  if (context.previousChapterSummaries.length > 0) {
    const summaries = context.previousChapterSummaries
      .map((ch, i) => `${i + 1}. **${ch.title}**: ${ch.summary}`)
      .join("\n");
    parts.push(`\n## Previous Chapters (for continuity)\n${summaries}`);
  }

  if (context.conversationContext) {
    parts.push(
      `\n## Author's Voice and Expertise (from interview)\n${context.conversationContext}`
    );
  }

  return parts.join("\n");
}

export function buildChapterGenerationUserPrompt(
  context: ChapterGenerationContext
): string {
  const keyPointsList = context.keyPoints
    .map((kp, i) => `${i + 1}. ${kp}`)
    .join("\n");

  return `Write the complete chapter: "${context.chapterTitle}"

## Key Points to Cover
${keyPointsList || "No specific key points provided. Write a comprehensive chapter based on the chapter title and book context."}

Write the full chapter content now. Remember: 2000-3000 words, clean HTML format, cover all key points.`;
}
