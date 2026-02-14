"use client";

import type { Editor } from "@tiptap/react";
import { EditorToolbar } from "./editor-toolbar";
import { ChapterTitleInput } from "./chapter-title-input";
import { EditorContentArea } from "./editor-content-area";
import { AiWritingPanel } from "./ai-writing-panel";
import type { AiWritingPanelProps } from "./ai-writing-panel";

interface ChapterEditorLayoutProps {
  editor: Editor | null;
  title: string;
  onTitleChange: (title: string) => void;
  aiPanel: AiWritingPanelProps;
}

export function ChapterEditorLayout({
  editor,
  title,
  onTitleChange,
  aiPanel,
}: ChapterEditorLayoutProps) {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Editor pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <EditorToolbar editor={editor} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-8 px-6">
            <ChapterTitleInput title={title} onTitleChange={onTitleChange} />
            <div className="mt-4">
              <EditorContentArea editor={editor} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Writing Assistant panel */}
      <AiWritingPanel {...aiPanel} />
    </div>
  );
}
