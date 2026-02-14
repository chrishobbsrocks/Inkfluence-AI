import { describe, it, expect } from "vitest";
import { exportRequestSchema } from "@/lib/validations/export";

describe("exportRequestSchema", () => {
  it("validates a correct request", () => {
    const result = exportRequestSchema.safeParse({
      bookId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      templateId: "modern",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing bookId", () => {
    const result = exportRequestSchema.safeParse({
      templateId: "modern",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid bookId format", () => {
    const result = exportRequestSchema.safeParse({
      bookId: "not-a-uuid",
      templateId: "modern",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing templateId", () => {
    const result = exportRequestSchema.safeParse({
      bookId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty templateId", () => {
    const result = exportRequestSchema.safeParse({
      bookId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      templateId: "",
    });
    expect(result.success).toBe(false);
  });
});
