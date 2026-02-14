"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BookTemplate, PreviewChapter } from "@/types/preview";

interface BookPreviewTabProps {
  bookTitle: string;
  chapters: PreviewChapter[];
  template: BookTemplate;
  currentChapterIndex: number;
  onChapterChange: (index: number) => void;
}

export function BookPreviewTab({
  bookTitle,
  chapters,
  template,
  currentChapterIndex,
  onChapterChange,
}: BookPreviewTabProps) {
  const chapter = chapters[currentChapterIndex];

  if (!chapter) {
    return (
      <div className="bg-stone-200/50 rounded-xl p-8 flex justify-center items-center min-h-[420px]">
        <p className="text-sm text-stone-500">No chapters to preview.</p>
      </div>
    );
  }

  const hasPrev = currentChapterIndex > 0;
  const hasNext = currentChapterIndex < chapters.length - 1;

  return (
    <div className="bg-stone-200/50 rounded-xl p-8 flex flex-col items-center min-h-[420px]">
      <div
        className="w-72 bg-white shadow-xl rounded-sm overflow-hidden"
        style={{
          padding: `${template.margins.top}px ${template.margins.right}px ${template.margins.bottom}px ${template.margins.left}px`,
        }}
      >
        {/* Book title section */}
        <div className="text-center mb-10">
          <div
            className="text-xl font-bold leading-tight mb-2"
            style={{
              fontFamily: template.fonts.heading,
              color: template.colors.heading,
            }}
          >
            {bookTitle}
          </div>
          <div className="w-8 h-px bg-stone-300 mx-auto" />
        </div>

        {/* Chapter title */}
        <div
          className="font-semibold mb-2"
          style={{
            fontFamily: template.fonts.heading,
            color: template.colors.heading,
            fontSize: `${template.fontSize + 2}px`,
            marginBottom: `${template.spacing.heading}px`,
          }}
        >
          {chapter.title}
        </div>

        {/* Chapter content */}
        <div
          className="leading-relaxed max-h-[320px] overflow-hidden relative"
          style={{
            fontFamily: template.fonts.body,
            color: template.colors.body,
            fontSize: `${template.fontSize}px`,
          }}
        >
          {chapter.content ? (
            <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
          ) : (
            <p className="text-stone-400 italic text-[10px]">
              No content yet.
            </p>
          )}
          {/* Fade-out gradient for overflow */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>

      {/* Chapter navigation */}
      {chapters.length > 1 && (
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => hasPrev && onChapterChange(currentChapterIndex - 1)}
            disabled={!hasPrev}
            className="p-1 rounded hover:bg-stone-300/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous chapter"
          >
            <ChevronLeft className="w-4 h-4 text-stone-600" />
          </button>
          <span className="text-[10px] text-stone-500">
            Chapter {currentChapterIndex + 1} of {chapters.length}
          </span>
          <button
            onClick={() => hasNext && onChapterChange(currentChapterIndex + 1)}
            disabled={!hasNext}
            className="p-1 rounded hover:bg-stone-300/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next chapter"
          >
            <ChevronRight className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      )}
    </div>
  );
}
