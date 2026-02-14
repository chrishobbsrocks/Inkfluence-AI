import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the dependencies before importing
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/server/queries/users", () => ({
  getUserByClerkId: vi.fn(),
}));

vi.mock("@/server/queries/outlines", () => ({
  getOutlineById: vi.fn(),
}));

vi.mock("@/server/mutations/outlines", () => ({
  saveOutlineSections: vi.fn(),
}));

import { saveOutlineEditorAction } from "@/server/actions/outlines";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getOutlineById } from "@/server/queries/outlines";
import { saveOutlineSections } from "@/server/mutations/outlines";

const mockAuth = vi.mocked(auth);
const mockGetUser = vi.mocked(getUserByClerkId);
const mockGetOutline = vi.mocked(getOutlineById);
const mockSaveOutline = vi.mocked(saveOutlineSections);

const validInput = {
  outlineId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  sections: [
    {
      chapterTitle: "Introduction",
      keyPoints: ["Point 1"],
      orderIndex: 0,
      aiSuggested: false,
    },
  ],
};

describe("saveOutlineEditorAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);

    const result = await saveOutlineEditorAction(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Unauthorized");
    }
  });

  it("returns error when user not found", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_123" } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue(null);

    const result = await saveOutlineEditorAction(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("User not found");
    }
  });

  it("rejects invalid outlineId format", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_123" } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue({ id: "user-1", name: "Test", email: "t@t.com", clerkId: "clerk_123", createdAt: new Date(), updatedAt: new Date() });

    const result = await saveOutlineEditorAction({
      outlineId: "not-a-uuid",
      sections: validInput.sections,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid outline ID");
    }
  });

  it("rejects empty sections array", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_123" } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue({ id: "user-1", name: "Test", email: "t@t.com", clerkId: "clerk_123", createdAt: new Date(), updatedAt: new Date() });

    const result = await saveOutlineEditorAction({
      outlineId: validInput.outlineId,
      sections: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects chapter title exceeding 255 characters", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_123" } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue({ id: "user-1", name: "Test", email: "t@t.com", clerkId: "clerk_123", createdAt: new Date(), updatedAt: new Date() });

    const result = await saveOutlineEditorAction({
      outlineId: validInput.outlineId,
      sections: [
        {
          chapterTitle: "A".repeat(256),
          keyPoints: [],
          orderIndex: 0,
          aiSuggested: false,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("returns error when outline not found", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_123" } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue({ id: "user-1", name: "Test", email: "t@t.com", clerkId: "clerk_123", createdAt: new Date(), updatedAt: new Date() });
    mockGetOutline.mockResolvedValue(null);

    const result = await saveOutlineEditorAction(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Outline not found");
    }
  });

  it("saves sections and returns success", async () => {
    mockAuth.mockResolvedValue({ userId: "clerk_123" } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockGetUser.mockResolvedValue({ id: "user-1", name: "Test", email: "t@t.com", clerkId: "clerk_123", createdAt: new Date(), updatedAt: new Date() });
    mockGetOutline.mockResolvedValue({
      id: validInput.outlineId,
      bookId: "book-1",
      topic: "test",
      audience: null,
      expertiseLevel: null,
      conversationHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockSaveOutline.mockResolvedValue({
      success: true,
      data: [
        {
          id: "section-1",
          outlineId: validInput.outlineId,
          chapterTitle: "Introduction",
          keyPoints: ["Point 1"],
          orderIndex: 0,
          aiSuggested: false,
          createdAt: new Date(),
        },
      ],
    });

    const result = await saveOutlineEditorAction(validInput);

    expect(result.success).toBe(true);
    expect(mockSaveOutline).toHaveBeenCalledWith(
      validInput.outlineId,
      validInput.sections
    );
  });
});
