import { z } from "zod";

export const bookStatusValues = [
  "draft",
  "writing",
  "review",
  "published",
] as const;

export type BookStatus = (typeof bookStatusValues)[number];

export const bookStatusSchema = z.enum(bookStatusValues);

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z
    .string()
    .max(2000, "Description too long")
    .optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

export const updateBookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long")
    .optional(),
  description: z
    .string()
    .max(2000, "Description too long")
    .nullable()
    .optional(),
  status: bookStatusSchema.optional(),
});

export type UpdateBookInput = z.infer<typeof updateBookSchema>;

export const listBooksParamsSchema = z.object({
  status: bookStatusSchema.optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("updatedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListBooksParams = z.infer<typeof listBooksParamsSchema>;

export const bookIdSchema = z.string().uuid("Invalid book ID");
