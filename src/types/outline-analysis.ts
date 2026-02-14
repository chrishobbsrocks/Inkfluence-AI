/** A suggested chapter from the AI analysis */
export interface OutlineSuggestion {
  id: string;
  chapterTitle: string;
  keyPoints: string[];
  rationale: string;
  insertAfterIndex: number;
  priority: "high" | "medium" | "low";
}

/** A topic coverage item from the AI analysis */
export interface CoverageItem {
  area: string;
  status: "well-covered" | "partial" | "gap";
}

/** The complete analysis result from Claude */
export interface OutlineAnalysis {
  suggestions: OutlineSuggestion[];
  coverage: CoverageItem[];
  overallScore: number;
  summary: string;
}

/** Status of the analysis request */
export type AnalysisStatus = "idle" | "loading" | "error" | "success";

/** Request body for the analyze endpoint */
export interface AnalyzeOutlineRequest {
  outlineId: string;
}
