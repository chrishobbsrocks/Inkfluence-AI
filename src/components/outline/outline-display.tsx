"use client";

import { OutlineChapterItem } from "./outline-chapter-item";

interface OutlineSection {
  id: string;
  chapterTitle: string;
  keyPoints: unknown;
  orderIndex: number;
  aiSuggested: boolean | null;
}

interface OutlineDisplayProps {
  sections: OutlineSection[];
}

export function OutlineDisplay({ sections }: OutlineDisplayProps) {
  const sortedSections = [...sections].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  return (
    <div className="p-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Chapters ({sortedSections.length})
          </p>
        </div>
        {sortedSections.map((section, i) => (
          <OutlineChapterItem
            key={section.id}
            chapterNumber={i + 1}
            chapterTitle={section.chapterTitle}
            keyPoints={(section.keyPoints as string[]) ?? []}
            aiSuggested={section.aiSuggested ?? false}
          />
        ))}
      </div>
    </div>
  );
}
