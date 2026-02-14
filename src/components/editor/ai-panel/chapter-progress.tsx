"use client";

import { Progress } from "@/components/ui/progress";

interface ChapterProgressProps {
  wordCount: number;
  targetWordCount: number;
  progressPercent: number;
}

export function ChapterProgress({
  wordCount,
  targetWordCount,
  progressPercent,
}: ChapterProgressProps) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-stone-600 mb-2">
        Chapter progress
      </div>
      <Progress
        value={progressPercent}
        className="h-1 mb-1.5 bg-stone-200"
      />
      <div className="text-[10px] text-stone-400 mb-5">
        ~{wordCount.toLocaleString()} / {targetWordCount.toLocaleString()}{" "}
        target words
      </div>
    </div>
  );
}
