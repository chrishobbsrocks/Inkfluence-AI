import { z } from "zod";

/** Validates POST /api/qa/fix request body */
export const qaFixRequestSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  chapterId: z.string().uuid("Invalid chapter ID"),
  suggestionId: z.string().min(1, "Suggestion ID is required"),
  originalText: z.string().min(1, "Original text is required"),
  suggestedFix: z.string().min(1, "Suggested fix is required"),
});
