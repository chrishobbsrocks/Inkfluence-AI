"use client";

import { useCallback } from "react";
import { OutlineHeader } from "./outline-header";
import { OutlineEditor } from "./outline-editor";
import { AiRecommendationsPanel } from "./ai-recommendations-panel";
import { useOutlineEditor, type EditorSection } from "@/hooks/use-outline-editor";
import { useOutlineAnalysis } from "@/hooks/use-outline-analysis";
import type { OutlineSuggestion } from "@/types/outline-analysis";

interface OutlineEditorWrapperProps {
  bookId: string;
  bookTitle: string;
  outlineId: string;
  initialSections: EditorSection[];
}

export function OutlineEditorWrapper({
  bookId,
  bookTitle,
  outlineId,
  initialSections,
}: OutlineEditorWrapperProps) {
  const { sections, saveStatus, dispatch, addChapter } = useOutlineEditor(
    initialSections,
    outlineId
  );

  const {
    status,
    error,
    visibleSuggestions,
    dismissSuggestion,
    refresh,
    analysis,
  } = useOutlineAnalysis({
    outlineId,
    sectionCount: sections.length,
  });

  const handleAddSuggestion = useCallback(
    (suggestion: OutlineSuggestion) => {
      dispatch({
        type: "ADD_CHAPTER",
        title: suggestion.chapterTitle,
        keyPoints: suggestion.keyPoints,
        insertAfterIndex: suggestion.insertAfterIndex,
      });
      dismissSuggestion(suggestion.id);
    },
    [dispatch, dismissSuggestion]
  );

  return (
    <>
      <OutlineHeader
        bookTitle={bookTitle}
        bookId={bookId}
        outlineId={outlineId}
        onAddChapter={addChapter}
      />
      <div className="flex-1 bg-stone-50/50 overflow-y-auto">
        <div
          className="grid gap-5 p-5"
          style={{ gridTemplateColumns: "1fr 280px" }}
        >
          <OutlineEditor
            sections={sections}
            dispatch={dispatch}
            saveStatus={saveStatus}
          />
          <AiRecommendationsPanel
            suggestions={visibleSuggestions}
            coverage={analysis?.coverage ?? []}
            overallScore={analysis?.overallScore ?? 0}
            summary={analysis?.summary ?? ""}
            status={status}
            error={error}
            onAddSuggestion={handleAddSuggestion}
            onDismiss={dismissSuggestion}
            onRefresh={refresh}
          />
        </div>
      </div>
    </>
  );
}
