import { db } from "@/server/db";
import { qaAnalyses } from "@/server/db/schema/qa-analyses";
import type { NewQAAnalysisRow } from "@/server/db/schema/qa-analyses";
import type { QAAnalysisResult } from "@/types/qa-analysis";

/** Save a QA analysis result to the database */
export async function saveQAAnalysis(
  bookId: string,
  result: QAAnalysisResult
) {
  const values: NewQAAnalysisRow = {
    bookId,
    overallScore: result.overallScore,
    readability: result.readability,
    consistency: result.consistency,
    structure: result.structure,
    accuracy: result.accuracy,
    qualityLevel: result.qualityLevel,
    summary: result.summary,
    chapterScores: result.chapterScores,
    suggestions: result.suggestions,
    chapterCount: result.chapterScores.length,
    wordCount: result.chapterScores.reduce(
      (sum, ch) => sum + ch.wordCount,
      0
    ),
  };

  const inserted = await db.insert(qaAnalyses).values(values).returning();
  return inserted[0]!;
}
