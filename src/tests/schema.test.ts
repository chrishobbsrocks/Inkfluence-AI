import { describe, it, expect } from "vitest";
import {
  users,
  books,
  chapters,
  outlines,
  outlineSections,
  bookStatusEnum,
  chapterStatusEnum,
  userPlanEnum,
} from "@/server/db/schema";

describe("Database schema", () => {
  describe("enums", () => {
    it("bookStatusEnum has correct values", () => {
      expect(bookStatusEnum.enumValues).toEqual([
        "draft",
        "writing",
        "review",
        "published",
      ]);
    });

    it("chapterStatusEnum has correct values", () => {
      expect(chapterStatusEnum.enumValues).toEqual([
        "outline",
        "draft",
        "writing",
        "complete",
      ]);
    });

    it("userPlanEnum has correct values", () => {
      expect(userPlanEnum.enumValues).toEqual([
        "free",
        "basic",
        "professional",
        "enterprise",
      ]);
    });
  });

  describe("users table", () => {
    it("has required columns", () => {
      const columns = Object.keys(users);
      expect(columns).toContain("id");
      expect(columns).toContain("clerkId");
      expect(columns).toContain("email");
      expect(columns).toContain("name");
      expect(columns).toContain("plan");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });
  });

  describe("books table", () => {
    it("has required columns", () => {
      const columns = Object.keys(books);
      expect(columns).toContain("id");
      expect(columns).toContain("userId");
      expect(columns).toContain("title");
      expect(columns).toContain("status");
      expect(columns).toContain("wordCount");
      expect(columns).toContain("deletedAt");
    });
  });

  describe("chapters table", () => {
    it("has required columns", () => {
      const columns = Object.keys(chapters);
      expect(columns).toContain("id");
      expect(columns).toContain("bookId");
      expect(columns).toContain("title");
      expect(columns).toContain("content");
      expect(columns).toContain("orderIndex");
      expect(columns).toContain("status");
    });
  });

  describe("outlines table", () => {
    it("has required columns", () => {
      const columns = Object.keys(outlines);
      expect(columns).toContain("id");
      expect(columns).toContain("bookId");
      expect(columns).toContain("topic");
      expect(columns).toContain("conversationHistory");
    });
  });

  describe("outline_sections table", () => {
    it("has required columns", () => {
      const columns = Object.keys(outlineSections);
      expect(columns).toContain("id");
      expect(columns).toContain("outlineId");
      expect(columns).toContain("chapterTitle");
      expect(columns).toContain("keyPoints");
      expect(columns).toContain("aiSuggested");
    });
  });
});
