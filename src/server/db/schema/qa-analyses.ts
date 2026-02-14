import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { books } from "./books";
import type { QAChapterScore, QASuggestion } from "@/types/qa-analysis";

export const qaAnalyses = pgTable(
  "qa_analyses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    overallScore: integer("overall_score").notNull(),
    readability: integer("readability").notNull(),
    consistency: integer("consistency").notNull(),
    structure: integer("structure").notNull(),
    accuracy: integer("accuracy").notNull(),
    qualityLevel: text("quality_level").notNull(),
    summary: text("summary").notNull(),
    chapterScores: jsonb("chapter_scores")
      .$type<QAChapterScore[]>()
      .notNull(),
    suggestions: jsonb("suggestions").$type<QASuggestion[]>().notNull(),
    chapterCount: integer("chapter_count").notNull(),
    wordCount: integer("word_count").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("qa_analyses_book_id_idx").on(table.bookId),
    index("qa_analyses_book_created_idx").on(table.bookId, table.createdAt),
  ]
);

export type QAAnalysisRow = typeof qaAnalyses.$inferSelect;
export type NewQAAnalysisRow = typeof qaAnalyses.$inferInsert;
