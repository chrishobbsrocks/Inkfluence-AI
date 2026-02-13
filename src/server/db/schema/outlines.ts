import { pgTable, text, timestamp, uuid, jsonb, index } from "drizzle-orm/pg-core";
import { books } from "./books";

export const outlines = pgTable(
  "outlines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    topic: text("topic").notNull(),
    audience: text("audience"),
    expertiseLevel: text("expertise_level"),
    conversationHistory: jsonb("conversation_history").$type<
      Array<{ role: string; content: string }>
    >(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("outlines_book_id_idx").on(table.bookId)]
);

export type Outline = typeof outlines.$inferSelect;
export type NewOutline = typeof outlines.$inferInsert;
