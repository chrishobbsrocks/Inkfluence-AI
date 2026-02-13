import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { outlines } from "./outlines";

export const outlineSections = pgTable(
  "outline_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    outlineId: uuid("outline_id")
      .notNull()
      .references(() => outlines.id, { onDelete: "cascade" }),
    chapterTitle: text("chapter_title").notNull(),
    keyPoints: jsonb("key_points").$type<string[]>(),
    orderIndex: integer("order_index").notNull().default(0),
    aiSuggested: boolean("ai_suggested").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("outline_sections_outline_id_idx").on(table.outlineId),
    index("outline_sections_order_idx").on(
      table.outlineId,
      table.orderIndex
    ),
  ]
);

export type OutlineSection = typeof outlineSections.$inferSelect;
export type NewOutlineSection = typeof outlineSections.$inferInsert;
