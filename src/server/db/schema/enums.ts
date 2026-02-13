import { pgEnum } from "drizzle-orm/pg-core";

export const bookStatusEnum = pgEnum("book_status", [
  "draft",
  "writing",
  "review",
  "published",
]);

export const chapterStatusEnum = pgEnum("chapter_status", [
  "outline",
  "draft",
  "writing",
  "complete",
]);

export const userPlanEnum = pgEnum("user_plan", [
  "free",
  "basic",
  "professional",
  "enterprise",
]);
