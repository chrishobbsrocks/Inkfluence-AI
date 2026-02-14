import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useOutlineAnalysis } from "../use-outline-analysis";
import type { OutlineAnalysis } from "@/types/outline-analysis";

const mockAnalysis: OutlineAnalysis = {
  suggestions: [
    {
      id: "suggestion-0-123",
      chapterTitle: "Error Handling",
      keyPoints: ["Try/catch", "Custom errors"],
      rationale: "Important topic",
      insertAfterIndex: 2,
      priority: "high",
    },
  ],
  coverage: [
    { area: "Fundamentals", status: "well-covered" },
    { area: "Testing", status: "gap" },
  ],
  overallScore: 72,
  summary: "Good outline.",
};

describe("useOutlineAnalysis", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function mockFetchSuccess(data: OutlineAnalysis = mockAnalysis) {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });
  }

  function mockFetchError(message = "Server error") {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: message }),
    });
  }

  it("starts with loading status", () => {
    mockFetchSuccess();
    const { result } = renderHook(() =>
      useOutlineAnalysis({ outlineId: "test-id", sectionCount: 5 })
    );
    expect(result.current.status).toBe("loading");
  });

  it("fetches analysis on mount", async () => {
    mockFetchSuccess();
    const { result } = renderHook(() =>
      useOutlineAnalysis({ outlineId: "test-id", sectionCount: 5 })
    );

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.analysis).toEqual(mockAnalysis);
    expect(global.fetch).toHaveBeenCalledWith("/api/outline/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outlineId: "test-id" }),
      signal: expect.any(AbortSignal),
    });
  });

  it("sets error state on fetch failure", async () => {
    mockFetchError("Analysis failed");
    const { result } = renderHook(() =>
      useOutlineAnalysis({ outlineId: "test-id", sectionCount: 5 })
    );

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.error).toBe("Analysis failed");
    expect(result.current.analysis).toBeNull();
  });

  it("dismisses a suggestion by id", async () => {
    mockFetchSuccess();
    const { result } = renderHook(() =>
      useOutlineAnalysis({ outlineId: "test-id", sectionCount: 5 })
    );

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.visibleSuggestions).toHaveLength(1);

    act(() => {
      result.current.dismissSuggestion("suggestion-0-123");
    });

    expect(result.current.visibleSuggestions).toHaveLength(0);
    expect(result.current.dismissedIds.has("suggestion-0-123")).toBe(true);
  });

  it("triggers debounced re-analysis when section count changes", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockFetchSuccess();

    const { result, rerender } = renderHook(
      ({ sectionCount }) =>
        useOutlineAnalysis({ outlineId: "test-id", sectionCount }),
      { initialProps: { sectionCount: 5 } }
    );

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Change section count
    rerender({ sectionCount: 6 });

    // Should not fetch immediately
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Advance past debounce timer
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("does not re-analyze if section count stays the same", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockFetchSuccess();

    const { rerender } = renderHook(
      ({ sectionCount }) =>
        useOutlineAnalysis({ outlineId: "test-id", sectionCount }),
      { initialProps: { sectionCount: 5 } }
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    rerender({ sectionCount: 5 });

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("manual refresh triggers immediate re-fetch", async () => {
    mockFetchSuccess();
    const { result } = renderHook(() =>
      useOutlineAnalysis({ outlineId: "test-id", sectionCount: 5 })
    );

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
