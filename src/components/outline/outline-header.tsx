"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-shell";
import { convertOutlineToChaptersAction } from "@/server/actions/chapters";

interface OutlineHeaderProps {
  bookTitle: string;
  bookId?: string;
  onAddChapter?: () => void;
}

export function OutlineHeader({
  bookTitle,
  bookId,
  onAddChapter,
}: OutlineHeaderProps) {
  const router = useRouter();
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinueToWriting() {
    if (!bookId) return;
    setIsConverting(true);
    setError(null);

    const result = await convertOutlineToChaptersAction(bookId);
    if (!result.success) {
      setError(result.error);
      setIsConverting(false);
      return;
    }

    router.push(`/books/${bookId}/editor`);
  }

  return (
    <AppHeader title={`Outline \u2014 ${bookTitle}`}>
      <div className="flex items-center gap-2">
        {error && (
          <span className="text-[11px] text-red-600">{error}</span>
        )}
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1">
          <Sparkles className="w-3 h-3" />
          AI Suggestions
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[11px] gap-1"
          onClick={onAddChapter}
        >
          <Plus className="w-3 h-3" />
          Add Chapter
        </Button>
        <Button
          size="sm"
          className="h-7 text-[11px] bg-stone-900 hover:bg-stone-800 gap-1"
          onClick={handleContinueToWriting}
          disabled={isConverting || !bookId}
        >
          {isConverting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              Continue to Writing
              <ArrowRight className="w-3 h-3" />
            </>
          )}
        </Button>
      </div>
    </AppHeader>
  );
}
