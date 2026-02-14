import { describe, it, expect } from "vitest";
import {
  estimateTokens,
  truncateConversationHistory,
} from "@/lib/ai/token-counter";
import type { ConversationMessage } from "@/types/wizard";

describe("estimateTokens", () => {
  it("estimates tokens as roughly 1 per 4 characters", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens("hi")).toBe(1);
    expect(estimateTokens("hello")).toBe(2);
    expect(estimateTokens("a".repeat(100))).toBe(25);
  });

  it("rounds up fractional tokens", () => {
    expect(estimateTokens("abc")).toBe(1); // 3/4 = 0.75 -> ceil = 1
    expect(estimateTokens("abcde")).toBe(2); // 5/4 = 1.25 -> ceil = 2
  });
});

describe("truncateConversationHistory", () => {
  function makeMessages(count: number, charsPer: number): ConversationMessage[] {
    return Array.from({ length: count }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: "x".repeat(charsPer),
    }));
  }

  it("returns messages unchanged when within budget", () => {
    const msgs = makeMessages(4, 100); // 4 * 25 tokens = 100
    const result = truncateConversationHistory(msgs, 200);
    expect(result).toEqual(msgs);
  });

  it("returns empty array for empty input", () => {
    expect(truncateConversationHistory([], 100)).toEqual([]);
  });

  it("truncates from the beginning when over budget", () => {
    const msgs = makeMessages(10, 400); // 10 * 100 tokens = 1000
    const result = truncateConversationHistory(msgs, 300);
    // Should keep the last 3 messages (300 tokens budget, 100 per message)
    expect(result.length).toBe(3);
    expect(result[0]).toBe(msgs[7]);
    expect(result[2]).toBe(msgs[9]);
  });

  it("always keeps at least one message even if over budget", () => {
    const msgs: ConversationMessage[] = [
      { role: "user", content: "x".repeat(10000) },
    ];
    const result = truncateConversationHistory(msgs, 10);
    expect(result.length).toBe(1);
  });

  it("uses default budget of 8000 tokens", () => {
    // 8000 tokens = 32000 chars
    const msgs = makeMessages(2, 16000); // 2 * 4000 tokens = 8000 (exactly at budget)
    const result = truncateConversationHistory(msgs);
    expect(result.length).toBe(2);
  });

  it("preserves message order after truncation", () => {
    const msgs: ConversationMessage[] = [
      { role: "user", content: "first" },
      { role: "assistant", content: "second" },
      { role: "user", content: "third" },
      { role: "assistant", content: "fourth" },
    ];
    const result = truncateConversationHistory(msgs, 100);
    for (let i = 1; i < result.length; i++) {
      const prevIdx = msgs.indexOf(result[i - 1]!);
      const currIdx = msgs.indexOf(result[i]!);
      expect(currIdx).toBeGreaterThan(prevIdx);
    }
  });
});
