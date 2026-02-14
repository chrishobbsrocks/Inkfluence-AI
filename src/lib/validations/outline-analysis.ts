import { z } from "zod";

/** Validates the request body for POST /api/outline/analyze */
export const analyzeOutlineRequestSchema = z.object({
  outlineId: z.string().uuid("Invalid outline ID"),
});

export type AnalyzeOutlineRequestInput = z.infer<
  typeof analyzeOutlineRequestSchema
>;

/** Validates the structured output from Claude's tool_use response */
export const outlineAnalysisSchema = z.object({
  suggestions: z
    .array(
      z.object({
        chapterTitle: z.string().min(1),
        keyPoints: z.array(z.string()),
        rationale: z.string(),
        insertAfterIndex: z.number().int().min(-1),
        priority: z.enum(["high", "medium", "low"]),
      })
    )
    .max(10),
  coverage: z
    .array(
      z.object({
        area: z.string().min(1),
        status: z.enum(["well-covered", "partial", "gap"]),
      })
    )
    .max(15),
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
});

export type ValidatedOutlineAnalysis = z.infer<typeof outlineAnalysisSchema>;
