import { z } from "zod";

/** Validates POST /api/qa/analyze request body */
export const qaAnalyzeRequestSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
});

/** Validates per-chapter Claude tool_use response */
export const qaChapterResponseSchema = z.object({
  readability: z.number().min(0).max(100),
  structure: z.number().min(0).max(100),
  accuracy: z.number().min(0).max(100),
  consistency: z.number().min(0).max(100),
  dimensionSummaries: z.object({
    readability: z.string(),
    structure: z.string(),
    accuracy: z.string(),
    consistency: z.string(),
  }),
  suggestions: z
    .array(
      z.object({
        dimension: z.enum(["readability", "consistency", "structure", "accuracy"]),
        severity: z.enum(["critical", "major", "minor"]),
        issueText: z.string().min(1),
        explanation: z.string().min(1),
        location: z.string().nullable(),
        autoFixable: z.boolean(),
        suggestedFix: z.string().nullable().optional(),
      })
    )
    .max(10),
});

export type ValidatedQAChapterResponse = z.infer<typeof qaChapterResponseSchema>;

/** Validates the cross-chapter consistency response */
export const qaConsistencyResponseSchema = z.object({
  consistencyAdjustment: z.number().min(-20).max(0),
  suggestions: z
    .array(
      z.object({
        severity: z.enum(["critical", "major", "minor"]),
        issueText: z.string().min(1),
        explanation: z.string().min(1),
        autoFixable: z.boolean(),
        suggestedFix: z.string().nullable().optional(),
      })
    )
    .max(10),
});

export type ValidatedQAConsistencyResponse = z.infer<
  typeof qaConsistencyResponseSchema
>;
