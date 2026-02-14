"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChapterEditorHeader } from "./chapter-editor-header";
import { ChapterEditorLayout } from "./chapter-editor-layout";
import { useChapterEditor } from "@/hooks/use-chapter-editor";
import { countWords } from "@/lib/word-count";

interface ChapterInfo {
  id: string;
  title: string;
  content: string | null;
  orderIndex: number;
}

interface ChapterEditorWrapperProps {
  bookId: string;
  currentChapter: ChapterInfo;
  nextChapterId: string | null;
}

export function ChapterEditorWrapper({
  bookId,
  currentChapter,
  nextChapterId,
}: ChapterEditorWrapperProps) {
  const { state, dispatch } = useChapterEditor(
    {
      id: currentChapter.id,
      title: currentChapter.title,
      content: currentChapter.content,
    },
    bookId
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Underline,
      Image,
      Placeholder.configure({
        placeholder: "Start writing your chapter...",
      }),
    ],
    content: currentChapter.content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-stone max-w-none text-[13px] text-stone-600 leading-relaxed focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor: ed }) => {
      dispatch({
        type: "SET_CONTENT",
        content: ed.getHTML(),
        wordCount: countWords(ed.getText()),
      });
    },
  });

  return (
    <TooltipProvider>
      <ChapterEditorHeader
        bookId={bookId}
        chapterNumber={currentChapter.orderIndex + 1}
        title={state.title}
        saveStatus={state.saveStatus}
        lastSavedAt={state.lastSavedAt}
        nextChapterId={nextChapterId}
      />
      <ChapterEditorLayout
        editor={editor}
        title={state.title}
        onTitleChange={(title) => dispatch({ type: "SET_TITLE", title })}
      />
    </TooltipProvider>
  );
}
