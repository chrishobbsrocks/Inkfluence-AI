import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { books } from "./books";
import { publishingPlatformStatusEnum } from "./enums";

export const publishingPlatforms = pgTable(
  "publishing_platforms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    platformName: text("platform_name").notNull(),
    platformCode: text("platform_code").notNull(),
    status: publishingPlatformStatusEnum("status").notNull().default("draft"),
    connected: boolean("connected").notNull().default(false),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("publishing_platforms_book_id_idx").on(table.bookId),
    uniqueIndex("publishing_platforms_book_platform_uniq").on(
      table.bookId,
      table.platformCode
    ),
  ]
);

export type PublishingPlatform = typeof publishingPlatforms.$inferSelect;
export type NewPublishingPlatform = typeof publishingPlatforms.$inferInsert;
