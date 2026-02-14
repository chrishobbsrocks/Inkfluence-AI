import { z } from "zod";

export const platformCodeSchema = z.enum(["KDP", "AB", "GP", "KO"]);

export const connectPlatformSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  platformCode: platformCodeSchema,
});

export const updatePlatformStatusSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  platformCode: platformCodeSchema,
  status: z.enum(["draft", "submitted", "published", "rejected"]),
  notes: z.string().max(500).optional(),
});

export const publishRequestSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  platformCode: platformCodeSchema,
});

export type ConnectPlatformInput = z.infer<typeof connectPlatformSchema>;
export type UpdatePlatformStatusInput = z.infer<
  typeof updatePlatformStatusSchema
>;
