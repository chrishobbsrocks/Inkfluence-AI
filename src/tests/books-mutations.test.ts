import { describe, it, expect, vi, beforeEach } from "vitest";

const mockReturning = vi.fn();
const mockValues = vi.fn(() => ({ returning: mockReturning }));
const mockInsert = vi.fn(() => ({ values: mockValues }));
const mockSet = vi.fn(() => ({ where: mockWhere, returning: mockReturning }));
const mockUpdate = vi.fn(() => ({ set: mockSet }));
const mockLimit = vi.fn();
const mockWhere = vi.fn(() => ({ limit: mockLimit, returning: mockReturning }));
const mockFrom = vi.fn(() => ({ where: mockWhere }));
const mockSelect = vi.fn(() => ({ from: mockFrom }));

vi.mock("@/server/db", () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(...args),
    insert: (...args: unknown[]) => mockInsert(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
  },
}));

vi.mock("@/server/db/schema", () => {
  const books = {
    id: "id",
    userId: "userId",
    title: "title",
    description: "description",
    status: "status",
    coverUrl: "coverUrl",
    wordCount: "wordCount",
    chapterCount: "chapterCount",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    deletedAt: "deletedAt",
  };
  return { books, users: {} };
});

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((...args: unknown[]) => ({ type: "eq", args })),
  and: vi.fn((...args: unknown[]) => ({ type: "and", args })),
  isNull: vi.fn((...args: unknown[]) => ({ type: "isNull", args })),
}));

import {
  createBook,
  updateBook,
  softDeleteBook,
} from "@/server/mutations/books";

const mockBook = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  userId: "user-123",
  title: "Test Book",
  description: null,
  status: "draft" as const,
  coverUrl: null,
  wordCount: 0,
  chapterCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe("createBook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns success with created book", async () => {
    mockReturning.mockResolvedValueOnce([mockBook]);

    const result = await createBook("user-123", { title: "Test Book" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Test Book");
    }
  });
});

describe("updateBook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns NOT_FOUND when book does not exist", async () => {
    mockLimit.mockResolvedValueOnce([]);

    const result = await updateBook("nonexistent", "user-123", {
      title: "New Title",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("returns INVALID_STATUS_TRANSITION for invalid transition", async () => {
    mockLimit.mockResolvedValueOnce([mockBook]); // book exists with status "draft"

    const result = await updateBook(mockBook.id, "user-123", {
      status: "published",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("INVALID_STATUS_TRANSITION");
    }
  });

  it("returns success for valid update", async () => {
    const updatedBook = { ...mockBook, title: "Updated Title" };
    mockLimit.mockResolvedValueOnce([mockBook]);
    mockReturning.mockResolvedValueOnce([updatedBook]);

    const result = await updateBook(mockBook.id, "user-123", {
      title: "Updated Title",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Updated Title");
    }
  });

  it("allows valid status transition", async () => {
    const updatedBook = { ...mockBook, status: "writing" as const };
    mockLimit.mockResolvedValueOnce([mockBook]);
    mockReturning.mockResolvedValueOnce([updatedBook]);

    const result = await updateBook(mockBook.id, "user-123", {
      status: "writing",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("writing");
    }
  });
});

describe("softDeleteBook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns NOT_FOUND when book does not exist", async () => {
    mockReturning.mockResolvedValueOnce([]);

    const result = await softDeleteBook("nonexistent", "user-123");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("returns success with id on deletion", async () => {
    mockReturning.mockResolvedValueOnce([{ id: mockBook.id }]);

    const result = await softDeleteBook(mockBook.id, "user-123");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe(mockBook.id);
    }
  });
});
