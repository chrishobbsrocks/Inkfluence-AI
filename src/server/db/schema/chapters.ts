import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { chapterStatusEnum } from "./enums";
import { books } from "./books";

export const chapters = pgTable(
  "chapters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content"),
    orderIndex: integer("order_index").notNull().default(0),
    wordCount: integer("word_count").notNull().default(0),
    status: chapterStatusEnum("status").notNull().default("outline"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("chapters_book_id_idx").on(table.bookId),
    index("chapters_order_idx").on(table.bookId, table.orderIndex),
  ]
);

export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;
