import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const rateLimits = pgTable(
  "rate_limits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    requestCount: integer("request_count").notNull().default(1),
  },
  (table) => [
    uniqueIndex("rate_limits_user_endpoint_window_idx").on(
      table.userId,
      table.endpoint,
      table.windowStart
    ),
    index("rate_limits_user_id_idx").on(table.userId),
  ]
);

export type RateLimit = typeof rateLimits.$inferSelect;
export type NewRateLimit = typeof rateLimits.$inferInsert;
