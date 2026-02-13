import { describe, it, expect } from "vitest";
import {
  createBookSchema,
  updateBookSchema,
  listBooksParamsSchema,
  bookIdSchema,
} from "@/lib/validations/books";
import {
  isValidTransition,
  getValidNextStatuses,
} from "@/lib/book-status-machine";

describe("createBookSchema", () => {
  it("accepts valid input with title only", () => {
    const result = createBookSchema.safeParse({ title: "My Book" });
    expect(result.success).toBe(true);
  });

  it("accepts input with title and description", () => {
    const result = createBookSchema.safeParse({
      title: "My Book",
      description: "A great book",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createBookSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects title over 255 characters", () => {
    const result = createBookSchema.safeParse({ title: "a".repeat(256) });
    expect(result.success).toBe(false);
  });

  it("rejects missing title", () => {
    const result = createBookSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects description over 2000 characters", () => {
    const result = createBookSchema.safeParse({
      title: "My Book",
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateBookSchema", () => {
  it("accepts partial update with title only", () => {
    const result = updateBookSchema.safeParse({ title: "New Title" });
    expect(result.success).toBe(true);
  });

  it("accepts status update", () => {
    const result = updateBookSchema.safeParse({ status: "writing" });
    expect(result.success).toBe(true);
  });

  it("accepts nullable description", () => {
    const result = updateBookSchema.safeParse({ description: null });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status value", () => {
    const result = updateBookSchema.safeParse({ status: "invalid" });
    expect(result.success).toBe(false);
  });

  it("accepts empty object", () => {
    const result = updateBookSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("listBooksParamsSchema", () => {
  it("applies defaults", () => {
    const result = listBooksParamsSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.sortBy).toBe("updatedAt");
      expect(result.data.sortOrder).toBe("desc");
    }
  });

  it("coerces string numbers to integers", () => {
    const result = listBooksParamsSchema.safeParse({
      page: "2",
      limit: "10",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(10);
    }
  });

  it("rejects page less than 1", () => {
    const result = listBooksParamsSchema.safeParse({ page: "0" });
    expect(result.success).toBe(false);
  });

  it("rejects limit over 100", () => {
    const result = listBooksParamsSchema.safeParse({ limit: "101" });
    expect(result.success).toBe(false);
  });

  it("accepts valid status filter", () => {
    const result = listBooksParamsSchema.safeParse({ status: "draft" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status filter", () => {
    const result = listBooksParamsSchema.safeParse({ status: "invalid" });
    expect(result.success).toBe(false);
  });
});

describe("bookIdSchema", () => {
  it("accepts valid UUID", () => {
    const result = bookIdSchema.safeParse(
      "550e8400-e29b-41d4-a716-446655440000"
    );
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID string", () => {
    const result = bookIdSchema.safeParse("not-a-uuid");
    expect(result.success).toBe(false);
  });

  it("rejects empty string", () => {
    const result = bookIdSchema.safeParse("");
    expect(result.success).toBe(false);
  });
});

describe("book status machine", () => {
  it("allows draft -> writing", () => {
    expect(isValidTransition("draft", "writing")).toBe(true);
  });

  it("allows writing -> review", () => {
    expect(isValidTransition("writing", "review")).toBe(true);
  });

  it("allows writing -> draft (revert)", () => {
    expect(isValidTransition("writing", "draft")).toBe(true);
  });

  it("allows review -> published", () => {
    expect(isValidTransition("review", "published")).toBe(true);
  });

  it("allows review -> draft (revert)", () => {
    expect(isValidTransition("review", "draft")).toBe(true);
  });

  it("allows published -> draft (revert)", () => {
    expect(isValidTransition("published", "draft")).toBe(true);
  });

  it("rejects draft -> review (skip)", () => {
    expect(isValidTransition("draft", "review")).toBe(false);
  });

  it("rejects draft -> published (skip)", () => {
    expect(isValidTransition("draft", "published")).toBe(false);
  });

  it("rejects writing -> published (skip)", () => {
    expect(isValidTransition("writing", "published")).toBe(false);
  });

  it("allows same-status transition (no-op)", () => {
    expect(isValidTransition("draft", "draft")).toBe(true);
    expect(isValidTransition("writing", "writing")).toBe(true);
    expect(isValidTransition("review", "review")).toBe(true);
    expect(isValidTransition("published", "published")).toBe(true);
  });

  it("getValidNextStatuses returns correct options", () => {
    expect(getValidNextStatuses("draft")).toEqual(["writing"]);
    expect(getValidNextStatuses("writing")).toEqual(
      expect.arrayContaining(["review", "draft"])
    );
    expect(getValidNextStatuses("review")).toEqual(
      expect.arrayContaining(["published", "draft"])
    );
    expect(getValidNextStatuses("published")).toEqual(["draft"]);
  });
});
