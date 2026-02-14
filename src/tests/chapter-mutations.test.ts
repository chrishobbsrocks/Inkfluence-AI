import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/server/db", () => {
  const mockUpdate = vi.fn();
  const mockSet = vi.fn();
  const mockWhere = vi.fn();
  const mockReturning = vi.fn();

  return {
    db: {
      update: mockUpdate.mockReturnValue({
        set: mockSet.mockReturnValue({
          where: mockWhere.mockReturnValue({
            returning: mockReturning,
          }),
        }),
      }),
      _mocks: { mockUpdate, mockSet, mockWhere, mockReturning },
    },
  };
});

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((...args: unknown[]) => args),
}));

vi.mock("@/server/db/schema", () => ({
  chapters: { id: "chapters.id" },
}));

import { updateChapterContent } from "@/server/mutations/chapters";
import { db } from "@/server/db";

const mocks = (db as unknown as { _mocks: Record<string, ReturnType<typeof vi.fn>> })._mocks;

describe("updateChapterContent", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.mockUpdate!.mockReturnValue({
      set: mocks.mockSet!.mockReturnValue({
        where: mocks.mockWhere!.mockReturnValue({
          returning: mocks.mockReturning!,
        }),
      }),
    });
  });

  it("returns updated chapter on success", async () => {
    const mockChapter = {
      id: "ch-1",
      bookId: "book-1",
      title: "Updated",
      content: "<p>Hello</p>",
      wordCount: 1,
      orderIndex: 0,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mocks.mockReturning!.mockResolvedValue([mockChapter]);

    const result = await updateChapterContent("ch-1", {
      title: "Updated",
      content: "<p>Hello</p>",
      wordCount: 1,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Updated");
    }
  });

  it("returns NOT_FOUND when chapter does not exist", async () => {
    mocks.mockReturning!.mockResolvedValue([]);

    const result = await updateChapterContent("nonexistent", {
      title: "Title",
      content: null,
      wordCount: 0,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });
});
