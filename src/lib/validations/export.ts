import { z } from "zod";

export const exportRequestSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  templateId: z.string().min(1, "Template ID is required"),
});

export type ExportRequest = z.infer<typeof exportRequestSchema>;
