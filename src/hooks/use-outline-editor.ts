"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import { saveOutlineEditorAction } from "@/server/actions/outlines";

export interface EditorSection {
  id: string;
  chapterTitle: string;
  keyPoints: string[];
  orderIndex: number;
  aiSuggested: boolean;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface OutlineEditorState {
  sections: EditorSection[];
  saveStatus: SaveStatus;
  lastError: string | null;
}

export type OutlineEditorAction =
  | { type: "REORDER"; fromIndex: number; toIndex: number }
  | { type: "ADD_CHAPTER"; title?: string; keyPoints?: string[]; insertAfterIndex?: number }
  | { type: "REMOVE_CHAPTER"; sectionId: string }
  | { type: "UPDATE_TITLE"; sectionId: string; title: string }
  | { type: "ADD_SUB_SECTION"; sectionId: string; text?: string }
  | {
      type: "REMOVE_SUB_SECTION";
      sectionId: string;
      subIndex: number;
    }
  | {
      type: "UPDATE_SUB_SECTION";
      sectionId: string;
      subIndex: number;
      text: string;
    }
  | {
      type: "SET_SAVE_STATUS";
      status: SaveStatus;
      error?: string;
    };

function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function reindex(sections: EditorSection[]): EditorSection[] {
  return sections.map((s, i) => ({ ...s, orderIndex: i }));
}

export function outlineEditorReducer(
  state: OutlineEditorState,
  action: OutlineEditorAction
): OutlineEditorState {
  switch (action.type) {
    case "REORDER": {
      const { fromIndex, toIndex } = action;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.sections.length ||
        toIndex >= state.sections.length
      ) {
        return state;
      }
      const next = [...state.sections];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved!);
      return { ...state, sections: reindex(next) };
    }

    case "ADD_CHAPTER": {
      const title = action.title || "New Chapter";
      const newSection: EditorSection = {
        id: generateTempId(),
        chapterTitle: title,
        keyPoints: action.keyPoints ?? [],
        orderIndex: state.sections.length,
        aiSuggested: !!action.keyPoints,
      };

      if (
        action.insertAfterIndex !== undefined &&
        action.insertAfterIndex >= -1 &&
        action.insertAfterIndex < state.sections.length
      ) {
        const insertAt = action.insertAfterIndex + 1;
        const next = [
          ...state.sections.slice(0, insertAt),
          newSection,
          ...state.sections.slice(insertAt),
        ];
        return { ...state, sections: reindex(next) };
      }

      return {
        ...state,
        sections: [...state.sections, newSection],
      };
    }

    case "REMOVE_CHAPTER": {
      if (state.sections.length <= 1) return state;
      const filtered = state.sections.filter(
        (s) => s.id !== action.sectionId
      );
      return { ...state, sections: reindex(filtered) };
    }

    case "UPDATE_TITLE": {
      const trimmed = action.title.trim();
      if (!trimmed) return state;
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? { ...s, chapterTitle: trimmed }
            : s
        ),
      };
    }

    case "ADD_SUB_SECTION": {
      const text = action.text || "New sub-section";
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? { ...s, keyPoints: [...s.keyPoints, text] }
            : s
        ),
      };
    }

    case "REMOVE_SUB_SECTION": {
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                keyPoints: s.keyPoints.filter(
                  (_, i) => i !== action.subIndex
                ),
              }
            : s
        ),
      };
    }

    case "UPDATE_SUB_SECTION": {
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                keyPoints: s.keyPoints.map((kp, i) =>
                  i === action.subIndex ? action.text : kp
                ),
              }
            : s
        ),
      };
    }

    case "SET_SAVE_STATUS": {
      return {
        ...state,
        saveStatus: action.status,
        lastError: action.error ?? null,
      };
    }

    default:
      return state;
  }
}

export function useOutlineEditor(
  initialSections: EditorSection[],
  outlineId: string
) {
  const [state, dispatch] = useReducer(outlineEditorReducer, {
    sections: initialSections,
    saveStatus: "idle" as SaveStatus,
    lastError: null,
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialRender = useRef(true);
  const sectionsRef = useRef(state.sections);
  sectionsRef.current = state.sections;

  useEffect(() => {
    // Skip the initial render (don't save the data we just loaded)
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      dispatch({ type: "SET_SAVE_STATUS", status: "saving" });

      const result = await saveOutlineEditorAction({
        outlineId,
        sections: sectionsRef.current.map((s, i) => ({
          chapterTitle: s.chapterTitle,
          keyPoints: s.keyPoints,
          orderIndex: i,
          aiSuggested: s.aiSuggested,
        })),
      });

      dispatch({
        type: "SET_SAVE_STATUS",
        status: result.success ? "saved" : "error",
        error: result.success ? undefined : result.error,
      });
    }, 500);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state.sections, outlineId]);

  const addChapter = useCallback(() => {
    dispatch({ type: "ADD_CHAPTER" });
  }, []);

  return {
    sections: state.sections,
    saveStatus: state.saveStatus,
    lastError: state.lastError,
    dispatch,
    addChapter,
  };
}
