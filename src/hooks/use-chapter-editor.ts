"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import { updateChapterContentAction } from "@/server/actions/chapters";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface ChapterEditorState {
  currentChapterId: string;
  title: string;
  content: string;
  wordCount: number;
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  lastError: string | null;
}

export type ChapterEditorAction =
  | { type: "SET_TITLE"; title: string }
  | { type: "SET_CONTENT"; content: string; wordCount: number }
  | { type: "SET_SAVE_STATUS"; status: SaveStatus; error?: string }
  | { type: "SET_SAVED_AT"; timestamp: Date }
  | {
      type: "SWITCH_CHAPTER";
      chapterId: string;
      title: string;
      content: string;
    };

export function chapterEditorReducer(
  state: ChapterEditorState,
  action: ChapterEditorAction
): ChapterEditorState {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.title };

    case "SET_CONTENT":
      return {
        ...state,
        content: action.content,
        wordCount: action.wordCount,
      };

    case "SET_SAVE_STATUS":
      return {
        ...state,
        saveStatus: action.status,
        lastError: action.error ?? null,
      };

    case "SET_SAVED_AT":
      return { ...state, lastSavedAt: action.timestamp };

    case "SWITCH_CHAPTER":
      return {
        ...state,
        currentChapterId: action.chapterId,
        title: action.title,
        content: action.content,
        wordCount: 0,
        saveStatus: "idle",
        lastSavedAt: null,
        lastError: null,
      };

    default:
      return state;
  }
}

export function useChapterEditor(
  initialChapter: {
    id: string;
    title: string;
    content: string | null;
  },
  bookId: string
) {
  const [state, dispatch] = useReducer(chapterEditorReducer, {
    currentChapterId: initialChapter.id,
    title: initialChapter.title,
    content: initialChapter.content ?? "",
    wordCount: 0,
    saveStatus: "idle" as SaveStatus,
    lastSavedAt: null,
    lastError: null,
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialRender = useRef(true);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      const current = stateRef.current;
      dispatch({ type: "SET_SAVE_STATUS", status: "saving" });

      const result = await updateChapterContentAction(
        current.currentChapterId,
        {
          title: current.title,
          content: current.content || null,
          wordCount: current.wordCount,
        }
      );

      if (result.success) {
        dispatch({ type: "SET_SAVE_STATUS", status: "saved" });
        dispatch({ type: "SET_SAVED_AT", timestamp: new Date() });
      } else {
        dispatch({
          type: "SET_SAVE_STATUS",
          status: "error",
          error: result.error,
        });
      }
    }, 2000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state.title, state.content]);

  const saveNow = useCallback(async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const current = stateRef.current;
    dispatch({ type: "SET_SAVE_STATUS", status: "saving" });

    const result = await updateChapterContentAction(
      current.currentChapterId,
      {
        title: current.title,
        content: current.content || null,
        wordCount: current.wordCount,
      }
    );

    if (result.success) {
      dispatch({ type: "SET_SAVE_STATUS", status: "saved" });
      dispatch({ type: "SET_SAVED_AT", timestamp: new Date() });
    } else {
      dispatch({
        type: "SET_SAVE_STATUS",
        status: "error",
        error: result.error,
      });
    }
  }, []);

  return { state, dispatch, saveNow };
}
