import type {
  QAAnalysisResult,
  QAChapterScore,
  QASuggestion,
  QualityLevel,
} from "@/types/qa-analysis";
import type { ValidatedQAChapterResponse } from "@/lib/validations/qa-analysis";
import { getAnthropicClient } from "./client";
import {
  buildChapterQAPrompt,
  buildConsistencyCheckPrompt,
  qaChapterAnalysisTool,
  qaConsistencyTool,
} from "./prompts/qa-analysis";
import {
  qaChapterResponseSchema,
  qaConsistencyResponseSchema,
} from "@/lib/validations/qa-analysis";
import {
  AI_MODEL,
  QA_MAX_TOKENS,
  QA_TEMPERATURE,
  QA_CONSISTENCY_MAX_TOKENS,
} from "./prompts/constants";
import { getBookById } from "@/server/queries/books";
import { getChaptersByBookId } from "@/server/queries/chapters";
import { getOutlineByBookId } from "@/server/queries/outlines";

/** Derive quality level label from overall score */
export function deriveQualityLevel(score: number): QualityLevel {
  if (score >= 90) return "exceptional";
  if (score >= 80) return "professional";
  if (score >= 70) return "good";
  if (score >= 60) return "needs-improvement";
  return "needs-significant-work";
}

/** Aggregate per-chapter scores using word-count-weighted average */
export function aggregateScores(
  chapters: Array<{
    wordCount: number;
    readability: number;
    consistency: number;
    structure: number;
    accuracy: number;
  }>
): {
  readability: number;
  consistency: number;
  structure: number;
  accuracy: number;
} {
  const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
  if (totalWords === 0) {
    return { readability: 0, consistency: 0, structure: 0, accuracy: 0 };
  }

  return {
    readability: Math.round(
      chapters.reduce((sum, ch) => sum + ch.readability * ch.wordCount, 0) /
        totalWords
    ),
    consistency: Math.round(
      chapters.reduce((sum, ch) => sum + ch.consistency * ch.wordCount, 0) /
        totalWords
    ),
    structure: Math.round(
      chapters.reduce((sum, ch) => sum + ch.structure * ch.wordCount, 0) /
        totalWords
    ),
    accuracy: Math.round(
      chapters.reduce((sum, ch) => sum + ch.accuracy * ch.wordCount, 0) /
        totalWords
    ),
  };
}

/** Analyze a single chapter's quality via Claude tool_use */
export async function analyzeChapterQuality(
  chapter: {
    id: string;
    title: string;
    content: string;
    orderIndex: number;
    wordCount: number;
  },
  bookTopic: string,
  audience: string | null
): Promise<{ chapterId: string; response: ValidatedQAChapterResponse }> {
  const client = getAnthropicClient();
  const prompt = buildChapterQAPrompt(chapter, bookTopic, audience);

  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: QA_MAX_TOKENS,
    temperature: QA_TEMPERATURE,
    messages: [{ role: "user", content: prompt }],
    tools: [qaChapterAnalysisTool],
    tool_choice: { type: "tool", name: "analyze_chapter_quality" },
  });

  const toolBlock = response.content.find((block) => block.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error(
      "Claude did not return a tool_use block for QA chapter analysis"
    );
  }

  const parsed = qaChapterResponseSchema.safeParse(toolBlock.input);
  if (!parsed.success) {
    throw new Error(
      `Invalid QA analysis from Claude: ${parsed.error.issues[0]?.message}`
    );
  }

  return { chapterId: chapter.id, response: parsed.data };
}

/** Run cross-chapter consistency check */
async function checkCrossChapterConsistency(
  chapterSummaries: Array<{
    title: string;
    orderIndex: number;
    readabilitySummary: string;
    consistencySummary: string;
    keyTerms: string;
  }>
) {
  const client = getAnthropicClient();
  const prompt = buildConsistencyCheckPrompt(chapterSummaries);

  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: QA_CONSISTENCY_MAX_TOKENS,
    temperature: QA_TEMPERATURE,
    messages: [{ role: "user", content: prompt }],
    tools: [qaConsistencyTool],
    tool_choice: { type: "tool", name: "check_consistency" },
  });

  const toolBlock = response.content.find((block) => block.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error(
      "Claude did not return a tool_use block for consistency check"
    );
  }

  const parsed = qaConsistencyResponseSchema.safeParse(toolBlock.input);
  if (!parsed.success) {
    throw new Error(
      `Invalid consistency response from Claude: ${parsed.error.issues[0]?.message}`
    );
  }

  return parsed.data;
}

/** Orchestrate full book QA analysis */
export async function analyzeBookQuality(
  bookId: string,
  userId: string
): Promise<QAAnalysisResult> {
  const book = await getBookById(bookId, userId);
  if (!book) {
    throw new Error("Book not found");
  }

  const chapters = await getChaptersByBookId(bookId, userId);
  const chaptersWithContent = chapters.filter(
    (ch) => ch.content && ch.content.trim().length > 0
  );

  if (chaptersWithContent.length === 0) {
    throw new Error(
      "No chapters with content to analyze. Write at least one chapter before running quality analysis."
    );
  }

  // Get book context from outline
  const outline = await getOutlineByBookId(bookId, userId);
  const bookTopic = outline?.topic ?? book.title;
  const audience = outline?.audience ?? null;

  // Analyze each chapter in parallel
  const chapterResults = await Promise.all(
    chaptersWithContent.map((ch) =>
      analyzeChapterQuality(
        {
          id: ch.id,
          title: ch.title,
          content: ch.content!,
          orderIndex: ch.orderIndex,
          wordCount: ch.wordCount,
        },
        bookTopic,
        audience
      )
    )
  );

  // Build chapter scores and collect suggestions
  const allSuggestions: QASuggestion[] = [];
  const chapterScores: QAChapterScore[] = chapterResults.map(
    ({ chapterId, response }, idx) => {
      const chapter = chaptersWithContent[idx]!;
      const chapterOverall = Math.round(
        (response.readability +
          response.structure +
          response.accuracy +
          response.consistency) /
          4
      );

      // Map suggestions with stable IDs
      const chapterSuggestions: QASuggestion[] = response.suggestions.map(
        (s, i) => ({
          id: `qa-${chapterId.slice(0, 8)}-${i}-${Date.now()}`,
          chapterId,
          chapterTitle: chapter.title,
          dimension: s.dimension,
          severity: s.severity,
          issueText: s.issueText,
          explanation: s.explanation,
          location: s.location,
          autoFixable: s.autoFixable,
          suggestedFix: s.suggestedFix ?? null,
        })
      );
      allSuggestions.push(...chapterSuggestions);

      return {
        chapterId,
        chapterTitle: chapter.title,
        orderIndex: chapter.orderIndex,
        overallScore: chapterOverall,
        readability: response.readability,
        consistency: response.consistency,
        structure: response.structure,
        accuracy: response.accuracy,
        suggestionCount: chapterSuggestions.length,
        wordCount: chapter.wordCount,
      };
    }
  );

  // Aggregate book-level scores
  const aggregated = aggregateScores(
    chapterScores.map((cs) => ({
      wordCount: cs.wordCount,
      readability: cs.readability,
      consistency: cs.consistency,
      structure: cs.structure,
      accuracy: cs.accuracy,
    }))
  );

  // Cross-chapter consistency check (only if 2+ chapters)
  let consistencyAdjustment = 0;
  if (chaptersWithContent.length >= 2) {
    const summaries = chapterResults.map(({ response }, idx) => {
      const ch = chaptersWithContent[idx]!;
      return {
        title: ch.title,
        orderIndex: ch.orderIndex,
        readabilitySummary: response.dimensionSummaries.readability,
        consistencySummary: response.dimensionSummaries.consistency,
        keyTerms: ch.content!.slice(0, 300),
      };
    });

    const consistencyResult =
      await checkCrossChapterConsistency(summaries);
    consistencyAdjustment = consistencyResult.consistencyAdjustment;

    // Add cross-chapter suggestions
    const crossSuggestions: QASuggestion[] =
      consistencyResult.suggestions.map((s, i) => ({
        id: `qa-cross-${i}-${Date.now()}`,
        chapterId: "",
        chapterTitle: "Cross-chapter",
        dimension: "consistency" as const,
        severity: s.severity,
        issueText: s.issueText,
        explanation: s.explanation,
        location: null,
        autoFixable: s.autoFixable,
        suggestedFix: s.suggestedFix ?? null,
      }));
    allSuggestions.push(...crossSuggestions);
  }

  // Apply consistency adjustment
  const finalConsistency = Math.max(
    0,
    aggregated.consistency + consistencyAdjustment
  );

  const overallScore = Math.round(
    (aggregated.readability +
      finalConsistency +
      aggregated.structure +
      aggregated.accuracy) /
      4
  );

  // Build summary
  const qualityLevel = deriveQualityLevel(overallScore);
  const summary = `Book scored ${overallScore}/100 (${qualityLevel.replace(/-/g, " ")}). Analyzed ${chaptersWithContent.length} chapter${chaptersWithContent.length > 1 ? "s" : ""} with ${allSuggestions.length} suggestion${allSuggestions.length !== 1 ? "s" : ""} for improvement.`;

  return {
    overallScore,
    qualityLevel,
    readability: aggregated.readability,
    consistency: finalConsistency,
    structure: aggregated.structure,
    accuracy: aggregated.accuracy,
    summary,
    chapterScores,
    suggestions: allSuggestions,
    analyzedAt: new Date().toISOString(),
  };
}
