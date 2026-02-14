import { describe, it, expect } from "vitest";
import {
  platformCodeSchema,
  connectPlatformSchema,
  updatePlatformStatusSchema,
  publishRequestSchema,
} from "@/lib/validations/publishing-platforms";

describe("platformCodeSchema", () => {
  it("accepts KDP", () => {
    expect(platformCodeSchema.safeParse("KDP").success).toBe(true);
  });

  it("accepts AB", () => {
    expect(platformCodeSchema.safeParse("AB").success).toBe(true);
  });

  it("accepts GP", () => {
    expect(platformCodeSchema.safeParse("GP").success).toBe(true);
  });

  it("accepts KO", () => {
    expect(platformCodeSchema.safeParse("KO").success).toBe(true);
  });

  it("rejects unknown platform code", () => {
    expect(platformCodeSchema.safeParse("XX").success).toBe(false);
  });

  it("rejects empty string", () => {
    expect(platformCodeSchema.safeParse("").success).toBe(false);
  });

  it("rejects lowercase codes", () => {
    expect(platformCodeSchema.safeParse("kdp").success).toBe(false);
  });
});

describe("connectPlatformSchema", () => {
  const validInput = {
    bookId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    platformCode: "KDP",
  };

  it("validates correct input", () => {
    expect(connectPlatformSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects invalid bookId", () => {
    expect(
      connectPlatformSchema.safeParse({ ...validInput, bookId: "not-uuid" })
        .success
    ).toBe(false);
  });

  it("rejects missing bookId", () => {
    expect(
      connectPlatformSchema.safeParse({ platformCode: "KDP" }).success
    ).toBe(false);
  });

  it("rejects invalid platformCode", () => {
    expect(
      connectPlatformSchema.safeParse({ ...validInput, platformCode: "XX" })
        .success
    ).toBe(false);
  });
});

describe("updatePlatformStatusSchema", () => {
  const validInput = {
    bookId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    platformCode: "AB",
    status: "submitted",
  };

  it("validates correct input", () => {
    expect(updatePlatformStatusSchema.safeParse(validInput).success).toBe(true);
  });

  it("accepts draft status", () => {
    expect(
      updatePlatformStatusSchema.safeParse({ ...validInput, status: "draft" })
        .success
    ).toBe(true);
  });

  it("accepts published status", () => {
    expect(
      updatePlatformStatusSchema.safeParse({
        ...validInput,
        status: "published",
      }).success
    ).toBe(true);
  });

  it("accepts rejected status", () => {
    expect(
      updatePlatformStatusSchema.safeParse({
        ...validInput,
        status: "rejected",
      }).success
    ).toBe(true);
  });

  it("rejects invalid status", () => {
    expect(
      updatePlatformStatusSchema.safeParse({
        ...validInput,
        status: "pending",
      }).success
    ).toBe(false);
  });

  it("accepts optional notes", () => {
    const result = updatePlatformStatusSchema.safeParse({
      ...validInput,
      notes: "Submission pending review",
    });
    expect(result.success).toBe(true);
  });

  it("rejects notes exceeding 500 characters", () => {
    const result = updatePlatformStatusSchema.safeParse({
      ...validInput,
      notes: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

describe("publishRequestSchema", () => {
  const validInput = {
    bookId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    platformCode: "GP",
  };

  it("validates correct input", () => {
    expect(publishRequestSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects missing bookId", () => {
    expect(
      publishRequestSchema.safeParse({ platformCode: "GP" }).success
    ).toBe(false);
  });

  it("rejects invalid platformCode", () => {
    expect(
      publishRequestSchema.safeParse({ ...validInput, platformCode: "NOPE" })
        .success
    ).toBe(false);
  });
});
