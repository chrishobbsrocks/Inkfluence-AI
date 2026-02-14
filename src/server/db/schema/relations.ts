import { relations } from "drizzle-orm";
import { users } from "./users";
import { books } from "./books";
import { chapters } from "./chapters";
import { outlines } from "./outlines";
import { outlineSections } from "./outline-sections";
import { qaAnalyses } from "./qa-analyses";
import { bookMetadata } from "./book-metadata";

export const usersRelations = relations(users, ({ many }) => ({
  books: many(books),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  user: one(users, {
    fields: [books.userId],
    references: [users.id],
  }),
  chapters: many(chapters),
  outlines: many(outlines),
  qaAnalyses: many(qaAnalyses),
  bookMetadata: one(bookMetadata),
}));

export const chaptersRelations = relations(chapters, ({ one }) => ({
  book: one(books, {
    fields: [chapters.bookId],
    references: [books.id],
  }),
}));

export const outlinesRelations = relations(outlines, ({ one, many }) => ({
  book: one(books, {
    fields: [outlines.bookId],
    references: [books.id],
  }),
  sections: many(outlineSections),
}));

export const qaAnalysesRelations = relations(qaAnalyses, ({ one }) => ({
  book: one(books, {
    fields: [qaAnalyses.bookId],
    references: [books.id],
  }),
}));

export const bookMetadataRelations = relations(bookMetadata, ({ one }) => ({
  book: one(books, {
    fields: [bookMetadata.bookId],
    references: [books.id],
  }),
}));

export const outlineSectionsRelations = relations(
  outlineSections,
  ({ one }) => ({
    outline: one(outlines, {
      fields: [outlineSections.outlineId],
      references: [outlines.id],
    }),
  })
);
