import { z } from "zod";

/** Schema for starting a new wizard conversation */
export const startWizardSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  topic: z.string().min(1, "Topic is required").max(500, "Topic too long"),
  audience: z.string().max(500, "Audience description too long").optional(),
  expertiseLevel: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .optional(),
});

export type StartWizardInput = z.infer<typeof startWizardSchema>;

/** Schema for sending a chat message */
export const sendMessageSchema = z.object({
  outlineId: z.string().uuid("Invalid outline ID"),
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(10000, "Message too long"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

/** Schema for requesting outline generation */
export const generateOutlineSchema = z.object({
  outlineId: z.string().uuid("Invalid outline ID"),
});

export type GenerateOutlineInput = z.infer<typeof generateOutlineSchema>;

/** Schema validating the structure Claude returns for outline generation */
export const generatedOutlineSchema = z.object({
  title: z.string().min(1),
  summary: z.string(),
  chapters: z
    .array(
      z.object({
        chapterTitle: z.string().min(1),
        keyPoints: z.array(z.string()),
        orderIndex: z.number().int().min(0),
      })
    )
    .min(3, "Outline must have at least 3 chapters")
    .max(20, "Outline cannot exceed 20 chapters"),
});

export type ValidatedOutline = z.infer<typeof generatedOutlineSchema>;
