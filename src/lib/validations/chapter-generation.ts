import { z } from "zod";

export const chapterGenerationRequestSchema = z.object({
  chapterId: z.string().uuid("Invalid chapter ID"),
  bookId: z.string().uuid("Invalid book ID"),
  tone: z
    .enum(["professional", "conversational", "academic"])
    .default("professional"),
  expertise: z
    .enum(["beginner", "intermediate", "expert"])
    .default("intermediate"),
});

export type ChapterGenerationInput = z.infer<
  typeof chapterGenerationRequestSchema
>;
