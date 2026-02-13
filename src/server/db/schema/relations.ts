import { relations } from "drizzle-orm";
import { users } from "./users";
import { books } from "./books";
import { chapters } from "./chapters";
import { outlines } from "./outlines";
import { outlineSections } from "./outline-sections";

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

export const outlineSectionsRelations = relations(
  outlineSections,
  ({ one }) => ({
    outline: one(outlines, {
      fields: [outlineSections.outlineId],
      references: [outlines.id],
    }),
  })
);
