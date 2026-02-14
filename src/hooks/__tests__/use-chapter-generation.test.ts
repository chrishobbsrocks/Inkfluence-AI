import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useChapterGeneration } from "../use-chapter-generation";

function createMockSSEStream(events: Array<{ type: string; content: string }>) {
  const encoder = new TextEncoder();
  const chunks = events.map((e) => `data: ${JSON.stringify(e)}\n\n`);
  const fullText = chunks.join("");
  const encoded = encoder.encode(fullText);

  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoded);
      controller.close();
    },
  });
}

describe("useChapterGeneration", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with idle status", () => {
    const { result } = renderHook(() =>
      useChapterGeneration({
        chapterId: "ch-1",
        bookId: "book-1",
      })
    );
    expect(result.current.status).toBe("idle");
    expect(result.current.streamedContent).toBe("");
    expect(result.current.error).toBeNull();
  });

  it("transitions to loading then streaming then complete", async () => {
    const stream = createMockSSEStream([
      { type: "text", content: "<p>Hello" },
      { type: "text", content: " world</p>" },
      { type: "metadata", content: JSON.stringify({ wordCount: 2, completedAt: "2026-01-01" }) },
      { type: "done", content: "" },
    ]);

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      body: stream,
    });

    const { result } = renderHook(() =>
      useChapterGeneration({ chapterId: "ch-1", bookId: "book-1" })
    );

    act(() => {
      result.current.generate("professional", "intermediate");
    });

    // Should be loading initially
    expect(result.current.status).toBe("loading");

    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    });

    expect(result.current.streamedContent).toContain("<p>Hello world</p>");
    expect(result.current.wordCount).toBe(2);
  });

  it("sets error state on HTTP failure", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Server error" }),
    });

    const { result } = renderHook(() =>
      useChapterGeneration({ chapterId: "ch-1", bookId: "book-1" })
    );

    act(() => {
      result.current.generate("professional", "intermediate");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.error).toBe("Server error");
  });

  it("sets error state on SSE error event", async () => {
    const stream = createMockSSEStream([
      { type: "text", content: "<p>Partial" },
      { type: "error", content: "Token limit exceeded" },
    ]);

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      body: stream,
    });

    const { result } = renderHook(() =>
      useChapterGeneration({ chapterId: "ch-1", bookId: "book-1" })
    );

    act(() => {
      result.current.generate("professional", "intermediate");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.error).toBe("Token limit exceeded");
  });

  it("sends correct request body", async () => {
    const stream = createMockSSEStream([
      { type: "done", content: "" },
    ]);

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      body: stream,
    });

    const { result } = renderHook(() =>
      useChapterGeneration({ chapterId: "ch-1", bookId: "book-1" })
    );

    act(() => {
      result.current.generate("conversational", "expert");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("complete");
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/ai/generate/chapter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterId: "ch-1",
        bookId: "book-1",
        tone: "conversational",
        expertise: "expert",
      }),
      signal: expect.any(AbortSignal),
    });
  });

  it("aborts generation when abort is called", async () => {
    let resolveStream: () => void;
    const streamPromise = new Promise<void>((resolve) => {
      resolveStream = resolve;
    });

    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      (_url: string, init: RequestInit) => {
        const signal = init.signal as AbortSignal;
        return new Promise((resolve, reject) => {
          signal.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
          streamPromise.then(() => {
            resolve({
              ok: true,
              body: createMockSSEStream([{ type: "done", content: "" }]),
            });
          });
        });
      }
    );

    const { result } = renderHook(() =>
      useChapterGeneration({ chapterId: "ch-1", bookId: "book-1" })
    );

    act(() => {
      result.current.generate("professional", "intermediate");
    });

    expect(result.current.status).toBe("loading");

    act(() => {
      result.current.abort();
    });

    expect(result.current.status).toBe("idle");
    resolveStream!();
  });
});
