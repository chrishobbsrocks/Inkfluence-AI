"use client";

import { useState, useCallback } from "react";
import { PreviewHeader } from "./preview-header";
import { PreviewTabNav } from "./preview-tab-nav";
import { BookPreviewTab } from "./book-preview-tab";
import { CoverDesignTab } from "./cover-design-tab";
import { TableOfContentsTab } from "./table-of-contents-tab";
import { FormatOptionsPanel } from "./format-options-panel";
import { BOOK_TEMPLATES, DEFAULT_TEMPLATE_ID } from "@/lib/templates";
import type { PreviewTab, PreviewChapter } from "@/types/preview";

interface PreviewWrapperProps {
  bookId: string;
  bookTitle: string;
  chapters: PreviewChapter[];
}

export function PreviewWrapper({
  bookId,
  bookTitle,
  chapters,
}: PreviewWrapperProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>("preview");
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>(DEFAULT_TEMPLATE_ID);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);

  const selectedTemplate =
    BOOK_TEMPLATES.find((t) => t.id === selectedTemplateId) ??
    BOOK_TEMPLATES[0]!;

  const handleChapterSelectFromToc = useCallback(
    (index: number) => {
      setCurrentChapterIndex(index);
      setActiveTab("preview");
    },
    []
  );

  return (
    <>
      <PreviewHeader bookId={bookId} />
      <div className="flex-1 bg-stone-50/50 p-5 overflow-y-auto">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "1fr 280px" }}
        >
          {/* Left column: tabs + content */}
          <div>
            <PreviewTabNav activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === "preview" && (
              <BookPreviewTab
                bookTitle={bookTitle}
                chapters={chapters}
                template={selectedTemplate}
                currentChapterIndex={currentChapterIndex}
                onChapterChange={setCurrentChapterIndex}
              />
            )}
            {activeTab === "cover" && (
              <CoverDesignTab bookTitle={bookTitle} />
            )}
            {activeTab === "toc" && (
              <TableOfContentsTab
                bookTitle={bookTitle}
                chapters={chapters}
                onChapterSelect={handleChapterSelectFromToc}
              />
            )}
          </div>

          {/* Right column: format options */}
          <FormatOptionsPanel
            templates={BOOK_TEMPLATES}
            selectedTemplateId={selectedTemplateId}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplateId}
          />
        </div>
      </div>
    </>
  );
}
