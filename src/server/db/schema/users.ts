import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { userPlanEnum } from "./enums";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    plan: userPlanEnum("plan").notNull().default("free"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("users_clerk_id_idx").on(table.clerkId)]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
