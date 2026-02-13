"use client";

import { useState } from "react";
import { Sparkles, BookOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { generateOutlineAction } from "@/server/actions/wizard";
import type { GeneratedChapter } from "@/types/wizard";

interface OutlinePreviewProps {
  outlineId: string;
  bookId: string;
  onOutlineAccepted: () => void;
}

interface GeneratedData {
  title: string;
  sections: Array<{
    chapterTitle: string;
    keyPoints: string[];
    orderIndex: number;
  }>;
}

export function OutlinePreview({
  outlineId,
  bookId,
  onOutlineAccepted,
}: OutlinePreviewProps) {
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    const result = await generateOutlineAction({ outlineId });

    if (!result.success) {
      setError(result.error);
      setIsGenerating(false);
      return;
    }

    setGeneratedData({
      title: result.data.sections[0]?.chapterTitle
        ? `Book Outline`
        : "Book Outline",
      sections: result.data.sections.map((s) => ({
        chapterTitle: s.chapterTitle,
        keyPoints: (s.keyPoints as string[]) ?? [],
        orderIndex: s.orderIndex,
      })),
    });
    setIsGenerating(false);
  };

  // Before generation
  if (!generatedData && !isGenerating) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-6 h-6 text-stone-600" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900 font-heading mb-2">
          Ready to generate your outline
        </h3>
        <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto">
          Based on our conversation, I&apos;ll create a structured book outline
          with chapters and key points.
        </p>
        {error && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}
        <Button
          onClick={handleGenerate}
          className="h-10 px-6 bg-stone-900 hover:bg-stone-800 gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Generate Outline
        </Button>
      </div>
    );
  }

  // Loading state
  if (isGenerating) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 text-sm text-stone-500">
            <span className="w-4 h-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
            Generating your outline...
          </span>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white"
            >
              <Skeleton className="w-5 h-4" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Generated outline preview
  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h3 className="text-lg font-semibold text-stone-900 font-heading mb-4">
        Your Book Outline
      </h3>
      <div className="space-y-2 mb-6">
        {generatedData!.sections
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((section, i) => (
            <div
              key={i}
              className="px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-semibold text-stone-400 w-5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-stone-800">
                  {section.chapterTitle}
                </span>
              </div>
              {section.keyPoints.length > 0 && (
                <div className="ml-8 mt-1.5 space-y-0.5">
                  {section.keyPoints.map((point, j) => (
                    <p
                      key={j}
                      className="text-[12px] text-stone-500 leading-relaxed"
                    >
                      {point}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3 justify-center">
        <Button
          onClick={onOutlineAccepted}
          className="h-10 px-6 bg-stone-900 hover:bg-stone-800 gap-2"
        >
          Accept & Continue
        </Button>
        <Button
          variant="outline"
          onClick={handleGenerate}
          className="h-10 px-4 gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
        </Button>
      </div>
    </div>
  );
}
