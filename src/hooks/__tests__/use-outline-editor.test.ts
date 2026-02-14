import { describe, it, expect } from "vitest";
import {
  outlineEditorReducer,
  type EditorSection,
  type SaveStatus,
} from "../use-outline-editor";

function makeState(sections: EditorSection[]) {
  return {
    sections,
    saveStatus: "idle" as SaveStatus,
    lastError: null,
  };
}

function makeSection(overrides: Partial<EditorSection> = {}): EditorSection {
  return {
    id: `section-${Math.random().toString(36).slice(2, 6)}`,
    chapterTitle: "Test Chapter",
    keyPoints: ["Point 1", "Point 2"],
    orderIndex: 0,
    aiSuggested: false,
    ...overrides,
  };
}

describe("outlineEditorReducer", () => {
  describe("REORDER", () => {
    it("moves a section from one index to another", () => {
      const s1 = makeSection({ id: "s1", chapterTitle: "Ch 1", orderIndex: 0 });
      const s2 = makeSection({ id: "s2", chapterTitle: "Ch 2", orderIndex: 1 });
      const s3 = makeSection({ id: "s3", chapterTitle: "Ch 3", orderIndex: 2 });
      const state = makeState([s1, s2, s3]);

      const result = outlineEditorReducer(state, {
        type: "REORDER",
        fromIndex: 0,
        toIndex: 2,
      });

      expect(result.sections.map((s) => s.id)).toEqual(["s2", "s3", "s1"]);
    });

    it("updates orderIndex values after reorder", () => {
      const s1 = makeSection({ id: "s1", orderIndex: 0 });
      const s2 = makeSection({ id: "s2", orderIndex: 1 });
      const state = makeState([s1, s2]);

      const result = outlineEditorReducer(state, {
        type: "REORDER",
        fromIndex: 1,
        toIndex: 0,
      });

      expect(result.sections[0]!.orderIndex).toBe(0);
      expect(result.sections[1]!.orderIndex).toBe(1);
      expect(result.sections[0]!.id).toBe("s2");
    });

    it("returns same state for out-of-bounds indices", () => {
      const state = makeState([makeSection()]);
      const result = outlineEditorReducer(state, {
        type: "REORDER",
        fromIndex: -1,
        toIndex: 0,
      });
      expect(result).toBe(state);
    });
  });

  describe("ADD_CHAPTER", () => {
    it("adds a new chapter with default title", () => {
      const state = makeState([makeSection({ orderIndex: 0 })]);

      const result = outlineEditorReducer(state, { type: "ADD_CHAPTER" });

      expect(result.sections).toHaveLength(2);
      expect(result.sections[1]!.chapterTitle).toBe("New Chapter");
      expect(result.sections[1]!.keyPoints).toEqual([]);
      expect(result.sections[1]!.aiSuggested).toBe(false);
    });

    it("adds a chapter with custom title", () => {
      const state = makeState([]);

      const result = outlineEditorReducer(state, {
        type: "ADD_CHAPTER",
        title: "My Custom Chapter",
      });

      expect(result.sections[0]!.chapterTitle).toBe("My Custom Chapter");
    });

    it("assigns correct orderIndex", () => {
      const state = makeState([
        makeSection({ orderIndex: 0 }),
        makeSection({ orderIndex: 1 }),
      ]);

      const result = outlineEditorReducer(state, { type: "ADD_CHAPTER" });
      expect(result.sections[2]!.orderIndex).toBe(2);
    });
  });

  describe("REMOVE_CHAPTER", () => {
    it("removes the specified chapter", () => {
      const s1 = makeSection({ id: "s1", orderIndex: 0 });
      const s2 = makeSection({ id: "s2", orderIndex: 1 });
      const state = makeState([s1, s2]);

      const result = outlineEditorReducer(state, {
        type: "REMOVE_CHAPTER",
        sectionId: "s1",
      });

      expect(result.sections).toHaveLength(1);
      expect(result.sections[0]!.id).toBe("s2");
    });

    it("re-indexes remaining sections after removal", () => {
      const s1 = makeSection({ id: "s1", orderIndex: 0 });
      const s2 = makeSection({ id: "s2", orderIndex: 1 });
      const s3 = makeSection({ id: "s3", orderIndex: 2 });
      const state = makeState([s1, s2, s3]);

      const result = outlineEditorReducer(state, {
        type: "REMOVE_CHAPTER",
        sectionId: "s2",
      });

      expect(result.sections.map((s) => s.orderIndex)).toEqual([0, 1]);
    });

    it("does not remove the last chapter", () => {
      const s1 = makeSection({ id: "s1" });
      const state = makeState([s1]);

      const result = outlineEditorReducer(state, {
        type: "REMOVE_CHAPTER",
        sectionId: "s1",
      });

      expect(result.sections).toHaveLength(1);
    });
  });

  describe("UPDATE_TITLE", () => {
    it("updates the title of the specified section", () => {
      const s1 = makeSection({ id: "s1", chapterTitle: "Old Title" });
      const state = makeState([s1]);

      const result = outlineEditorReducer(state, {
        type: "UPDATE_TITLE",
        sectionId: "s1",
        title: "New Title",
      });

      expect(result.sections[0]!.chapterTitle).toBe("New Title");
    });

    it("trims whitespace from title", () => {
      const s1 = makeSection({ id: "s1" });
      const state = makeState([s1]);

      const result = outlineEditorReducer(state, {
        type: "UPDATE_TITLE",
        sectionId: "s1",
        title: "  Trimmed Title  ",
      });

      expect(result.sections[0]!.chapterTitle).toBe("Trimmed Title");
    });

    it("ignores empty title", () => {
      const s1 = makeSection({ id: "s1", chapterTitle: "Keep This" });
      const state = makeState([s1]);

      const result = outlineEditorReducer(state, {
        type: "UPDATE_TITLE",
        sectionId: "s1",
        title: "   ",
      });

      expect(result.sections[0]!.chapterTitle).toBe("Keep This");
    });
  });

  describe("ADD_SUB_SECTION", () => {
    it("adds a sub-section with default text", () => {
      const s1 = makeSection({ id: "s1", keyPoints: ["Existing"] });
      const state = makeState([s1]);

      const result = outlineEditorReducer(state, {
        type: "ADD_SUB_SECTION",
        sectionId: "s1",
      });

      expect(result.sections[0]!.keyPoints).toEqual([
        "Existing",
        "New sub-section",
      ]);
    });

    it("adds a sub-section with custom text", () => {
      const s1 = makeSection({ id: "s1", keyPoints: [] });
      const state = makeState([s1]);

      const result = outlineEditorReducer(state, {
        type: "ADD_SUB_SECTION",
        sectionId: "s1",
        text: "Custom point",
      });

      expect(result.sections[0]!.keyPoints).toEqual(["Custom point"]);
    });
  });

  describe("REMOVE_SUB_SECTION", () => {
    it("removes sub-section at the specified index", () => {
      const s1 = makeSection({
        id: "s1",
        keyPoints: ["A", "B", "C"],
      });
      const state = makeState([s1]);

      const result = outlineEditorReducer(state, {
        type: "REMOVE_SUB_SECTION",
        sectionId: "s1",
        subIndex: 1,
      });

      expect(result.sections[0]!.keyPoints).toEqual(["A", "C"]);
    });
  });

  describe("UPDATE_SUB_SECTION", () => {
    it("updates the text of a sub-section", () => {
      const s1 = makeSection({
        id: "s1",
        keyPoints: ["Old text", "Other"],
      });
      const state = makeState([s1]);

      const result = outlineEditorReducer(state, {
        type: "UPDATE_SUB_SECTION",
        sectionId: "s1",
        subIndex: 0,
        text: "New text",
      });

      expect(result.sections[0]!.keyPoints).toEqual(["New text", "Other"]);
    });
  });

  describe("SET_SAVE_STATUS", () => {
    it("sets saving status", () => {
      const state = makeState([]);
      const result = outlineEditorReducer(state, {
        type: "SET_SAVE_STATUS",
        status: "saving",
      });
      expect(result.saveStatus).toBe("saving");
      expect(result.lastError).toBeNull();
    });

    it("sets error status with message", () => {
      const state = makeState([]);
      const result = outlineEditorReducer(state, {
        type: "SET_SAVE_STATUS",
        status: "error",
        error: "Network failed",
      });
      expect(result.saveStatus).toBe("error");
      expect(result.lastError).toBe("Network failed");
    });
  });
});
