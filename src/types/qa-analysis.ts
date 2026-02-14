/** Scoring dimensions for QA analysis */
export type QADimension = "readability" | "consistency" | "structure" | "accuracy";

/** Severity levels for QA suggestions */
export type QASeverity = "critical" | "major" | "minor";

/** Quality level derived from overall score */
export type QualityLevel =
  | "exceptional"
  | "professional"
  | "good"
  | "needs-improvement"
  | "needs-significant-work";

/** Per-chapter QA scoring result */
export interface QAChapterScore {
  chapterId: string;
  chapterTitle: string;
  orderIndex: number;
  overallScore: number;
  readability: number;
  consistency: number;
  structure: number;
  accuracy: number;
  suggestionCount: number;
  wordCount: number;
}

/** A single QA suggestion */
export interface QASuggestion {
  id: string;
  chapterId: string;
  chapterTitle: string;
  dimension: QADimension;
  severity: QASeverity;
  issueText: string;
  explanation: string;
  location: string | null;
  autoFixable: boolean;
  suggestedFix: string | null;
}

/** Complete QA analysis result */
export interface QAAnalysisResult {
  overallScore: number;
  qualityLevel: QualityLevel;
  readability: number;
  consistency: number;
  structure: number;
  accuracy: number;
  summary: string;
  chapterScores: QAChapterScore[];
  suggestions: QASuggestion[];
  analyzedAt: string;
}

/** Request body for POST /api/qa/analyze */
export interface QAAnalyzeRequest {
  bookId: string;
}
