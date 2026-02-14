"use client";

import { useEffect, useCallback, useRef } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChapterEditorHeader } from "./chapter-editor-header";
import { ChapterEditorLayout } from "./chapter-editor-layout";
import { AiContentBlock } from "./extensions/ai-content-block";
import { useChapterEditor } from "@/hooks/use-chapter-editor";
import { useChapterGeneration } from "@/hooks/use-chapter-generation";
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

  const generation = useChapterGeneration({
    chapterId: currentChapter.id,
    bookId,
  });

  const isGenerating =
    generation.status === "loading" || generation.status === "streaming";

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
      AiContentBlock,
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

  // Track previous streamed content length to avoid unnecessary updates
  const prevContentLengthRef = useRef(0);

  // Stream content into editor during generation (throttled by hook)
  useEffect(() => {
    if (!editor) return;
    if (
      generation.status === "streaming" &&
      generation.streamedContent.length > prevContentLengthRef.current
    ) {
      prevContentLengthRef.current = generation.streamedContent.length;
      const wrappedHtml = `<div data-ai-content="true">${generation.streamedContent}</div>`;
      // false = don't emit onUpdate (prevents auto-save during streaming)
      editor.commands.setContent(wrappedHtml, false);
    }
    if (generation.status === "complete" && generation.streamedContent) {
      prevContentLengthRef.current = 0;
      const wrappedHtml = `<div data-ai-content="true">${generation.streamedContent}</div>`;
      // Triggers onUpdate -> auto-save
      editor.commands.setContent(wrappedHtml);
    }
  }, [editor, generation.status, generation.streamedContent]);

  const handleAiGenerate = useCallback(() => {
    generation.generate("professional", "intermediate");
  }, [generation]);

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
        isGenerating={isGenerating}
        onAiGenerate={handleAiGenerate}
      />
    </TooltipProvider>
  );
}
