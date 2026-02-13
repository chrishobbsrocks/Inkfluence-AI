import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Anthropic client", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("throws when ANTHROPIC_API_KEY is not set", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    delete process.env.ANTHROPIC_API_KEY;

    vi.doMock("@anthropic-ai/sdk", () => ({
      default: vi.fn(),
    }));

    const { getAnthropicClient } = await import("@/lib/ai/client");
    expect(() => getAnthropicClient()).toThrow("ANTHROPIC_API_KEY is not set");
  });

  it("creates client when API key is present", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-test-key");

    const MockAnthropic = vi.fn();
    vi.doMock("@anthropic-ai/sdk", () => ({
      default: MockAnthropic,
    }));

    const { getAnthropicClient } = await import("@/lib/ai/client");
    getAnthropicClient();

    expect(MockAnthropic).toHaveBeenCalledWith({ apiKey: "sk-test-key" });
  });

  it("returns same singleton on subsequent calls", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-test-key");

    const MockAnthropic = vi.fn(function (this: Record<string, unknown>) {
      this.mock = true;
    });
    vi.doMock("@anthropic-ai/sdk", () => ({
      default: MockAnthropic,
    }));

    const { getAnthropicClient } = await import("@/lib/ai/client");
    const first = getAnthropicClient();
    const second = getAnthropicClient();

    expect(first).toBe(second);
    expect(MockAnthropic).toHaveBeenCalledTimes(1);
  });

  it("resetClient allows re-initialization", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-test-key");

    const MockAnthropic = vi.fn(function (this: Record<string, unknown>) {
      this.mock = true;
    });
    vi.doMock("@anthropic-ai/sdk", () => ({
      default: MockAnthropic,
    }));

    const { getAnthropicClient, resetClient } = await import(
      "@/lib/ai/client"
    );

    getAnthropicClient();
    expect(MockAnthropic).toHaveBeenCalledTimes(1);

    resetClient();
    getAnthropicClient();
    expect(MockAnthropic).toHaveBeenCalledTimes(2);
  });
});
