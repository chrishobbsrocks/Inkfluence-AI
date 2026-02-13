import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
const mockGetUserByClerkId = vi.fn();
const mockGetBooks = vi.fn();
const mockGetBookById = vi.fn();
const mockCreateBook = vi.fn();
const mockUpdateBook = vi.fn();
const mockSoftDeleteBook = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/server/queries/users", () => ({
  getUserByClerkId: (...args: unknown[]) => mockGetUserByClerkId(...args),
}));

vi.mock("@/server/queries/books", () => ({
  getBooks: (...args: unknown[]) => mockGetBooks(...args),
  getBookById: (...args: unknown[]) => mockGetBookById(...args),
}));

vi.mock("@/server/mutations/books", () => ({
  createBook: (...args: unknown[]) => mockCreateBook(...args),
  updateBook: (...args: unknown[]) => mockUpdateBook(...args),
  softDeleteBook: (...args: unknown[]) => mockSoftDeleteBook(...args),
}));

const mockUser = { id: "user-uuid-123", clerkId: "clerk_123" };
const mockBook = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  userId: "user-uuid-123",
  title: "Test Book",
  description: null,
  status: "draft",
  coverUrl: null,
  wordCount: 0,
  chapterCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
};

describe("GET /api/books", () => {
  let GET: (req: NextRequest) => Promise<Response>;

  beforeEach(async () => {
    vi.resetAllMocks();
    const mod = await import("@/app/api/books/route");
    GET = mod.GET;
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });
    const req = new NextRequest("http://localhost/api/books");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 404 when user not found in DB", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/api/books");
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it("returns paginated books for authenticated user", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockGetBooks.mockResolvedValueOnce({
      books: [mockBook],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const req = new NextRequest("http://localhost/api/books");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.books).toHaveLength(1);
    expect(data.total).toBe(1);
  });

  it("returns 400 for invalid query params", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    const req = new NextRequest("http://localhost/api/books?status=invalid");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/books", () => {
  let POST: (req: NextRequest) => Promise<Response>;

  beforeEach(async () => {
    vi.resetAllMocks();
    const mod = await import("@/app/api/books/route");
    POST = mod.POST;
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });
    const req = new NextRequest("http://localhost/api/books", {
      method: "POST",
      body: JSON.stringify({ title: "Test" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing title", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    const req = new NextRequest("http://localhost/api/books", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 with created book", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockCreateBook.mockResolvedValueOnce({
      success: true,
      data: mockBook,
    });
    const req = new NextRequest("http://localhost/api/books", {
      method: "POST",
      body: JSON.stringify({ title: "Test Book" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Test Book");
  });
});

describe("GET /api/books/[bookId]", () => {
  let GET: (
    req: NextRequest,
    ctx: { params: Promise<{ bookId: string }> }
  ) => Promise<Response>;

  beforeEach(async () => {
    vi.resetAllMocks();
    const mod = await import("@/app/api/books/[bookId]/route");
    GET = mod.GET;
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });
    mockGetUserByClerkId.mockResolvedValueOnce(null);
    const req = new NextRequest(
      `http://localhost/api/books/${mockBook.id}`
    );
    const res = await GET(req, {
      params: Promise.resolve({ bookId: mockBook.id }),
    });
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid UUID", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    const req = new NextRequest("http://localhost/api/books/not-a-uuid");
    const res = await GET(req, {
      params: Promise.resolve({ bookId: "not-a-uuid" }),
    });
    // resolveAuth checks both auth() and getUserByClerkId, so user must be found
    expect(res.status).toBe(400);
  });

  it("returns 404 when book not found", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockGetBookById.mockResolvedValueOnce(null);
    const req = new NextRequest(
      `http://localhost/api/books/${mockBook.id}`
    );
    const res = await GET(req, {
      params: Promise.resolve({ bookId: mockBook.id }),
    });
    expect(res.status).toBe(404);
  });

  it("returns book when found", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockGetBookById.mockResolvedValueOnce(mockBook);
    const req = new NextRequest(
      `http://localhost/api/books/${mockBook.id}`
    );
    const res = await GET(req, {
      params: Promise.resolve({ bookId: mockBook.id }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("Test Book");
  });
});

describe("PATCH /api/books/[bookId]", () => {
  let PATCH: (
    req: NextRequest,
    ctx: { params: Promise<{ bookId: string }> }
  ) => Promise<Response>;

  beforeEach(async () => {
    vi.resetAllMocks();
    const mod = await import("@/app/api/books/[bookId]/route");
    PATCH = mod.PATCH;
  });

  it("returns 422 for invalid status transition", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockUpdateBook.mockResolvedValueOnce({
      success: false,
      error: 'Cannot transition from "draft" to "published"',
      code: "INVALID_STATUS_TRANSITION",
    });
    const req = new NextRequest(
      `http://localhost/api/books/${mockBook.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status: "published" }),
      }
    );
    const res = await PATCH(req, {
      params: Promise.resolve({ bookId: mockBook.id }),
    });
    expect(res.status).toBe(422);
  });

  it("returns 200 with updated book", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockUpdateBook.mockResolvedValueOnce({
      success: true,
      data: { ...mockBook, title: "Updated" },
    });
    const req = new NextRequest(
      `http://localhost/api/books/${mockBook.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated" }),
      }
    );
    const res = await PATCH(req, {
      params: Promise.resolve({ bookId: mockBook.id }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("Updated");
  });
});

describe("DELETE /api/books/[bookId]", () => {
  let DELETE: (
    req: NextRequest,
    ctx: { params: Promise<{ bookId: string }> }
  ) => Promise<Response>;

  beforeEach(async () => {
    vi.resetAllMocks();
    const mod = await import("@/app/api/books/[bookId]/route");
    DELETE = mod.DELETE;
  });

  it("returns 404 when book not found", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockSoftDeleteBook.mockResolvedValueOnce({
      success: false,
      error: "Book not found",
      code: "NOT_FOUND",
    });
    const req = new NextRequest(
      `http://localhost/api/books/${mockBook.id}`,
      { method: "DELETE" }
    );
    const res = await DELETE(req, {
      params: Promise.resolve({ bookId: mockBook.id }),
    });
    expect(res.status).toBe(404);
  });

  it("returns 200 on successful soft delete", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockSoftDeleteBook.mockResolvedValueOnce({
      success: true,
      data: { id: mockBook.id },
    });
    const req = new NextRequest(
      `http://localhost/api/books/${mockBook.id}`,
      { method: "DELETE" }
    );
    const res = await DELETE(req, {
      params: Promise.resolve({ bookId: mockBook.id }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.deleted).toBe(true);
  });
});
