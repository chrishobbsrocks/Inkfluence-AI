import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
const mockGetUserByClerkId = vi.fn();
const mockGetBookById = vi.fn();
const mockGenerateBookMetadata = vi.fn();
const mockSaveGeneratedMetadata = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/server/queries/users", () => ({
  getUserByClerkId: (...args: unknown[]) => mockGetUserByClerkId(...args),
}));

vi.mock("@/server/queries/books", () => ({
  getBookById: (...args: unknown[]) => mockGetBookById(...args),
}));

vi.mock("@/lib/ai/metadata-engine", () => ({
  generateBookMetadata: (...args: unknown[]) =>
    mockGenerateBookMetadata(...args),
}));

vi.mock("@/server/mutations/book-metadata", () => ({
  saveGeneratedMetadata: (...args: unknown[]) =>
    mockSaveGeneratedMetadata(...args),
}));

const mockUser = { id: "user-uuid-123", clerkId: "clerk_123" };
const bookId = "550e8400-e29b-41d4-a716-446655440000";
const mockBook = {
  id: bookId,
  userId: "user-uuid-123",
  title: "Test Book",
};
const mockMetadataResult = {
  description: "A compelling book about growth strategies.",
  keywords: ["SaaS", "growth", "startup"],
  category: "Business & Money",
};
const mockSavedMetadata = {
  id: "meta-uuid-123",
  bookId,
  ...mockMetadataResult,
};

describe("POST /api/metadata/generate", () => {
  let POST: (req: NextRequest) => Promise<Response>;

  beforeEach(async () => {
    vi.resetAllMocks();
    const mod = await import("@/app/api/metadata/generate/route");
    POST = mod.POST;
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });
    const req = new NextRequest("http://localhost/api/metadata/generate", {
      method: "POST",
      body: JSON.stringify({ bookId }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 404 when user not found", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/api/metadata/generate", {
      method: "POST",
      body: JSON.stringify({ bookId }),
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid JSON", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    const req = new NextRequest("http://localhost/api/metadata/generate", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "text/plain" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing bookId", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    const req = new NextRequest("http://localhost/api/metadata/generate", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid bookId", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    const req = new NextRequest("http://localhost/api/metadata/generate", {
      method: "POST",
      body: JSON.stringify({ bookId: "not-a-uuid" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when book not found", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockGetBookById.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/api/metadata/generate", {
      method: "POST",
      body: JSON.stringify({ bookId }),
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it("returns 200 with generated metadata on success", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockGetBookById.mockResolvedValueOnce(mockBook);
    mockGenerateBookMetadata.mockResolvedValueOnce(mockMetadataResult);
    mockSaveGeneratedMetadata.mockResolvedValueOnce(mockSavedMetadata);

    const req = new NextRequest("http://localhost/api/metadata/generate", {
      method: "POST",
      body: JSON.stringify({ bookId }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.metadataId).toBe("meta-uuid-123");
    expect(data.description).toBe(mockMetadataResult.description);
    expect(data.keywords).toEqual(mockMetadataResult.keywords);
    expect(data.category).toBe(mockMetadataResult.category);
  });

  it("returns 500 when engine throws", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "clerk_123" });
    mockGetUserByClerkId.mockResolvedValueOnce(mockUser);
    mockGetBookById.mockResolvedValueOnce(mockBook);
    mockGenerateBookMetadata.mockRejectedValueOnce(
      new Error("Claude API error")
    );

    const req = new NextRequest("http://localhost/api/metadata/generate", {
      method: "POST",
      body: JSON.stringify({ bookId }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.error).toBe("Claude API error");
  });
});
