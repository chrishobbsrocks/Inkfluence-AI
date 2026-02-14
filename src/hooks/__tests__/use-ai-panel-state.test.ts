import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAiPanelState } from "../use-ai-panel-state";

describe("useAiPanelState", () => {
  it("defaults tone to professional", () => {
    const { result } = renderHook(() =>
      useAiPanelState({ keyPoints: [], editorWordCount: 0 })
    );
    expect(result.current.tone).toBe("professional");
  });

  it("defaults expertise to intermediate", () => {
    const { result } = renderHook(() =>
      useAiPanelState({ keyPoints: [], editorWordCount: 0 })
    );
    expect(result.current.expertise).toBe("intermediate");
  });

  it("updates tone when setTone is called", () => {
    const { result } = renderHook(() =>
      useAiPanelState({ keyPoints: [], editorWordCount: 0 })
    );
    act(() => {
      result.current.setTone("academic");
    });
    expect(result.current.tone).toBe("academic");
  });

  it("updates expertise when setExpertise is called", () => {
    const { result } = renderHook(() =>
      useAiPanelState({ keyPoints: [], editorWordCount: 0 })
    );
    act(() => {
      result.current.setExpertise("expert");
    });
    expect(result.current.expertise).toBe("expert");
  });

  it("derives sections from keyPoints", () => {
    const { result } = renderHook(() =>
      useAiPanelState({
        keyPoints: ["Intro", "Metrics", "Framework"],
        editorWordCount: 0,
      })
    );
    expect(result.current.sections).toHaveLength(3);
    expect(result.current.sections[0]).toEqual({
      text: "Intro",
      status: "active",
    });
    expect(result.current.sections[1]).toEqual({
      text: "Metrics",
      status: "pending",
    });
    expect(result.current.sections[2]).toEqual({
      text: "Framework",
      status: "pending",
    });
  });

  it("marks sections done after incrementing generated count", () => {
    const { result } = renderHook(() =>
      useAiPanelState({
        keyPoints: ["Intro", "Metrics", "Framework"],
        editorWordCount: 0,
      })
    );
    act(() => {
      result.current.incrementGeneratedCount();
    });
    expect(result.current.sections[0]!.status).toBe("done");
    expect(result.current.sections[1]!.status).toBe("active");
    expect(result.current.sections[2]!.status).toBe("pending");
  });

  it("calculates progress percent from word count", () => {
    const { result } = renderHook(() =>
      useAiPanelState({ keyPoints: [], editorWordCount: 1500 })
    );
    expect(result.current.progressPercent).toBe(50);
  });

  it("caps progress at 100 percent", () => {
    const { result } = renderHook(() =>
      useAiPanelState({ keyPoints: [], editorWordCount: 4000 })
    );
    expect(result.current.progressPercent).toBe(100);
  });

  it("returns empty sections when no keyPoints", () => {
    const { result } = renderHook(() =>
      useAiPanelState({ keyPoints: [], editorWordCount: 0 })
    );
    expect(result.current.sections).toEqual([]);
  });

  it("exposes target word count of 3000", () => {
    const { result } = renderHook(() =>
      useAiPanelState({ keyPoints: [], editorWordCount: 0 })
    );
    expect(result.current.targetWordCount).toBe(3000);
  });
});
