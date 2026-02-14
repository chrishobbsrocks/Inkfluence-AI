"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-shell";
import type { SaveStatus } from "@/hooks/use-chapter-editor";

interface ChapterEditorHeaderProps {
  bookId: string;
  chapterNumber: number;
  title: string;
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  nextChapterId: string | null;
}

function useTimeAgo(date: Date | null): string {
  const [display, setDisplay] = useState("");

  const compute = useCallback(() => {
    if (!date) return "";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  }, [date]);

  useEffect(() => {
    setDisplay(compute());
    if (!date) return;
    const interval = setInterval(() => setDisplay(compute()), 10_000);
    return () => clearInterval(interval);
  }, [date, compute]);

  return display;
}

export function ChapterEditorHeader({
  bookId,
  chapterNumber,
  title,
  saveStatus,
  lastSavedAt,
  nextChapterId,
}: ChapterEditorHeaderProps) {
  const router = useRouter();
  const timeAgo = useTimeAgo(lastSavedAt);

  return (
    <AppHeader title={`Chapter ${chapterNumber} \u2014 ${title}`}>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-stone-400">
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && `Auto-saved ${timeAgo}`}
          {saveStatus === "error" && "Save failed"}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[11px] gap-1"
          onClick={() => router.push(`/books/${bookId}/preview`)}
        >
          <Eye className="w-3 h-3" />
          Preview
        </Button>
        {nextChapterId && (
          <Button
            size="sm"
            className="h-7 text-[11px] bg-stone-900 hover:bg-stone-800 gap-1"
            onClick={() =>
              router.push(
                `/books/${bookId}/editor?chapter=${nextChapterId}`
              )
            }
          >
            Next Chapter
            <ArrowRight className="w-3 h-3" />
          </Button>
        )}
      </div>
    </AppHeader>
  );
}
