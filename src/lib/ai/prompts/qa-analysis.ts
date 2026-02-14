import { HUMAN_VOICE_RULES } from "./constants";

interface QAChapterInput {
  title: string;
  content: string;
  orderIndex: number;
  wordCount: number;
}

/** Build the per-chapter QA analysis prompt */
export function buildChapterQAPrompt(
  chapter: QAChapterInput,
  bookTopic: string,
  audience: string | null
): string {
  return `You are an expert book editor and quality assurance analyst for Inkfluence AI.

Analyze the following chapter for quality across four dimensions.

## Book Context
- Topic: ${bookTopic}
- Target Audience: ${audience ?? "General readers interested in the topic"}

## Chapter
- Title: ${chapter.title}
- Word Count: ${chapter.wordCount}
- Position: Chapter ${chapter.orderIndex + 1}

## Chapter Content
${chapter.content}

## Instructions
Score this chapter on four dimensions (0-100 each):

1. **Readability** — Sentence clarity, paragraph structure, vocabulary appropriateness for the target audience, passive voice usage, jargon density.
2. **Structure** — Logical flow, section organization, transitions between ideas, argument progression, quality of opening and closing.
3. **Accuracy** — Factual correctness, logical coherence, unsupported claims, internal contradictions, proper attribution of concepts.
4. **Consistency** — Internal consistency within this chapter: consistent terminology, tone, formatting, and style.

For each issue found, provide a suggestion with:
- The dimension it relates to
- Severity: "critical" (fundamentally broken), "major" (significantly impacts quality), or "minor" (polish improvement)
- A short issue description (1 sentence)
- A detailed explanation with specific context from the text
- Approximate location in the chapter (e.g., "opening paragraph", "section 2", "conclusion")
- Whether it could be auto-fixed by an AI rewriting tool
- A brief suggested fix if auto-fixable

Provide a 1-2 sentence summary for each dimension explaining the score.
Limit to the 10 most impactful suggestions.

## AI Detection Check
Additionally, flag any passages that sound obviously AI-generated. Specifically check for:
${HUMAN_VOICE_RULES}
If the chapter violates these voice rules, include suggestions under the "readability" dimension with severity "major".`;
}

/** Build the cross-chapter consistency check prompt */
export function buildConsistencyCheckPrompt(
  chapterSummaries: Array<{
    title: string;
    orderIndex: number;
    readabilitySummary: string;
    consistencySummary: string;
    keyTerms: string;
  }>
): string {
  const summaryList = chapterSummaries
    .map(
      (ch) =>
        `Chapter ${ch.orderIndex + 1}: ${ch.title}\n  Readability: ${ch.readabilitySummary}\n  Consistency: ${ch.consistencySummary}\n  Key terms: ${ch.keyTerms}`
    )
    .join("\n\n");

  return `You are a book editor checking cross-chapter consistency.

## Chapters Summary
${summaryList}

## Instructions
Check for:
- Terminology inconsistencies (same concept called different names across chapters)
- Tone drift between chapters
- Contradictory statements across chapters
- Formatting inconsistencies

Provide a consistency adjustment score (0 to -20) where 0 means no cross-chapter issues and -20 means severe inconsistencies.
Limit to the 10 most impactful cross-chapter suggestions.`;
}

/** Claude tool_use schema for per-chapter QA analysis */
export const qaChapterAnalysisTool = {
  name: "analyze_chapter_quality" as const,
  description:
    "Analyze a book chapter for quality across readability, structure, accuracy, and consistency dimensions",
  input_schema: {
    type: "object" as const,
    properties: {
      readability: {
        type: "number" as const,
        description: "Readability score 0-100",
      },
      structure: {
        type: "number" as const,
        description: "Structure score 0-100",
      },
      accuracy: {
        type: "number" as const,
        description: "Accuracy score 0-100",
      },
      consistency: {
        type: "number" as const,
        description: "Internal consistency score 0-100",
      },
      dimensionSummaries: {
        type: "object" as const,
        properties: {
          readability: { type: "string" as const, description: "1-2 sentence readability summary" },
          structure: { type: "string" as const, description: "1-2 sentence structure summary" },
          accuracy: { type: "string" as const, description: "1-2 sentence accuracy summary" },
          consistency: { type: "string" as const, description: "1-2 sentence consistency summary" },
        },
        required: ["readability", "structure", "accuracy", "consistency"],
      },
      suggestions: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            dimension: {
              type: "string" as const,
              enum: ["readability", "consistency", "structure", "accuracy"],
              description: "Which dimension this issue relates to",
            },
            severity: {
              type: "string" as const,
              enum: ["critical", "major", "minor"],
              description: "Issue severity level",
            },
            issueText: {
              type: "string" as const,
              description: "Short issue description (1 sentence)",
            },
            explanation: {
              type: "string" as const,
              description: "Detailed explanation with context from the text",
            },
            location: {
              type: "string" as const,
              description: "Approximate location in the chapter",
            },
            autoFixable: {
              type: "boolean" as const,
              description: "Whether AI can auto-fix this issue",
            },
            suggestedFix: {
              type: "string" as const,
              description: "Brief description of the fix, if auto-fixable",
            },
          },
          required: [
            "dimension",
            "severity",
            "issueText",
            "explanation",
            "location",
            "autoFixable",
          ],
        },
      },
    },
    required: [
      "readability",
      "structure",
      "accuracy",
      "consistency",
      "dimensionSummaries",
      "suggestions",
    ],
  },
};

/** Claude tool_use schema for cross-chapter consistency check */
export const qaConsistencyTool = {
  name: "check_consistency" as const,
  description:
    "Check cross-chapter consistency and provide a consistency adjustment score",
  input_schema: {
    type: "object" as const,
    properties: {
      consistencyAdjustment: {
        type: "number" as const,
        description:
          "Adjustment to consistency score (0 to -20). 0 = no issues, -20 = severe inconsistencies",
      },
      suggestions: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            severity: {
              type: "string" as const,
              enum: ["critical", "major", "minor"],
            },
            issueText: {
              type: "string" as const,
              description: "Short description of the consistency issue",
            },
            explanation: {
              type: "string" as const,
              description: "Detailed explanation with chapter references",
            },
            autoFixable: {
              type: "boolean" as const,
              description: "Whether AI can auto-fix this issue",
            },
            suggestedFix: {
              type: "string" as const,
              description: "Brief description of the fix, if auto-fixable",
            },
          },
          required: ["severity", "issueText", "explanation", "autoFixable"],
        },
      },
    },
    required: ["consistencyAdjustment", "suggestions"],
  },
};
