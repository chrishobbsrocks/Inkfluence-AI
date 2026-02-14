import { describe, it, expect } from "vitest";
import {
  chapterEditorReducer,
  type ChapterEditorState,
  type SaveStatus,
} from "../use-chapter-editor";

function makeState(
  overrides: Partial<ChapterEditorState> = {}
): ChapterEditorState {
  return {
    currentChapterId: "ch-1",
    title: "Introduction",
    content: "<p>Hello</p>",
    wordCount: 1,
    saveStatus: "idle" as SaveStatus,
    lastSavedAt: null,
    lastError: null,
    ...overrides,
  };
}

describe("chapterEditorReducer", () => {
  describe("SET_TITLE", () => {
    it("updates the title", () => {
      const state = makeState();
      const result = chapterEditorReducer(state, {
        type: "SET_TITLE",
        title: "New Title",
      });
      expect(result.title).toBe("New Title");
    });
  });

  describe("SET_CONTENT", () => {
    it("updates content and word count", () => {
      const state = makeState();
      const result = chapterEditorReducer(state, {
        type: "SET_CONTENT",
        content: "<p>Hello world</p>",
        wordCount: 2,
      });
      expect(result.content).toBe("<p>Hello world</p>");
      expect(result.wordCount).toBe(2);
    });
  });

  describe("SET_SAVE_STATUS", () => {
    it("sets saving status", () => {
      const state = makeState();
      const result = chapterEditorReducer(state, {
        type: "SET_SAVE_STATUS",
        status: "saving",
      });
      expect(result.saveStatus).toBe("saving");
      expect(result.lastError).toBeNull();
    });

    it("sets error status with message", () => {
      const state = makeState();
      const result = chapterEditorReducer(state, {
        type: "SET_SAVE_STATUS",
        status: "error",
        error: "Network failed",
      });
      expect(result.saveStatus).toBe("error");
      expect(result.lastError).toBe("Network failed");
    });

    it("sets saved status and clears error", () => {
      const state = makeState({ lastError: "previous error" });
      const result = chapterEditorReducer(state, {
        type: "SET_SAVE_STATUS",
        status: "saved",
      });
      expect(result.saveStatus).toBe("saved");
      expect(result.lastError).toBeNull();
    });
  });

  describe("SET_SAVED_AT", () => {
    it("records the timestamp", () => {
      const state = makeState();
      const now = new Date();
      const result = chapterEditorReducer(state, {
        type: "SET_SAVED_AT",
        timestamp: now,
      });
      expect(result.lastSavedAt).toBe(now);
    });
  });

  describe("SWITCH_CHAPTER", () => {
    it("replaces all chapter-specific state", () => {
      const state = makeState({
        saveStatus: "saved",
        lastSavedAt: new Date(),
        wordCount: 500,
      });

      const result = chapterEditorReducer(state, {
        type: "SWITCH_CHAPTER",
        chapterId: "ch-2",
        title: "Chapter Two",
        content: "<p>New content</p>",
      });

      expect(result.currentChapterId).toBe("ch-2");
      expect(result.title).toBe("Chapter Two");
      expect(result.content).toBe("<p>New content</p>");
      expect(result.wordCount).toBe(0);
      expect(result.saveStatus).toBe("idle");
      expect(result.lastSavedAt).toBeNull();
      expect(result.lastError).toBeNull();
    });
  });
});
