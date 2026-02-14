"use client";

import { EditorContent, type Editor } from "@tiptap/react";

interface EditorContentAreaProps {
  editor: Editor | null;
}

export function EditorContentArea({ editor }: EditorContentAreaProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <EditorContent
        editor={editor}
        className="prose prose-stone max-w-none text-[13px] text-stone-600 leading-relaxed [&_.tiptap]:outline-none [&_.tiptap]:min-h-[500px] [&_.tiptap]:p-6 [&_.tiptap_p.is-editor-empty:first-child::before]:text-stone-300 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none"
      />
    </div>
  );
}
