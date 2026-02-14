"use client";

import { OutlineHeader } from "./outline-header";
import { OutlineEditor } from "./outline-editor";
import { AiRecommendationsPanel } from "./ai-recommendations-panel";
import { useOutlineEditor, type EditorSection } from "@/hooks/use-outline-editor";
import type { GapSuggestion } from "@/types/wizard";

interface OutlineEditorWrapperProps {
  bookId: string;
  bookTitle: string;
  outlineId: string;
  initialSections: EditorSection[];
  gaps: GapSuggestion[];
}

export function OutlineEditorWrapper({
  bookId,
  bookTitle,
  outlineId,
  initialSections,
  gaps,
}: OutlineEditorWrapperProps) {
  const { sections, saveStatus, dispatch, addChapter } = useOutlineEditor(
    initialSections,
    outlineId
  );

  return (
    <>
      <OutlineHeader
        bookTitle={bookTitle}
        bookId={bookId}
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
          <AiRecommendationsPanel gaps={gaps} />
        </div>
      </div>
    </>
  );
}
