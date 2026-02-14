"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoverDesignTabProps {
  bookTitle: string;
}

export function CoverDesignTab({ bookTitle }: CoverDesignTabProps) {
  return (
    <div className="bg-stone-200/50 rounded-xl p-8 flex flex-col items-center min-h-[420px]">
      {/* Cover mockup */}
      <div className="w-56 bg-stone-900 rounded-sm shadow-xl p-8 flex flex-col items-center justify-center min-h-[320px]">
        <div className="w-12 h-px bg-stone-500 mb-6" />
        <div
          className="text-lg font-bold text-white text-center leading-tight mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {bookTitle}
        </div>
        <div className="w-12 h-px bg-stone-500 mt-2" />
      </div>

      {/* Generate button */}
      <div className="mt-6">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[11px] gap-1"
          disabled
        >
          <Sparkles className="w-3 h-3" /> Generate AI Cover
        </Button>
        <p className="text-[10px] text-stone-400 text-center mt-2">
          Coming in a future update
        </p>
      </div>
    </div>
  );
}
