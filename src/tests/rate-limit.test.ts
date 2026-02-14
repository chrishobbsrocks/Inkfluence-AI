import { describe, it, expect } from "vitest";
import { getCurrentWindowStart, AI_RATE_LIMITS } from "@/server/rate-limit";

describe("getCurrentWindowStart", () => {
  it("returns a date floored to the current hour", () => {
    const result = getCurrentWindowStart();
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("returns the same hour as now", () => {
    const now = new Date();
    const result = getCurrentWindowStart();
    expect(result.getHours()).toBe(now.getHours());
    expect(result.getDate()).toBe(now.getDate());
  });
});

describe("AI_RATE_LIMITS", () => {
  it("has chapter generation limit of 10 per hour", () => {
    expect(AI_RATE_LIMITS.chapterGeneration.maxRequests).toBe(10);
    expect(AI_RATE_LIMITS.chapterGeneration.endpoint).toBe(
      "ai/generate/chapter"
    );
  });

  it("has chat limit of 50 per hour", () => {
    expect(AI_RATE_LIMITS.chat.maxRequests).toBe(50);
    expect(AI_RATE_LIMITS.chat.endpoint).toBe("ai/chat");
  });
});
