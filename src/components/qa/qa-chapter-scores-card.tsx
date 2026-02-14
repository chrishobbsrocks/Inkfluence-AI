"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { QAChapterScore } from "@/types/qa-analysis";

interface QAChapterScoresCardProps {
  chapterScores: QAChapterScore[];
  selectedChapterId: string | null;
  onSelectChapter: (chapterId: string | null) => void;
}

function getScoreColorClass(score: number): string {
  if (score >= 80) return "text-stone-700";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

export function QAChapterScoresCard({
  chapterScores,
  selectedChapterId,
  onSelectChapter,
}: QAChapterScoresCardProps) {
  return (
    <Card className="border-stone-200 mb-4">
      <CardContent className="p-4">
        <div className="text-xs font-semibold text-stone-600 mb-3">
          Chapter Scores
        </div>
        {chapterScores.map((ch) => (
          <div
            key={ch.chapterId}
            className="flex items-center gap-3 py-2.5 border-b border-stone-100 last:border-0"
          >
            <span className="text-[10px] font-mono text-stone-400 w-5">
              {String(ch.orderIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-sm text-stone-700 flex-1">
              {ch.chapterTitle}
            </span>
            <span
              className={`text-sm font-bold ${getScoreColorClass(ch.overallScore)}`}
            >
              {ch.overallScore}
            </span>
            <Badge variant="secondary" className="text-[9px]">
              {ch.suggestionCount} suggestion
              {ch.suggestionCount !== 1 ? "s" : ""}
            </Badge>
            <Button
              variant={
                selectedChapterId === ch.chapterId ? "default" : "ghost"
              }
              size="sm"
              className={`h-7 text-[10px] ${selectedChapterId === ch.chapterId ? "bg-stone-900 hover:bg-stone-800" : ""}`}
              onClick={() =>
                onSelectChapter(
                  selectedChapterId === ch.chapterId ? null : ch.chapterId
                )
              }
            >
              {selectedChapterId === ch.chapterId ? "Show All" : "View"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
