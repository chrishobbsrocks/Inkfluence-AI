import { z } from "zod";

export const chapterIdSchema = z.string().uuid("Invalid chapter ID");

export const updateChapterContentSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  content: z.string().max(500_000, "Content too long").nullable(),
  wordCount: z.number().int().min(0).default(0),
});

export type UpdateChapterContentInput = z.infer<
  typeof updateChapterContentSchema
>;
