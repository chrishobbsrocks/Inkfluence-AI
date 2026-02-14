import { z } from "zod";

export const outlineIdSchema = z.string().uuid("Invalid outline ID");

export const saveOutlineSectionsSchema = z.object({
  outlineId: z.string().uuid("Invalid outline ID"),
  sections: z
    .array(
      z.object({
        chapterTitle: z.string().min(1, "Chapter title required").max(255),
        keyPoints: z.array(z.string().max(500)).max(20),
        orderIndex: z.number().int().min(0),
        aiSuggested: z.boolean(),
      })
    )
    .min(1, "At least one chapter required")
    .max(50),
});

export type SaveOutlineSectionsInput = z.infer<typeof saveOutlineSectionsSchema>;
