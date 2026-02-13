"use client";

import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OutlineChapterItemProps {
  chapterNumber: number;
  chapterTitle: string;
  keyPoints: string[];
  aiSuggested?: boolean;
}

export function OutlineChapterItem({
  chapterNumber,
  chapterTitle,
  keyPoints,
  aiSuggested = false,
}: OutlineChapterItemProps) {
  return (
    <div
      className={`rounded-lg border bg-white px-3.5 py-2.5 ${
        aiSuggested ? "border-amber-200 bg-amber-50/30" : "border-stone-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="w-3.5 h-3.5 text-stone-300 shrink-0 cursor-grab" />
        <span className="text-[10px] font-mono font-semibold text-stone-400 w-5">
          {String(chapterNumber).padStart(2, "0")}
        </span>
        <span className="text-sm font-medium text-stone-800 flex-1">
          {chapterTitle}
        </span>
        {aiSuggested && (
          <Badge
            variant="outline"
            className="text-[9px] border-amber-300 text-amber-600 bg-amber-50"
          >
            AI suggested
          </Badge>
        )}
      </div>
      {keyPoints.length > 0 && (
        <div className="ml-[3.25rem] mt-2 space-y-1 border-l-2 border-stone-100 pl-3">
          {keyPoints.map((point, i) => (
            <p key={i} className="text-[12px] text-stone-500 leading-relaxed">
              {point}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
