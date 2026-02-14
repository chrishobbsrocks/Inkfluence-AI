"use client";

import type { PreviewChapter } from "@/types/preview";

interface TableOfContentsTabProps {
  bookTitle: string;
  chapters: PreviewChapter[];
  onChapterSelect: (index: number) => void;
}

export function TableOfContentsTab({
  bookTitle,
  chapters,
  onChapterSelect,
}: TableOfContentsTabProps) {
  return (
    <div className="bg-stone-200/50 rounded-xl p-8 flex justify-center min-h-[420px]">
      <div
        className="w-72 bg-white shadow-xl rounded-sm p-8"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-lg font-bold text-stone-900 leading-tight mb-1">
            {bookTitle}
          </div>
          <div className="w-8 h-px bg-stone-300 mx-auto mb-3" />
          <div
            className="text-xs text-stone-500 font-semibold tracking-wide uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Table of Contents
          </div>
        </div>

        {/* Chapter list */}
        {chapters.length === 0 ? (
          <p className="text-[10px] text-stone-400 text-center italic">
            No chapters yet.
          </p>
        ) : (
          <ol className="space-y-2.5" style={{ fontFamily: "var(--font-body)" }}>
            {chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <button
                  onClick={() => onChapterSelect(index)}
                  className="w-full flex items-baseline gap-2 text-left group hover:bg-stone-50 rounded px-1.5 py-1 -mx-1.5 transition-colors"
                >
                  <span className="text-[10px] text-stone-400 tabular-nums shrink-0">
                    {index + 1}.
                  </span>
                  <span className="text-[11px] text-stone-700 group-hover:text-stone-900 transition-colors leading-snug">
                    {chapter.title}
                  </span>
                  <span className="flex-1 border-b border-dotted border-stone-200 min-w-4 self-end mb-0.5" />
                  <span className="text-[9px] text-stone-400 tabular-nums shrink-0">
                    {chapter.wordCount > 0
                      ? `${Math.round(chapter.wordCount / 250)}p`
                      : "—"}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
