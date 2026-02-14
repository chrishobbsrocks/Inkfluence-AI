import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/server/queries/users", () => ({
  getUserByClerkId: vi.fn(),
}));

vi.mock("@/server/queries/chapters", () => ({
  getChapterById: vi.fn(),
}));

vi.mock("@/server/mutations/chapters", () => ({
  updateChapterContent: vi.fn(),
}));

import { updateChapterContentAction } from "@/server/actions/chapters";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getChapterById } from "@/server/queries/chapters";
import { updateChapterContent } from "@/server/mutations/chapters";

const mockAuth = vi.mocked(auth);
const mockGetUser = vi.mocked(getUserByClerkId);
const mockGetChapter = vi.mocked(getChapterById);
const mockUpdateChapter = vi.mocked(updateChapterContent);

const validChapterId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
const validInput = {
  title: "Introduction",
  content: "<p>Hello world</p>",
  wordCount: 2,
};

const mockUser = {
  id: "user-1",
  name: "Test",
  email: "t@t.com",
  clerkId: "clerk_123",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("updateChapterContentAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({
      userId: null,
    } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);

    const result = await updateChapterContentAction(
      validChapterId,
      validInput
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Unauthorized");
    }
  });

  it("returns error when user not found", async () => {
    mockAuth.mockResolvedValue({
      userId: "clerk_123",
    } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue(null);

    const result = await updateChapterContentAction(
      validChapterId,
      validInput
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("User not found");
    }
  });

  it("rejects invalid chapter ID format", async () => {
    mockAuth.mockResolvedValue({
      userId: "clerk_123",
    } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue(mockUser);

    const result = await updateChapterContentAction("not-a-uuid", validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid chapter ID");
    }
  });

  it("rejects invalid input", async () => {
    mockAuth.mockResolvedValue({
      userId: "clerk_123",
    } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue(mockUser);

    const result = await updateChapterContentAction(validChapterId, {
      title: "",
      content: null,
    });

    expect(result.success).toBe(false);
  });

  it("returns error when chapter not found", async () => {
    mockAuth.mockResolvedValue({
      userId: "clerk_123",
    } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue(mockUser);
    mockGetChapter.mockResolvedValue(null);

    const result = await updateChapterContentAction(
      validChapterId,
      validInput
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Chapter not found");
    }
  });

  it("saves and returns updated chapter on success", async () => {
    mockAuth.mockResolvedValue({
      userId: "clerk_123",
    } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue(mockUser);

    const mockChapter = {
      id: validChapterId,
      bookId: "book-1",
      title: "Introduction",
      content: "<p>Hello world</p>",
      wordCount: 2,
      orderIndex: 0,
      status: "draft" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetChapter.mockResolvedValue(mockChapter);
    mockUpdateChapter.mockResolvedValue({
      success: true,
      data: mockChapter,
    });

    const result = await updateChapterContentAction(
      validChapterId,
      validInput
    );

    expect(result.success).toBe(true);
    expect(mockUpdateChapter).toHaveBeenCalledWith(validChapterId, validInput);
  });
});
