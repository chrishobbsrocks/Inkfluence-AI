import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { bookStatusEnum } from "./enums";
import { users } from "./users";

export const books = pgTable(
  "books",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: bookStatusEnum("status").notNull().default("draft"),
    coverUrl: text("cover_url"),
    wordCount: integer("word_count").notNull().default(0),
    chapterCount: integer("chapter_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("books_user_id_idx").on(table.userId),
    index("books_status_idx").on(table.status),
  ]
);

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
