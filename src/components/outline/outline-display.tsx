"use client";

import { OutlineChapterItem } from "./outline-chapter-item";
import { AiRecommendationsPanel } from "./ai-recommendations-panel";
import type { GapSuggestion } from "@/types/wizard";

interface OutlineSection {
  id: string;
  chapterTitle: string;
  keyPoints: unknown;
  orderIndex: number;
  aiSuggested: boolean | null;
}

interface OutlineDisplayProps {
  sections: OutlineSection[];
  gaps: GapSuggestion[];
}

export function OutlineDisplay({ sections, gaps }: OutlineDisplayProps) {
  const sortedSections = [...sections].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  return (
    <div
      className="grid gap-5 p-5"
      style={{ gridTemplateColumns: "1fr 280px" }}
    >
      {/* Chapters list */}
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

      {/* AI Recommendations sidebar */}
      <AiRecommendationsPanel gaps={gaps} />
    </div>
  );
}
